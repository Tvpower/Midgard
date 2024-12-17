import React, { useState } from 'react';

const questions = [
  {
    question: 'Which of these describes an ongoing pursuit by an individual/group?',
    correctAnswer: 'Stalking',
  },
  {
    question: 'Which one of the following is considered in the category of computer threats?',
    correctAnswer: 'DoS attack',
  },
  {
    question: 'Which of the following typically keeps tabs on every online activity the victim engages in, compiles all the data in the background, and sends it to a third party?',
    correctAnswer: 'Spyware',
  },
  {
    question: 'Which one is considered to be a type of antivirus program?',
    correctAnswer: 'All of the above',
  },
  {
    question: 'Which of these scanners for ports and IP addresses is most used by users?',
    correctAnswer: 'Angry IP Scanner',
  },
  {
    question: 'Which of the following phrases describes taking someone else\'s creation or idea and using it for one\'s own advantage?',
    correctAnswer: 'All of the above',
  },
  {
    question: 'Which of the following describes investigating moral conduct concerning the digital media landscape?',
    correctAnswer: 'Cyberethics',
  },
  {
    question: 'State whether True or False: Data encryption is used to ensure confidentiality.',
    correctAnswer: 'True',
  },
  {
    question: 'Determine the earliest method of free phone calls used by hackers.',
    correctAnswer: 'Phreaking',
  },
  {
    question: 'Which of the following statements best describes how the principle would be broken if a computer was no longer accessible?',
    correctAnswer: 'Availability',
  },
  {
    question: 'Which of these methods is used to check the validity of a message?',
    correctAnswer: 'Message Digest',
  },
  {
    question: 'Which of the following is typically used when hacking Wi-Fi?',
    correctAnswer: 'Aircrack-ng',
  },
  {
    question: 'Among the following, which is not a form of scanning?',
    correctAnswer: 'Cloud Scan',
  },
  {
    question: 'The Code Red is similar to a:',
    correctAnswer: 'Computer Virus',
  },
  {
    question: 'Which of these was the first antivirus software ever created?',
    correctAnswer: 'Reaper',
  },
];

const QuizPage = ({ onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showingAnswer, setShowingAnswer] = useState(false);

  const currentQuestion = !feedback ? questions[currentQuestionIndex] : feedback[currentQuestionIndex];

  const handleAnswerChange = (e) => {
    const { value } = e.target;
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: value,
    }));
  };

  const handleNext = () => {
    if (feedback) {
      if (currentQuestionIndex < feedback.length - 1) {
        setIsFlipping(true);
        setTimeout(() => {
          setCurrentQuestionIndex(prev => prev + 1);
          setShowingAnswer(false);
        }, 400);
        setTimeout(() => {
          setIsFlipping(false);
        }, 800);
      }
    } else {
      if (currentQuestionIndex < questions.length - 1) {
        setIsFlipping(true);
        setTimeout(() => {
          setCurrentQuestionIndex(prev => prev + 1);
        }, 400);
        setTimeout(() => {
          setIsFlipping(false);
        }, 800);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev - 1);
        setShowingAnswer(false);
      }, 400);
      setTimeout(() => {
        setIsFlipping(false);
      }, 800);
    }
  };

  const handleSubmit = () => {
    const results = questions.map((question, index) => ({
      question: question.question,
      userAnswer: userAnswers[index] || 'No answer',
      correctAnswer: question.correctAnswer,
      isCorrect: (userAnswers[index] || '').toLowerCase() === question.correctAnswer.toLowerCase(),
    }));
    setFeedback(results);
    setCurrentQuestionIndex(0);
    setShowingAnswer(false);
  };

  const handleFlipCard = () => {
    if (feedback) {
      setIsFlipping(true);
      setTimeout(() => {
        setShowingAnswer(!showingAnswer);
      }, 400);
      setTimeout(() => {
        setIsFlipping(false);
      }, 800);
    }
  };

  return (
    <div className="exercise-page">
      <div className="exercise-container">
        <h2>Quiz: Text Input Questions</h2>
        <div className="card-container">
          <div className={`flashcard ${isFlipping ? 'flipping' : ''}`} onClick={handleFlipCard}>
            <div className="card-content">
              {!feedback ? (
                <>
                  <p><strong>{currentQuestionIndex + 1}.</strong> {currentQuestion.question}</p>
                  <input
                    type="text"
                    placeholder="Type your answer here"
                    value={userAnswers[currentQuestionIndex] || ''}
                    onChange={handleAnswerChange}
                    style={{ marginBottom: '10px', display: 'block', width: '100%', padding: '10px', borderRadius: '5px' }}
                  />
                </>
              ) : (
                <>
                  {!showingAnswer ? (
                    <div className="question-side">
                      <p><strong>{currentQuestionIndex + 1}.</strong> {currentQuestion.question}</p>
                      <p>Your Answer: {currentQuestion.userAnswer}</p>
                      <p>(Click to see correct answer)</p>
                    </div>
                  ) : (
                    <div className="answer-side">
                      <p>Correct Answer: {currentQuestion.correctAnswer}</p>
                      <p className={currentQuestion.isCorrect ? 'correct' : 'incorrect'}>
                        {currentQuestion.isCorrect ? 'Correct!' : 'Incorrect'}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          {currentQuestionIndex > 0 && (
            <button onClick={handlePrevious} style={{ marginRight: '10px' }}>Previous</button>
          )}
          {!feedback ? (
            currentQuestionIndex < questions.length - 1 ? (
              <button onClick={handleNext}>Next</button>
            ) : (
              <button onClick={handleSubmit}>Submit</button>
            )
          ) : (
            <>
              {currentQuestionIndex < feedback.length - 1 ? (
                <button onClick={handleNext}>Next Result</button>
              ) : (
                <button onClick={onBack}>Back to Main Menu</button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
