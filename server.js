const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
var database;

var cryp = require('./function/saltcrypt');



const { ObjectId } = require('mongodb');
const http = require('http').createServer(app);
const { Server } = require("socket.io"); //웹 소켓 이용
const io = new Server(http);

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


app.set('view engine', 'ejs');

require('dotenv').config();



app.use('/public', express.static('public'));  // 미들웨어 static파일 보관하기위해 public 폴더 쓸겁니다., 정적 import 파일들 관리 가능, css같은것
app.use('/function', express.static('function')); 

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(process.env.DB_URL, function(err, client){
        database = client.db('todoapp');

});


      

http.listen(8085, function(){
        
        console.log('정답')
});






app.get('/pet', function(req, res){ // 콜백 함수
        res.send('하이');
});


app.get('/jong', function(req,res){
        res.send('중고나라');


});

app.get('/', function(req,res){
        
        
        //res.sendFile(__dirname + '/index.ejs')
        res.render('index.ejs', {user_name : req.user});
        

});

app.get('/write', function(req,res){
        
       //res.sendFile(__dirname + '/write.html')
        res.render('write.ejs', {});

});





// /list로 GET요청으로 접속하면
// 실제 DB에 저장된 데이터들로 꾸며진 HTML을 보여줌



app.get('/list', function(req,res){

// DB에 저장된post라는 collection 안의 모든 데이터를 꺼내줘. // list.ejs에서 post단어를 posts로 치환해줘
database.collection('post').find().toArray(function(err, context){
        res.render('list.ejs', {posts : context});
        console.log(context);
        
})

});





app.get('/modify', function(req, res){

        console.log("text!"+req.body); // 요청받은 요청의 body를 가져옴, 
        req.body._id = parseInt(req.body._id);
        res.redirect('/edit/'+req.body._id);

});



app.get('/detail/:id', function(req, res){ // : 로, 사용자가 입력한 문자[패러미터] 받음 .

        database.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, context){ // 받은 문자를 받게됨,  위에 get 한 것.  parseint로 String을 Int로 변환

                console.log(context);

                res.render('detail.ejs', {data : context}); // data object를 정의해서 detail.ejs 에서 읽어올 수 있게 함.

                //응답.render('detail.ejs', {이런 이름으로 : 이런 데이터를}) ejs파일은 render를 해줘야 하니 필수

        })


       
        
        
});


app.get('/edit/:id', function(req,res){


        database.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, context){
                console.log(context);
                res.render('edit.ejs', { post : context } )
                

        })
        

})


app.put ('/edit', function(req,res){

//폼에 담긴 제목 데이터, 날짜데이터를 가지고 database.collection에다가 업데이트


database.collection('post').updateOne({_id : parseInt(req.body.id)}, {$set : { 게임이름 : req.body.game, 게임내용 : req.body.context}}, function(err, context){ // UpdateOne은 (어떤게시물수정?, 수정값, 콜백함수)
// $set은 오퍼레이터, ?을 업데이트 해주고, 없으면 추가한다.
// edit.ejs에서 input hidden 으로 name이 id인 걸 보내줬으니(해당 id의 value를 검색하게 된다.), req.body.id 이가 된다.
console.log('수정완료');
res.redirect('/list');

});



});

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
app.use(session({secret : '비밀코드', resave : true, saveUninitialized :  false})); 
app.use(passport.initialize());
app.use(passport.session()); // 요청과 응답 사이 동작


app.get('/login', function(req,res){

        res.render('login.ejs');

});


app.post('/login', passport.authenticate('local',{
        failureRedirect : '/fail'   // 로그인을 실패할 경우, /fail로 이동

}), function(req,res){ //passport-> 로그인 기능 단축 구현, 인증 메서드 사용

res.redirect('/'); //응답(인증) 성공의 경우.
});



app.get('/mypage', login_check,  function(req, res){ //login_check 는 미들웨어,,, req.user가 있으면 /mypage의 해당 내용을 보여줌
        
        console.log("유저정보"+req.user);
        res.render('mypage.ejs' , { user_name : req.user });
        
});

function login_check(req, res, next){ //미들웨어 생성

        if(req.user){ //요청.user가 있으면 통과 이걸 이용해서 관리자나 특정인물만 통과도 가능.

                next();
        }else{ // 요청.user가 없으면 에러 메시지.
                res.send('왜 로그인 안함?');
        }
}

function admin_check(req, res, next){ //미들웨어 생성

        if(req.user.id == 'admin'){ //요청.user가 있으면 통과 이걸 이용해서 관리자나 특정인물만 통과도 가능.

                next();
        }else{ // 요청.user가 없으면 에러 메시지.
                res.send('관리자가 아니네요');
        }
}

passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'pw',
        session: true,
        passReqToCallback: false,
      }, function (입력한아이디, 입력한비번, done) {
        console.log(입력한아이디, 입력한비번);
        database.collection('login').findOne({ id: 입력한아이디 }, function (에러, 결과) {
          if (에러) return done(에러)
      
          if (!결과) return done(null, false, { message: '존재하지않는 아이디요' }) // done(서버에러, 성공시 사용자 DB데이터, 에러메시지) 
          if (입력한비번 == 결과.pw) { // 암호화 하여야 함 
            return done(null, 결과)
          } else {
            return done(null, false, { message: '비번틀렸어요' })
          }
        })
      }));

      passport.serializeUser(function(user, done){
              done(null, user.id);
      });

