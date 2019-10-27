var mongoose = require('../common/db');
//用户数据集
var user = new mongoose.Schema({
    username: String,
    password: String,
    userMail: String,
    userPhone: String,
    userAdmin: Boolean,
    userPower: Number,
    userStop: Boolean
});
//查找所有用户
user.statics.findAll = function (callBack) {
    this.find({}, callBack);
};
//按用户名查找 
user.statics.findByUsername = function (name, callBack) {
    this.find({
        username: name
    }, callBack);
};
//登陆匹配
user.statics.findUserLogin = function (name, password, callBack) {
    this.find({
        username: name,
        password: password,
        userStop: false
    }, callBack);
};

user.statics.findUserPassword = function (name, mail, phone, callBack) {
    this.find({
        username: name,
        userMail: mail,
        userPhone: phone
    }, callBack);
};

var userModel = mongoose.model('user', user);

module.exports = userModel;