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
const contractaddress="0x49D26BA76DF6F9DC184843602359C0026e894A9A" 



const txn_store = async (txn,log_id)=>{
    const signer = await provider.getSigner();
    const contractfunction = new ethers.Contract(contractaddress,erc20abi, signer);

    txn = Buffer.from(JSON.stringify(txn)).toString('base64')

    try {
        const response=await contractfunction.store(txn,log_id);
        return (response.hash);     
      } 
      catch (error) {
        return error;
      }
      
}

module.exports = {txn_store}
