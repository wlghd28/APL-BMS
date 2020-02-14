const  express  = require('express');
const  ejs      = require('ejs');
const  fs       = require('fs');
const  router   = express.Router();

/*
    메인화면 출력
*/
const  GetMainUI = (req, res) => {   
    let htmlStream = ''; // 웹페이지를 구성하기 위한 목적으로 사용(init ~ footer까지, 현재는 초기화로 아무것도 없는 상태)

    htmlStream = fs.readFileSync(__dirname + '/../views/init.ejs','utf8');    // 초기설정(부트스트랩/제이쿼리 등)
    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/header.ejs','utf8');  // Header
    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/nav.ejs','utf8');     // Navigation
    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/content.ejs','utf8'); // Content
    htmlStream = htmlStream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer

    res.writeHead(200, {'Content-Type':'text/html; charset=utf8'}); // 200은 성공
    res.end(ejs.render(htmlStream, {
                                        'title' : '업무관리 프로그램',
                                        'url' : '../'
                                    
                                    })); 
};

router.get('/', GetMainUI);

module.exports = router
