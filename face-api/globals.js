const subKey = '6945f37b9bd444d4a3384a2ff1a2b336'
const detectURI = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect'
const verifyURI = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/verify'

const detectParams = {
  returnFaceId: true,
  recognitionModel: 'recognition_02'
}

const headers = {
  'Content-Type': 'application/json',
  'Ocp-Apim-Subscription-Key': subKey
}

module.exports.detectOptions = {
  uri: detectURI,
  headers,
  qs: detectParams
}

module.exports.verifyOptions = {
  uri: verifyURI,
  headers
}
