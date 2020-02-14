// Node.JS 내외부 모듈추출
const   cookieParser = require('cookie-parser');
const   session = require('express-session');
const   bodyParser = require('body-parser');
const   express = require('express');
const   app = express();
const   createError = require('http-errors');
const   path = require('path');

// BMS 개발소스 모듈
const  mainUI        = require('./routes/main_ui');
const  todayWorkSheet  = require('./routes/process');

// BMS 전용 포트주소 설정
const   PORT = 3000;

// 실행환경 설정부분
app.set('views', path.join(__dirname, 'views'));  // views경로 설정(ejs파일이 있는곳을 'view'로 가리킴)
app.set('view engine', 'ejs');                    // view엔진 지정
app.use(express.static(path.join(__dirname, 'public')));   // public설정
app.use('/stylesheets', express.static(path.join(__dirname, 'public', 'stylesheets')));   // css설정
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({ key: 'sid',
                  secret: 'secret key',  // 세션id 암호화할때 사용
                  resave: false,         // 접속할때마다 id부여금지
                  saveUninitialized: true })); // 세션id사용전에는 발급금지

// URI와 핸들러를 매핑
app.use('/', mainUI);                     // URI (/) 접속하면 main_ui.ejs로 라우팅
app.use('/today_worksheet', todayWorkSheet);


// 서버를 실행합니다.
app.listen(PORT, function () {
       console.log('서버실행: http://localhost:' + PORT + '/');
});