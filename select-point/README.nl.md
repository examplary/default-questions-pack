Het vraagtype punt aanwijzen (QTI *select point*) toont een afbeelding waarop leerlingen de juiste plek aanklikken, zoals een land op een kaart of een onderdeel van een diagram.

## Wanneer gebruik je het

- Topografie: een stad, land of rivier op een kaart aanwijzen.
- Biologie en natuurkunde: een onderdeel van een diagram aanwijzen.
- Elke vraag waarvan het antwoord een plek in een afbeelding is.

## Zo werkt het voor leerlingen

Leerlingen klikken op de afbeelding om een punt te plaatsen, en klikken op een punt om het te verwijderen. Is het maximale aantal punten bereikt, dan vervangt een nieuw punt het eerst geplaatste punt.

## Nakijken

Wordt automatisch nagekeken: het antwoord is goed als geen enkel punt buiten een gebied valt, en de punten evenveel verschillende gebieden raken als het aantal punten dat de leerling mag plaatsen. Met één punt en meerdere gebieden is elk van de gebieden goed; zonder limiet moet elk gebied een punt hebben.

## Instellingen

| Instelling | Beschrijving |
| --- | --- |
| Afbeelding | De afbeelding waarop leerlingen klikken. |
| Juiste gebieden | Cirkels (of, bij een QTI-import, rechthoeken) die leerlingen moeten aanklikken. Klik op de afbeelding om er een toe te voegen, en op een gebied om het te verwijderen. |
| Maximaal aantal punten | Hoeveel punten een leerling maximaal mag plaatsen, 0 voor geen limiet. |

Punten en gebieden worden opgeslagen in het coördinatenstelsel van de afbeelding: de instellingen `width` en `height` als een QTI-import die opgeeft, en anders het eigen formaat van de afbeelding. Een antwoord slaat elk punt op als een `"x,y"`-string.
