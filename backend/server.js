const express = require('express');
const dotenv = require('dotenv');
const connectDB = require("./config/db");
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const messageRoutes = require("./Routes/messageRoutes");

dotenv.config({path : '../.env'});
const app = express();
connectDB();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);

app.listen(PORT,console.log(`Server started on Port ${PORT}`));

