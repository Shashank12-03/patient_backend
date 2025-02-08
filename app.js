import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { connect } from './connect.js';

dotenv.config();
const PORT = process.env.PORT;

// database connection 
const mongoUrl = process.env.mongo_url;
connect(mongoUrl)
.then(()=> console.log("Mongodb connected"))
.catch((err)=> console.log("Error occured: ", err));

const app = express();

app.use(bodyParser.json());


// listen to the server
app.listen(PORT,()=> console.log(`Server running on port ${PORT}`));