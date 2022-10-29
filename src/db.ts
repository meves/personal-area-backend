import { Sequelize } from "sequelize";
import config from 'config';

const sequelize = new Sequelize(
    config.get('dBase.database'),
    config.get('dBase.username'),
    config.get('dBase.password'),
    {
        host: config.get('dBase.host'),
        dialect: 'mysql'
    }
)

export default sequelize;