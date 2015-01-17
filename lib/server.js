/**
 * Copyright reelyActive 2014
 * We believe in an open Internet of Things
 */


var util = require('util');
var events = require('events');
var eventsManager = require('./eventsmanager');
var google = require('./services/google');
var mnubo = require('./services/mnubo');
var webroad66 = require('./services/webroad66');


/**
 * Barnacles Class
 * Detects events and sends notifications.
 * @param {Object} options The options as a JSON object.
 * @constructor
 */
function Barnacles(options) {
  options = options || {};
  var self = this;

  this.eventsManager = new eventsManager(options);
  this.services = {};

  emitEvents(self);

  console.log("reelyActive Barnacles instance is notifying an open IoT");
  events.EventEmitter.call(this);
};
util.inherits(Barnacles, events.EventEmitter);


/**
 * Bind to the given data stream.
 * @param {Object} options The options as a JSON object.
 */
Barnacles.prototype.bind = function(options) {
  options = options || {};
  var self = this;

  if(options.barnowl) {
    options.barnowl.on('visibilityEvent', function(tiraid) {
      self.eventsManager.handleTiraid(tiraid);
    });
  }    
}


/**
 * Add a service to notify.
 * @param {Object} options The options as a JSON object.
 */
Barnacles.prototype.addService = function(options) {
  options = options || {};
  var self = this;

  switch(options.service) {
    case "google":
      self.services.google = new google( 
        { eventsManager: self.eventsManager,
          hostname: options.hostname,
          accountId: options.accountId }
      );
      break;
    case "mnubo":
      self.services.mnubo = new mnubo( 
        { eventsManager: self.eventsManager,
          hostname: options.hostname,
          port: options.port,
          authorization: options.authorization,
          clientId: options.clientId }
      );
      break;
    case "webroad66":
      self.services.webroad66 = new webroad66( 
        { eventsManager: self.eventsManager,
          hostname: options.hostname,
          port: options.port }
      );
      break;
    default:
      console.log("Unsupported service: " + options.service);
  }
}

/**
 * Add a service instance to notify. This brings more flexibility to insert any service from the callsite.
 * @param {String} name A name to identify the service on the list of services.
 * @param {Object} service A instance of a customized service.
 */
Barnacles.prototype.addServiceInstance = function(name, service) {
    this.services[name] = service;
}

/**
 * Get the current state of events.
 * @param {Object} options The options as a JSON object.
 * @param {callback} callback Function to call on completion.
 */
Barnacles.prototype.getState = function(options, callback) {
  options = options || {};
  var self = this;

  self.eventsManager.getState(options, callback);    
}


/**
 * Emit all events emitted by the eventsManager
 * @param {Barnacles} instance The given instance.
 */
function emitEvents(instance) {
  instance.eventsManager.on('appearance', function(tiraid) {
    instance.emit('appearance', tiraid);
  });
  instance.eventsManager.on('displacement', function(tiraid) {
    instance.emit('displacement', tiraid);
  });
  instance.eventsManager.on('disappearance', function(tiraid) {
    instance.emit('disappearance', tiraid);
  });
}

module.exports = Barnacles;
