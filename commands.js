var EventEmitter = require('events').EventEmitter;

var Commands = function() {

};

Commands.prototype = Object.create(EventEmitter.prototype);

Commands.prototype.commandExists = function(command) {
    if(Commands.COMMAND_LIST[command]) {
        return true;
    }
    return false;
};

Commands.prototype.runCommand = function(command) {
    if(this.commandExists(command)) {
        var fn = Commands.COMMAND_LIST[command];
        this[fn]();
    } else {
        this.emit('unknown_command');
    }
};

Commands.prototype.listUsers = function() {
    this.emit('list_users');
};

Commands.COMMAND_LIST = {
    "users": "listUsers"
};

exports.Commands = Commands;