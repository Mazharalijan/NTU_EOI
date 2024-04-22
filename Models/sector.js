const Sequelize = require("sequelize");
const sequelize = require("../Database/config");
// const ExpressOfIntrest = require("./expressOfIntrest");
// const Proposal = require("./proposal");

const Sector = sequelize.define('sectors',{
    sector_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    sector_name:{
        type:Sequelize.STRING,
        allowNull:false
    }
});
// Sector.hasOne(ExpressOfIntrest,{
//     foreignKey:'fk_sector_id'
// });
// Sector.hasOne(Proposal,{
//     foreignKey:'fk_sector_id'
// });
module.exports = Sector;