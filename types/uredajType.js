import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
  GraphQLNonNull,
} from 'graphql';

import * as models from '../models';
import {
  kategorijaType,
  stanjeType,
} from '.';

export const uredajType = new GraphQLObjectType({
  name: 'UredajType',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    nazivUredaja: { type: GraphQLNonNull(GraphQLString) },
    cijena: { type: GraphQLFloat },
    napomena: { type: GraphQLString },
    specifikacije: { type: GraphQLString },
    slikaUrl: { type: GraphQLString },
    kategorija: {
      type: kategorijaType,
      resolve: (obj, args, { database }) => models.Kategorija.getAllWhere(obj, args, database),
    },
    stanje: {
      type: stanjeType,
      resolve: (obj, args, { database }) => models.Stanje.getAllWhere(obj, args, database),
    },
  }),
});

export default uredajType;
