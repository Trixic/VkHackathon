import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as UI from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import {isWebView} from '@vkontakte/vkui/src/lib/webview';
import * as vkSelectors from '../store/vk/reducer';
import * as vkActions from '../store/vk/actions';
import AboutPanel from './AboutPanel';
import MainPanel from './MainPanel';
import BloodTypePanel from './BloodTypePanel';
import IntroPanel from './IntroPanel';
import AddressPanel from './AddressPanel';

class App extends Component {
    constructor(props) {
		super(props);

		this.state = {
			activePanel: 'introPanel',
            fetchedUser: null,
            
		};
    }
    
    componentWillMount() {
        this.props.dispatch(vkActions.initApp());
        this.props.dispatch(vkActions.fetchAccessToken());
    }

    componentDidMount()
    {
    }

    render() {
        // let activePanel = this.props.pageId === 'about' ? 'aboutPanel' : 'introPanel';

        return (
            <UI.ConfigProvider insets={this.props.insets} isWebView={isWebView}>
                <UI.Root activeView="mainView">
                    <UI.View id="mainView" activePanel={this.state.activePanel}>
                        <IntroPanel id="introPanel" accessToken={this.props.accessToken} go={this.go}/>
                        <BloodTypePanel id="bloodTypePanel" accessToken={this.props.accessToken} go={this.go}/>
                        <AddressPanel id="addressPanel" accessToken={this.props.accessToken} go={this.go}/>
                        <MainPanel id="mainPanel" accessToken={this.props.accessToken} go={this.go}/>
                        <AboutPanel id="aboutPanel"/>
                    </UI.View>
                </UI.Root>
            </UI.ConfigProvider>
        );
    }

    go = (e) => {

		this.setState({ activePanel: e.currentTarget.dataset.to })
	};
}

function mapStateToProps(state) {
    return {
        accessToken: vkSelectors.getAccessToken(state),
        insets: vkSelectors.getInsets(state),
    };
}

export default connect(mapStateToProps)(App);
