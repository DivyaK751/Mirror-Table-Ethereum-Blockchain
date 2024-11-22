import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import companyABI from "./ABIs/companyABI.json";
import Table from 'react-bootstrap/Table';

export default function Investor_mirrortable() {
    // ethereum window state variables
    const [currentAccount, setCurrentAccount] = useState("");
    const [userAddress, setUserAddress] = useState("");

    // all company wallet addresses - to be retrieved from db
    const [company_contract_addresses,setcompany_addresses]=useState(["0x39CB6d6b841514eae59011220cd57951DFC2898e"]);
    
    // balances and timestamps state variables
    const [balances,setBalances]=useState([]);
    const [timestamps,setTimeStamps]=useState([]);

    const getInvestorMirrorTable =async (account,start,end) =>{

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const erc20 = new ethers.Contract(company_contract_addresses[0],companyABI, provider);
        const investor_details = await erc20.getInvestordetails(account);

        console.log(investor_details);
        let retrieved_timestamps=investor_details[0];
        let retrived_balances=investor_details[1];
        
        // 7 day balances
        let final_timestamps=[];
        let final_balances=[];

        for(let i=0;i<retrieved_timestamps.length;i++)
        {
            var curr_date=new Date(parseInt(retrieved_timestamps[i]._hex,16)*1000);
            if(curr_date>=start && curr_date<=end){
                final_timestamps.push(new Date(parseInt(retrieved_timestamps[i]._hex,16)*1000).toLocaleString([],{hour12:false}));
                final_balances.push(parseInt(retrived_balances[i]._hex,16));
            }
        }

        setBalances(final_balances);
        setTimeStamps(final_timestamps);
    }
    
    const detailsOn = async () =>{
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        
        const addr = await signer.getAddress();
        setUserAddress(addr.toString());
    }

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
            detailsOn();
            // do actions
            var date = new Date(Date.now());
            date.setDate(date.getDate() - 7);
            getInvestorMirrorTable(account,date,new Date(Date.now()));
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

    //to retrieve Mirrortable from companyABI.json
    
      }, []);

      return(
        <>
            <Table striped="columns">
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Wallet Address</th>
                    {
                        timestamps.map((value) => {
                        return (
                            <th>{value}</th>
                            )
                        })
                    }
                    </tr>
                </thead>
                <tbody>
                <tr>
                <td>{1}</td>
                <td>{company_contract_addresses[0]}</td>
                    {balances.map((items, index) => {
                        return (
                            
                            <td>{items}</td>
                                
                        );
                    })}
                </tr>
                </tbody>
                </Table>
        </>
      );
};