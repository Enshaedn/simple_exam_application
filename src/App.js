import './App.css';
import { useState, useEffect } from 'react';
import Admin from './Admin';
import Exam from './Exam';

function App() {
  const [sAdmin, setSelectedAdmin] = useState(null);

  useEffect(() => console.log(sAdmin));
  
  return (
    <div className="App">
      <Admin setSelectedAdmin={ setSelectedAdmin } />
      <Exam />
    </div>
  );
}

export default App;
