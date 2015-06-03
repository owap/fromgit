'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
    environments: [{
        name: {
            type: String,
            default: '',
            required: 'Please fill Environment name',
            trim: true
        },
        repos: [{
            url: {
                type: String,
                default: '',
                required: 'Please fill Repository URL',
                trim: true
            }
        }]
    }],
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