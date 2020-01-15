var mongoose = require("mongoose");
//비밀번호 암호화를 위한 모듈
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;
//회원정보를 저장할 스키마 정의하기
var userSchema = new Schema({
    local: {
        email: String,
        password: String,
        name: String
    },
    kakao: {
        name: String,
        id: Number,
        roles: [String],
        provider: String,
        kakao: Schema.Types.Mixed
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
/*
// checking if password is valid
userSchema.methods.validPassword = function(password) {

    if(password==this.local.password){
        return true;
    }else{
        return false;
    }
};
*/
module.exports = mongoose.model("User", userSchema);
