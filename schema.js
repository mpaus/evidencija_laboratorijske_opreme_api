import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
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
  CreateKorisnikMutation,
  UpdateKorisnikMutation,
  DeleteKorisnikMutation,
  DeleteUredajMutation,
  CreateKategorijaMutation,
  CreateUredajMutation,
  UpdateUredajMutation,
  CreateZahtjevMutation,
  AprooveZahtjevMutation,
  DeclineZahtjevMutation,
  ReturnUredajZahtjevMutation
} from './mutations';

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    korisnik: {
      type: GraphQLList(korisnikType),
      args: {
        ulogaId: {
          type: GraphQLID,
        },
        id: {
          type: GraphQLID
        }
      },
      resolve(obj, args, { database }) {
        if(args.length !== 0){
          return models.Korisnik.getAllWhere(obj, args, database);
        }
        return models.Korisnik.getAll(obj, args, database);
      },
    },
    stanje: {
      type: GraphQLList(stanjeType),
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve(obj, args, { database }) {
        if(args.length !== 0){
          return models.Stanje.getAllWhere(obj, args, database);
        }
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
        stanjeId: {
          type: GraphQLID,
        },
      },
      resolve(obj, args, { database }) {
        if(args.length !== 0){
          return models.Uredaj.getAllWhere(obj, args, database);
        }
        return models.Uredaj.getAll(obj, args, database);
      },
    },
    zahtjevPosudbe: {
      type: GraphQLList(zahtjevPosudbeType),
      args: {
        stanjeId: {
          type: GraphQLID,
        },
      },
      resolve(obj, args, { database }) {
        if(args.length !== 0){
          return models.ZahtjevPosudbe.getAllWhere(obj, args, database);
        }
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
      CreateKorisnik: CreateKorisnikMutation,
      UpdateKorisnik: UpdateKorisnikMutation,
      DeleteKorisnik: DeleteKorisnikMutation,
      DeleteUredaj: DeleteUredajMutation,
      CreateKategorija: CreateKategorijaMutation,
      CreateUredaj: CreateUredajMutation,
      UpdateUredaj: UpdateUredajMutation,
      CreateZahtjev: CreateZahtjevMutation,
      AprooveZahtjev: AprooveZahtjevMutation,
      DeclineZahtjev: DeclineZahtjevMutation,
      ReturnUredajZahtjev: ReturnUredajZahtjevMutation
    })
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

module.exports = schema;
