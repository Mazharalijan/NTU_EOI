const sequelize = require("../Database/config")
// const Proposal = require("../Models/proposal");
// const ExpressOfIntrest = require("../Models/expressOfIntrest");
// const AssessmentType = require("../Models/assessmentType");
// const AssessmentTypeValue = require("../Models/assessmentTypeValue");
// const ConsortiumType = require("../Models/consortiumType");
// const ConsortiumTypeValue = require("../Models/consortiumTypeValue");
// const PartnerEvaluationType = require("../Models/partnerEvaluationType");
// const PartnerEvaluationValue = require("../Models/partnerEvaluationValue");
// const PartnerRelationship = require("../Models/partnerRelationship");
// const Country = require("../Models/country");
// const Sector = require("../Models/sector");
// const ProjectType = require("../Models/projectType");
// const Partner = require("../Models/partner");

sequelize
.sync({alter:true})
.then(result => {
console.log(result)
})
.catch(error => {
    console.log(error)
});