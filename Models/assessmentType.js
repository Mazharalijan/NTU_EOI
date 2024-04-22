const Sequelize = require("sequelize");
const sequelize = require("../Database/config");
const AssessmentType = sequelize.define('assessment_types',{
    assessment_type_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    assessment_type:{
        type:Sequelize.STRING,
        allowNull:false
    },
    assessment_type_values:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:5
    }
});

module.exports = AssessmentType;