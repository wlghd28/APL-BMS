const  express  = require('express');
const  ejs      = require('ejs');
const  fs       = require('fs');
const  router   = express.Router();

// 회원 로그인 화면을 출력합니다.
const GetLoginPage = (req, res) => {

};
// 로그인을 처리합니다.
const HandleLogin = (req, res) => {

};
// 로그아웃을 처리합니다.
const HandleLogout = (req, res) => {

};

// 회원가입 페이지를 출력합니다.
const GetSignupPage = (req, res) => {

};
// 회원가입을 처리합니다.
const HandleSignup = (req, res) => {

};

router.get('/login', GetLoginPage);
router.get('/logout', HandleLogout);
router.get('/signup', GetSignupPage);
router.post('/login', HandleLogin);
router.post('/signup', HandleSignup);

module.exports = router
