const express = require('express');
var router = require('express').Router();
var timestamps = require('../public/js/timestampler'); // timestamp 함수를 사용하기 위해 보냄.
var titleviewer = require('../public/js/titleViewer');
router.use('/public', express.static('public'));  // 미들웨어 static파일 보관하기위해 public 폴더 쓸겁니다., 정적 import 파일들 관리 가능, css같은것

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(process.env.DB_URL, function(err, client){
        database = client.db('todoapp');

});




router.get('/thread_view2', function(req,res){

    res.send (' 스레드 뷰 페이지 ');

});

router.get('/thread_list', function(req,res){// 스레드 목록

    database.collection('thread_list').find().toArray(function(err,context){

            res.render('thread_list.ejs', {threads_info : context});
    })
    




router.get('/thread:thread_id', function(req,res){ // 해당 스레드에 있는 게시글 목록. :thread_id 로 thread_id 인자 받아왔음 

    database.collection('thread_post').find({thread_id : parseInt(req.params.thread_id)}).toArray(function(err, context){ // 받은 문자를 받게됨,  위에 get 한 것.  parseint로 String을 Int로 변환

        //console.log(req.params.id);
        console.log(context);
        if (req.user){
        var userdata = req.user.usr_id; 
        res.render('thread_view.ejs', { postlist : context,
            gotime : timestamps.renderFunc,
            userdata : userdata,
            thread_data : req.params.thread_id});  //timestamp js 에서 renderFunc 통해서 보낸것}
        }

        else {

            var userdata = null;
            res.render('thread_view.ejs', {postlist : context,
                                           gotime : timestamps.renderFunc,
                                           userdata : userdata,
                                           thread_data : req.params.thread_id})
        }


        

})

})

});


// ---------------- 글쓰기 페이지 이동 -------------- //
router.get('/thread:thread_id/postWrite', function(req, res){ // thread_view의 post_write href로부터 옴


    res.render('postWrite.ejs', {thread_data : parseInt(req.params.thread_id) // 쓰레드 타이틀 표시용
        ,thread_list : titleviewer.renderFunc});  // 함수 

});


router.post('/thread:thread_id/postWriteOk', function(req,res){


    
    database.collection('thread_post').insertOne(saveinfo, function(err, context){



        location.href ('/thread:thread_id'); // 글 쓴 후 해당 스레드 페이지로 이동
    });

    

});




// ------------- 포스트 확인 ---------------// 맨 나중에 넣어야 함 (post_id 문자열 인식때문에)
router.get('/thread:thread_id/:post_id', function(req, res){ // : 로, 사용자가 입력한 문자[패러미터] 받음 .

    database.collection('thread_post').findOne({post_id : parseInt(req.params.post_id)}, function(err, context){ // thread_id에 따른 post_id 를 매핑해야함. 해당 쓰레드에 있는 해당 게시글. (그렇지 않으며녀 포스트 아이디가 다른 쓰레드 포스트 id와 중복됨)
        database.collection('thread_post').find({thread_id : parseInt(req.params.thread_id)}).toArray(function(err, context_another){
            console.log("포스트 데이터"+context);

            res.render('postDetail.ejs', {postData : context,
                                            postlist : context_another,
                                            gotime : timestamps.renderFunc,
                                            thread_list : titleviewer.renderFunc}); // data object를 정의해서 detail.ejs 에서 읽어올 수 있게 함.

            //응답.render('detail.ejs', {이런 이름으로 : 이런 데이터를}) ejs파일은 render를 해줘야 하니 필수
        })
    })
});




module.exports = router;