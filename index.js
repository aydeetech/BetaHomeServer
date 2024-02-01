require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000
const cors = require('cors')
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
const profileRouter = require('./routes/profileRouter')
const inspectionRouter = require('./routes/inspectionRouter')
const propertyRouter = require('./routes/propertyRouter')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})


// middlewares
app.use(fileUpload({useTempFiles: true}))
app.use(express.json())
app.use(cors())

// routes

app.get('/', (req, res) => {
    res.status(200).send('Beta Home Server')
})

app.use('/api/v1', profileRouter)
app.use('/api/v1', inspectionRouter)
app.use('/api/v1/property', propertyRouter)


// error routes

app.use((req,res) => {
    res.status(404).send("Resource not found")
})

// db Connections and server listening

const startServer = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL, { dbName: "BetaHome" });
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      console.log(error)
    }
  };
  
  startServer();