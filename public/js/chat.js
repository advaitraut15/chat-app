const socket = io()

//elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button') 
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const{ username,room} = Qs.parse(location.search,{ ignoreQueryPrefix :true})



socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username : message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    
})

socket.on('roomData',({room , users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML = html 
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()                      // prevents default action action that is page refresh
    
    //$messageFormButton.setAttribute('disabled','disabled')
    
    
    const message = e.target.elements.message.value

    socket.emit('sendmessage',message,(error)=>{   //client => server => then again client gets acknoledgement
        
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error){ 
            return console.log(error)
        }
        
        
        console.log("the message was delivered ",message)// first message is normal parameter & second is callback parameter 
    })
})

socket.emit('join',{username,room },(error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})