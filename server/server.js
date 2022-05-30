const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;
const postController = require('./postController.js');
const commentController = require('./commentController.js');

// HANDLE PARSING REQUEST BODY

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// COMMENT ROUTERS

app.delete('/api/:id/comments/:id2', commentController.deleteComment, (req, res) => {
  return res.sendStatus(200);
})

app.get('/api/:id/comments', commentController.getAllComments, (req, res) => {
  return res.status(200).json(res.locals.allComments);
})

app.post('/api/:id/comments', commentController.addComment, commentController.updatePost, (req, res) => {
  return res.status(200).json(res.locals.newComment);
})

// POST ROUTERS

app.get('/api/:id', postController.getPost, (req, res) => {
  return res.status(200).json(res.locals.post);
})

app.delete('/api/:id', postController.deletePost, (req, res) => {
  return res.sendStatus(200);
})

app.get('/api', postController.getAllPosts, (req, res) => {
  return res.status(200).json(res.locals.allPosts);
})

app.post('/api', postController.createPost, (req, res) => {
  return res.status(200).json(res.locals.newPost);
})

app.patch('/api', postController.updatePost, (req, res) => {
  return res.status(200).json(res.locals.updatedPost);
})

// WHEN NODE_ENV IN PRODUCTION 

if (process.env.NODE_ENV === 'production') {
  app.use('/build', express.static(path.join(__dirname, '../build')));
  app.use('*', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../build/index.html'));
  });
}

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});