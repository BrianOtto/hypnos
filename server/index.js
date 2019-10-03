var express = require('express')()
var http = require('http').createServer(express)
var io = require('socket.io')(http)

io.on('connection', function(socket) {
    console.log('user connected')
    
    socket.on('disconnect', function() {
        console.log('user disconnected')
    })
    
    socket.on('chat', function(msg) {
        console.log('chat: ' + msg)
        io.emit('chat', msg)
    })
})

http.listen(3000, function() {
    console.log('listening on *:3000')
});