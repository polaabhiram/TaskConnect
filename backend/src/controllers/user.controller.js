const s=require('../services/user.service');
const profile=async(req,res,next)=>{try{const data=await s.getProfile(req.user.id,req.user.role);res.json({success:true,data});}catch(e){next(e)}};
const update=async(req,res,next)=>{try{const data=await s.updateProfile(req.user.id,req.user.role,req.body);res.json({success:true,data});}catch(e){next(e)}};
module.exports={profile,update};
