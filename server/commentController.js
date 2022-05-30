const Models = require('./storyModels');

const commentController = {};

// get all comments
commentController.getAllComments = (req, res, next) => {
  Models.Comment.find({})
    .sort({_id: 1})
    .then(comments  => {
      res.locals.allComments = comments; 
      return next();
    })
    .catch(err => { 
      return next({
        log: `ERROR: commentController.getAllComments: ${err}`,
        message: 'Error found in GET request to comments. Check server logs',
      })
    })
}

// add comment - req body will take format: { comment: 'my comment', post: '{post id}' }
commentController.addComment = (req, res, next) => {
  const { comment, post } = req.body; 
  const body = {
    comment: comment,
    post: post
  }
  res.locals.postID = post;
  Models.Comment.create(body, (err, newComment) => {
    if (err) {
      return next({
        log: `ERROR: commentController.addComment: ${err}`,
        message: 'Error in POST request adding new comment. Check server logs' 
      })
    }
    res.locals.newComment = newComment;
    return next();
  })  
}

commentController.updatePost = (req, res, next) => {
  Models.Post.updateOne({ _id: res.locals.postID }, { $addToSet: {comments: [ res.locals.newComment ]}}, (err) => {
    if (err) {
      return next({
        log: `ERROR: commentController.updatePost: ${err}`,
        message: 'Error in POST request adding new comment. Check server logs' 
      })
    }
    return next();
  })
}

// delete comment
commentController.deleteComment = (req, res, next) => {
  const postID = req.params.id;
  const commentID = req.params.id2; 
  Models.Comment.deleteOne({ _id: commentID }, (err) => {
      if (err) {
        return next({
          log: `ERROR: commentController.deleteComment: ${err}`,
          message: 'Error in DELETE request deleting comment. Check server logs' 
        })
      }
      Models.Post.updateOne({ _id: postID }, { $pull: {comments: { _id: commentID }}}, (err) => {
        if (err) {
          return next({
            log: `ERROR: commentController.deleteComment: ${err}`,
            message: 'Error in DELETE request deleting new comment. Check server logs' 
          })
        }
        return next();
      })
    })
}

module.exports = commentController;