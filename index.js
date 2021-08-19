const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4xgzn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = "5000";

app.get("/", (req, res) => {
  res.send("Working Completely");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const posts = client.db("wsit").collection("posts");
  app.post("/addPost", (req, res) => {
    const post = req.body;
    posts.insertOne(post).then((result) => {});
  });
  app.get("/allPosts", (req, res) => {
    posts.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.patch("/addComment/:id", (req, res) => {
    posts
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $push: {
            comments: {
              id: Date.now(),
              name: req.body.name,
              photo: req.body.name,
              comment: req.body.comment,
            },
          },
        }
      )
      .then((result) => {
        res.send();
      });
  });
  app.put("/updateVote/:id", (req, res) => {
    posts
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: {
            upvote: req.body.upvote,
            downvote: req.body.downvote,
          },
        }
      )
      .then((result) => {
        res.send();
      })
      .catch((err) => {
        console.log(err);
      });
  });
  app.get("/comments/:id", (req, res) => {
    posts
      .findOne({ _id: ObjectId(req.params.id) })
      .then((result) => res.send(result.comments));
  });
});

app.listen(process.env.PORT || port);
