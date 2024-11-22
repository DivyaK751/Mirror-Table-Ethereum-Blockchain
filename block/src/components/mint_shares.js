import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';


export default function Mint(props) {
        const errRef = useRef();

        const [name,setCompanyName] = useState("");
        const [sym,setSym] = useState("");
        const [sharecount,setShareCount] = useState("");
        

        const [errMsg, setErrMsg] = useState('');
        const [success, setSuccess] = useState('');

        useEffect(() => {
          setErrMsg('');
        }, [])

        const REGISTER_URL="http://localhost:5000/web2/company/postIndvCompanyData";

        let PostRegister = async (e) => {
            e.preventDefault();

            try {

              const response = await axios.post(REGISTER_URL,
                JSON.stringify({comp_wallet_addr:props.addr,comp_name:name,comp_symb:sym,comp_shares:sharecount}),
                {
                    headers: { 'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' },
                }
            );
            const res=JSON.stringify(response?.data.msg);
            setSuccess(res);
            console.log(res);
            setCompanyName('');
            setSym('');
            setShareCount('');
            } catch (err) {
              if (!err?.response) {
                setErrMsg('No Server Response');
              } else if (err.response?.status === 409) {
                  setErrMsg('Failed');
              } else {
                  setErrMsg('Failed')
              }
              errRef.current.focus()
              }
          };
        return (
            <form className='company' onSubmit={PostRegister}>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <p ref={errRef} className={success ? "success" : "offscreen"} aria-live="assertive">{success}</p>

                <div className="form-group">
                    <label>Company Name</label>
                    <input type="text" className="form-control" placeholder="Enter Company Name" value={name} onChange={(e)=> setCompanyName(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Company Symbol</label>
                    <input type="text" className="form-control" placeholder="Enter symbol" 
                    value={sym} onChange={(e)=> setSym(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label>Total number of shares</label>
                    <input type="number" className="form-control" placeholder="Enter number of shares" 
                    value={sharecount} onChange={(e)=> setShareCount(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label>Wallet Address</label>
                    <input type="text" className="form-control" value={props.addr} disabled/>
                </div>

                <div className="form-group">
                    <input type="submit" className="form-control" style={{color:"blue"}} value="Submit"/>
                </div>
            </form>
        );
    }
