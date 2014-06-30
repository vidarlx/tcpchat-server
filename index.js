var ChatServer = require('./lib/ChatServer.js').ChatServer;

var srv = new ChatServer(3000);
srv.run();