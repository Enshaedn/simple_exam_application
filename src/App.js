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
      <Admin setSelectedAdmin={ setSelectedAdmin } rootDomain={ rootDomain } />
      <Exam sAdmin={ sAdmin } rootDomain={ rootDomain } />
    </div>
  );
}

export default App;
