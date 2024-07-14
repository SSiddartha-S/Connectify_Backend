import jwt from "jsonwebtoken";
export const verifyToken = async(req,res,next) => {
    try {
        let token = req.header("Authorization");
        //  extracts authorization from header

        if (!token) {
            return res.status(403).send("Access Denied");

        }

        if (token.startsWith("Bearer ")){
            token = token.slice(7,token.length).trimleft();
            // here if token starts with bearer token it removes bearer using
            //  slice and trimleft ,7 for berarer . index with space 
            //  here the token will be after the space so the bearer  is deleted for token

        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
        // function callings
        
    } catch(err) {
        res.status(500).json({error: err.message})
    }
   

};