import './App.css';
import { useState, useEffect } from 'react';
import Admin from './Admin';
import Exam from './Exam';
import Header from './Header';

function App() {
  const [sAdmin, setSelectedAdmin] = useState(null);
  const rootDomain = 'http://localhost:8500/exam_demo/public/';

  useEffect(() => console.log(sAdmin));
  
  return (
    <div className="App">
      <Header />
      <div className="page">
        <Exam sAdmin={ sAdmin } rootDomain={ rootDomain } />
        <Admin setSelectedAdmin={ setSelectedAdmin } rootDomain={ rootDomain } />
      </div>
    </div>
  );
}

export default App;
