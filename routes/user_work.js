const  express  = require('express');
const  ejs      = require('ejs');
const  fs       = require('fs');
const  router   = express.Router();

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
const  GetTodayWorkSheet = (req, res) => {   
    let htmlStream = '';

    htmlStream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // Header
    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/today_worksheet.ejs','utf8'); // add_today_work

    res.writeHead(200, {'Content-Type':'text/html; charset=utf8'}); // 200은 성공
    res.end(ejs.render(htmlStream, {
                                        'title' : '업무관리 프로그램',
                                        'url' : '../../' })); 
};
// 금일 업무 등록을 처리합니다.
const HandleTodayWorkSheet = (req, res) => {

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
router.get('/today_worksheet', GetTodayWorkSheet);
router.get('/future_worksheet', GetFutureWorkSheet);
router.post('/upload_today_worksheet', HandleTodayWorkSheet);
router.post('/upload_future_worksheet', HandleFutureWorkSheet);

module.exports = router
