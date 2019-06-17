import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
} from 'graphql';
import { korisnikType } from "./korisnikType";

export const loginType = new GraphQLObjectType({
    name: 'LoginType',
    fields: () => ({
        user: { type: GraphQLNonNull(korisnikType) },
        token: { type: GraphQLNonNull(GraphQLString)},
        tokenExpiration: { type: GraphQLNonNull(GraphQLInt)}
    }),
});

export default loginType;
