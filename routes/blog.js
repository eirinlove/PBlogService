var router = require('express').Router(); // express 라우터 기능, server.js 가 아닌 곳에서도 작동함.

router.get('/daily', function(req,res){

    res.send (' 일상 페이지 ');

});

router.get('/study', function(req,res){

    res.send (' 공부 페이지 ');
    
});

module.exports = router;
 // module.exports = 내보낼 변수명, 다른 파일에서 쓸 수 있게끔 내보낸다.  
 // require('파일경로') , 이 파일이나 라이브러리를 불러온다.
 // 이 경우, require ('/blog.js');
 // ※ 단 내보내주는 변수 구분에 유의ㅇ