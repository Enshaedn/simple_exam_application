import { useState, useEffect } from 'react';

const Exam = ({ sAdmin }) => {
    const [exams, setExams] = useState(null);
    if(sAdmin !== null) console.log("selected", sAdmin.adminID);

    useEffect(() => {
        fetch('http://localhost:8500/exam_demo/public/examQuery.cfc?method=examsGet')
        .then(response => response.json())
        .then(data => setExams(data));
    }, [exams]);




    return (
        <div>
            <button>Create Exam</button>
            <div>
                {sAdmin ? <span>{sAdmin.username}'s exams</span> : null}
            </div>
            <div>
                All Exams
            </div>
        </div>
    );
};

export default Exam;