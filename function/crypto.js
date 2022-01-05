// 비밀번호 암호화용 

const crypto = require('crypto');

exports.renderFunc = 



//ES5문법
/*function cryp(password){

    var a = crypto.createHash('sha512').update(password).digest('base64');

return a;
}*/




/*const base64crypto = password => {
    console.log(crypto.createHash('sha512').update(password).digest('base64'))
    base64crypto('1234');
    base64crypto('1234');
  
}*/

 // ES6 문법

base64crypto = (password) => { 

return crypto.createHash('sha512').update(password).digest('base64');

}