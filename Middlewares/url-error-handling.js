

const urlError = async (req,res,next) =>{
   
    res.status(500).send("Oops, Something went wrong!, please check your url");
   
    
}

module.exports = urlError;