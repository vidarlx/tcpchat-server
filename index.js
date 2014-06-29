var ChatServer = require('./lib/server.js').ChatServer;

var srv = new ChatServer(3000);
srv.run();