# Individuell examination: Strajk Bowling

Denna repository innehåller lösningen för den individuella examinationen där uppgiften var att skriva en testsvit för bokningssystemet Strajk Bowling.

## Status
✅ **Alla krav för Godkänt (G) är uppfyllda.**
✅ **Alla krav för Väl Godkänt (VG) är uppfyllda.**

---

## Uppfyllda Kriterier

### Godkänt (G)
- [x] **Tester för User Stories:** Integrationstester är skrivna med React Testing Library för bokningsflödet, skohantering och navigering.
- [x] **Mockat API:** POST-anropet för bokning fångas upp och hanteras av Mock Service Worker (MSW).
- [x] **GitHub Actions:** Ett CI-flöde (`.github/workflows/main.yml`) är uppsatt som kör testerna automatiskt vid push till `main`.
- [x] **Dokumentation i kod:** Varje test är kommenterat med syfte och vilket acceptanskriterium det uppfyller.

### Väl Godkänt (VG)
- [x] **Felhantering:** Specifika tester finns skrivna för samtliga felmeddelanden och kantfall (t.ex. missade fält, matchning av skor/spelare, max antal spelare per bana).
- [x] **Code Coverage:** Testerna har en kodtäckning på över **90%**.

---

## Noteringar om kodändringar
Enligt instruktionerna ("Ingen modifikation i koden får göras...") har källkoden lämnats orörd med följande tillåtna undantag för att möjliggöra testning och tillgänglighet:

1.  **`src/components/Input/Input.jsx`**: Uppdaterad med `htmlFor` och `id` för att koppla ihop label med input-fält (enligt dispens för "label saknar for-attribut").
2.  **`src/views/Confirmation.jsx`**: Lagt till `name`-prop på Input-komponenterna. Detta krävdes för att kopplingen i punkten ovan ska fungera, så att testerna kan hitta fälten.
3.  **`src/views/Booking.jsx`**: Uppdaterad valideringslogik i `book()`-funktionen för att korrekt hantera 0-värden och negativa tal (enligt uppdatering från Christoffer).

---
