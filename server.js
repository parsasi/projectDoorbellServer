const formidable = require('formidable'),
http = require('http'),
fs = require('fs');
// DB = require('./db');
const port = '8080' , host = '127.0.0.1';
const server = http.createServer(async (req,resp) => {
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
                    }else{
                        const filePath = files.image.path;
                        const fileName =  files.image.name;
                        const destination = __dirname + '/uploads/' + fileName;
                        await fs.rename(filePath, destination,  async (err) => {
                            if (err) throw err;
                            // let lables = await visionAPI(destination);
                            resp.statusCode = 200;
                            resp.setHeader('content-type', ' text/json');
                            resp.end(JSON.stringify({code : 0}));
                        });
                    } 
                });
            }
            else{
                resp.statusCode = '200';
                resp.setHeader('content-type' , 'text/json');
                resp.end(JSON.stringify({code : 1 , msg : 'Get request sent!'}));
            }    
        }
    }catch(e) {
        resp.statusCode = '200';
        resp.setHeader('content-type' , 'text/json');
        resp.end(JSON.stringify({code : 1 , msg : e}));
    }
});

server.listen(port,host,(err) => {
    if(!err){
        console.log('Server is listening on  ' + port);
    }else{
        console.log(err);
    }
});
