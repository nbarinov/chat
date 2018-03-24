import { Component } from 'react';
import io from 'socket.io-client';
import { v4 } from 'uuid';
import PropTypes from 'prop-types';

import AddMessageForm from './AddMessageFrom';

import '../styles/chat.css';

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
        };

        this.onSend = this.onSend.bind(this);
        this.chat = null;
    }

    componentWillMount() {
        this.socket = io({ query: `username=${this.props.username}` });

        this.socket.on('user join', username => {
            console.log('[CLIENT] user joined');

            this.setState(prevState => ({
                messages: [
                    ...prevState.messages,
                    {
                        id: v4(),
                        username: null,
                        message: `${username} joined`,
                        time: new Date().toString()
                    }
                ]
            }));
        });

        this.socket.on('message', data => {
            console.log('[CLIENT] new message');

            this.setState(prevState => ({
                messages: [
                    ...prevState.messages,
                    {
                        id: v4(),
                        username: data.username,
                        message: data.message,
                        time: new Date().toString()
                    }
                ]
            }));
        });
        
        this.socket.on('user disconnect', username => {
            console.log('[CLIENT] user disconnected');

            this.setState(prevState => ({
                messages: [
                    ...prevState.messages,
                    {
                        id: v4(),
                        username: null,
                        message: `${username} disconnect`,
                        time: new Date().toString()
                    }
                ]
            }));
        })
    }

    componentDidUpdate() {
        this.chat.lastChild.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }

    onSend(message) {
        this.socket.emit('message', { username: this.props.username, message });
    }

    render() {
        const { className, username } = this.props;
        const { messages } = this.state;

        return (
            <div className={(className) ? className + ' chat' : 'chat'}>
                <ul className="chat__messages" ref={el => this.chat = el}>
                    {messages.length === 0 ?
                        'no message' :
                        messages.map(item =>
                            <li key={item.id} className={(!!item.username) ? 'chat__message' : 'chat__message chat__message--system'}>
                                {(!!item.username ?
                                    <b className={(username === item.username) ?
                                        'chat__message--me' :
                                        'chat__message--friend'}>{item.username}: </b> : '')}{item.message}
                            </li>
                        )}
                </ul>
                <AddMessageForm className="chat__add-message-form" onSend={this.onSend} />
            </div>
        );
    }
}

Chat.propTypes = {
    className: PropTypes.string,
    username: PropTypes.string,
    message: PropTypes.array,
    onSend: PropTypes.func,
};

export default Chat;