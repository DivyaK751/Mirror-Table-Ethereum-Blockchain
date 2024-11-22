import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import erc20abi from "./ERC20abi.json";
import Mint from './mint_shares';
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import Wallet from "./wallet";
import companyABI from "./ABIs/companyABI.json";
import Form from 'react-bootstrap/Form';
import { ethers } from "ethers";
import { Stack } from '@chakra-ui/react';

export default function MirrorTable() {

    const [currentAccount, setCurrentAccount] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const detailsOn = async () =>{
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        
        const addr = await signer.getAddress();
        setUserAddress(addr.toString());
    }

    const [mirrorInfo, setMirrorInfo] = useState([]);
    const [total_shares, setTotal_Shares]=useState(0);

    const getTimeStamps = async() =>{
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const erc20 = new ethers.Contract('0x39CB6d6b841514eae59011220cd57951DFC2898e',companyABI, provider);
        let TimeStamps = await erc20.getTimeStamps();
        TimeStamps = TimeStamps[TimeStamps.length-1];
        const getTransaction = await erc20.getdetails(TimeStamps._hex);
        // console.log(getTransaction);
        let investor_addr = getTransaction[0];
        let investor_balances = getTransaction[1];
        let total_shares = 0;
        for(var i=0;i<investor_balances.length;i++)
        {
            total_shares+=parseInt(investor_balances[i]._hex,16);
        }
        setTotal_Shares(total_shares);
        const response = await axios.get('http://localhost:5000/web2/investor/getAllInvestorsData')
        var walletToInvName ={} 

        const allInvestors = response.data.data

        for(let i=0;i<allInvestors.length;i++){
           walletToInvName[allInvestors[i].wallet_addr] = allInvestors[i].investor_name
        }


        let tuples = [];
        for(var i=0;i<investor_balances.length;i++)
        {
            let arr = [];
            var percent = parseInt(investor_balances[i]._hex,16)/(total_shares*1.0)*100;
            percent = percent.toFixed(2)+" %";
            arr.push(walletToInvName[investor_addr[i]],parseInt(investor_balances[i]._hex,16),percent);
            tuples.push(arr);
        }
        setMirrorInfo(tuples);
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
            detailsOn();
          } else{
            console.log("Could not find an authorized account");
          }
        } catch(error){
          console.log(error);
        }
      }



      useEffect(async() =>{
        await checkIfWalletIsConnected();
        window.ethereum.on('accountsChanged', function (accounts) {
            console.log("New account", accounts[0]);
            setCurrentAccount(accounts[0]);
            
          })
          getTimeStamps();
      }, []);

      return (
        <>
        <Container style={{marginTop: "5%"}}>
            <Row>
                <b> Total Shares : {total_shares}</b>
            </Row>
            <Row>
                <Table striped="columns">
                <thead>
                    <tr>
                    <th>#</th>
                    <th>ShareHolder Name</th>
                    <th>No of Shares</th>
                    <th>% Of Holding</th>
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
                    <tr> 
                        <td colSpan={2}> <b>Total :</b></td>
                        <td>{total_shares}</td>
                        <td>100 %</td>
                    </tr>
                </tbody>
                </Table>
            </Row>
            </Container>
            </>
            )

}