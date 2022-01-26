const express = require('express');
var router = require('express').Router();
var timestamps = require('../public/js/timestampler'); // timestamp 함수를 사용하기 위해 보냄.
var titleviewer = require('../public/js/titleViewer');
router.use('/public', express.static('public'));  // 미들웨어 static파일 보관하기위해 public 폴더 쓸겁니다., 정적 import 파일들 관리 가능, css같은것

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(process.env.DB_URL, function(err, client){
        database = client.db('todoapp');

});



// ---- multer ----- ////


let multer = require('multer');
var storage = multer.diskStorage({
        destination : function(req, file, cb){

                cb(null, './public/images') //출력 경로 정의
        },
        filename : function(req, file, cb){
                cb(null, file.originalname) //출력 파일명 정의
        

        }
}); // memoryStorage는 휘발성, diskStorage는 비휘발성
var path = require('path');

var upload = multer({storage : storage
    ,
    fileFilter : function(req, file, cb){
            var ext = path.extname(file.originalname);
            if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg'){ // jpeg,jpg,png로 끝나는 파일 검사.
                    return cb(new Error('PNG, JPEG만 허용됩니다.'))
            }
            cb(null, true);

    },
    limits:{
            fileSize: 2048 * 2048 //파일 사이즈, 최대 2MB.
    }});



// ------------------- //



router.get('/thread_view2', function(req,res){

    res.send (' 스레드 뷰 페이지 ');

});

router.get('/thread_list', function(req,res){// 스레드 목록

    database.collection('thread_list').find().toArray(function(err,context){

            res.render('thread_list.ejs', {threads_info : context});
    })

router.post('/threadJoinFunc', function(req,res){

    if (req.user){
    database.collection('user').findOne({usr_id : req.user.usr_id}, function(err, context){

        console.log ('키개수'+titleviewer.keyViewer());
        var threadList = context.join_thread;
        var result = "ok";      
        res.send({result:result,
                  threadNum : threadList,
                  threadPage : titleviewer.keyViewer()})
})
}
else {var result = "no"; res.send ({result:result})}  
})

router.post('/brexit', function(req,res){

    // var dothat = parseInt(req.body.postId);
    var dothat =  parseInt(req.body.postId);
   
  //배열 번호 가진상태
    database.collection('user').updateOne({usr_id : req.user.usr_id}, {$pull : {"join_thread":dothat}}, function(err, context){
        database.collection('thread_list').updateOne({thread_id:dothat}, { $inc : {thread_usrNum :-1}}, function(err, context_3){ 



            var result = "ok";
            res.send({result : result});
             // console.log('삭제'+dothat);
        })
       

    })

})

router.post('/beJoin', function(req,res){


    var dothat = parseInt(req.body.postId);

    database.collection('user').updateOne({usr_id : req.user.usr_id}, {$push : {"join_thread":dothat}}, function(err, context){
        database.collection('thread_list').updateOne({thread_id:dothat}, { $inc : {thread_usrNum :1}}, function(err, context_3){ 
        console.log('추가'+dothat);
        var result = "ok";
        res.send ({result : result});
        })
    } )
})


router.get('/thread:thread_id', function(req,res){ // 해당 스레드에 있는 게시글 목록. :thread_id 로 thread_id 인자 받아왔음 


    database.collection('thread_list').findOne({thread_id : parseInt(req.params.thread_id)}, function(err, context){

        

    var viewAuth = context.usr_id;




    
    
    database.collection('thread_post').find({thread_id : parseInt(req.params.thread_id)}).toArray(function(err, context_2){ // 받은 문자를 받게됨,  위에 get 한 것.  parseint로 String을 Int로 변환

        //console.log(req.params.id);
        console.log(context_2);


       
        if (req.user){

            if (viewAuth == req.user.usr_id){

        var userdata = req.user.usr_id; 
        res.render('thread_view.ejs', { postlist : context_2,
            gotime : timestamps.renderFunc,
            userdata : userdata,
            thread_data : req.params.thread_id,
            viewAuth : "admin"});  //timestamp js 에서 renderFunc 통해서 보낸것}
        }
        else {
            viewAuth = null;
            var userdata = req.user.usr_id; 
            res.render('thread_view.ejs', { postlist : context_2,
                gotime : timestamps.renderFunc,
                userdata : userdata,
                thread_data : req.params.thread_id,
                viewAuth : "user"});
        }
    }
        else {
            viewAuth = null;
            var userdata = null;
            res.render('thread_view.ejs', {postlist : context_2,
                                           gotime : timestamps.renderFunc,
                                           userdata : userdata,
                                           thread_data : req.params.thread_id,
                                           viewAuth : "user" })
        }


    })


})

})

});


