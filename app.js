import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { connect } from './connect.js';
import { authRoutes } from './routes/auth_routes.js';
import { checkAuthentication } from './middleware/auth.js';
import { careGiverRoutes } from './routes/careGiver_routes.js';

dotenv.config();
const PORT = process.env.PORT;

// database connection 
const mongoUrl = process.env.mongo_url;
connect(mongoUrl)
.then(()=> console.log("Mongodb connected"))
.catch((err)=> console.log("Error occured: ", err));

const app = express();

app.use(bodyParser.json());

// routes
app.use('/auth',authRoutes);
app.use('/caregiver',checkAuthentication,careGiverRoutes);

// listen to the server
app.listen(PORT,()=> console.log(`Server running on port ${PORT}`));