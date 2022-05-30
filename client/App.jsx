import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Board from './containers/Board';
import About from './containers/About';
import Create from './containers/Create';
import NotFound from './containers/NotFound';
import Posts from './components/Posts';
import Post from './components/Post';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            postColor: 'lavender',
            isLoading: false,
            error: null,
            // isUpdated: false,
        }
        this.changePostColor = this.changePostColor.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.addNewPost = this.addNewPost.bind(this);
        this.updatePost = this.updatePost.bind(this);
    }

    componentDidMount() {
      this.fetchData();
    }

    changePostColor(newColor) {
      this.setState({
        ... this.state,
        postColor: newColor
      })
    }

    // fetches all posts to display and pass down to Board after this component mounts 
    fetchData() {
      this.setState({ isLoading: true });
      fetch("/api")
        .then(res => {
          if (res.ok) return res.json();
          else throw new Error('Could not gather data...');
        })
        .then(res => {
          this.setState({
              posts: res,
              isLoading: false 
          });
        })
        .catch(error => {
          this.setState({ error, isLoading: false });
          console.log({error});
        })
    }

    // fetches a DELETE request (postID is sent via Posts when user clicks 'X' on a specific post to delete)
    deletePost(postID) {
      fetch(`/api/${postID}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
      })
        .then(res => {
          if (!res.ok) throw new Error('Could not gather data...');
        })
        .then(() => {
          const currPosts = [ ... this.state.posts]; 
          const updatedPosts = currPosts.filter(post => post['_id'] !== postID);
          this.setState(
            { ... this.state,
              posts: updatedPosts
            })
        })
        .catch(err => console.log(`${err}`))
    }

    addNewPost(newPost) {
      const newPosts = [ ... this.state.posts];
      newPosts.unshift(newPost);
      this.setState({ 
        ... this.state,
        posts: newPosts
      })
    }

    updatePost(updatedPost, id) {
      const newPosts = [ ... this.state.posts];
      const i = newPosts.findIndex(post => post._id === id);
      newPosts.splice(i, 1, updatedPost);
      this.setState({
        ... this.state, 
        posts: newPosts,
        // isUpdated: true,
      })
    }

    render() {
        const { posts, postColor, isLoading, error } = this.state;
        if (error) {
          return <p>{error.message}</p>;
        }     
        if (isLoading) {
          return <div className="notFound">Loading...</div>
        }
        const postList = [];
        for (let i = 0; i < posts?.length; i++) {
            postList.push(<Posts key={`Post ${i}`} postColor={postColor} id={posts[i]._id} title={posts[i].title} content={posts[i].content} deletePost={this.deletePost}/>);
        }

        return (
            <Router>
              <Routes>
                <Route exact path="/" element={<Board posts={postList} />} />
                <Route exact path="/theme" element={<About changePostColor={this.changePostColor}/>} />
                <Route exact path="/create" element={<Create addNewPost={this.addNewPost}/>} />
                <Route path="/:id" element={<Post updatePost={this.updatePost} postColor={this.state.postColor} /*isUpdated={this.state.isUpdated}*/ />} />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </Router>
        )
    }
};

export default App; 