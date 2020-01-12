const { detectURI, subKey } = require('./globals')

const { promPost } = require('./helpers')

module.exports.getFaceID = async (url) => {

  const options = {
    uri: detectURI,
    qs: {
      returnFaceId: true,
      recognitionModel: 'recognition_02'
    },
    body: `{ "url": "${url}" }`,
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': subKey
    }
  }

  return await promPost( options )
}

// test
/* const imageURL = 'https://image.cnbcfm.com/api/v1/image/105608434-1543945658496rts28qzc.jpg'

;(async _ =>
  console.log( (await this.getFaceID( imageURL ))[0].faceId )
)()
 */
