const {Db_Service} = require('../../config/db_service')
const db = Db_Service.getDbServiceInstance();

// flag = 1 -> Investor to Investor Cycle
// flag = 2 -> Investor to Company Cycle

const sendAllowance = async (req,res)=>{
    const {transaction_id,flag} = req.query;
    const updatedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let status = "Swapping"
    if(flag==1)
        status = "Buyer_USDT_Allowance"
    else if(flag == 2)
        status = "Investor_Swapping"
    try{
        const result = await db.sendAllowance(transaction_id,updatedDate,status);
        res.json({result});
    }catch(err){
        res.json({err});
    }
}

module.exports = {sendAllowance}