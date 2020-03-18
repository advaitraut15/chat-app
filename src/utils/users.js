const users = []

const addUser = ({id,username,room})=>{

    //clean th data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate 
    if(!username || !room){
        return{
            error:"username or room cannot be empty"
        }
    }
    
    //check for existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username  
    })

    if(existingUser){ 
        return {
            error : "this username is in use!"
        }
    }

    const user = {id,username,room}
    users.push(user)
    return {user}

}

const removeUser = (id)=>{
    const index = users.findIndex((user)=>user.id === id)
    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id) =>{
    const user1 = users.find((user)=>{
        return user.id === id
    })
    return (user1)   
}

const getUsersInRoom =(room)=>{
    const users1 = users.filter((user)=>{
        return user.room === room
    })

    return users1
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}