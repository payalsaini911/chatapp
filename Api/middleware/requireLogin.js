const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    //authorization === Bearer ewefwegwrherhe
    //console.log(authorization);
    if(!authorization){
       return res.status(401).json({error:"account not found"})
    }
    const token = authorization.replace("Bearer ","")
    console.log(token);
    //console.log(JWT_SECRET);
    //const ap=jwt.verify(token,JWT_SECRET);
    //console.log(ap);
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
      console.log(payload);
        if(err){
         return   res.status(401).json({error:"you must be logged in"})
        }

        const {_id} = payload
        User.findById(_id).then(userdata=>{
            req.user = userdata
            next()
        })
        
        
    })
}