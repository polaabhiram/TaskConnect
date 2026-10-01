const Worker=require('../../models/Worker'); const ProfessionalBody=require('../../models/ProfessionalBody');
const getModel=role=>role==='worker'?Worker:ProfessionalBody;
const getProfile=(id,role)=>getModel(role).findById(id).select('-password');
const updateProfile=async(id,role,body)=>{const allowed=role==='worker'?['name','category','skills','experience','availability']:['name','type','location','description'];const update={};for(const k of allowed)if(body[k]!==undefined)update[k]=body[k];return getModel(role).findByIdAndUpdate(id,update,{new:true,runValidators:true}).select('-password');};
module.exports={getProfile,updateProfile};
