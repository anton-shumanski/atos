var loginForm = {
    username: {
        presence: true,
        email: true
    },
    password: {
        presence: true
    }
};

/**
 * This is required for every constraints file if it should works in server and in client side
 */
if(typeof window !== 'undefined'){
    window.loginForm = loginForm;
} else {
    module.exports = loginForm;
}