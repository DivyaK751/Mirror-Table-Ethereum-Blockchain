// Investor to Investor Listing data

const { Db_Service } = require("../config/db_service");

const db=Db_Service.getDbServiceInstance();

const getListingDetails=async (req,res)=>{
    const {company_id,wallet_addr}=req.query;
    const response=await db.getListing(company_id,wallet_addr);

    res.status(200).json({data:response});
}

module.exports={getListingDetails};