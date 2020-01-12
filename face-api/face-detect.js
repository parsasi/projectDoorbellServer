const { detectOptions } = require('./globals')
const { promPost } = require('./helpers')

module.exports.getFaceID = async (url) => {

  const options = {
    ...detectOptions,
    body: JSON.stringify({ url })
  }

  return (await promPost( options ))[0].faceId
}
