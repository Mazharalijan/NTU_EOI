const Sequelize = require("sequelize");
const sequelize = require("../Database/config");




const PartnerEvaluationValue = sequelize.define('partner_evaluation_values',{
    partner_evaluation_value_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    
    evaluation_score :{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    evaluation_from:{
        type:Sequelize.ENUM,
        allowNull:false,
        values:["EOI","Proposal"]
    },
   
    
});



module.exports = PartnerEvaluationValue;