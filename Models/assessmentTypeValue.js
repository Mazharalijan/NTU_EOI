const Sequelize = require("sequelize");
const sequelize = require("../Database/config");
const AssessmentType = require("./assessmentType");





const AssessmentTypeValue = sequelize.define('assessment_type_values',{
    assessment_type_values_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    assessment_type_values:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
  
    status:{
        type:Sequelize.ENUM,
        allowNull:false,
        values:["EOI","Proposal"]
    },

});
AssessmentTypeValue.belongsTo(AssessmentType,{
    foreignKey:'fk_assessmenttype_id', as:'ass_type'
});

module.exports = AssessmentTypeValue;
