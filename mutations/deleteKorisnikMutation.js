import {
    GraphQLNonNull,
    GraphQLID,
} from 'graphql';

import { korisnikType } from '../types';

const deleteKorisnikMutation = async ({ input }, database) => await database('korisnik')
            .where('id', input)
            .del()
            .then( () => ( { id: input }));

module.exports = {
    type: korisnikType,
    args: {
        input: { type: GraphQLNonNull(GraphQLID)},
    },
    resolve(obj, args, { database }){
        return deleteKorisnikMutation(args, database);
    }
};