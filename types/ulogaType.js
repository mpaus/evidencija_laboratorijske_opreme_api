import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLID,
    GraphQLString,
} from 'graphql';

export const ulogaType = new GraphQLObjectType({
    name: 'UlogaType',
    fields: {
        id: { type: GraphQLNonNull(GraphQLID) },
        nazivUloge: { type: GraphQLNonNull(GraphQLString) },
    },
});

export default ulogaType;
