var mongoose = require('../common/db');

var movie = new mongoose.Schema({
    movieName: String,
    movieImg: String,
    movieVideo: String,
    movieDownload: String,
    movieTime: String,
    movieNumSupport: Number,
    movieNumDownload: Number,
    movieMainPage: Boolean
});

//查找所有
movie.statics.findAll = function (callBack) {
    this.find({}, callBack);
};

var movieModel = mongoose.model('movie', movie);

module.exports = movieModel;