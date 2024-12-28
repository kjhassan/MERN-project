import bcrypt from "bcryptjs";
import User from "../db_models/user.model.js";
import generateTokenandSetCookies from "../token/generateToken.js";

export const signup = async (req , res) => {
    try {
        const {fullname,username,password,confirmPassword,gender} = req.body;

        if(password!==confirmPassword) {
            return res.status(400).json({error: "Passwords do not match"});
        }
        const user = await User.findOne({username});

        if(user) {
            return res.status(400).json({error: "Username already exists"});
        }

        //gonna hash the pass heree
        const salt = await bcrypt.genSalt(10);
        const hashedpass = await bcrypt.hash(password, salt);




        // the site from where i am managing the profile pics => http:avatar-placeholder.iran.liara.run/
        const encodedFullname = encodeURIComponent(fullname); // Encode to handle spaces and special characters
        const profilePic = `https://avatar.iran.liara.run/username?username=${encodedFullname}`;


        const newUser = new User({
            fullname,
            username, 
            password: hashedpass, 
            gender,
            profilePic
        });

        if(newUser){

            generateTokenandSetCookies(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,             //_id is a feild in mongodb
                username: newUser.username,
                fullname: newUser.fullname,
                profilePic: newUser.profilePic
            });
        }else{
            res.status(400).json({error: "invalid user data"});
        }

        

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
        
};

export const login = async (req , res) => {
    
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		generateTokenandSetCookies(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullName: user.fullname,
			username: user.username,
			profilePic: user.profilePic,
		});

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    
    }
};

export const logout = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};