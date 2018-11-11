import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as UI from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Icon24Notification from '@vkontakte/icons/dist/24/notification';
import Icon24NotificationDisable from '@vkontakte/icons/dist/24/notification_disable';
import Icon24User from '@vkontakte/icons/dist/24/user';
import logo from '../logo.svg';
import * as vkSelectors from '../store/vk/reducer';
import * as vkActions from '../store/vk/actions';
import Footer from './Footer';
import Logger from './Logger';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
const osname = UI.platform();

class MainPanel extends Component {

 

    componentDidUpdate() {
        if (this.props.accessToken) {
            this.props.dispatch(vkActions.fetchNotificationStatus(this.props.accessToken));
        }
    }

    render() {
        const isProduction = process.env.NODE_ENV === 'production';
        let logger = null;
        if (!isProduction) {
            logger = <Logger/>;
        }

        return (
            <UI.Panel id={this.props.id}>
                <UI.PanelHeader left={<UI.HeaderButton onClick={this.props.go} data-to="bloodTypePanel">
				{osname === UI.IOS ? <Icon28ChevronBack /> : <Icon24Back />}
			</UI.HeaderButton>}>
                    Донор жизни
                </UI.PanelHeader>
                <UI.Div style={{textAlign: 'center', marginTop: 10}}>
                    <img width={96} height={96} src={logo} alt="logo"/>
                </UI.Div>
                <UI.Div style={{textAlign: 'center', marginTop: 10}}>
                Поздравляю! 
    Вы подали заявку на сдачу крови. 
    В ближайшее время наш бот "Донор жизни" вышлет Вам в личные сообщения информационное письмо, где будет подтверждение от ближайшего центра крови о готовности принять Вас. 
    Спасибо, что помогаете спасать жизни людей! 
                </UI.Div>
                <UI.Div>

                    <UI.Button
                        level='1'
                        size="xl"
                        onClick={this.props.go} data-to="finalPanel"
                    >Далее</UI.Button>
                </UI.Div>
                
                {logger}
            </UI.Panel>
        );
    }

    renderNotificationButton() {
        const {notificationStatus} = this.props;
        if (!this.props.accessToken || notificationStatus === undefined) {
            return (<UI.Div>
                <UI.Button
                    before={<Icon24User/>}
                    level='1'
                    size="xl"
                    onClick={this.authorize.bind(this)}
                >Авторизоваться</UI.Button>
            </UI.Div>);
        }

        return (<UI.Div>
            <UI.Button
                before={notificationStatus ? <Icon24NotificationDisable/> : <Icon24Notification/>}
                level={notificationStatus ? '2' : '1'}
                size="xl"
                onClick={this.toggleNotifications.bind(this)}
            >{notificationStatus ? 'Отписаться' : 'Подписаться'}</UI.Button>
        </UI.Div>);
    }


    authorize() {
        this.props.dispatch(vkActions.fetchAccessToken());
    }


    toggleNotifications() {
        const {notificationStatus} = this.props;

        if (notificationStatus) {
            this.props.dispatch(vkActions.denyNotifications());
        } else {
            this.props.dispatch(vkActions.allowNotifications());
        }
    }
}

function mapStateToProps(state) {
    return {
        notificationStatus: vkSelectors.getNotificationStatus(state),
    };
}

export default connect(mapStateToProps)(MainPanel);
