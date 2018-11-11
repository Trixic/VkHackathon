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
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
const osname = UI.platform();


class AddressPanel extends Component {

    

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
                    Тип крови
                </UI.PanelHeader>
                <UI.Div style={{textAlign: 'center', marginTop: 10}}>
                    <img width={96} height={96} src={logo} alt="logo"/>
                </UI.Div>
                <UI.Div>
                 
                        <UI.Div>
                            <UI.Select placeholder="Выберите дату">
                            <option value="8">Не важно</option>
                                <option value="1">12 ноября 2018</option>
                                <option value="2">13 ноября 2018</option>
                                <option value="3">14 ноября 2018</option>
                                <option value="4">15 ноября 2018</option>
                                <option value="5">16 ноября 2018</option>
                                <option value="6">17 ноября 2018</option>
                                <option value="7">18 ноября 2018</option>
                                <option value="8">19 ноября 2018</option>
                            </UI.Select>
                        </UI.Div>
                        
                </UI.Div>
                <UI.Div>

                    <UI.Button
                        level='1'
                        size="xl"
                        onClick={this.props.go} data-to="mainPanel"
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

export default connect(mapStateToProps)(AddressPanel);
