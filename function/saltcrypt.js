const crypto = require('crypto');
//import crypto from 'crypto';


const createSalt = () =>
    new Promise((resolve, reject) => {

        crypto.randomBytes(64, (err,buf ) => {

            if(err) reject(err);
            resolve(buf.toString('base64')); // randomBytes 메서드를 통해 Salt를 반환한다 ( 유저에게 줄 salt)
        
        
        })

    });

    exports.renderFunc = 

        createHashedPassword = (plainPassword) => 
        new Promise(async (resolve, reject) => {

            const salt = await createSalt(); //위 함수에서 만들어진 salt를 정의
            crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) =>{ // 평문패스워드, 솔트, 키스트레칭, 바이트, 암호화방식
                if(err) reject(err);
                resolve({ password : key.toString('base64'),salt});
               
            })
        })


        //랜덤 salt를 만들어서 -> hash패스워드에 대입한다.
        // 그리고 평문문 패스워드를 salt를 입혀 해시 암호화 한다.