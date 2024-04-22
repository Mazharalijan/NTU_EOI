const ExpressOfIntrest = require("../Models/expressOfIntrest")
const Country = require("../Models/country.js");
const Sector = require("../Models/sector.js");
const ProjectType = require("../Models/projectType.js");
const PartnerRelationship = require("../Models/partnerRelationship.js");
const Partner = require("../Models/partner");
const AssessmentTypeValue = require("../Models/assessmentTypeValue.js");
const AssessmentType = require("../Models/assessmentType.js");
const ConsortiumTypeValue = require("../Models/consortiumTypeValue.js");
const ConsortiumType = require("../Models/consortiumType.js");
const { response } = require("express");
const {registerEoiValidation,paramsIdValidate,paramsStatusValidate} = require('../Validator/input-validation');


// EOI = ExpressOfIntreset

//insert eoi
const addEoi = async (req,res,next)=>{

    const {error} = registerEoiValidation(req.body);
    if(error || error.length != 0) return res.status(403).send(error.details[0].message)
    // form data of eoi recieved here
    let formData = {
        eoi_no : req.body.eoi_no,
        submission_deadline : req.body.submission_deadline,
        refrence_no:req.body.refrence_no,
        project_name:req.body.project_name,
        amount: req.body.amount,
        currency: req.body.currency,
        person_in_charge : req.body.person_in_charge,
        fk_country_id: req.body.country,
        fk_sector_id : req.body.sector,
        fk_projecttype_id : req.body.projecttype,
        eoi_status:'submitted'
    }
    // partner relationship data from form recieved here
    let partners = req.body.partners && req.body.partners.map(index=>{
        return{
            fk_partner_id:index.patner,
            fk_eoi_id:'',
            relation_status:'EOI',
        }
    })
    // consortium data from form recieved here
    let consortiumData = req.body.consortium && req.body.consortium.map(index => {
        return{
            consortium_type_value:index.consortium_type_value,
            fk_consortiumtype_id:index.fk_consortiumtype_id,
            fk_partner_id:index.fk_partner_id,
            fk_eoi_id:'',
            status:'EOI'
        }
    });
    // Assessment data from form recieved here
    let AssessmentData = req.body.assessment && req.body.assessment.map(index => {
        return{
            assessment_type_values:index.assessment_type_values,
            fk_assessmenttype_id:index.fk_assessmenttype_id,
            fk_partner_id:index.fk_partner_id,
            fk_eoi_id:'',
            status:'EOI'
        }
    });
    // try catch block start here to add data to database
    try{

        const insertEOI = await ExpressOfIntrest.create(formData);
        if(!insertEOI) return res.status(500).send({"message":"Record not inserted","status":false});
         
        // fetching the inserted record primary key
        const eoiId = insertEOI.eoi_id
        if(!eoiId) return res.status(500).send({"message":"Record not inserted","status":false});

        // adding primary key of eoi to partner relationship object
        for (const key in partners) {
            if (partners.hasOwnProperty(key) && typeof partners[key] === 'object') {
                partners[key].fk_eoi_id = eoiId;
            }
        }
        // adding primary key of eoi to assessment data object
        for (const key in AssessmentData) {
            if (AssessmentData.hasOwnProperty(key) && typeof AssessmentData[key] === 'object') {
                AssessmentData[key].fk_eoi_id = eoiId;
            }
        }
        // adding primary key of eoi to consortium data object
        for (const key in consortiumData) {
            if (consortiumData.hasOwnProperty(key) && typeof consortiumData[key] === 'object') {
                consortiumData[key].fk_eoi_id = eoiId;
            }
        }

        //partner relationship, assessment data, consortium data insert here to database
        const insertPartners = await PartnerRelationship.bulkCreate(partners);
        if(!insertPartners) return res.status(500).send({"message":"Record not inserted","status":false});
        const insertAssessment = await AssessmentTypeValue.bulkCreate(AssessmentData);
         if(!insertAssessment) return res.status(500).send({"message":"Record not inserted","status":false});
        const inertConsortium = await ConsortiumTypeValue.bulkCreate(consortiumData);
         if(!inertConsortium) return res.status(500).send({"message":"Record not inserted","status":false});

         // if record insert successfully
        res.send({"data":{insertEOI,insertPartners,insertAssessment,inertConsortium},"message":"Record inserted","status":true})

    }catch(error){

        // if some internal error occure
        console.log("Problem in EOI insertion",error)
        res.status(500).send({"message" :"Internal server error","status":false})
    }
    

}

