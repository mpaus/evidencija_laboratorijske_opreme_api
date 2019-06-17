/* eslint-disable global-require, import/no-dynamic-require */

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8000,
  web: 'localhost',
};

config.knex = require('./knexfile')[config.env];

export default config;
