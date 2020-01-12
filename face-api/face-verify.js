const { verifyOptions } = require('./globals')
const { getFaceID } = require('./face-detect')
const { promPost } = require('./helpers')

module.exports.sameFace = async (url1,url2) => {

  const faceIds = {
    faceId1: await getFaceID( url1 ),
    faceId2: await getFaceID( url2 )
  }

  const options = {
    ...verifyOptions,
    body: JSON.stringify( faceIds ),
  }

  return await promPost( options )
}

// test
/* const imageURL1 = 'https://image.cnbcfm.com/api/v1/image/105608434-1543945658496rts28qzc.jpg'
const imageURL2 = 'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/ilGD1mX1K7i0/v1/1000x-1.jpg'

;(async _ =>
  console.log( (await this.sameFace( imageURL1, imageURL2 )) )
)()
 */
