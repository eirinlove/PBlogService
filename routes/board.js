var router = require('express').Router();


function admin_check(req, res, next){ //미들웨어 생성

    if(req.user){ //요청.user가 있으면 통과 이걸 이용해서 관리자나 특정인물만 통과도 가능.

            next();
    }else{ // 요청.user가 없으면 에러 메시지.
            res.send('관리자가 아니네요' + req.user);
    }
}

router.use(admin_check); // 여기있는 모든 URL에 적용할 미들웨어가 아규먼트
router.get('/manage',admin_check,function(req,res){

    res.send (' 관리 페이지 ');

});
router.get('/admin',admin_check, function(req,res){
    

    console.log('접속자' + req.user);
    res.send (' 관리자 페이지 ');

});

module.exports = router;