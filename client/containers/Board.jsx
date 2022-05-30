import React from 'react';
import Navigation from '../components/Navigation';

const Board = (props) => (
    <>
        <Navigation />    
        <div className="board">{props.posts}</div>  
    </>
);

export default Board;