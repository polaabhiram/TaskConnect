const s=require('../services/application.service');
const apply=async(req,res,next)=>{try{res.status(201).json({success:true,message:'Application submitted successfully',data:await s.createApplication(req.body.jobId,req.user.id)});}catch(e){next(e)}};
const myApplications=async(req,res,next)=>{try{res.json({success:true,data:await s.getWorkerApplications(req.user.id)});}catch(e){next(e)}};
const received=async(req,res,next)=>{try{res.json({success:true,data:await s.getApplicationsForOwner(req.user.id)});}catch(e){next(e)}};
const updateStatus=async(req,res,next)=>{try{res.json({success:true,data:await s.updateApplicationStatus(req.params.id,req.user.id,req.body.status)});}catch(e){next(e)}};
module.exports={apply,myApplications,received,updateStatus};
