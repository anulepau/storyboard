import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = props => (
    <>
    <div id="header">S T O R Y B O A R D</div>
    <div className="nav">
        <Link to='/'><button id="button">dash</button></Link>
        <Link to='/create'><button id="button">create post</button></Link>
        <Link to='/theme'><button id="button">theme</button></Link>
    </div>
    </>
)

export default Navigation; 