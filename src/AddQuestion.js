import { useState, useEffect } from 'react';
import AddOptions from './AddOptions';
import AddTrueFalse from './AddTrueFalse';

//Element for adding questions to an exam
const AddQuestion = ({ questions, setQuestions, setCreatingQuestion }) => {
    const [prompt, setPrompt] = useState('');
    const [questionType, setQuestionType] = useState('multipleChoice');
    const [displayOptions, setDisplayOptions] = useState(false);
    const [displayTrueFalse, setDisplayTrueFalse] = useState(false);
    const [options, setOptions] = useState([]);

    //update display based on question type, re-render when type changes
    useEffect(() => {
        console.log("question type running");
        if(questionType === 'MultipleChoice') {
            setDisplayOptions(true);
            setDisplayTrueFalse(false);
        } else if(questionType === 'TrueFalse') {
            console.log('display tf');
            setDisplayTrueFalse(true);
            setDisplayOptions(false);
        } else {
            setDisplayOptions(false);
            setDisplayTrueFalse(false);
        }
    }, [questionType]);

    //Update state for question data holders
    const handleChange = (e) => {
        let opt = e.target.id;
        let value = e.target.value;

        if(opt === 'setPrompt') {
            setPrompt(value);
        } else if(opt === 'questionType') {
            console.log(value);
            setQuestionType(value);
        }
    };

    const handleClick = (e) => {
        let opt = e.target.id;

        if(opt === 'confirmQuestion') {
            console.log("Question Confirmed");
            //add confirmed question to questions array
            setQuestions([...questions, {
                questionID: questions.length++,
                question: prompt,
                questionType,
                options
            }])
            //hide new question element
            setCreatingQuestion(false);
        } else if(opt === 'removeQuestion') {
            console.log("Cancelling question");
            //hide new question element without adding question to array
            setCreatingQuestion(false);
        }
    }

    return (
        <div className="addQuestion">
            <textarea placeholder="Enter question prompt here..." value={ prompt } onChange={ handleChange } id="setPrompt"/>
            <div>
                <label htmlFor="questionType">Question Type:</label>
                <select name="questionType" id="questionType" onChange={ handleChange } >
                    <option value="MultipleChoice">Multiple Choice</option>
                    <option value="TrueFalse">True / False</option>
                    <option value="TextEntry">Text Entry</option>
                    <option value="NumberEntry">Number Entry</option>
                </select>
            </div>
            {
                displayOptions ? <AddOptions options={ options } setOptions={ setOptions } /> : null   
            }
            {
                displayTrueFalse ? <AddTrueFalse /> : null
            }
            <div>
                <button id="confirmQuestion" type="button" onClick={ handleClick }>Confirm Question</button>
                <button id="removeQuestion" type="button" onClick={ handleClick }>Remove Question</button>
            </div>
        </div>
    )
}

export default AddQuestion;