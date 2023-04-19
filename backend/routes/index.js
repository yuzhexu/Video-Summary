var express = require('express');
var router = express.Router();
const rootDir = require('../util/path');
const path = require('path');
const PythonPath = path.join(rootDir, 'python', 'main.py')
let {PythonShell} = require('python-shell')
const { json } = require("express");
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();


function sendErrorResponse(res, message, statusCode = 500) {
  console.error("Error:", message);
  res.status(statusCode).json({ error: message });
}







//using youtube api to get video caption, then using openai to generate summary
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const generateResponse = async (url) => {
  var options = {
    mode: 'text',
    args: [url]
  };

  try {
    const result = await PythonShell.run(PythonPath, options);
    var caption_list = JSON.parse(result);
    var caption = "";
    for (var i = 0; i < caption_list.length; i++) {
      caption += caption_list[i] + " ";
    }

  // Create completion for each chunk of caption and combine them
  let summary_list = [];
  let previous = "";
  for (let i = 0; i < caption_list.length; i++) {
    let completion = await openai.createCompletion({
      model: "text-davinci-003", // text-davinci-003 gpt-3.5-turbo
      prompt: generatePrompt(previous, caption_list[i]),
      temperature: 0.2,
      max_tokens: 300,
    });
    summary_list.push(completion.data.choices[0].text);
    previous = completion.data.choices[0].text;
    console.log(summary_list)
  }
  let full_summary = JSON.stringify(summary_list);
  return full_summary;


  } catch (err) {
    //console.error('Error:', err);
  }
};


function generatePrompt(previous_chunk,caption) {
  if (previous_chunk === "")
  {
    return `You are a video summarizer. Summarize the following subtitle from the video. The caption maybe in chunks. You can use the previous summary of chunks to help you summarize the current chunk.

    The current chunk is:
    ${caption}
    `
  }


  return `You are a video summarizer. Summarize the following subtitle from the video. The caption maybe in chunks. You can use the previous summary of chunks to help you summarize the current chunk.

  The previous chunk is:
  ${previous_chunk},

  The current chunk is:
  ${caption}

  Summarize the current chunk without repeating the previous chunk. Do not say "The previous chunk is" or "The current chunk is" in your summary.
  `
}

router.post('/', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return sendErrorResponse(res, "URL is missing from the request body.", 400);
  }

  try {
    const completion = await generateResponse(url);
    //console.log(completion)
    
    if (completion) {
      res.status(200).json(completion);
    } else {
      sendErrorResponse(res, "API response is missing expected data.");
    }

    // if (completion && completion.data && completion.data.choices && completion.data.choices[0] && completion.data.choices[0].text) {
    //   res.status(200).json(completion.data.choices[0].text);
    // } else {
    //   res.status(500).json({ error: "API response is missing expected data." });
    // }
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
});




module.exports = router;
