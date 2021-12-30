exports.renderFunc = 

       function timeShift(timeStamp){
        var date = new Date();
        /*alert(date.getFullYear()+"."+(date.getMonth()+1)+"."+date.getDate()); 
        date = new Date(1607110465663);
        alert(date.getFullYear()+"."+(date.getMonth()+1)+"."+date.getDate());*/

        return date.getFullYear()+"."+(date.getMonth()+"."+date.getDate());
    }
