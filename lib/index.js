/*
    A simple server side api for nodejs
    (http://dplus.czz.com/)

    Copyright (c) 2015 CNZZ

    Released under the MIT license.
*/

var http            = require('http'),
    querystring     = require('querystring'),
    Buffer          = require('buffer').Buffer,
    util            = require('util');

var create_client = function(token, config) {
    var instance = {};

    if(!token) {
        throw new Error("The Dplus Client needs a Dplus token: `init(token)`");
    }

    instance.config = {
        test: false,
        debug: false,
        verbose: false
    };

    instance.token = token;

    /**
        send_request(data)
        ---
        this function sends an async GET request to dplus

        data:object                     the data to send in the request
        callback:function(err:Error)    callback is called when the request is
                                        finished or an error occurs
    */
    instance.send_request = function(endpoint, data, callback) {
        callback = callback || function() {};
        var event_data = new Buffer(JSON.stringify(data));
        var request_data = {
            'data': event_data.toString('base64'),
            'ip': 1,
            'verbose': instance.config.verbose ? 1 : 0
        };

        var request_options = {
            host: 'a.cnzz.com',
            headers: {}
        };

        if (instance.config.test) { request_data.test = 1; }

        var query = querystring.stringify(request_data);

        request_options.path = [endpoint,"?",query].join("");

        http.get(request_options, function(res) {
            var data = "";
            res.on('data', function(chunk) {
               data += chunk;
            });

            res.on('end', function() {
                var e;
                if(instance.config.verbose) {
                    try {
                        var result = JSON.parse(data);
                        if(result.status != 1) {
                            e = new Error("Dplus Server Error: " + result.error);
                        }
                    }
                    catch(ex) {
                        e = new Error("Could not parse response from Dplus");
                    }
                }
                else {
                    e = (data !== '1') ? new Error("Dplus Server Error: " + data) : undefined;
                }

                callback(e);
            });
        }).on('error', function(e) {
            if(instance.config.debug) {
                console.log("Got Error: " + e.message);
            }
            callback(e);
        });
    };

    /**
        track(event, properties, callback)
        ---
        this function sends an event to dplus.

        event:string                    the event name
        properties:object               additional event properties to send
        callback:function(err:Error)    callback is called when the request is
                                        finished or an error occurs
    */
    instance.track = function(event, properties, callback) {
        if (typeof(properties) === 'function' || !properties) {
            callback = properties;
            properties = {};
        }

        var endpoint = '/track/';

        properties.token = instance.token;
        properties.ali_lib = "node";

        var data = {
            'event' : event,
            'properties' : properties
        };

        if (instance.config.debug) {
            console.log("Sending the following event to Dplus:");
            console.log(data);
        }

        instance.send_request(endpoint, data, callback);
    };

    /**
        set_config(config)
        ---
        Modifies the dplus config

        config:object       an object with properties to override in the
                            dplus client config
    */
    instance.set_config = function(config) {
        for (var c in config) {
            if (config.hasOwnProperty(c)) {
                instance.config[c] = config[c];
            }
        }
    };

    if (config) {
        instance.set_config(config);
    }

    return instance;
};

// module exporting
module.exports = {
    init: create_client
};
