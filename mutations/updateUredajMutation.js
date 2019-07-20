import {
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
} from 'graphql';
import humps from 'humps';
import uredajType from '../types/uredajType';
import { storage } from '../google_cloud_storage/index';
import { GraphQLUpload } from 'graphql-upload'
import fs from 'fs';

const UpdateUredajInputType = new GraphQLInputObjectType({
    name: 'UpdateUredajInput',
    fields: {
        id: { type: GraphQLNonNull(GraphQLID)},
        nazivUredaja: { type: GraphQLNonNull(GraphQLString) },
        serijskiBroj: { type: GraphQLNonNull(GraphQLString) },
        cijena: { type: GraphQLString },
        napomena: { type: GraphQLString },
        specifikacije: { type: GraphQLString },
        kategorijaId: { type: GraphQLNonNull(GraphQLID)}
    }
});

async function pipeToServer(filename, stream){
    return new Promise(resolve => {
        const writeStream = fs.createWriteStream(filename);

        stream.pipe(writeStream);

        writeStream.on('finish', (res) => resolve(res));
    })
}

const updateUredajMutation = async ({ input: { id, nazivUredaja, serijskiBroj, cijena, napomena, specifikacije, kategorijaId }, file}, database) => {

    const existingUredaj = await database('uredaj')
        .select()
        .where( 'serijski_broj', '=', serijskiBroj )
        .where('id', '!=', id)
        .then(res => res[0]);

    if(existingUredaj) throw new Error('Uređaj već postoji');

    const odabraniUredaj = await database('uredaj').where('id', '=', id).then(res => res[0]);

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

        return await database('uredaj')
            .where('id', '=', id)
            .update({
                naziv_uredaja: nazivUredaja || odabraniUredaj.naziv_uredaja,
                serijski_broj: serijskiBroj || odabraniUredaj.serijski_broj,
                cijena: cijena || odabraniUredaj.cijena,
                napomena: napomena || odabraniUredaj.napomena,
                specifikacije: specifikacije || odabraniUredaj.specifikacije,
                kategorija_id: kategorijaId || odabraniUredaj.kategorija_id,
                slika_url: metadata[0].mediaLink,
                stanje_id: odabraniUredaj.stanje_id
            }).then(res => database.select().from('uredaj').where({ id }).then(res => humps.camelizeKeys(res[0])));
    } else {
        return await database('uredaj')
            .where('id', '=', id)
            .update({
                naziv_uredaja: nazivUredaja || odabraniUredaj.naziv_uredaja,
                serijski_broj: serijskiBroj || odabraniUredaj.serijski_broj,
                cijena: cijena || odabraniUredaj.cijena,
                napomena: napomena || odabraniUredaj.napomena,
                specifikacije: specifikacije || odabraniUredaj.specifikacije,
                kategorija_id: kategorijaId || odabraniUredaj.kategorija_id,
                slika_url: odabraniUredaj.slika_url,
                stanje_id: odabraniUredaj.stanje_id
            }).then(res => database.select().from('uredaj').where({ id }).then(res => humps.camelizeKeys(res[0])));
    }

};

module.exports = {
    type: uredajType,
    args: {
        input: { type: GraphQLNonNull(UpdateUredajInputType)},
        file: { type: GraphQLUpload }
    },
    resolve(obj, args, { database }){
        return updateUredajMutation(args, database);
    }
};