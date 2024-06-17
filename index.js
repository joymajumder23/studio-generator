const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT | 5000;

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GENIMI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// middleware
app.use(express.urlencoded({extended: true}));

const form = `
    <form method="POST" action="/prompt">
    <textarea name="prompt"></textarea>
    <button type="submit">Generate</button>
    </form>
`;

// get
app.get('/prompt', async (req, res) => {
    res.send(form);
})

// post
app.post('/prompt', async (req, res) => {
    // must be destructure prompt from req.body
    const {prompt} = req.body;

    // copy from genimi ai docs
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    res.send({ data: text, status: 200 });
})

app.get('/', (req, res) => {
    res.send({ data: "Server is running", status: 200 });
})

app.listen(port, () => {
    console.log('Studio Generator Server on Port', + port);
})