const Country = require("../Models/country.js");
const ConsortiumType = require("../Models/consortiumType");
const AssessmentType = require("../Models/assessmentType");
const Partner = require("../Models/partner.js");
const {registerCountryValidation,registerPartnerValidation, registerAssessmentTypeValidation,registerConsortiumTypeValidation} = require('../Validator/input-validation')

// add country
const addCountry = async (req,res) => {
    try{
        const {error} = registerCountryValidation(req.body);
        if(error) return res.status(403).send(error.details[0].message)
        let data = {
            country_name : req.body.country_name
        }
        const country = await Country.create(data);
        if(!country) return res.status(500).send("Country not inserted1");
        res.status(201).send("Country inserted successfully!")
    }catch(error){
        console.log("Country not inserted",error)
        res.status(500).send("Internal server error")
    }
   
}

// get all countries
const getAllCountry = async (req,res) => {
    try{
        const countries = await Country.findAll({});
        if(countries.length === 0){
            return res.status(404).send("No countries found")
        }
        res.status(200).send(countries)

    }catch(error){
        console.log("Error in retrieving in countries", error)
    }
}
// add consortium type
const addConsortiumType = async (req,res) => {
   
    try{
        
    const {error} = registerConsortiumTypeValidation(req.body);
    if(error) return res.status(403).send(error.details[0].message)
    let data = {
        consortium_type : req.body.consortium_type,
        consortium_type_values:req.body.consortium_type_values.join(',')

    }
        const consortiumtype = await ConsortiumType.create(data);
        if(!consortiumtype) return res.status(500).send("Record not inserted!");
        res.status(201).send(consortiumtype);
    }catch(error){
        console.log("consortium type not inserted", error)
        res.status(500).send("Internal server error")
    }

}

// get all consortium type

const getAllConsortiumType = async (req, res) => {
    try {
        const consortiumtype = await ConsortiumType.findAll({
            attributes: {
                include: ["consortium_type_id", "consortium_type"],
                exclude: ["createdAt", "updatedAt"],
            },
        });

        if (consortiumtype.length === 0) {
            return res.status(404).send("Record not found!");
        }
        // formatted consortium type 
        const formattedConsortiumType = consortiumtype.map((item) => {
            return {
                consortium_type_id: item.consortium_type_id,
                consortium_type: item.consortium_type,
                //splite the consortium types values into array
                consortium_type_values: item.consortium_type_values.split(","),
            };
        });

        res.status(200).send(formattedConsortiumType);
    } catch (error) {
        console.log("Error in consortium type retrieving", error);
        res.status(500).send("Internal server error");
    }
}

// get assessment type

const getAllAssessmentTypes = async (req,res) => {
    try{
        const assessmenttype = await AssessmentType.findAll({});
        if(assessmenttype.length === 0) return res.status(404).send({"message":"Record not found!","status":false}) 
        res.status(200).send({"data":assessmenttype,"message":"record found!","status":false})

    }catch(error){
        console.log("Assessment types not retrieving ", error)
        res.status(500).send({"message" : "Internal server error", "status" : false})
    }
}
// add assessment type

const addAssessmentType = async (req,res) => {
    try{
        const {error} = registerAssessmentTypeValidation(req.body);
        if(error) return res.status(403).send(error.details[0].message)
        let data = {
            assessment_type : req.body.assessment_type,
            assessment_type_values : req.body.assessment_type_values
        }
        const assessmenttype = await AssessmentType.create(data);
        if(!assessmenttype) return res.status(500).send({"message":"Record not inserted!","status":false})
        res.status(201).send({"data":assessmenttype,"message" : "Record inserted!","status":true})


    }catch(error){
        console.log("Record not inerting some internal error",error)
        res.status(500).send({"message":"some internal error","status":false})
    }
}
// get all partners
const getAllPartners = async (req,res)=> {
    try{
    const partners = await Partner.findAll();
    if(!partners) return res.status(404).send({"message":"Record not found", "status":false})
    res.status(200).send({"data":partners,"message":"Record found","status":true});
    }catch(error){
        res.status(500).send({"message":"Internal server error","status":false,"error":error})
    }

}
// add partners
const addPartner = async (req,res) => {
    const { error } = registerPartnerValidation(req.body);
    if (error) return res.status(403).json({"error":error.details[0].message})
    let data = {
            partner_name : req.body.partnerName
        }

        try{

            const partner = await Partner.create(data);
            if(!partner) return res.status(403).json({"message":"Record not inserted", status:false})
            res.status(201).json({"partner":partner,"message":"Record inserted", status:true})


        }catch(error){
            res.status(500).json({"message":"Internal server error", status : false})
        }
}



module.exports = {
    addCountry,
    getAllCountry,
    addConsortiumType,
    getAllConsortiumType,
    getAllAssessmentTypes,
    addAssessmentType,
    getAllPartners,
    addPartner
}


