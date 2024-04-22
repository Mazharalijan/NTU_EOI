const Sequelize = require("sequelize");
const sequelize = require("../Database/config");

const PartnerRelationship = require("./partnerRelationship");
const PartnerEvaluationValue = require("./partnerEvaluationValue");
const Country = require("./country");
const Sector = require("./sector");
const ProjectType = require("./projectType");


const Proposal = sequelize.define('proposal',{
    proposal_id : {
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    proposal_no: {
        type:Sequelize.STRING,
        allowNull:false,

    },
    submission_deadline:{
        type:Sequelize.DATE,
        allowNull:false,
    },
    refrence_no:{
        type:Sequelize.STRING,
        allowNull:false
    },
    project_name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    amount:{
        type:Sequelize.FLOAT,
        allowNull:false
    },
    currency:{
        type:Sequelize.STRING,
        allowNull:false
    },
    date_of_award:{
        type:Sequelize.DATE,
        allowNull:false
    },
    offer_validaty:{
        type:Sequelize.DATE,
        allowNull:false
    },
    score:{
        type:Sequelize.FLOAT,
        allowNull:false
    },
    quality_controll_methodolgy_flag:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    quality_Controll_proposal_flag:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    person_in_charge:{
        type:Sequelize.STRING,
        allowNull:true
    }, //currently person_in_charge it is string but maybe it will be change to forign key
    //hasOne relations key starts from here
   
    // lead partner id goes here as forign key later
    // hasOne Relations keys end here
    proposal_status:{
        type:Sequelize.ENUM,
        values:['Submitted','Cancelled','Shortlist'],
        defaultValue:'Submitted',
        allowNull:false
    }
    // EUID and UUID for logs will be here later
});

//Relation with country, sector, projecttype, models strats here
Proposal.belongsTo(Country,{foreignKey:'fk_country_id', as:"country"});
Proposal.belongsTo(Sector,{foreignKey:'fk_sector_id',as:'sector'});
Proposal.belongsTo(ProjectType,{foreignKey:'fk_projecttype_id',as:'projecttype'})

Proposal.hasMany(PartnerRelationship,{
    foreignKey:'fk_proposal_id',
    as:'Relpartners'
});
Proposal.hasMany(PartnerEvaluationValue,{
    foreignKey:'fk_proposal_id'
});
//Relations end here

module.exports = Proposal;