import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connection } from './database/connection.js';
import { errorMiddleware } from './middlewares/error.js';
import fileUpload from 'express-fileupload';
import userRouter from './routes/userRouter.js';
import jobRouter from './routes/jobRouter.js';
import applicationRouter from './routes/applicationRouter.js';
import { newsLetterCron } from './automation/newsLetterCron.js';



const app = express();  

config({path: "./config/config.env"});

// middleware: frontend-backend connection 
app.use(cors(
            {
 origin: 'https://job-cohortlab.onrender.com',
  credentials: true,
            }
));



// middleware: json data--> jsonWebTokens
app.use(cookieParser());

            // use to get the data and convert it into required json format
app.use(express.json());
app.use(express.urlencoded({extended: true}));





// express file upload --> the file which is uploaded using cloudinary 
//                          will be fetched by this middleware

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
})
);
// (above) by using this format, the file will be uploaded in the temp folder and then
//  it will be uploaded to the cloudinary (elimainate the use of multer)



// routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);
app.get("/", (req, res) => {
    console.log("Gym Bro")
     res.json({message: "Welcome to Job Portal API"});
})

// node-cron
newsLetterCron();


// database connection
connection();

// middleware: error handling
app.use(errorMiddleware);


export default app;
