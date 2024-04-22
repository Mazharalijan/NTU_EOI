const jwt = require("jsonwebtoken");

const secretKey = "login_token";

const userData = {
    id:1,
    name:"Mazhar",
    email:"email@gmail.com",
    role: "admin",
    projectName:"ntu_proposal",
    permissions:"all"
}

const login =async (req, res) => {
    try{
        const token =  jwt.sign(userData,secretKey);
        if(!token) return res.status(500).send({'message' : 'token not generated!','status' : false})

        res.status(200).send({'token' : token,'message' : 'token generated', 'status' : true});

    }catch(error){
        console.log("token generation error")
        res.status(500).send({
            'message' : "Internal server error",
            'status' : 500,

    })
    }
}


module.exports = {
    login,
}
