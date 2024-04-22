const Sequelize = require("sequelize");
const sequelize = require("../Database/config");


const AssessmentTypeValue = require("./assessmentTypeValue");
const ConsortiumTypeValue = require("./consortiumTypeValue");
const PartnerRelationship = require("./partnerRelationship");
const PartnerEvaluationValue = require("./partnerEvaluationValue");
const Country = require("./country")
const Sector = require("./sector")
const ProjectType = require("./projectType")

const ExpressOfIntrest = sequelize.define('expressofintrests',{
    eoi_id : {
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    eoi_no: {
        type:Sequelize.STRING,
        allowNull:false,

    },
    submission_deadline:{
        type:Sequelize.DATE,
        allowNull:false
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
    person_in_charge:{
        type:Sequelize.STRING,
        allowNull:true
    }, //currently person_in_charge it is string but maybe it will be change to forign key
    //hasOne relations key starts from here

    // lead partner id goes here as forign key later
    // hasOne Relations keys end here
    eoi_status:{
        type:Sequelize.ENUM,
        values:['Submitted','Cancelled','Shortlist'],
        defaultValue:'Submitted',
        allowNull:false
    }
    // EUID and UUID for logs will be here later
});

ExpressOfIntrest.hasMany(AssessmentTypeValue,{
    foreignKey:'fk_eoi_id',
    as:'assessment'
});
// ExpressOfIntrest.hasMany(ConsortiumTypeValue,{
//     foreignKey:'fk_eoi_id',
//     as:'consortiums'
// });
ExpressOfIntrest.hasMany(PartnerRelationship,{
    foreignKey:'fk_eoi_id',
    as:'Relpartners'
});
ExpressOfIntrest.hasMany(PartnerEvaluationValue,{
    foreignKey:'fk_eoi_id'
});
ExpressOfIntrest.belongsTo(Country, { foreignKey: 'fk_country_id', as: 'country' });
ExpressOfIntrest.belongsTo(Sector, { foreignKey: 'fk_sector_id', as: 'sector' });
ExpressOfIntrest.belongsTo(ProjectType, { foreignKey: 'fk_projecttype_id', as: 'projecttype' });



//Relations end here

module.exports = ExpressOfIntrest;