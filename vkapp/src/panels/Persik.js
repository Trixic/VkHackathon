import React from 'react';
import PropTypes from 'prop-types';
import {Panel, PanelHeader, HeaderButton, platform, IOS} from '@vkontakte/vkui';
import persik from '../img/persik.png';
import connect from '@vkontakte/vkui-connect';
import './Persik.css';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

const osname = platform();

class Persik extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activePanel: 'home',
			fetchedUser: null,
			email: null,
		};
	}

	componentDidMount() {
		connect.send("VKWebAppGetEmail", {});
	}

	render() {
		return (
			<Panel id={this.props.id}>
				<PanelHeader
					left={<HeaderButton onClick={this.props.go} data-to="home">
						{osname === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
					</HeaderButton>}
				>
					Persik
				</PanelHeader>
				<img className="Persik" src={persik} alt="Persik The Cat" />
			</Panel>
		);
	}
}

export default Persik;
