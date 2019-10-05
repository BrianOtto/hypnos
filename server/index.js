var express = require('express')()
var http = require('http').createServer(express)
var io = require('socket.io')(http)

io.on('connection', function(socket) {
    var clientAddress = socket.request.connection.remoteAddress
    
    console.log(clientAddress + ' has connected')
    
    socket.emit('map', mapCreate())
    
    socket.emit('chat', 'Welcome to Hypnos 0.1.0')
    socket.broadcast.emit('chat', clientAddress + ' has connected')
    
    socket.on('disconnect', function() {
        console.log(clientAddress + 'has disconnected')
        socket.broadcast.emit('chat', clientAddress + ' has disconnected')
    })
    
    socket.on('chat', function(msg) {
        io.emit('chat', msg)
    })
})

http.listen(3000, function() {
    console.log('listening on *:3000')
});

var mapRooms = []

// randomly create 100 rooms
function mapCreate(size = 12) {
    if (mapRooms.length > 0) {
        console.log('reusing mapCreate')
    } else {
        console.log('running mapCreate')
        
        var mapArray = []
        
        // create a 12x12 grid to choose from
        for (var row = 0; row < size; row++) {
            for (var col = 0; col < size; col++) {
                mapArray.push([row, col])
            }
        }
        
        // choose 100 random rooms to display
        for (var row = 0; row < 100; row++) {
            var mapIndex = Math.floor(Math.random() * mapArray.length)
            var randomRoom = mapArray.splice(mapIndex, 1)[0]
            
            mapRooms.push(randomRoom)
        }
    }
    
    return mapRooms
}