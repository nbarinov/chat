import { Component } from 'react';
import io from 'socket.io-client';
import { v4 } from 'uuid';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
        };

        this.send = this.send.bind(this);
    }

    componentDidMount() {
        this.socket = io();

        this.socket.on('chat message', message => {
            this.setState({
                messages: [
                    ...this.state.messages,
                    {
                        id: v4(),
                        message,
                        date: new Date().toString()
                    }
                ]
            });
        });
    }

    send(e) {
        e.preventDefault();

        this.socket.emit('chat message', this.refs.message.value);
        this.refs.message.value = '';
    }

    render() {
        return (
            <div className="app">
                <ul className="messages">
                    {this.state.messages.length === 0
                        ? 'no message'
                        : this.state.messages.map(item => (
                            <li key={item.id}>{item.message}</li>
                        ))}
                </ul>
                <form action="">
                    <input ref="message" autoComplete="off" />
                    <button onClick={this.send}>Send</button>
                </form>
            </div>
        );
    }
}

export default App;