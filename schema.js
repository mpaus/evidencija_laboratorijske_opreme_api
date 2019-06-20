import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
} from 'graphql';

import * as models from './models';
import {
  stanjeType,
  kategorijaType,
  uredajType,
  zahtjevPosudbeType,
  korisnikType,
  ulogaType,
    loginType,
} from './types'

import {
  CreateUserMutation,
  DeleteUserMutation
} from './mutations';

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    korisnik: {
      type: GraphQLList(korisnikType),
      args: {
        key: {
          type: GraphQLString,
        },
      },
      resolve(obj, args, { database }) {
        return models.Korisnik.getAll(obj, args, database);
      },
    },
    stanje: {
      type: GraphQLList(stanjeType),
      args: {
        key: {
          type: GraphQLString,
        },
      },
      resolve(obj, args, { database }) {
        return models.Stanje.getAll(obj, args, database);
      },
    },
    uloga: {
      type: GraphQLList(ulogaType),
      args: {
        key: {
          type: GraphQLString,
        },
      },
      resolve(obj, args, { database }) {
        return models.Uloga.getAll(obj, args, database);
      },
    },
    kategorija: {
      type: GraphQLList(kategorijaType),
      args: {
        key: {
          type: GraphQLString,
        },
      },
      resolve(obj, args, { database }) {
        return models.Kategorija.getAll(obj, args, database);
      },
    },
    uredaj: {
      type: GraphQLList(uredajType),
      args: {
        key: {
          type: GraphQLString,
        },
      },
      resolve(obj, args, { database }) {
        return models.Uredaj.getAll(obj, args, database);
      },
    },
    zahtjevPosudbe: {
      type: GraphQLList(zahtjevPosudbeType),
      args: {
        key: {
          type: GraphQLString,
        },
      },
      resolve(obj, args, { database }) {
        return models.ZahtjevPosudbe.getAll(obj, args, database);
      },
    },
      login: {
        type: GraphQLList(loginType),
        args: {
          email: { type: GraphQLString},
          lozinka: { type: GraphQLString }
        },
        resolve(obj, args, { database }) {
          return models.Login.getWhere(obj, args, database);
        }
      },
    },
});

const RootMutationType = new GraphQLObjectType({
    name: 'RootMutationType',
    fields: () => ({
      CreateUser: CreateUserMutation,
      DeleteUser: DeleteUserMutation
    })
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

module.exports = schema;
