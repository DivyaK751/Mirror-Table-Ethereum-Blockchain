import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import NavBar from './navbar';

function view() {
  return (
    <Card className="bg-dark text-white" >
    <Card.Img src="pic1.jpg" style={{height:"100vh"}} alt="Card image" />
    <Card.ImgOverlay>
        <NavBar/> 
        <div class="row">
        <div className="col-12 p-2 m-5 mx-auto d-inline">
        <Card style={{ width:'85%' , marginLeft: 'auto' ,marginRight: 'auto' }}>
        <Table striped style={{margin:'20px', fontSize:'1rem',  }}>
        <thead>
            <tr>
            <th>#</th>
            <th>Token Name</th>
            <th>Number of Shares</th>
            <th>Percentage of shares</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td>1</td>
            <td>Shar</td>
            <td>40</td>
            <td>10</td>
            </tr>
            <tr>
            <td>2</td>
            <td>BCT</td>
            <td>5</td>
            <td>10</td>
            </tr>
            <tr>
            <td>3</td>
            <td>XXC</td>
            <td>10</td>
            <td>2</td>
            </tr>
        </tbody>
        </Table>
        </Card> 
        </div>    
        </div>
    </Card.ImgOverlay>
</Card>

       
  );
}

export default view;