const express = require("express")
const User = require("../../models/User")
const router= express.Router()
const jwt = require("jsonwebtoken")
const gravator = require("gravatar")
const bcrypt = require("bcryptjs")
const config= require('config')
const {check,validationResult} = require("express-validator")
router.post("/",[
    check('name','Name is required').not().isEmpty(),
    check('email','email is invalid').isEmail(),
    check('password','Please enter a password with 6 or more characers').isLength({min:6}),
    check('phone','Please enter your phone number').isLength({min:10}),
],async(req,res)=>{
    const errors= validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {name,email,password,phone}= req.body
    try{
        let user = await User.findOne({email})
        if(user) {
            return res.status(400).json({errors:[{msg:"Email id already exists"}]});
        }
        const avatar= gravator.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        })
        user = new User({
            name,
            email,
            avatar,
            phone,
            password
        })
        const salt = await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(password,salt)
        await user.save();
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