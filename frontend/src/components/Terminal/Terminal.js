import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';

const TerminalComponent = ({ terminalId, chapterNum, subsectionNum }) => {
    const terminalRef = useRef(null);
    const term = useRef(null);
    const fitAddonRef = useRef(null);
    const socketRef = useRef(null);
    const commandBufferRef = useRef('');

    const getTerminalPrompt = () => {
        return '\r\n';
    };

    const getWelcomeMessage = () => {
        const messages = {
            5: {
                1: "Welcome to File Navigation Practice\nTry commands like 'pwd', 'ls', and 'cd'",
                2: "Directory Management Terminal\nPractice 'mkdir' and 'rmdir' commands",
                3: "File Operations Terminal\nTry 'cp' and 'mv' commands",
                4: "File Viewing Terminal\nExperiment with 'cat', 'less', and 'grep'"
            },
            6: {
                1: "I/O Redirection Practice\nTry using '>', '>>', and '|'",
                2: "Command Combination Terminal\nPractice using ';', '&&', and '||'",
                3: "File Permissions Terminal\nExperiment with 'chmod' and 'ls -l'",
                4: "Advanced Permissions\nPractice with 'chown' and 'chgrp'"
            },
            7: {
                1: "Superuser Practice Terminal\nTry 'sudo' commands (safely)",
                2: "User Management Terminal\nPractice user administration",
                3: "Package Management Terminal\nExperiment with 'apt' commands",
                4: "System Monitoring Terminal\nTry 'ps', 'top', and 'df'"
            }
        };

        return messages[chapterNum]?.[subsectionNum] || "Welcome to the Linux Terminal";
    };

    const initializeTerminal = () => {
        if (!terminalRef.current || term.current) return;

        try {
            term.current = new Terminal({
                cursorBlink: true,
                theme: {
                    background: '#1a1a1a',
                    foreground: '#ffffff',
                    cursor: '#ffffff'
                },
                fontFamily: '"Courier New", "DejaVu Sans Mono", monospace',
                fontSize: 14,
                lineHeight: 1.5,
                letterSpacing: 'normal',
                rows: 15,
                cols: 80,
                rendererType: 'canvas'
            });

            fitAddonRef.current = new FitAddon();
            term.current.loadAddon(fitAddonRef.current);
            term.current.loadAddon(new WebLinksAddon());

            socketRef.current = new WebSocket('ws://localhost:8080');

            socketRef.current.onopen = () => {
                console.log('WebSocket connected');
            };

            socketRef.current.onmessage = (event) => {
                term.current.write(event.data);
            };

            socketRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                term.current.writeln('\r\nError: Unable to connect to server');
            };

            term.current.onKey(({ key, domEvent }) => {
                const ev = domEvent;
                const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

                if (ev.keyCode === 13) { // Enter
                    if (socketRef.current?.readyState === WebSocket.OPEN) {
                        socketRef.current.send(commandBufferRef.current + '\n');
                    }
                    commandBufferRef.current = '';
                    term.current.write('\r\n');
                } else if (ev.keyCode === 8) { // Backspace
                    if (commandBufferRef.current.length > 0) {
                        commandBufferRef.current = commandBufferRef.current.slice(0, -1);
                        term.current.write('\b \b');
                    }
                } else if (printable) {
                    commandBufferRef.current += key;
                    term.current.write(key);
                }
            });

            term.current.open(terminalRef.current);
            
            setTimeout(() => {
                if (fitAddonRef.current) {
                    try {
                        fitAddonRef.current.fit();
                        const message = getWelcomeMessage();
                        term.current.clear();
                        term.current.writeln(message);
                        term.current.writeln('\r\nType "help" for available commands');
                        term.current.write(getTerminalPrompt());
                    } catch (error) {
                        console.error('Terminal fit error:', error);
                    }
                }
            }, 100);

        } catch (error) {
            console.error('Terminal initialization error:', error);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(initializeTerminal, 100);

        return () => {
            clearTimeout(timeoutId);
            if (socketRef.current) {
                socketRef.current.close();
            }
            if (term.current) {
                term.current.dispose();
                term.current = null;
            }
        };
    }, [chapterNum, subsectionNum]);

    return (
        <div 
            ref={terminalRef} 
            style={{ 
                height: '300px', 
                width: '100%',
                padding: '10px',
                backgroundColor: '#1a1a1a',
                borderRadius: '5px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: '"Courier New", "DejaVu Sans Mono", monospace',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
            }} 
        />
    );
};

export default TerminalComponent;