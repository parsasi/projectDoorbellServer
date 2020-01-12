const { post } = require('request')

module.exports.promPost = (options) => new Promise( (res,rej) =>
  post( options, (_,__,body) => res( JSON.parse(body) ) )
)
