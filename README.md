## Prerequisites
1.  To run locally, download the repository.
2.  Install Docker Desktop from [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
3.  Start Docker Desktop and ensure it is running.
4.  Open a terminal and run 'docker pull ubuntu:latest'

## Starting the Application

1.  Make sure Docker is running
2.  'npm install' in the following directories:
    -   \Your Directory\Midgard
    -   \Your Directory\Midgard\frontend
    -   \Your Directory\Migard\backend
3.  Open the following terminal windows:  
    - Terminal 1: 
	    - In  \Your Directory\Midgard, run the following command:  
		    - mongo —dbpath ~/datab/db 
			    - This will initialize the Mongo DB
    - Terminal 2: 
	    - In \Your Directory\Midgard, run the following command: 
		    -  mongosh "mongodb+srv://testcluster0.p9xa7.mongodb.net/" --apiVersion 1 --username (insert username here)
			    - this will allow the user to sign in with the provided credentials in our submitted Capstone Report under " Professor Rong Jin's Credentials" 
    - Terminal 3:
	    - In\YourDirectory\Midgard\backend, run the following command: 
		    - npm run start-terminal
			    - this will initialize the isolated, sandboxed terminal using Docker on port 8080
	- Terminal 4: 
		- Lastly, in \YourDirectory\Midgard, after performing "npm install" in Step 2, run the following command: 
			- npm start

### Troubleshooting

-   Ensure Docker is running
-   Verify Ubuntu image is installed with 'docker images'
- With any further issues, reach out to the Midgard team via email: 
	- [jberry19@csu.fullerton.edu](mailto:jberry19@csu.fullerton.edu), [mpinzon@csu.fullerton.edu](mailto:mpinzon@csu.fullerton.edu), [cffuentes@csu.fullerton.edu](mailto:cffuentes@csu.fullerton.edu), [lukepina@csu.fullerton.edu](mailto:lukepina@csu.fullerton.edu)
