import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import erc20abi from "./ERC20abi.json";
import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import Modal from 'react-bootstrap/Modal';
import Mint from './mint_shares';
import Wallet from "./wallet";
import companyABI from "./ABIs/companyABI.json";
import Form from 'react-bootstrap/Form';
import { ethers } from "ethers";
import { Stack } from '@chakra-ui/react';
import MirrorTable from './mirrortable';
export default function Company() {

    const [currentAccount, setCurrentAccount] = useState("");
    const [userAddress, setUserAddress] = useState("");

    const [pendingRequests,setPendingRequests]=useState([]);
    const detailsOn = async () =>{
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        
        const addr = await signer.getAddress();
        setUserAddress(addr.toString());
    }
    
    //State variable to iterate through all dates
    const [filterDate, setFilterDate] = useState([]);
    const [mirrorInfo, setMirrorInfo] = useState([]);


    //Request USDT
    const [open, ModalUSDT] = useState(false);
    const [usdt, setUSDT] = useState(0);
    const handleRequestUSDT = (usd) => setUSDT(usd);
    const handleUSDTClose = () => setUSDT(0);
    //to store contract address
    const [comp_contract, setComp_Contract] = useState({});
    
    const checkIfWalletIsConnected = async () =>{
        try{
          const { ethereum } = window;
          if(!ethereum){
            console.log("Connect your wallet!");
          } else{
            // console.log("Ethereum object found", ethereum);
            detailsOn();
          }
          const accounts = await ethereum.request({method: 'eth_accounts'});
          if(accounts !== 0){
            const account = accounts[0];
            console.log("Found an authorized account ", account);
            setCurrentAccount(account);
            fetchData(account);
            detailsOn();
          } else{
            console.log("Could not find an authorized account");
          }
        } catch(error){
          console.log(error);
        }
      }

      async function fetchData(acc){
        console.log(acc);
        let response = await axios.get("http://localhost:5000/web2/company/getPendingRequests?wallet_addr="+acc,
            {
                headers: { 'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' },
            }
        )
        console.log(response.data);
        let combined=response.data.buyer.concat(response.data.seller);
        console.log(combined);
        setPendingRequests(combined);
            //to get contract address and swap contract address
        response = await axios.get("http://localhost:5000/web2/company/getContractAddrs?wallet_addr="+acc,
            {
                headers: { 'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' },
            }
        )
        setComp_Contract(response.data.data[0]);
        // console.log(response.data.data);
    }

    const [accept, setApproval] = useState(false);
    const [transact, setTransaction_ID] = useState(0);
    const [no_of_shares, setNo_of_shares] = useState(0);
    const [status , setStatus] = useState("");

    //start date and end date
    const [start_date, setStart_Date] = useState("");
    const [end_date, setEnd_Date] = useState("");

    const handleAcceptRequestClose = () => setApproval(false);
    const handleAcceptRequestOpen = (transaction_id,no_of_shares,status) => {
        
        setNo_of_shares(no_of_shares);
        setTransaction_ID(transaction_id);
        console.log(status);
        if(status === "Rejected")
            ModalUSDT(false);
        else
            ModalUSDT(true);
        setStatus(status);
    }

    //MirrorTable retrieval 
    const getTimeStamps =async (start,end) =>{
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const erc20 = new ethers.Contract('0x39CB6d6b841514eae59011220cd57951DFC2898e',companyABI, provider);
        const TimeStamps = await erc20.getTimeStamps();

        var dates=[];
        var table=[];
        var row_tuple=[];
        for(let i=0;i<TimeStamps.length;i++)
        {
            var curr_date=new Date(parseInt(TimeStamps[i]._hex,16)*1000);
            console.log(curr_date);
            if(curr_date>=start && curr_date<=end)
            {
                dates.push(curr_date);
                const getTransaction = await erc20.getdetails(TimeStamps[i]._hex);
                table.push(getTransaction);
            }       
        }
        for(let j=0;j<table[0][1].length;j++)
        {
            var tuple=[];
            for(let i=0;i<table.length;i++)
            {
                tuple.push(parseInt(table[i][1][j]._hex,16));
            }
            row_tuple.push(tuple);
        }
        var wallet_addr = table[0][0];

        const response = await axios.get('http://localhost:5000/web2/investor/getAllInvestorsData')

        var walletToInvName ={} 

        const allInvestors = response.data.data

        for(let i=0;i<allInvestors.length;i++){
           walletToInvName[allInvestors[i].wallet_addr] = allInvestors[i].investor_name
        }

        
        for(let i=0;i<wallet_addr.length;i++)
        {
            row_tuple[i].unshift(walletToInvName[wallet_addr[i]]);
        }
        console.log(row_tuple);
        setFilterDate(dates);
        setMirrorInfo(row_tuple);
        
    }

    useEffect(async() =>{
        await checkIfWalletIsConnected();
        window.ethereum.on('accountsChanged', function (accounts) {
            console.log("New account", accounts[0]);
            setCurrentAccount(accounts[0]);
            fetchData(accounts[0]);
          })

    //to retrieve Mirrortable from companyABI.json
    
    var date = new Date(Date.now());
    date.setDate(date.getDate() - 7);
    getTimeStamps(date,new Date(Date.now()));

      }, []);



    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [holdings, setHolding] = useState(false);
    const handleHoldingClose = () => setHolding(false);
    const handleHoldingShow = () => setHolding(true);

    const [wall, setWall] = useState(false);

    const handleWallClose = () => setWall(false);
    const handleWallShow = () => setWall(true);

    const [request, setRequest] = useState(false);

    const handleRequestClose = () => setRequest(false);
    const handleRequestShow = () => setRequest(true);


    function handleCallback(childData){
        console.log({msg: childData});
    }
    // handle updation of txn status 
    async function updateTxnStatus(status,txnid){
        let response = await axios.get("http://localhost:5000/web2/company/updateTxnStatus?transaction_id="+txnid+"&comp_status="+status,
                {
                    headers: { 'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' },
                }
            )
    }

    async function handleUSDT()
    {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const erc20 = new ethers.Contract(comp_contract.contract_addr, erc20abi, signer);
        const approveResponse = await erc20.approve(comp_contract.swap_contract_addr,no_of_shares);
        await approveResponse.wait();

        console.log(approveResponse);

        async function Accept(){
            let response = await axios.get("http://localhost:5000/web2/company/getAcceptance?transaction_id="+transact+"&comp_status="+status+"&req_usdt="+usdt,
                {
                    headers: { 'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' },
                }
            )
        }
        Accept();
    }

        return (
            <>
            <Navbar bg="dark" variant="dark">
                <Container>
                <Navbar.Brand href="#home">
                    {comp_contract.company_name}
                </Navbar.Brand>
                <Button variant="primary" onClick={handleShow}>Mint</Button>
                <Button variant="primary" onClick={handleWallShow}>Wallet</Button>
                <Button variant="primary" onClick={handleHoldingShow}>Current Holdings</Button>
                <Button variant="primary" onClick={handleRequestShow}>View Requests</Button>
                </Container>
            </Navbar>
            <Container>
                
                    <Form>
                    <Stack direction="horizontal" gap={5}>
                    
                    <Form.Group className="mb-3" style={{padding: '1%',width:'20%'}} controlId="seller">
                            <Form.Label>Start</Form.Label>
                            <Form.Control type="date" name="start_date" onChange={(e)=>{setStart_Date(e.target.value)}} value={start_date}/>
                    </Form.Group>
                    
                    
                    <Form.Group className="mb-3" style={{padding: '1%',width:'20%'}} controlId="seller">
                            <Form.Label>End</Form.Label>
                            <Form.Control type="date" name="end_date" onChange={(e)=>{setEnd_Date(e.target.value)}} value={end_date}/>
                    </Form.Group>
                    
                    
                    <Button variant="primary" style={{width:'10%',height:"5%",marginTop:"4%"}} onClick={()=>{let startdate=new Date(start_date);startdate.setDate(startdate.getDate()-1);getTimeStamps(startdate,new Date(end_date))}}>
                        Submit
                    </Button> 
                    
                    </Stack>
                    </Form>
                
            </Container>

            <Modal show={wall} onHide={handleWallClose}>
            <Modal.Header closeButton>
                <Modal.Title>Wallet Connect</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Wallet parentCallback = {handleCallback}/>
                </Modal.Body>
            </Modal>
            <Container style={{marginTop: "5%"}}>
            <Row>
                <Table striped="columns">
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Investor Name</th>
                    {
                        filterDate.map((value) => {
                        return (
                            <th>{value.toLocaleString([],{hour12:false})}</th>
                            )
                        })
                    }
                    </tr>
                </thead>
                <tbody>
                    
                                {mirrorInfo.map((items, index) => {
                                return (
                                <tr>
                                    <td>{index+1}</td>
                                    {items.map((subItems, sIndex) => {
                                    return <td> {subItems} </td>;
                                    })}
                                </tr>
                                );
                    })}
                    
                </tbody>
                </Table>
            </Row>
            </Container>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Mint Tokens</Modal.Title>
                </Modal.Header>
                <Modal.Body><Mint addr={currentAccount}/></Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
                
                {/* MirrorTable view */}
            <Modal show={holdings} onHide={()=>window.location.replace("/company")}>
                <Modal.Header closeButton>
                <Modal.Title>{comp_contract.company_name}</Modal.Title>
                </Modal.Header>
                <Modal.Body><MirrorTable/></Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>


            <Modal show={request} onHide={handleRequestClose} dialogClassName="modal-90w" size="xl" aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header closeButton>
                <Modal.Title>Requests</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Table striped="columns">
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Investor Name</th>
                    <th>No of shares</th>
                    <th>Status</th>
                    <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        pendingRequests.map((value, key) => {
                        return (
                            <tr>
                            <td>{key+1}</td>
                            <td>{value.investor_name}</td>
                            <td>{value.no_of_shares}</td>
                            <td>{value.status=='Processing'?"Buyer":value.status=="Investor_Processing"?"Seller":"Buyer"}</td>
                            <td><Button variant="primary" onClick={()=>{
                                if(value.status=='Processing')handleAcceptRequestOpen(value.transaction_id,value.no_of_shares,"Approved");
                                else if(value.status=='Investor_Processing'){
                                    updateTxnStatus("Investor_Approved",value.transaction_id);
                                }else if(value.status=='Buyer_Processing'){
                                    updateTxnStatus("Buyer_Approved",value.transaction_id);
                                }
                                }}>Approve</Button>
                                <Button variant="danger"  onClick={()=>updateTxnStatus("Rejected",value.transaction_id)}>Reject</Button></td>
                            </tr>
                        )
                        })
                    }
                </tbody>
                </Table>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
            {/* Modal for taking Allowance and requesting USDT from investor */}
            <Modal show={open} onHide={()=>{ModalUSDT(false)}} >
                <Modal.Header closeButton>
                <Modal.Title>No of USDT required from Investor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="seller">
                            <Form.Label>Amount of USDT</Form.Label>
                            <Form.Control type="number" name="usdt" onChange={(e)=>{handleRequestUSDT(e.target.value)}} placeholder="No of USDT" value={usdt}/>
                    </Form.Group>
                        <div className="text-center" >
                    <Button variant="primary" onClick={()=>handleUSDT()}>
                        Request
                        </Button>  
                    <b><p>On Click of Request shares will be given as allowance to the trustee</p></b>
                        </div>
                        
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>



            </>
        );
    }
    