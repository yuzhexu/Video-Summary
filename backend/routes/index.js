var express = require('express');
var router = express.Router();
const rootDir = require('../util/path');
const path = require('path');
const PythonPath = path.join(rootDir, 'python', 'main.py')
let {PythonShell} = require('python-shell')
const { json } = require("express");
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);




const generateResponse = async (url) => {
  // const caption = `
  //   It’s been nine years since Laquan McDonald was killed by police in Chicago, shot in the back while walking away. It’s been seven years since Philando Castile was killed by police in the Minneapolis suburbs, shot while his empty hands were raised during a questionable traffic stop. And it’s been four years since Jacob Harris was killed by police in Phoenix, seconds after he emerged from a car, his back turned. You’ve likely heard less about Harris’ death than you have McDonald’s and Castile’s, but Meg O’Connor’s thorough investigation makes clear that you won’t forget it. The gross miscarriages of justice are plentiful: the circumstances of Harris’ killing and the shifting police statements around it; the money and valuables police took from Harris’ father’s home before informing him his son was dead; the fact that Harris’ friends are currently serving decades-long prison sentences for his death, while the officers who pulled the trigger (and unleashed an attack dog on his prone body) walk free. We’ve heard far, far too many names like McDonald’s and Castile’s and Harris’ over the past decade, and nothing makes me think we won’t continue to hear many more. That’s what makes this sort of journalism so necessary — not because it can bring these young men back to life, but because it makes brutally clear how unjust their deaths are, and how broken policing is.
  // `;
  var caption;

  var options = {
    mode: 'text',
    args: [url]
  };

  PythonShell.run(PythonPath, options, function (err, results) {
    if (err) 
    {
        console.log(err.message);
        next(err);
        throw err;
    }

    caption = JSON.parse(results[0]);
    caption = "abcd"
    console.log("caption:1 " + caption)
    console.log("caption: ")
  })


  
  console.log("caption: " + caption)
  // (async ()=>{
  //   const sub = await getSubtitles(url, { timingString: true });
  //   console.log(sub)
  // })()

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePrompt(caption),
    temperature: 0.6,
    max_tokens: 3000,
  });
  
  return completion;
}

function generatePrompt(caption) {
  return `Summarize the following text:
  ${caption}
  `
}

router.post('/', (req, res, next) => {
  const { url } = req.body;
  
  (async () => {
    const completion = await generateResponse(url);
    res.status(200).json(completion.data.choices[0].text)
  })()
});



module.exports = router;
