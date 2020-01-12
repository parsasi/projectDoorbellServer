const formidable = require('formidable'),
http = require('http'),
fs = require('fs');
const fd = require('./face/facedetection');
const { resolve, basename } = require('path');
const sameFace = require('./face-api/face-verify').sameFace;
const DB = require('./db');
const database = new DB('db.json');
const log = new DB('log.json');
const host = 'https://immense-harbor-93861.herokuapp.com/';
const port = process.env.PORT || process.env.WEBSITES_PORT || 8080;
const notify = require('./pusher/notif').notify;
const server = http.createServer(async (req,resp) => {
    resp.setHeader('Access-Control-Allow-Origin', '*');
    console.log(req.url);
    try{
        if(req.url === '/'){
            if(req.method.toLowerCase() == 'post'){
                resp.statusCode = '200';    
                resp.setHeader('content-type' , 'text/json');
                let form = new formidable.IncomingForm();
                form.uploadDir = resolve(__dirname, 'upload');
                form.parse(req, async (err, fields, files)  => {
                    if(!files.webcam){
                        resp.statusCode = '200';
                        resp.setHeader('content-type' , 'text/json');
                        resp.end(JSON.stringify({code : 1 , msg : 'No Image sent!'}));
                    }else{
                        const uploadedFileName = basename(files.webcam.path);
                        resp.statusCode = '200';
                        resp.setHeader('content-type' , 'text/json');
                        resp.end(JSON.stringify({code : 1 , msg : 'Images saved' , url : host + ':' + port + '/' + uploadedFileName }));
                        let profileName = 'An unknown person';
                        let profileId = 0;
                        database.list()
                        .then(personList => {
                            const promises = [];
                            personList = JSON.parse(personList);
                            for(person of personList){
                                // console.log('item',item);
                                // console.log('item url : ' + item.URL , '\n' , 'Host name : ' + host + 'photo/' + uploadedFileName)
                                promises.push( sameFace(person.URL , host + 'photo/' + uploadedFileName) );
                            }
                            Promise.all( promises )
                            .then(resultsArr => {
                                for ( result of resultsArr ) {
                                    if(result.isIdentical === true){
                                        console.log(result);
                                        const index = resultsArr.indexOf(result);
                                        profileName = personList[index].name;
                                        profileId = personList[index].id;
                                        notify(profileName , profileId);
                                        let today = new Date();
                                        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + today.getMinutes() + '-' + today.getHours();
                                        log.add({
                                            URL : host + 'photo/' +uploadedFileName,
                                            profileName , 
                                            profileId , 
                                            time : date
                                        })
                                        .then(result => console.log('Log : ' , result))
                                        .catch(e => console.log('Log Error : ' , e));
                                        return;
                                    }
                                }
                                notify(profileName , profileId);
                            })
                            .catch(e => console.log(e));
                        })
                        .catch(e => console.log(e))
                    } 
                });
            }
            else{
                resp.statusCode = '200';
                resp.setHeader('content-type' , 'text/html');
                resp.end('Welcome to Doorbell Server 2 !');
                console.log('Get request');
            }    
        } else if (req.url.startsWith('/photo')) {
            try{
                const file = req.url.split('/')[2];
                const stream = fs.createReadStream(resolve(__dirname, 'upload', file));
                stream.pipe(resp);
            }catch{
                resp.statusCode = '200';
                resp.setHeader('content-type' , 'text/html');
                resp.end('File not found');
            }
        }else if(req.url.includes('/profiles')){
            resp.statusCode = '200';
            resp.setHeader('content-type' , 'text/html');
            database.list()
            .then(result => {
                resp.end(result);
            })
            .catch(e => resp.end({msg : e}));
        }else if(req.url.includes('/profile')){
            resp.statusCode = '200';
            resp.setHeader('content-type' , 'text/html');
            let urlArray =  req.url.split('/');
            let id = urlArray[urlArray.length - 1];
            database.find(id)
            .then(result => resp.end(JSON.stringify(result)))
            .catch(e => resp.end(JSON.stringify(e)))

        }else if(req.url === '/favicon.ico'){
            resp.writeHead(200, {'Content-Type': 'image/x-icon'} );
            resp.end();
        } else if(req.url.includes('/log')){
            resp.statusCode = '200';
            resp.setHeader('content-type' , 'text/json');
            log.list()
            .then(result => {
                resp.end(result);
            })
            .catch(e => resp.end({msg : e}));
        }
    }catch(e) {
        resp.statusCode = '200';
        resp.setHeader('content-type' , 'text/json');
        resp.end(JSON.stringify({code : 1 , msg : e.message}));
        console.log('error');
    }
});
server.listen(port ,(err) => {
    if(!err){
        console.log('Server is listening on  ' + port);
    }else{
        console.log(err);
    }
});
