// ContentPage.js
import React, { useState, useEffect } from 'react';
import textbookData from './TextbookData.js'; // Adjust path if needed
import NavBar from '../../components/NavBar.js';
import PhishingSimulationPage from '../../components/phishingSimulation/phishingEmails.js';
import PasswordStrengthTester from "../../components/PasswordStrengthTester/PasswordStrengthTester.js";
import axios from 'axios';
import './styles.css';
import QuizPage from './QuizPage.js'; // Adjust path to wherever you placed QuizPage.js
import PracticalExercisePage from './PracticalExercisePage.js'; // Adjust path

const Sidebar = ({ chapters, onSelectChapter, selectedChapter, selectedSubsection, onSelectSubsection, progress }) => {
    const [expandedChapters, setExpandedChapters] = useState([]);

    const handleChapterClick = (index) => {
        if (expandedChapters.includes(index)) {
            setExpandedChapters(expandedChapters.filter(chap => chap !== index));
        } else {
            setExpandedChapters([...expandedChapters, index]);
        }
        onSelectChapter(index);
        onSelectSubsection(null);
    };

    useEffect(() => {
        setExpandedChapters([selectedChapter]);
    }, [selectedChapter]);

    return (
        <aside className="sidebar">
            <div className="subscribe-box">
                <input type="email" placeholder="Enter your email" />
                <button>Subscribe</button>
                <p>Receive a weekly email containing the next unit.</p>
            </div>
            <div className="progress">
                <label>Your progress</label>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <nav className="course-navigation">
                <h3>Table of Contents</h3>
                <ul className="chapter-list">
                    {chapters.map((chapter, chapterIndex) => {
                        const isExpanded = expandedChapters.includes(chapterIndex);
                        return (
                            <li key={chapterIndex} className="chapter-item">
                                <a 
                                  onClick={() => handleChapterClick(chapterIndex)} 
                                  className={selectedChapter === chapterIndex ? 'selected' : ''}
                                >
                                    {chapter.title}
                                </a>
                                <ul className={`subsection-list ${isExpanded ? 'expanded' : ''}`}>
                                    {isExpanded && chapter.subsections && (
                                        chapter.subsections.map((subsection, subsectionIndex) => (
                                            <li key={subsectionIndex} className="subsection-item">
                                                <a
                                                    onClick={() => onSelectSubsection(subsectionIndex)}
                                                    className={
                                                        selectedChapter === chapterIndex && selectedSubsection === subsectionIndex 
                                                            ? 'selected' 
                                                            : ''
                                                    }
                                                >
                                                    {subsection.title}
                                                </a>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
};

const ContentPage = () => {
    const [selectedChapter, setSelectedChapter] = useState(0);
    const [selectedSubsection, setSelectedSubsection] = useState(null);
    const [progress, setProgress] = useState(0);
    const [userId, setUserId] = useState(localStorage.getItem('userId')); 
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([{ text: 'Hi, any questions for me?', isBot: true }]);
    const [loading, setLoading] = useState(false);

    const [showQuiz, setShowQuiz] = useState(false);
    const [showExercise, setShowExercise] = useState(false);

    const currentChapter = textbookData.chapters[selectedChapter];
    const currentContent = selectedSubsection !== null
        ? currentChapter.subsections[selectedSubsection].content
        : currentChapter.content;


    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('No token found');
                    return;
                }
                console.log('Attempting to fetch progress with token:', token);

                const response = await axios.get('http://localhost:3001/progress/user-progress', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Full progress response:', response);

                if (response.data) {
                    console.log('Progress data received:', response.data);
                    setProgress(response.data.progress || 0);
                } else {
                    console.error('No data in response');
                }
            } catch (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error('Error response:', error.response.data);
                    console.error('Error status:', error.response.status);
                    console.error('Error headers:', error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error('No response received:', error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error setting up request:', error.message);
                }
            }
        };

        fetchProgress();
    }, []);

    const fetchChatGPTResponse = async (userInput) => {
        try {
            const response = await axios.post('http://localhost:3001/openai/chat', {
                userInput: userInput
            });
            return response.data.reply;
        } catch (error) {
            console.error('Error fetching response from backend:', error);
            return 'Sorry, I could not get a response.';
        }
    };

    const handleChatSubmit = async (e) => {
        if (e.key === 'Enter' && chatInput.trim()) {
            const userMessage = chatInput.trim();
            setChatMessages(prev => [...prev, { text: userMessage, isBot: false }]);
            setChatInput('');
            
            setLoading(true);
            const response = await fetchChatGPTResponse(userMessage);
            setLoading(false);

            setChatMessages(prev => [...prev, { text: response, isBot: true }]);
        }
    };

    const goToNextPage = () => {
        const chapterCount = textbookData.chapters.length;
        const currentChapter = textbookData.chapters[selectedChapter];
        const currentSubsections = currentChapter.subsections || [];
        const subsectionCount = currentSubsections.length;

        if (selectedSubsection === null) {
            if (subsectionCount > 0) {
                setSelectedSubsection(0);
            } else {
                if (selectedChapter < chapterCount - 1) {
                    setSelectedChapter(selectedChapter + 1);
                    setSelectedSubsection(null);
                } else {
                    // End of all chapters scenario
                }
            }
        } else {
            if (selectedSubsection < subsectionCount - 1) {
                setSelectedSubsection(selectedSubsection + 1);
            } else {
                if (selectedChapter < chapterCount - 1) {
                    setSelectedChapter(selectedChapter + 1);
                    setSelectedSubsection(null);
                } else {
                    // End of all chapters scenario
                }
            }
        }
    };

    // If showQuiz or showExercise is true, we hide the main content and show the respective component
    if (showQuiz) {
        return (
            <>
                <NavBar />
                <div className="container">
                    <QuizPage onBack={() => setShowQuiz(false)} />
                </div>
            </>
        );
    }

    if (showExercise) {
        return (
            <>
                <NavBar />
                <div className="container">
                    <PracticalExercisePage onBack={() => setShowExercise(false)} />
                </div>
            </>
        );
    }

    return (
        <>
            <NavBar />
            <div className="container">
                <Sidebar
                    chapters={textbookData.chapters}
                    onSelectChapter={(index) => {
                        setSelectedChapter(index);
                        setSelectedSubsection(null);
                    }}
                    onSelectSubsection={setSelectedSubsection}
                    selectedChapter={selectedChapter}
                    selectedSubsection={selectedSubsection}
                    progress={progress}
                />
                <main className="main-content">
                    <h2>{textbookData.title}</h2>
                    <h3>by {textbookData.author}</h3>
                    <div className="chapter" style={{ position: 'relative', paddingBottom: '60px' }}>
                        <h3>{currentChapter.title}</h3>
                        {selectedSubsection !== null && (
                            <h4>{currentChapter.subsections[selectedSubsection].title}</h4>
                        )}
                        <p dangerouslySetInnerHTML={{ __html: currentContent }} />
                        {currentContent.bulletPoints && (
                            <ul className="bullet-points">
                                {currentContent.bulletPoints.map((bulletPoint, index) => (
                                    <li key={index} dangerouslySetInnerHTML={{ __html: bulletPoint }} />
                                ))}
                            </ul>
                        )}
                        {selectedChapter === 1 && selectedSubsection === 0 && (
                            <PhishingSimulationPage/>
                        )}
                        {selectedChapter === 2 && selectedSubsection === 0 && (
                            <PasswordStrengthTester />
                        )}

                        {selectedSubsection === null && (
                            <div className="image-box">
                                <img
                                    src="https://engineering.tufts.edu/sites/g/files/lrezom421/files/styles/embedded_large/public/Programs_Dept-ComputerScience_lrg_0.jpg?itok=nKHOb7F2"
                                    alt="Chemistry illustration"
                                />
                                <p>Computer Security!</p>
                            </div>
                        )}
                        <button onClick={goToNextPage} className="next-page-button">Next Page</button>
                    </div>
                </main>
                <section className="right-panel">
                    <div className="tools">
                        <button onClick={() => setShowQuiz(true)}>Test me</button>
                        <button onClick={() => setShowExercise(true)}>Practical exercise</button>
                        <button>Further reading</button>
                    </div>
                    <div className="chat-box">
                        <div className="chat-messages">
                            {chatMessages.map((msg, idx) => (
                                <div key={idx} className={`chat-message ${msg.isBot ? 'bot' : 'user'}`}>
                                    {msg.text}
                                </div>
                            ))}
                            {loading && (
                                <div className="loading-indicator">
                                    <div className="spinner"></div>
                                </div>
                            )}
                        </div>
                        <input 
                            type="text" 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={handleChatSubmit}
                            placeholder="Type your message..." 
                        />
                    </div>
                </section>
            </div>
        </>
    );
};

export default ContentPage;
