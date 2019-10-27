var express = require('express');
var router = express.Router();
var user = require('../models/user');
var movie = require('../models/movie');
var comment = require('../models/comment');

//电影相关操作
router.post('/movieAdd', function (req, res, next) {
    if (!req.body.id) {
        res.json({
            status: 1,
            message: "用户传递错误"
        });
    }
    if (!req.body.username) {
        res.json({
            status: 1,
            message: "user is null"
        });
    }
    if (!req.body.token) {
        res.json({
            status: 1,
            message: "token is null"
        });
    }
    if (!req.body.movieName) {
        res.json({
            status: 1,
            message: "电影名为空"
        });
    }
    if (!req.body.movieImg) {
        res.json({
            status: 1,
            message: "电影图片为空"
        });
    }
    if (!req.body.movieDownload) {
        res.json({
            status: 1,
            message: "电影下载地址为空"
        });
    }
    if (!req.body.movieMainPage) {
        var movieMainPage = false;
    }
    //验证
    var check = checkAdminPower(req.body.username, req.body.token, req.body.id);
    if (check.error == 0) {
        user.findByUsername(req.body.username, function (err, findUser) {
            if (findUser[0].userAdmin && !findUser[0].userStop) {
                var saveMovie = new movie({
                    movieName: req.body.movieName,
                    movieImg: req.body.movieImg,
                    movieVideo: req.body.movieVideo,
                    movieTime: Date.now(),
                    movieNumSupport: 0,
                    movieNumDownload: 0,
                    movieMainPage: movieMainPage,
                });
                saveMovie.save(function (err) {
                    if (err) {
                        res.json({
                            status: 1,
                            message: err
                        });
                    } else {
                        res.json({
                            status: 0,
                            message: "添加成功"
                        });
                    }

                });
            } else {
                res.json({
                    error: 1,
                    message: "用户没有权限或已停用"
                });
            }

        });
    } else {
        res.json({
            status: 1,
            mesasge: check.mesasge
        });
    }
    //todo:
});

router.post('/movieDel', function (req, res, next) {
    if (!req.body.movieId) {
        res.json({
            status: 1,
            message: "用户传递错误"
        });
    }
    if (!req.body.id) {
        res.json({
            status: 1,
            message: "用户传递错误"
        });
    }
    if (!req.body.username) {
        res.json({
            status: 1,
            message: "user is null"
        });
    }
    if (!req.body.token) {
        res.json({
            status: 1,
            message: "token is null"
        });
    }

    var check = checkAdminPower(req.body.username, req.body.token, req.body.id);
    if (check.error == 0) {
        user.findByUsername(req.body.username, function (err, findUser) {
            if (findUser[0].userAdmin && findUser[0].userStop) {
                movie.remove({
                    _id: req.body.movidId
                }, function (err, delMovie) {
                    res.json({
                        status: 0,
                        message: "删除成功",
                        data: delMovie
                    });
                });
            } else {
                res.json({
                    error: 1,
                    message: "用户没有权限"
                });
            }
        });
    } else {
        res.json({
            status: 1,
            mesage: check.mesage
        });
    }
});

router.post('/movieUpdate', function (req, res, next) {
    if (!req.body.movieId) {
        res.json({
            status: 1,
            message: "用户传递错误"
        });
    }
    if (!req.body.id) {
        res.json({
            status: 1,
            message: "用户传递错误"
        });
    }
    if (!req.body.username) {
        res.json({
            status: 1,
            message: "user is null"
        });
    }
    if (!req.body.token) {
        res.json({
            status: 1,
            message: "token is null"
        });
    }
    var saveData = req.body.movieInfo;
    var check = checkAdminPower(req.body.username, req.body.token, req.body.id);
    if (check.error == 0) {
        user.findByUsername(req.body.username, function (err, findUser) {
            if (findUser[0].userAdmin && findUser[0].userStop) {
                movie.update({
                        _id: req.body.movidId
                    }, saveData,
                    function (err, updateMovie) {
                        res.json({
                            status: 0,
                            message: "更新成功",
                            data: updateMovie
                        });
                    });
            } else {
                res.json({
                    error: 1,
                    message: "用户没有权限"
                });
            }
        });
    } else {
        res.json({
            status: 1,
            mesage: check.mesage
        });
    }
});

