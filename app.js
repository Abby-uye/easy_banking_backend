require('dotenv').config();
const express = require("express");
const app = express()

const dbUrl =process.env.MONGO_URI
const connect = require("./features/repository/connectToDb")
const port = process.env.PORT

const cors = require("cors");
const router = require('./features/router/bankUserRouter')
const notFound = require("./features/middleware/notFound")

app.use(cors())
app.use(express.json());
app.use('/api/v1/bank_user',router);
app.use(notFound)


connect(dbUrl)
    .then(()=>{
        app.listen(port,()=>{
            console.log(`app listening at port ${port}`)
        })
    }).catch((error)=>{
    console.log(error)
})