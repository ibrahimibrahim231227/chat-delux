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
        console.log(user)
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
        console.log(data)
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
                const friendName = friend.name, friendMassages = friend.massagesRecived
                neededData.push({name:friendName, massagesRecived:friendMassages})
            })
            return
        }
    })
    res.json(neededData)
})
app.post('/home-page/:user/add-friend', (req, res) => {
    const userName = req.params.user
    console.log(userName)
    let founded = false
    data.users.forEach(user => {
        if(user.name === req.body.name && user.name !== userName) {
            founded = true
            user.friends.push({name: userName, massagesRecived: []})
            return
        }
    })
    if(founded) {
        data.users.forEach(user => {
            if(user.name == userName){
                user.friends.push({name: req.body.name, massagesRecived: []})
                return
            }
        })
    }
    res.json({success: founded})
})
app.all('/*splits', (req, res) => {
    res.status(404).send('Page Not Found')
})
app.listen(5000, ()=> {
    console.log('Server Is On Port 5000')
})