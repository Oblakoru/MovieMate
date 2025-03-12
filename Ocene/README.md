# Storitvena enota ocen (`/ocene`)

## 📌 Opis
Storitev omogoča uporabnikom dodajanje ocen in komentarjev k filmom.

## 🔗 Tehnologije
- **Vrsta komunikacije:** Sporočilni posrednik
- **Baza podatkov:** SQLite
- **Odgovornosti:**
  - Shranjevanje ocen in komentarjev
  - Preračunavanje povprečne ocene filma

## 📂 Sporočila v posredniku
- `NovaOcena { filmId, uporabnikId, ocena, komentar }`