router.get('/movie', function (req, res, next) {
    movie.findAll(function (err, allMovie) {
        res.json({
            status: 0,
            message: "获取成功",
            data: allMovie
        });
    });
});

router.get('/commentsList', function (req, res, next) {
    comment.findAll(function (err, allComment) {
        res.json({
            status: 0,
            message: "获取成功",
            data: allComment
        });
    });
});

router.post('checkComment', function (req, res, next) {
    if (!req.body.commentId) {
        res.json({
            status: 1,
            message: "评论ID没有"
        });
    }
    if (!req.body.id) {
        res.json({
            status: 1,
            message: "用户传递错误"
        });
    }
    if (!req.body.username) {
        res.json({
            status: 1,
            message: "user is null"
        });
    }
    if (!req.body.token) {
        res.json({
            status: 1,
            message: "token is null"
        });
    }

    var check = checkAdminPower(req.body.username, req.body.token, req.body.id);
    if (check.error == 0) {
        user.findByUsername(req.body.username, function (err, findUser) {
            if (findUser[0].userAdmin && findUser[0].userStop) {
                comment.update({
                        _id: req.body.commentId
                    }, {
                        check: true
                    },
                    function (err, updateComment) {
                        res.json({
                            status: 0,
                            message: "更新成功",
                            data: updateComment
                        });
                    });
            } else {
                res.json({
                    error: 1,
                    message: "用户没有权限"
                });
            }
        });
    } else {
        res.json({
            status: 1,
            mesage: check.mesage
        });
    }
});

router.post('/delComment', function (req, res, next) {
    if (!req.body.commentId) {
        res.json({
            status: 1,
            message: "ID传递错误"
        });
    }
    if (!req.body.id) {
        res.json({
            status: 1,
            message: "用户传递错误"
        });
    }
    if (!req.body.username) {
        res.json({
            status: 1,
            message: "user is null"
        });
    }
    if (!req.body.token) {
        res.json({
            status: 1,
            message: "token is null"
        });
    }

    var check = checkAdminPower(req.body.username, req.body.token, req.body.id);
    if (check.error == 0) {
        user.findByUsername(req.body.username, function (err, findUser) {
            if (findUser[0].userAdmin && findUser[0].userStop) {
                comment.remove({
                    _id: req.body.commentId
                }, function (err, delComment) {
                    res.json({
                        status: 0,
                        message: "删除成功",
                        data: delComment
                    });
                });
            } else {
                res.json({
                    error: 1,
                    message: "用户没有权限"
                });
            }
        });
    } else {
        res.json({
            status: 1,
            mesage: check.mesage
        });
    }
});

router.post('stopUser', function (req, res, next) {
    if (!req.body.userId) {
        res.json({
            status: 1,
            message: "ID没有"
        });
    }
    if (!req.body.id) {
        res.json({
            status: 1,
            message: "用户传递错误"
        });
    }
    if (!req.body.username) {
        res.json({
            status: 1,
            message: "user is null"
        });
    }
    if (!req.body.token) {
        res.json({
            status: 1,
            message: "token is null"
        });
    }

    var check = checkAdminPower(req.body.username, req.body.token, req.body.id);
    if (check.error == 0) {
        user.findByUsername(req.body.username, function (err, findUser) {
            if (findUser[0].userAdmin && findUser[0].userStop) {
                user.update({
                        _id: req.body.userId
                    }, {
                        userStop: true
                    },
                    function (err, updateUser) {
                        res.json({
                            status: 0,
                            message: "用户风停成功",
                            data: updateUser
                        });
                    });
            } else {
                res.json({
                    error: 1,
                    message: "用户没有权限"
                });
            }
        });
    } else {
        res.json({
            status: 1,
            mesage: check.mesage
        });
    }
});

