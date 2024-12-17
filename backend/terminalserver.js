import { WebSocket, WebSocketServer } from 'ws';
import { exec } from 'child_process';
import Docker from 'dockerode';

const docker = new Docker();
const wss = new WebSocketServer({ port: 8080 });

// Track container instances
const containers = new Map();

wss.on('connection', async (ws) => {
    console.log('Client connected');
    
    try {
        // Create a new container instance for this connection
        const container = await docker.createContainer({
            Image: 'ubuntu:latest',
            Cmd: ['/bin/bash'],
            Tty: true,
            OpenStdin: true,
            StdinOnce: false,
            Env: [
                "TERM=xterm",
                "PS1=user$ "
            ],
            WorkingDir: "/home"
        });

        await container.start();
        
        const exec = await container.exec({
            Cmd: ['/bin/bash', '-c', 'PS1="user$ " exec /bin/bash --norc'],
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
            Env: [
                "TERM=xterm",
                "PS1=user$ "
            ]
        });

        const stream = await exec.start({
            hijack: true,
            stdin: true
        });

        // Store container reference
        containers.set(ws, container);

        // Handle incoming messages
        ws.on('message', async (message) => {
            stream.write(message);
        });

        // Handle stream data
        stream.on('data', (data) => {
            ws.send(data.toString());
        });

    } catch (error) {
        console.error('Container creation error:', error);
        ws.send('Error: Unable to create container');
    }

    ws.on('close', async () => {
        console.log('Client disconnected');
        const container = containers.get(ws);
        if (container) {
            await container.stop();
            await container.remove();
            containers.delete(ws);
        }
    });
});

console.log('WebSocket server running on port 8080');