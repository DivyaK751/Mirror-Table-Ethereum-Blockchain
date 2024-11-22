import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import './components/login.css';
import Company from './components/company_index';
import Home from './components/home';
import Investor from './components/investor';
import Trustee from './components/trustee_home';
import Investor_mirrortable from './components/investor_mirrortable';
import MirrorTable from './components/mirrortable';

function App() {
  return (
    <BrowserRouter>
    <div>
      <Routes>
        <Route exact path="/" element={<Home />} /> 
      </Routes>
      <Routes>
        <Route exact path="/company" element={<Company />} /> 
      </Routes>
      <Routes>
        <Route exact path="/investor" element={<Investor />} /> 
      </Routes>
      <Routes>
        <Route exact path="/investor/mirrortable" element={<Investor_mirrortable/>} /> 
      </Routes>
      <Routes>
        <Route exact path="/mirrortable" element={<MirrorTable/>} /> 
      </Routes>
      <Routes>
        <Route exact path="/trustee" element={<Trustee />} /> 
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
