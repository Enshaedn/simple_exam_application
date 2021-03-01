
import { useState, useEffect } from 'react';

const Admin = () => {
    const [admins, setAdmin] = useState(null);
    const [sAdmin, setSelectedAdmin] = useState(null);
    const [isAdding, setAdding] = useState(false);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    useEffect(() => {
        fetch('http://localhost:8500/exam_demo/public/adminQuery.cfc?method=adminGet')
        .then(response => response.json())
        .then(data => setAdmin(data));
    }, [admins]);

    const handleClick = (e) => {
        let opt = e.target.id;
        let id = e.target.value;

        if(opt === 'selectAdmin') {
            console.log("You've selected admin : " + id);
            setSelectedAdmin(admins.filter(i => i.adminID === parseInt(id)));
        } else if(opt === 'deleteAdmin') {
            deleteAdmin(id)
        } else {
            setAdding(true);
        }
    }

    const handleChange = (e) => {
        let opt = e.target.id;
        let value = e.target.value;

        if(opt === 'username') {
            setUsername(value);
        } else if(opt === 'firstName') {
            setFirstName(value);
        } else if(opt === 'lastName') {
            setLastName(value);
        }
    }

    const deleteAdmin = (id) => {
        console.log("You've chosen to delete admin : " + id);
        fetch(`http://localhost:8500/exam_demo/public/adminQuery.cfc?method=adminDelete&id=${id}`)
            .then(res => console.log(res));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8500/exam_demo/public/adminQuery.cfc?method=adminPost&username=${username}&firstName=${firstName}&lastName=${lastName}`)
            .then(res => console.log(res));

        setUsername('');
        setFirstName('');
        setLastName('');
        setAdding(false);
    }

    return (
        <div>
            {admins ? admins.map(a => {
                return <div key={a.adminID}>
                    <span>{`${a.username}: ${a.firstName} ${a.lastName} `}</span>
                    <button id="selectAdmin" value={a.adminID} onClick={ handleClick }>Select</button>
                    <button id="deleteAdmin" value={a.adminID} onClick={ handleClick }>Delete</button>
                </div>
            }) : "No Admins"}
            <div>
                {
                    isAdding ? <form onSubmit={ handleSubmit }>
                        <label htmlFor="username">Username: </label>
                        <input onChange={ handleChange } value={username} id="username"/><br />
                        <label htmlFor="firstName">First Name: </label>
                        <input onChange={ handleChange } value={firstName} id="firstName"/><br />
                        <label htmlFor="lastName">Last Name: </label>
                        <input onChange={ handleChange } value={lastName} id="lastName"/><br />
                        <button>Submit</button>
                    </form>
                        : <button id="newAdmin" onClick={ handleClick }>+ Admin</button>
                }
            </div>
        </div>
    );
};

export default Admin;