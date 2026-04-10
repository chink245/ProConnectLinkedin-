import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postsRoutes from './routes/posts.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use(postsRoutes);
app.use(userRoutes);

app.use(express.static("uploads"));    

const start = async () => {
    const connected = await mongoose.connect("mongodb+srv://chinky:bubu@cluster0.sl5kkjb.mongodb.net/?appName=Cluster0")

    console.log("🔥 MongoDB Connected:", connected.connection.host);

    app.listen(9090, () => {
        console.log("Server is runnig on port 9090")
    })
}

start();