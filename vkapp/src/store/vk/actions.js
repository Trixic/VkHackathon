import * as VKConnect from '@vkontakte/vkui-connect';
import * as types from './actionTypes';

const API_VERSION = '5.80';

export function fetchAccessToken() {
    return async () => {
        let appId = process.env.NODE_ENV === 'production' ? 6747235 : 6747235;
        VKConnect.send('VKWebAppGetAuthToken', {'app_id': appId });
    }
}

export function fetchNotificationStatus(accessToken) {
    return async (dispatch) => {
        apiRequest('apps.isNotificationsAllowed', {}, accessToken, response => {
            dispatch({
                type: types.VK_NOTIFICATION_STATUS_FETCHED,
                notificationStatus: response['is_allowed'],
            });
        }, error => {
            dispatch({type: types.VK_NOTIFICATION_STATUS_FAILED, error: error});
        });
    }
}

export function denyNotifications() {
    return async () => {
        VKConnect.send('VKWebAppDenyNotifications', {});
    }
}

export function allowNotifications() {
    return async () => {
        VKConnect.send('VKWebAppAllowNotifications', {});
    }
}

export function allow() {
    return async () => {
        VKConnect.send('VKWebAppAllowNotifications', {});
    }
}

export function sendMessage(message, userId, accessToken) {
    

    return async (dispatch) => {
        apiRequest('messages.send', {"user_ids": userId, "v":"5.87", "access_token":accessToken, "message":message}, accessToken, error => {
            dispatch({type: types.VK_NOTIFICATION_STATUS_FAILED, error: error});
        });
    }
}

export function initApp() {
    return async (dispatch) => {
        VKConnect.subscribe(e => {
            let vkEvent = e.detail;
            if (!vkEvent) {
                console.error('invalid event', e);
                return;
            }

            let type = vkEvent['type'];
            let data = vkEvent['data'];

            switch (type) {
                case 'VKWebAppAllowNotificationsResult':
                    dispatch({
                        type: types.VK_NOTIFICATION_STATUS_FETCHED,
                        notificationStatus: true,
                    });
                    break;

                case 'VKWebAppDenyNotificationsResult':
                    dispatch({
                        type: types.VK_NOTIFICATION_STATUS_FETCHED,
                        notificationStatus: false,
                    });
                    break;

                case 'VKWebAppAccessTokenReceived':
                    dispatch({
                        type: types.VK_GET_ACCESS_TOKEN_FETCHED,
                        accessToken: data['access_token']
                    });
                    break;

                case 'VKWebAppUpdateInsets':
                    dispatch({
                        type: types.VK_INSETS_FETCHED,
                        insets: data.insets
                    });
                    break;

                 case 'VKWebAppGetUserInfoResult':
                    dispatch({
                        type: types.VK_GET_INFO_FETCHED,
                        fetchedUser: data
                    });
                    break;


                default:
                //nop;
            }
        });

        VKConnect.send('VKWebAppInit', {'no_toolbar': true});
        VKConnect.send('VKWebAppGetUserInfo', {});
    }
}

function apiRequest(method, params = {}, accessToken = '', successCallback = undefined, errorCallback = undefined) {
    let requestId = getNewRequestId();
    if (successCallback !== undefined || errorCallback !== undefined) {
        let clb = function callback(e) {
            let vkEvent = e.detail;
            if (!vkEvent) {
                console.error('invalid event', e);
                return;
            }

            let type = vkEvent['type'];
            let data = vkEvent['data'];

            let found = false;
            if ('VKWebAppCallAPIMethodResult' === type && data['request_id'] === requestId) {
                if (successCallback !== undefined) {
                    successCallback(data['response']);
                }

                found = true;
            } else if ('VKWebAppCallAPIMethodFailed' === type && data['request_id'] === requestId) {
                if (errorCallback !== undefined) {
                    errorCallback(data);
                }

                found = true;
            }

            if (found) {
                VKConnect.unsubscribe(clb);
            }

        };

        VKConnect.subscribe(clb);
    }

    params['access_token'] = accessToken;

    if (params['v'] === undefined) {
        params['v'] = API_VERSION;
    }


    VKConnect.send('VKWebAppCallAPIMethod', {
        'method': method,
        'params': params,
        'request_id': requestId
    });
}

function getNewRequestId() {
    return (Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)).toString();
}
