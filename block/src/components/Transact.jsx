import { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import LoginButton from "./loginbutton";


const clientId = "1074180487968-jg0sbt8361t36bsf0ladqi4hd7tti3mv.apps.googleusercontent.com";
function Transact() {
  const [showLogin, setLogin] = useState(false);
  const handle_Login = () => setLogin(false);
  const handleShow_Login = () => setLogin(true);
  useEffect(() => {
    async function fetch(){
    }
    fetch();
  }, );

  const handleClickLogin = event => {
   
  }
  //ends web3 wallet functions
  
  
  
  return (
    <div>
    <Navbar collapseOnSelect expand="lg" bg="transparent" variant="dark">
        <Container>
            <Navbar.Brand href="#home" className="text-warning" style={{fontWeight:'bold'}}>MIRRORTABLE</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                <Nav.Link  className="text-warning" onClick={handleShow_Login} >Login</Nav.Link>
                </Nav>
                <Nav>
                    
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
           
      
      <Modal show={showLogin} onHide={handle_Login}>
        <Modal.Header closeButton>
            <Modal.Title>Login</Modal.Title>
        </Modal.Header>

        <Modal.Body>
      
          <Form onSubmit={handleClickLogin}>
                <br/>
                <div className="text-center">
                <LoginButton />
                </div>
                <br/>
          </Form>
        </Modal.Body>
      </Modal>
      </div>
  );
}

export default Transact;
