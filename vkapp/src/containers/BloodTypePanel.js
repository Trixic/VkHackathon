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

class BloodTypePanel extends Component {

    

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
                    Тип крови
                </UI.PanelHeader>
                <UI.Div style={{textAlign: 'center', marginTop: 10}}>
                    <img width={96} height={96} src={logo} alt="logo"/>
                </UI.Div>
                <UI.Div>
                    <UI.Select placeholder="Выберите тип крови">
                        <option value="1">1+</option>
                        <option value="2">1-</option>
                        <option value="3">2+</option>
                        <option value="4">2-</option>
                        <option value="5">3+</option>
                        <option value="6">3-</option>
                        <option value="7">4+</option>
                        <option value="8">4-</option>
                        <option value="8">Я не знаю свою группу крови</option>
                    </UI.Select>
                </UI.Div>
                <UI.Div>

                    <UI.Button
                        level='1'
                        size="xl"
                        onClick={this.props.go} data-to="addressPanel"
                    >Подтвердить</UI.Button>
                </UI.Div>

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

export default connect(mapStateToProps)(BloodTypePanel);
