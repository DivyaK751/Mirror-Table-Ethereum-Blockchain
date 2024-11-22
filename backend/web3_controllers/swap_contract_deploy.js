const fs = require('fs');
const path = require('path');
const solc = require('solc');
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = process.env.seed_phrase; // wallet seed phrase
const providerOrUrl = process.env.alchemy_url; /* RINKEBY ENDPOINT */


const provider = new HDWalletProvider({mnemonic:mnemonic, providerOrUrl:providerOrUrl,pollingInterval:3600000});
const web3 = new Web3(provider);

const swap_contract_path = path.join(__dirname+'/swap_contract.sol')

const base_contract = fs.readFileSync(swap_contract_path, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'swap_contract.sol': { content:base_contract }
  },
  settings: {
    outputSelection: { '*': { '*': ['*'] } }
  }
};

// Swap utility function
async function swap_deploy (company_contract_address,company_wallet_address){

  /* 1. Get Wallet address */
  const [account] = await web3.eth.getAccounts();

  /* 2. Compiling Smart Contract including the imports of openzepellin*/
  const compile=solc.compile(JSON.stringify(input));
  const {contracts} = JSON.parse(compile);
  // console.log(contracts);
  const contract = contracts['swap_contract.sol'].TokenSwap;

  /* 3. Extract Abi And Bytecode From Contract */
  const abi = contract.abi;
  const bytecode = contract.evm.bytecode.object;
  console.log("Deploying...");

  /* 4. Deploy company Smart Contract To Blockchain */
  const { _address } = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode,arguments:[web3.utils.toChecksumAddress(company_contract_address),web3.utils.toChecksumAddress(company_wallet_address),web3.utils.toChecksumAddress("0xd8745a134C30527C5406aC2527d0CD127938C5bb"),web3.utils.toChecksumAddress("0x3fa09849d01bdb1bdDdF9012aB36Bce986e376C5")] })
    .send({from: account, gas: 10000000 });
  return (_address);
};


const insert_and_swap= async (comp_contract_addr,comp_wallet_addr)=>{
    
    try{
    const contract_address=await swap_deploy(comp_contract_addr,comp_wallet_addr)
    return contract_address;
  }
  catch(err){
    console.log(err);
  }
    
    
}

module.exports = {insert_and_swap}