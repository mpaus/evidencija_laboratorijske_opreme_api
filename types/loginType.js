import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
} from 'graphql';
import { korisnikType } from "./korisnikType";

export const loginType = new GraphQLObjectType({
    name: 'LoginType',
    fields: () => ({
        korisnik: { type: GraphQLNonNull(korisnikType) },
        token: { type: GraphQLNonNull(GraphQLString)},
        tokenExpiration: { type: GraphQLNonNull(GraphQLInt)}
    }),
});

export default loginType;
