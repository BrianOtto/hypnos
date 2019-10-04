var tabHeads = document.querySelectorAll('.tabs > .head > div')

for (const th of tabHeads) {
    th.addEventListener('click', function(event) {
        const th = event.target
        
        th.parentNode.querySelector('.active').classList.remove('active')
        th.classList.add('active')
        
        tabBodys = th.parentNode.parentNode.querySelectorAll('.body')
        
        for (const tb of tabBodys) {
            if (tb.getAttribute('id') == th.getAttribute('data-id')) {
                tb.style.display = tb.getAttribute('data-type')
            } else {
                tb.style.display = 'none'
            }
        }
    })
}

// generate a 12x12 grid for the map

var mapArry = []
var mapCols = 12
var mapHTML = '<table cellpadding="0" cellspacing="0">'

for (var row = 0; row < mapCols; row++) {
    mapHTML += '<tr>'
    
    for (var col = 0; col < mapCols; col++) {
        mapArry.push([row, col])
        
        mapHTML += '<td class="map-room" id="map-room-' + row + '-' + col + '"></td>'
    }
    
    mapHTML += '</tr>'
}

mapHTML += '</table>'

var map = document.querySelector('#info #map #map-rooms')
map.insertAdjacentHTML('beforeend', mapHTML)

// randomly create 100 rooms

var mapRooms = []

for (var row = 0; row < 100; row++) {
    var mapIndex = Math.floor(Math.random() * mapArry.length)
    var mapBlock = mapArry.splice(mapIndex, 1)[0]
    
    var roomId = '#map-room-' + mapBlock[0] + '-' + mapBlock[1]
    document.querySelector(roomId).style.backgroundColor = '#3399FF'
    
    mapRooms.push(mapBlock)
}

// add borders to the rooms

var mapBorderEdge = '4px double #18181F'
var mapBorderInside = '1px solid #C0C0C0'

for (curr in mapRooms) {
    var currRoomRow = mapRooms[curr][0]
    var currRoomCol = mapRooms[curr][1]
    
    // add a double border to all rooms
    var roomId = '#map-room-' + currRoomRow + '-' + currRoomCol
    document.querySelector(roomId).style.border = mapBorderEdge
    
    // update the border to a lighter color when inside a room
    // all the other borders will be on an outside edge
    for (near in mapRooms) {
        var nearRoomRow = mapRooms[near][0]
        var nearRoomCol = mapRooms[near][1]
        
        // remove the border when two edges meet
        if (nearRoomRow == currRoomRow - 1 && nearRoomCol == currRoomCol) {
            document.querySelector(roomId).style.borderTop = 'none'
        }
        
        if (nearRoomRow == currRoomRow + 1 && nearRoomCol == currRoomCol) {
            document.querySelector(roomId).style.borderBottom = mapBorderInside
        }
        
        // remove the border when two edges meet
        if (nearRoomRow == currRoomRow && nearRoomCol == currRoomCol - 1) {
            document.querySelector(roomId).style.borderLeft = 'none'
        }
        
        if (nearRoomRow == currRoomRow && nearRoomCol == currRoomCol + 1) {
            document.querySelector(roomId).style.borderRight = mapBorderInside
        }
    }
}

var socket = io('http://localhost:3000')

document.querySelector('#view textarea').addEventListener('keydown', function(event) {
    if (event.keyCode == 13) {
        socket.emit('chat', event.target.value);
        event.target.value = ''
        
        event.preventDefault()
    }
})

socket.on('chat', function(msg) {
    var content = document.createElement('div')
    content.innerHTML = msg
    
    document.querySelector('#view #console').appendChild(content)
})

/* TODO: get the map from the server

socket.on('map', function(map) {
    var content = document.createElement('div')
    content.innerHTML = map
    
    document.querySelector('#info #map #map-rooms').appendChild(content)
})

*/