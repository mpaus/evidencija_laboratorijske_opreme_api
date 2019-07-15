import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';

import * as models from '../models';
import {
  uredajType,
  stanjeType,
  korisnikType
} from '.';

export const zahtjevPosudbeType = new GraphQLObjectType({
  name: 'ZahtjevPosudbeType',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    pocetakPosudbe: { type: GraphQLNonNull(GraphQLString) },
    krajPosudbe: { type: GraphQLNonNull(GraphQLString) },
    razlogPosudbe: { type: GraphQLNonNull(GraphQLString) },
    napomenaProfesora: { type: GraphQLString },
    korisnikId: { type: GraphQLNonNull(GraphQLID)},
    odobritelj: {
      type: korisnikType,
      resolve: (obj, args, { database }) => obj.odobritelj && models.Korisnik.getOdobritelj(obj, args, database),
    },
    korisnik: {
      type: korisnikType,
      resolve: (obj, args, { database }) => models.Korisnik.getAllWhere(obj, args, database),
    },
    uredaj: {
      type: uredajType,
      resolve: (obj, args, { database }) => models.Uredaj.getAllWhere(obj, args, database),
    },
    stanje: {
      type: stanjeType,
      resolve: (obj, args, { database }) => models.Stanje.getAllWhere(obj, args, database),
    },
  }),
});

export default zahtjevPosudbeType;
