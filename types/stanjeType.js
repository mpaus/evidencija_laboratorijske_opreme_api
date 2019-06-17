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
    nazivStanje: { type: GraphQLNonNull(GraphQLString) },
  },
});

export default stanjeType;
