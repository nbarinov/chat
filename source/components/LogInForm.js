import PropTypes from 'prop-types';

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
                placeholder="Your Username"
                required />
            <button>Log In</button>
        </form>
    );
};

LogInForm.propTypes = {
    className: PropTypes.string,
    onLogIn: PropTypes.func,
};

export default LogInForm;