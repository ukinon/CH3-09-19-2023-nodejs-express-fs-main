const express = require('express')
const fs = require('fs')
const app = express()

//express middleware to modify incoming requests
app.use(express.json())

const port = process.env.port || 3000
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

//read data from json
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        data:{
            tours
        }
    })
})

//read data from json by id
app.get('/api/v1/tours/:id', (req, res) => {

    const id = req.params.id * 1
    const tour = tours.find(el => el.id === id)

    if(!tour){
        return res.status(404).json({
            status: 'failed',
            message: `data with id ${id} not found`
        })
    }

    res.status(200).json({
        status: 'success',
         data:{
            tour
         }
    })
})

//create new data
app.post('/api/v1/tours', (req, res) => {
    const newId = tours[tours.length-1].id + 1
    const newData = Object.assign({id: newId}, req.body)

    tours.push(newData)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {

        //201 = created
        res.status(201).json({
            status: 'success',
            data:{
                tour: newData
            }
        })
    })
})

//update data
app.patch('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1
    const tourIndex = tours.findIndex(el => el.id === id)

    if(tourIndex === -1){
        return res.status(404).json({
            status: 'failed',
            message: `data with id ${id} not found`
        })
    }

    tours[tourIndex] = {...tours[tourIndex], ...req.body}

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(200).json({
            status: 'success',
            message: `tour with id ${id} has been edited successfully`,
            data:{
                tour: tours[tourIndex]
            }
        })
    })
})

//delete data
app.delete('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1
    const tourIndex = tours.findIndex(el => el.id === id)

    if(tourIndex === -1){
        return res.status(404).json({
            status: 'failed',
            message: `data with id ${id} not found`
        })
    }

    tours.splice(tourIndex, 1);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {

        res.status(200).json({
            status: 'success',
            message: `tour with id ${id} has been deleted successfully`,
            data: null
        })
    })
})

app.listen(port, ()=>{
    console.log(`App running on port ${port}...`)
})

