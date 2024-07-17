const mongoose = require('mongoose');
const candidateSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    party : {
        type : String,
        required : true,
    },
    age : {
        type : Number,
        required : true,
    },
    constituency : {
        type : String,
        required : true,
    },
    votes : [
        {
            voters : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "User",
                required : true,
            },
            votedAt : {
                type : Date,
                default : Date.now(),
            }
        }
    ],
    voteCount : {
        type : Number,
        default : 0,
    },
});

const Candidate = mongoose.model('Candidates',candidateSchema);

module.exports = Candidate;