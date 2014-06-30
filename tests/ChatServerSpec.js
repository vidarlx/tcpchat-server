var net = require('net');

describe("ChatServer", function() {
    describe("principal tests", function() {
        it("should require Commands class", function() {
            var ChatServer = require('../lib/ChatServer.js').ChatServer;
            expect(ChatServer).toBeTruthy();
        });

        it("should create Commands object", function() {
            var ChatServer = require('../lib/ChatServer.js').ChatServer;

            var srv = new ChatServer();
            expect(typeof srv._commands).toEqual('object');
        });
    });

    describe("methods", function() {
        var ChatServer = null;
        var srv = null;

        beforeEach(function() {
            ChatServer = require('../lib/ChatServer.js').ChatServer;
            srv = new ChatServer();

            spyOn(net, 'createServer').andCallFake(function() {
                console.log('test');
            });


        });

        describe("run", function() {
            it('should create tcp server', function() {
                srv.run();
                expect(net.createServer).toHaveBeenCalled();
            });


        });

        describe('_isTelnetConnection', function() {
            it('should not recognize telnet connection', function() {
                var hex = "ffffffffffffff";
                expect(srv._isTelnetConnection(hex)).toBeFalsy();
            });

            it('should recognize telnet connection', function() {
                var hex = ChatServer.TELNET_CONNECTION_BUFFER;
                expect(srv._isTelnetConnection(hex)).toBeTruthy();
            });
        });

        describe('_userExists', function() {
            it('should not find user', function() {
                srv._users = {
                    "Dean": {},
                    "Sean": {}
                };
                expect(srv._userExists('Samuel')).toBeFalsy();
            });

            it('should find user', function() {
                srv._users = {
                    "Dean": {},
                    "Sean": {}
                };
                expect(srv._userExists('Sean')).toBeTruthy();
            });
        });

        describe('_isCommand', function() {
            describe("proper commands", function() {
                var commands = ["/help", "/users", "/test"];

                for(i in commands) {
                    it("should return true", function() {
                        console.log(commands[i])
                        expect(srv._isCommand(commands[i])).toBeTruthy();
                    });

                }
            });

            describe("inproper commands", function() {
                var commands = ["help", "\\help", "--help"];

                for(i in commands) {
                    it("should return false", function() {
                        expect(srv._isCommand(commands[i])).toBeFalsy();
                    });

                }
            });

        });
    });
})