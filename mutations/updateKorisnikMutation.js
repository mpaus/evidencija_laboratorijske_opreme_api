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

async function pipeToServer(filename, stream){
    return new Promise(resolve => {
        const writeStream = fs.createWriteStream(filename);

        stream.pipe(writeStream);

        writeStream.on('finish', (res) => resolve(res));
    })
}

const updateKorisnikMutation = async ({ input: { id, maticniBroj, ime, prezime, brojTelefona }, file}, database) => {

    const odabraniKorisnik = await database('korisnik').where('id', '=', id).then(res => res[0]);

    if(file) {
        const slika = await file;

        const {filename, mimetype, encoding, createReadStream} = slika;

        const stream = createReadStream();

        const bucket = storage.bucket('evidencija_laboratorijske_opreme');

        await pipeToServer(filename, stream);

        const image = await bucket.upload(filename, {
                destination: filename,
                metadata: {
                    contentType: mimetype,
                    encoding
                }
            }).then(res => res[0]);

        await fs.unlinkSync(filename);

        const metadata = await image.getMetadata();

        return database('korisnik')
            .where('id', '=', id)
            .update({
                maticni_broj: maticniBroj || odabraniKorisnik.maticni_broj,
                ime: ime || odabraniKorisnik.ime,
                prezime: prezime || odabraniKorisnik.prezime,
                broj_telefona: brojTelefona || odabraniKorisnik.broj_telefona,
                slika_url: metadata[0].mediaLink || odabraniKorisnik.slika_url
            }).then(() => database.select().from('korisnik').where({id}).then(res => humps.camelizeKeys(res[0])));
    } else {
        return database('korisnik')
            .where('id', '=', id)
            .update({
                maticni_broj: maticniBroj || odabraniKorisnik.maticni_broj,
                ime: ime || odabraniKorisnik.ime,
                prezime: prezime || odabraniKorisnik.prezime,
                broj_telefona: brojTelefona || odabraniKorisnik.broj_telefona,
                slika_url: odabraniKorisnik.slika_url
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