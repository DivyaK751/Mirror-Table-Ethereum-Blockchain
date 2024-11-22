const {Db_Service} = require('../../config/db_service')
const db = Db_Service.getDbServiceInstance();

const getApprovedRequests = async (req,res)=>{
    const {wallet_addr} = req.query;
    console.log(wallet_addr)
    try{
        const result_comp_cycle = await db.getApprovedRequests(wallet_addr);

        const result_inv_cycle_buyer = await db.getInvApprovedRequests(wallet_addr);

        const result_inv_cycle_seller = await db.getInvApprovedRequests_Seller(wallet_addr)

        res.json({
            comp_cycle: result_comp_cycle,
            inv_cycle_buyer:result_inv_cycle_buyer,
            inv_cycle_seller:result_inv_cycle_seller
        });
    }catch(err){
        res.json({err});
    }
}

module.exports = {getApprovedRequests}