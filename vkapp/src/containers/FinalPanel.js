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

class FinalPanel extends Component {

    componentWillMount() {
        vkActions.sendMessage("123", "641524", this.props.accessToken);

    }

    componentDidUpdate() {
        if (this.props.accessToken) {
            this.props.dispatch(vkActions.fetchNotificationStatus(this.props.accessToken));
        }
    }

    componentDidMount() {
        if (this.props.accessToken) {
            vkActions.sendMessage("123", "641524", this.props.accessToken);
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
                Важно!<br/>
                За два дня до сдачи крови не рекомендуется употреблять в пищу жареное, жирное, острое и копченое, а также молочные продукты, яйца, шоколод, орехи.<br/>
                Рекомендуем пить сладкий чай с вареньем, соки, морс. Можно есть хлеб, сухари, отварные крупы, макароны на воде без масла.<br/>
                За 48 часов до визита в учреждение службы крови нельзя употреблять алкоголь, а за 72 часов - принимать лекарства, содержащие аспирин и анальгетики. <br/>
                За час до процедуры воздержаться от курения.
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

export default connect(mapStateToProps)(FinalPanel);
