const AssessmentType = require("../Models/assessmentType");
const AssessmentTypeValue = require("../Models/assessmentTypeValue");
const ConsortiumType = require("../Models/consortiumType");
const ConsortiumTypeValue = require("../Models/consortiumTypeValue");
const Country = require("../Models/country");
const ExpressOfIntrest = require("../Models/expressOfIntrest");
const Partner = require("../Models/partner");
const PartnerRelationship = require("../Models/partnerRelationship");
const ProjectType = require("../Models/projectType");
const Proposal = require("../Models/proposal");
const Sector = require("../Models/sector");
const {paramsIdValidate,paramsStatusValidate} = require("../Validator/input-validation")

const {registerProposalValidation} = require('../Validator/input-validation');

//get all proposals
const getAllProposals = async (req,res) => {
    try{
        const proposal = await Proposal.findAll({
            include:[
                {
                    model:Country,
                    as:"country",
                    attributes:['country_name']
                },
                {
                    model:Sector,
                    as:"sector",
                    attributes:['sector_name']
                },
                {
                    model:ProjectType,
                    as:"projecttype",
                    attributes:['project_type_name']
                },
                {
                    model:PartnerRelationship,
                    as:"Relpartners",
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
        }
        );
        if (!proposal) return res.status(404).send({"message":"Record not found","status":false})
        res.status(200).send({"data":proposal,"status":true,"message":"Record found"});

    }catch(error){
        console.log("proposal error ",error)
        res.status(500).send({"message":"Internal server error","status":false})
    }
}
// add new proposal
const addNewProposal = async (req,res) => {
    const {error} = registerProposalValidation(req.body);
    res.status(404).send(error.details[0].message);
    // if status of eoi is shortlisted then else not entered
    const eoi_status = ExpressOfIntrest.findOne({where:{[Op.and]: [
        { fk_eoi_id: req.body.eoi_id },
        { eoi_status: 'Shortlist' },

      ]
    }});

    let formData = {
        proposal_no : req.body.proposal_no,
        submission_deadline : req.body.submission_deadline,
        refrence_no:req.body.refrence_no,
        project_name:req.body.project_name,
        amount: req.body.amount,
        currency: req.body.currency,
        person_in_charge : req.body.person_in_charge,
        fk_country_id: req.body.country,
        fk_sector_id : req.body.sector,
        fk_projecttype_id : req.body.projecttype,
        fk_eoi_id:eoi_status  ,
        proposal_status:'submitted'
    }
    // partner relationship data from form recieved here
    let partners = req.body.partners && req.body.partners.map(index=>{
        return{
            fk_partner_id:index.patner,
            fk_proposal_id:'',
            fk_eoi_id:req.body.eoiId,
            relation_status:'Proposal',
        }
    })
    // consortium data from form recieved here
    let consortiumData = req.body.consortium && req.body.consortium.map(index => {
        return{
            consortium_type_value:index.consortium_type_value,
            fk_consortiumtype_id:index.fk_consortiumtype_id,
            fk_partner_id:index.fk_partner_id,
            fk_proposal_id:'',
            status:'Proposal'
        }
    });
    // Assessment data from form recieved here
    let AssessmentData = req.body.assessment && req.body.assessment.map(index => {
        return{
            assessment_type_values:index.assessment_type_values,
            fk_assessmenttype_id:index.fk_assessmenttype_id,
            fk_partner_id:index.fk_partner_id,
            fk_proposal_id:'',
            status:'Proposal'
        }
    });
    // try catch block start here to add data to database
    try{

        const insertProposal = await Proposal.create(formData);
        if(!insertProposal) return res.status(500).send({"message":"Record not inserted","status":false});
         
        // fetching the inserted record primary key
        const proposalId = insertProposal.proposal_id
        if(!proposalId) return res.status(500).send({"message":"Record not inserted","status":false});

        // adding primary key of eoi to partner relationship object
        for (const key in partners) {
            if (partners.hasOwnProperty(key) && typeof partners[key] === 'object') {
                partners[key].fk_proposal_id = proposalId;
            }
        }
        // adding primary key of eoi to assessment data object
        for (const key in AssessmentData) {
            if (AssessmentData.hasOwnProperty(key) && typeof AssessmentData[key] === 'object') {
                AssessmentData[key].fk_proposal_id = proposalId;
            }
        }
        // adding primary key of eoi to consortium data object
        for (const key in consortiumData) {
            if (consortiumData.hasOwnProperty(key) && typeof consortiumData[key] === 'object') {
                consortiumData[key].fk_proposal_id = proposalId;
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
        res.send({"data":{insertProposal,insertPartners,insertAssessment,inertConsortium},"message":"Record inserted","status":true})

    }catch(error){

        // if some internal error occure
        console.log("Problem in Proposal insertion",error)
        res.status(500).send({"message" :"Internal server error","status":false})
    }
}
// get single proposal
const getSingleProposal = async (req,res) => {
        try{
            const {error} = paramsIdValidate(req.params);
            if(error) return res.status(403).send(error.details[0]);
            const proposal_id = req.params.id;
            const proposal = await Proposal.findByPk(proposal_id,{
                include:[
                    {
                        model:Country,
                        as:"country",
                        attributes:['country_name']
                    },
                    {
                        model:Sector,
                        as:"sector",
                        attributes:['sector_name']
                    },
                    {
                        model:ProjectType,
                        as:"projecttype",
                        attributes:['project_type_name']
                    },
                    {
                        model:PartnerRelationship,
                        as:"Relpartners",
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
                ]
            });
            if (!proposal) return res.status(404).send({"message":"Record not found","status":false})
            res.status(200).send({"data":proposal,"status":true,"message":"Record found"});
    
        }catch(error){
            console.log("proposal error ",error)
            res.status(500).send({"message":"Internal server error","status":false})
        }
    }
//get single proposal by status
const getProposalByStatus = async (req,res) => {
    try{
        const {error} = paramsStatusValidate(req.params);
        if(error) return res.status(403).send(error.details[0]);
        const proposalStatus = req.params.status;
        const proposal = await Proposal.findOne({where:{proposal_status:proposalStatus}},{
            include:[
                {
                    model:Country,
                    as:"country",
                    attributes:['country_name']
                },
                {
                    model:Sector,
                    as:"sector",
                    attributes:['sector_name']
                },
                {
                    model:ProjectType,
                    as:"projecttype",
                    attributes:['project_type_name']
                },
                {
                    model:PartnerRelationship,
                    as:"Relpartners",
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
            ]
        });
        if (!proposal) return res.status(404).send({"message":"Record not found","status":false})
        res.status(200).send({"data":proposal,"status":true,"message":"Record found"});

    }catch(error){
        console.log("proposal error ",error)
        res.status(500).send({"message":"Internal server error","status":false})
    }
}
//update proposal status
const updateProposalStatus = async (req,res) => {
    try{
        const {error} = paramsIdValidate(req.params);
        if(error) return res.status(403).send(error.details[0]);
        const proposal_id = req.params.id;
        const proposal_status = req.body.status;
        const proposal = await Proposal.findByPk(proposal_id);
        if(!proposal) return res.status(404).json({"message":"Record not found","status":false})

        const updateProposal = await proposal.update({proposal_status:proposal_status});
        if(!updateProposal) return res.status(204).json({"message":"Status not updated","status":false})
        res.status(201).json({"data":updateProposal,"message":"Status updated","status":true})

    }catch(error){
        res.status(500).json({ "error": error, "message": "Internal server error","status":false });
    }
}



module.exports = {
    addNewProposal,
    getAllProposals,
    getSingleProposal,
    getProposalByStatus,
    updateProposalStatus
}