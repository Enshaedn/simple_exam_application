import { useState, useEffect } from 'react';

const Exam = ({ sAdmin, domainCall }) => {
    const [exams, setExams] = useState(null);
    const [adminExamIDs, setAdminExamIDs] = useState(null);
    const [adminExams, setAdminExams] = useState();
    const [isCreating, setCreating] = useState(false);
    const [testName, setTestName] = useState('');

    useEffect(() => {
        fetch('http://localhost:8500/exam_demo/public/examQuery.cfc?method=examsGet')
            .then(response => response.json())
            .then(data => setExams(data));
    }, [exams]);

    useEffect(() => {
        if(sAdmin !== null) {
            fetch(`http://localhost:8500/exam_demo/public/examQuery.cfc?method=adminExams&id=${sAdmin.adminID}`)
                .then(response => response.json())
                .then(data => setAdminExamIDs(data));
        }
    }, [sAdmin]);

    useEffect(() => {
        let a = adminExamIDs ? adminExamIDs.map(id => {
            let b = exams.filter(x => x.testID === id.testID); 
            return b[0];
        }) : null;
        setAdminExams(a)
    }, [adminExamIDs, exams])

    const handleClick = (e) => {
        console.log("You're trying to create a new exam!");
        setCreating(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Creating exam: ${testName}`);
        fetch(`${domainCall}examQuery.cfc?method=examPost&testName=${testName}`)
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
        fetch(`${domainCall}examQuery.cfc?method=linkAdminToExam&adminID=${sAdmin.adminID}&testID=${id}`)
            .then(response => console.log(response));
    };

    return (
        <div>
            {sAdmin ? <div>
                {isCreating ? 
                    <div>
                        <form onSubmit={ handleSubmit }>
                            <label htmlFor="testName">Title: </label>
                            <input onChange={ handleChange } value={ testName } id="testName" /><br />
                            <button>Submit</button>
                        </form>
                    </div> : <button onClick={ handleClick }>Create Exam</button>}
            </div> : "Please select an admin"}
            <div>
                {adminExamIDs ? <div>
                    <h3>{sAdmin.username}'s exams</h3>
                    { adminExams ? adminExams.map(exam => {
                        return <p key={exam.testID}>{exam.testName}</p>
                    }) : null}
                    </div> : null}
            </div>
            <div>
                <h3>All Exams</h3>
                {exams ? exams.map(exam => {
                    return <div key={ exam.testID }>
                        <span>{exam.testName}</span>
                    </div>
                }) : "No Exams Available" }
            </div>
        </div>
    );
};

export default Exam;