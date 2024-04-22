const Sequelize = require("sequelize");
const sequelize = require("../Database/config");

const ProjectType = sequelize.define('project_type',{
    project_type_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    project_type_name:{
        type:Sequelize.STRING,
        allowNull:false
    }
});



module.exports = ProjectType;