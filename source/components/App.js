import { Component } from 'react';

import LogInForm from './LogInForm';
import Chat from './Chat';

import '~/styles/app.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            auth: false,
            username: null
        };

        this.onLogIn = this.onLogIn.bind(this);
    }

    onLogIn(username) {
        this.setState({
            auth: true,
            username
        });
    }

    render() {
        return (
            <div className="app">
                {this.state.auth ?
                    <Chat className="app__chat" username={this.state.username} /> :
                    <LogInForm className="app__log-in-form" onLogIn={this.onLogIn} />}
            </div>
        );
    }
}

export default App;