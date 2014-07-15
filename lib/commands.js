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
        var chosenCommand = Commands.COMMAND_LIST[command];
        this[chosenCommand.fn]();
    } else {
        this.emit('unknown_command');
    }
};

Commands.prototype.listUsers = function() {
    this.emit('list_users');
};

Commands.prototype.help = function() {
    this.emit('help', Commands.COMMAND_LIST);
};

Commands.COMMAND_LIST = {
    "users": {
        "fn": "listUsers",
        "dsc": "Shows users connected to the chat"
    },
    "help": {
        "fn" :"help",
        "dsc": "Shows this help"
    }
};

exports.Commands = Commands;