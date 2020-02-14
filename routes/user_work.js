const  express  = require('express');
const  ejs      = require('ejs');
const  fs       = require('fs');
const  router   = express.Router();

/*
    금일 업무 폼 출력
*/
const  GetTodayWorkSheet = (req, res) => {   
    let htmlStream = '';

    htmlStream = fs.readFileSync(__dirname + '/../views/init.ejs','utf8');    // Header
    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/today_worksheet.ejs','utf8'); // add_today_work

    res.writeHead(200, {'Content-Type':'text/html; charset=utf8'}); // 200은 성공
    res.end(ejs.render(htmlStream, {
                                        'title' : '업무관리 프로그램',
                                        'url' : '../../' })); 
};

/*
    예정된 업무 폼 출력
*/
const  GetFutureWorkSheet = (req, res) => {   
    let htmlStream = '';

    htmlStream = fs.readFileSync(__dirname + '/../views/init.ejs','utf8');    // Header
    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/future_worksheet.ejs','utf8'); // add_today_work

    res.writeHead(200, {'Content-Type':'text/html; charset=utf8'}); // 200은 성공
    res.end(ejs.render(htmlStream, {
                                        'title' : '업무관리 프로그램',
                                        'url' : '../../' })); 
};


router.get('/today_worksheet', GetTodayWorkSheet);
router.get('/future_worksheet', GetFutureWorkSheet);
module.exports = router
