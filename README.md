# node-red-contrib-openspotsms

A node to allow SMS messages to be passed to a sharkrf openSPOT using its HTTP API.

This node takes a text string and will send it to a configured DMR ID via a configured openSPOT.

A number of openSPOT devices could be configured, each will request a new token every 20 minutes.

- GitHub:  https://github.com/jayge/node-red-contrib-openspotsms

## Dependencies 

js-sha256
request

## Settings

openSPOT - Configure the openSPOT server.
Destination - DMR Destination ID number, this might be your own radio ID connected to the openSPOT.
Source - DMR Source ID number.
Format - Configure openSPOT SMS message format.
To Modem - Sends over the RF (true) or the network (false).
Name - Node name, leave blank for default.

Host/IP - Hostname or IP, openspot by default on local network.
Port - Port number, 80 by default.
Password - openSPOT password, openspot by default.

## TODO

* Status indicators
* Add credential type
* All configurable settings
* Better error handling
* Comments
* Receive SMS
