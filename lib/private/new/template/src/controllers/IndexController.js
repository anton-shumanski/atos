import * as models from '../models/db/main';

module.exports = {
    getIndex: function(req, res, next) {
        res.render('index/index');
    },

    getLogin: function(req, res, next) {
        res.render('index/login');
    },

    postLogin: function(req, res, next) {
        res.redirect('profile');
    },

    getLogout: function(req, res){
        req.logout();
        res.redirect('/');
    },

    getProfile:  function(req, res){
        res.render('index/profile', { user: req.user });
    }
}