import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as UI from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Icon24User from '@vkontakte/icons/dist/24/user';
import logo from '../logo.svg';
import * as vkSelectors from '../store/vk/reducer';
import * as vkActions from '../store/vk/actions';
import Footer from './Footer';
import Logger from './Logger';

class IntroPanel extends Component {

    

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
                <UI.PanelHeader>
                    Донор жизни
                </UI.PanelHeader>
                <UI.Div style={{textAlign: 'center', marginTop: 10}}>
                    <img width={96} height={96} src={logo} alt="logo"/>
                </UI.Div>
                <UI.Div style={{textAlign: 'center', marginTop: 10}}>
                    Донор жизни - это социальный проект, который помогает легко делать добро
                </UI.Div>
                <UI.Button
                    level='1'
                    size="xl"
                    onClick={this.props.go} data-to="bloodTypePanel"
                >Записаться</UI.Button>
                {logger}
            </UI.Panel>
        );
    }



    authorize() {
        this.props.dispatch(vkActions.fetchAccessToken());
    }
}

function mapStateToProps(state) {
    return {
        notificationStatus: vkSelectors.getNotificationStatus(state),
    };
}

export default connect(mapStateToProps)(IntroPanel);
