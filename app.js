const express = require('express')
const app = express()
const data = require('./data')
const path = require('path')
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}))
app.post('/login', (req, res) => {
    let founded = false
    data.users.forEach((user) => {
        if(user.name === req.body.name && user.password === req.body.password) {
            founded = true
            return
        }
    })
    if(founded) {
         res.json({success: true})
    }
    else {
        res.json({success: false})
    }   
})
app.post('/sign-up', (req, res) => {
    let founded = false
    const name = req.body.name, password = req.body.password
    data.users.forEach((user) => {
        if(user.name === name) {
            founded = true
            return
        }
    })
    if(founded) {
         res.json({success: false})
    }
    else {
        data.users.push({name, password})
        data.users.forEach(user => {
            if(user.name == name) {
                user.friends = []
            }
        })
        res.json({success: true})
    }   
})
app.get('/home-page/:user', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'home-page.html'));
})
app.get('/home-page/:user/friends', (req, res) => {
    const userName = req.params.user
    let neededData = []
    data.users.forEach((user) => {
        if(user.name === userName){
            if(!user.friends) {
                return
            }
            user.friends.forEach((friend) => {
                const friendName = friend.name
                neededData.push({name:friendName, chat: friend.chat})
            })
            return
        }
    })
    res.json({neededData:neededData, username: userName})
})
app.post('/home-page/:user/add-friend', (req, res) => {
    const userName = req.params.user
    let founded = false
    data.users.forEach(user => {
        if(user.name === req.body.name && user.name !== userName) {
            founded = true
            user.friends.push({name: userName, chat: []})
            return
        }
    })
    if(founded) {
        data.users.forEach(user => {
            if(user.name == userName){
                user.friends.push({name: req.body.name, chat: []})
                return
            }
        })
    }
    res.json({success: founded})
})
app.post('/home-page/:user/send-massage', (req, res) => {
    const userName = req.params.user
    const needName = req.body.name
    const needMassage = req.body.massage
    data.users.forEach(user => {
        if(user.name === needName) {
            user.friends.forEach(friend => {
                if(friend.name === userName) {
                    friend.chat.push({massage: needMassage, sender: userName})
                    return
                }
            })
            return
        }
    })
    data.users.forEach(user => {
        if(user.name === userName) {
            user.friends.forEach(friend => {
                if(friend.name === needName) {
                    friend.chat.push({massage:needMassage, sender: userName})
                    return
                }
            })
            return
        }
    })
    res.json({success: 1})
})
app.get('/home-page/:user/recive-massage', (req, res) => {
    data.users.forEach((user) => {
        if(user.name == req.params.user) {
            user.shouldRefresh = true
            return
        }
    })
    res.json(1)
})
app.get('/home-page/:user/should-refresh', (req, res) => {
    let need = false
    let needData
    data.users.forEach((user) => {
        if(user.name == req.params.user) {
            need = user.shouldRefresh
            needData = user.friends
            user.shouldRefresh = false
            return
        }
    })
    res.json({neededData: needData, need: need})
})
app.all('/*splits', (req, res) => {
    res.status(404).send('Page Not Found')
})
app.listen(5000, ()=> {
    console.log('Server Is On Port 5000')
})