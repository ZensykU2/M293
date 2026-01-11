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
        return "Der Name ist " + this.name + "in diesem Ort:" + this.ort + "mit" + this.stockwerke + "stockerken und der höhe " + this.höhe + "bzw breite" + this.breite + "."
    }
}