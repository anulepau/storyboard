import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from './Navigation';
import NotFound from '../containers/NotFound';
import Update from '../containers/Update';
import Comment from './Comment'


function withParams(Component) {
    return props => <Component {...props} params={useParams()} />;
}

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            postID: '',
            postTitle: '',
            postContent: '',
            postComments: [],
            commentIDs: [],
            commentField: '',
            isLoading: false,
            error: null,
            errorNotFound: null,
            toUpdate: false,
            toComment: false,
            // isUpdated: this.props.isUpdated
        }
        this.editPost = this.editPost.bind(this);
        this.addComment = this.addComment.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
    }

    componentDidMount() {
        let { id } = this.props.params;
        this.setState({ isLoading: true });
        fetch(`/api/${id}`)
          .then(res => {
            if (res.ok) return res.json();
          })
          .then(res => {
            const commentsArr = res.comments.map(el => el.comment);
            const commentIDArr = res.comments.map(el => el._id);
            this.setState({
                postID: res._id,
                postTitle: res.title,
                postContent: res.content,
                postComments: commentsArr,
                commentIDs: commentIDArr,
                isLoading: false,
            });
          })
          .catch(error => {
            this.setState({ errorNotFound: error, isLoading: false });
          })
    }

    editPost() {
        this.setState({ ...this.state, toUpdate: true });
    }

    addComment() {
        this.setState({ ...this.state, error: null, toComment: true });
    }

    handleInput(e) {
        const { id, value } = e.target; 
        this.setState({ [id] : value }); 
    }

    handleSubmit() {
        let { id } = this.props.params;
        const commentInfo = {
            comment: this.state.commentField,
            post: id 
        }

        fetch(`/api/${id}/comments`, {
            method: 'POST',
            body: JSON.stringify(commentInfo),
            headers: { 'Content-Type': 'application/json' },
        })
          .then(res => {
            if (res.ok) {
                return res.json();
            }
            else throw 'Invalid or missing input fields';
          })
          .then(res => {    
            const comment = res.comment;
            const updatedComments = [ ... this.state.postComments];
            updatedComments.push(comment);
            const commID = res._id;
            const updatedIDs = [ ... this.state.commentIDs];
            updatedIDs.push(commID);
            this.setState({ ... this.state, commentField: '', postComments: updatedComments, commentIDs: updatedIDs, errorMessage: null, toComment: false})
          })
          .catch(err => { 
            this.setState( { ... this.state, error: `${err}` })
          })
    }

    deleteComment(id) {
        fetch(`/api/${this.props.params.id}/comments/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
          .then(res => {
            if (!res.ok) throw new Error('Could not gather data...')
          })
          .then(() => {
            const commIDs = [ ... this.state.commentIDs];
            const updatedComments = [ ... this.state.postComments]; 
            // find index of deleted comment based on ID
            const index = commIDs.indexOf(id);  
            // remove comment and id at found index 
            updatedComments.splice(index, 1);
            commIDs.splice(index, 1);
            this.setState(
              { ... this.state,
                postComments: updatedComments,
                commentIDs: commIDs
              })
          })
          .catch(err => console.log(`${err}`))
    }

    render() {
        const { postID, postTitle, postContent, error, isLoading, errorNotFound, toUpdate, toComment } = this.state;
        if (errorNotFound) return <NotFound />;
        if (isLoading) {
          return <div className="notFound">Loading...</div>
        }
        if (toUpdate) {
            return <Update key={`Update ${postID}`} id={postID} title={postTitle} content={postContent} updatePost={this.props.updatePost}/>;
        }

        const comments = [];
        for (let i = 0; i < this.state.postComments?.length; i++) {
            comments.push(<Comment key={`Comment ${i}`} postColor={this.props.postColor} comment={this.state.postComments[i]} commentID={this.state.commentIDs[i]} deleteComment={this.deleteComment} />)
        }

        const reactPostContent = postContent.split('\n').map(str => <p>{str}</p>);

        return (
            <>
            <Navigation />              
            <div className="postPage">
            <div id="postTitle">{postTitle}</div>
            <div id="postContent">{reactPostContent}</div>
            <div id="postButtons">
            <button id="editButton" onClick={this.editPost}>edit post</button>    |    <button id="editButton" onClick={this.addComment}>add comment</button>
            </div>
            {toComment && 
                <>
                <div id="commentArea"><textarea id="commentField" rows="4" cols="20" value={this.state.commentField} onChange={this.handleInput}></textarea></div>
                <button className="field" id="submitButton" onClick={this.handleSubmit}>POST</button>
                {error && <div className="error"> {error} </div>}
                </>
            }
            <div id="allComments">{comments}</div>
            </div>
            </>
        )
    }
}

export default withParams(Post); 