router.post('changUser', function (req, res, next) {
    if (!req.body.userId) {
        res.json({
            status: 1,
            message: "ID没有"
        });
    }
    if (!req.body.id) {
        res.json({
            status: 1,
            message: "用户传递错误"
        });
    }
    if (!req.body.username) {
        res.json({
            status: 1,
            message: "user is null"
        });
    }
    if (!req.body.token) {
        res.json({
            status: 1,
            message: "token is null"
        });
    }
    if (!req.body.password) {
        res.json({
            status: 1,
            message: "password is null"
        });
    }
    if (!req.body.newPassword) {
        res.json({
            status: 1,
            message: "newPassword is null"
        });
    }

    var check = checkAdminPower(req.body.username, req.body.token, req.body.id);
    if (check.error == 0) {
        user.findByUsername(req.body.username, function (err, findUser) {
            if (findUser[0].userAdmin && findUser[0].userStop) {
                user.update({
                        _id: req.body.userId
                    }, {
                        password: req.body.newPassword
                    },
                    function (err, updateUser) {
                        res.json({
                            status: 0,
                            message: "修改成功",
                            data: updateUser
                        });
                    });
            } else {
                res.json({
                    error: 1,
                    message: "用户没有权限"
                });
            }
        });
    } else {
        res.json({
            status: 1,
            mesage: check.mesage
        });
    }
});

router.post('showUser', function (req, res, next) {
    if (!req.body.userId) {
        res.json({
            status: 1,
            message: "ID没有"
        });
    }
    if (!req.body.id) {
        res.json({
            status: 1,
            message: "用户传递错误"
        });
    }
    if (!req.body.token) {
        res.json({
            status: 1,
            message: "token is null"
        });
    }

    var check = checkAdminPower(req.body.username, req.body.token, req.body.id);
    if (check.error == 0) {
        user.findByUsername(req.body.username, function (err, findUser) {
            if (findUser[0].userAdmin && findUser[0].userStop) {
                user.findAll(
                    function (err, allUser) {
                        res.json({
                            status: 0,
                            message: "获取成功",
                            data: allUser
                        });
                    });
            } else {
                res.json({
                    error: 1,
                    message: "用户没有权限"
                });
            }
        });
    } else {
        res.json({
            status: 1,
            mesage: check.mesage
        });
    }
});

router.post('powerUpdate', function (req, res, next) {
    if (!req.body.userId) {
        res.json({
            status: 1,
            message: "ID没有"
        });
    }
    if (!req.body.id) {
        res.json({
            status: 1,
            message: "用户传递错误"
        });
    }
    if (!req.body.token) {
        res.json({
            status: 1,
            message: "token is null"
        });
    }

    var check = checkAdminPower(req.body.username, req.body.token, req.body.id);
    if (check.error == 0) {
        user.findByUsername(req.body.username, function (err, findUser) {
            if (findUser[0].userAdmin && findUser[0].userStop) {
                user.update({
                        _id: req.body.userId
                    }, {
                        userAdmin: true
                    },
                    function (err, updateUser) {
                        res.json({
                            status: 0,
                            message: "修改成功",
                            data: updateUser
                        });
                    });
            } else {
                res.json({
                    error: 1,
                    message: "用户没有权限"
                });
            }
        });
    } else {
        res.json({
            status: 1,
            mesage: check.mesage
        });
    }
});

function checkAdminPower(username,token,id){
    var check = {error:0,message:''};
    var token_after = getMDBPassword(id);

    user.findById(id,function (err, findUser) {
         if(findUser.length == 0){
             check.error = 1;
             check.message = '用户错误';
         }
    });

    if(token != token_after){
        check.error = 1;
        check.message = '登陆错误';
    }
    return check;
}

module.exports = router;