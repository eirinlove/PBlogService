var router = require('express').Router();
//import {CheckEmail} from '../public/js/emailerrorchk';
const CheckEmail = require("../public/js/emailerrorchk");

router.post('/emailcheck', function(req,res){

    var a = CheckEmail.chkemail(req.body.mail);
   // console.log(req.body.mail); // 받아온 메일주소
    if ( a == 1) { // 올바른 이메일 형식이면 중복검사 수행.
        database.collection('thread_post').findOne({post_id : parseInt(req.params.post_id)}, function(err, context){
        
            
        })

        
        var result = "올바른 이메일 형식입니다.";
        res.send({result:result}); 
    }

    if ( a == 0) {
        var result = "올바른이메일 형식이 아닙니다"; // 응답으로 올바른 이메일 형식인지 보내기.res send로 ajax에 응답함.
        res.send({result:result});
    }
    
})

module.exports=router;