var net = require('net');
var Commands = require('./commands.js').Commands;

var stdin =  process.stdin;
var stdout = process.stdout;

var ChatServer = function(port){
    this._port = port;
    this._users = [];
    this._commands = new Commands();
};

ChatServer.prototype.run = function() {
    var that = this;

    net.createServer(function(conn) {
        var nickname = false;

        console.log("Server is running on port", that._port);

        conn.on('data', onDataReceived);

        function onDataReceived(data) {
            var hex = data.toString('hex');

            //check if is this the connection message from telnet
            if(that._isTelnetConnection(hex)) {
                console.log('User connected from telnet client');
                conn.write('Hello. Type your name: ');
            } else {
                data = data.toString().replace('\r\n', '');

                //get user name - it's his first message
                if(!nickname) {
                    if(that._userExists()) {
                        conn.write('Username exists. Please type another one: ');
                    } else {
                        nickname = data;
                        that._users[data] = conn;
                        that.broadcast("User " + nickname + " joined chat \r\n", true);
                        insertPrompt(conn);
                    }

                } else {
                    if(that._isCommand(data)) {
                        that._processCommand(data);
                    } else {
                        that.broadcast(nickname + ': ' + data);
                    }
                    insertPrompt(conn);
                }
            }
        }

        that._commands.addListener('list_users', function() {
            var users = Object.keys(that._users);
            conn.write(users.join(', ') + '\r\n');
        });

        that._commands.addListener('unknown_command', function() {
            conn.write('*** Unknown command');
        });

    }).listen(this._port);

    function insertPrompt(conn) {
        conn.write('\r\n> ');
    }
}

ChatServer.prototype._isTelnetConnection = function(hex) {
    if(hex == ChatServer.TELNET_CONNECTION_BUFFER) {
        return true;
    }

    return false;
};

ChatServer.prototype._userExists = function(username) {
    if(typeof this._users[username] != "undefined") {
        return true;
    }

    return false;
};

ChatServer.prototype._isCommand = function(msg) {
    if(ChatServer.COMMAND_PATTERN.test(msg)){
        return true;
    }
    return false;
};

ChatServer.prototype._processCommand = function(msg) {
    var commandParams = ChatServer.COMMAND_PATTERN.exec(msg);
    var command = commandParams[1];
    var params = '';
    if(commandParams[2]) {
        params = commandParams[2].trim().split(' ');
    }

    this._commands.runCommand(command, params);
};

ChatServer.prototype.broadcast = function(msg, system) {
    if(system) {
        msg = "*** " + msg;
    }
    for(user in this._users) {
        this._users[user].write(msg + "\r\n");
    }
};

ChatServer.TELNET_CONNECTION_BUFFER = "fffb1ffffb20fffb18fffb27fffd01fffb03fffd03";
ChatServer.COMMAND_PATTERN = /\/([a-z0-9]+)(\s.*)*/;

exports.ChatServer = ChatServer;
