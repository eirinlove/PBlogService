const express = require('express');
var router = require('express').Router();
router.use('/public', express.static('public'));

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(process.env.DB_URL, function(err, client){
        database = client.db('todoapp');

});


router.post('/getComment', function(req,res){

    console.log('쿼리');
    database.collection('comment').find({post_id : parseInt(req.body.postId)} && {connection_id:{$eq:0}}).toArray(function(err, context){ // 부모가 없는 최상위 댓글
       
        database.collection('comment').find({post_id : parseInt(req.body.postId)} && {connection_id: {$gt:0}}).toArray(function(err,context_2){ // 부모가 있는 댓글

//console.log('포스트 id'+req.body.postId+'에 대한 쿼리 결과' + context[0]);
    //console.log('포스트 id'+req.body.postId+'의 깊이' + context_2[0].depth);

            res.send({PList : context, CList : context_2});

        
        })
        

    })
    

});


router.post('/commentSend', function(req,res){


database.collection('thread_counter').findOne({count:'카운트'}, function(err,context){
    let today =+ new Date();
    var saveinfo = {comment_id : context.totalComment+1, post_id:parseInt(req.body.postId), comment_context : req.body.textData, connection_id : 0, date : today, depth : 0, isDeleted : false, usr_id :req.user.usr_id, usr_Nname : req.user.usr_Nname }
    database.collection('comment').insertOne(saveinfo,function(err,context_2){
        database.collection('thread_counter').updateOne({count : "카운트"}, {$inc : { totalComment:1}}, function(err, context_3 ){

            var result = "성공";
            res.send ({result:result});



        })


    })
    })
})

module.exports = router;