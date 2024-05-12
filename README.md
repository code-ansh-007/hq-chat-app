## Introducing Chai Chat
Chai Chat is a Real-Time chat application built with Express.js, React.js and websocket provider Socket.io
#### Tech Used -

 - ##### Back-End
		 1). Express.js / Node.js (For writing server code and logic)
		 2). MongoDB (For storage of messages and conversations)
		 3). Socket.io (For real-time messaging functionality)
		 3). JWT(Used JWT tokens for token based authentication)
		 4). Anthropic-AI/Claude-AI (For LLM response generation when user is busy)
 - ##### Front-End
		 1). React.js (Front-end framework)
		 2). Tailwind CSS (Styling Engine)
		 3). Axios (For fetching API requests)
		 4). Socket.io-Client (For managing socket.io in Front-end)
		 5). Flowbite (Tailwind CSS component library)

#### Setup Instructions - 

- Clone repository - https://github.com/code-ansh-007/hq-chat-app/tree/main
- Go to sub-directory "client" - Install dependencies `npm install`
- Go to sub-directory "server" - Install dependencies `npm install`
- Open two terminals one for "server" and one for "client" run command `npm run dev` to start the development server and run command `npm run start` to start the front-end development server
- ##### PORTS -
		1). Server Port - 3000
		2). Front-End Port - 3001
		3). Socket.io Port - 8000

#### Note -
I have included the .env file in the repo for testing purposes but by any chance if you don't find it below are the necessary environment variables essential for the sites proper functioning -

![Example Image](demo1.jpg)


		 
