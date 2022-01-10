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
            console.log("검색한메일"+maildup);
            if (maildup) { // maildup는 무언가 find 되었을 때만 채워진다.
                var result = "이미 가입된 회원입니다.";
                res.send({result:result}); 

            }
            else { var result = "이메일로 보내진 인증번호를 입력하여 주세요." // 여기서 이메일 보내기 프로토콜 진행
                    //auth.js 를 이용해야함. 인자는 여기있는 req.body.mail
                    var b = req.body.mail;
                    var c = toString(CheckEmail.authen(b));
                    //console.log("오마이갓"+c);
                    res.send({result:result, authcode:c});}

        })

        

    }

    if ( a == 0) {
        var result = "올바른이메일 형식이 아닙니다"; // 응답으로 올바른 이메일 형식인지 보내기.res send로 ajax에 응답함.
        res.send({result:result});
    }
    
})

module.exports=router;