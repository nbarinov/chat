import PropTypes from 'prop-types';

import '../styles/add-message-form.css';

const AddMessageForm = ({ className, onSend = f => f }) => {
    let _message;

    const send = (e) => {
        e.preventDefault();

        onSend(_message.value);

        _message.value = '';
    };

    return (
        <form className={(className) ? className + ' add-message-form' : 'add-message-form'} onSubmit={send}>
            <input ref={input => _message = input}
                className="add-message-form__input"
                type="text"
                placeholder="Your message..."
                autoComplete="off"
                required />
            <button className="add-message-form__button">Send</button>
        </form>
    );
};

AddMessageForm.propTypes = {
    className: PropTypes.string,
    onSend: PropTypes.func,
};

export default AddMessageForm;