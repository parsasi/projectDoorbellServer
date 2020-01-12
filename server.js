const formidable = require('formidable'),
http = require('http'),
fs = require('fs');
// DB = require('./db');
// const port = '8080' , host = '127.0.0.1';
const server = http.createServer(async (req,resp) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log('Reqested');
    try{
        if(req.url === '/'){
            if(req.method.toLowerCase() == 'post'){
                resp.statusCode = '200';
                resp.setHeader('content-type' , 'text/json');
                let form = new formidable.IncomingForm();
                form.parse(req, async (err, fields, files)  => {
                    if(!files.image){
                        resp.statusCode = '200';
                        resp.setHeader('content-type' , 'text/json');
                        resp.end(JSON.stringify({code : 1 , msg : 'No Image sent!'}));
                        console.log('No images');
                    }else{
                        const filePath = files.image.path;
                        const fileName =  files.image.name;
                        const destination = __dirname + '/uploads/' + fileName;
                        await fs.rename(filePath, destination,  async (err) => {
                            if (err) throw err;
                            // let lables = await visionAPI(destination);
                            resp.statusCode = 200;
                            resp.setHeader('content-type', ' text/plain');
                            console.log(upload);
                            resp.end(JSON.stringify({code : 0}));
                        });
                    } 
                });
            }
            else{
                resp.statusCode = '200';
                resp.setHeader('content-type' , 'text/html');
                resp.end('Doorbell Server !');
                console.log('Get request');
            }    
        }
    }catch(e) {
        resp.statusCode = '200';
        resp.setHeader('content-type' , 'text/json');
        resp.end(JSON.stringify({code : 1 , msg : e}));
        console.log('error');
    }
});
// server.listen(process.env.PORT);
const port = process.env.PORT || process.env.WEBSITES_PORT || 8080;
console.log('hi')
server.listen(port ,(err) => {
    if(!err){
        console.log('Server is listening on  ' + port);
    }else{
        console.log(err);
    }
});
