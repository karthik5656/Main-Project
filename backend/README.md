# Note Maker API
Built with Express.js

Steps to run:-

	1. Install Node.js.
	2. Replace the environment variables value in .env.example and rename the file to .env
	3. Run 'npm install'.
	4. Run 'npm start'.

API Routes:-

	POST /auth/login - {username:String, password:String} - Logs in the user

	PUT /auth/refresh - refreshes the user session

	DELETE /auth/logout - Log the user and delete current session