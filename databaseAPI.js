module.exports = database => ({
  getKorisnikWhere(name) {
    return database.select().from('korisnik').where({ ime: name }).then(res => res[0]);
  },
  getUloga(korisnik) {
    return database.select().from('uloga').where({ id: korisnik.uloga_id }).then(res => res[0]);
  },
});
