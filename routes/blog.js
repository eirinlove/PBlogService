var router = require('express').Router(); // express 라우터 기능, server.js 가 아닌 곳에서도 작동함.

router.get('/daily', function(req,res){

    res.send (' 일상 페이지 ');

});

router.get('/study', function(req,res){

    res.send (' 공부 페이지 ');
    
});

module.exports = router;
