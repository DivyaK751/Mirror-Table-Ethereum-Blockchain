import Table from 'react-bootstrap/Table';
import { ethers } from "ethers";
import erc20abi from "./ERC20abi.json";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import React, { useState,useEffect } from 'react';
import { useWeb3React } from "@web3-react/core";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Wallet from "./wallet";
import axios from '../api/axios';
import Investor_mirrortable from './investor_mirrortable';

export default function Investor() {
    // wallet address
    const {
        account,
      } = useWeb3React();



    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showShares, setRequest] = useState(false);

    // Request Modal
    const [cname, setName] = useState("");
    const [csym, setSym] = useState("");
    const [reqShares, setReqShares]= useState(0);

    // Sell Shares Modal
    const [sellModal, setSellModal] = useState(false);
    const [sellShares, setSellShares] = useState(0)
    const [pricePerShare, setPricePerShare] = useState(0);

    // Buy Shares Modal
    const [buyModal,setBuyModal]=useState(false);
    const [sellerListing,setSellerListing]=useState([]);

    // Approved Modal useStates
    const [approvedModal, setApprovedModal] = useState(false);
    const [approvedSharesList, setApprovedSharesList] = useState([]);
    const [approvedInvSharesList_Buyer, setApprovedInvSharesList_Buyer] = useState([]);
    const [approvedInvSharesList_Seller, setApprovedInvSharesList_Seller] = useState([]);

    // retrieve wallet address
    const [currentAccount, setCurrentAccount] = useState("");
    const [userAddress, setUserAddress] = useState("");

    // 2nd cycle buy table
    async function getCompanyBuyData(company_id,walletaddress){
       try{
            const response = await axios.get('http://localhost:5000/web2/investor/getListingDetails?company_id='+company_id+"&wallet_addr="+walletaddress,{
                headers: { 'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' },
                });
            console.log(response.data.data);
            setSellerListing(response.data.data);
       }catch(err){
        console.log(err);
       }
    }

    async function buyerInitateTxn(wallet_addr,txn_id){
        try{
            const response = await axios.post("http://localhost:5000/web2/investor/buyInitiate",
            {wallet_addr,txn_id},
            {
                headers: { 'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' }
            }
            )
            console.log(response.data)
        }catch(err){
            console.log(err);
        }
    }

    const checkIfWalletIsConnected = async () =>{
        try{
          const { ethereum } = window;
          if(!ethereum){
            console.log("Connect your wallet!");
          } else{
            detailsOn();
          }
          const accounts = await ethereum.request({method: 'eth_accounts'});
          if(accounts !== 0){
            const account = accounts[0];
            console.log("Found an authorized account ", account);
            setCurrentAccount(account);
            fetchApprovedRequests(account);
            detailsOn();
          } else{
            console.log("Could not find an authorized account");
          }
        } catch(error){
          console.log(error);
        }
      }

      async function fetchApprovedRequests(account){
        console.log(account)
        let response = await axios.get("http://localhost:5000/web2/investor/getApprovedRequests?wallet_addr="+account,
            {
                headers: { 'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' },
            }
        )
        setApprovedSharesList(response.data.comp_cycle);
        setApprovedInvSharesList_Buyer(response.data.inv_cycle_buyer);
        setApprovedInvSharesList_Seller(response.data.inv_cycle_seller);
    }



      const detailsOn = async () =>{
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        
        const addr = await signer.getAddress();
        setUserAddress(addr.toString());
    }
    // Handle Sell Shares
    const handleSellShares = async () =>{
        try{
            const response = await axios.post("http://localhost:5000/web2/investor/sellShares",
            {cname,csym,sellShares,pricePerShare,currentAccount},
            {
                headers: { 'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' }
            }
            )
            console.log(response.data)
        }catch(err){
            console.log(err);
        }
    }


    const handleRequestClose = async () => {
        try{
            const response =await axios.post("http://localhost:5000/web3/investor/requestShares?wallet_addr="+currentAccount,
        {cname,csym,reqShares}
        ,{
            headers: { 'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' },
        })
        setRequest(false);
        console.log(response.data)
    }catch(err){
        console.log(err)
    }
    }
    const handleModalClose = async () => {
        setRequest(false);
    }
    const handleRequestOpen = (name,sym) =>{ setRequest(true);
    console.log(name,sym);
    setName(name);
    setSym(sym);
    }

    const [wall, setWall] = useState(false);

    const handleWallClose = () => setWall(false);
    const handleWallShow = () => setWall(true);

    const [companies, setCompanies] = useState([]);

    // Allowance Function
    const handleSendApprovedUSDT =async (req_usdt,txn_id,flag) =>{

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const erc20 = new ethers.Contract('0xd8745a134C30527C5406aC2527d0CD127938C5bb', erc20abi, signer);
        const approveResponse = await erc20.approve("0xcA0F358108F2776a16e1bcc9ea008F41607b0f16",req_usdt*100);
        await approveResponse.wait();

        const response = await axios.get('http://localhost:5000/web3/investor/sendAllowance?transaction_id='+txn_id+"&flag="+flag,{
        headers: { 'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' },
        })

        console.log(response)
    }

    const handleShareAllowance =async (no_of_shares,txn_id,comp_contract_addr,comp_swap_addr) =>{

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const erc20 = new ethers.Contract(comp_contract_addr, erc20abi, signer);
        const approveResponse = await erc20.approve(comp_swap_addr,no_of_shares);
        await approveResponse.wait();

        const response = await axios.get('http://localhost:5000/web3/investor/sendAllowance?transaction_id='+txn_id+"&flag=2",{
        headers: { 'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' },
        })

        console.log(response)
    }

    useEffect(() =>{
        async function walletconnect(){
            await checkIfWalletIsConnected();
            window.ethereum.on('accountsChanged', function (accounts) {
            console.log("New account", accounts[0]);
            setCurrentAccount(accounts[0]);
            fetchData(accounts[0]);
            fetchApprovedRequests(accounts[0]);
          })
        }
        walletconnect();
        
            async function fetchData(){
                let response = await axios.get("http://localhost:5000/web2/company/getAllCompaniesData",
                    {
                        headers: { 'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*' },
                    }
                )
                setCompanies(response.data.data);
                console.log(response.data.data[0]);
            }
            fetchData();
      }, []);
    
        return (
            <>
            <Navbar bg="dark" variant="dark">
                <Container>
                <Navbar.Brand href="#home">
                    Investor Page
                </Navbar.Brand>
                <Button variant="primary" onClick={handleShow}>Balance</Button>
                <Button variant="primary" onClick={handleWallShow}>Wallet</Button>
                <Button variant="primary" onClick={()=>setApprovedModal(true)}>Approved Requests</Button>
                <Button variant="primary" onClick={()=>setApprovedModal(true)}>Sell Shares</Button>
                </Container>
            </Navbar>

            {/* Wallet Connect Modal */}
            <Modal show={wall} onHide={handleWallClose}>
            <Modal.Header closeButton>
                <Modal.Title>Wallet Connect</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Wallet/>
                </Modal.Body>
            </Modal>
            <Container style={{marginTop: "5%"}}>
            <Row>
                <Table striped="columns">
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Company Name</th>
                    <th>Symbol</th>
                    <th>Quantity (N)</th>
                    <th>NAV($)</th>
                    <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        companies.map((value, key) => {
                        return (
                            <tr>
                            <td>{key+1}</td>
                            <td>{value.company_name}</td>
                            <td>{value.company_sym}</td>
                            <td>{value.no_of_shares}</td>
                            <td>To Be Given</td>
                            <td><Button variant="primary" style={{marginRight:"5px"}} onClick={e=>{
                                handleRequestOpen(value.company_name,value.company_sym)
                            }}>Request</Button>

                            <Button variant="primary" style={{marginRight:"5px"}} onClick={e=>{
                                getCompanyBuyData(value.company_id,currentAccount);
                                setBuyModal(true)
                            }}>Buy Shares</Button>
                            
                            <Button variant="primary" onClick={e=>{
                                // handleRequestOpen(value.company_name,value.company_sym)
                                setName(value.company_name);
                                setSym(value.company_sym);
                                setSellModal(true)
                            }}>Sell Shares</Button></td>
                            </tr>
                        )
                        })
                    }
                </tbody>
                </Table>
            </Row>
            </Container>

                    {/* Balance Modal */}
            <Modal show={show} onHide={()=>{setShow(false);window.location.replace("/investor")}} size="xl">
                <Modal.Header closeButton>
                <Modal.Title>Balance</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{overflowX:"scroll"}}><Investor_mirrortable/></Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={()=>{window.location.replace("/investor")}}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>

                {/* Request Shares Modal */}
            <Modal show={showShares} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Request shares</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                    <Form.Group className="mb-3" controlId="seller">
                            <Form.Label>Company Name</Form.Label>
                            <Form.Control type="text" name="seller" placeholder="Company Name" value={cname} disabled={true}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="assetid">
                            <Form.Label>Token Name</Form.Label>
                            <Form.Control type="text" name="assetid" placeholder="Token Name"  value={csym} disabled={true}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="assetid">
                            <Form.Label>Quantity of shares</Form.Label>
                            <Form.Control type="text" name="assetid" value={reqShares} onChange={(e)=>{setReqShares(e.target.value)}} placeholder="Enter the amount of shares" />
                        </Form.Group>

                        <div className="text-center" >
                    <Button variant="primary" onClick={handleRequestClose}>
                        Request
                        </Button>  
                        </div>
                        
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Approved Request Modal */}
            <Modal show={approvedModal} onHide={()=>setApprovedModal(false)} dialogClassName="modal-90w" size="xl" aria-labelledby="example-custom-modal-styling-title">
            <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
                    Approved Requests
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Table striped bordered hover size="sm">
            <thead>
                <tr>
                <th>#</th>
                <th>Transaction_ID</th>
                <th>Company name</th>
                <th>Request Shares Cost</th>
                <th>No of Shares</th>
                <th>Action</th>
                </tr>
            </thead>
            <tbody>
                    {
                        
                        approvedSharesList.map((value, key) => {
                        return (
                            <tr>
                            <td>{key+1}</td>
                            <td>{value.transaction_id}</td>
                            <td>{value.company_name}</td>
                            <td>{value.request_usdt}</td>
                            <td>{value.no_of_shares}</td>
                            <td><Button variant="success" onClick={()=>{

                                handleSendApprovedUSDT(value.request_usdt,value.transaction_id,0)

                                }}>USDT Allowance</Button></td>
                            </tr>
                        )
                        })
                    }
                    {
                        
                        approvedInvSharesList_Buyer.map((value, key) => {
                        return (
                            <tr>
                            <td>{key+1}</td>
                            <td>{value.transaction_id}</td>
                            <td>{value.company_name}</td>
                            <td>{value.request_usdt}</td>
                            <td>{value.no_of_shares}</td>
                            <td><Button variant="success" onClick={()=>{

                                handleSendApprovedUSDT(value.request_usdt,value.transaction_id,1)

                                }}>USDT Allowance</Button></td>
                            </tr>
                        )
                        })
                    }
                    {
                        
                        approvedInvSharesList_Seller.map((value, key) => {
                        return (
                            <tr>
                            <td>{key+1}</td>
                            <td>{value.transaction_id}</td>
                            <td>{value.company_name}</td>
                            <td>{value.request_usdt}</td>
                            <td>{value.no_of_shares}</td>
                            {/* Need to change the handler */}
                            <td><Button variant="danger" onClick={()=>{

                                handleShareAllowance(value.no_of_shares,value.transaction_id,value.contract_addr,value.swap_contract_addr)

                                }}>Seller Allowance</Button></td>
                            </tr>
                        )
                        })
                    }
                </tbody>
            </Table>
            </Modal.Body>
        </Modal>

        {/* Sell Shares Modal */}
        <Modal show={sellModal} onHide={()=>setSellModal(false)} size="lg">
                <Modal.Header closeButton>
                <Modal.Title>Sell Shares</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="seller">
                            <Form.Label>Company</Form.Label>
                            <Form.Control type="text" name="seller" placeholder="Company Name" value={cname} disabled={true}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="assetid">
                            <Form.Label>Token Name</Form.Label>
                            <Form.Control type="text" name="assetid" placeholder="Token Name"  value={csym} disabled={true}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="assetid">
                            <Form.Label>Number of Shares </Form.Label>
                            <Form.Control type="Number" name="assetid" value={sellShares} onChange={(e)=>{setSellShares(e.target.value)}} placeholder="Enter the amount of shares to sell" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="assetid">
                            <Form.Label>Price Per Share</Form.Label>
                            <Form.Control type="Number" name="assetid" value={pricePerShare} onChange={(e)=>{setPricePerShare(e.target.value)}} placeholder="Enter the price per share" />
                        </Form.Group>

                        <div className="text-center" >
                    <Button variant="primary" onClick={()=>{handleSellShares()}}>
                        Request
                        </Button>  
                        </div>
                        
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={()=>setSellModal(false)}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
                
            {/* buy shares modal */}
            <Modal show={buyModal} onHide={()=>setBuyModal(false)} dialogClassName="modal-90w" size="xl" aria-labelledby="example-custom-modal-styling-title">
            <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
                    Buy Shares
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Table striped bordered hover size="sm">
            <thead>
                <tr>
                <th>#</th>
                <th>Listing ID</th>
                <th>No of shares</th>
                <th>Total Cost</th>
                <th>Action</th>
                </tr>
            </thead>
            <tbody>
                    {
                        
                        sellerListing.map((value, key) => {
                        return (
                            <tr>
                            <td>{key+1}</td>
                            <td>{value.transaction_id}</td>
                            <td>{value.no_of_shares}</td>
                            <td>{value.request_usdt}</td>
                            <td><Button variant="success" onClick={()=>{buyerInitateTxn(currentAccount,value.transaction_id)}}>Buy Now</Button></td>
                            </tr>
                        )
                        })
                    }
                </tbody>
            </Table>
            </Modal.Body>
        </Modal>
            </>
        );
    }
