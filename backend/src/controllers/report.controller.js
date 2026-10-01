const {generateMonthlyReport}=require('../services/report.service');
const monthly=async(req,res,next)=>{try{res.json({success:true,data:await generateMonthlyReport(req.user.id)});}catch(e){next(e)}};
module.exports={monthly};
