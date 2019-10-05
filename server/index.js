var express = require('express')()
var http = require('http').createServer(express)
var io = require('socket.io')(http)

var mapRooms = []
var mapStart = []

io.on('connection', function(socket) {
    var clientAddress = socket.request.connection.remoteAddress
    
    console.log(clientAddress + ' has connected')
    
    socket.emit('map', mapCreate())
    
    socket.emit('msg', 'Welcome to Hypnos 0.1.0')
    socket.broadcast.emit('msg', clientAddress + ' has connected')
    
    socket.on('disconnect', function() {
        console.log(clientAddress + ' has disconnected')
        socket.broadcast.emit('msg', clientAddress + ' has disconnected')
    })
    
    socket.on('msg', function(msg) {
        switch(msg) {
            case 'map' :
                mapRooms = []
                io.emit('map', mapCreate())
                
                break
            default :
                io.emit('msg', msg)
        }
    })
    
    socket.on('mapStart', function(msg) {
        console.log('sending mapStart')
        socket.emit('mapStart', mapStart)
    })
})

http.listen(3000, function() {
    console.log('listening on *:3000')
});

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
        
        // choose a starting room that has at least 3 walls
        for (curr in mapRooms) {
            var currRoomRow = mapRooms[curr][0]
            var currRoomCol = mapRooms[curr][1]
            
            var wallCount = 4
            
            for (near in mapRooms) {
                var nearRoomRow = mapRooms[near][0]
                var nearRoomCol = mapRooms[near][1]
                
                if (nearRoomRow == currRoomRow - 1 && nearRoomCol == currRoomCol ||
                    nearRoomRow == currRoomRow + 1 && nearRoomCol == currRoomCol ||
                    nearRoomRow == currRoomRow && nearRoomCol == currRoomCol - 1 ||
                    nearRoomRow == currRoomRow && nearRoomCol == currRoomCol + 1) {
                    
                    wallCount--
                    continue
                }
            }
            
            if (wallCount >= 3) {
                mapStart = mapRooms[curr]
            }
        }
        
        if (mapStart.length == 0) {
            mapCreate()
        }
    }
    
    return mapRooms
}