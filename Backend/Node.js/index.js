import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import mongoose from "mongoose";
import login from "./controlers/login.js";
import webtoken from "./middleware/webtoken.js";

import cors from 'cors';


import createUser from "./controlers/user/createUser.js";
import deleteUser from "./controlers/user/deleteUser.js";
import updateUser from "./controlers/user/updateUser.js";
import { readUser } from "./controlers/user/readUser.js";
import { readUserById } from "./controlers/user/readUser.js";

import { readMedia, readMediaById } from "./controlers/media/readMedia.js";
import createMedia from "./controlers/media/createMedia.js";
import updateMedia from "./controlers/media/updateMedia.js";
import delMedia from "./controlers/media/delMedia.js";
import { markMediaAsSeen } from "./controlers/media/createMedia.js";
import { getMediaStatus } from "./controlers/media/createMedia.js";

import filesPayloadExists from "./middleware/filesPayloadExists.js";
import fileExtLimiter from "./middleware/fileExtLimiter.js";
import fileSizeLimiter from "./middleware/fileSizeLimiter.js";
import "dotenv/config";
import fileUpload from 'express-fileupload';

import createCom from "./controlers/commentaire/createCom.js";
import { readCom } from "./controlers/commentaire/readCom.js";
import { readComById } from "./controlers/commentaire/readCom.js";
import { getComs } from "./controlers/commentaire/readCom.js";

const app = express();
const mongodbUri = process.env.MONGODB_URI;

//const db = new MongoClient(mongodbUri);

mongoose
  .connect(mongodbUri)
  .then(() => console.log("Connection à la base de données OK"))
  .catch((err) => console.log(err));

app.use(cors({
  origin: '*'
}));  
app.use(bodyParser.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("API en écoute sur le port 3000");
});

app.get("/media/read", readMedia);
app.get("/media/read/:id", readMediaById);
app.post("/media/create", [webtoken, fileUpload({createParentPath: true}), filesPayloadExists, fileExtLimiter(['.mkv', '.mp4', '.png', '.jpg']), fileSizeLimiter], createMedia);
app.put("/media/update/:id", webtoken, updateMedia);
app.delete("/media/delete/:id", delMedia);
app.post("/media/markasread/:mediaId", webtoken, markMediaAsSeen);
app.get("/media/status/:userId/:friendId", webtoken, getMediaStatus);

app.post("/user/create", createUser);
app.delete("/user/delete/:id", webtoken, deleteUser);
app.put("/user/update/:id", webtoken, updateUser);
app.get("/user/read", readUser);
app.get("/user/read/:id", readUserById);

app.post("/commentaire/create", createCom);
app.delete("/commentaire/delete/:id", webtoken, deleteUser);
app.get("/commentaire/read", readCom);
app.get("/commentaire/read/:id", readComById);
app.get("/commentaire/get/:userId/:friendId", getComs);

app.post("/login", login);



export { app };
