const {Db_Service} = require('../../config/db_service')

const requestAllowance = async (req,res)=>{
    const {transaction_id} = req.query;

    const updatedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const db = Db_Service.getDbServiceInstance()

    try{
        const result = await db.requestAllowance(updatedDate,transaction_id);
        res.json({result});
    }catch(err){
        res.json({err});
    }
}

module.exports = {requestAllowance}