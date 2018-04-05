import { Component } from 'react';
import io from 'socket.io-client';
import { v4 } from 'uuid';
import PropTypes from 'prop-types';

import AddMessageForm from './AddMessageFrom';

import { filterByName } from '~/libs/utils';

import '~/styles/chat.css';

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            status: '',
        };

        this.onSend = this.onSend.bind(this);
        // this.onChange = this.onChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
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

        this.socket.on('user is typing', users => {
            users = filterByName(users, this.props.username);

            if(users.length > 0) {
                let status = '';
                
                if(users.length <= 3) {
                    users.map(({username}) => status += `${username}, `);

                    status = `${status.substr(0, status.length - 2)} is typing...`;
                }

                if(users.length > 3) {
                    status = `${users[0].username}, ${users[1].username}, ${users[2].username}, ${users[3].username}`;
                    status += ` and ${users.length - 4} users is typing...`;
                }

                return this.setState({status});
            }

            this.setState({status: ''});
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
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { messages, status } = this.state;
        
        return nextState.messages.length !== messages.length || nextState.status !== status;
    }

    componentDidUpdate() {
        this.chat.lastChild.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }

    onFocus() {
        this.socket.emit('user started typing', this.props.username);
    }

    onBlur() {
        this.socket.emit('user ended typing', this.props.username);
    }

    onSend(message) {
        this.socket.emit('message', { username: this.props.username, message });
    }

    render() {
        const { className, username } = this.props;
        const { messages, status } = this.state;

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
                <div className="chat__status">{status}</div>
                <AddMessageForm className="chat__add-message-form" onFocus={this.onFocus} onBlur={this.onBlur} onSend={this.onSend} />
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