const Sequelize = require("sequelize");
const sequelize = require("../Database/config");

// const ExpressOfIntrest = require("./expressOfIntrest");

const Country = sequelize.define('country',{
    country_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    country_name:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports = Country;