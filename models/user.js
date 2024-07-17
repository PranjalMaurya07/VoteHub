const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name : {
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
    aadharCardNumber : {
        type : Number,
        required : true,
        unique : true,
    },
    role : {
        type : String,
        enum : ["voter","admin"],
        default : "voter",
    },
    password : {
        type : String,
        required : true,
    },
    isVoted : {
        type : Boolean,
        default : false,
    },
    tokens : [{
        token : {
            type : String,
            required : true,
        },
    }],
});

userSchema.methods.generateAuthTokens = async function(){
    try {
        const tokenGenerated = jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token : tokenGenerated});
        await this.save();
        return tokenGenerated;
    }catch (error) {
        console.log('Error',error);
    }
  }

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        // this.aadharCardNumber = await bcrypt.hash(this.aadharCardNumber, 10);
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model('Users',userSchema);



module.exports = User;