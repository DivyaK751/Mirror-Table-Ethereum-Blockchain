require('dotenv').config();
const express=require("express");
const app=express();
const cors=require('cors');
const bd = require('body-parser')
const corsOptions = require('./config/corsOptions');

// Controllers imports
const {postIndvCompanyData, getAllCompaniesData,getPendingRequests,getContractAddrs,getIndvCompanyData} = require('./web2_controllers/company_data')
const {requestShares} = require('./web2_controllers/txnFlow/requestShares')
const {sendConfirmation} = require('./web2_controllers/txnFlow/sendConfirmation')
const {getAcceptance} = require('./web2_controllers/txnFlow/getAcceptance')
const {getApprovedRequests} = require('./web2_controllers/txnFlow/getApprovedRequests')
const {getIndvRequest} = require('./web2_controllers/txnLog_data')
const {requestAllowance} = require('./web2_controllers/txnFlow/requestAllowance')
const {sendAllowance} = require('./web2_controllers/txnFlow/sendAllowance')
const {getAllInvestorsData} = require('./web2_controllers/investor_data.js')
const {sellSharesRequest} =require("./web2_controllers/investorTxnFlow/sellSharesRequest");
const {updateTxnStatus} =require("./web2_controllers/investorTxnFlow/updateTxnStatus");
const { getListingDetails } = require('./web2_controllers/investor_listing_data');
const { initiateBuyTxn } = require('./web2_controllers/investorTxnFlow/initateBuyTxn');
const {postLoginData} = require('./web2_controllers/login_data.js')

const {swapController} = require('./web3_controllers/swapController')

// Necessary middlewares
app.use(cors({origin: '*'}));
app.use(bd.urlencoded({extended:false}))
app.use(bd.json())

// Main route
app.get('/',(req,res)=>{res.json({msg:"Sever is running successfully"})})

// Login route
app.post('/web2/login/postLoginData',postLoginData)

// Company routes
app.get('/web2/company/getAllCompaniesData',getAllCompaniesData)
app.get('/web2/company/getPendingRequests', getPendingRequests)
app.get('/web2/company/getAcceptance', getAcceptance)
app.post('/web2/company/postIndvCompanyData',postIndvCompanyData)
app.get('/web2/company/getContractAddrs',getContractAddrs)
app.get('/web2/company/updateTxnStatus',updateTxnStatus);
app.get('/web2/company/getIndvCompanyData', getIndvCompanyData)

// Investor routes
app.post('/web3/investor/requestShares', requestShares)
app.get('/web2/investor/getApprovedRequests', getApprovedRequests)
app.get('/web3/investor/sendAllowance',sendAllowance);
app.get('/web2/investor/getAllInvestorsData',getAllInvestorsData)
app.post("/web2/investor/sellShares",sellSharesRequest);
app.get("/web2/investor/getListingDetails",getListingDetails);
app.post("/web2/investor/buyInitiate",initiateBuyTxn);

// Trustee routes
app.get('/web2/trustee/getIndvRequest', getIndvRequest)
app.get('/web2/trustee/sendConfirmation',sendConfirmation)
app.get('/web2/trustee/requestAllowance', requestAllowance)
app.get('/web3/trustee/swap', swapController)

app.listen(5000,()=>{
    console.log("Server is listening to port 5000");
});