'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    RepoSchema = mongoose.model('Repo');

/**
 * System Schema
 */
var SystemSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill System name',
        trim: true
    },
    repos: [RepoSchema],
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('System', SystemSchema);
module.exports = SystemSchema;