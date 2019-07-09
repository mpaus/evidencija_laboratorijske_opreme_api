import {
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
} from 'graphql';
import humps from 'humps';
import bcrypt from 'bcryptjs';
import { storage } from '../google_cloud_storage/index';
import { GraphQLUpload } from 'graphql-upload'

import { korisnikType } from '../types';
import fs from "fs";

const UpdateKorisnikInputType = new GraphQLInputObjectType({
    name: 'UpdateKorisnikInput',
    fields: {
        id: { type: GraphQLNonNull(GraphQLString)},
        maticniBroj: { type: GraphQLString },
        ime: { type: GraphQLString },
        prezime: { type: GraphQLString },
        brojTelefona: { type: GraphQLString },
    }
});


const updateKorisnikMutation = async ({ input: { id, maticniBroj, ime, prezime, brojTelefona }, file}, database) => {

    let slikaUrl = null;
    let result = null;

    if(file) {
        const slika = await file;

            const {filename, mimetype, encoding, createReadStream} = slika;

            const stream = createReadStream();

        const bucket = storage.bucket('evidencija_laboratorijske_opreme');

        const odabraniKorisnik = await database('korisnik').where('id', '=', id).then(res => res[0]);

        const writeStream = fs.createWriteStream(filename);
        stream.pipe(writeStream);

        const result = await writeStream.on('finish', (res) => {
            return res;
        });
            const image = await bucket.upload(filename, {
                destination: filename,
                metadata: {
                    contentType: mimetype,
                    encoding
                }
            }).then(res => res[0]);

        await fs.unlinkSync(filename)

        const a = await image.getMetadata();

                    return database('korisnik')
                        .where('id', '=', id)
                        .update({
                            maticni_broj: maticniBroj || odabraniKorisnik.maticni_broj,
                            ime: ime || odabraniKorisnik.ime,
                            prezime: prezime || odabraniKorisnik.prezime,
                            broj_telefona: brojTelefona || odabraniKorisnik.broj_telefona,
                            slika_url: a[0].mediaLink || odabraniKorisnik.slika_url
                        }).then(() => database.select().from('korisnik').where({id}).then(res => humps.camelizeKeys(res[0])));
                }
};

module.exports = {
    type: korisnikType,
    args: {
        input: { type: GraphQLNonNull(UpdateKorisnikInputType)},
        file: { type: GraphQLUpload }
    },
    resolve(obj, args, { database }){
        return updateKorisnikMutation(args, database);
    }
};