# node-red-contrib-openspotsms

A Node-Red module to allow DMR SMS messages to be sent using the SharkRF openSPOT.

This node will take a text string and send an SMS message to the configured DMR radio via the openSPOT HTTP API.

An earlier implementation of this is described in the blog post linked below where it was being used to send SMS messages to the DMR ID on a new DXCC spots. 

https://x8x.net/2016/09/27/dmr-sms-alerts-using-the-sharkrf-openspot-with-node-red/

John - GI7UGV

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
