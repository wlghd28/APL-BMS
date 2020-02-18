const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   mysql = require('mysql');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   router = express.Router();
const   requestIp = require('request-ip');
const   moment = require('moment');
require('moment-timezone');


router.use(bodyParser.urlencoded({ extended: false }));

const   db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: 'root',            // DB접속 아이디
    password: 'root',  // DB암호
    database: 'work_management'         //사용할 DB명
});

// 회원 로그인 화면을 출력합니다.
const GetLoginPage = (req, res) => {
    let htmlStream = ''; 
    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/header.ejs','utf8');  // 초기설정(부트스트랩/제이쿼리 등)
    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/login.ejs','utf8'); // Content
    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer

    res.writeHead(200, {'Content-Type':'text/html; charset=utf8'}); // 200은 성공
    res.end(ejs.render(htmlStream, {
                                        'title' : '로그인',
                                        'url' : '../../' })); 
};
// 로그인을 처리합니다.
const HandleLogin = (req, res) => {
      
};
// 로그아웃을 처리합니다.
const HandleLogout = (req, res) => {
    req.session.destroy();     // 세션을 제거하여 인증오작동 문제를 해결
    res.redirect('/user/login');         // 로그아웃후 메인화면으로 재접속
}
// 회원가입 페이지를 출력합니다.
const GetSignupPage = (req, res) => {
    let htmlStream = ''; 

    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/header.ejs','utf8'); 
    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/signup.ejs','utf8'); 
    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8'); 

    res.writeHead(200, {'Content-Type':'text/html; charset=utf8'}); // 200은 성공
    res.end(ejs.render(htmlStream, {
                                        'title' : '회원가입',
                                        'url' : '../' }));
};
// 회원가입을 처리합니다.
const HandleSignup = (req, res) => {
    console.log('회원가입 요청 보냄');
    let sql_str1 = 'SELECT * FROM USER WHERE user_id = ?';
    let sql_str2 = 'INSERT INTO USER(user_id, user_pwd, user_name, user_rank) VALUES(?,?,?,?)';
    let body = req.body;
    let userid = body.uid;
    let username = body.uname;
    let password = body.pass;
    let confirm_password = body.pass2;
    console.log(req.body);
    console.log('POST 데이터 받음');
    db.query(sql_str1, [userid], (error, results) => {
        if (error) {     
            console.log(error);
            res.end("error");
        } else {
            // 입력받은 데이터가 이메일 양식인지 판단합니다
            if (results[0] == null && password == confirm_password) {
                db.query(sql_str2, [userid, password, username, 0], (error) => {
                        if (error) {
                            res.end("error");
                            console.log(error);
                        } else {
                            console.log('Insertion into DB was completed!');
                            res.redirect('/user/login');
                        }
                }); // db.query();
            } else {
                  res.end("error");
            }              
      }
    });
};
router.get('/login', GetLoginPage);
router.get('/logout', HandleLogout);
router.get('/signup', GetSignupPage);
router.post('/login', HandleLogin);
router.post('/signup', HandleSignup);

module.exports = router
