﻿proces 

#5/1 
Besloten om categorieën niet meer te doen. Blijken niet in de dataset te staan en met de hand toevoegen is te veel werk. Nog nadenken over wat het gaat vervangen. 
Alle data gescraped. Besloten 2014 niet mee te tellen, omdat toen alle publieke omroep-zenders van naam zijn veranderd. Creeërt wellicht verwarring voor gebruiker. 
Besloten dat doel beter verwoord moet worden: het gaat om de top 50 meest bekende uitzendingen, niet programma's.

Mijn d3/javascript-kennis is blijkbaar erg weggezakt omdat ik Data Processing bijna een jaar geleden heb gevolgd. Ga ik morgen proberen op te frissen met hulp.

#6/1
D3 is inmiddels weer beter. Helft van het prototype gemaakt. Moet nog nadenken over welke kleuren ik wil gebruiken. Verder geen bijzonderheden. 

#7/1 
Alvast onderzoek gedaan naar het maken van knoppen van de ticks (om de jaargrafiek op te roepen) maar dat lijkt heel moeilijk. Toch de knoppen er onder? Of klikken op de lijn? Sommige dingen zijn nu nog gehardcode in het prototype. 

#8/1
Presentatie gehouden en design document gemaakt. Er moeten nog een aantal belangrijke dingen gebeuren. Sommige dingen werken wel maar zijn niet zo netjes, bijv het maken van een heel nieuw svg element ipv een g element. Alle data moet in één functie worden geladen, of moet het een variabele zijn? Misschien moet het hele programma binnen de functie staan die de data laadt. Waar ik ook over twijfel is of het wel slim is om 1 csv file te hebben per zender en 1 per jaar. Misschien moet dat allemaal bij elkaar in 2 csv's ? Ga ik maandag overleggen. 
Nog geen oplossing voor overlappende data. Ga ik mee werken als de rest het doet. Leuke ideeën gekregen nav presentatie: nieuwsevents toevoegen of iets met best bekeken programma's aller tijden.

#9/1 
Aantal slordigheden verbeterd. Besloten om queue.js te gebruiken voor inladen data. Nu worden alle lijnen weergegeven en kun je ze aan en uitzetten door op knoppen te klikken. Besloten om lijnen weer te geven/weg te halen door alleen opacity aan te passen. Ook mouseover gemaakt voor grafiek 1. Deze geeft nu alleen nog het jaar weer. 

#10/1
Besloten om niet van de ticks knoppen te maken, dat is slordig/onhandig. Knoppen staan nu los rechts van grafiek 2. Ik gebruik nu ook de library d3-tip om makkelijk mouseover-informatie te geven in grafiek 2. Die informatie klopt nu maar het is alleen nog een tekstobject. Moet nog kijken of je hier een rect achter kan maken oid of dat ik iets anders moet proberen.
Alle jaargrafieken kunnen nu worden weergegeven door op knoppen te klikken. Deze knop wordt geel als de corresponderende grafiek weergegeven wordt. 
Nu wordt nog de kleur van alle knoppen weer grijs gemaakt als er een nieuwe knop wordt aangeklikt. Misschien is het beter om de gele te zoeken en die grijs te maken ? Ik weet niet wat sneller is.
Ook een array gemaakt die bijhoudt of een grafiek al eerder is weergegeven of niet. Anders wordt data dubbel ingeladen en dat geeft error. 

#11/1
Vandaag de mouse over voor grafiek 1 afgemaakt. Het lukte niet in een rect dus ik heb er een div van gemaakt. De tekst in de mouse over verandert mee als je lijnen aan of uit zet. 
Een bug gefixt bij het lijnen aan en uit zetten: de data kan niet twee keer ingeladen worden. Daarom een array gemaakt om bij te houden of de data al eens ingeladen is of niet. Het is een array van enen die steeds bij het aan en uitzetten *-1 wordt gedaan om een toggle effect te creeëren. 

#12/1 
Vandaag grafiek 2 gemaakt. Je kunt nu op knoppen klikken om de top 50 per jaar te zien. Hiervoor moet steeds het domein van de x-as opnieuw worden berekend, omdat de data-elementen ook een jaar hebben. Het domein moet dus voor de data van 2002 lopen van 1 jan 2002 tot 31 dec 2002. Het is niet mogelijk om het jaar er af te knippen en gewoon 1 jan tot 31 dec te nemen.  

