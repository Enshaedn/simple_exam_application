import { useState, useEffect } from 'react';
import AddQuestion from './AddQuestion';
import Question from './Question';

const Exam = ({ sAdmin, rootDomain }) => {
    const [exams, setExams] = useState(null);
    const [adminExamIDs, setAdminExamIDs] = useState(null);
    const [adminExams, setAdminExams] = useState();
    const [isCreating, setCreating] = useState(false);
    const [testName, setTestName] = useState('');
    const [questions, setQuestions] = useState([]);
    const [creatingQuestion, setCreatingQuestion] = useState(false);
    const [viewExam, setViewExam] = useState(-1);
    
    //path variables for exams and questions
    const domainPath = 'examQuery.cfc?method=';
    const questionPath = 'questionsQuery.cfc?method=';

    //get all current exams in DB on load
    useEffect(() => {
        console.log("#1 running");
        getExams();
    }, []);

    //get the exams associated with the selected admin on admin selected change
    useEffect(() => {
        console.log("#2 running");
        getAdminExams(sAdmin);
    }, [sAdmin]);

    //Take the exams an admin is paired with and get the exam objects from the exams list
    //by filtering the exams based on testID. AdminExams used to display the list of exams 
    //of which an admin is currently associated
    useEffect(() => {
        console.log("#3 running");
        let a = adminExamIDs ? adminExamIDs.map(id => {
            let b = exams.filter(x => x.testID === id.testID); 
            return b[0];
        }) : null;
        setAdminExams(a)
    }, [adminExamIDs, exams]);

    //not currently used, watching questions array
    useEffect(() => {
        console.log(questions);
    }, [questions]);

    const handleClick = (e) => {
        let opt = e.target.id;
        let id = e.target.value;
        
        if(opt === 'addExamToAdmin' && sAdmin && ableToAdd(id)) {
            console.log(`Add Admin(${sAdmin.adminID}) to exam(${id})`);
            linkAdminToExam(id);
        } else if(opt === 'deleteExam') {
            examAdmins(id);
        } else if(opt === 'hideExam') {
            setViewExam(-1);
        } else if(opt === 'viewExam') {
            console.log('View this exam!', id);
            getExamQuestions(id);
            setViewExam(parseInt(id));
        } else if(opt === 'cancel') {
            //cancel exam creation, reset flags and questions array
            setCreating(false);
            setCreatingQuestion(false);
            setQuestions([]);
        } else if(opt === 'createExam') {
            console.log("You're trying to create a new exam!");
            setCreating(true);
        } else if(opt === 'addQuestion') {
            console.log("You're trying to add a question!");
            setCreatingQuestion(true);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Creating exam: ${testName}`);
        fetch(`${rootDomain}${domainPath}examPost&testName=${testName}`)
            .then(response => response.json())
            .then(id => {
                //after exam creation, link admin who created it to the exam
                linkAdminToExam(id);
                //add the questions to the new exam
                addQuestionsToExam(id);
            })
            //refresh exams on screen
            .then(() => getExams());

        //reset questions array and test name field
        setQuestions([]);
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

    //get all exams in DB
    const getExams = () => {
        fetch(`${rootDomain}${domainPath}examsGet`)
            .then(response => response.json())
            .then(data => setExams(data));
    }

    //get all exams selected admin is paired with from testAdmins linking table
    const getAdminExams = (sAdmin) => {
        if(sAdmin !== null) {
            fetch(`${rootDomain}${domainPath}adminExams&id=${sAdmin.adminID}`)
                .then(response => response.json())
                .then(data => setAdminExamIDs(data));
        }
    }

    //reverse of getAdminExams, gets all admins associated with a specific exam
    const examAdmins = (id) => {
        console.log('Getting exam admins');
        fetch(`${rootDomain}${domainPath}examAdmins&id=${id}`)
            .then(response => response.json())
            .then(data => removeExamAdmins(data))
            .then(() => getAdminExams(sAdmin))
            .then(() => deleteExam(id))
            .then(() => getExams());

            //remove entries in testAdmins table with the response data
            //refresh the selected admin's exams
            //delete exam from tests table
            //refresh exams
    };

    //delete exam from tests table
    const deleteExam = (id) => {
        console.log('Deleting exam: ' + id);
        fetch(`${rootDomain}${domainPath}examDelete&id=${id}`)
            .then(response => console.log(response));
    };

    //remove each pair of admin and test via provided data
    const removeExamAdmins = (data) => {
        console.log('Deleting links');
        data.forEach(pair => {
            console.log(pair);
            fetch(`${rootDomain}${domainPath}examAdminDelete&adminID=${pair.adminID}&testID=${pair.testID}`)
                .then(response => console.log(response));
        });
    }

    //add each question in the questions array to the questions table, associated with specific testID
    const addQuestionsToExam = (id) => {
        console.log("Adding questions");
        questions.forEach(q => {
            console.log(`admin: ${sAdmin.adminID} adding a question to exam: ${id}`);
            fetch(`${rootDomain}${questionPath}questionPost&adminID=${sAdmin.adminID}&testID=${id}&question=${q.question}&questionType=${q.questionType}&numOptions=${0}`)
                .then(response => console.log(response));
        })
    }

    //get all questions associated with a specific testID
    const getExamQuestions = (id) => {
        setQuestions([]);
        fetch(`${rootDomain}${questionPath}examQuestionsGet&testID=${id}`)
            .then(response => response.json())
            .then(data => setQuestions(data.sort((a, b) => a.questionID < b.questionID)));
    }

    //add the admin to existing exam
    const linkAdminToExam = (id) => {
        console.log("generated key : " + id);
        fetch(`${rootDomain}${domainPath}linkAdminToExam&adminID=${sAdmin.adminID}&testID=${id}`)
            .then(response => console.log(response))
            .then(() => getExams())
            .then(() => getAdminExams(sAdmin));

            //refresh exams
            //refresh admin's exams
    };

    //check if an admin is able to add the selected exam
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
                            {
                                questions.length ? <div>
                                    {
                                        questions.map(q => {
                                            return <Question question={ q }/>
                                        })
                                    }
                                </div> : null
                            }
                            <div>
                                {
                                    creatingQuestion ? <AddQuestion questions={ questions } setQuestions={ setQuestions } setCreatingQuestion={ setCreatingQuestion } /> : 
                                    <button onClick={ handleClick } type="button" id="addQuestion">Add Question</button>
                                }
                            </div>
                            <div>
                                <button className="button-gap" type="submit">Submit</button>
                                <button onClick={ handleClick } id="cancel" type="button">Cancel</button>
                            </div>
                        </form>
                    </div> : <button onClick={ handleClick } id="createExam">Create Exam</button>}
            </div> : "Please select an admin"}
            <div>
                {sAdmin && adminExamIDs && adminExamIDs.length ? <div>
                    <h4>{sAdmin.username}'s exams</h4>
                    { adminExams ? adminExams.map(exam => {
                        return <div key={exam.testID}>
                            <span>{exam.testName}</span>
                            {
                                viewExam === exam.testID && questions ? <div>
                                    {
                                        questions.map(q => {
                                            return <Question question={ q } key={ q.questionID }/>
                                        })
                                    }
                                </div> : null
                            }
                            {
                                viewExam === exam.testID ? <button className="button-gap" id="hideExam" onClick={ handleClick }>Hide</button>
                                 : <button className="button-gap" id="viewExam" onClick={ handleClick } value={ exam.testID }>View</button>
                            }
                            <button onClick={ handleClick} id="deleteExam" value={ exam.testID }>Delete</button>
                        </div>
                    }) : null}
                    </div> : null}
            </div>
            <div>
                <h4>All Exams</h4>
                {exams && exams.length ? exams.map(exam => {
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