const data = require('./threadlist.json'); //json 파일 로딩

exports.renderFunc = 

       /*function titleViewer(thread_id){
       
        var titlename = "ㅇㅇㅇ";
       database.collection('thread_list').findOne({thread_id : parseInt(thread_id)}), function(err, context){ 
   


        titlename = "ㄹㄹㄹ";
        
       
        
       }
         };*/

  
       function titleViewer(thread_id){
        
        for(i=0; i<=data.length; i++ ){

        if(data[i].id == thread_id ){

            console.log("값은"+data[i].name); 
            return data[i].name;
        }
        //json에 등록된 이름 조회, json 배열을 순서대로 읽어들이면서, Thread의 타이틀명을 검색 함.
    }
        
        

       }

       
  
     
