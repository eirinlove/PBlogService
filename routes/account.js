var router = require('express').Router();
//import {CheckEmail} from '../public/js/emailerrorchk';
const CheckEmail = require("../public/js/emailerrorchk");
const { post } = require('./thread');
const authViewers = require("../public/js/authViewer");
const cryptpass = require ("../function/crypto");


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
                    
                    
                        CheckEmail.authen(b);
                        var c =  authViewers.authHive();
                        console.log (c);
               
                    
                    res.send({result:result, authbutton:c});}

        })

        

    }

    if ( a == 0) {
        var result = "올바른이메일 형식이 아닙니다"; // 응답으로 올바른 이메일 형식인지 보내기.res send로 ajax에 응답함.
        res.send({result:result});
    }
    
})


router.post('/idcheck', function(req,res){

    var iddup;

    database.collection('user').findOne({usr_id: req.body.usrid}, function(err, context ){
        
        iddup = context



        if (iddup){
            var result = "이미 가입된 회원입니다.";
            res.send({result:result});
        }

        else {

           var result = "가입하셔도 좋습니다.";
           var dupcheck = true;
           res.send({result:result, dupcheck:dupcheck});
        }
        


    })



})


router.post('/register', function(req,res){

database.collection('thread_counter').findOne({count : '카운트'}, function(err, context){



var usrNum = context.totalUser;
var crypedpass = cryptpass.renderFunc(req.body.receivePass);
var saveinfo = { usr_id : req.body.receiveId,
                 usr_pw : crypedpass,
                 usr_email : req.body.receiveMail,
                 usr_Nname : req.body.receiveNname,
                 usr_addr : usrNum + 1}

database.collection('user').insertOne(saveinfo, function(err, context){

    database.collection('thread_counter').updateOne({count : '카운트'}, { $inc: {totalUser:1}}, function(err,context){


        var result = '등록완료되었습니다';
        var valid = true;
        res.send({result:result, valid:valid});
    })


})
})
})

router.post('/modifyUsr_checkpw', function(req,res){

    database.collection('user').findOne({usr_id: req.user.usr_id}, function(err, context){


        if ( context.usr_pw == cryptpass.renderFunc(req.body.checkpw) ) {

            var result  = "ok";
            res.send({result : result});
        }

        else {

            var result = "비밀번호를 확인해주세요.";
            res.send({result : result});
        }
       

    })

})


router.get('/modifyusr_checkok', function(req,res){

    res.render('modifyUserForm.ejs', {email : req.user.usr_email,
                                      id : req.user.usr_id})

})


router.post('/modifyProcess', function(req,res){

    if ( req.body.pwdata && req.body.nnamedata){

        console.log(req.body.pwdata +" "+req.body.nnamedata);
        database.collection('user').updateOne({usr_id : req.user.usr_id}, 
            {$set :{ usr_pw : cryptpass.renderFunc(req.body.pwdata), usr_Nname : req.body.nnamedata  }}, function(err, context){
        var result =  "success";
        res.send ({result : result});
                
            })
    }
    else {

        database.collection('user').updateOne({usr_id : req.user.usr_id}, 
            {$set :{ usr_pw : cryptpass.renderFunc(req.body.pwdata)  }}, function(err, context){
        var result =  "success";
        res.send ({result : result});
                
            })  


    }

})
module.exports=router;