const express = require('express')

const app = express()
const PORT = 8888

app.get(("/"), (req, res)=> {
    res.send("hello world")
})

app.use(express.static('/build'))

app.listen(PORT, ()=> console.log(`listening on port ${PORT}`))