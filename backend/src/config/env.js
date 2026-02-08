import dotenv from "dotenv";

dotenv.config(); //Read the .env file and load the enviroment variables into process.env 

export const ENV ={
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 5000,
    DB_URL: process.env.DB_URL
}   