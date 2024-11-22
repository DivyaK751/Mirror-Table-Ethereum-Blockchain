const {txn_store} = require('../../web3_controllers/txn_store');
const { txn_retrieve } = require('../../web3_controllers/txn_retrieve');
const { getLogIdCount } = require('../txnLog_data')
const {Db_Service} = require('../../config/db_service')

const sendConfirmation = async (req,res)=>{
    const {transaction_id,flag} = req.query;
    
    // flag =0 -> new investor from company
    // flag =1 -> existing investor selling
    // flag =2 -> for buyer buying from existing investor

    const updatedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const db = Db_Service.getDbServiceInstance()
    let flag_status="Processing"
    if(flag==1){
        flag_status="Investor_Processing";
    }
    else if(flag==2){
        flag_status="Buyer_Processing";
    }
    try{
        const res = await db.sendConfirmation(flag_status,updatedDate,transaction_id);
    }catch(err){
        res.json({err});
    }

    const result = await db.getIndvTxn(transaction_id);

    const {company_id,no_of_shares,investor_id,trustee_id,status,request_usdt,created_at,updated_at} = result[0]

    // Txn object going to be stored in blockchain
    const txn = {
        company_id,
        no_of_shares,
        investor_id,
        trustee_id,
        status,
        request_usdt,
        created_at,
        updated_at
    }

    //get recent log id
    const LogId = await getLogIdCount();


    // // web3
    const hash= await txn_store(txn,LogId);

    // // const response = await txn_retrieve(30);

    // post txn log 
    try{
        const result = await db.LogTxn(hash,transaction_id);
        res.json({result})
    }catch(err){
        res.json({err})
    }

}

module.exports = {sendConfirmation}