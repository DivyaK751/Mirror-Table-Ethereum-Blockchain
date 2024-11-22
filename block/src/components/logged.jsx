import Card from "react-bootstrap/Card";
import Home from "./home";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
function Logged() {
  const handleProfile= async(e) =>{
  }; 
  useEffect(() => {
    });
  
  const [showProfile, setProfile] = useState(false);
    const handleClose_Profile = () => setProfile(false);
    const handleShow_Profile = () => setProfile(true);
  
  return(
    <>
      <Button onClick={handleShow_Profile}>press here </Button>
    <Modal show={showProfile} onHide={handleClose_Profile}>
          <Modal.Header closeButton>
              <Modal.Title>Escrow To Buyer</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form onSubmit={handleProfile}>
                <Form.Group className="mb-3" controlId="buyer">
                    <Form.Label>Buyer address</Form.Label>
                    <Form.Control type="text" name="buyer" placeholder="Seller Address" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="assetid">
                    <Form.Label>AssetID</Form.Label>
                    <Form.Control type="text" name="assetid" placeholder="Enter AssetID" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
          </Modal.Body>
      </Modal>
    </>
  );
}
export default Logged;
