import React, {useState} from "react";
import "./NewUrl.css";

const NewUrl = props => {
    const [enterText, setEnterText] = useState('');


    const textChangeHandler = event => {
        setEnterText(event.target.value);
    }


    const addUrlHandler = event => {
        event.preventDefault();
        if (enterText.trim().length === 0) {
            return;
        }
        props.onAddUrl(enterText);
        setEnterText('');
    }

    return (
        <div class="input-group mb-3">
            <input type="text" className="form-control" placeholder="Enter Youtube Video URL" value={enterText} onChange={textChangeHandler} aria-label="Videos URL" aria-describedby="button-addon2"></input>
            <button class="btn btn-outline-secondary" type="button" id="button-addon2" onClick={addUrlHandler}>Summarize!</button>
        </div>
    )
}

export default NewUrl;