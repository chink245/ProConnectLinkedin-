import User from "../models/user.models.js";
import Profile from "../models/profile.models.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import PDFDocument from "pdfkit";
import fs from "fs";
import ConnectionRequest from "../models/connections.models.js";
import Post from "../models/posts.models.js";


const convertUserDataTOPDF = async (userData) =>{
    const doc = new PDFDocument();

    const outputPath = crypto.randomBytes(32).toString("hex")+".pdf";
    const stream = fs.createWriteStream("uploads/"+ outputPath);

    doc.pipe(stream);
    doc.image(`uploads/${userData.userId.profilePicture}`,{align:"center",width:100});

    doc.fontSize(14).text(`Name:${userData.userId.name}`)
    doc.fontSize(14).text(`Username:${userData.userId.username}`)
    doc.fontSize(14).text(`Email:${userData.userId.email}`)
    doc.fontSize(14).text(`Bio:${userData.userId.bio}`)
    doc.fontSize(14).text(`Current Position:${userData.currentPost}`)

    doc.fontSize(14).text("past Work:")
    userData.pastWork.forEach((work,index)=>{
        doc.fontSize(14).text(`Comapany Name:${work.company}`);
        doc.fontSize(14).text(`Position:${work.position}`);
        doc.fontSize(14).text(`Years:${work.years}`);

    })

    doc.end();

    return outputPath;
    
    
}


export const register = async(req,res)=>{
    
    try{
      const{name,email,password,username} = req.body;
      
      if(!name||!email||!password||!username) return res.status(400).json({message:"All fields are required"})

        const user = await User.findOne({
            email
        });

        if(user) return res.status(400).json({message:"User already exist"})

        const hashedPassword = await bcrypt.hash(password,10);    

        const newUser = new User({
            name,
            email,
            password:hashedPassword,
            username
        });

        await newUser.save();

        const profiles = new Profile({
            userId: newUser._id
        });
      
        await profiles.save();
        return res.json({message:"User Created Successfully"})

    }catch(error){
        return res.status(500).json({message:error.message})
    }
}


export const login = async(req,res)=>{
    try{
      const{name,email,password,username} = req.body;
      
     if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

        const user = await User.findOne({
            email
        });
        if(!user) return res.status(404).json({message:"USer does not exist"})
         
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch) return res.status(400).json({message:"Invalid Credentials"})

        const token = crypto.randomBytes(32).toString("hex");  
        
        await User.updateOne({_id:user._id},{token});

        return res.json({token})
    }catch(err){
        return res.status(500).json({message:err.message});
    }   
}

