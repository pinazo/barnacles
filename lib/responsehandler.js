/**
 * Copyright reelyActive 2015
 * We believe in an open Internet of Things
 */


var MESSAGE_OK = "ok";
var MESSAGE_NOTFOUND = "notFound";
var MESSAGE_BADREQUEST = "badRequest";
var MESSAGE_NOTIMPLEMENTED = "notImplemented";
var CODE_OK = 200;
var CODE_NOTFOUND = 404;
var CODE_BADREQUEST = 400;
var CODE_NOTIMPLEMENTED = 501;


/**
 * Prepares the JSON for an API response
 * @param {Number} status Integer status code
 * @param {Object} req The request
 * @param {Object} data The data to include in the response
 */
function prepareResponse(status, req, data) {
  var response = {};
  prepareMeta(response, status);
  if(req) {
    prepareLinks(response, req);
  }
  if(data) {
    prepareData(response, req, data);
  }
  return response;
};


/**
 * Prepares and adds the _meta to the given API query response
 * @param {Object} response JSON representation of the response
 * @param {Number} status Integer status code
 */
function prepareMeta(response, status) {
  switch(status) {
    case CODE_OK:
      response._meta = { "message": MESSAGE_OK,
                         "statusCode": CODE_OK };
      break;
    case CODE_NOTFOUND:
      response._meta = { "message": MESSAGE_NOTFOUND,
                         "statusCode": CODE_NOTFOUND };
      break; 
    case CODE_NOTIMPLEMENTED:
      response._meta = { "message": MESSAGE_NOTIMPLEMENTED,
                         "statusCode": CODE_NOTIMPLEMENTED };
      break;  
    default:
      response._meta = { "message": MESSAGE_BADREQUEST,
                         "statusCode": CODE_BADREQUEST }; 
  }
};


/**
 * Prepares and adds the _links to the given API query response
 * @param {Object} response JSON representation of the response
 * @param {Object} req The request
 */
function prepareLinks(response, req) {
  var rootUrl = req.protocol + '://' + req.get('host');
  var queryPath = req.originalUrl;
  var selfLink = { "href": rootUrl + queryPath };
  response._links = {};
  response._links["self"] = selfLink;
}


/**
 * Prepares and adds the data to the given API query response
 * @param {Object} response JSON representation of the response
 * @param {Object} req The request
 * @param {Object} data The data to include in the response
 */
function prepareData(response, req, data) {
  if(data.statistics) {
    response.statistics = data.statistics;
  }
}


module.exports.OK = CODE_OK;
module.exports.NOTFOUND = CODE_NOTFOUND;
module.exports.BADREQUEST = CODE_BADREQUEST;
module.exports.NOTIMPLEMENTED = CODE_NOTIMPLEMENTED;
module.exports.prepareResponse = prepareResponse;
