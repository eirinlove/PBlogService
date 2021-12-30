const express = require('express');
var router = require('express').Router();
var timestamps = require('../public/js/timestampler'); // timestamp 함수를 사용하기 위해 보냄.
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

        res.render('thread_view.ejs', { postlist : context,
                                        gotime : timestamps.renderFunc});  //timestamp js 에서 renderFunc 통해서 보낸것

        

})

})

});

router.get('/thread:thread_id/:post_id', function(req, res){ // : 로, 사용자가 입력한 문자[패러미터] 받음 .

    database.collection('thread_post').findOne({post_id : parseInt(req.params.post_id)}, function(err, context){ // 받은 문자를 받게됨,  위에 get 한 것.  parseint로 String을 Int로 변환

            console.log("포스트 데이터"+context);

            res.render('postDetail.ejs', {postData : context}); // data object를 정의해서 detail.ejs 에서 읽어올 수 있게 함.

            //응답.render('detail.ejs', {이런 이름으로 : 이런 데이터를}) ejs파일은 render를 해줘야 하니 필수

    })
});


module.exports = router;