import {
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
} from 'graphql';
import humps from 'humps';

import { zahtjevPosudbeType }  from '../types';

const ZahtjevInputType = new GraphQLInputObjectType({
    name: 'ZahtjevInput',
    fields: {
        pocetakPosudbe: { type: GraphQLNonNull(GraphQLString) },
        krajPosudbe: { type: GraphQLNonNull(GraphQLString) },
        razlogPosudbe: { type: GraphQLNonNull(GraphQLString) },
        korisnikId: { type: GraphQLNonNull(GraphQLString) },
        uredajId: { type: GraphQLNonNull(GraphQLString) },
    }
});


const createZahtjevMutation = async ({ input: { pocetakPosudbe, krajPosudbe, razlogPosudbe, korisnikId, uredajId }}, database) => {

    await database('uredaj')
        .where('id', '=', uredajId)
        .update({
           stanje_id: 2
        });

    return await database('zahtjev_posudbe').insert({
        pocetak_posudbe: pocetakPosudbe,
        kraj_posudbe: krajPosudbe,
        razlog_posudbe: razlogPosudbe,
        korisnik_id: korisnikId,
        uredaj_id: uredajId,
        stanje_id: 11,
    }).then(res => database.select().from('zahtjev_posudbe').where({ id: res[0] }).then(res => humps.camelizeKeys(res[0])));
};

module.exports = {
    type: zahtjevPosudbeType,
    args: {
        input: { type: GraphQLNonNull(ZahtjevInputType)}
    },
    resolve(obj, args, { database }){
        return createZahtjevMutation(args, database);
    }
};