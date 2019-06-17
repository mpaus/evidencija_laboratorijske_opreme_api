import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';

export const kategorijaType = new GraphQLObjectType({
  name: 'KategorijaType',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    nazivKategorije: { type: GraphQLNonNull(GraphQLString) },
  }),
});

export default kategorijaType;
