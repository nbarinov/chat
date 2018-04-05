import PropTypes from 'prop-types';

import '~/styles/ui/input.css';
import '~/styles/ui/button.css';
import '~/styles/log-in-form.css';

const LogInForm = ({ className, onLogIn = f => f }) => {
    let _username;

    const submit = e => {
        e.preventDefault();

        onLogIn(_username.value);
        _username.value = '';
    };

    return (
        <form className={(className) ? className + ' log-in-form' : 'log-in-form'} onSubmit={submit}>
            <input ref={input => _username = input}
                type="text"
                className="log-in-form__input input"
                placeholder="Your Username"
                required />
            <button className="log-in-form__button button button--primary">Log In</button>
        </form>
    );
};

LogInForm.propTypes = {
    className: PropTypes.string,
    onLogIn: PropTypes.func,
};

export default LogInForm;