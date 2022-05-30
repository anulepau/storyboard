const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://anulepau:codesmith22@cluster0.jtvcb.mongodb.net/storyboard?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
  // options for the connect method to parse the URI
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // sets the name of the DB that our collections are part of
  dbName: 'storyboard'
})
  .then(() => console.log('Connected to Mongo DB.'))
  .catch(err => console.log(err));

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  comment: { type: String, required: true },
  post: { 
    type: Schema.Types.ObjectId, 
    ref: 'Post',
    required: true
  } 
});

const Comment = mongoose.model('Comment', commentSchema);

const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  comments: [
    { comment: String, 
      id: {  
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    }
  ]
});

const Post = mongoose.model('Post', postSchema);

module.exports = { Post, Comment };