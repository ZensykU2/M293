class Gebäude{
    constructor(name, ort, stockwerke, höhe, breite)
    {
        this.name = name
        this.ort = ort
        this.stockwerke = stockwerke
        this.höhe = höhe
        this.breite = breite
    }

    setName(name)
    {
        this.name = name;
    }

    detailsAnzeigen()
    {
        return "Der Name ist " + this.name + " in diesem Ort: " + this.ort + " mit " + this.stockwerke + " stockerken und der höhe " + this.höhe + "m bzw breite " + this.breite + " m."
    }
}

console.log("--- Einzeltest Gebäude-Objekt ---")
let gebäude1 = new Gebäude("", "Paris", "24", 200, 40)
console.log(gebäude1.detailsAnzeigen())
gebäude1.setName("Eiffelturm")
console.log(gebäude1.detailsAnzeigen())

const Quartier = {
    gebäuder: [],
    hinzufuegen: function (obj) {
        this.gebäuder.push(obj)
    },
    auflisten: function () {
        this.gebäuder.forEach(function (gebäude) {
            console.log(gebäude.detailsAnzeigen());
        });
    }
}

console.log("--- Quartier Test ---")
let gebäude2 = new Gebäude("Schule", "Köln", 2, 30, 300)
let gebäude3 = new Gebäude("Bibliothek", "Luzern", 4, 60, 200)
let gebäude4 = new Gebäude("", "Barcelona", 1, 150, 100)
gebäude4.setName("Kathedrale")

Quartier.hinzufuegen(gebäude1)
Quartier.hinzufuegen(gebäude2)
Quartier.hinzufuegen(gebäude3)
Quartier.hinzufuegen(gebäude4)

Quartier.auflisten()