const express = require('express')

const app = express()
const PORT = 8888

app.get(("/"), (req, res)=> {
    res.send("hello world")
})

app.listen(PORT, ()=> console.log(`listening on port ${PORT}`))