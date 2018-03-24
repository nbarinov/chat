import { Component } from 'react';

import LogInForm from './LogInForm';
import ChatHOC from '../HOC/ChatHOC';
import ChatComponent from './Chat';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            auth: false,
        };

        this.onLogIn = this.onLogIn.bind(this);
    }

    onLogIn(username) {
        this.Chat = ChatHOC(ChatComponent, username);
        this.setState({auth: true});
    }

    render() {
        const Chat = this.Chat;

        return (
            <div className="app">
                {this.state.auth ?
                    <Chat /> :
                    <LogInForm onLogIn={this.onLogIn} />}
            </div>
        );
    }
}

export default App;