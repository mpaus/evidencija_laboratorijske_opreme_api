import {
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLInt
} from 'graphql';
import humps from 'humps';
import bcrypt from 'bcryptjs';
import toArray from 'stream-to-array';
import ulogaType from '../types/ulogaType';
import { storage } from '../google_cloud_storage/index';
import { GraphQLUpload } from 'graphql-upload'
import fs from 'fs';

import { korisnikType } from '../types';

const KorisnikInputType = new GraphQLInputObjectType({
    name: 'KorisnikInput',
    fields: {
        email: { type: GraphQLNonNull(GraphQLString) },
        lozinka: { type: GraphQLNonNull(GraphQLString) },
        maticniBroj: { type: GraphQLNonNull(GraphQLString) },
        ime: { type: GraphQLNonNull(GraphQLString) },
        prezime: { type: GraphQLNonNull(GraphQLString) },
        brojTelefona: { type: GraphQLNonNull(GraphQLString) },
        ulogaId: { type: GraphQLNonNull(GraphQLID)},
    }
});


const createUserMutation = async ({ input: { email, lozinka, maticniBroj, ime, prezime, brojTelefona, ulogaId }, file}, database) => {

    const hashLozinka = await bcrypt.hash(lozinka, 12);
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

    return await database('korisnik').insert({
        email,
        lozinka: hashLozinka,
        maticni_broj: maticniBroj,
        ime,
        prezime,
        broj_telefona: brojTelefona,
        uloga_id: ulogaId,
        slika_url: slikaUrl
    }).then(res => database.select().from('korisnik').where({ id: res[0] }).then(res => humps.camelizeKeys(res[0])));
};

module.exports = {
    type: korisnikType,
    args: {
        input: { type: GraphQLNonNull(KorisnikInputType)},
        file: { type: GraphQLUpload }
    },
    resolve(obj, args, { database }){
        return createUserMutation(args, database);
    }
};