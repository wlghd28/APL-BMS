const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   mysql = require('mysql');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   router = express.Router();
const   moment = require('moment');

router.use(bodyParser.urlencoded({ extended: false }));

const   db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: 'root',            // DB접속 아이디
    password: 'root',  // DB암호
    database: 'work_management'         //사용할 DB명
});

// 업무 조회 페이지를 출력합니다.
const GetInquireWorkSheet = (req, res) => {
    let htmlStream = ''; // 웹페이지를 구성하기 위한 목적으로 사용(init ~ footer까지, 현재는 초기화로 아무것도 없는 상태)

    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/header.ejs','utf8');  // 초기설정(부트스트랩/제이쿼리 등)
    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/nav.ejs','utf8');     // Navigation
    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/content.ejs','utf8'); // Content
    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer

    res.writeHead(200, {'Content-Type':'text/html; charset=utf8'}); // 200은 성공
    res.end(ejs.render(htmlStream, {
                                        'title' : '업무관리 프로그램',
                                        'url' : '../' })); 
};

// 금일 업무 등록하는 페이지를 출력합니다.
const  GetThisWorkSheet = (req, res) => {   
    let htmlStream = '';

    htmlStream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // Header
    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/today_worksheet.ejs','utf8'); // add_today_work

    res.writeHead(200, {'Content-Type':'text/html; charset=utf8'}); // 200은 성공
    res.end(ejs.render(htmlStream, {
                                        'title' : '업무관리 프로그램',
                                        'url' : '../../' })); 
};
// 금주 업무 등록을 처리합니다.
const HandleThisWorkSheet = (req, res) => {
    console.log('금주 업무 등록 요청보냄');
    let sql_str1 = 'SELECT * FROM THIS_WORK WHERE user_id = ?';
    let sql_str2 = 'INSERT INTO THIS_WORK(start_date, end_date, user_id, work) VALUES(?,?,?,?)';
    let sql_str3 = 'UPDATE THIS_WORK SET work = ? WHERE user_id = ?';
    let body = req.body;
    let userid = req.session.id;
    //let username = req.session.who;
    let start_date, end_date;
    let today = moment().day();
    let work = body.work;

    start_date = moment().add('days', -today);
    end_date = moment().add('days', (6 - today));

    console.log(req.body);
    console.log(start_date);
    console.log(end_date);
    console.log('POST 데이터 받음');

    // 금주 업무 등록이 되어있는지 조사합니다.
    db.query(sql_str1, [userid], (error, results) => {
        if (error) {     
            console.log(error);
            res.end("error");
        } else {

            // 금주 업무 등록이 안 되어있는 상태일 경우 데이터를 삽입합니다.
            if (results[0] == null) {
                db.query(sql_str2, [start_date, end_date, userid, work], (error) => {
                        if (error) {
                            res.end("error");
                            console.log(error);
                        } else {
                            console.log('Insertion into DB was completed!');
                            res.redirect('/userwork/inquire_worksheet');
                        }
                }); // db.query();
            } else { // 금주 업무가 등록이 되어있는 상태일 경우 데이터를 수정합니다.
                db.query(sql_str3, [work, userid], (error) => {
                    if (error) {
                        res.end("error");
                        console.log(error);
                    } else {
                        console.log('update set DB was completed!');
                        res.redirect('/userwork/inquire_worksheet');
                    }
                }); // db.query();
            }              
      }
    });
};

// 예정된 업무를 등록하는 페이지를 출력합니다.
const  GetFutureWorkSheet = (req, res) => {   
    let htmlStream = '';

    htmlStream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // Header
    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/future_worksheet.ejs','utf8'); // add_today_work

    res.writeHead(200, {'Content-Type':'text/html; charset=utf8'}); // 200은 성공
    res.end(ejs.render(htmlStream, {
                                        'title' : '업무관리 프로그램',
                                        'url' : '../../' })); // 지금 depth가 2이므로 ../../를 해준 것!
};

// 예정된 업무 등록을 처리합니다. 
const HandleFutureWorkSheet = (req, res) => {

};

router.get('/inquire_worksheet', GetInquireWorkSheet);
router.get('/today_worksheet', GetThisWorkSheet);
router.get('/future_worksheet', GetFutureWorkSheet);
router.post('/upload_today_worksheet', HandleThisWorkSheet);
router.post('/upload_future_worksheet', HandleFutureWorkSheet);

module.exports = router
