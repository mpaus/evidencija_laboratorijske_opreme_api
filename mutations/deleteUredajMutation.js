import {
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLID,
    GraphQLInt
} from 'graphql';

import { uredajType } from '../types';

const deleteUredajMutation = async ({ input }, database) => {

    console.log(input, 'DELETE');

    await database('zahtjev_posudbe')
        .where('uredaj_id', input)
        .del();

    return await database('uredaj')
        .where('id', input)
        .del()
        .then( () => ( { id: input }));
};

module.exports = {
    type: uredajType,
    args: {
        input: { type: GraphQLNonNull(GraphQLID)},
    },
    resolve(obj, args, { database }){
        return deleteUredajMutation(args, database);
    }
};