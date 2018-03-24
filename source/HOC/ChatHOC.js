import { Component } from 'react';
import io from 'socket.io-client';
import { v4 } from 'uuid';

const ChatHOC = (ComposedComponent, username) =>
    class Expandable extends Component {
        constructor(props) {
            super(props);

            this.state = {
                user: { username },
                messages: [],
            };
            
            this.onSend = this.onSend.bind(this);
        }

        componentWillMount() {
            this.socket = io({ query: `username=${username}` });

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
        }

        onSend(message) {
            this.socket.emit('message', { username: this.state.user.username, message });
        }
        
        render() {
            return <ComposedComponent {...this.state} {...this.props} onSend={this.onSend} />;
        }
    };

export default ChatHOC;