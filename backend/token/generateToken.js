import jwt from "jsonwebtoken";

const generateTokenandSetCookies = (userId, res) =>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn: "15d"
    });
    res.cookie("jwt",token,{
        maxAge: 15*24*60*60*1000, //in milisecs
        httpOnly: true,   //prevents xss attacks gurll basically the cross-site scripting attacks
        sameSite:"strict" //CSRF attacks
    });
};

export default generateTokenandSetCookies;