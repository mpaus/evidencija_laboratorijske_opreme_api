module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
      database: 'evidencija_laboratorijske_opreme',
      dateStrings: true,
      multipleStatements: true,
    },
  },
};
