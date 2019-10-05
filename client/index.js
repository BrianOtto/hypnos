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

// generate a new 12x12 grid for the map
function mapReset() {
    var mapHTML = '<table cellpadding="0" cellspacing="0">'

    for (var row = 0; row < 12; row++) {
        mapHTML += '<tr>'
        
        for (var col = 0; col < 12; col++) {
            mapHTML += '<td class="map-room" id="map-room-' + row + '-' + col + '"></td>'
        }
        
        mapHTML += '</tr>'
    }

    mapHTML += '</table>'

    document.querySelector('#info #map #map-rooms').innerHTML = mapHTML
}

var socket = io('http://localhost:3000')

document.querySelector('#view textarea').addEventListener('keydown', function(event) {
    if (event.keyCode == 13) {
        socket.emit('chat', event.target.value)
        
        event.target.select()
        event.preventDefault()
    }
})

socket.on('chat', function(msg) {
    var content = document.createElement('div')
    content.innerHTML = msg
    
    document.querySelector('#view #console').appendChild(content)
})

socket.on('map', function(map) {
    mapReset()
    
    for (curr in map) {
        var currRoomRow = map[curr][0]
        var currRoomCol = map[curr][1]
        
        // add a double border to all rooms
        var roomId = '#map-room-' + currRoomRow + '-' + currRoomCol
        document.querySelector(roomId).classList.add('active')
        
        // update the border to a lighter color when inside a room
        // otherwise all other borders will be on an outside edge
        for (near in map) {
            var nearRoomRow = map[near][0]
            var nearRoomCol = map[near][1]
            
            // remove the border when two edges meet
            if (nearRoomRow == currRoomRow - 1 && nearRoomCol == currRoomCol) {
                document.querySelector(roomId).style.borderTop = 'none'
            }
            
            // change to a lighter color
            if (nearRoomRow == currRoomRow + 1 && nearRoomCol == currRoomCol) {
                document.querySelector(roomId).classList.add('active-inner-bottom')
            }
            
            // remove the border when two edges meet
            if (nearRoomRow == currRoomRow && nearRoomCol == currRoomCol - 1) {
                document.querySelector(roomId).style.borderLeft = 'none'
            }
            
            // change to a lighter color
            if (nearRoomRow == currRoomRow && nearRoomCol == currRoomCol + 1) {
                document.querySelector(roomId).classList.add('active-inner-right')
            }
        }
    }
})