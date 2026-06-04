import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/User';

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'mgmt_system',
  dialect: 'postgres',
  username: process.env.DB_USER || 'mgmt_user',
  password: process.env.DB_PASSWORD || 'mgmt_password',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  models: [User],
  logging: false,
});

export default sequelize;
