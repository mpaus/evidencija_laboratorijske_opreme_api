module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      port: 3307,
      user: 'root',
      password: 'root',
      database: 'evidencija_laboratorijske_opreme',
      dateStrings: true,
      multipleStatements: true,
    },
  },
};
