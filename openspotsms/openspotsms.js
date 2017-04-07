/*
Copyright 2017 GI7UGV

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var request = require('request');
var sha256 = require("js-sha256");

var token, digest, jwt;
var loginstatus=0;

module.exports = function(RED) {
	function OpenspotServerNode(n) {

		RED.nodes.createNode(this,n);
		var node = this;

//		this.server = "127.0.0.1";
        this.server = n.server;
        this.port = n.port;
        this.password = n.password;

		doLogin(node.password, node.server, node.port);

		var minutes = 20, the_interval = minutes * 60 * 1000;
		setInterval(function() {
				doLogin(node.password, node.server, node.port);
		}, the_interval);
    }
    RED.nodes.registerType("openspot-server",OpenspotServerNode);

	function SMSInNode(n) {
		RED.nodes.createNode(this,n);
		var node = this;

		this.openspotserver = n.openspotserver;
        this.osserverConfig = RED.nodes.getNode(this.openspotserver);

		this.server = n.server || this.osserverConfig.server;
		this.port = n.port || this.osserverConfig.port;
		this.password = n.password || this.osserverConfig.password;

        this.dstid = n.dstid;
        this.calltype = n.calltype;
        this.srcid = n.srcid;
		this.format = n.format;
		this.tomodem = n.tomodem;

		var url = "http://" + this.server + ":" + this.port + "/status-dmrsms.cgi";

		this.on('input', function(msg) {
			if (!jwt) {
				console.log("Not logged in, message not sent.");
				return;
			}

			var sms_msg = msg.payload;
			sms_msg = sms_msg.substring(0,75);

	        var options = {
	            url: url,
	            method: 'POST',
	            json: true,
	            headers: {	'Content-type': 'application/json',
							'Authorization': 'Bearer ' + jwt				
						 },
	            body: {	"only_save":0,
						"intercept_net_msgs":0,
						"send_dstid":this.dstid, 
						"send_calltype":this.calltype,
						"send_srcid":this.srcid,
						"send_format":this.format,
						"send_tdma_channel":0,
						"send_to_modem":this.tomodem,
//						"send_msg":"00540065007300740069006e0067002000540065007300740069006e00670020003100320033"
						"send_msg":toHex(sms_msg)
				}
   	     	}
			request(options, function (error, response, body) {
//					console.log(body)
				if (!error && response.statusCode == 200) { // add check for success
//					body.send_success;
				} else if (error) {
					console.log("SMS Post Failed");
					console.log(error);
				} else {
					console.log("SMS Post Failed");
				}
			})
		});
	}
    RED.nodes.registerType("openspot",SMSInNode);
}

function GetTok(host, port) {
    return new Promise(
    function (resolve, reject) {
		var digest;
		var token;

        var options = {
            url: 'http://'+host+':'+port+'/gettok.cgi',
            method: 'POST',
            json: true,
            headers: { 'Content-type': 'application/json' },
            body: { }
        }

        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body.token);
            } else if (error.code == "ENOTFOUND") {
				reject("DNS resolution of " + error.hostname + " failed");
            } else if (error) {
				loginstatus = "2"
                reject(error);
            } else {
				loginstatus = "2"
				reject("Token request failed for some reason.");
            }
        })
    });
}

function Login(token, digest, host, port) {
    return new Promise(
    function (resolve, reject) {
        var options = {
            url: 'http://'+host+':'+port+'/login.cgi',
            method: 'POST',
            json: true,
            headers: { 'Content-type': 'application/json' },
            body: { token: token, digest: digest}
        }

        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                jwt = body.jwt;
//                console.log("Token: "+ token + " Digest: " + digest + " JWT: " + jwt)
				loginstatus = "1";
                resolve(jwt);
            } else if (response.statusCode == 401) {
				loginstatus = "3";
				reject("Authentication failed with 401 response, check password.");
            } else if (error) {
				loginstatus = "3";
                reject(error);
            } else {
				loginstatus = "3";
                reject("Login request failed for some reason.");
            }
        })
    });
}

function toHex(str) {
	var hex = '';
	for(var i=0;i<str.length;i++) {
		hex += ("000"+str.charCodeAt(i).toString(16)).slice(-4); // UTF16BE
	}
	return hex;
}

function doLogin(password, host, port) {
        GetTok(host, port)
        .then(
            function (value) {
                    digest = sha256(value+password);
//                    console.log('Returned: ' + value + ' + ' + password + ' = digest ' +digest);
                    return Login(value, digest, host, port);
            },
            function (reason) {
                console.error('Something went wrong during token request:', reason);
        })
        .then(
            function (value2) {
                jwt = value2;
        },
		function (reason) {
                console.error('Something went wrong during authentication:', reason);
		});
}
