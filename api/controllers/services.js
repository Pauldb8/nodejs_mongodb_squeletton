const mongoose = require("mongoose");
const Service = require("../models/service");

exports.services_get_all = (req, res, next) => {
  Service.find()
    .select("title description price image lat lng rating category _id")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        services: docs.map(doc => {
          return {
            title: doc.title,
            description: doc.description,
            price: doc.price,
            image: doc.image,
            lat: doc.lat, 
            lnt: doc.lng,
            rating: doc.rating,
            category: doc.category,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/services/" + doc._id
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

exports.services_create_service = (req, res, next) => {
  console.log(req.body);
  const service = new Service({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    image: req.file.path,
    lat: req.body.lat,
    lnt: req.body.lng,
    rating: req.body.rating,
    category: req.body.category,
  });
  service
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created service successfully",
        createdService: {
          _id: result._id,
          title: result.title,
          description: result.description,
          price: result.price,
          image: result.image,
          lat: result.lat,
          lnt: result.lng,
          rating: result.rating,
          category: result.category,
          request: {
            type: "GET",
            url: "http://localhost:3000/services/" + result._id
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

exports.services_get_service = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/products"
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

exports.services_update_service = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id
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

exports.services_delete = (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/services",
          body: { name: "String", price: "Number" }
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
