import PropTypes from 'prop-types';

const Chat = ({ messages = [], onSend = f => f }) => {
    let _message;

    const send = (e) => {
        e.preventDefault();

        onSend(_message.value);

        _message.value = '';
    };

    return (
        <div className="chat">
            {messages.length === 0 ?
                'no message' :
                messages.map(item => 
                    <li key={item.id}>{(!!item.username ? <b>{item.username}: </b> : '')}{item.message}</li>
                )}
            <form className="chat__add-message-form" onSubmit={send}>
                <input ref={input => _message = input}
                    type="text"
                    autoComplete="off"
                    required />
                <button>Send</button>
            </form>
        </div>
    );
};

Chat.propTypes = {
    message: PropTypes.array,
    onSend: PropTypes.func,
};

export default Chat;