import { useState, useEffect } from 'react';

const Exam = ({ sAdmin }) => {
    const [exams, setExams] = useState(null);
    const [adminExamIDs, setAdminExamIDs] = useState(null);
    const [adminExams, setAdminExams] = useState();

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

    return (
        <div>
            {sAdmin ? <button>Create Exam</button> : "Please select an admin"}
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
                }) : "No Exams" }
            </div>
        </div>
    );
};

export default Exam;