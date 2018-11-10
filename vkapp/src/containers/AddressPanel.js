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
                <UI.PanelHeader>
                    Тип крови
                </UI.PanelHeader>
                <UI.Div style={{textAlign: 'center', marginTop: 10}}>
                    <img width={96} height={96} src={logo} alt="logo"/>
                </UI.Div>
                <UI.Div>
                    <UI.List >
                        <UI.Cell
                            before={<UI.Avatar size={72} src="https://pp.userapi.com/c841034/v841034569/3b8c1/pt3sOw_qhfg.jpg" />}
                            size="l"
                            description="адрес, 400м"
                            //asideContent={<UI.Icon24MoreHorizontal />}
                            bottomContent={
                                <div style={{ display: 'flex' }}>
                                    <UI.Button size="m">Выбрать</UI.Button>
                                    <UI.Button size="m" level="secondary" style={{ marginLeft: 8 }}>Еее</UI.Button>
                                </div>
                            }
                        >
                            Больница номер 1</UI.Cell>
                    </UI.List>
                </UI.Div>
                <UI.Div>

                    <UI.Button
                        before={<Icon24User />}
                        level='1'
                        size="xl"
                        onClick={this.props.go} data-to="mainPanel"
                    >Подтвердить</UI.Button>
                </UI.Div>

                <Footer/>
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
