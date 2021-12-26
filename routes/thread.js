var router = require('express').Router();

router.get('/thread_view', function(req,res){

    res.send (' 스레드 뷰 페이지 ');

});

module.exports = router;