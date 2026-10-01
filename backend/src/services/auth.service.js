const bcrypt=require('bcryptjs');
const Worker=require('../../models/Worker'); const ProfessionalBody=require('../../models/ProfessionalBody'); const {generateToken}=require('../utils/jwt');
const safeWorker=w=>({id:w._id,name:w.name,email:w.email,category:w.category,role:'worker'});
const safeBody=b=>({id:b._id,name:b.name,email:b.email,type:b.type,location:b.location,role:'professional-body'});
const registerWorker=async d=>{const email=d.email?.toLowerCase();if(await Worker.findOne({email}))throw Object.assign(new Error('Worker with this email already exists'),{statusCode:409});const w=await Worker.create({...d,email,password:await bcrypt.hash(d.password,10)});return safeWorker(w);};
const registerProfessionalBody=async d=>{const email=d.email?.toLowerCase();if(await ProfessionalBody.findOne({email}))throw Object.assign(new Error('Professional body with this email already exists'),{statusCode:409});const b=await ProfessionalBody.create({...d,email,password:await bcrypt.hash(d.password,10)});return safeBody(b);};
const login=async(model,email,password,role)=>{const doc=await model.findOne({email:email?.toLowerCase()});if(!doc||!(await bcrypt.compare(password||'',doc.password)))throw Object.assign(new Error('Invalid email or password'),{statusCode:401});const user=role==='worker'?safeWorker(doc):safeBody(doc);return {token:generateToken({id:doc._id,role}),user};};
module.exports={registerWorker,registerProfessionalBody,loginWorker:(e,p)=>login(Worker,e,p,'worker'),loginProfessionalBody:(e,p)=>login(ProfessionalBody,e,p,'professional-body')};
