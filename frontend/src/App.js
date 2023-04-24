import React, { useState, useEffect } from 'react';
import NewUrl from './Components/NewUrl/NewUrl';
import TypingEffect from './Components/TypingEffect/TypingEffect';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';

function App() {

  const [summary, setSummary] = useState("");
  const [displayedText, setDisplayedText] = useState('');
  const [reset, setReset] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setDisplayedText(summary);
  }, [summary]);
  
  const addNewUrlHandler = async newUrl => {
    try {
      setDisplayedText('Loading...');
      setError(null); // Reset error state
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
      else {
        setError('Backend is not connected. Please try again later.');
      }
    } catch (err) {
      console.log(err);
      setError('Backend is not connected. Please try again later.');
    }
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} className="text-center mb-4">
          <h1>Video Summarizer</h1>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <NewUrl onAddUrl={addNewUrlHandler} />
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md={{ span: 8, offset: 2 }} className="summary-show">
          <TypingEffect
            text={displayedText}
            typingSpeed={45}
            blinkingCursor
            reset={reset}
          />
          {error && <div className="error-message">{error}</div>}
        </Col>
      </Row>
    </Container>
  );

  
}

export default App;
