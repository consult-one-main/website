# Website pflegen

Diese Website besteht aus einfachen Dateien in diesem Repository. Es gibt kein
Login, kein WordPress und kein Backend. Wer hier etwas ändert und speichert,
ändert damit die Website — sie ist nach etwa einer Minute live.

## Termine eintragen, ändern oder löschen

Alle Termine auf der Seite „Für Studierende" stehen in **einer einzigen Datei**:
`data/termine.json`.

### So geht's

1. Dieses Repository auf github.com öffnen.
2. In den Ordner `data` gehen und `termine.json` anklicken.
3. Oben rechts auf das **Stift-Symbol** („Edit this file") klicken.
4. Termin eintragen, ändern oder löschen (Aufbau siehe unten).
5. Unten auf den grünen Knopf **„Commit changes"** klicken, dann nochmal bestätigen.
6. Ungefähr eine Minute warten, Seite neu laden — fertig.

Abgelaufene Termine musst du **nicht** löschen. Sobald das Datum vorbei ist,
verschwindet der Termin von selbst von der Website.

### Aufbau eines Termins

```json
{
  "title": "Infoveranstaltung",
  "date": "2026-11-03",
  "hour": 18,
  "minute": 30,
  "timeLabel": "18:30 Uhr",
  "location": "Raum PK4.1 im Altgebäude der TU Braunschweig",
  "desc": "Lern Consult One und aktive Mitglieder unverbindlich kennen."
}
```

| Feld | Bedeutung |
|---|---|
| `title` | Überschrift der Karte |
| `date` | Datum, immer im Format `"JAHR-MONAT-TAG"`, also `"2026-11-03"` |
| `hour`, `minute` | Startzeit in Zahlen. Wird für den Kalender-Download gebraucht |
| `timeLabel` | Die Uhrzeit, wie sie auf der Karte stehen soll, z. B. `"18:30 Uhr"` |
| `location` | Ort. Steht er noch nicht fest: `null` schreiben |
| `desc` | Ein bis zwei Sätze Beschreibung |

### Sonderfälle

**Datum steht noch nicht fest** — `"date": null` setzen. Die Karte zeigt dann
„Termin folgt" statt eines Datums und bleibt so lange stehen, bis du ein Datum einträgst.

**Kein Ort anzeigen** — `"noLocation": true` ergänzen. Dann wird die Ortszeile ganz
weggelassen, statt „Ort wird noch bekannt gegeben" anzuzeigen.

**Anmeldung über ein Formular statt Kalender-Download** — `"signupUrl"` mit dem Link
ergänzen. Statt „In Kalender speichern" erscheint dann ein oranger „Anmelden"-Knopf:

```json
{
  "title": "Women's Brunch",
  "date": "2026-11-14",
  "hour": null,
  "minute": null,
  "timeLabel": null,
  "location": null,
  "noLocation": true,
  "signupUrl": "https://forms.cloud.microsoft/…",
  "desc": "Ein entspannter Brunch für alle Frauen, die Consult One kennenlernen möchten."
}
```

## Worauf du achten musst

Die Datei folgt festen Regeln. Die zwei häufigsten Fehler:

- **Komma zwischen den Terminen, aber nicht hinter dem letzten.** Jeder Termin steht
  in geschweiften Klammern `{ … }`. Zwischen zwei Terminen steht ein Komma, hinter
  dem letzten nicht.
- **Anführungszeichen nicht vergessen.** Text steht immer in `"doppelten
  Anführungszeichen"`. Nur Zahlen (`18`), `true`, `false` und `null` stehen ohne.

Wenn du unsicher bist: kopier dir einen bestehenden Termin und ändere nur den Inhalt.

**Wenn doch etwas schiefgeht, passiert nichts Schlimmes.** Bei einem Fehler in der
Datei zeigt die Website statt der Termine den Hinweis „Aktuell steht kein neuer Termin
fest" mit dem Link zum Bewerbungsformular. Die Seite bleibt vollständig benutzbar.
Du kannst den Fehler in Ruhe korrigieren oder über den Reiter **„Commits"** die letzte
funktionierende Version wiederherstellen.

## Alles andere ändern

Texte, Bilder und Seiten stehen in den `.html`-Dateien im Hauptordner:

| Datei | Seite |
|---|---|
| `index.html` | Startseite |
| `leistungen.html` | Leistungen |
| `ueber-uns.html` | Über uns |
| `fuer-studierende.html` | Für Studierende |
| `impressum.html` | Impressum & Datenschutz |

Diese Dateien enthalten Layout-Code. Kleine Textänderungen sind machbar, für alles
andere solltest du jemanden fragen, der sich mit HTML auskennt.

## Wo die Website liegt

- **Gehostet bei:** GitHub Pages, direkt aus diesem Repository. Kostenlos.
- **Domain:** `consult-one.de`, verwaltet bei united-domains.
- **E-Mail:** läuft über Microsoft 365 und hat mit der Website nichts zu tun.
  An den E-Mail-Einstellungen der Domain (MX, SPF, DKIM, autodiscover) darf
  **nichts** geändert werden, sonst kommen keine Mails mehr an.
