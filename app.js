const express = require("express")
const fs = require("fs")
const morgan = require("morgan")
const mongodb = require("mongodb")
const app = express()

const port = process.env.port || 3000
const tours = JSON.parse(
    fs.readFileSync(
        `${__dirname}/dev-data/data/tours-simple.json`
    )
)
const users = JSON.parse(
    fs.readFileSync(
        `${__dirname}/dev-data/data/users.json`
    )
)

//express middleware to modify incoming requests
app.use(express.json())
app.use(morgan("dev"))
//our own middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

//tours functions
const getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        requestTime: req.requestTime,
        data: {
            tours,
        },
    })
}

const getTourById = (req, res) => {
    const id = req.params.id * 1
    const tour = tours.find((el) => el.id === id)

    if (!tour) {
        return res.status(404).json({
            status: "failed",
            message: `data with id ${id} not found`,
        })
    }

    res.status(200).json({
        status: "success",
        data: {
            tour,
        },
    })
}

const addTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1
    const newData = Object.assign(
        {
            id: newId,
        },
        req.body
    )

    tours.push(newData)
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            //201 = created
            res.status(201).json({
                status: "success",
                data: {
                    tour: newData,
                },
            })
        }
    )
}

const editTour = (req, res) => {
    const id = req.params.id * 1
    const tourIndex = tours.findIndex(
        (el) => el.id === id
    )

    if (tourIndex === -1) {
        return res.status(404).json({
            status: "failed",
            message: `data with id ${id} not found`,
        })
    }

    tours[tourIndex] = {
        ...tours[tourIndex],
        ...req.body,
    }

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(200).json({
                status: "success",
                message: `tour with id ${id} has been edited successfully`,
                data: {
                    tour: tours[tourIndex],
                },
            })
        }
    )
}

const deleteTour = (req, res) => {
    const id = req.params.id * 1
    const tourIndex = tours.findIndex(
        (el) => el.id === id
    )

    if (tourIndex === -1) {
        return res.status(404).json({
            status: "failed",
            message: `data with id ${id} not found`,
        })
    }

    tours.splice(tourIndex, 1)

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(200).json({
                status: "success",
                message: `tour with id ${id} has been deleted successfully`,
                data: null,
            })
        }
    )
}

//users functions
const getAllUsers = (req, res) => {
    res.status(200).json({
        status: "success",
        requestTime: req.requestTime,
        data: {
            users,
        },
    })
}

const getUserById = (req, res) => {
    const id = req.params.id
    const user = users.find((el) => el._id === id)

    if (!user) {
        return res.status(404).json({
            status: "failed",
            message: `data with id ${id} not found`,
        })
    }

    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    })
}

const addUser = (req, res) => {
    const newObjectId = new mongodb.ObjectId()
    const newId = newObjectId.toString()
    const newData = Object.assign(
        {
            _id: newId,
        },
        req.body
    )

    users.push(newData)
    fs.writeFile(
        `${__dirname}/dev-data/data/users.json`,
        JSON.stringify(users),
        (err) => {
            //201 = created
            res.status(201).json({
                status: "success",
                data: {
                    user: newData,
                },
            })
        }
    )
}

const editUser = (req, res) => {
    const id = req.params.id
    const userIndex = users.findIndex(
        (el) => el._id === id
    )

    if (userIndex === -1) {
        return res.status(404).json({
            status: "failed",
            message: `data with id ${id} not found`,
        })
    }

    users[userIndex] = {
        ...users[userIndex],
        ...req.body,
    }

    fs.writeFile(
        `${__dirname}/dev-data/data/users.json`,
        JSON.stringify(users),
        (err) => {
            res.status(200).json({
                status: "success",
                message: `user with id ${id} has been edited successfully`,
                data: {
                    user: users[userIndex],
                },
            })
        }
    )
}

const deleteUser = (req, res) => {
    const id = req.params.id
    const userIndex = users.findIndex(
        (el) => el._id === id
    )

    if (userIndex === -1) {
        return res.status(404).json({
            status: "failed",
            message: `data with id ${id} not found`,
        })
    }

    users.splice(userIndex, 1)

    fs.writeFile(
        `${__dirname}/dev-data/data/users.json`,
        JSON.stringify(users),
        (err) => {
            res.status(200).json({
                status: "success",
                message: `user with id ${id} has been deleted successfully`,
                data: null,
            })
        }
    )
}

//Routing
// app.get('/api/v1/tours', getAllTours)
// app.get('/api/v1/tours/:id', getTourById)
// app.post('/api/v1/tours', addTour)
// app.patch('/api/v1/tours/:id', editTour)
// app.delete('/api/v1/tours/:id', deleteTour)

const tourRouter = express.Router()
const userRouter = express.Router()

// ROUTES UNTUK TOUERS
tourRouter
    .route("/")
    .get(getAllTours)
    .post(addTour)

tourRouter
    .route("/:id")
    .get(getTourById)
    .patch(editTour)
    .delete(deleteTour)

// ROUTES UNTUK USERS
userRouter
    .route("/")
    .get(getAllUsers)
    .post(addUser)

userRouter
    .route("/:id")
    .get(getUserById)
    .patch(editUser)
    .delete(deleteUser)

app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})
