const Models = require('./storyModels');

const postController = {};

// get all posts
postController.getAllPosts = (req, res, next) => {
  Models.Post.find({})
    .sort({_id: -1})
    .then(posts => {
      res.locals.allPosts = posts; 
      return next();
    })
    .catch(err => { 
      return next({
        log: `ERROR: postController.getAllPosts: ${err}`,
        message: 'Error found in GET request to posts. Check server logs',
      })
    })
}

// get single post
postController.getPost = (req, res, next) => {
  const postID = req.params.id;
  Models.Post.findOne({ _id: postID})
    .then( post => {
      res.locals.post = post; 
      return next();
    })
    .catch( err => { 
      return next({
        log: `ERROR: postController.getPost: ${err}`,
        message: 'Error found in GET request to post. Check server logs',
      })
    })
}

// create post
postController.createPost = (req, res, next) => {
  const { title, content } = req.body; 
  const newPost = {
    title: title,
    content: content
  }
  Models.Post.create(newPost, (err, post) => {
    if (err) {
      return next({
        log: `ERROR: postController.createPost: ${err}`,
        message: 'Error in POST request creating new post. Check server logs' 
      })
    }
    res.locals.newPost = post;
    return next();
  })
}

// delete post
postController.deletePost = (req, res, next) => {
  const postID = req.params.id;
  Models.Post.deleteOne({ _id: postID }, (err) => {
    if (err) {
      return next({
        log: `ERROR: postController.deletePost: ${err}`,
        message: 'Error in DELETE request deleting post. Check server logs' 
      })
    }
    return next();
  })
}

// update post
postController.updatePost = (req, res, next) => {
  const { _id, title, content } = req.body; 
  if (title.length === 0 || content.length === 0) {
    return next({
      log: `ERROR: postController.updatePost: Invalid or missing input fields`,
      message: 'Invalid or missing input fields'
    })
  }
  const body = {
    _id: _id,
    title: title, 
    content: content
  }
  Models.Post.findOneAndUpdate({ _id: _id }, body, { new: true }, (err, post) => { 
    if (err) {
      return next({
        log: `ERROR: postController.updatePost: ${err}`,
        message: 'Error in PATCH request updating post. Check server logs' 
      })
    }
    res.locals.updatedPost = post;
    return next();
  })
}

module.exports = postController;