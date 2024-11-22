const {Db_Service} = require('../config/db_service')
const db = Db_Service.getDbServiceInstance();

const getLogIdCount = async (req,res) =>{
   const LogIdCount = await db.getLogIdCount();
    return (LogIdCount[0].count+1)
}

const getIndvRequest = async (req,res) =>{
   const {c_id} = req.query
   const result = await db.getIndvRequest(c_id);
   res.status(200).json({result});
}

module.exports = {
   getLogIdCount,
   getIndvRequest
}