const express = require("express")
const router= express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const config= require('config')
const {check,validationResult} = require("express-validator")
router.get("/",auth,async(req,res)=>{
    try{
        const user= await User.findById(req.user.id).select('-password')
        res.json(user)
    }catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }


}) 

router.post("/",[
    check('email','email is invalid').isEmail(),
    check('password','Password is required').exists()
],async(req,res)=>{
    const errors= validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {name,email,password}= req.body
    try{
        let user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({errors:[{msg:"Invalid Credentials"}]});

        }
        
    
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch) {
            return res.status(400).json({errors:[{msg:"Invalid Credentials"}]});

        }
        
        const payload ={
            user:{
                id:user.id
            }
        }
        jwt.sign(payload,
            config.get("jwtToken"),
            {expiresIn:3600},
            (err,token) => {
                if(err) throw err;
                res.json({token})
            }
             )
    }catch(err){
        console.log(err.message)
        res.status(500).send("Server error")
    }
})

module.exports = router