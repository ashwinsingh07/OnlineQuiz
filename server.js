const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const questions = [
  { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyperlinks Text Management Language", "Home Tool Markup Language"], answer: 0 },
  { question: "Which language is used to style a web page?", options: ["Python", "CSS", "SQL", "Java"], answer: 1 },
  { question: "Which keyword declares a constant in JavaScript?", options: ["var", "let", "const", "static"], answer: 2 },
  { question: "Which runtime can execute JavaScript on a server?", options: ["Node.js", "HTML", "CSS", "Photoshop"], answer: 0 },
  { question: "Which HTML tag creates a hyperlink?", options: ["<link>", "<a>", "<href>", "<url>"], answer: 1 },
  { question: "Which method writes a message to the browser console?", options: ["console.log()", "print.page()", "echo.html()", "show.text()"], answer: 0 },
  { question: "Which symbol selects an ID in CSS?", options: [".", "#", "*", "&"], answer: 1 },
  { question: "Which HTTP method is commonly used to submit data?", options: ["GET", "POST", "READ", "OPEN"], answer: 1 },
  { question: "Which HTML tag displays an image?", options: ["<image>", "<picture-src>", "<img>", "<src>"], answer: 2 },
  { question: "Which command installs a project's dependencies?", options: ["node install", "npm install", "run server", "html start"], answer: 1 }
];

app.get("/api/questions", (req, res) => {
  res.json(questions.map(({ question, options }) => ({ question, options })));
});

app.post("/api/submit", (req, res) => {
  const answers = req.body && req.body.answers;

  if (
    !Array.isArray(answers) ||
    answers.length !== questions.length ||
    !answers.every(answer =>
      Number.isInteger(answer) && answer >= -1 && answer < 4
    )
  ) {
    return res.status(400).json({ error: "Invalid answers submitted." });
  }

  const score = answers.reduce(
    (total, answer, index) => total + (answer === questions[index].answer ? 1 : 0),
    0
  );

  res.json({
    score,
    total: questions.length,
    percentage: Math.round((score / questions.length) * 100)
  });
});

app.listen(PORT, () => {
  console.log(`Quiz running at http://localhost:${PORT}`);
});
