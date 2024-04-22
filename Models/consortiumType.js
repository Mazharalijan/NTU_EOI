const Sequelize = require("sequelize");
const sequelize = require("../Database/config");
// const ConsortiumTypeValue = require("./consortiumTypeValue");

const ConsortiumType = sequelize.define('consortium_types',{
    consortium_type_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    consortium_type:{
        type:Sequelize.STRING,
        allowNull:false
    },
    consortium_type_values:{
        type:Sequelize.STRING,
        allowNull:false,
    }
});

// ConsortiumType.hasOne(ConsortiumTypeValue, {
//     foreignKey: 'fk_consortiumtype_id',
//     sourceKey: 'consortium_type_id',
//     as: 'consortiumtype'
// });
// ConsortiumType.hasOne(ConsortiumTypeValue,{
//     foreignKey:'fk_consortiumtype_id',
//     as:'consortiumtypes'
// })


module.exports = ConsortiumType;