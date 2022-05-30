import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Posts(props) {

    const [color, setColor] = useState('white');

    const style = {
        "backgroundColor": color
    }
    
    return (
        <div className="post" style={style} onMouseEnter={() => setColor(`${props.postColor}`)} onMouseLeave={() => setColor('white')}>
            <div id="head">
                <div id="titleLink"><Link to={`/${props.id}`}>{props.title}</Link></div>
                <div id="remove"><button id="deleteButton" onClick={() => props.deletePost(props.id)}>X</button></div>
            </div>
            <div id="box">{props.content}</div>
        </div>
)};

export default Posts; 