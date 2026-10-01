const s=require('../services/auth.service');
const registerWorker=async(req,res,next)=>{try{res.status(201).json({success:true,message:'Worker registered successfully',data:await s.registerWorker(req.body)});}catch(e){next(e)}};
const registerProfessionalBody=async(req,res,next)=>{try{res.status(201).json({success:true,message:'Professional body registered successfully',data:await s.registerProfessionalBody(req.body)});}catch(e){next(e)}};
const loginWorker=async(req,res,next)=>{try{res.json({success:true,message:'Login successful',data:await s.loginWorker(req.body.email,req.body.password)});}catch(e){next(e)}};
const loginProfessionalBody=async(req,res,next)=>{try{res.json({success:true,message:'Login successful',data:await s.loginProfessionalBody(req.body.email,req.body.password)});}catch(e){next(e)}};
const me=(req,res)=>res.json({success:true,data:{userId:req.user.id,role:req.user.role}});
module.exports={registerWorker,registerProfessionalBody,loginWorker,loginProfessionalBody,me};
