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
        <form className='new-url' onSubmit={addUrlHandler}>
            <textarea cols={50} rows={5} className='input' type="text" value={enterText} onChange={textChangeHandler}></textarea>
            <button type='submit'>Add Url</button>
        </form>
    )
}

export default NewUrl;