// ---------------- 글쓰기 페이지 이동 -------------- //
router.get('/thread:thread_id/postWrite', function(req, res){ // thread_view의 post_write href로부터 옴


    res.render('postWrite.ejs', {thread_data : parseInt(req.params.thread_id) // 쓰레드 타이틀 표시용
        ,thread_list : titleviewer.renderFunc});  // 함수 

});


router.post('/thread:thread_id/postWriteOk', function(req,res){

    database.collection('thread_counter').findOne({count: '카운트'}, function(err, context){

    postNum = context.totalPost;
    let today =+ new Date();
    var saveinfo  = {usr_Nname : req.user.usr_Nname, post_id : postNum+1, usr_id : req.user.usr_id, post_name : req.body.titleData, post_context : req.body.contextData,
                     thread_id : parseInt(req.params.thread_id), post_Viewer : 0, comment : 0, date : today }

    database.collection('thread_post').insertOne(saveinfo, function(err, context_2){

        database.collection('thread_counter').updateOne({count : '카운트'}, { $inc : {totalPost :1}}, function(err, context_3){

            var result = "ok";
            res.send ({result:result});
            //location.href ('/thread:thread_id'); // 글 쓴 후 해당 스레드 페이지로 이동
        })
    
 
    });

    

});

})


router.post('/thread:thread_id/upload-image', upload.single('img'), (req,res) => { //이미지 업로드

    //res.render('./test/typetest.ejs',{});
    console.log(req.file);
    let response = {}
    response.url  = `/images/${path.basename(req.file.path)}`
    res.json(response);
})

// router.post('/testwrite', function(req, res){

// var saveinfo = { post_name : req.body.name, post_context : req.body.context  }
// database.collection('post_test').insertOne(saveinfo, function(err, context){


// })

// }) 이부분 typetest 부분




router.get('/deleteCheck/:postId', function(req,res){

var postId = parseInt(req.params.postId);

//console.log('유저ID :'+req.user.usr_id + '실제 ID :' + userId);
console.log ('포스트아이디'+postId);
database.collection('thread_post').findOne({post_id:postId}, function(err, context){

    var userId = context.usr_id;
    var threadId = context.thread_id;
   
    if (userId == req.user.usr_id){
        res.render ('postDelete.ejs', {postId : postId,
                                       postTitle : context.post_name,
                                       threadId : threadId});
    
        console.log ( '삭제 페이지로 이동');
        }
        else {
            res.redirect('/');
            
        }

})

})

router.post('/delete/:postId', function(req,res){

    
    var deleteinfo = { post_id : parseInt(req.body.postId) };
    database.collection('thread_post').deleteOne(deleteinfo, function(err, context){

 
        var result = "삭제 완료되었습니다.";
        res.send ({result : result});


})
})

router.delete('/deletead/:postId', function(req,res){

    
    var deleteinfo = { post_id : parseInt(req.body.postId) };
    database.collection('thread_post').deleteOne(deleteinfo, function(err, context){

 
        var result = "삭제 완료되었습니다.";
        res.send ({result : result});


})
})



// ------------- 포스트 확인 ---------------// 맨 나중에 넣어야 함 (post_id 문자열 인식때문에)
router.get('/thread:thread_id/:post_id', function(req, res){ // : 로, 사용자가 입력한 문자[패러미터] 받음 .

    database.collection('thread_post').findOne({post_id : parseInt(req.params.post_id)}, function(err, context){ // thread_id에 따른 post_id 를 매핑해야함. 해당 쓰레드에 있는 해당 게시글. (그렇지 않으며녀 포스트 아이디가 다른 쓰레드 포스트 id와 중복됨)
        database.collection('thread_post').find({thread_id : parseInt(req.params.thread_id)}).toArray(function(err, context_another){

            database.collection('thread_post').updateOne({post_id : parseInt(req.params.post_id)}, {$inc: {post_Viewer:1}},function(err, Viewer_conetext){

                console.log("포스트 데이터"+context);
                database.collection('comment').find({post_id : parseInt(context.post_id)}).toArray( function(err, comment){
                    console.log (comment[0]);
                if ( req.user ){
                    res.render('postDetail.ejs',   {postData : context,
                        postlist : context_another,
                        gotime : timestamps.renderFunc,
                        thread_list : titleviewer.renderFunc,
                        userData : req.user.usr_id,
                        comment : comment})

                }else {
                res.render('postDetail.ejs',   {postData : context,
                                                postlist : context_another,
                                                gotime : timestamps.renderFunc,
                                                thread_list : titleviewer.renderFunc,
                                                userData : null,
                                                comment : comment}) };
                                            })
            })


            //응답.render('detail.ejs', {이런 이름으로 : 이런 데이터를}) ejs파일은 render를 해줘야 하니 필수
        })
    })
});





module.exports = router;