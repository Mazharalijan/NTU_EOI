const jwt = require("jsonwebtoken");
const secretKey = "login_token";



const auth = async (req, res,next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
         const decoded = jwt.verify(token,secretKey);
         if(decoded.projectName === 'ntu_proposal' && decoded.role === "admin" && decoded.permissions === 'all'){
           //console.log(decoded);
            next()
         }else{
          
            res.status(401).send({'message':"You have no permission to access this route","status":false})
         }
         
    
    }catch(error){
      
        res.status(401).send({'message':"token is invalid","status":false})
    }
}

module.exports = auth