const { Db_Service } = require("../../config/db_service");
const db = Db_Service.getDbServiceInstance();
const { getLogIdCount } = require('../txnLog_data');
const {txn_store} = require('../../web3_controllers/txn_store');

const updateTxnStatus=async(req,res)=>{
    const{transaction_id,comp_status}=req.query;
    const updatedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    //For status change
    await db.updateTxnTable(comp_status,parseInt(transaction_id),updatedDate);

    // get details for blockchain push
    const response=await db.getTransactionDetails(transaction_id);
    console.log(response[0]);
    const txn=response[0];

    // add to listing table
    if(comp_status==="Investor_Approved"){
        // steps 1 - get investor wallet address
        let investor_tuple=await db.getInvestorDataByID(txn.investor_id);
        investor_tuple=investor_tuple[0];

        // txn_id, seller_wallet_addr
        await db.insertInvestor_Listing(txn.transaction_id,investor_tuple.wallet_addr);
    }
    
    //get recent log id
    const LogId = await getLogIdCount();

    // web3
    const hash= await txn_store(txn,LogId);
    
        try{
            const result_log = await db.LogTxn(hash,txn.transaction_id);
            console.log(result_log);
            res.json({message:result_log.message});
        }catch(err){
            res.json({err})
        }
    
}

module.exports={updateTxnStatus};