#13/1
Vandaag de mouse over voor grafiek 2 gemaakt. Dat doe ik met een library: d3.tip. Hiermee is de code heel kort.

#14/1
Vandaag de kleuren van grafiek 2 gemaakt: je kunt nu op Channel en Time klikken om de cirkels volgens die data te kleuren. In plaats van Category heb ik gekozen voor Day (of the week). Er staan geen categorieën in mijn gescrapete data en die zijn ook niet makkelijk te vinden. Het is te veel werk dat met de hand te doen. Dag van de week is wel makkelijk te vinden adhv de datum en voegt ook nog wat toe. 

#15/1
Vandaag de legenda's gemaakt voor bij grafiek 2. Ze worden nu steeds helemaal opnieuw getekend, ik ga kijken of dat efficiënter kan. Ook de lijnen van publiek vs commercieel gemaakt. Die data wordt nu ook nog best inefficiënt gemaakt. Ik weet nog niet of ik dat kan verbeteren. Het is nu nogal gehardcode maar het verschil tussen publiek en commercieel moet je ook wel hardcoden. 
Heb het vermoeden dat library d3.tip heel langzaam is. Bij pagina laden moet hij nl erg lang wachten op die site. Ik ga kijken of ik het zelf ook kan maken.

#18/1
Vandaag de commercieel vs publiek-lijnen afgemaakt. Ook de legenda en mouse over infobox worden aangepast als deze optie wordt aangeklikt. Probleem is nu dat het aan en uitklikken van lijnen dan niet meer werkt. Uiteindelijk opgelost door de on click functie aan te roepen in de functie die de legena tekent en niet erna. 

#19/1
Vandaag de twee grafieken aan elkaar gekoppeld. De mouse over op de eerste grafiek roept nu de tweede grafiek op. Hiervoor moest ik mijn hele programma omschrijven, omdat de data eerst in twee verschillende functies werd ingeladen. Nu moest het in één functie. Ook een transitie gemaakt voor het plaatsen van de bolletjes van grafiek 2. De transitie is alleen nog wel heel langzaam, ik weet niet waarom.

#20/1 
De transitie was langzaam vanwege de mouseover functie. Elke keer als de muis bewoog begon de transitie opnieuw. Nu een extra check gemaakt dat de transitie alleen begint als de muis op een ander jaar gaat staan. Ook de knoppen efficiënter gekleurd en ontkleurd op klik. Ipv selecteren op id, gewoon de kinderen van het this element gebruikt. Dit kan alleen niet met de jaarknoppen, omdat die ook door de eerste grafiek moeten worden aangeroepen.
Begonnen met de zoomfunctie voor grafiek 2. Dit is nog heel lastig, het werkt nu nog niet omdat ik mijn svg's raar heb ingedeeld. Dit moet dus eerst gefixt worden. 

#21/1
Zoomfunctie werkt inmiddels wel. Ik heb besloten alleen een verticale zoom toe te passen. De zoom is nl uitsluitend om de overlappende bolletjes individueel te kunnen zien. Alleen verticale zoom is overzichtelijker. 
De zoom werkt alleen nog wel raar: hij volgt niet de cursor maar gaat juist de andere kant op.

#25/1
Tekst bij de assen geplaatst en begonnen met het variabel maken van de widths (dus als percentage ipv vastgesteld aantal pixels). Dat is nog veel gedoe en alle code moet eigenlijk anders worden geschreven. Ik kom zo wel achter een aantal dingen die niet zo slim waren geprogrammeerd.

#26/1
Begonnen met een bootstrap website maken om de visualisatie in te stoppen. Is lastig, ik weet niets van bootstap. Toch wel wat verder gekomen. Ook de widths kloppen nu (op de 2e grafiek na.. daar krijg ik steeds errors. Heeft met de volgorde van het programma te maken). Nu werkt alleen ineens een van de legenda's niet meer en ik snap niet waarom niet.. Alle code gecheckt maaar nog niets gevonden. 

#27/1 
Probleem met legenda opgelost, er stond een variabele op een verkeerde plek. Een eenvoudige site gemaakt met bootstrap, ik vind het goed zo. Ik krijg alleen de columns niet even lang. De width van de tweede grafiek ook aangepast, alles werkt nu weer. Begonnen aan het verslag.

#28/1
Verslag afgemaakt, alle code nog eens doorgelopen en site afgemaakt. Ook license etc gemaakt. 
