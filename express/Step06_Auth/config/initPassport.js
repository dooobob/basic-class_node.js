var User = require("../models/user.js");

//LocalStrategy 생성자 함수 읽어오기
var LocalStrategy = require("passport-local").Strategy;
var KakaoStrategy = require("passport-kakao").Strategy;

//passport 를 인자로 받은 함수를 리턴해준다.
module.exports = function(passport) {

    //Kakao auth
    passport.use("kakao-login", new KakaoStrategy({
        clientID: "7601b4b18e4f50d49def5222cfec598a",
        callbackURL: "http://localhost:3000/users/kakao/signup"
    }, function(accessToken, refreshToken, profile, done) {
        User.findOne({
            "kakao.id": profile.id
        }, function(err, user) {
            if (err) throw err;
            if (!user) { //카카오 계정으로 로그인을 한번도 안한 사용자
                //저장할 정보 담기
                var newUser = new User();
                newUser.kakao.name = profile.username;
                newUser.kakao.id = profile.id;
                newUser.kakao.roles = ['authenticated'];
                newUser.kakao.provider = "kakao";
                newUser.kakao.kakao = profile._json;
                //실제 저장하기
                newUser.save(function(err) {
                    if (err) throw err;
                    return done(err, newUser);
                });
            } else { //카카오 계정으로 한번이라도 로그인 한 사용자
                return done(err, user);
            }
        });
    }));


    //local 로그인 기능
    passport.use("local-login", new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    }, function(req, email, password, done) {
        //DB 에 email 정보가 있는지 찾는다.
        User.findOne({
            "local.email": email
        }, function(err, user) {
            if (err) throw err;
            if (!user) { //존재하지 않은 사용자
                var msg = "존재 하지 않는 아이디 입니다.";
                return done(null, false, req.flash("errMsg", msg));
            }
            if (!user.validPassword(password)) { //비밀번호가 틀린경우
                var msg = "비밀번호를 확인 하세요";
                return done(null, false, req.flash("errMsg", msg));
            }
            //정상 인증 처리 하기
            return done(null, user);
        });
    }));

    //local 회원가입 기능
    passport.use("local-signup", new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    }, function(req, email, password, done) {
        //이미 등록된 사용자 인지 읽어와 본다.
        User.findOne({
            "local.email": email
        }, function(err, user) {
            if (err) return done(err);
            if (user) { //이미 등록된 사용자
                var msg = "이미 등록된 이메일 입니다.";
                return done(null, false, req.flash("errMsg", msg));
            } else { //아직 등록되지 않은 사용자
                var newUser = new User();
                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);
                //추가 정보 (폼 전송 파라미터 추출)
                newUser.local.name = req.body.name;
                newUser.save(function(err) {
                    if (err) throw err;
                    return done(null, newUser);
                });
            }
        });
    }));



    //로그인 처리
    passport.serializeUser(function(user, done) {

        done(null, user.id);
    });

    //로그아웃 처리
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};
