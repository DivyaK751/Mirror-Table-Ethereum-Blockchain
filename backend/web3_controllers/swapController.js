// Swap Controller handling the request received from the client

require('dotenv').config();
const ethers = require('ethers');
const fs = require('fs')

const mnemonic = process.env.seed_phrase; // wallet seed phrase
const providerOrUrl = process.env.alchemy_url /* RINKEBY ENDPOINT */
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Db_Service } = require('../config/db_service');
const db = Db_Service.getDbServiceInstance();

const wallet = new HDWalletProvider({mnemonic:mnemonic, providerOrUrl:providerOrUrl,pollingInterval:3600000});

const provider = new ethers.providers.Web3Provider(wallet);


// contract address 
const erc20abi= fs.readFileSync(__dirname+'/swapABI.json', 'utf8'); // importing abi of our contract after compilation from remix IDE

// flag=0 -> Investor - Company cycle , flag=1 -> Investor - Investor cycle

const swapController = async (req,res)=>{
    let {transaction_id,flag} = req.query;
    flag=parseInt(flag);

    // Investor-Company cycle
    if(flag==0){

      const response=await db.retrieveForSwap(transaction_id);    
  
      const {no_of_shares,request_usdt,wallet_addr,swap_contract_addr} = response[0]
  
      const signer = await provider.getSigner();
      const contractfunction = new ethers.Contract(swap_contract_addr,erc20abi, signer);
  
      var swap_txn_hash = ""
  
      try {
          console.log("Starting swap.....")
          const response=await contractfunction.swap(no_of_shares,request_usdt*100,wallet_addr);
          swap_txn_hash = response.hash;
        } 
      catch (error) {
          return error;
      }
  
      const createdDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      const afterSwapRes=await db.swapSuccessUpdate(createdDate,transaction_id,swap_txn_hash);

      // To get and update company shares
      const comp_data = await db.getAllCompanyData();
      const updateSharesRes = await db.updateCompanyShares(comp_data[0].no_of_shares,no_of_shares)
  
      res.json({response:afterSwapRes})

      // Investor-Investor cycle
    }else if(flag==1){
      const response=await db.retrieveForSwapInvestor(transaction_id);
      const {no_of_shares,request_usdt,swap_contract_addr,buyer_wallet_addr,seller_wallet_addr} = response[0]

      const signer = await provider.getSigner();
      const contractfunction = new ethers.Contract(swap_contract_addr,erc20abi, signer);
  
      var swap_txn_hash = ""
  
      try {
          console.log("Starting swap..... investor cycle")
          const response=await contractfunction.swap_investor_to_investor(no_of_shares,request_usdt*100,buyer_wallet_addr,seller_wallet_addr);
          swap_txn_hash = response.hash;
        } 
        catch (error) {
          return error;
      }

      const createdDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      const afterSwapRes=await db.swapSuccessUpdate(createdDate,transaction_id,swap_txn_hash);
  
      res.json({response:afterSwapRes})

    }else{
      res.json({data:"error"})
    }
    
}

module.exports = {swapController}
