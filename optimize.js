const otReq = (resp,code,contentType,value) => {
    resp.statusCode = code;
    resp.setHeader = {'content-type' : contentType};
    return resp;
}
module.exports = {otReq};
