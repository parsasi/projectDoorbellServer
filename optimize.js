const otReq = (resp,code,contentType,value) => {
    resp.statusCode = code;
    resp.setHeader = {'content-type' : contentType};
    resp.write(value);
}
module.exports = {otReq};