//get all eoi api starts here
const getAllEoi = async(req,res)=>{
    try{
        const eoi = await ExpressOfIntrest.findAll({
            include: [{
                model: Country,
                as: 'country',
                attributes: ['country_name'],
              },
              {
                model: Sector,
                as: 'sector',
                attributes: ['sector_name'],
              },
              {
                model: ProjectType,
                as: 'projecttype',
                attributes: ['project_type_name'],
              },
              {
                model: PartnerRelationship,
                as: 'Relpartners',
                attributes:['relation_status'],
                include:[
                    {
                        model:Partner,
                        as:'partners',
                        attributes:['partner_name'],
                        include:[{
                            model:ConsortiumTypeValue,
                            as:'consortium',
                            attributes:['status','consortium_type_value'],
                            include:{
                                model:ConsortiumType,
                                as:'consortiumtypes',
                                attributes:['consortium_type']
                            }
                        },{
                            model: AssessmentTypeValue,
                            as:'assessment',
                            attributes:['status','assessment_type_values'],
                            include:{
                                model:AssessmentType,
                                as:'ass_type',
                                attributes:['assessment_type']
                            }
                        }
                    ]

                    }
                ]
              }
            ],
            order: [['product_id', 'DESC']]
        });
        // formating api response data starts here
        if(!eoi) return res.status(401).send({"message":"Record not found","status" : false})
            const formatedData = eoi.map(item=>{
        return {
            eoiID:item.eoi_id,
            eoiNo:item.eoi_no,
            referenceNo:item.refrence_no,
            projectName : item.project_name,
            amount:item.amount,
            currency:item.currency,
            country:item.country.country_name,
            sector:item.sector.sector_name,
            projectTypeName:item.projecttype.project_type_name,
            createdAt: new Date(item.createdAt).toLocaleString(),
            // formating partners relationships and their assessment and consortium starts here
            partners: item.Relpartners.map(record => {
                return {
                    partnerName:record.partners.partner_name,
                    relationStatus: record.relation_status,
                    Assessment: record.partners.assessment ? (record.partners.assessment.map(record2 =>{
                        return {
                            assessmentType: record2.ass_type.assessment_type,
                            assessmentValue : record2.assessment_type_values,
                            assessmentStatus : record2.status
                        }
                        
                    })) : ('No Record Exist!'),
                    consortium: record.partners.consortium ? (record.partners.consortium.map(record3 => {
                        return {
                            consortiumType: record3.consortiumtypes.consortium_type,
                            consortiumValue:record3.consortium_type_value,
                            consortiumStatus:record3.status
                        }
                    })) : ('No Record exist')
                }
               
            }),
            // formating partners relationships and their assessment and consortium end here
            // it consist array
            personInCharge:item.person_in_charge,
            eoiStatus:item.eoi_status,
            submissionDeadline:item.submission_deadline
        }
        })
        // formating api response data end here
        res.status(200).send({
             "data":formatedData,
             "message":"Record found!",
             "status" : true
            });

    }catch(error){
        //console.log("Problem in eoi retrieving" , error)
        res.status(500).send({
            "message" : "Some internal server error",
            "status" : false
        })
    }

}
//get all eoi api end here

