"use strict";

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        first_name: DataTypes.STRING,
    }, {
        underscored : true
    });

    return User;
};