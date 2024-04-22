const Sequelize = require("sequelize");
const sequelize = require("../Database/config");
const Partner = require("./partner");


const PartnerRelationship = sequelize.define('partner_relationships',{
    partner_relationship_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },    
    relation_status :{
        type:Sequelize.ENUM,
        allowNull:false,
        values:['EOI','Proposal','Project']
    }
});

PartnerRelationship.belongsTo(Partner,{
    foreignKey:'fk_partner_id', as:'partners'
})

module.exports = PartnerRelationship;