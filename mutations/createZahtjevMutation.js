import {
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLFloat,
    GraphQLInt
} from 'graphql';
import humps from 'humps';
import bcrypt from 'bcryptjs';
import toArray from 'stream-to-array';
import uredajType from '../types/uredajType';
import { storage } from '../google_cloud_storage/index';
import { GraphQLUpload } from 'graphql-upload'
import fs from 'fs';

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