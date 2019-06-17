import chalk from 'chalk';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './schema';
import config from './config';
import { graphqlUploadExpress } from 'graphql-upload'
import database from './database';
import cors from 'cors';

const app = express();

app.use(cors());

app.use('/graphql', graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }), graphqlHTTP({
  schema,
  graphiql: true,
  pretty: true,
  context: { database },
}));

app.listen(config.port, () => console.log(chalk.green(`Server listening on port ${config.port}`)));
