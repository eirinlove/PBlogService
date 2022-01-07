



mailpass = (mailname) => {

    var mailcheck = 0;
    database.collection('thread_post').findOne({post_id : parseInt(req.params.post_id)}, function(err, context){
        if(context){

        mailcheck = 0;
        }
        else if (!context){

            mailcheck = 1;
        }
        return context;
        })
    }
