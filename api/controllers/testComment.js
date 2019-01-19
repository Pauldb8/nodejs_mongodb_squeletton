const mongoose = require("mongoose");
const TestComment = require("../models/testComment");

exports.test_comment_get_all = (req, res, next) => {
  TestComment.find()
    .select("comment _id")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        comment: docs.map(doc => {
          return {
            _id: doc._id,
            comment: doc.comment,
            request: {
              type: "GET",
              url: "http://api.wearemusicos.debuck.info:3000/test_comment/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.test_comment_create_comment = (req, res, next) => {
  console.log(req.body);
  const testComment = new TestComment({
    _id: new mongoose.Types.ObjectId(),
    comment: req.body.comment,
  });
  testComment
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created comment successfully",
        createdTestComment: {
          _id: result._id,
          comment: result.comment,
          request: {
            type: "GET",
            url: "http://api.wearemusicos.debuck.info:3000/test_comment/" + result._id 
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.test_comment_get_comment = (req, res, next) => {
  const id = req.params.testCommentId;
  TestComment.findById(id)
    .select("comment _id")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          test_comment: doc,
          request: {
            type: "GET",
            url: "http://api.wearemusicos.debuck.info:3000/test_comment"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
