MovieMate

📌 Opis projekta

MovieMate je sistem za sledenje ogledanim filmom in ocenjevanje filmov na podlagi uporabniških mnenj. Omogoča uporabnikom, da vodijo evidenco filmov, ki so jih že pogledali, ocenjujejo filme in prebirajo ocene drugih uporabnikov.

🎯 Poslovni problem

Težava: Veliko ljubiteljev filmov želi slediti filmom, ki so jih že pogledali, ter prebirati in deliti mnenja o filmih.

Rešitev: MovieMate ponuja enostavno platformo, kjer lahko uporabniki:

Beležijo filme, ki so jih že gledali.

Ocenjujejo in komentirajo filme.

Dodajajo filme na seznam "Želim pogledati".

Prebirajo ocene drugih uporabnikov.

Ciljna skupina:

Posamezniki, ki želijo voditi evidenco svojih ogledov.

Ljubitelji filmov, ki želijo deliti in prebirati ocene.

Skupine prijateljev, ki si želijo deliti svoje sezname in ocene.

🏗️ Arhitektura sistema

Sistem sledi mikrostoritveni arhitekturi in vključuje naslednje ključne storitve:

1. Uporabniška storitev (/uporabniki)

Upravljanje uporabniških računov (registracija, prijava, avtentikacija).

Hranjenje uporabniških podatkov (ime, e-pošta, zgodovina ogledov).

2. Storitvena baza filmov (/filmi)

Vsebuje podatke o filmih (naslov, leto, žanr, opis, igralci).

Možna integracija z zunanjimi API-ji, kot je TMDB.

3. Storitvena enota ocen (/ocene)

Omogoča uporabnikom dodajanje ocen in komentarjev k filmom.

Shranjuje in analizira uporabniške ocene.

4. Uporabniški vmesnik (/uporabniski-vmesnik)

Spletna aplikacija, kjer uporabniki dostopajo do sistema.

Omogoča dodajanje filmov, ocenjevanje in pregled ocen drugih uporabnikov.

🔗 Komunikacija med storitvami

Uporabniki komunicirajo s sistemom prek spletne aplikacije.

Storitev uporabnikov upravlja prijave in uporabniške podatke.

Storitev filmov nudi informacije o filmih in omogoča iskanje.

Storitev ocen omogoča shranjevanje in prikaz uporabniških ocen.

Vse storitve komunicirajo prek REST API-jev.

📌 Povzetek

MovieMate je zasnovan kot modularen, razširljiv sistem, ki omogoča enostavno dodajanje novih funkcionalnosti v prihodnosti. Sledenje načelom čiste arhitekture zagotavlja neodvisnost posameznih komponent in jasno ločitev poslovne logike od implementacije.