export const uploadProfilePicture = async(req,res)=>{
    const {token} = req.body;
    try{
      const user = await User.findOne({token});
      if(!user) {
        return res.status(404).json({message:"User not found"})
      } 
      user.profilePicture = req.file.filename;
      await user.save();

      return res.status(200).json({message:"Profile Picture Updated Successfully"})
 
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const updateUserProfile = async(req,res)=>{
    try{
        const {token,...newUserData} = req.body;
        const user = await User.findOne({token});
        if(!user) {
            return res.status(404).json({message:"User not found"})
        }
        const {username,email} = newUserData;
        const existingUser = await User.findOne({$or:[{username},{email}]});
        if(existingUser)
            if(existingUser || String(existingUser._id) !== String(user._id)){
            return res.status(400).json({message:"Username or Email already in use"})
        }
        Object.assign(user,newUserData);
        await user.save();
        return res.status(200).json({message:"Profile Updated Successfully"})
    }catch(err){
        return res.status(500).json({message:err.message})
    }   
}

export const getUserAndProfile = async(req,res)=>{
    try {
        const {token} = req.query;
        console.log('token', token);
        const user = await User.findOne({token:token});
           
        console.log(user);
        if(!user) {
            return res.status(404).json({message:"User not found"})
        }
    
        const userProfile = await Profile.findOne({userId:user._id})
        .populate('userId','name email username profilePicture');

        return res.status(200).json({userProfile}) 


    }catch(err){
        return res.status(500).json({message:err.message})
    }   
}


export const updateProfileData = async(req,res)=>{
    try{
        const {token,...newProfileData} = req.body;
        const userProfile = await User.findOne({token:token});  
        if(!userProfile) {
            return res.status(404).json({message:"User not found"})
        }
        const profile_to_update = await Profile.findOne({userId:userProfile._id}); 
        Object.assign(profile_to_update,newProfileData);
        await profile_to_update.save();
        return res.status(200).json({message:"Profile Updated Successfully"}) 

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const getAllUsersProfile = async(req,res)=>{
    try{
     const profiles = await Profile.find()
     .populate('userId','name email username profilePicture');
     return res.status(200).json({profiles})
    }catch(err){
        return res.status(500).json({message:err.message})      
}
       
}

export const downloadProfile = async(req,res)=>{
    const user_id = req.query.id;
    // return res.json({"meassage" : "Not Implement"});
    const userProfile = await Profile.findOne({userId:user_id})
    .populate('userId','name username email profilePicture');

    let outputPath = await convertUserDataTOPDF(userProfile);

    return res.json({"message": outputPath})


    
}


export const sendConnectionRequest = async(req,res)=>{
    
        const {token,connectionId} = req.body;
        try{
        const user = await User.findOne({token:token});
        if(!user) {
            return res.status(404).json({message:"User not found"}) 
        }
        const connectionUser = await User.findOne({_id:connectionId});
        if(!connectionUser) {
            return res.status(404).json({message:"Connection User not found"})  
        }
        const existingRequest = await ConnectionRequest.findOne({userId:user._id,connectionId:connectionUser._id});

        if(existingRequest){
            return res.status(400).json({message:"Connection Request already sent"})    
        } 
        
        const request = new ConnectionRequest({
            userId:user._id,
            connectionId:connectionUser._id
        });
        await request.save();
        return res.status(200).json({message:"Connection Request Sent Successfully"})

        }catch(err){
            return res.status(500).json({message:err.message})
        }
       
}

export const getMyConnectionsRequests = async(req,res)=>{
    // const {token} = req.body;
    const {token} = req.query;
         
    try{
        const user = await User.findOne({token:token});
        if(!user) {
            return res.status(404).json({message:"User not found"}) 
        }   
        const connection = await ConnectionRequest.find({userId:user._id})
        .populate('userId','name email username profilePicture'); 

        return res.json({connection});

    }catch(err){
        return res.status(500).json({message:err.message})
    }   
}

export const whatAreMyConnections = async(req,res) =>{
    const {token} = req.query;

    try{
     const user = await User.findOne({token});

     if(!user){
        return res.status(400).json({message:"User not found"})
     }

     const connections = await ConnectionRequest.find({connectionId:user._id,status_accepted:true})
     .populate('userId','name username email profilePicture');

     return res.json(connections);


    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const acceptConnectionRequest = async (req,res) =>{
    const {token,requestId,action_type} = req.body;
    try{
        const user = await User.findOne({token});
      
        if(!user){
             return res.status(404).json({message:"user not found"})
        }

        const connection = await ConnectionRequest.findOne({_id:requestId});

        if(!connection){
            return res.status(404).json({message:"Connection not found"})
        }

        if(action_type == "accept"){
            connection.status_accepted = true;
        }else{
            connection.status_accepted = false;
        }

       await connection.save();  // ✅ save changes to DB

        return res.status(200).json({
            message: `Connection request ${action_type}ed successfully`,
            connection
        });
    }catch(err){
      return res.status(500).json({message:err.message})
    }
}


export const getUserProfileAndUserBasedOnUsername = async(req,res)=>{
    const {username} = req.query;

    try{
        const user = await User.findOne({
            username
        });

        if(!user){
           return res.status(404).json({message:"User not found"})
        }

        const userProfile = await Profile.findOne({userId:user._id})
        .populate('userId','name username email profilePicture');
        return res.json({"profile":userProfile})
    }catch(err){
    return res.status(500).json({message:err.message})
    }
}

