var tabHeads = document.querySelectorAll('.tabs > .head > div')

for (const th of tabHeads) {
    th.addEventListener('click', function(event) {
        const th = event.target
        
        th.parentNode.querySelector('.active').classList.remove('active')
        th.classList.add('active')
        
        tabBodys = th.parentNode.parentNode.querySelectorAll('.body')
        
        for (const tb of tabBodys) {
            if (tb.getAttribute('id') == th.getAttribute('data-id')) {
                tb.style.display = 'grid'
            } else {
                tb.style.display = 'none'
            }
        }
    })
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
});