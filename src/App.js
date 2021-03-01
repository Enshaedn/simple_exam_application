import './App.css';
import { useState, useEffect } from 'react';
import Admin from './Admin';
import Exam from './Exam';

function App() {
  const [sAdmin, setSelectedAdmin] = useState(null);
  const domainCall = 'http://localhost:8500/exam_demo/public/';

  useEffect(() => console.log(sAdmin));
  
  return (
    <div className="App">
      <Admin setSelectedAdmin={ setSelectedAdmin } />
      <Exam sAdmin={ sAdmin } domainCall={ domainCall } />
    </div>
  );
}

export default App;
