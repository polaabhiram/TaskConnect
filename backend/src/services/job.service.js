const Job=require('../../models/Job');
const getAllJobs=async({category,location,search}={})=>{const q={};if(category)q.category=new RegExp(`^${escapeRegex(category)}$`,'i');if(location)q.location=new RegExp(escapeRegex(location),'i');if(search)q.$or=[{title:new RegExp(escapeRegex(search),'i')},{description:new RegExp(escapeRegex(search),'i')}];return Job.find(q).populate('postedBy','name email type location').sort({createdAt:-1});};
const escapeRegex=s=>String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const getJobById=async id=>Job.findById(id).populate('postedBy','name email type location');
const createJob=data=>Job.create(data);
const updateJob=async(id,body)=>Job.findByIdAndUpdate(id,body,{new:true,runValidators:true}).populate('postedBy','name email type location');
const deleteJob=id=>Job.findByIdAndDelete(id);
module.exports={getAllJobs,getJobById,createJob,updateJob,deleteJob};
