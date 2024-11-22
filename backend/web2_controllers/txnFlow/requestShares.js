const {txn_store} = require('../../web3_controllers/txn_store');
const { txn_retrieve } = require('../../web3_controllers/txn_retrieve');
const { getLogIdCount } = require('../txnLog_data')
const {Db_Service} = require('../../config/db_service')

const requestShares = async (req,res)=>{
    const createdDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const db = Db_Service.getDbServiceInstance()

    const investor_id_data = await db.getInvestorByWallet(req.query.wallet_addr)

    const inv_id = investor_id_data.id[0].investor_id;

    const txn = {
        company_id:1, // to be made dynamic since only one company is assumed in our case
        no_of_shares:req.body.reqShares,
        investor_id:inv_id,
        trustee_id:1,
        status:"Initiated",
        created_at:createdDate,
        updated_at:createdDate
    }

    //get recent log id
    const LogId = await getLogIdCount();


    // web3
    const hash= await txn_store(txn,LogId);
    console.log(hash)

    // const response = await txn_retrieve(30);

    // post txn log
    try{
        const result = await db.IntiateTxn(txn);
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

module.exports = {requestShares}