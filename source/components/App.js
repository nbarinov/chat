import { Component } from 'react';
import fetch from 'isomorphic-fetch';

import LogInForm from './LogInForm';
import Chat from './Chat';

import '~/styles/app.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            auth: false,
            username: null,
            error: null
        };

        this.onLogIn = this.onLogIn.bind(this);
    }

    onLogIn(data) {
        fetch(`api/find/${encodeURIComponent(data)}`)
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                } else {
                    let error = new Error(response.statusText);
                    error.response = response;

                    throw error;
                }
            })
            .then(result => {
                let auth = true;
                let username = data;
                let error = null;

                if(result) {
                    auth = false;
                    username = null;
                    error = 'The username already exists';
                }

                this.setState({
                    auth,
                    username,
                    error
                });
            })
            .catch(err => {
                this.setState({
                    error: `Bad response from server: ${err}`
                });
            });
    }

    render() {
        const style = {
            height: (window.innerWidth < 525) ? window.innerHeight : '',
        };

        return (
            <div className="app" style={style}>
                {this.state.auth ?
                    <Chat className="app__chat" username={this.state.username} /> :
                    <LogInForm className="app__log-in-form" onLogIn={this.onLogIn} error={this.state.error || ''} />}
            </div>
        );
    }
}

export default App;