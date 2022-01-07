var router = require('express').Router();
//import {CheckEmail} from '../public/js/emailerrorchk';
const CheckEmail = require("../public/js/emailerrorchk");

router.post('/emailcheck', function(req,res){

    var a = CheckEmail.chkemail(req.body.mail);
    var maildup;
   // console.log(req.body.mail); // 받아온 메일주소
    if ( a == 1) { // 올바른 이메일 형식이면 중복검사 수행.
        database.collection('user').findOne({usr_email: req.body.mail}, function(err, context){
        
            maildup = context;
            console.log("가져온메일"+req.body.mail);
            console.log("검색한메일"+maildup.usr_email);
            if (maildup.usr_email == req.body.mail) {
                var result = "이미 가입된 회원입니다.";
                res.send({result:result}); 

            }
            else { var result = "가입하셔도 좋습니다"
                    res.send({result:result});}

        })

        

    }

    if ( a == 0) {
        var result = "올바른이메일 형식이 아닙니다"; // 응답으로 올바른 이메일 형식인지 보내기.res send로 ajax에 응답함.
        res.send({result:result});
    }
    
})

module.exports=router;