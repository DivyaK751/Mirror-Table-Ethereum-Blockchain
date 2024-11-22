const { Db_Service } = require("../../config/db_service");

const db=Db_Service.getDbServiceInstance();

const initiateBuyTxn=async(req,res)=>{

    const {wallet_addr,txn_id} =req.body;

    // insert into listing table
    try{
    await db.insertWalletAddress(txn_id,wallet_addr);
    }
    catch(err){
        console.log(err);
    }

    // update txn status
    const updatedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    try{
        const response = await db.sendConfirmation("Buyer_Initiated",updatedDate,txn_id);
        res.json({message:"Buy Request accepted"});
    }catch(err){
        res.json({err});
    }
}

module.exports={initiateBuyTxn};