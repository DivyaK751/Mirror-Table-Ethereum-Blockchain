import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import React, { useState,useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Wallet from "./wallet";
import axios from '../api/axios';
import MirrorTable from './mirrortable';
export default function Trustee() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [request, setRequest] = useState(false);

    const [open, ModalUSDT] = useState(false);
    const [transact, Transaction_ID] = useState(0);

    const [holdings, setHolding] = useState(false);
    const handleHoldingClose = () => setHolding(false);
    const handleHoldingShow = () => setHolding(true);


    const [investorinfo, setInvestor] = useState([]);
    const [company_name, setCompany_name] = useState("");
    const handleCloseRequest = () => setRequest(false);
    const handleShowRequest = (c_id) => {
        async function fetchData(){
            let response = await axios.get("http://localhost:5000/web2/trustee/getIndvRequest?c_id="+c_id,
                {
                    headers: { 'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' },
                }
            )
            setInvestor(response.data.result);


        }
        fetchData();
        setRequest(true);
    }

    async function forwardReq(txn_id,flag)
    {
        // flag =0 new investor from company
        // flag =1 existing investor selling
        handleCloseRequest();
        let response = await axios.get("http://localhost:5000/web2/trustee/sendConfirmation?transaction_id="+txn_id+"&flag="+flag,
                {
                    headers: { 'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' },
                }
            )
            console.log(response);
           
    }

    async function handleForwardUSDT(txn_id)
    {
        console.log(txn_id);
        let response = await axios.get("http://localhost:5000/web2/trustee/requestAllowance?transaction_id="+txn_id,
                {
                    headers: { 'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' },
                }
            )
            console.log(response);
    }
    async function handleSwap(transaction_id,flag){
        // 0 - normal cycle , 1- investor cycle
        let response = await axios.get("http://localhost:5000/web3/trustee/swap?transaction_id="+transaction_id+"&flag="+flag,
                {
                    headers: { 'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' },
                }
            )
        console.log(response);
    }
    const [wall, setWall] = useState(false);

    const handleWallClose = () => setWall(false);
    const handleWallShow = () => setWall(true);

    const [usdt, setUSDT] = useState(0);
    const handleRequestUSDT = (usd) => setUSDT(usd);
    const handleUSDTClose = () => setUSDT(0);

    const [companies, setCompanies] = useState([]);

    useEffect(() =>{
        
            async function fetchData(){
                let response = await axios.get("http://localhost:5000/web2/company/getAllCompaniesData",
                    {
                        headers: { 'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*' },
                    }
                )
                setCompanies(response.data.data);
            }
            fetchData();
      }, []);
    
        return (
            <>
            <Navbar bg="dark" variant="dark">
                <Container>
                <Navbar.Brand href="#home">
                    SDFC Securities AIF Page
                </Navbar.Brand>
                <Button variant="primary" onClick={handleShow}>Balance</Button>
                <Button variant="primary" onClick={handleWallShow}>Wallet</Button>
                </Container>
            </Navbar>
            <Modal show={wall} onHide={handleWallClose}>
            <Modal.Header closeButton>
                <Modal.Title>Wallet Connect</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Wallet/>
                {/* <div>Wallet connect to be changed here</div> */}
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
                    <th></th>
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
                            <td><Button variant="primary" style={{marginRight:"20px"}} onClick={()=>handleShowRequest(value.company_id)}>Manage</Button>
                            <Button variant="primary" onClick={()=>{handleHoldingShow();setCompany_name(value.company_name)}}>Current Holdings</Button></td>
                            </tr>
                        )
                        })
                    }
                </tbody>
                </Table>
            </Row>
            </Container>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Balance</Modal.Title>
                </Modal.Header>
                <Modal.Body>Display Balance</Modal.Body>
                <Modal.Footer>
                {/* <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button> */}
                <Button variant="primary" onClick={handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>

                {/* 1ST Modal Request - Approved / Reject  */}
            <Modal show={request} dialogClassName="modal-90w" onHide={() => handleCloseRequest()} size="xl" aria-labelledby="example-custom-modal-styling-title">
            <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
                    Request Log
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Table striped bordered hover size="sm">
            <thead>
                <tr>
                <th>#</th>
                <th>Investor Name</th>
                <th>No of shares</th>
                <th>Status</th>
                <th>Status Modified Date</th>
                <th>Action</th>
                </tr>
            </thead>
            <tbody>
                    {
                        investorinfo.map((value, key) => {
                        return (
                            <tr>
                            <td>{key+1}</td>
                            <td>{value.investor_name}</td>
                            <td>{value.no_of_shares}</td>
                            <td>{value.status}</td>
                            <td>{value.updated_at}</td>
                            {(value.status === "Initiated")?
                            <td><Button variant="primary" onClick={()=>forwardReq(value.transaction_id,0)}>Forward</Button></td>: 
                            (value.status === "Approved")?
                            <td><Button variant="success" onClick={()=>{
                                // Transaction_ID(value.transaction_id);
                                handleForwardUSDT(value.transaction_id);
                            }}>RequestUSDT</Button></td>:
                            (value.status === "Rejected")?
                            <td><Button variant="danger">Rejected</Button></td>:
                            (value.status === "Swapping")?
                            <td><Button variant="success" onClick={()=>{
                                handleSwap(value.transaction_id,0);
                            }}>Swap</Button></td>:
                            (value.status === "Investor_Swapping")?
                            <td><Button variant="success" onClick={()=>{
                                handleSwap(value.transaction_id,1);
                            }}>Swap</Button></td>:
                            (value.status === "Swap Successful")?
                            <td><Button variant="success">Completed</Button></td>:
                            (value.status === "Investor_Initiated")?
                            <td><Button variant="primary" onClick={()=>forwardReq(value.transaction_id,1)}>Forward</Button></td>:
                            (value.status==="Buyer_Initiated")?<td><Button variant="primary" onClick={()=>forwardReq(value.transaction_id,2)}>Forward</Button></td>
                            :<td><Button variant="warning">Processing</Button></td>}
                            </tr>
                        )
                        })
                    }
                </tbody>
            </Table>
            </Modal.Body>
        </Modal>

        {/* MirrorTable view */}
            <Modal show={holdings} onHide={()=>{window.location.replace("/trustee")}}>
                <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                        {company_name}
                </Modal.Title>
                </Modal.Header>
                <Modal.Body><MirrorTable/></Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
            </>
        );
    }
