# QuizMaster — Online Quiz Application

A small college project using HTML, CSS, JavaScript, Node.js and Express.

## Features
- 10 multiple-choice questions
- Progress bar and question counter
- Select answers and move through questions
- Score and percentage calculated by the Node.js backend
- Restart quiz
- Responsive dark-purple UI

## Requirements
Install Node.js (LTS) from https://nodejs.org/

## Run locally
1. Extract the `OnlineQuiz.zip` folder.
2. Open the extracted `OnlineQuiz` folder in VS Code.
3. Open Terminal in VS Code.
4. Run:
   ```bash
   npm install
   npm start
   ```
5. Visit http://localhost:3000 in your browser.

Keep the terminal open while using the quiz. Press Ctrl+C in the terminal to stop the server.

## Files
- `server.js` — Express server and quiz API
- `public/index.html` — page structure
- `public/style.css` — styling
- `public/app.js` — quiz interaction
- `package.json` — project dependencies and start command
