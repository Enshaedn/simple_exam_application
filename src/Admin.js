
import { useState, useEffect } from 'react';

const Admin = ({ setSelectedAdmin, rootDomain }) => {
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

    const domainPath = 'adminQuery.cfc?method=';

    //get request to CF to get all admin data on load
    useEffect(() => {
        console.log("Admin useEffect");
        getAdmins();
    }, []);

    const getAdmins = () => {
        fetch(`${rootDomain}${domainPath}adminGet`)
            .then(response => response.json())
            .then(data => setAdmin(data));
    };

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
        } else if(opt === 'cancel') {
            setAdding(false);
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
        fetch(`${rootDomain}${domainPath}adminDelete&id=${id}`)
            .then(res => getAdmins());
    }

    //request to CF to add a new admin to DB
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${rootDomain}${domainPath}adminPost&username=${username}&firstName=${firstName}&lastName=${lastName}`)
            .then(res => getAdmins());

        //reset form fields and hide form
        setUsername('');
        setFirstName('');
        setLastName('');
        setAdding(false);
    }

    return (
        <div className="adminPanel">
            <ul>
                {admins.length ? admins.map(a => {
                    return <li className="listGroup" key={a.adminID}>
                        <div className="listContent">
                            <span>{`${a.username}: ${a.firstName} ${a.lastName} `}</span>  
                        </div>
                        <div className="buttonGroup">
                            <button className="button-gap" disabled={a.adminID === parseInt(sID)} id="selectAdmin" value={a.adminID} onClick={ handleClick }>Select</button>
                            <button id="deleteAdmin" value={a.adminID} onClick={ handleClick }>Delete</button>
                        </div>
                    </li>
                }) : "No Admins"}
            </ul>
            
            <div className="adminForm">
                {
                    isAdding ? <form onSubmit={ handleSubmit }>
                        <div>
                            <label htmlFor="username">Username: </label>
                            <input onChange={ handleChange } value={username} id="username" type="text"/>
                        </div>
                        <div>
                            <label htmlFor="firstName">First Name: </label>
                            <input onChange={ handleChange } value={firstName} id="firstName" type="text"/>
                        </div>
                        <div>
                            <label htmlFor="lastName">Last Name: </label>
                            <input onChange={ handleChange } value={lastName} id="lastName" type="text"/>
                        </div>
                        <button className="button-gap" type="submit">Submit</button>
                        <button onClick={ handleClick } id="cancel" type="button">Cancel</button>
                    </form>
                        : <button id="newAdmin" onClick={ handleClick }>+ Admin</button>
                }
            </div>
        </div>
    );
};

export default Admin;