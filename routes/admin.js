const  express  = require('express');
const  ejs      = require('ejs');
const  fs       = require('fs');
const  router   = express.Router();

// 관리자 로그인 화면을 출력합니다.
const GetLoginPage_Admin = (req, res) => {

};

// 관리자 로그인을 처리합니다.
const HandleLogin_Admin = (req, res) => {

};

// 관리자 로그아웃을 처리합니다.
const HandleLogout_Admin = (req, res) => {

};
// 유저를 조회합니다.
const InquireUser = (req, res) => {

};

router.get('/login', GetLoginPage_Admin);
router.post('login', HandleLogin_Admin);
router.get('/logout', HandleLogout_Admin);
router.get('/inquire_user', InquireUser);
module.exports = router
