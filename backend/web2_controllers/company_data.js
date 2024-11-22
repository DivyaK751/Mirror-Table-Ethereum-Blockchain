// Company Data

const {Db_Service} = require('../config/db_service')
const db = Db_Service.getDbServiceInstance();
const {insert_and_deploy} = require('../web3_controllers/company_deploy')
const {insert_and_swap} = require('../web3_controllers/swap_contract_deploy')

const postIndvCompanyData = async (req,res) =>{
    var {comp_wallet_addr,comp_name,comp_symb,comp_shares} = req.body;

    comp_shares = parseInt(comp_shares) // comp_shares is string in req.body     

    try{
        const comp_contract_addr = await insert_and_deploy(comp_name,comp_symb,comp_shares,comp_wallet_addr);
        const swap_contract= await insert_and_swap(comp_contract_addr,comp_wallet_addr);
        console.log("Company address retrieved");

        const result = await db.mint(comp_wallet_addr,comp_name,comp_symb,comp_shares,comp_contract_addr,swap_contract);

        res.json({
            result:result.id,
            msg:result.message,
        })
    }catch(error){
        res.json({
            msg:"error",
            err:error
        })
    }

}

const getPendingRequests =async(req,res) =>{
    const {wallet_addr}=req.query;

    const data_seller=await db.getPendingRequests(wallet_addr);
    const data_buyer_processing =await db.getPendingRequests_Buyer_Processing(wallet_addr);

    res.json({seller:data_seller,buyer:data_buyer_processing});
}


const getAllCompaniesData = async (req,res) =>{
    const data = await db.getAllCompanyData();
     res.json({data});
}

const getContractAddrs = async (req,res) =>{
    const {wallet_addr} = req.query;
    const data = await db.getContractAddrs(wallet_addr);
    res.json({data});
}

const getIndvCompanyData = async (req,res) =>{
    const {wallet_addr} = req.query;
    const data = await db.getIndvCompanyData(wallet_addr);
    res.json({data});
}

module.exports = {
    postIndvCompanyData,
    getAllCompaniesData,
    getPendingRequests,
    getContractAddrs,
    getIndvCompanyData
}