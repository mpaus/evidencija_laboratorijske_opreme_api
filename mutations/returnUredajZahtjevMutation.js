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
        id: { type: GraphQLNonNull(GraphQLID)}
    }
});


const returnUredajZahtjevMutation = async ({ input: { id }}, database) => {

    return await database('zahtjev_posudbe')
        .where('id', '=', id)
        .update({
            stanje_id: 1
        }).then(res => database.select().from('zahtjev_posudbe').where({ id: res }).then(res => humps.camelizeKeys(res[0])));
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