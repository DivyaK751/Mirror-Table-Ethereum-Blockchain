// Company Mint Smart contract deployment

const fs = require('fs');
const path = require('path');
const solc = require('solc');
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = process.env.seed_phrase; // wallet seed phrase
const providerOrUrl = process.env.alchemy_url /* RINKEBY ENDPOINT */


const provider = new HDWalletProvider({mnemonic:mnemonic, providerOrUrl:providerOrUrl,pollingInterval:3600000});
const web3 = new Web3(provider);

const company_contract_path = path.join(__dirname+'/company_contract.sol')

// const base_contract = fs.readFileSync('./company_contract.sol', 'utf8');
const base_contract = fs.readFileSync(company_contract_path, 'utf8');

//dependencies
const ERC20sol=fs.readFileSync('node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol', 'utf8');
const IERC20sol=fs.readFileSync('node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol', 'utf8');
const IERC20meta=fs.readFileSync('node_modules/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol', 'utf8');
const contextsol=fs.readFileSync("node_modules/@openzeppelin/contracts/utils/Context.sol",'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'company_contract.sol': { content:base_contract }
  },
  settings: {
    outputSelection: { '*': { '*': ['*'] } }
  }
};

function findImports(path) {
    if (path === '@openzeppelin/contracts/token/ERC20/ERC20.sol'){
        return {
            contents: ERC20sol
        };
    }
    else if(path==='@openzeppelin/contracts/token/ERC20/IERC20.sol'){
        return{
            contents:IERC20sol
        }
    }
    else if(path==='@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol')
    {
        return{
            contents:IERC20meta
        }
    }
    else if(path==='@openzeppelin/contracts/utils/Context.sol'){
        return{
            contents:contextsol
        }
    }
    else {
        return { error: 'File not found' }};
  }

// Deploy utility function
async function deploy (name,symbol,share_count,address){

  /* 1. Get Wallet address */
  const [account] = await web3.eth.getAccounts();

  /* 2. Compiling Smart Contract including the imports of openzepellin*/
  const compile=solc.compile(JSON.stringify(input),{import:findImports});
  const {contracts} = JSON.parse(compile);

  const contract = contracts['company_contract.sol'].Token;

  /* 3. Extract Abi And Bytecode From Contract */
  const abi = contract.abi;
  const bytecode = contract.evm.bytecode.object;
  console.log("Starting...");

  /* 4. Deploy company Smart Contract To Blockchain */
  const { _address } = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode,arguments:[name,symbol,share_count,web3.utils.toChecksumAddress(address)] })
    .send({from: account, gas: 10000000 });

  return (_address);
};

const insert_and_deploy= async (comp_name,comp_symb,comp_shares,comp_wallet_addr)=>{
    // get company details from the form through req.body
    // deploy contract first
    try{
    const contract_address=await deploy(comp_name,comp_symb,comp_shares,comp_wallet_addr)
    return contract_address;
  }
  catch(err){
    console.log(err);
  }   
}

module.exports = {insert_and_deploy}