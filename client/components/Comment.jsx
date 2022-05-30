import React, { useState } from 'react';

const Comment = (props) => {

    const [color, setColor] = useState('white');

    const style = {
        "backgroundColor": color
    }

    return (
        <div id="eachComment" style={style} onMouseEnter={() => setColor(`${props.postColor}`)} onMouseLeave={() => setColor('white')}><button id="deleteButton" onClick={() => props.deleteComment(props.commentID)}>x</button>       {props.comment}</div>
    )
};

export default Comment;