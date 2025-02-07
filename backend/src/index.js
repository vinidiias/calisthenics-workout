const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express();

const PORT = process.env.PORT
const dbUri = process.env.DB_URI
const router = require('./Routes/Router')

mongoose.connect(dbUri)
.then((res) => {
    console.log('Connected to database')
})
.catch((err) => console.error(err))

const allowedOrigins = ['http://localhost:3000', 'https://clinica-unioeste-pi.vercel.app'];
app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'auth'],
    credentials: true,
}));

app.use(express.json())

app.use(router)

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});