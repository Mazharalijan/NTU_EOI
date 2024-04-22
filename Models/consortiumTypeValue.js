const Sequelize  = require("sequelize");
const sequelize = require("../Database/config");
const ConsortiumType = require("./consortiumType");
// const Partner = require("./partner");



const ConsortiumTypeValue = sequelize.define('consortium_type_values', {
    consortium_type_value_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    consortium_type_value: {
        type: Sequelize.STRING,
        allowNull: false
    },
  
    status: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["EOI", "Proposal"]
    },
});

ConsortiumTypeValue.belongsTo(ConsortiumType,{
    foreignKey:'fk_consortiumtype_id', as:'consortiumtypes'
})
// ConsortiumTypeValue.belongsTo(Partner,{
//     foreignKey:'fk_partner_id', as:'partners'
// })



module.exports = ConsortiumTypeValue;
