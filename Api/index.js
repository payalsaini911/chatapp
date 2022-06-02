const express=require('express');
const app=express();
const mongoose=require('mongoose');
const authRoute=require('./routes/auth');
const conversationRoute=require('./routes/conversations');
const messageRoute=require('./routes/messages');
const userRoute=require('./routes/user');
const jwt=require('jsonwebtoken');


app.use(express.json());


const MONGODB_URI =
  'mongodb+srv://payalsaini:Kapil34@cluster0.dmfpe.mongodb.net/ChatApp';



app.use('/auth',authRoute);
app.use('/conversations',conversationRoute);
app.use('/messages',messageRoute);
app.use('/user',userRoute);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(8000);
    console.log('connect');
  })
  .catch(err => {
    console.log(err);
  });