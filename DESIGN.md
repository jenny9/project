# Design Document 
## Datavisualisatie 50 best bekeken tv-momenten door de jaren heen
Jenny Hasenack   
10367519    
08-01-2016
Programmeerproject   
Datavisualisatie   

## User Interface
De totale visualisatie ziet er als volgt uit. Als de gebruiker op de webpagina komt, is er één grafiek te zien. Dit is de grafiek van het aantal uitzendingen in de top 50 door de jaren heen. 
Bij binnenkomst op de webpagina is standaard de grafiek met de lijn van iedere zender te zien. Rechts naast de grafiek is een legenda. Hier staat een lijst van alle zenders die in ieder geval één keer met een uitzending in de top 50 zijn gekomen. In de legenda wordt verklaard welke kleur lijn bij welke zender hoort.
De gebruiker kan op de zenders in de legenda klikken. De lijn wordt dan weggehaald als hij is weergegeven, of juist getekend als hij nog niet zichtbaar was.
Onder de legenda zijn twee knoppen zichtbaar: "Publiek vs. commercieel" en "Zenders individueel". Standaard is "Zenders individueel" aangeklikt. Hiermee wordt er voor elke zender een aparte lijn getekend.
Als de gebruiker op "Publiek vs. commercieel" klikt, verdwijnen alle lijnen en verschijnen twee nieuwe lijnen. Deze bevatten respectievelijk de data van alle publieke omroepen (Ned1, Ned2, Ned3) opgeteld en die van alle commerciele omroepen (alle overige zenders). De legenda verandert dan; in plaats van een lijst met alle zenders worden hier nu alleen de twee kleuren van de publieke en commerciële lijnen verklaard.

Als de gebruiker met de cursor over de grafiek beweegt, verschijnt er (als de muis een bepaalde tijd stilstaat) een informatiebox met daarin de informatie van het jaar waar de cursor op dat moment het dichtst bij is. In de informatiebox wordt het jaar en het aantal uitzendingen in de top 50 per weergegeven lijn gegeven. Op het moment dat de gebruiker zijn cursor weer beweegt verdwijnt de informatiebox.

Onder de grafiek bevinden zich knoppen met de beschikbare jaartallen. Als de gebruiker op een van de knoppen klikt, verschijnt onder de lijngrafiek een andere grafiek. Deze grafiek geeft de top 50 best bekeken tv-momenten van het desbetreffende jaar weer. Alle datapunten worden gerepresenteerd als een cirkel. Als de gebruiker met zijn cursor in de cirkel komt, verschijnt (na een korte timeout) een informatebox. 
Hierin staat de volgende informatie weergegeven: titel, datum, tijd, zender, aantal kijkers. Als de gebruiker de cursor weer beweegt verdwijnt deze informatiebox. 
Naast de tweede grafiek staan een aantal knoppen: Channel, Time en Category. Op het moment dat de gebruiker op één van deze knoppen klikt, worden de cirkels ingekleurd voor hun waarde bij de desbetreffende knop. Voor Channel en Category zijn dat losse kleuren, voor Time zijn het kleuren uit een kleurenschaal. Er verschijnt tevens een legenda die de gebruikte kleuren verklaart. Als de gebruiker nogmaals op dezelfde knop klikt, verdwijnen de kleuren weer.

