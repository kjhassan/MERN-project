export const signup = async (req , res) => {
    try {
        const {fullname,username,password,confirmPassword,gender} = req.body;
    } catch (error) {
        
    }
};

export const login = (req , res) => {
    
    console.log("login User");
};

export const logout = (req , res) => {
    console.log("logout User");
};