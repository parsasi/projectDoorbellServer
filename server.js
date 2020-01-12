const formidable = require('formidable'),
http = require('http'),
fs = require('fs');
const fd = require('./face/facedetection');
const { resolve, basename } = require('path');
const sameFace = require('./face-api/face-verify').sameFace;
const DB = require('./db');
let database = new DB('db.json');
const host = process.env.PUBLIC_URL || '127.0.0.1';
const port = process.env.PORT || process.env.WEBSITES_PORT || 8080;
const server = http.createServer(async (req,resp) => {
    resp.setHeader('Access-Control-Allow-Origin', '*');
    console.log(req.url);
    try{
        console.log(req.method, req.url);
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
                        // console.log(sameFace(__dirname + '/photo/'+ 'upload_05c0ccb29ee27ba000b27dc756fe25c3' , __dirname + '/photo/'+ 'upload_1002d53e3edf5de5ef10c57a108b0fd9'));
                    } 
                });
            }
            else{
                resp.statusCode = '200';
                resp.setHeader('content-type' , 'text/html');
                resp.end('Doorbell Server !');
                console.log('Get request');
            }    
        } else if (req.url.startsWith('/photo')) {
            const file = req.url.split('/')[2];

            const stream = fs.createReadStream(resolve(__dirname, 'upload', file));

            stream.pipe(resp);
        }else if(req.url.includes('/profile')){
            resp.statusCode = '200';
            resp.setHeader('content-type' , 'text/html');
            database.list()
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
