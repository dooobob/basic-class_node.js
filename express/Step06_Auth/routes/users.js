var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/signup_form', function(req, res) {
    res.render('users/signup_form', {
        message: req.flash('errMsg')
    });
});

// local 회원가입 요청 처리
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/users/profile',
    failureRedirect: '/users/signup_form',
    failureFlash: true
}));

// 로그인 폼 요청처리
router.get('/signin_form', function(req, res) {
    res.render('users/signin_form', {
        message: req.flash('errMsg')
    });
});

// 로그인 요청 처리
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/users/profile',
    failureRedirect: '/users/signin_form',
    failureFlash: true
}));

// 로그아웃 요청 처리
router.get('/logout', function(req, res) {
    // 로그 아웃처리
    req.logout();
    // root 요청으로 리다이렉트 이동
    res.redirect('/');
});

//사용자 정보보기 요청 처리
router.get("/profile", isLoggedIn, function(req, res) {
    //req.user 의 구조 출력해보기
    console.log(req.user);
    res.render("users/profile", {
        user: req.user
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/users/signin_form");
}

// 카카오 계정으로 로그인 요청 처리
router.get('/auth/kakao', passport.authenticate('kakao-login', {
    failureRedirect: '/'
}));

// 카카오 api 에서 리다이렉트된 요청 처리
router.get('/kakao/signup', passport.authenticate('kakao-login', {
    failureRedirect: '/users/auth/kakao',
    successRedirect: '/users/kakao/profile'
}));

// kakao 로그인이 완료된 후 요청처리
router.get('/kakao/profile', function(req, res) {
    console.log(req.user);
    // 임시 응답
    res.render('users/kakao/profile', {
        user: req.user
    });
})

module.exports = router;
