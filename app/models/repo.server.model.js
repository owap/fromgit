'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Repo Schema
 */
var RepoSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Repository name',
        trim: true
    },
    url: {
        type: String,
        default: '',
        required: 'Please fill Repository URL',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Repo', RepoSchema);
module.exports = RepoSchema;