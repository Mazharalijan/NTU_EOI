const Sequelize = require("sequelize");
const sequelize = require("../Database/config");
const PartnerEvaluationValue = require("./partnerEvaluationValue");

const PartnerEvaluationType = sequelize.define('partner_evaluation_types',{
    partner_evaluation_type_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    partner_evaluation_type:{
        type:Sequelize.STRING,
        allowNull:false
    }
});


PartnerEvaluationType.hasOne(PartnerEvaluationValue,{
    foreignKey:'fk_assessmenttype_id'
});

module.exports = PartnerEvaluationType;

