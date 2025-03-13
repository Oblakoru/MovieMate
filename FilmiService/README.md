# Storitvena baza filmov (`/filmi`)

## 📌 Opis
Storitev vsebuje podatke o filmih in omogoča njihovo iskanje.

## 🔗 Tehnologije
- **Vrsta komunikacije:** gRPC
- **Baza podatkov:** SQLite
- **Odgovornosti:**
  - Hranjenje podatkov o filmih (naslov, leto, žanr, opis, igralci)
  - Omogočanje iskanja filmov
  - Integracija z zunanjimi API-ji (npr. TMDB)

## 📂 gRPC Metode
- `GetMovieById(id)` – Pridobi podatke o filmu
- `SearchMovies(query)` – Iskanje filmov po naslovu

## TODO