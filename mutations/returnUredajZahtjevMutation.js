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

const ReturnUredajZahtjevInputType = new GraphQLInputObjectType({
    name: 'ReturnUredajZahtjevInput',
    fields: {
        id: { type: GraphQLNonNull(GraphQLID)},
        uredajId: { type: GraphQLNonNull(GraphQLID)}
    }
});


const returnUredajZahtjevMutation = async ({ input: { id, uredajId }}, database) => {

    await database('uredaj')
        .where('id', '=', uredajId)
        .update({
            stanje_id: 1
        });

    return await database('zahtjev_posudbe')
        .where('id', '=', id)
        .update({
            stanje_id: 14
        }).then(() => database.select().from('zahtjev_posudbe').where({ id }).then(res => humps.camelizeKeys(res[0])));
};

module.exports = {
    type: zahtjevPosudbeType,
    args: {
        input: { type: GraphQLNonNull(ReturnUredajZahtjevInputType)}
    },
    resolve(obj, args, { database }){
        return returnUredajZahtjevMutation(args, database);
    }
};