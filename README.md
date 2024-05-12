## Introducing Chai Chat
Chai Chat is a Real-Time chat application built with Express.js, React.js and websocket provider Socket.io
![pic of chaichat](demo2.jpg)

#### Tech Used -

 - ##### Back-End
		 1). Express.js / Node.js (For writing server code and logic)
		 2). MongoDB Atlas (For storage of messages and conversations)
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

1).MONGODB_URI="mongodb+srv://anshpradhan03:pCk6pvvwLVNuI6NJ@cluster0.ygkcuwn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
2).PORT=3000
3).JWT_SECRET=sadfhasdfas
4).CLAUDE_API=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

#### API Routes Description -

 - **Create User**
		 - End Point - http://localhost:3000/api/users/register
		 - Method - POST
		 - Expected Input - name, email and password in the `req.body` object
		 - Expected Output - user object with `name, email, status and _id` of the user
		 
 - **User Login**
		 - End Point - http://localhost:3000/api/users/login
		 - Method - POST
		 - Expected Input - email and password in the `req.body` object
		 - Expected Output - user object with `id, name, email, status` of user and a `token` value indicating that the user has logged in

 - **Get Conversation ID and User**
		 - End Point - http://localhost:3000/api/conversation/(userId)
		 - Method - GET
		 - Expected Input - userId in the params object of `req.params`
		 - Expected Output - array of conversations of which the user has been part of

 - **Create Conversation**
		 - End Point - http://localhost:3000/api/conversation/
		 - Method - POST
		 - Expected Input - `senderId` and `receiverId`
		 - Expected Output - message stating `convo created successfully`

 - **Send Message**
		 - End Point - http://localhost:3000/api/message
		 - Method - POST
		 - Expected Input - `conversationId, senderId, message` in `req.body`
		 - Expected Output - message stating `Message sent successfully`

 - **Get Messages**
		 - End Point - http://localhost:3000/api/message/(conversationId)
		 - Method - GET
		 - Expected Input - conversationId in the params object of `req.params`
		 - Expected Output - array of messages related to the conversation with the supplied conversationId

 - **Get Users**
		 - End Point - http://localhost:3000/api/users
		 - Method - GET
		 - Expected Input - no input required
		 - Expected Output - array of all the users in the mongoDB Atlas database
		
#### Testing Information -
For testing the functionality of the Chai Chat application you can open the application in two instances, once in the normal browser and another instance in an incognito tab and then login in both the instances, after logging in on both instances you can select the user you want to chat with, make sure that user is the same user who you have logged in with in the another instance just like so

![example of testing](demo1.jpg)

I have created multiple test users in during development just so that the application looks full and can be interactive, if you wish you can create your own  users and chat mutually.

#### Important Note! 
I have used Anthropic's Calude AI APIs to generate a message if a user is currently busy or in other words has not connected with the socket.

#### Working of "Available and Busy" Switching
So i have made the application such that the application can automatically track whether a user is "Available" or "Busy" based on whether or not the user is connected to the socket instance or not, so whenever a users connects to a socket(which is handled in the server itself, no need to connect manually) the status of the user will be set to available and when the user disconnects from the socket (again, handled in the server itself) the status of the user is set back to busy.


