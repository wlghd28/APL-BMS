const  express  = require('express');
const  ejs      = require('ejs');
const  fs       = require('fs');
const  router   = express.Router();

// 메인화면을 출력합니다.
const  GetMainUI = (req, res) => {   
   
};

router.get('/', GetMainUI);

module.exports = router
