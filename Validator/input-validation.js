const Joi = require("joi");


const registerProposalValidation = (data) => {

    const schema = Joi.object({
        proposal_no : Joi.string().required(),
        submission_deadline:Joi.date().required(),
        refrence_no:Joi.string().alphanum().required(),
        project_name:Joi.string().required().trim(),
        amount:Joi.number().required(),
        currency:Joi.string().required(),
        date_of_award:Joi.date().required(),
        offer_validaty:Joi.date().required(),
        score:Joi.number(),
        
    });
    const valid = schema.validate(data);
    return valid;
}
const registerEoiValidation = (data) => {
    const schema = Joi.object({
        eoi_no : Joi.string().required(),
        submission_deadline:Joi.date().required(),
        refrence_no:Joi.string().alphanum().required(),
        project_name:Joi.string().required().trim(),
        amount:Joi.number().required(),
        currency:Joi.string().required(),
       
        
    });
    const valid = schema.validate(data);
    return valid;
}

const registerCountryValidation = (data) => {

    const schema = Joi.object({
        country_name : Joi.string().required().trim()
    });
    const valid = schema.validate(data);

    return valid;
}
const registerAssessmentTypeValidation = (data) => {

    const schema = Joi.object({
        assessment_type : Joi.string().required().trim(),
        assessment_type_values : Joi.string().required().trim()
    });
    const valid = schema.validate(data);

    return valid;
}
const registerConsortiumTypeValidation = (data) => {

    const schema = Joi.object({
        consortium_type : Joi.string().required().trim(),
        consortium_type_values : Joi.string().required().trim()
    });
    const valid = schema.validate(data);

    return valid;
}
const paramsIdValidate = (data) => {
    const schema = Joi.object({
        id: Joi.number().required()
    });
    const valid = schema.validate(data);
   return valid;
}
const paramsStatusValidate = (data) => {
    const schema = Joi.object({
        status: Joi.string().required()
    });
    const valid = schema.validate(data);
   return valid;
}
const registerPartnerValidation = (data) => {
    const schema = Joi.object({
        partnerName: Joi.string().required()
    });
    const valid = schema.validate(data);
    return valid;
}
module.exports = {
    registerProposalValidation,
    registerEoiValidation,
    registerCountryValidation,
    registerAssessmentTypeValidation,
    registerConsortiumTypeValidation,
    paramsIdValidate,
    paramsStatusValidate,
    registerPartnerValidation
}