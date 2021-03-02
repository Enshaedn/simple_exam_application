import { useState, useEffect } from 'react';

const Exam = ({ sAdmin, rootDomain }) => {
    const [exams, setExams] = useState(null);
    const [adminExamIDs, setAdminExamIDs] = useState(null);
    const [adminExams, setAdminExams] = useState();
    const [isCreating, setCreating] = useState(false);
    const [testName, setTestName] = useState('');
    
    const domainPath = 'examQuery.cfc?method=';

    useEffect(() => {
        fetch(`${rootDomain}${domainPath}examsGet`)
            .then(response => response.json())
            .then(data => setExams(data));
    }, [exams, rootDomain]);

    useEffect(() => {
        if(sAdmin !== null) {
            fetch(`${rootDomain}${domainPath}adminExams&id=${sAdmin.adminID}`)
                .then(response => response.json())
                .then(data => setAdminExamIDs(data));
        }
    }, [sAdmin, rootDomain]);

    useEffect(() => {
        let a = adminExamIDs ? adminExamIDs.map(id => {
            let b = exams.filter(x => x.testID === id.testID); 
            return b[0];
        }) : null;
        setAdminExams(a)
    }, [adminExamIDs, exams]);

    const deleteExam = (id) => {
        console.log('Deleting exam: ' + id);
        fetch(`${rootDomain}${domainPath}examDelete&id=${id}`)
            .then(res => console.log(res));
    };

    const deleteLinks = (id) => {
        console.log('Deleting links');

    }

    const handleClick = (e) => {
        let opt = e.target.id;
        let id = e.target.value;
        
        if(opt === 'addExamToAdmin' && sAdmin && ableToAdd(id)) {
            console.log(`Add Admin(${sAdmin.adminID}) to exam(${id})`);
            linkAdminToExam(id);
        } else if(opt === 'deleteExam') {
            deleteExam(id);
        } else if(opt === 'editExam') {
            console.log('Edit this exam!');
        } else if(opt === 'cancel') {
            setCreating(false);
        } else if(opt === 'createExam') {
            console.log("You're trying to create a new exam!");
            setCreating(true);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Creating exam: ${testName}`);
        fetch(`${rootDomain}${domainPath}examPost&testName=${testName}`)
            .then(response => response.json())
            .then(id => linkAdminToExam(id));

        setTestName('');
        setCreating(false);
    };

    const handleChange = (e) => {
        let opt = e.target.id;
        let value = e.target.value;

        if(opt === "testName") {
            setTestName(value);
        }        
    };

    const linkAdminToExam = (id) => {
        console.log("generated key : " + id);
        fetch(`${rootDomain}${domainPath}linkAdminToExam&adminID=${sAdmin.adminID}&testID=${id}`)
            .then(response => console.log(response));
    };

    const ableToAdd = (id) => {
        return !adminExams.filter(x => x.testID === parseInt(id)).length > 0;
    };

    return (
        <div className="examPanel">
            {sAdmin ? <div>
                {isCreating ? 
                    <div>
                        <form onSubmit={ handleSubmit }>
                            <div>
                                <div>
                                    <label htmlFor="testName">Title: </label>
                                    <input onChange={ handleChange } value={ testName } id="testName" />
                                </div>
                            </div>
                            <button className="button-gap">Submit</button>
                            <button onClick={ handleClick } id="cancel">Cancel</button>
                        </form>
                    </div> : <button onClick={ handleClick } id="createExam">Create Exam</button>}
            </div> : "Please select an admin"}
            <div>
                {adminExamIDs ? <div>
                    <h3>{sAdmin.username}'s exams</h3>
                    { adminExams ? adminExams.map(exam => {
                        return <div key={exam.testID}>
                            <span>{exam.testName}</span>
                            <button className="button-gap" id="editExam" onClick={ handleClick }>Edit</button>
                            <button onClick={ handleClick} id="deleteExam" value={ exam.testID }>Delete</button>
                        </div>
                    }) : null}
                    </div> : null}
            </div>
            <div>
                <h3>All Exams</h3>
                {exams ? exams.map(exam => {
                    return <div key={ exam.testID }>
                        <span>{exam.testName}</span>
                        <button className="button-gap" id="addExamToAdmin" value={ exam.testID } onClick={ handleClick }>Add Exam</button>
                    </div>
                }) : "No Exams Available" }
            </div>
        </div>
    );
};

export default Exam;