const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// Example payload matching what the frontend expects
const professionalData = {
  professionalName: "Robert Example",
  base64Image: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=",
  nameLink: {
    firstName: "Robert",
    url: "https://example.com"
  },
  primaryDescription: " — Full Stack Developer and student.",
  workDescription1: "I build web apps using JavaScript, Node.js, and Express.",
  workDescription2: "Currently studying CSE courses and building projects to learn modern web development.",
  linkTitleText: "Find me on:",
  linkedInLink: {
    text: "LinkedIn",
    link: "https://www.linkedin.com"
  },
  githubLink: {
    text: "GitHub",
    link: "https://github.com"
  }
};

app.get('/', (req, res) => {
  res.send('Week1 server is running');
});

app.get('/professional', (req, res) => {
  res.json(professionalData);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