//get eoi by id
const getOneEoi = async(req,res,next)=>{
    
    try{
        const {error} = paramsIdValidate(req.params);
        if(error) return res.status(403).send(error.details[0]);
        const eoiId = req.params.id;
        const eoi = await ExpressOfIntrest.findByPk(eoiId,{
            include: [{
                model: Country,
                as: 'country',
                attributes: ['country_name'],
              },
              {
                model: Sector,
                as: 'sector',
                attributes: ['sector_name'],
              },
              {
                model: ProjectType,
                as: 'projecttype',
                attributes: ['project_type_name'],
              },
              {
                model: PartnerRelationship,
                as: 'Relpartners',
                attributes:['relation_status'],
                include:[
                    {
                        model:Partner,
                        as:'partners',
                        attributes:['partner_name'],
                        include:[{
                            model:ConsortiumTypeValue,
                            as:'consortium',
                            attributes:['status','consortium_type_value'],
                            include:{
                                model:ConsortiumType,
                                as:'consortiumtypes',
                                attributes:['consortium_type']
                            }
                        },{
                            model: AssessmentTypeValue,
                            as:'assessment',
                            attributes:['status','assessment_type_values'],
                            include:{
                                model:AssessmentType,
                                as:'ass_type',
                                attributes:['assessment_type']
                            }
                        }
                    ]

                    }
                ]
              }
            ],
        });
        // formating api response data starts here
        if(!eoi) return res.status(401).send({"message":"Record not found","status" : false})
            const formatedData =  {
            eoiID:eoi.eoi_id,
            eoiNo:eoi.eoi_no,
            referenceNo:eoi.refrence_no,
            projectName : eoi.project_name,
            amount:eoi.amount,
            currency:eoi.currency,
            country:eoi.country.country_name,
            sector:eoi.sector.sector_name,
            projectTypeName:eoi.projecttype.project_type_name,
            createdAt: new Date(eoi.createdAt).toLocaleString(),
            // formating partners relationships and their assessment and consortium starts here
            partners: eoi.Relpartners.map(record => {
                return {
                    partnerName:record.partners.partner_name,
                    relationStatus: record.relation_status,
                    Assessment: record.partners.assessment ? (record.partners.assessment.map(record2 =>{
                        return {
                            assessmentType: record2.ass_type.assessment_type,
                            assessmentValue : record2.assessment_type_values,
                            assessmentStatus : record2.status
                        }
                        
                    })) : ('No Record Exist!'),
                    consortium: record.partners.consortium ? (record.partners.consortium.map(record3 => {
                        return {
                            consortiumType: record3.consortiumtypes.consortium_type,
                            consortiumValue:record3.consortium_type_value,
                            consortiumStatus:record3.status
                        }
                    })) : ('No Record exist')
                }
               
            }),
            // formating partners relationships and their assessment and consortium end here
            // it consist array
            personInCharge:eoi.person_in_charge,
            eoiStatus:eoi.eoi_status,
            submissionDeadline:eoi.submission_deadline
        }
        
        // formating api response data end here
        
        res.status(200).send({
             "data":formatedData,
             "message":"Record found!",
             "status" : true
            });

    }catch(error){
        
        res.status(500).send({
            "message" : "Some internal server error",
            "status" : false
        })
    }

}
//get eoi by status
const getStatusEoi = async (req,res) => {
    try{
    const {error} = paramsStatusValidate(req.params);
    if(error) return res.status(403).send(error.details[0])
    const eoiStatus = req.params.status;
    const eoi = await ExpressOfIntrest.findOne({where:{eoi_status:eoiStatus}});
    if(!eoi) return res.status(404).send({"data": null, "message":"No record found!", "status":false})
    res.status(200).send({"data":eoi, "message":"Record found","status":true})
    }catch(error){
        res.status(500).send({"message":"internal server error","status":false})
    }
}
const updateEoiStatus = async (req,res) => {
    try{
        const {error} = paramsIdValidate(req.params);
        if(error) return res.status(403).send(error.details[0]);
        const eoiId = req.params.id;
        const eoi_status = req.body.status;
        const eoi = await ExpressOfIntrest.findByPk(eoiId);
        if(!eoi) return res.status(404).json({"message":"Record not found","status":false})

        const updateEoi = await eoi.update({eoi_status:eoi_status});
        if(!updateEoi) return res.status(204).json({"message":"Status not updated","status":false})
        res.status(201).json({"data":updateEoi,"message":"Status updated","status":true})

    }catch(error){
        res.status(500).json({ "error": error, "message": "Internal server error","status":false });
    }
}


module.exports = {
    addEoi,
    getAllEoi,
    getOneEoi,
    getStatusEoi,
    updateEoiStatus
}