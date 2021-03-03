import TrueFalse from './TrueFalse';
import Options from './Options';

//element for displaying a question
const Question = ({ question }) => {
    return (
        <div key={ question.questionID }>
            <div>{ question.question }</div>
            {
                {
                    'MultipleChoice': <Options />,
                    'TrueFalse': <TrueFalse />,
                    'TextEntry': <textarea placeholder="Enter your answer here:"/>,
                    'NumberEntry': <input type="number"/>,
                }[question.questionType]
            }
        </div>
    )
}

export default Question;