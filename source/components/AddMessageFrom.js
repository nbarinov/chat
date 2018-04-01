import PropTypes from 'prop-types';

import '../styles/ui/input.css';
import '../styles/ui/button.css';
import '../styles/add-message-form.css';
import { setTimeout } from 'timers';

const AddMessageForm = ({ className, onChange = f => f, onSend = f => f }) => {
    let _message;
    let isTyping = false;

    const change = () => {
        if(!isTyping) {
            isTyping = true;
            
            onChange();

            setTimeout(() => isTyping = false, 3000);
        }
    };

    const send = (e) => {
        e.preventDefault();

        onSend(_message.value);

        _message.value = '';
        isTyping = false;
    };

    return (
        <form className={(className) ? className + ' add-message-form' : 'add-message-form'} onSubmit={send}>
            <input ref={input => _message = input}
                className="add-message-form__input input"
                type="text"
                placeholder="Your message..."
                autoComplete="off"
                onChange={change}
                required />
            <button className="add-message-form__button button">Send</button>
        </form>
    );
};

AddMessageForm.propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
    onSend: PropTypes.func,
};

export default AddMessageForm;