//세션 등록[저장], 로그인 성공시. idㄹ르 이용해서 세션 생성, 그리고 쿠키로 보냄.
      passport.deserializeUser(function(id_s, done){ 
             
        database.collection('login').findOne({id : id_s }, function(err, context){
                done(null, context);
                console.log(context)
        })
         //db에서 위에 있는 user.id로 유저를 찾은 뒤에 유저 정보를 

      });
//세션 해제, 마이페이지등 접속시 

// 세션 라이브러리를 불러오고 미들웨어 설정


app.post('/register', function(req, res){

        database.collection('login').insertOne( { id : req.body.id, pw : req.body.pw }, function(err, context){ // 중복 방지기능 추가하기.

                res.redirect('/')
        })
})


app.post('/add', function(req,res){  //POST요청 받음
        //res.send('전송완료')

        res.render('add_context.ejs', {});
        console.log("게임명은 "+req.body.game + " 게임내용은" + req.body.context + " 입력") //body의 데이터이름 game 을 받아옴.
        //db에 저장.
        database.collection('counter').findOne({count : '게시물 갯수'}, function(err, context){//findOne 함수는 데이터 하나만 찾음, 
                console.log(context.totalPost)
                var postcount = context.totalPost;
                var saveinfo = { _id : context.totalPost + 1 , 게임이름 : req.body.game, 게임내용: req.body.context, id_a : req.user._id, id_b : req.user.id}

                database.collection('post').insertOne(saveinfo, function(err, context){ //object 자료형으로 저장
                        console.log('저장완료'); // id = 총게시물갯수(지워진것 제외안함) +1; Autoincrement 기능 
                        database.collection('counter').updateOne({count:'게시물 갯수'},{ $inc: {totalPost:1}},function(err, context){

                                if(err) {return console.log(err)}

                        }) //어떤데이터 수정?, 수정값, 오퍼레이터(연산자, 중괄호 한번 더 감싸기 유의) 



        }); 


        
})
});

app.delete('/delete', function(req, res){

        console.log(req.body); // 요청받은 요청의 body를 가져옴, 
        req.body._id = parseInt(req.body._id);
        

        var deleteinfo = { _id : req.body._id, id_a : req.user._id }

        if (req.body._id_a == req.user._id){
        database.collection('post').deleteOne(deleteinfo, function(err, context){

        
                console.log('삭제완료' + '작성자 ' + req.user._id );

               
               
               
                res.status(200).send({ message : '성공했습니다'}); //코드 200라는 응답을 반환.
               //res.status(400).send({ message : '실패예시'}); //코드 400라는 응답을 반환.
        
        });
} else { console.log ('삭제 게시글 주인 : '+req.body._id_a+', 현재 사용자 : ' +req.user._id+' 삭제 실패')}
//_id_a 는 list의 delete 함수에서 보내진 postoran2 = data-object임, 이는 list.ejs로 보내진 값을 다시 받은거임.
});




app.get('/search', (req,res) => {
        console.log(req.query.value) // 요청받은,. query에 저 문장이 들어가있음.
        //database.collection('post').find({$text: { $search: req.query.value}}).toArray((err, context)=> //mongodb atlas 에서 생성한 인덱스를 서치함
        // 기본적으로 or 검색으로 작동 " " 사이에 정확한 단어,  -에 뒤에 결과 배제 이런식으로 한 다리 더 건너서 추가필터 만들 수 있음.
        var condition = [ // 키 쌍값 형태로 생성
                {
                        $search: {
                                index : 'titleSearch', //인덱스 명
                                text :  {
                                        query: req.query.value,
                                        path: '게임이름'
                                }
                        }
                },
                { $sort : { _id : -1 } } 

        ]
        database.collection('post').aggregate(condition).toArray((err, context)=>
        {
                 

                
                console.log(context)
                res.render('search.ejs', {posts : context } ); //search.ejs 에 posts를 반환해 결과물을 출력하도록 함.

        })
        // req내 query내 오브젝트 value 일치값 확인
})      // find는 정확한 텍스트만 찾아줌.


app.get('/upload', function(req,res){

res.render('upload.ejs');
})

//app.post ( '/upload', upload.single("imagefile"), function(req, res){
app.post ( '/upload', upload.array("imagefile", 5), function(req, res){ //숫자 패러미터는 파일 최대개수
        res.send('업로드 완료');
} )


app.get('/images/:imageName', function(req,res){

        res.sendFile( __dirname + '/public/images/' + req.params.imageName)
})



app.get('/chat', login_check, function(req, res){


database.collection('chatroom').find({ member : req.user._id} ).toArray().then((context)=>{ //array안에 있는 만족하는 _id 를 찾아와라
        res.render('chat.ejs', { data : context });

})

});

app.post ( '/chatroom' ,login_check, function(req, res){ //숫자 패러미터는 파일 최대개수
        

        var savepoint = {

                title : '토론방',
                member : [ObjectId(req.body.owner_id), req.user],
                date : new Date()
        }

        database.collection('chatroom').insertOne(savepoint).then((context)=>{
                res.send('접속');
        })
        
});

app.get('/chat_admin', function(req,res){

        res.render('chat_admin.ejs');
        })

app.get('/tm', function(req,res){

        res.render('testmail.ejs', {cryptos : cryp.renderFunc});
})

app.get('/register', function(req,res){

        res.render('register.ejs');
})


app.use('/blog', require('./routes/blog.js')); //app.use는 미들웨어(패키지) 사용  -> 요청 응답사이에 실행됨
app.use('/board/sub', require('./routes/board.js')); 
app.use('/thread', require('./routes/thread.js'));
app.use('/mail', require('./auth.js'));
// blog 로 접속하면, blog.js 로 라우팅을 하게 만듬
// 검색 결과 페이지 만들기.