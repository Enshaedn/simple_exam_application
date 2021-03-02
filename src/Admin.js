
import { useState, useEffect } from 'react';

const Admin = ({ setSelectedAdmin }) => {
    //Store all admin data from DB
    const [admins, setAdmin] = useState(null);
    //selected ID
    const [sID, setSelectedID] = useState();
    //bool for displaying add Admin options
    const [isAdding, setAdding] = useState(false);
    //variables for adding an admin
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    //get request to CF to get all admin data, only refresh on changes to admins
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
            let a = admins.filter(i => i.adminID === parseInt(id))
            setSelectedAdmin(a[0]);
            setSelectedID(id);
        } else if(opt === 'deleteAdmin') {
            deleteAdmin(id);
            //deselect admin if it is deleted
            if(sID === id) {
                setSelectedAdmin(null);
                setSelectedID(null);
            }
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

    //request to CF to delete an admin from the DB based on adminID
    const deleteAdmin = (id) => {
        console.log("You've chosen to delete admin : " + id);
        fetch(`http://localhost:8500/exam_demo/public/adminQuery.cfc?method=adminDelete&id=${id}`)
            .then(res => console.log(res));
    }

    //request to CF to add a new admin to DB
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8500/exam_demo/public/adminQuery.cfc?method=adminPost&username=${username}&firstName=${firstName}&lastName=${lastName}`)
            .then(res => console.log(res));

        //reset form fields and hide form
        setUsername('');
        setFirstName('');
        setLastName('');
        setAdding(false);
    }

    return (
        <div>
            {admins ? admins.map(a => {
                return <div key={a.adminID} className="container col s12">
                    <span>{`${a.username}: ${a.firstName} ${a.lastName} `}</span>
                    <button className="btn-small button-gap" disabled={a.adminID === parseInt(sID)} id="selectAdmin" value={a.adminID} onClick={ handleClick }>Select</button>
                    <button className="btn-small" id="deleteAdmin" value={a.adminID} onClick={ handleClick }>
                        <i className="material-icons">delete_forever</i>
                    </button>
                </div>
            }) : "No Admins"}
            <div className="container">
                {
                    isAdding ? <form onSubmit={ handleSubmit }>
                        <div className="row">
                            <div className="input-field">
                                <input onChange={ handleChange } value={username} id="username" type="text"/>
                                <label htmlFor="username">Username: </label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field">
                                <input onChange={ handleChange } value={firstName} id="firstName" type="text"/>
                                <label htmlFor="firstName">First Name: </label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field">
                                <input onChange={ handleChange } value={lastName} id="lastName" type="text"/>
                                <label htmlFor="lastName">Last Name: </label>
                            </div>
                        </div>
                        <button className="btn-small">Submit</button>
                    </form>
                        : <button className="btn-small" id="newAdmin" onClick={ handleClick }>+ Admin</button>
                }
            </div>
        </div>
    );
};

export default Admin;