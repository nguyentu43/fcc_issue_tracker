/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const mongoose = require('mongoose');
const CONNECTION_STRING = process.env.DB;
const moment = require('moment');
mongoose.connect(CONNECTION_STRING);

const schema = mongoose.Schema({
  issue_title: {
    type: String,
    required: true
  }, 
  issue_text: {
    type: String,
    required: true
  }, 
  created_by: {
    type: Date,
    required: true
  },
  project: {
    type: String,
    required: true
  },
  assigned_to: String,
  status_text: String,
  open: {
    type: Boolean,
    default: true
  },
  update_on: Date
},{
  versionKey: false
});

schema.pre('save', function(){
  this.update_on = moment().format("YYYY-MM-DD HH:mm:ss");
});

schema.methods.toJSON = function(){
  const obj = this.toObject();
  delete obj.project_name;
  return obj;
}

const Issue = mongoose.model('Issue', schema);

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      
    })
    
    .post(function (req, res, next){
      var project = req.params.project;
      const issue = new Issue({
        ...req.body,
        project
      });
    
      issue.save(function(err, issue){
        if(err) return next(err);
        res.json(issue.toJSON());
      });
    
    })
    
    .put(function (req, res, next){
      var project = req.params.project;
      const _id = req.body._id;
      Issue.findOne({ _id, project }, function(err, issue){
        if(err) return next(err);
        if(!issue) return next(new Error('issue not found'));
        
      });
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });
    
};
