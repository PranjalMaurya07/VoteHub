const User = require('../models/user');
const Candidate = require('../models/candidates');
const bcrypt = require('bcryptjs');

async function registrationPage(req,res){
    return res.render('registrationPage');
}

async function registerVoter(req,res){
    try{
        const user = new User({
            name : req.body.name,
            age : req.body.age,
            constituency : req.body.constituency,
            aadharCardNumber : req.body.aadharCardNumber,
            role : req.body.role,
            password : req.body.password,
        })
        // const token = await user.generateAuthTokens();
        // res.cookie('jwt',token);
        await user.save();
        return res.render('loginPage');
    }
    catch(err){
        return res.status(400).send(err);
    }
}

async function loginPage(req,res){
    return res.render('loginPage');
}

async function loginVoter(req,res){
    try{
        const aadharCardNumber = req.body.aadharCardNumber;
    const password = req.body.password;
    const constituency = req.body.constituency;
    const userAadharNumber = await User.findOne({aadharCardNumber : aadharCardNumber});
    const candidates = await Candidate.find({constituency : constituency});

    if(!userAadharNumber){
        return res.status(400).send('Invalid Credentials');
    }
    else{
        const isMatch = await bcrypt.compare(password,userAadharNumber.password);
        if(isMatch){
            const token = await userAadharNumber.generateAuthTokens();
            res.cookie('jwt',token);
            const candidateList = candidates.map((data)=>{
                return {
                    Candidate_Name : data.name,
                    Age : data.age,
                    Party : data.party,
                    Constituency : data.constituency,
                }
            });
            return res.json(candidateList);
        }
        else{
            console.log(password);
            console.log('Invalid Credentials');
        }
    }
    }
    catch(err){
        return res.send(err);
    }
}

async function passwordChangePage(req,res){
    return res.render('changePassword');
}

async function changePassword(req,res){
    try{
        const newPassword = req.body.newpassword;
        req.user.password = newPassword;
        await req.user.save();
        return res.send('Password changed successfully');
    }
    catch(err){
        return res.status(400).send('Try again');
    }
}

async function logout(req,res){
    try{
        req.user.tokens = [];
        res.clearCookie('jwt');
        await req.user.save();
        console.log('Logout successfully');
        return res.render('loginPage');
    }
    catch(e){
        res.status(401).send(e);
    }
}

async function candidatePage(req,res){
    return res.render('candidateHomepage');
}

const checkForAdmin = (role) => {
    try{
        if(role === 'admin'){
            return true;
        }
        return false;
    }
    catch(err){
        console.log(err);
    }
}

async function addCandidates(req,res){
    try{
        if(!checkForAdmin(req.user.role)){
            return res.status(400).send('You are not an admin');
        }
        const candidate = new Candidate({
            name : req.body.name,
            party : req.body.party,
            age : req.body.age,
            constituency : req.body.constituency,
        })
        await candidate.save();
        return res.json({
            'Candidate Name' : candidate.name,
            'Party' : candidate.party,
            'Age' : candidate.age,
            'Constituency' : candidate.constituency,
        });
    }
    catch(err){
        return res.status(400).send(err);
    }
}   

async function vote(req,res){
    return res.render('vote');
}

async function castVote(req,res){
    try{
    const voter = req.user;
    const constituency = voter.constituency;
    const party = req.body.party;

    const queryObject = {};
    queryObject.constituency = constituency;
    queryObject.party = party;

    const candidate = await Candidate.findOne(queryObject);

    if(!candidate){
        return res.status(404).json({ message: 'Candidate not found' });
    }
    if(voter.role == 'admin'){
        return res.status(403).json({ message: 'Admin is not allowed to vote'});
    }
    if(voter.isVoted){
        return res.status(400).json({ message: 'You have already voted' });
    }

    // Update the Candidate document to record the vote

    candidate.votes?.push({voters: voter.id})
    candidate.voteCount++;

    await candidate.save();

    // update the user document

    voter.isVoted = true;
    await voter.save();

    return res.status(200).json({ message: 'Your vote is casted successfully' });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal Server Error'});
    }
}

async function voteCount(req,res){
    return res.render('voteCount');
}

async function countVote(req,res){
    try{
        const constituency = req.body.constituency;
        const candidates = await Candidate.find({constituency : constituency});
        const candidateList = candidates.map((data)=>{
        return {
            Candidate_Name : data.name,
            Party : data.party,
            Votes : data.voteCount,
        }
        });
        return res.json(candidateList);
    }
    catch(err){
        return res.send(err);
    }

}

module.exports = {
    registrationPage,
    registerVoter,
    loginPage,
    loginVoter,
    passwordChangePage,
    changePassword,
    logout,
    candidatePage,
    addCandidates,
    vote,
    castVote,
    voteCount,
    countVote,
}