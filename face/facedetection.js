"use strict";

const request = require("request-promise");
const constants = require("./constants");

const formatOptions = (uri, params, body) => {
  const options = {
    uri: uri,
    qs: params,
    body: body,
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": constants.subscriptionKey
    },
    json: true
  };
  return options;
}

module.exports.getFaceId = async (imageUrl) => {
  const baseUrl = `${constants.baseUrl}/detect`;
  const body = {
    url: imageUrl
  };
  const options = formatOptions(baseUrl, {}, body);

  const result = request.post(options)
    .then((response) => {
      const jsonObj = response[0];
      console.log(`getFaceId response: ${jsonObj.faceId}`);
      return jsonObj.faceId;
    })
    .catch((error) => {
      console.error(error);
      return;
    });
  return result;
}

module.exports.identifyFace = async (imageUrl) => {
  const faceId = await this.getFaceId(imageUrl);

  const baseUrl = `${constants.baseUrl}/identify`;
  const body = {
    faceIds: [faceId],
    personGroupId: constants.personGroupId,
    maxNumOfCandidatesReturned: 1
  };
  const options = formatOptions(baseUrl, {}, body);

  request.post(options, (error, response, body) => {
    if (error) {
      console.log("Error: ", error);
      return;
    }
    const jsonObj = body[0];
    console.log(`identifyFace response: ${JSON.stringify(jsonObj)}`);
  });
}