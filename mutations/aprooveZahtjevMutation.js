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

const AprooveZahtjevInputType = new GraphQLInputObjectType({
    name: 'AprooveZahtjevInput',
    fields: {
        id: { type: GraphQLNonNull(GraphQLID)},
        odobritelj: { type: GraphQLNonNull(GraphQLID) },
        napomenaProfesora: { type: GraphQLString }
    }
});


const aprooveZahtjevMutation = async ({ input: { id, odobritelj, napomenaProfesora }}, database) => {

    return await database('zahtjev_posudbe')
        .where('id', '=', id)
        .update({
        stanje_id: 3,
        odobritelj,
        napomena_profesora: napomenaProfesora
    }).then(res => {
        console.log(res);
        database.select().from('zahtjev_posudbe').where({ id: res }).then(res => humps.camelizeKeys(res[0]))
        });
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