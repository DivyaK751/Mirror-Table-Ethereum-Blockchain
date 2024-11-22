require('dotenv').config();
const ethers = require('ethers');
const fs = require('fs')

const mnemonic = process.env.seed_phrase; // wallet seed phrase
const providerOrUrl = process.env.alchemy_url /* RINKEBY ENDPOINT */
const HDWalletProvider = require('@truffle/hdwallet-provider');

const wallet = new HDWalletProvider({mnemonic:mnemonic, providerOrUrl:providerOrUrl,pollingInterval:3600000});

const provider = new ethers.providers.Web3Provider(wallet);


// contract address 
const erc20abi= fs.readFileSync(__dirname+'/txnStoreABI.json', 'utf8'); // importing abi of our contract after compilation from remix IDE
const contractaddress="0xfd5fbe1c62d567d30df89b4593ca397ef3fe4c53" 



const txn_retrieve = async (log_id)=>{
    const contractfunction = new ethers.Contract(contractaddress,erc20abi, provider);
    try {
        var response=await contractfunction.retrieve(log_id);
        response = Buffer.from(response, 'base64').toString('utf-8')
        return (response);     
      } 
      catch (error) {
        return error;
      }
}

module.exports = {txn_retrieve}