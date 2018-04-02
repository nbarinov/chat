import PropTypes from 'prop-types';

import '../styles/ui/input.css';
import '../styles/ui/button.css';
import '../styles/add-message-form.css';

const AddMessageForm = ({ className, onFocus = f => f, onBlur = f => f, onSend = f => f }) => {
    let _message;

    let isTyping = false;
    let messageLenght = 0;
    let timerId = null;

    const focus = () => {
        console.log('вызвался');
        setTimeout(() => {
            timerId = setInterval(() => {
                if (messageLenght === _message.value.length) {
                    isTyping = false;
                    onBlur();
                } else {
                    isTyping = true;
                }

                if(isTyping) onFocus();

                messageLenght = _message.value.length;
            }, 1000);
        }, 500);
    };

    const blur = () => {
        onBlur();

        messageLenght = 0;
        isTyping = false;
        clearInterval(timerId);
    };

    // const change = () => {
    //     if(!isTyping) {
    //         isTyping = true;
            
    //         onChange();

    //         setTimeout(() => isTyping = false, 3000);
    //     }
    // };

    const send = (e) => {
        e.preventDefault();

        console.log(timerId);

        onSend(_message.value);

        onBlur();
        _message.value = '';
        messageLenght = 0;
        isTyping = false;
        clearInterval(timerId);
        _message.focus();
    };

    return (
        <form className={(className) ? className + ' add-message-form' : 'add-message-form'} onSubmit={send}>
            <input ref={input => _message = input}
                className="add-message-form__input input"
                type="text"
                placeholder="Your message..."
                autoComplete="off"
                onFocus={focus}
                onBlur={blur}
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