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
    const connected = await mongoose.connect("mongodb+srv://chinkyrao06:TIQiXiSydd4Ne87T@cluster0.pilzf6r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

    app.listen(9090, () => {
        console.log("Server is runnig on port 9090")
    })
}

start();