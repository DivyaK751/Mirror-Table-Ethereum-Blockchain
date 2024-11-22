const {txn_store} = require('../../web3_controllers/txn_store');
const { txn_retrieve } = require('../../web3_controllers/txn_retrieve');
const { getLogIdCount } = require('../txnLog_data')
const {Db_Service} = require('../../config/db_service')

const getAcceptance = async (req,res)=>{
    const {transaction_id,comp_status,req_usdt} = req.query;

    const updatedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const db = Db_Service.getDbServiceInstance()

    try{
        const res = await db.getAcceptance(updatedDate,transaction_id,comp_status,req_usdt);
    }catch(err){
        res.json({err});
    }

    const result = await db.getIndvTxn(transaction_id);

    const {company_id,no_of_shares,investor_id,trustee_id,status,created_at,updated_at} = result[0]


    const txn = {
        company_id,
        no_of_shares,
        investor_id,
        trustee_id,
        status,
        created_at,
        updated_at
    }

    //get recent log id
    const LogId = await getLogIdCount();


    // // web3
    const hash= await txn_store(txn,LogId);


   // const response = await txn_retrieve(30);

    // post txn log
    try{
        const result = await db.LogTxn(hash,transaction_id);
        res.json({result})
    }catch(err){
        res.json({err})
    }

}

module.exports = {getAcceptance}