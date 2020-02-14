const  express  = require('express');
const  ejs      = require('ejs');
const  fs       = require('fs');
const  router   = express.Router();

// 회원 로그인 화면을 출력합니다.
const GetLoginPage = (req, res) => {
    let htmlStream = ''; 

    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/header.ejs','utf8');  // 초기설정(부트스트랩/제이쿼리 등)
    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/login.ejs','utf8'); // Content
    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer

    res.writeHead(200, {'Content-Type':'text/html; charset=utf8'}); // 200은 성공
    res.end(ejs.render(htmlStream, {
                                        'title' : '업무관리 프로그램',
                                        'url' : '../' })); 
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
