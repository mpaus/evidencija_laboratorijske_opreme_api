import {
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
} from 'graphql';
import humps from 'humps';

import { zahtjevPosudbeType }  from '../types';

const AprooveZahtjevInputType = new GraphQLInputObjectType({
    name: 'AprooveZahtjevInput',
    fields: {
        id: { type: GraphQLNonNull(GraphQLID)},
        odobritelj: { type: GraphQLNonNull(GraphQLID) },
        napomenaProfesora: { type: GraphQLString },
        uredajId: { type: GraphQLNonNull(GraphQLID)}
    }
});


const aprooveZahtjevMutation = async ({ input: { id, odobritelj, napomenaProfesora, uredajId }}, database) => {

    await database('uredaj')
        .where('id', '=', uredajId)
        .update({
            stanje_id: 3
        });

    return await database('zahtjev_posudbe')
        .where('id', '=', id)
        .update({
        stanje_id: 12,
        odobritelj,
        napomena_profesora: napomenaProfesora
    }).then(() => database.select().from('zahtjev_posudbe').where({ id }).then(res => humps.camelizeKeys(res[0])));
};

module.exports = {
    type: zahtjevPosudbeType,
    args: {
        input: { type: GraphQLNonNull(AprooveZahtjevInputType)}
    },
    resolve(obj, args, { database }){
        return aprooveZahtjevMutation(args, database);
    }
};