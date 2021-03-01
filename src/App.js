import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [admins, setAdmin] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8500/exam_demo/public/adminQuery.cfc?method=adminGet')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setAdmin(data);
      });
  }, [])
  return (
    <div className="App">
      {admins ? admins.map(a => {
        return <p>{`${a.adminID}: ${a.firstName} ${a.lastName}`}</p>
      }) : "No Admins"}
    </div>
  );
}

export default App;
