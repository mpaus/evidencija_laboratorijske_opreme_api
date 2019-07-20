import {
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
} from 'graphql';
import humps from 'humps';
import bcrypt from 'bcryptjs';
import { storage } from '../google_cloud_storage/index';
import { GraphQLUpload } from 'graphql-upload';
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

async function pipeToServer(filename, stream){
    return new Promise(resolve => {
        const writeStream = fs.createWriteStream(filename);

        stream.pipe(writeStream);

        writeStream.on('finish', (res) => resolve(res));
    })
}


const createKorisnikMutation = async ({ input: { email, lozinka, maticniBroj, ime, prezime, brojTelefona, ulogaId }, file}, database) => {

    const hashLozinka = await bcrypt.hash(lozinka, 12);

    const existingUser = await database('korisnik')
        .select()
        .where('email', '=', email)
        .orWhere('maticni_broj', '=', maticniBroj)
        .then(res => res[0]);

    if(existingUser) throw new Error('Korisnik već postoji');

    if(file) {
        const slika = await file;

        const {filename, mimetype, encoding, createReadStream} = slika;

        const stream = createReadStream();

        const bucket = storage.bucket('evidencija-laboratorijske-opreme');

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

        return await database('korisnik').insert({
            email,
            lozinka: hashLozinka,
            maticni_broj: maticniBroj,
            ime,
            prezime,
            broj_telefona: brojTelefona,
            uloga_id: ulogaId,
            slika_url: metadata[0].mediaLink
        }).then(res => database.select().from('korisnik').where({ id: res[0] }).then(res => humps.camelizeKeys(res[0])));
    } else {
        return await database('korisnik').insert({
            email,
            lozinka: hashLozinka,
            maticni_broj: maticniBroj,
            ime,
            prezime,
            broj_telefona: brojTelefona,
            uloga_id: ulogaId,
            slika_url: null
        }).then(res => database.select().from('korisnik').where({ id: res[0] }).then(res => humps.camelizeKeys(res[0])));
    }

};

module.exports = {
    type: korisnikType,
    args: {
        input: { type: GraphQLNonNull(KorisnikInputType)},
        file: { type: GraphQLUpload }
    },
    resolve(obj, args, { database }){
        return createKorisnikMutation(args, database);
    }
};