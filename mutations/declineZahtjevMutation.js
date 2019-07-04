import {
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLFloat,
    GraphQLInt
} from 'graphql';
import humps from 'humps';

import { zahtjevPosudbeType }  from '../types';

const DeclineZahtjevInputType = new GraphQLInputObjectType({
    name: 'DeclineZahtjevInput',
    fields: {
        id: { type: GraphQLNonNull(GraphQLID)},
        odobritelj: { type: GraphQLNonNull(GraphQLID) },
        napomenaProfesora: { type: GraphQLString }
    }
});


const declineZahtjevMutation = async ({ input: { id, odobritelj, napomenaProfesora }}, database) => {

    return await database('zahtjev_posudbe')
        .where('id', '=', id)
        .update({
            stanje_id: 13,
            odobritelj,
            napomena_profesora: napomenaProfesora
        }).then(() => database.select().from('zahtjev_posudbe').where({ id }).then(res => humps.camelizeKeys(res[0])));
};

module.exports = {
    type: zahtjevPosudbeType,
    args: {
        input: { type: GraphQLNonNull(DeclineZahtjevInputType)}
    },
    resolve(obj, args, { database }){
        return declineZahtjevMutation(args, database);
    }
};