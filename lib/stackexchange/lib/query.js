'use strict';

var SocksProxyAgent = require('socks-proxy-agent')
  , config = require('./config')
  , parser = require('./parser')
  , request = require('request')
  , url = require('url')
  , log = require('simple-node-logger').createSimpleLogger()
  , agent = require('../../socks-proxy')();

/**
 * Execute a query after checkign if criteria are available.
 *
 * @param {String} destination query method
 * @param {Object} criteria parameters to query against
 * @param {Function} callback return results
 * @api private
 */
module.exports = function query (destination, criteria, callback) {
  if (!callback) return log.critical('No callback supplied for: ' +  destination);

  // Query against the predefined website and construct the endpoint.
  //criteria.site = config.get('site');
  var opt = {
      protocol: config.get('protocol')
    , host: config.get('api')
    , pathname: '/' + config.get('version') + '/' + destination
    , query: criteria
  };

  if(agent){
    opt['agent'] = agent;
  }

  var endpoint = url.format(opt);

  // Execute the request on proper response call callback.
  request(
      { url: endpoint, encoding: null }
    , function response (error, res) {
		if (error) {
			callback(error);
		}
        else {
			parser.parseBody.call(this, res.body, callback);
		}
      }
  );

};
