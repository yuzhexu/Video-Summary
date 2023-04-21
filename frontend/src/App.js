
import React, { useState, useEffect } from 'react';
import NewUrl from './Components/NewUrl/NewUrl';
import Button from './Components/Button/Button';
import TypingEffect from './Components/TypingEffect/TypingEffect';
import './App.css';

function App() {

  const [summary, setSummary] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [reset, setReset] = useState(false);


  useEffect(() => {
    setDisplayedText(summary);
  }, [summary]);
  

  const addNewUrlHandler = async newUrl => {
    try {
      setDisplayedText('Loading...');
      const response = await fetch('http://localhost:5000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({url: newUrl})
      }); 
      if (response.ok)
      {
        setReset(!reset);
        const responseData = await response.json();
        setSummary(responseData.summary);
      }

      
    } catch (err) {
      console.log(err);
    }
  }



  return (
    <div className="App">
      <NewUrl onAddUrl = {addNewUrlHandler}></NewUrl>
      <div className='summary-show'>
        <TypingEffect text={displayedText} typingSpeed={45} blinkingCursor reset={reset}/>
      </div>

    </div>
  );
}

export default App;
