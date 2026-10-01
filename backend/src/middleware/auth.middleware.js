const jwt=require('jsonwebtoken');
const authenticate=(req,res,next)=>{try{const header=req.headers.authorization;if(!header?.startsWith('Bearer '))return res.status(401).json({success:false,message:'Authentication required'});const token=header.split(' ')[1];req.user=jwt.verify(token,process.env.JWT_SECRET);next();}catch(e){return res.status(401).json({success:false,message:'Invalid or expired token'});}};
module.exports={authenticate};
