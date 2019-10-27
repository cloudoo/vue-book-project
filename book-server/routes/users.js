var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var user = require('../models/user');
var movie = require('../models/movie');
var movie = require('../models/mail');
var comment = require('../models/comment');
const init_token = 'TLsofw2';
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* 用户登陆接口*/
router.post('/login', function (req, res, next) {
  if (!req.body.username) {
    res.json({
      status: 1,
      message: '用户名为空'
    });
  }
  if (!req.body.password) {
    res.json({
      status: 1,
      message: '密码为空'
    });
  }
  user.findUserLogin(req.body.username, req.body.password, function (
    err,
    userSave
  ) {
    if (userSave.length != 0) {
      var token_after = getMDBPassword(userSave[0]._id);
      res.json({
        status: 0,
        data: {
          token: token_after
          // user: userSave
        },
        message: '用户登陆成功'
      });
    } else {
      res.json({
        status: 1,
        message: '用户登陆错误'
      });
    }
  });
});

router.post('/register', function (req, res, next) {
  if (!req.body.username) {
    res.json({
      status: 1,
      message: '用户名为空'
    });
  }
  if (!req.body.password) {
    res.json({
      status: 1,
      message: '密码为空'
    });
  }
  if (!req.body.userMail) {
    res.json({
      status: 1,
      message: '邮箱为空'
    });
  }
  if (!req.body.userPhone) {
    res.json({
      status: 1,
      message: '电话为空'
    });
  }
  user.findByUsername(req.body.username, function (err, userSave) {
    if (userSave.length != 0) {
      res.json({
        status: 1,
        message: '用户已注册'
      });
    } else {
      var registerUser = new user({
        username: req.body.username,
        password: req.body.password,
        userMail: req.body.userMail,
        userPhone: req.body.userPhone,
        userAdmin: 0,
        userPower: 0,
        userStop: 0
      });
      registerUser.save(function () {
        res.json({
          status: 0,
          message: '注册成功'
        });
      });
    }
  });
});

router.post('/postComment', function (req, res, next) {
  if (!req.body.username) {
    var username = '匿名用户';
  }
  if (!req.body.movie_id) {
    res.json({
      status: 1,
      message: '电影ID为空'
    });
  }
  if (!req.body.content) {
    res.json({
      status: 1,
      message: '内容为空'
    });
  }
  var saveComment = new comment({
    movie_id: req.body.movie_id,
    username: req.body.username ? req.body.username : username,
    content: req.body.content,
    check: 0
  });

  saveComment.save(function (err) {
    if (err) {
      res.json({
        status: 1,
        message: err
      });
    } else {
      res.json({
        status: 0,
        message: '评论成功'
      });
    }
  });
});

//点赞
router.post('/support', function (req, res, next) {
  if (!req.body.movid_id) {
    res.json({
      status: 1,
      message: '电影id传递失败'
    });
  }
  movie.findById(req.body.movie_id, function (err, supportMovie) {
    movie.update({
        _id: req.body.movid_id
      }, {
        movieNumSuppose: supportMovie.movieNumSuppose + 1
      },
      function (err) {
        if (err) {
          res.json({
            status: 1,
            message: '点咱失败',
            data: err
          });
        } else {
          res.json({
            status: 0,
            message: '成功'
          });
        }
      }
    );
  });
});

//下载电影?
router.post('download', function (req, res, next) {
  if (!req.body.movie_id) {
    res.json({
      status: 1,
      message: "没有电影ID"
    });
  }
  movie.findById(req.body.movid_id, function (err, supportMovie) {
    movie.update({
      _id: req.body.movie_id
    }, {
      movieNumDownload: supportMovie.movieNumDownload + 1
    }, function (err) {
      if (err) {
        res.json({
          status: 1,
          message: "点赞失败",
          data: err
        });
      }
      res.json({
        status: 0,
        message: "下载成功",
        data: supportMovie.movieDownload
      });

    });

  });
});

router.post('/findPassword', function (req, res, next) {});
//发送邮件
router.post('/sendMail', function (req, res, next) {
  if (!req.body.token) {
    res.json({
      status: 1,
      message: "用户登录token状态错误"
    })
  }
  if (!req.body.user_id) {
    res.json({
      status: 1,
      message: "用户登录id状态错误"
    })
  }
  if (!req.body.toUserName) {
    res.json({
      status: 1,
      message: "未选择用户"
    })
  }

  if (!req.body.title) {
    res.json({
      status: 1,
      message: "标题不能为空"
    })
  }
  if (!req.body.context) {
    res.json({
      status: 1,
      message: "内容不能为空"
    })
  }

  if (req.body.token == getMDBPassword(req.body.user_id)) {
    user.findByUsername(req.body.toUserName, function (err, toUser) {
      if (toUser.length != 0) {
        var newEmail = new mail({
          fromUser: req.body.user_id,
          toUser: toUser[0]._id,
          title: req.body.title,
          context: req.body.context
        });
        newEmail.save(function () {
          res.json({
            status: 0,
            message: "发送成功"
          });
        });
      } else {
        res.json({
          status: 1,
          message: "对象不存在"
        });

      }
    });
  } else {
    res.json({
      status: 1,
      message: "用户登录信息错误"
    });
  }

});

router.post('/showMail', function (req, res, next) {
  if (!req.body.token) {
    res.json({
      status: 1,
      message: "用户登录token状态错误"
    })
  }

});


function getMDBPassword(id) {
  var md5 = crypto.createHash('md5');
  var token_before = id + init_token;
  return md5.update(token_before).digest('hex');
}

module.exports = router;