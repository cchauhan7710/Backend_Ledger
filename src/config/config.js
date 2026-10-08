import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
  console.log("====================================");
  console.log("Warning: PORT is not defined");
  console.log("====================================");
}
if (!process.env.MONGO_URI) {
  console.log("====================================");
  console.log("Warning: MongoDB is not defined");
  console.log("====================================");
}
if (!process.env.CLIENT_ID) {
  console.log("====================================");
  console.log("Warning: CLIENT_ID is not defined");
  console.log("====================================");
}
if (!process.env.CLIENT_SECRET) {
  console.log("====================================");
  console.log("Warning: CLIENT_SECRET is not defined");
  console.log("====================================");
}
if (!process.env.REFRESH_TOKEN) {
  console.log("====================================");
  console.log("Warning: REFRESH_TOKEN is not defined");
  console.log("====================================");
}
if (!process.env.EMAIL_USER) {
  console.log("====================================");
  console.log("Warning: EMAIL_USER is not defined");
  console.log("====================================");
}

const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
  EMAIL_USER: process.env.EMAIL_USER,
};

export default config;
