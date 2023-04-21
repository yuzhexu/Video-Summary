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
    console.log("chunk " + i + " completed")
    console.log(completion.data.choices[0].text)
  }
  let full_summary = summary_list.join(" ");
  if (caption_list.length > 1) {
    let completion = await openai.createCompletion({
      model: "text-davinci-003", // text-davinci-003 gpt-3.5-turbo
      prompt: generateSumUpPrompt(full_summary),
      temperature: 0.2,
      max_tokens: 500,
    });
    full_summary = completion.data.choices[0].text
    console.log("Sum up completed");
  }
  console.log("Full Summary: \n" + full_summary);
  return full_summary;


  } catch (err) {
    console.error('Error:', err);
  }
};


function generatePrompt(previous_chunk, caption) {
  if (previous_chunk === "") {
    return `You are a video summarizer. Your task is to summarize the following subtitle from the video. The caption may be incomplete.:
    --------------------------------------
    ${caption}
    --------------------------------------`;
  }

  return `You are a video summarizer. Your task is to summarize the following subtitle from the video. The caption may appear in chunks. You can use the previous summary of chunks to help you summarize the current chunk.

  Previous chunk summary:
  ${previous_chunk}

  Current chunk:
  ${caption}

  Create a summary for the current chunk without repeating the previous chunk. Avoid using phrases like "The previous chunk is" or "The current chunk is" in your summary. Your summary should continue from the previous one without repeating information.`;
}


function generateSumUpPrompt(summary)
{
  return `Get rid of the repetition in the summary:

  ${summary}
  `
}


router.get('/', async (req, res) => {
  try {
    res.status(200).json({summary: summary});
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
});




router.post('/', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return sendErrorResponse(res, "URL is missing from the request body.", 400);
  }

  try {
    const completion = await generateResponse(url);
    //console.log(completion)
    
    if (completion) {
      res.status(200).json({summary: completion});
    } else {
      sendErrorResponse(res, "API response is missing expected data.");
    }

  } catch (error) {
    sendErrorResponse(res, error.message);
  }
});




module.exports = router;
