const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const User=require('../models/User');
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../keys');
const requireLogin=require('../middleware/requireLogin');


router.get('/protected',requireLogin,(req,res)=>{
    res.send('hello');
});


//signup
router.post('/signup',(req,res)=>{
    //const r=req.body.name;
    //console.log(r);
    const {name,email,password}=req.body
    if(!email||!password||!name){
        return res.status(422).json({error:"add all the field"});
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser)
        {
            return res.status(422).json({error:"already exist email"});
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user=new User({
                email,
                password:hashedpassword,
                name
            })
            user.save()
            .then(user=>{
                res.json({message:"saved successfully"});
            })
            .catch(err=>{
                console.log(err);
            })
        })
        .catch(err=>{
            console.log(err);
        })
        
    })
    
    
});

//sighin
router.post('/signin',(req,res)=>{
    const {email,password}=req.body;
    console.log({email});
    if(!email||!password)
    {
        return res.status(422).json({error:"please provide the email or password"});
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"invalid email or password"});
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                //res.json({message:"successfully sign In"});
                const token=jwt.sign({_id:savedUser._id},JWT_SECRET);//generate a token
               const {_id,name,email}=savedUser
                res.json({token,user:{_id,name,email}});
            }
            else{
                return res.status(422).json({error:"invalid email or password"});
            }
        })
        .catch(err=>{
            console.log(err);
        })
       // const validated=bcrypt.compare(req.body.password,User.password);
        //!validated && res.status(400).json("wrong credentials!");
    })
    
});

module.exports=router;