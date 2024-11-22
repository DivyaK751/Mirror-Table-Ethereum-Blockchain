import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import Wallet from './wallet';
import LoginButton from "./loginbutton";

function Home() {
    const {
        account,
      } = useWeb3React();
  const [role, setRole] = useState("Investor");

  const [showProfile, setProfile] = useState(true);
    const handleClose_Profile = () => setProfile(false);
  return (
        <Modal show={showProfile} onHide={()=>{handleClose_Profile();}}>
          <Modal.Header closeButton>
              <Modal.Title>Complete your profile</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form >
                <Form.Group className="mb-3" controlId="role">
                    <Form.Label>Role</Form.Label>
                    <Form.Select onChange={(e)=>{setRole(e.target.value)}}>
                      <option value="Investor">Investor</option>
                      <option value="Lead Investor">Lead Investor</option>
                      <option value="Trustee">Trustee</option>
                      <option value="Company">Company</option>
                    </Form.Select>
                </Form.Group>
                <br />
                <Wallet/>
                <br/>
                <div className="text-center" >
                <LoginButton wallet_addr={account} role={role} />
                </div>
            </Form>
          </Modal.Body>
      </Modal>
    )
}
export default Home;