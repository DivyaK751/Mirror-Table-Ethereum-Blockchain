// Investor Data

const {Db_Service} = require('../config/db_service')
const db = Db_Service.getDbServiceInstance();


const getAllInvestorsData = async (req,res) =>{
    const data = await db.getAllInvestorsData();
     res.json({data});
}

module.exports = {
    getAllInvestorsData,
    }