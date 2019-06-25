import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
} from 'graphql';

export const stanjeType = new GraphQLObjectType({
  name: 'StanjeType',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    nazivStanja: { type: GraphQLNonNull(GraphQLString) },
  },
});

export default stanjeType;
