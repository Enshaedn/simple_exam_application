
const Question = ({ question }) => {
    return (
        <div key={ question.questionID }>
            <div>{ question.question }</div>
            {
                {
                    'MultipleChoice': <div>Multiple Choice</div>,
                    'TrueFalse': <div>True / False</div>,
                    'TextEntry': <textarea placeholder="Enter your answer here:"/>,
                    'NumberEntry': <input type="number"/>,
                }[question.questionType]
            }
        </div>
    )
}

export default Question;