# node-red-contrib-openspotsms

A node to allow DMR SMS messages to be passed to a SharkRF openSPOT using its HTTP API.

This node takes a text string and will send it to a DMR ID via a configured openSPOT.

A number of openSPOT devices could be configured, a new token is requested every 20 minutes.

- GitHub:  https://github.com/jayge/node-red-contrib-openspotsms

## Install

Enter your node-red directory then install with npm, eg:

    cd $HOME/.node-red
    npm install node-red-contrib-openspotsms

## Dependencies 

* js-sha256
* request

## Settings

SMS Node 

* `openSPOT` - Configure the openSPOT server.
* `Destination` - DMR Destination ID number, this might be your own radio ID connected to the openSPOT.
* `Source` - DMR Source ID number.
* `Format` - Configure openSPOT SMS message format.
* `To Modem` - Sends over RF (true) or the network (false).
* `Call Type` - Private or Group.
* `Name` - Node name, leave blank for default.

Server Settings

* `Host/IP` - Hostname or IP, openspot by default on local network.
* `Port` - Port number, 80 by default.
* `Password` - openSPOT password, openspot by default.

## TODO

* Status indicators
* Add credential type
* Better error handling/logging
* Comments
* Receive SMS
