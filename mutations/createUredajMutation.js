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

import { korisnikType } from '../types';

const UredajInputType = new GraphQLInputObjectType({
    name: 'UredajInput',
    fields: {
        nazivUredaja: { type: GraphQLNonNull(GraphQLString) },
        serijskiBroj: { type: GraphQLNonNull(GraphQLString) },
        cijena: { type: GraphQLString },
        napomena: { type: GraphQLString },
        specifikacije: { type: GraphQLString },
        kategorijaId: { type: GraphQLNonNull(GraphQLID)}
    }
});


const createUredajMutation = async ({ input: { nazivUredaja, serijskiBroj, cijena, napomena, specifikacije, kategorijaId }, file}, database) => {

    let slikaUrl = null;

    await file.then(async slika => {

        const { filename, mimetype, createReadStream } = slika;

        const stream = createReadStream();

        const bucket = storage.bucket('evidencija_laboratorijske_opreme');

        slikaUrl = await bucket.upload(stream.path, {
            destination: filename,
            metadata: {
                contentType: mimetype,
            }}).then(async (res) => res[0].getMetadata().then(res => {
            console.log(res[0]);
            return res[0].mediaLink;
        })).catch(err => console.log(err));
    });

    return await database('uredaj').insert({
        naziv_uredaja: nazivUredaja,
        serijski_broj: serijskiBroj,
        cijena,
        napomena,
        specifikacije,
        kategorija_id: kategorijaId,
        slika_url: slikaUrl,
        stanje_id: 1
    }).then(res => database.select().from('uredaj').where({ id: res[0] }).then(res => humps.camelizeKeys(res[0])));
};

module.exports = {
    type: uredajType,
    args: {
        input: { type: GraphQLNonNull(UredajInputType)},
        file: { type: GraphQLUpload }
    },
    resolve(obj, args, { database }){
        return createUredajMutation(args, database);
    }
};