import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLNonNull,
} from 'graphql';
import ulogaType from "./ulogaType";
import * as models from "../models";

export const korisnikType = new GraphQLObjectType({
    name: 'KorisnikType',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        email: { type: GraphQLNonNull(GraphQLString) },
        lozinka: { type: GraphQLNonNull(GraphQLString)},
        maticniBroj: { type: GraphQLNonNull(GraphQLString) },
        ime: { type: GraphQLNonNull(GraphQLString) },
        prezime: { type: GraphQLNonNull(GraphQLString) },
        brojTelefona: { type: GraphQLNonNull(GraphQLString) },
        ulogaId: { type: GraphQLNonNull(GraphQLID)},
        slikaUrl: { type: GraphQLString },
        uloga: {
            type: ulogaType,
            resolve: (obj, args, { database }) => models.Uloga.getAllWhere(obj, args, database),
        },
    }),
});

export default korisnikType;
