//const express = require('express');
//const router = express.Router();
var router = require('express').Router();
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
var appDir = path.dirname(require.main.filename);


router.post('/mail', async(req, res) => {
    let authNum = Math.random().toString().substr(2,6); //랜덤 번호 생성
    let emailTemplete;
    ejs.renderFile(appDir+'/template/authMail.ejs', {authCode : authNum}, function (err, data) { //랜덤번호를 authCode로 authMail로 보낸다.
      if(err){console.log(err)}
      emailTemplete = data;
    });

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS, //해당 user, pass신분으로 메일을 보냄. (smtp사용 주체)
        },
    });

    let mailOptions = await transporter.sendMail({
        from: `곰방`,
        to: req.body.mail, //req, 즉 요청받은 mail바디.
        subject: '회원가입을 위한 인증번호를 입력해주세요.',
        html: emailTemplete,
    });


    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        console.log("Finish sending email : " + info.response);
        res.send(authNum);
        transporter.close()
    });
});

module.exports=router;