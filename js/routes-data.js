// routes-data.js
// Global object RoutesDB: stores major Brazilian city routes and helper methods

// Each route object:
// {
//   origin: 'City, ST',
//   destination: 'City, ST',
//   distanceKM: Number
// }

var RoutesDB = {
  // Array of popular Brazilian routes (capitals, major cities, regional)
  routes: [
    { origin: "São Paulo, SP", destination: "Rio de Janeiro, RJ", distanceKM: 430 },
    { origin: "São Paulo, SP", destination: "Brasília, DF", distanceKM: 1015 },
    { origin: "Rio de Janeiro, RJ", destination: "Brasília, DF", distanceKM: 1148 },
    { origin: "São Paulo, SP", destination: "Belo Horizonte, MG", distanceKM: 586 },
    { origin: "Belo Horizonte, MG", destination: "Brasília, DF", distanceKM: 716 },
    { origin: "Belo Horizonte, MG", destination: "Rio de Janeiro, RJ", distanceKM: 434 },
    { origin: "São Paulo, SP", destination: "Curitiba, PR", distanceKM: 408 },
    { origin: "Curitiba, PR", destination: "Florianópolis, SC", distanceKM: 300 },
    { origin: "Florianópolis, SC", destination: "Porto Alegre, RS", distanceKM: 476 },
    { origin: "Porto Alegre, RS", destination: "Curitiba, PR", distanceKM: 711 },
    { origin: "Brasília, DF", destination: "Goiânia, GO", distanceKM: 209 },
    { origin: "Brasília, DF", destination: "Salvador, BA", distanceKM: 1448 },
    { origin: "Salvador, BA", destination: "Recife, PE", distanceKM: 839 },
    { origin: "Recife, PE", destination: "Fortaleza, CE", distanceKM: 800 },
    { origin: "Fortaleza, CE", destination: "São Luís, MA", distanceKM: 1077 },
    { origin: "São Luís, MA", destination: "Belém, PA", distanceKM: 806 },
    { origin: "Belém, PA", destination: "Manaus, AM", distanceKM: 5297 },
    { origin: "Manaus, AM", destination: "Boa Vista, RR", distanceKM: 785 },
    { origin: "Porto Velho, RO", destination: "Rio Branco, AC", distanceKM: 505 },
    { origin: "Campo Grande, MS", destination: "Cuiabá, MT", distanceKM: 694 },
    { origin: "São Paulo, SP", destination: "Campinas, SP", distanceKM: 95 },
    { origin: "Rio de Janeiro, RJ", destination: "Niterói, RJ", distanceKM: 13 },
    { origin: "Belo Horizonte, MG", destination: "Ouro Preto, MG", distanceKM: 100 },
    { origin: "Recife, PE", destination: "João Pessoa, PB", distanceKM: 120 },
    { origin: "Natal, RN", destination: "João Pessoa, PB", distanceKM: 185 },
    { origin: "Salvador, BA", destination: "Aracaju, SE", distanceKM: 356 },
    { origin: "Fortaleza, CE", destination: "Teresina, PI", distanceKM: 634 },
    { origin: "Belém, PA", destination: "Macapá, AP", distanceKM: 600 },
    { origin: "Palmas, TO", destination: "Goiânia, GO", distanceKM: 874 },
    { origin: "Vitória, ES", destination: "Belo Horizonte, MG", distanceKM: 524 },
    { origin: "Vitória, ES", destination: "Rio de Janeiro, RJ", distanceKM: 521 },
    { origin: "Curitiba, PR", destination: "Joinville, SC", distanceKM: 130 },
    { origin: "Joinville, SC", destination: "Florianópolis, SC", distanceKM: 183 },
    { origin: "Porto Alegre, RS", destination: "Pelotas, RS", distanceKM: 261 },
    { origin: "São Paulo, SP", destination: "Santos, SP", distanceKM: 72 },
    { origin: "Salvador, BA", destination: "Feira de Santana, BA", distanceKM: 116 },
    { origin: "Goiânia, GO", destination: "Uberlândia, MG", distanceKM: 535 },
    { origin: "Brasília, DF", destination: "Uberlândia, MG", distanceKM: 540 },
    { origin: "Fortaleza, CE", destination: "Mossoró, RN", distanceKM: 235 },
    { origin: "Recife, PE", destination: "Maceió, AL", distanceKM: 285 }
  ],

  /**
   * Returns a unique, sorted array of all city names from routes (origin and destination)
   */
  getAllCities: function() {
    const cities = this.routes.flatMap(r => [r.origin, r.destination]);
    return Array.from(new Set(cities)).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  },

  /**
   * Finds the distance in km between two cities (searches both directions, case-insensitive, trims whitespace)
   * @param {string} origin
   * @param {string} destination
   * @returns {number|null} Distance in km if found, null if not
   */
  findDistance: function(origin, destination) {
    if (!origin || !destination) return null;
    const norm = s => s.trim().toLowerCase();
    const o = norm(origin), d = norm(destination);
    const found = this.routes.find(r =>
      (norm(r.origin) === o && norm(r.destination) === d) ||
      (norm(r.origin) === d && norm(r.destination) === o)
    );
    return found ? found.distanceKM : null;
  }
};

// Usage example:
// RoutesDB.getAllCities();
// RoutesDB.findDistance('São Paulo, SP', 'Rio de Janeiro, RJ');
