const   fs          = require('fs');
const   express     = require('express');
const   ejs         = require('ejs');
const   mysql       = require('mysql');
const   bodyParser  = require('body-parser');
const   session     = require('express-session');
const   router      = express.Router();
const   requestIp   = require('request-ip');
const   moment      = require('moment');
require('moment-timezone');

router.use(bodyParser.urlencoded({ extended: false }));


/* 데이터베이스 연동 소스코드 */
const db = mysql.createConnection({
    host:       'localhost',        // DB서버 IP주소
    port:       3306,               // DB서버 Port주소
    user:       'root',             // DB접속 아이디
    password:   'root',             // DB암호
    database:   'work_management'   //사용할 DB명
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

    let body = req.body;
    let userid, userpass, username;
    let sql_str, sql_str2;
    let ip_address;
    let htmlStream = '';
    moment.tz.setDefault("Asia/Seoul");

    console.log(body.uid);
    console.log(body.pass);
    
    htmlStream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  
  
    if (body.uid == '' || body.pass == '') {
        console.log("아이디나 암호가 입력되지 않아서 로그인할 수 없습니다.");
        res.status(562).end(ejs.render(htmlStream, {
                                                    'title'         :'알리미',
                                                    'warn_title'    :'로그인 오류',
                                                    'warn_message'  :'아이디나 암호가 입력되지 않아서 로그인할 수 없습니다.',
                                                    'return_url'    :'/' }));
    } else {
        sql_str = "SELECT * from USER where user_id ='"+ body.uid +"' and user_pwd='" + body.pass + "';";
        sql_str2 = "INSERT INTO LOGIN_LOG(date, user_id, user_name, ip_address) VALUES(? ,? ,?, ?)";
        //console.log("SQL: " + sql_str);
        db.query(sql_str, (error, results, fields) => {
            if (error) 
                res.status(562).end("Login Fail as No id in DB!"); 
            else {
                if (results.length <= 0) {  // select 조회결과가 없는 경우 (즉, 등록계정이 없는 경우)
                    res.status(562).end(ejs.render(htmlStream, {
                                                                'title'         :'알리미',
                                                                'warn_title'    :'로그인 오류',
                                                                'warn_message'  :'등록된 계정이나 암호가 틀립니다.',
                                                                'return_url'    :'/' }));
                } else {  // select 조회결과가 있는 경우 (즉, 등록사용자인 경우)
                    results.forEach((item, index) => {
                        userid = item.user_id;  
                        userpass = item.user_pwd; 
                        username = item.user_name;
                        console.log("DB에서 로그인성공한 ID/암호:%s/%s", userid, userpass);
                        
                        if (body.uid == userid && body.pass == userpass) {
                            req.session.auth = 99;      // 임의로 수(99)로 로그인성공했다는 것을 설정함
                            req.session.id = userid; 
                            req.session.who = username; // 인증된 사용자명 확보 (로그인후 이름출력용)
                            
                            if (body.uid == 'admin')     // 만약, 인증된 사용자가 관리자(admin)라면 이를 표시
                                req.session.admin = true;

                            ip_address = requestIp.getClientIp(req);
                            console.log(ip_address);
                            // 접속로그를 남깁니다.
                            db.query(sql_str2, [moment().format('YYYY-MM-DD HH:mm:ss'), userid, username, ip_address], (error) => {
                                if (error) {     
                                    console.log(error);
                                    res.end("error");
                                } else {
                                    console.log('Insertion into DB was completed!');
                                }
                            });   
                            res.redirect('/userwork/inquire_worksheet');

                        }
                    }); /* foreach */
                    // 로그인 데이터를 접속로그 테이블에 삽입합니다.
                } // else
            }  // else
        });
   }
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
    res.end(ejs.render(htmlStream, {'title' : '회원가입',
                                    'url' : '../' }));
};

// 회원가입을 처리합니다.
const HandleSignup = (req, res) => {
    console.log('회원가입 요청 보냄');
    let sql_str1            = 'SELECT * FROM USER WHERE user_id = ?';
    let sql_str2            = 'INSERT INTO USER(user_id, user_pwd, user_name, user_rank) VALUES(?,?,?,?)';
    let body                = req.body;
    let userid              = body.uid;
    let username            = body.uname;
    let password            = body.pass;
    let confirm_password    = body.pass2;
    console.log(req.body);
    console.log('POST 데이터 받음');

    db.query(sql_str1, [userid], (error, results) => {
        if (error) {     
            console.log(error);
            res.end("error");
        } else {
            // 입력받은 데이터가 DB에 존재하는지 판단합니다. 
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