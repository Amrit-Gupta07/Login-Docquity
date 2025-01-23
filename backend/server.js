const express = require('express');
require('dotenv').config();
const cors = require("cors");
const app = express();
const authRoutes = require('./routes/auth');
const PORT = process.env.PORT || 4000;
const cookieParser = require('cookie-parser')

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: '*',
        credentials:true,
    })
)

app.use('/api/auth', authRoutes);

app.get('/',(req,res) => {
    res.send("App is running")
})

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`)
})