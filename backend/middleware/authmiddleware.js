const jwt = require('jsonwebtoken');
const { User } = require("../database/database.schema");


const protect = (async (req,res,next) =>{
    let token;

    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try{
            token = req.headers.authorization.split(" ")[1];

            //decodes the token
            const decoded = jwt.verify(token,process.env.JWT_SECRET);

            req.user = await User.findbyId(decoded.id).select("-password");

            next();
        }catch(error){
            res.status(401);
            throw new Error("Not authorized, No token");
        }
    }

    if(!token){
        res.statu(401);
        throw new Error("Not authorized, No token");
    }
})

module.exports ={
    protect : protect,
}