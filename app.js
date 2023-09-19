const express = require('express')
const app = express()

const port = process.env.port || 3000

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.post('/', (req, res)=>{
    res.status(200).send('test status post')
})

app.listen(port, ()=>{
    console.log(`App running on port ${port}...`)
})

