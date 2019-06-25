import {
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLInt
} from 'graphql';

import { kategorijaType } from '../types';
import humps from "humps";

const createKategorijaMutation = async ({ input }, database) => {

    console.log(input, 'KRIEJT');

    return await database('kategorija').insert({
        naziv_kategorije: input
    }).then(res => database.select().from('kategorija').where({ id: res[0] }).then(res => humps.camelizeKeys(res[0])));
};

module.exports = {
    type: kategorijaType,
    args: {
        input: { type: GraphQLNonNull(GraphQLString)},
    },
    resolve(obj, args, { database }){
        return createKategorijaMutation(args, database);
    }
};