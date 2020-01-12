const { detectOptions } = require('./globals')
const { promPost } = require('./helpers')

module.exports.getFaceID = async (url) => {

  const options = {
    ...detectOptions,
    body: `{ "url": "${url}" }`,
  }

  return await promPost( options )
}
