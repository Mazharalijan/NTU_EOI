const Sequelize = require("sequelize");
const sequelize = require("../Database/config");
const AssessmentTypeValue = require("./assessmentTypeValue");
const ConsortiumTypeValue = require("./consortiumTypeValue");
// const ConsortiumTypeValue = require("./consortiumTypeValue");
// const AssessmentTypeValue = require("./assessmentTypeValue");
// const PartnerEvaluationValue = require("./partnerEvaluationValue");
// const PartnerRelationship = require("./partnerRelationship");

const Partner = sequelize.define('partners',{
    partner_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    partner_name:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

Partner.hasMany(AssessmentTypeValue,{
    foreignKey:'fk_partner_id',
    as:"assessment"

})
Partner.hasMany(ConsortiumTypeValue,{
    foreignKey:'fk_partner_id',
    as:"consortium"
});
// Partner.hasOne(PartnerEvaluationValue,{
//     foreignKey:'fk_partner_id'
// })
// Partner.hasOne(PartnerRelationship,{
//     foreignKey:'fk_partner_id',
//     as:'partners'
// })

module.exports = Partner;