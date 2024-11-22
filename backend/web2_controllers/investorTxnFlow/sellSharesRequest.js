const {Db_Service} = require('../../config/db_service');
const { getLogIdCount } = require('../txnLog_data');
const {txn_store} = require('../../web3_controllers/txn_store');
const db = Db_Service.getDbServiceInstance();

const sellSharesRequest=async(req,res)=>{
    const createdDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let {cname,csym,sellShares,pricePerShare,currentAccount}=req.body;
    
    let req_usdt=parseInt(sellShares)*parseInt(pricePerShare);
    sellShares=parseInt(sellShares);

    let investor_id=await db.getInvestorData(currentAccount);
    investor_id=investor_id[0].investor_id;
    const txn = {
        company_id:1, // to be made dynamic
        no_of_shares:sellShares,
        investor_id:investor_id,
        trustee_id:1,
        status:"Investor_Initiated",
        request_usdt:req_usdt,
        created_at:createdDate,
        updated_at:createdDate
    }

    //get recent log id
    const LogId = await getLogIdCount();


    // web3
    const hash= await txn_store(txn,LogId);

    // const response = await txn_retrieve(30);

    // // post txn log
    try{
        const result = await db.IntiateSellTxn_Investor(txn);
        console.log(result["id"]["insertId"]);
        var txn_id=result["id"]["insertId"];

        try{
            const result_log = await db.LogTxn(hash,txn_id);
            console.log(result_log);
            res.json({message:result_log.message});
        }catch(err){
            res.json({err})
        }
    }catch(err){
        res.json({err})
    }
}

module.exports={sellSharesRequest}