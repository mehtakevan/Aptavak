const { use } = require('../Routes/userRoutes');
const { User } = require('../database/database.schema');
const generateToken = require('../config/generateToken');

const registerUser = (async (req,res) =>{
    console.log("In register User");
    const { name, email, password, pic } = req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please Enter all the Feilds");
    }

    const userExists = await User.findOne({ email });

    if(userExists){
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    console.log(" User created");

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token : generateToken(user._id),
        });
    }else{
        res.status(400);
        throw new Error("Failed to create a User");
    }
});

const authUser = (async (req,res) =>{
    console.log("In auth User");
    const { email, password} = req.body;
    
    const user = await User.findOne({ email });

    if(User && (await user.matchPassword(password))){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token : generateToken(user._id),
        });
    }else{
        res.status(400);
        //throw new Error("Invalid Email or Password");
    }
    
});

const allUsers = (async(req,res) =>{
    const keyword = req.query.search?{
        $or:[
            {name :{$regex : req.query.search,$options:"i"}},
            {email :{$regex : req.query.search,$options:"i"}},
        ]
    }
    :{};

    const users = await User.find(keyword).find({_id : {$ne : req.user._id} });
    res.send(users);
})

module.exports = {
    registerUser : registerUser,
    authUser : authUser,
    allUsers : allUsers
};