import React, { useState } from 'react';

const questions = [
  {
    question: 'What are the common Cyberattacks?',
    options: ['Phishing', 'Social Engineering Attacks', 'Ransomware', 'SQL Injection'], // SQL Injection is incorrect
    correctAnswer: 'SQL Injection',
  },
  {
    question: 'What are the elements of cyber security?',
    options: ['Application Security', 'Information Security', 'Network Security', 'SQL Injection'], // SQL Injection is incorrect
    correctAnswer: 'SQL Injection',
  },
  {
    question: 'Define DNS?',
    options: ['Domain Name Service', 'Domain Name System', 'Dynamic Network Service', 'Data Network Service'], // Correct is Domain Name System
    correctAnswer: 'Domain Name System',
  },
  {
    question: 'What is a Firewall?',
    options: ['A network security device', 'A virus detection tool', 'A malware removal tool', 'An encryption device'], // Correct is A network security device
    correctAnswer: 'A network security device',
  },
  {
    question: 'What is a VPN?',
    options: ['Virtual Protocol Network', 'Virtual Private Network', 'Verified Protocol Network', 'Verified Private Network'], // Correct is Virtual Private Network
    correctAnswer: 'Virtual Private Network',
  },
  {
    question: 'What is not a source of malware?',
    options: ['Worms', 'Adware', 'Trojan', 'Firewall'], // Firewall is incorrect
    correctAnswer: 'Firewall',
  },
  {
    question: 'How does email work?',
    options: [
      'SMTP communicates with DNS and receiver SMTP',
      'POP3 communicates directly with DNS',
      'IMAP uses FTP to send emails',
      'SMTP skips DNS for direct delivery', // Correct is the first
    ],
    correctAnswer: 'SMTP communicates with DNS and receiver SMTP',
  },
  {
    question: 'What is the difference between active and passive cyber attacks?',
    options: [
      'Active attacks modify data, passive attacks observe', // Correct
      'Passive attacks modify data, active attacks observe',
      'Both involve modifying data',
      'Both involve only observation',
    ],
    correctAnswer: 'Active attacks modify data, passive attacks observe',
  },
  {
    question: 'What is a social engineering attack?',
    options: [
      'Manipulating people for access', // Correct
      'Installing malware remotely',
      'Using trojans for data theft',
      'Bypassing firewalls directly',
    ],
    correctAnswer: 'Manipulating people for access',
  },
  {
    question: 'Who are black hat hackers and white hat hackers?',
    options: [
      'Black hat = Criminals, White hat = Ethical', // Correct
      'Black hat = Ethical, White hat = Criminals',
      'Both are ethical hackers',
      'Both are malicious hackers',
    ],
    correctAnswer: 'Black hat = Criminals, White hat = Ethical',
  },
];

const PracticalExercisePage = ({ onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showingAnswer, setShowingAnswer] = useState(false);

  const currentQuestion = !feedback ? questions[currentQuestionIndex] : feedback[currentQuestionIndex];

  const handleOptionSelect = (option) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: option,
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
      selectedAnswer: selectedAnswers[index] || 'No answer',
      correctAnswer: question.correctAnswer,
      isCorrect: selectedAnswers[index] === question.correctAnswer,
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
        <h2>Practical Exercise: Multiple Choice</h2>
        <div className="card-container">
          <div className={`flashcard ${isFlipping ? 'flipping' : ''}`} onClick={handleFlipCard}>
            <div className="card-content">
              {!feedback ? (
                <>
                  <p>
                    <strong>{currentQuestionIndex + 1}.</strong> {currentQuestion.question}
                  </p>
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} style={{ marginBottom: '8px' }}>
                      <label>
                        <input
                          type="radio"
                          name={`question-${currentQuestionIndex}`}
                          value={option}
                          onChange={() => handleOptionSelect(option)}
                          checked={selectedAnswers[currentQuestionIndex] === option}
                        />
                        {' '}{option}
                      </label>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {!showingAnswer ? (
                    <div className="question-side">
                      <p><strong>{currentQuestionIndex + 1}.</strong> {currentQuestion.question}</p>
                      <p>Your Answer: {currentQuestion.selectedAnswer}</p>
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

export default PracticalExercisePage;

