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
import TerminalComponent from '../../components/Terminal/Terminal.js';
import 'xterm/css/xterm.css';

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
    const [userProgressDoc, setUserProgressDoc] = useState(null);    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([{ text: 'Hi, any questions for me?', isBot: true }]);
    const [loading, setLoading] = useState(false);

    const [showQuiz, setShowQuiz] = useState(false);
    const [showExercise, setShowExercise] = useState(false);

    const currentChapter = textbookData.chapters[selectedChapter];
    const currentContent = selectedSubsection !== null
        ? currentChapter.subsections[selectedSubsection].content
        : currentChapter.content;

    const currentBulletPoints = selectedSubsection !== null
        ? currentChapter.subsections[selectedSubsection].bulletPoints
        : null;

    const currentExtraContent = selectedSubsection !== null
        ? currentChapter.subsections[selectedSubsection].extraContent
        : null;

    const updateChapterProgress = async (chapterIndex, subsectionIndex = null) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found');
                return;
            }

            const payload = {
                activityType: 'chapterProgress',
                chapterData: {
                    chapterIndex: chapterIndex,
                    subsectionIndex: subsectionIndex,
                    completed: true,
                    completedAt: new Date()
                }
            };

            const response = await axios.post(
                'http://localhost:3001/user/progress',
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log("hisss:", response)

            if (response.data.success) {
                // Update local progress state
                setProgress(response.data.progress);
                fetchProgress(); // Refresh progress data
            }
        } catch (error) {
            console.error('Error updating chapter progress:', error);
        }
    };

    const fetchProgress = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found');
                return;
            }

            const response = await axios.get('http://localhost:3001/progress/user-progress', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data) {
                setProgress(response.data.progress || 0);
                setUserProgressDoc(response.data);
            }
        } catch (error) {
            console.error('Error fetching progress:', error);
        }
    };
    useEffect(() => {
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

    const goToNextPage = async () => {
        const chapterCount = textbookData.chapters.length;
        const currentChapter = textbookData.chapters[selectedChapter];
        const currentSubsections = currentChapter.subsections || [];
        const subsectionCount = currentSubsections.length;

        // Update progress before changing page
        await updateChapterProgress(
            selectedChapter,
            selectedSubsection !== null ? selectedSubsection : null
        );

        // State updates
        if (selectedSubsection === null) {
            if (subsectionCount > 0) {
                setSelectedSubsection(0);
            } else if (selectedChapter < chapterCount - 1) {
                setSelectedChapter(selectedChapter + 1);
                setSelectedSubsection(null);
            }
        } else {
            if (selectedSubsection < subsectionCount - 1) {
                setSelectedSubsection(selectedSubsection + 1);
            } else if (selectedChapter < chapterCount - 1) {
                setSelectedChapter(selectedChapter + 1);
                setSelectedSubsection(null);
            }
        }

        // Use setTimeout to ensure scroll happens after state update
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 100);
    };

    const goToFurtherReading = () => {
        const currentChapter = textbookData.chapters[selectedChapter];
        const furtherReadingsArr = ["https://www.cisco.com/site/us/en/learn/topics/security/what-is-cybersecurity.html",
            "https://www.stickmancyber.com/cybersecurity-blog/is-your-business-vulnerable-start-identifying-cybersecurity-risks",
            "https://www.fcc.gov/communications-business-opportunities/cybersecurity-small-businesses",
            "https://www.ncsc.gov.uk/collection/top-tips-for-staying-secure-online",
            "https://linuxcommand.org/lc3_lts0050.php",
            "https://ss64.com",
            "https://linuxize.com/post/how-to-create-groups-in-linux/"]

        window.open(furtherReadingsArr[currentChapter.title[8] - 1]); 
    }

    const showTerminal = () => {
        const chapterNum = currentChapter.title.match(/Chapter (\d+)/);
        if (!chapterNum) return false;
        const num = parseInt(chapterNum[1]);
        return num >= 5 && num <= 7 && selectedSubsection !== null;
    };

    // Add useEffect to handle scrolling
    useEffect(() => {
        // Find the main content element and scroll it to top
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.scrollTop = 0;
        }
    }, [selectedChapter, selectedSubsection]); // Trigger when chapter or subsection changes

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
                    userProgressDoc={userProgressDoc}
                />
                <main className="main-content">
                    <h2>{textbookData.title}</h2>
                    <h3>by {textbookData.author}</h3>
                    <div className="chapter" style={{ position: 'relative', paddingBottom: '60px' }}>
                        <h3>{currentChapter.title}</h3>
                        {selectedSubsection !== null && (
                            <>
                                <h4>{currentChapter.subsections[selectedSubsection].title}</h4>
                                <p dangerouslySetInnerHTML={{ __html: currentContent }}></p>
                                {currentBulletPoints && (
                                    <ul className="bullet-points">
                                        {currentBulletPoints.map((point, index) => (
                                            <li key={index} dangerouslySetInnerHTML={{ __html: point }}></li>
                                        ))}
                                    </ul>
                                )}
                                {currentExtraContent && currentExtraContent.map((paragraph, index) => (
                                    <React.Fragment key={index}>
                                        <p dangerouslySetInnerHTML={{ __html: paragraph }}></p>
                                        {showTerminal() && (
                                            <div className="terminal-container">
                                                <h3>Practice Terminal {index + 1}</h3>
                                                <TerminalComponent 
                                                    terminalId={`${selectedChapter}-${selectedSubsection}-${index}`} 
                                                    chapterNum={parseInt(selectedChapter) + 1} 
                                                    subsectionNum={parseInt(selectedSubsection) + 1} 
                                                />
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                                {selectedChapter === 1 && selectedSubsection === 0 && (
                                  <PhishingSimulationPage />
                                )}
                                {selectedChapter === 2 && selectedSubsection === 0 && (
                                  <PasswordStrengthTester />
                                )}
                            </>
                        )}
                        {selectedSubsection === null && (
                            <>
                                <p>{currentContent}</p>
                                <div className="image-box">
                                    <img
                                        src={currentChapter.image}
                                        alt={`Image for ${currentChapter.title}`}
                                    />
                                </div>
                            </>
                        )}
                        <button onClick={goToNextPage} className="next-page-button">Next Page</button>
                    </div>
                </main>
                <section className="right-panel">
                    <div className="tools">
                        <button onClick={() => setShowQuiz(true)}>Test me</button>
                        <button onClick={() => setShowExercise(true)}>Practical exercise</button>
                        <button onClick={goToFurtherReading}>Further reading</button>
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
