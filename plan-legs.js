/* ============================================================
   Golden State Travel Rx — ROUTE LEGS
   ------------------------------------------------------------
   Each country is a REAL ROUTE: an ordered list of city "legs".
     c = city/base      n = suggested nights (weight)
     t = how you arrive (transit line shown on the travel day)
     e = [title, tag, hook]  — the things you actually do there
   The builder allocates the traveler's days across these legs in
   order, so you stay put and move forward — never ping-pong.
   Short trips take the first legs; long trips add legs AND
   lengthen stays. That's how real trips work.
   ============================================================ */

const LEGS = {

/* ── ASIA ── */
japan:[
  {c:"Tokyo",n:4,t:"Fly into Tokyo (Narita / Haneda)",e:[
    ["Senso-ji Temple & Asakusa","spiritual","Tokyo's oldest temple at dawn"],
    ["Shibuya Crossing & Harajuku","culture","the world's busiest intersection"],
    ["teamLab digital art museum","culture","immersive light-and-water rooms"],
    ["Tsukiji outer market & sushi","food","breakfast the way Tokyo does it"]]},
  {c:"Hakone",n:2,t:"Romancecar train to Hakone (1h30)",e:[
    ["Hakone onsen & Mt Fuji views","nature","hot springs under the mountain"],
    ["Lake Ashi & Owakudani","nature","a pirate ship and a volcanic valley"],
    ["Open-Air Museum","culture","sculpture against the mountains"]]},
  {c:"Kyoto",n:4,t:"Shinkansen to Kyoto (2h from Odawara)",e:[
    ["Fushimi Inari shrine","spiritual","thousands of vermilion gates"],
    ["Arashiyama bamboo grove","nature","towering green corridors"],
    ["Kinkaku-ji Golden Pavilion","history","gold temple on a mirror pond"],
    ["Gion at dusk","culture","lantern-lit lanes and teahouses"]]},
  {c:"Osaka",n:2,t:"Train to Osaka (30 min)",e:[
    ["Dotonbori street food","food","takoyaki, neon and canals"],
    ["Osaka Castle & park","history","the shogun's fortress"],
    ["Nara day trip","spiritual","bowing deer and the Great Buddha"]]}],

thailand:[
  {c:"Bangkok",n:3,t:"Fly into Bangkok (BKK)",e:[
    ["Grand Palace & Wat Pho","history","gilded halls & the reclining Buddha"],
    ["Street food & tuk-tuks","food","the world's best night eats"],
    ["Ayutthaya ruins day trip","history","temple ruins & stone Buddhas"],
    ["Floating & night markets","food","shop and eat from a boat"]]},
  {c:"Chiang Mai",n:3,t:"Short flight north to Chiang Mai (1h15)",e:[
    ["Old City temples","spiritual","hundreds of golden wats"],
    ["Ethical elephant sanctuary","nature","no riding, just rescue"],
    ["Doi Suthep & the night bazaar","culture","a temple above the city"]]},
  {c:"Phuket",n:3,t:"Fly south to Phuket (2h)",e:[
    ["Big Buddha & Old Town","culture","Sino-Portuguese streets"],
    ["Phang Nga Bay longtail","nature","limestone towers in green water"],
    ["Kata & Karon beach sunset","beach","Andaman evenings"]]},
  {c:"Koh Phi Phi",n:2,t:"Ferry to Phi Phi (2h)",e:[
    ["Maya Bay island hopping","beach","turquoise limestone coves"],
    ["Snorkel the coves","adventure","reef fish in clear shallows"],
    ["Phi Phi viewpoint hike","adventure","the twin bays from above"]]}],

vietnam:[
  {c:"Hanoi",n:3,t:"Fly into Hanoi (HAN)",e:[
    ["Old Quarter & street food","food","egg coffee & pho on plastic stools"],
    ["Hoan Kiem & Temple of Literature","history","the lake and the first university"],
    ["Water puppets & night market","culture","a thousand-year-old art form"]]},
  {c:"Ha Long Bay",n:2,t:"Drive to Ha Long (2h30)",e:[
    ["Overnight cruise on the bay","nature","limestone karsts on emerald water"],
    ["Kayak among the karsts","adventure","paddle into hidden lagoons"],
    ["Sung Sot cave","nature","the cave of surprises"]]},
  {c:"Hoi An",n:3,t:"Fly to Da Nang, drive to Hoi An (1h30)",e:[
    ["Lantern-lit old town","culture","tailors, lanterns, riverside"],
    ["Cooking class & tailoring","food","learn the local kitchen"],
    ["An Bang beach & My Son ruins","history","Cham temples and a quiet coast"]]},
  {c:"Ho Chi Minh City",n:3,t:"Fly south to Ho Chi Minh City (1h20)",e:[
    ["Cu Chi tunnels","history","the war underground"],
    ["War Remnants Museum & Reunification Palace","history","a hard, necessary day"],
    ["Mekong Delta day trip","nature","floating markets & canals"]]}],

indonesia:[
  {c:"Ubud",n:4,t:"Fly into Denpasar (DPS), drive to Ubud (1h15)",e:[
    ["Rice terraces & monkey forest","nature","emerald tiers & temples"],
    ["Tirta Empul water temple","spiritual","purification in spring water"],
    ["Mt Batur sunrise trek","adventure","above the clouds by dawn"],
    ["Ubud market & warung crawl","food","the island's kitchen"]]},
  {c:"Canggu",n:3,t:"Drive to the coast (1h)",e:[
    ["Surf lesson & beach clubs","beach","black-sand breaks"],
    ["Tanah Lot sunset","spiritual","a temple on a sea rock"],
    ["Seminyak dining & spa","food","warungs to fine dining"]]},
  {c:"Uluwatu",n:2,t:"Drive south to the Bukit (1h)",e:[
    ["Cliff temple & Kecak fire dance","spiritual","sunset ritual on the cliff"],
    ["Padang Padang & Bingin beaches","beach","cliffs and hidden coves"]]},
  {c:"Nusa Penida",n:3,t:"Fast boat to Nusa Penida (45 min)",e:[
    ["Kelingking cliff viewpoint","nature","the T-Rex cliff"],
    ["Snorkel with manta rays","adventure","glide with giants"],
    ["Gili Islands add-on","beach","turtles & no traffic"]]}],

india:[
  {c:"Delhi",n:3,t:"Fly into Delhi (DEL)",e:[
    ["Red Fort & Old Delhi","history","Mughal grandeur & bazaars"],
    ["Street food & spice markets","food","chaat, kebabs, chai"],
    ["Humayun's Tomb & Qutub Minar","history","the blueprint for the Taj"]]},
  {c:"Agra",n:2,t:"Express train to Agra (2h)",e:[
    ["Taj Mahal at sunrise","history","the marble wonder"],
    ["Agra Fort","history","where Shah Jahan was imprisoned"],
    ["Fatehpur Sikri","history","the abandoned red city"]]},
  {c:"Jaipur",n:3,t:"Drive to Jaipur (4h)",e:[
    ["Amber Fort & City Palace","history","the pink city's forts"],
    ["Bazaars & block-print shopping","culture","textiles and gems"],
    ["Hawa Mahal & Jantar Mantar","culture","the palace of winds"]]},
  {c:"Varanasi",n:2,t:"Fly to Varanasi (1h30)",e:[
    ["Ganges aarti ceremony","spiritual","fire ritual on the ghats"],
    ["Sunrise boat on the river","spiritual","the city waking on the water"],
    ["Sarnath","spiritual","where the Buddha first taught"]]},
  {c:"Kerala",n:4,t:"Fly south to Kochi (3h)",e:[
    ["Backwater houseboat","nature","palm-lined canals"],
    ["Fort Kochi & Kathakali","culture","Chinese nets and painted dancers"],
    ["Munnar tea plantations","nature","green hills to the horizon"]]}],

pakistan:[
  {c:"Lahore",n:3,t:"Fly into Lahore (LHE)",e:[
    ["Badshahi Mosque & Lahore Fort","history","Mughal capital splendor"],
    ["Old City food street","food","the subcontinent's great kitchen"],
    ["Wagah border ceremony","culture","the evening flag ritual"]]},
  {c:"Islamabad",n:2,t:"Motorway or short flight (4h / 1h)",e:[
    ["Faisal Mosque","spiritual","modern capital under the hills"],
    ["Margalla Hills hike","nature","the city from the ridge"],
    ["Taxila Gandharan ruins","history","Buddhist archaeology"]]},
  {c:"Hunza",n:4,t:"Fly to Gilgit, then the Karakoram Highway",e:[
    ["Karimabad & Baltit Fort","history","the valley's ancient seat"],
    ["Attabad Lake & Passu Cones","nature","turquoise water, jagged peaks"],
    ["Eagle's Nest sunrise","nature","Rakaposhi turning gold"]]},
  {c:"Skardu",n:3,t:"Fly or drive to Skardu",e:[
    ["Shangrila & Upper Kachura","nature","lakes in a high desert"],
    ["Deosai plains","adventure","the roof of the world"],
    ["Shigar Fort","history","a restored raja's palace"]]}],

nepal:[
  {c:"Kathmandu",n:3,t:"Fly into Kathmandu (KTM)",e:[
    ["Durbar Square & Thamel","history","temple squares & alleys"],
    ["Boudhanath & Pashupatinath","spiritual","the great stupa at dusk"],
    ["Bhaktapur day trip","history","Newari architecture preserved"]]},
  {c:"Pokhara",n:3,t:"Scenic flight or drive to Pokhara (30 min / 6h)",e:[
    ["Phewa Lake & Annapurna views","nature","peaks over still water"],
    ["Sarangkot sunrise","nature","the Himalaya turning pink"],
    ["Paragliding over the lake","adventure","fly with the mountains behind you"]]},
  {c:"The Himalaya",n:5,t:"Trek in — Annapurna or the Everest region",e:[
    ["Teahouse trail & acclimatization","adventure","gaining altitude the right way"],
    ["Poon Hill / Namche Bazaar","adventure","the gateway to the giants"],
    ["Mountain sunrise above the clouds","nature","why people come"]]},
  {c:"Chitwan",n:2,t:"Drive down to the Terai (5h)",e:[
    ["Jungle safari","nature","rhinos and tigers in the lowlands"],
    ["Canoe & birdlife","nature","drifting the Rapti river"],
    ["Tharu village & culture","culture","life on the jungle edge"]]}],

srilanka:[
  {c:"Colombo",n:2,t:"Fly into Colombo (CMB)",e:[
    ["Galle Face & the markets","culture","the coastal capital"],
    ["Gangaramaya temple","spiritual","an eclectic city temple"]]},
  {c:"Sigiriya",n:2,t:"Drive to the Cultural Triangle (4h)",e:[
    ["Lion Rock fortress","history","a palace on a 600-ft monolith"],
    ["Dambulla cave temple","spiritual","cave ceilings of golden Buddhas"],
    ["Minneriya elephant gathering","nature","herds on the tank bed"]]},
  {c:"Kandy",n:2,t:"Drive south to the hills (2h30)",e:[
    ["Temple of the Tooth","spiritual","Buddhism's great relic"],
    ["Botanical gardens & a tea factory","nature","Ceylon from leaf to cup"]]},
  {c:"Ella",n:3,t:"The hill-country train from Kandy (6h — the best ride in Asia)",e:[
    ["Nine Arch Bridge","culture","a viaduct in the jungle"],
    ["Little Adam's Peak","adventure","an easy climb, an enormous view"],
    ["Tea estates & waterfalls","nature","emerald terraces"]]},
  {c:"Galle & the south coast",n:3,t:"Drive to the coast (3h)",e:[
    ["Dutch fort & ramparts","history","colonial walls over the sea"],
    ["Mirissa whale watching","nature","blue whales offshore"],
    ["Yala leopard safari","nature","the densest leopard population on earth"]]}],

philippines:[
  {c:"Manila",n:2,t:"Fly into Manila (MNL)",e:[
    ["Intramuros walled city","history","Spanish colonial Manila"],
    ["Rizal Park & a food crawl","food","adobo, halo-halo, lechon"]]},
  {c:"Palawan",n:4,t:"Fly to El Nido / Puerto Princesa (1h30)",e:[
    ["El Nido island hopping","beach","limestone lagoons"],
    ["The Underground River","nature","a UNESCO subterranean river"],
    ["Nacpan Beach","beach","four kilometres of empty sand"]]},
  {c:"Bohol",n:3,t:"Fly via Cebu to Bohol (1h30)",e:[
    ["Chocolate Hills & tarsiers","nature","surreal hills, tiny primates"],
    ["Loboc river cruise","nature","lunch drifting downstream"],
    ["Panglao beach & diving","beach","white sand and reef walls"]]},
  {c:"Cebu",n:3,t:"Ferry to Cebu (2h)",e:[
    ["Kawasan Falls canyoneering","adventure","turquoise waterfall jumps"],
    ["Whale sharks at Oslob","nature","the gentle giants"],
    ["Magellan's Cross & the old city","history","where Christianity landed"]]}],

singapore:[
  {c:"Singapore",n:5,t:"Fly into Singapore (SIN)",e:[
    ["Gardens by the Bay Supertrees","nature","a light show in a garden"],
    ["Marina Bay Sands & the skyline","culture","the infinity-pool icon"],
    ["Hawker centre food crawl","food","Michelin-starred street food"],
    ["Chinatown & Little India","culture","four cultures in one city"],
    ["Sentosa Island","beach","beaches and theme parks"],
    ["Night Safari","nature","a nocturnal zoo by tram"],
    ["Botanic Gardens & orchids","nature","a UNESCO tropical garden"],
    ["Kampong Glam & Arab Street","culture","murals, mosque, boutiques"]]}],

southkorea:[
  {c:"Seoul",n:4,t:"Fly into Seoul (Incheon)",e:[
    ["Gyeongbokgung Palace","history","changing of the royal guard"],
    ["Bukchon Hanok Village","culture","tiled roofs & tea houses"],
    ["DMZ day tour","history","the world's tensest border"],
    ["Myeongdong & Gwangjang market","food","street food and skincare"]]},
  {c:"Gyeongju",n:2,t:"KTX train south (2h)",e:[
    ["Royal tombs & Bulguksa","history","Korea's museum without walls"],
    ["Anapji pond at night","culture","a palace reflected in water"]]},
  {c:"Busan",n:3,t:"Train to Busan (1h)",e:[
    ["Gamcheon culture village","culture","the pastel hillside"],
    ["Haeundae Beach & Jagalchi market","food","coastal city life"],
    ["Haedong Yonggungsa temple","spiritual","a temple on the sea cliffs"]]},
  {c:"Jeju",n:3,t:"Short flight to Jeju (1h)",e:[
    ["Seongsan Ilchulbong sunrise peak","nature","a crater over the sea"],
    ["Hallasan or the coastal trail","adventure","the island of stone and wind"],
    ["Manjanggul lava tube","nature","walk inside a volcano"]]}],

cambodia:[
  {c:"Siem Reap",n:3,t:"Fly into Siem Reap (SAI)",e:[
    ["Angkor Wat at sunrise","history","the largest religious monument on earth"],
    ["Ta Prohm & Bayon temples","history","tree roots and stone faces"],
    ["Tonlé Sap floating villages","nature","life on a lake that breathes"]]},
  {c:"Phnom Penh",n:3,t:"Drive or fly to the capital (5h / 45 min)",e:[
    ["Royal Palace & Silver Pagoda","culture","the riverside capital"],
    ["Tuol Sleng & the Killing Fields","history","a hard, necessary history"],
    ["Riverside & the central market","food","Khmer curry and river fish"]]},
  {c:"Battambang",n:2,t:"Drive north-west (5h)",e:[
    ["The bamboo train","adventure","rural Cambodia by rail"],
    ["Countryside & the bat caves","nature","a million bats at dusk"]]},
  {c:"Koh Rong",n:3,t:"Drive to Sihanoukville, ferry across (5h)",e:[
    ["Island beaches","beach","white sand and clear water"],
    ["Bioluminescent night swim","nature","the sea lights up around you"],
    ["Snorkel & island hop","adventure","reefs and empty coves"]]}],

maldives:[
  {c:"Malé",n:1,t:"Fly into Malé (MLE)",e:[
    ["Old Friday Mosque & fish market","culture","the compact capital"]]},
  {c:"North Atoll",n:4,t:"Seaplane or speedboat to the atoll",e:[
    ["Overwater villa & house reef","beach","the classic Maldives"],
    ["Sunset dolphin cruise","nature","spinner dolphins at golden hour"],
    ["Sandbank picnic","beach","a private strip of sand in open ocean"]]},
  {c:"Ari Atoll",n:3,t:"Transfer between atolls",e:[
    ["Manta & whale shark snorkel","adventure","swim with giants"],
    ["Night fishing & beach BBQ","food","reef fish grilled on the sand"],
    ["Bioluminescent beach walk","nature","the sea of stars"]]}],

/* ── EUROPE ── */
italy:[
  {c:"Rome",n:4,t:"Fly into Rome (Fiumicino)",e:[
    ["Colosseum & Roman Forum","history","2,000 years of empire"],
    ["Vatican & Sistine Chapel","culture","Michelangelo overhead"],
    ["Trastevere food walk","food","carbonara done right"],
    ["Trevi & Pantheon by night","culture","the city lit up"]]},
  {c:"Florence",n:3,t:"High-speed train to Florence (1h30)",e:[
    ["Uffizi Gallery & the Duomo","culture","Renaissance, then climb the dome"],
    ["Chianti wine country day","food","vineyards and hill towns"],
    ["Ponte Vecchio & the Oltrarno","culture","goldsmiths and artisans"]]},
  {c:"Venice",n:2,t:"Train to Venice (2h)",e:[
    ["Grand Canal & St Mark's","history","the floating city"],
    ["Murano & Burano islands","culture","glass blowers and painted houses"]]},
  {c:"Amalfi Coast",n:3,t:"Train to Naples, drive the coast (4h)",e:[
    ["Positano & the coast road","beach","cliffside pastel villages"],
    ["Capri boat day","nature","the Blue Grotto and the Faraglioni"],
    ["Pompeii","history","a city stopped mid-sentence"]]}],

france:[
  {c:"Paris",n:5,t:"Fly into Paris (CDG)",e:[
    ["Eiffel Tower & a Seine cruise","culture","the icon, then the river"],
    ["Louvre & the Tuileries","culture","Mona Lisa and masterpieces"],
    ["Montmartre & Sacré-Cœur","culture","the artists' hill"],
    ["Versailles day trip","history","Sun King opulence"],
    ["Le Marais food crawl","food","patisserie to wine bars"]]},
  {c:"Loire Valley",n:2,t:"Train to Tours (1h)",e:[
    ["Chambord & Chenonceau","history","fairy-tale châteaux"],
    ["Loire wine tasting","food","Vouvray and Sancerre at the source"]]},
  {c:"Provence",n:3,t:"TGV south to Avignon (3h)",e:[
    ["Lavender fields & hill villages","nature","purple rows to the horizon (summer)"],
    ["Avignon & the Pont du Gard","history","the popes' palace and a Roman aqueduct"],
    ["Market morning in Aix","food","olives, cheese, melon"]]},
  {c:"Nice",n:3,t:"Train along the coast (3h)",e:[
    ["The Riviera promenade","beach","azure coast & Old Nice"],
    ["Èze & Monaco day","culture","a clifftop village and a principality"],
    ["Cours Saleya market","food","socca and flowers"]]}],

spain:[
  {c:"Barcelona",n:4,t:"Fly into Barcelona (BCN)",e:[
    ["Sagrada Família","culture","Gaudí's unfinished masterpiece"],
    ["Park Güell & the Gothic Quarter","culture","mosaic city above the sea"],
    ["Tapas & vermouth crawl","food","small plates, big nights"],
    ["Montjuïc & the beach","nature","the city from the hill"]]},
  {c:"Madrid",n:3,t:"AVE high-speed train (2h30)",e:[
    ["Prado & Retiro Park","culture","Velázquez and green lawns"],
    ["Mercado & late-night plazas","food","jamón, churros, midnight"],
    ["Toledo day trip","history","three cultures on a hill"]]},
  {c:"Seville",n:3,t:"AVE train south (2h30)",e:[
    ["Real Alcázar & the cathedral","history","a Moorish palace and a Gothic giant"],
    ["Flamenco in Triana","culture","the real thing, in a small room"],
    ["Plaza de España & the barrio","culture","tiles and orange trees"]]},
  {c:"Granada",n:2,t:"Train or drive east (3h)",e:[
    ["The Alhambra","history","the finest Moorish fortress on earth"],
    ["Albaicín sunset at San Nicolás","culture","the Alhambra against the Sierra Nevada"]]}],

greece:[
  {c:"Athens",n:3,t:"Fly into Athens (ATH)",e:[
    ["Acropolis & Parthenon","history","the birthplace of democracy"],
    ["Plaka old town","culture","neighborhoods under the rock"],
    ["Delphi day trip","history","the ancient oracle on Mt Parnassus"]]},
  {c:"Santorini",n:3,t:"Ferry or short flight (5h / 45 min)",e:[
    ["Oia sunset & the caldera","beach","the famous blue domes"],
    ["Wine & volcano boat","food","volcanic-soil vintages"],
    ["Akrotiri ruins","history","the Bronze Age Pompeii"]]},
  {c:"Mykonos",n:3,t:"Ferry between the islands (2h30)",e:[
    ["Beaches & the windmills","beach","whitewashed island days"],
    ["Delos island day","history","the sacred island"],
    ["Old town at night","culture","Little Venice at the waterline"]]},
  {c:"Crete",n:3,t:"Ferry or flight to Crete (2h / 45 min)",e:[
    ["Knossos & Minoan ruins","history","Europe's oldest palace"],
    ["Samaria Gorge or Balos beach","adventure","a canyon walk or a pink lagoon"],
    ["Chania old harbor","food","Venetian streets and Cretan food"]]}],

portugal:[
  {c:"Lisbon",n:4,t:"Fly into Lisbon (LIS)",e:[
    ["Alfama & tram 28","culture","fado alleys and yellow trams"],
    ["Belém Tower & pastéis","food","the original custard tart"],
    ["Sintra & Pena Palace day","history","a candy-colored hilltop palace"],
    ["LX Factory & the miradouros","culture","viewpoints at golden hour"]]},
  {c:"Porto",n:3,t:"Train north to Porto (3h)",e:[
    ["Port wine cellars","food","tawny tastings across the river"],
    ["Livraria Lello & Ribeira","culture","the world's prettiest bookshop"],
    ["Francesinha & the riverfront","food","Porto's absurd, glorious sandwich"]]},
  {c:"Douro Valley",n:2,t:"Train up the river valley (2h)",e:[
    ["Valley wine cruise","nature","terraced vineyards to the water"],
    ["Quinta tasting & lunch","food","the vineyard at the source"]]},
  {c:"The Algarve",n:3,t:"Fly or drive south (1h / 6h)",e:[
    ["Benagil sea caves","nature","golden cliffs & grottoes"],
    ["Beach & cliff walk","beach","Atlantic coves"],
    ["Lagos old town","culture","cobbles and seafood"]]}],

uk:[
  {c:"London",n:4,t:"Fly into London (Heathrow)",e:[
    ["Tower of London & Tower Bridge","history","the crown jewels"],
    ["Westminster & Buckingham Palace","culture","the changing of the guard"],
    ["The British Museum","culture","the world under one roof"],
    ["Borough Market & the pubs","food","the city's larder"]]},
  {c:"Bath",n:2,t:"Train west (1h30)",e:[
    ["Roman Baths & the Georgian city","history","the ancient thermal spring"],
    ["Stonehenge & the Cotswolds","history","standing stones and honey-stone villages"]]},
  {c:"Edinburgh",n:3,t:"Train north to Scotland (4h30)",e:[
    ["The Castle & Royal Mile","history","the volcanic-rock fortress"],
    ["Arthur's Seat climb","adventure","the city from an extinct volcano"],
    ["Whisky & the Old Town","food","a dram in a close"]]},
  {c:"The Highlands",n:3,t:"Drive or rail into the Highlands",e:[
    ["Loch Ness & Glencoe","nature","glens, lochs and mist"],
    ["Isle of Skye","nature","the Quiraing and the Old Man of Storr"],
    ["Distillery tour","food","peat, smoke and Speyside"]]}],

germany:[
  {c:"Berlin",n:4,t:"Fly into Berlin (BER)",e:[
    ["Brandenburg Gate & the Wall","history","the divided century"],
    ["Museum Island","culture","five museums on one island"],
    ["Kreuzberg food & nightlife","food","döner, dive bars, techno"],
    ["Reichstag dome","culture","glass over the parliament"]]},
  {c:"Dresden",n:2,t:"Train south (2h)",e:[
    ["Baroque old town","history","rebuilt from the ashes"],
    ["Saxon Switzerland hike","nature","sandstone towers over the Elbe"]]},
  {c:"Munich",n:3,t:"Train to Bavaria (4h30)",e:[
    ["Marienplatz & the beer halls","food","pretzels and lager"],
    ["English Garden & the Isar","nature","surfers on a city river"],
    ["Dachau memorial","history","a necessary morning"]]},
  {c:"Bavaria",n:3,t:"Drive into the Alps",e:[
    ["Neuschwanstein Castle","history","the fairy-tale castle"],
    ["Black Forest villages","nature","dark pines and cuckoo clocks"],
    ["Rhine Valley castle cruise","nature","vineyards and fortresses"]]}],

switzerland:[
  {c:"Zurich",n:2,t:"Fly into Zurich (ZRH)",e:[
    ["Old Town & the lake","culture","the elegant financial capital"],
    ["Lindenhof & Bahnhofstrasse","culture","chocolate, watches, and a view"]]},
  {c:"Lucerne",n:2,t:"Train to Lucerne (45 min)",e:[
    ["Chapel Bridge & Mt Pilatus","nature","the postcard lake town"],
    ["Lake steamer cruise","nature","paddle-steamers under the peaks"]]},
  {c:"Interlaken",n:3,t:"Scenic rail into the Bernese Oberland (2h)",e:[
    ["Jungfraujoch — Top of Europe","adventure","a railway to 11,300 ft"],
    ["Grindelwald First cliff walk","adventure","the Eiger over your shoulder"],
    ["Lauterbrunnen valley","nature","72 waterfalls in one valley"]]},
  {c:"Zermatt",n:3,t:"Train to car-free Zermatt (3h)",e:[
    ["The Matterhorn & Gornergrat","nature","the world's most famous peak"],
    ["Alpine hiking above the village","adventure","five-lakes trail"],
    ["Glacier Paradise","adventure","Europe's highest cable car station"]]}],

iceland:[
  {c:"Reykjavík",n:2,t:"Fly into Keflavík (KEF)",e:[
    ["Hallgrímskirkja & the old harbor","culture","the northernmost capital"],
    ["Blue Lagoon geothermal spa","nature","milky-blue water in a lava field"]]},
  {c:"The Golden Circle",n:2,t:"Pick up the car and drive east",e:[
    ["Geysir & Gullfoss","nature","erupting geysers and a thundering falls"],
    ["Þingvellir rift valley","history","where two continents pull apart"]]},
  {c:"The South Coast",n:3,t:"Ring Road south-east",e:[
    ["Seljalandsfoss & Skógafoss","nature","walk behind a waterfall"],
    ["Reynisfjara black sand","beach","basalt columns and Atlantic surf"],
    ["Vík & Dyrhólaey","nature","puffins on a sea arch"]]},
  {c:"Jökulsárlón",n:2,t:"Continue east along the Ring Road",e:[
    ["Glacier lagoon & Diamond Beach","nature","icebergs stranded on black sand"],
    ["Vatnajökull ice cave","adventure","blue ice underfoot"]]},
  {c:"The North",n:2,t:"Drive or fly north (Akureyri)",e:[
    ["Húsavík whale watching","nature","humpbacks in the Arctic"],
    ["Mývatn nature baths","nature","the quiet Blue Lagoon"],
    ["Northern lights hunt (winter)","nature","aurora over the snow"]]}],

croatia:[
  {c:"Zagreb",n:2,t:"Fly into Zagreb (ZAG)",e:[
    ["Upper Town & the markets","culture","the underrated capital"],
    ["Museums & café culture","culture","the longest coffee in Europe"]]},
  {c:"Plitvice",n:1,t:"Drive south to the lakes (2h)",e:[
    ["Lakes & waterfall boardwalks","nature","turquoise terraced lakes"]]},
  {c:"Split",n:3,t:"Continue to the coast (2h30)",e:[
    ["Diocletian's Palace","history","a Roman palace you live inside"],
    ["Krka waterfalls day","nature","swim below the falls"],
    ["Marjan hill & the beaches","nature","pine forest over the Adriatic"]]},
  {c:"Hvar",n:2,t:"Ferry to Hvar (1h)",e:[
    ["Island beaches & lavender","beach","the sunniest island"],
    ["Pakleni islands boat","adventure","hidden coves by boat"]]},
  {c:"Dubrovnik",n:3,t:"Ferry or drive down the coast (3h)",e:[
    ["City walls & Old Town","history","the pearl of the Adriatic"],
    ["Cable car & an island boat","nature","the coast from above"],
    ["Lokrum & a sea kayak","adventure","paddle under the walls"]]}],

ireland:[
  {c:"Dublin",n:3,t:"Fly into Dublin (DUB)",e:[
    ["Trinity College & the Book of Kells","culture","the Long Room library"],
    ["Temple Bar & a trad session","food","live music and stout"],
    ["Guinness Storehouse","food","a pint at the Gravity Bar"]]},
  {c:"Galway",n:3,t:"Drive west across the country (2h30)",e:[
    ["Latin Quarter & the bay","culture","the west coast's heart"],
    ["Cliffs of Moher","nature","700 ft straight down"],
    ["Connemara","nature","bogs, lakes and stone walls"]]},
  {c:"Ring of Kerry",n:3,t:"Drive south-west (3h)",e:[
    ["The coastal drive","nature","mountains meeting the sea"],
    ["Killarney National Park","nature","lakes, oak woods and red deer"],
    ["Dingle peninsula","nature","Slea Head and the Atlantic"]]},
  {c:"The North Coast",n:2,t:"Drive north to Antrim (5h)",e:[
    ["Giant's Causeway","nature","40,000 basalt columns"],
    ["Belfast & the Titanic Quarter","history","where the ship was built"]]}],

/* ── MIDDLE EAST & AFRICA ── */
turkey:[
  {c:"Istanbul",n:4,t:"Fly into Istanbul (IST)",e:[
    ["Hagia Sophia","history","1,500 years of empire in one dome"],
    ["Blue Mosque & the Hippodrome","spiritual","six minarets & Iznik tile"],
    ["The Grand Bazaar","culture","4,000 shops of lanterns & rugs"],
    ["Bosphorus cruise","nature","sail between two continents"]]},
  {c:"Cappadocia",n:3,t:"Short flight to Kayseri / Nevşehir (1h30)",e:[
    ["Hot-air balloon at sunrise","adventure","hundreds of balloons over fairy chimneys"],
    ["Cave hotels & the valleys","nature","sleep in carved rock"],
    ["Underground city","history","an eight-level city beneath the rock"]]},
  {c:"Pamukkale",n:2,t:"Drive or fly west (7h / 1h via Denizli)",e:[
    ["White travertine terraces","nature","thermal pools on a cliff"],
    ["Hierapolis ruins","history","a Roman spa city"]]},
  {c:"Ephesus",n:2,t:"Drive to Selçuk (3h)",e:[
    ["The ancient Roman city","history","the Library of Celsus"],
    ["Şirince village & wine","food","hill village fruit wines"]]}],

egypt:[
  {c:"Cairo",n:3,t:"Fly into Cairo (CAI)",e:[
    ["Pyramids of Giza & the Sphinx","history","the last ancient wonder"],
    ["Grand Egyptian Museum","culture","Tutankhamun's treasures"],
    ["Khan el-Khalili bazaar","culture","brass, spice and mint tea"]]},
  {c:"Luxor",n:3,t:"Short flight south (1h)",e:[
    ["Valley of the Kings","history","the pharaohs' tombs"],
    ["Karnak Temple","history","the great hypostyle hall"],
    ["Balloon over the West Bank","adventure","sunrise over the necropolis"]]},
  {c:"The Nile",n:3,t:"Board the river cruise at Luxor",e:[
    ["Multi-day river cruise","nature","temples between Luxor and Aswan"],
    ["Edfu & Kom Ombo temples","history","stops along the river"]]},
  {c:"Aswan",n:2,t:"Disembark at Aswan",e:[
    ["Felucca sail at sunset","nature","white sails on the Nile"],
    ["Abu Simbel","history","colossal rock-cut facades"],
    ["Philae Temple","spiritual","a temple moved island by island"]]},
  {c:"The Red Sea",n:3,t:"Drive or fly to Hurghada (4h / 1h)",e:[
    ["Reef diving","adventure","coral walls and clear water"],
    ["Snorkel & beach day","beach","the Red Sea's warm shallows"]]}],

morocco:[
  {c:"Marrakech",n:3,t:"Fly into Marrakech (RAK)",e:[
    ["Jemaa el-Fnaa & the souks","culture","snake charmers & lantern stalls"],
    ["Majorelle Garden & the palaces","culture","a cobalt-blue oasis"],
    ["Cooking class & hammam","food","tagine, then a steam"]]},
  {c:"The Sahara",n:3,t:"Drive over the Atlas to Merzouga (9h)",e:[
    ["Merzouga desert camp","adventure","camels & dunes under the stars"],
    ["Sunrise over the erg","nature","the dunes turning gold"],
    ["Atlas Berber villages","culture","Aït Benhaddou and the kasbahs"]]},
  {c:"Fes",n:3,t:"Drive north to Fes (7h)",e:[
    ["The medina & tanneries","history","the largest car-free old town on earth"],
    ["Al-Qarawiyyin & the artisan quarters","culture","the world's oldest university"],
    ["Volubilis Roman ruins","history","mosaics in a wheat field"]]},
  {c:"Chefchaouen",n:2,t:"Drive into the Rif mountains (4h)",e:[
    ["The blue city","culture","indigo-washed mountain town"],
    ["Rif mountain viewpoint","nature","the town from the Spanish mosque"]]},
  {c:"Essaouira",n:2,t:"Drive to the Atlantic (6h)",e:[
    ["Coastal ramparts","history","a windswept Atlantic port"],
    ["Seafood port & the beach","food","grilled sardines on the quay"]]}],

jordan:[
  {c:"Amman",n:2,t:"Fly into Amman (AMM)",e:[
    ["The Citadel & Roman theater","history","layers of empire"],
    ["Jerash Roman ruins","history","the best-preserved Roman city outside Italy"],
    ["Mount Nebo","spiritual","where Moses saw the promised land"]]},
  {c:"Petra",n:3,t:"Drive south on the Desert Highway (3h)",e:[
    ["The Treasury through the Siq","history","a rose-red city half as old as time"],
    ["The Monastery climb","adventure","800 steps to the summit"],
    ["Petra by candlelight","culture","1,500 candles in the canyon"]]},
  {c:"Wadi Rum",n:2,t:"Drive into the desert (2h)",e:[
    ["Desert jeep & Bedouin camp","adventure","Mars on earth"],
    ["Sunrise over the dunes","nature","red sand and sandstone towers"]]},
  {c:"The Dead Sea",n:2,t:"Drive north to the shore (4h)",e:[
    ["Float & mud spa","nature","the lowest point on earth"],
    ["Ma'in hot springs","nature","a waterfall you can stand under"]]},
  {c:"Aqaba",n:2,t:"Drive south to the Red Sea (4h)",e:[
    ["Red Sea diving","adventure","coral on the Gulf"],
    ["Reef snorkel & the corniche","beach","warm water, easy days"]]}],

uae:[
  {c:"Dubai",n:4,t:"Fly into Dubai (DXB)",e:[
    ["Burj Khalifa observation deck","culture","the world's tallest building"],
    ["Desert safari & dune bashing","adventure","4x4s and falcons at sunset"],
    ["Old Dubai souks & the abra","culture","gold, spice and a wooden boat"],
    ["Palm Jumeirah & beach clubs","beach","the man-made island"]]},
  {c:"Abu Dhabi",n:2,t:"Drive down the coast (1h30)",e:[
    ["Sheikh Zayed Grand Mosque","spiritual","white marble and inlay"],
    ["Louvre Abu Dhabi","culture","a dome that rains light"],
    ["Corniche & Qasr Al Watan","culture","the presidential palace"]]},
  {c:"Hatta",n:1,t:"Drive into the Hajar mountains (1h30)",e:[
    ["Mountain kayaking","adventure","turquoise dam water"]]}],

southafrica:[
  {c:"Cape Town",n:4,t:"Fly into Cape Town (CPT)",e:[
    ["Table Mountain cable car","nature","the flat-topped icon"],
    ["Cape Point & Boulders penguins","nature","two oceans and a penguin colony"],
    ["V&A Waterfront & Bo-Kaap","culture","painted houses and Cape Malay food"]]},
  {c:"The Winelands",n:2,t:"Drive inland to Stellenbosch (1h)",e:[
    ["Stellenbosch tasting","food","world-class wine an hour from the city"],
    ["Franschhoek wine tram","food","a hop-on tram between estates"]]},
  {c:"The Garden Route",n:3,t:"Drive east along the coast",e:[
    ["Coastal drive & Knysna","nature","forest meeting the sea"],
    ["Tsitsikamma & Storms River","adventure","suspension bridges over a gorge"],
    ["Hermanus whale watching","nature","southern rights from the cliffs"]]},
  {c:"Kruger",n:4,t:"Fly to Kruger / Nelspruit (2h)",e:[
    ["Big Five game drives","nature","lion, leopard, rhino, elephant, buffalo"],
    ["Sunrise drive & a bush walk","adventure","the bush on foot"],
    ["Panorama Route & Blyde Canyon","nature","the third-largest canyon on earth"]]},
  {c:"Johannesburg",n:2,t:"Drive or fly to Joburg (4h / 1h)",e:[
    ["Apartheid Museum & Soweto","history","the hard, essential history"],
    ["Cradle of Humankind","history","where our species begins"]]}],

kenya:[
  {c:"Nairobi",n:2,t:"Fly into Nairobi (NBO)",e:[
    ["Elephant orphanage & giraffe centre","nature","conservation up close"],
    ["Karen Blixen & Nairobi National Park","culture","lions with a skyline behind them"]]},
  {c:"Maasai Mara",n:4,t:"Bush flight to the Mara (1h)",e:[
    ["Great Migration game drives","nature","the greatest wildlife show on earth"],
    ["Hot-air balloon safari","adventure","dawn over the savanna"],
    ["Maasai village visit","culture","meet the community"]]},
  {c:"Amboseli",n:2,t:"Bush flight south (1h)",e:[
    ["Elephants under Kilimanjaro","nature","the classic Africa photograph"],
    ["Sunrise game drive","nature","the mountain clear at first light"]]},
  {c:"Lake Nakuru",n:2,t:"Drive into the Rift Valley (4h)",e:[
    ["Flamingos & rhino","nature","a pink lake"],
    ["Rift Valley viewpoint","nature","the great crack in the continent"]]},
  {c:"Diani",n:3,t:"Fly to the coast (1h30)",e:[
    ["Indian Ocean beach","beach","white sand after the bush"],
    ["Dhow sail & snorkel","adventure","reef and a wooden sail"]]}],

tanzania:[
  {c:"Arusha",n:2,t:"Fly into Kilimanjaro (JRO)",e:[
    ["Gateway markets & coffee farms","culture","the safari launch point"],
    ["Arusha National Park","nature","a gentle first game drive"]]},
  {c:"Serengeti",n:3,t:"Bush flight into the Serengeti (1h)",e:[
    ["Migration & big-cat drives","nature","endless plains"],
    ["Balloon safari at dawn","adventure","float over the herds"],
    ["Tarangire baobabs & elephants","nature","ancient trees, huge herds"]]},
  {c:"Ngorongoro",n:2,t:"Drive to the crater rim (3h)",e:[
    ["Crater floor game drive","nature","a caldera full of wildlife"],
    ["Maasai boma visit","culture","life on the crater highlands"]]},
  {c:"Zanzibar",n:4,t:"Fly to Zanzibar (1h30)",e:[
    ["Stone Town & spice tour","history","a Swahili trading city"],
    ["Nungwi beach & dhow sunset","beach","turquoise Indian Ocean"],
    ["Snorkel Mnemba atoll","adventure","dolphins and reef"]]},
  {c:"Kilimanjaro",n:6,t:"Return to Moshi and begin the trek",e:[
    ["Machame route trek","adventure","the roof of Africa, 19,341 ft"],
    ["Acclimatization days","adventure","climb high, sleep low"],
    ["Summit night","adventure","Uhuru Peak at sunrise"]]}],

/* ── AMERICAS ── */
mexico:[
  {c:"Mexico City",n:4,t:"Fly into Mexico City (MEX)",e:[
    ["Zócalo & the historic center","history","the Aztec-Spanish heart"],
    ["Teotihuacan pyramids","history","climb the Sun and the Moon"],
    ["Roma–Condesa food tour","food","tacos al pastor & mezcal"],
    ["Frida Kahlo & Coyoacán","culture","the Blue House"]]},
  {c:"Oaxaca",n:3,t:"Short flight south (1h)",e:[
    ["Markets & mezcal","food","mole and craft spirits"],
    ["Monte Albán ruins","history","a Zapotec city on a flattened mountain"],
    ["Hierve el Agua","nature","petrified waterfalls and mineral pools"]]},
  {c:"Riviera Maya",n:4,t:"Fly to Cancún, drive south (2h)",e:[
    ["Cenote swimming","nature","crystal underground pools"],
    ["Tulum cliffside ruins","history","temples over the Caribbean"],
    ["Chichén Itzá","history","a wonder of the world"]]},
  {c:"Cancún",n:2,t:"Drive back up the coast (1h30)",e:[
    ["Beach & reef day","beach","white sand & snorkeling"],
    ["Isla Mujeres boat","beach","a slower island across the water"]]}],

peru:[
  {c:"Lima",n:2,t:"Fly into Lima (LIM)",e:[
    ["Miraflores & the food scene","food","world-capital ceviche"],
    ["Barranco art district","culture","murals & pisco bars"]]},
  {c:"Cusco",n:3,t:"Fly to Cusco (1h20) — you land at 11,150 ft, so day one is deliberately easy",e:[
    ["Acclimatize & San Blas","culture","cobblestones and coca tea"],
    ["Saqsaywamán ruins","history","megalithic Inca stonework"],
    ["Rainbow Mountain trek","adventure","striped peaks above 17,000 ft"]]},
  {c:"Sacred Valley",n:2,t:"Drive down into the valley (1h) — lower and easier to sleep",e:[
    ["Pisac market & ruins","history","terraces stacked up a mountain"],
    ["Ollantaytambo fortress","history","the last Inca stronghold"],
    ["Maras salt pans","nature","thousands of white terraces"]]},
  {c:"Machu Picchu",n:2,t:"Train through the canyon to Aguas Calientes (1h30)",e:[
    ["The lost citadel","history","the Andes' crown jewel"],
    ["Huayna Picchu climb","adventure","the peak behind the postcard"]]},
  {c:"Lake Titicaca",n:2,t:"Train or drive to Puno (7h)",e:[
    ["Uros floating islands","culture","reed islands on the lake"],
    ["Taquile island","culture","weavers at 12,500 ft"]]}],

costarica:[
  {c:"San José",n:1,t:"Fly into San José (SJO)",e:[
    ["Central market & the museums","culture","the compact capital"]]},
  {c:"Arenal",n:3,t:"Drive north to La Fortuna (3h)",e:[
    ["Volcano & hot springs","nature","lava-heated pools"],
    ["Hanging bridges & zipline","adventure","the canopy from above"],
    ["La Fortuna waterfall","nature","500 steps down to a blue pool"]]},
  {c:"Monteverde",n:2,t:"Jeep–boat–jeep across the lake (3h)",e:[
    ["Cloud forest reserve","nature","walk inside a cloud"],
    ["Night walk & sloths","nature","the forest after dark"]]},
  {c:"Manuel Antonio",n:3,t:"Drive to the Pacific coast (4h)",e:[
    ["Beach & sloth spotting","beach","rainforest meeting the Pacific"],
    ["Rainforest trails","nature","capuchins and scarlet macaws"]]},
  {c:"Osa / Tortuguero",n:3,t:"Fly to the remote coast (1h)",e:[
    ["Corcovado wildlife","nature","the most biodiverse place on earth"],
    ["Turtle nesting & the canals","nature","the Amazon of Costa Rica"],
    ["Kayak the mangroves","adventure","paddle into the roots"]]}],

brazil:[
  {c:"Rio de Janeiro",n:4,t:"Fly into Rio (GIG)",e:[
    ["Christ the Redeemer & Corcovado","culture","the city from the statue's feet"],
    ["Sugarloaf cable car","nature","two peaks, one bay"],
    ["Copacabana & Ipanema","beach","the world's most famous sand"],
    ["Santa Teresa & the Selarón steps","culture","tiles from every country"]]},
  {c:"Iguazu",n:2,t:"Fly to Foz do Iguaçu (2h)",e:[
    ["The falls, Brazil side","nature","275 waterfalls at once"],
    ["Devil's Throat & the boat ride","adventure","straight into the spray"]]},
  {c:"Salvador",n:3,t:"Fly north to Bahia (3h)",e:[
    ["Pelourinho & capoeira","culture","the Afro-Brazilian heart"],
    ["Drums, moqueca and the old city","food","Bahian food and rhythm"]]},
  {c:"The Amazon",n:3,t:"Fly to Manaus (3h)",e:[
    ["Jungle lodge","nature","the forest at night"],
    ["Meeting of the waters","nature","two rivers that refuse to mix"],
    ["Canoe & night wildlife","adventure","caiman eyes in the torchlight"]]},
  {c:"São Paulo",n:2,t:"Fly south (4h)",e:[
    ["Food scene & street art","food","South America's great kitchen"],
    ["MASP & Ibirapuera","culture","art on red beams, park on Sunday"]]}],

colombia:[
  {c:"Cartagena",n:3,t:"Fly into Cartagena (CTG)",e:[
    ["Walled Old City & Getsemaní","history","Caribbean colonial color"],
    ["Rosario Islands boat day","beach","turquoise Caribbean water"],
    ["Rooftop sunset & ceviche","food","the old city from above"]]},
  {c:"Tayrona & Santa Marta",n:3,t:"Drive up the coast (4h)",e:[
    ["Jungle-meets-Caribbean beaches","beach","hammocks under the palms"],
    ["Minca waterfalls & coffee","nature","a cool green hill town"],
    ["Lost City trek (add-on)","adventure","four days into the Sierra Nevada"]]},
  {c:"Medellín",n:3,t:"Fly to Medellín (1h30)",e:[
    ["Comuna 13 & the cable cars","culture","the transformation story"],
    ["Guatapé & El Peñol rock","nature","740 steps, an unreal view"],
    ["Botero Plaza & Museo de Antioquia","culture","the sculptor's hometown"]]},
  {c:"The Coffee Region",n:3,t:"Drive or fly to Pereira / Salento (1h)",e:[
    ["Cocora Valley wax palms","nature","the world's tallest palms"],
    ["Finca coffee tour","food","from cherry to cup"],
    ["Salento & Filandia villages","culture","painted balconies and tejo"]]},
  {c:"Bogotá",n:3,t:"Fly to Bogotá (1h) — you climb to 8,600 ft, so take it slow",e:[
    ["La Candelaria & the Gold Museum","culture","the high-altitude capital"],
    ["Monserrate & city views","nature","the whole city from 10,300 ft"],
    ["Zipaquirá salt cathedral","spiritual","a cathedral carved in a salt mine"]]}],

argentina:[
  {c:"Buenos Aires",n:4,t:"Fly into Buenos Aires (EZE)",e:[
    ["San Telmo & tango","culture","the milonga at midnight"],
    ["Recoleta & La Boca","history","Evita's tomb, painted streets"],
    ["Parrilla & Malbec night","food","the world's best steak"],
    ["Palermo cafés & bookshops","culture","El Ateneo in an old theatre"]]},
  {c:"Iguazu",n:2,t:"Fly north to Puerto Iguazú (2h)",e:[
    ["The falls, Argentina side","nature","the Devil's Throat up close"],
    ["Jungle walkways & the boat","adventure","under the cascades"]]},
  {c:"Mendoza",n:3,t:"Fly across to wine country (2h30)",e:[
    ["Malbec wine country","food","vineyards under the Andes"],
    ["Andes foothills & asado","nature","lunch with a mountain view"]]},
  {c:"El Calafate",n:3,t:"Fly south to Patagonia (3h)",e:[
    ["Perito Moreno glacier","nature","a glacier that calves as you watch"],
    ["Boat among the icebergs","adventure","blue ice at eye level"]]},
  {c:"El Chaltén",n:3,t:"Drive north to the trekking capital (3h)",e:[
    ["Fitz Roy trek","adventure","Patagonia's granite spires"],
    ["Laguna de los Tres","adventure","the payoff view"]]}],

dominicanrepublic:[
  {c:"Santo Domingo",n:2,t:"Fly into Santo Domingo (SDQ)",e:[
    ["Zona Colonial","history","the oldest European city in the Americas"],
    ["Merengue & the mercado","food","the island's rhythm"]]},
  {c:"Punta Cana",n:4,t:"Drive east to the coast (2h30)",e:[
    ["Bávaro Beach & the reef","beach","the classic Caribbean strip"],
    ["Saona Island boat","beach","a postcard sandbar"],
    ["Hoyo Azul cenote","nature","a blue sinkhole in the cliff"]]},
  {c:"Samaná",n:3,t:"Drive north-west (3h)",e:[
    ["Whale watching (seasonal)","nature","humpbacks in the bay"],
    ["El Limón waterfall ride","adventure","horseback to a jungle cascade"],
    ["Playa Rincón","beach","one of the Caribbean's best beaches"]]},
  {c:"Puerto Plata",n:2,t:"Drive along the north coast (3h)",e:[
    ["Cable car & the fort","culture","the amber coast"],
    ["Damajagua waterfalls","adventure","27 jumps and slides"]]}],

chile:[
  {c:"Santiago",n:3,t:"Fly into Santiago (SCL)",e:[
    ["Bellavista & Cerro San Cristóbal","culture","the Andes over the city"],
    ["Casablanca wine valley","food","cool-climate Chilean whites"],
    ["Central market & Neruda's house","food","seafood and a poet's home"]]},
  {c:"Valparaíso",n:2,t:"Drive to the coast (1h30)",e:[
    ["Hillside murals & funiculars","culture","the painted port"],
    ["Viña del Mar coast","beach","the Pacific and the dunes"]]},
  {c:"Atacama",n:4,t:"Fly north to Calama (2h) — you arrive at 7,900 ft",e:[
    ["Moon Valley & the salt flats","nature","the driest desert on earth"],
    ["El Tatio geysers at dawn","adventure","steam at 14,000 ft"],
    ["Stargazing in the desert","nature","the clearest sky on the planet"]]},
  {c:"Patagonia",n:4,t:"Fly south to Punta Arenas (4h)",e:[
    ["Torres del Paine W trek","adventure","granite towers and glaciers"],
    ["Grey Glacier","nature","blue ice on a grey lake"],
    ["Chiloé stilt houses (add-on)","culture","wooden UNESCO churches"]]}],

/* ── OCEANIA ── */
australia:[
  {c:"Sydney",n:4,t:"Fly into Sydney (SYD)",e:[
    ["Opera House & Harbour Bridge","culture","the world's great harbor"],
    ["Bondi to Coogee coastal walk","beach","clifftop path and ocean pools"],
    ["Blue Mountains day trip","nature","eucalyptus haze and sandstone"]]},
  {c:"Cairns",n:4,t:"Fly north to the tropics (3h)",e:[
    ["Great Barrier Reef snorkel or dive","adventure","the largest living structure on earth"],
    ["Daintree rainforest","nature","the oldest rainforest in the world"],
    ["Kuranda scenic rail","nature","gorges and waterfalls by train"]]},
  {c:"Uluru",n:2,t:"Fly to Ayers Rock (Uluru) (3h)",e:[
    ["Sunrise at the rock","spiritual","the red heart of the country"],
    ["Kata Tjuta & the Field of Light","nature","domes and 50,000 glass stems"]]},
  {c:"Melbourne",n:3,t:"Fly south (3h)",e:[
    ["Laneways & coffee culture","food","street art and flat whites"],
    ["Markets & the MCG","culture","Queen Vic and the cricket ground"],
    ["Phillip Island penguins","nature","the nightly parade"]]},
  {c:"Great Ocean Road",n:2,t:"Drive west out of Melbourne",e:[
    ["The Twelve Apostles","nature","limestone stacks in the Southern Ocean"],
    ["Coastal drive & rainforest","nature","koalas and fern gullies"]]}],

newzealand:[
  {c:"Auckland",n:2,t:"Fly into Auckland (AKL)",e:[
    ["Sky Tower & the harbour","culture","the city of sails"],
    ["Waiheke Island wine","food","vineyards a ferry ride away"]]},
  {c:"Rotorua",n:2,t:"Drive south (3h)",e:[
    ["Geothermal parks & Māori culture","spiritual","geysers and a hāngī feast"],
    ["Waitomo glowworm caves","nature","a galaxy underground"],
    ["Hobbiton movie set","culture","the Shire, preserved"]]},
  {c:"Queenstown",n:4,t:"Fly to the South Island (2h)",e:[
    ["Bungee & jet boat","adventure","the adventure capital of the world"],
    ["Wanaka & Roys Peak hike","adventure","the most photographed view in NZ"],
    ["Gibbston Valley wine","food","Pinot Noir in a river gorge"]]},
  {c:"Milford Sound",n:2,t:"Drive through Fiordland (4h)",e:[
    ["The fiord cruise","nature","sheer walls and waterfalls"],
    ["Te Anau & the Homer Tunnel","nature","the road that shouldn't exist"]]},
  {c:"Franz Josef",n:2,t:"Drive up the West Coast (5h)",e:[
    ["Glacier heli-hike","adventure","ice in a rainforest"],
    ["Rainforest & hot pools","nature","the Southern Alps at your back"]]}],

fiji:[
  {c:"Nadi",n:1,t:"Fly into Nadi (NAN)",e:[
    ["Garden of the Sleeping Giant","nature","orchids under the hills"],
    ["Sabeto mud pools","nature","a hot-spring soak on arrival"]]},
  {c:"Mamanuca Islands",n:3,t:"Catamaran to the islands (1h)",e:[
    ["Island hopping & snorkel","beach","the postcard islands"],
    ["Cloud 9 floating bar","adventure","a bar in the middle of the ocean"],
    ["Sunset sail & lovo feast","food","earth-oven cooking on the sand"]]},
  {c:"Yasawa Islands",n:3,t:"Continue north by boat (2h)",e:[
    ["Blue Lagoon & a village visit","beach","the film's actual lagoon"],
    ["Kava ceremony with the village","culture","the real welcome"],
    ["Sawa-i-Lau caves","adventure","swim into a limestone chamber"]]},
  {c:"Taveuni",n:3,t:"Fly to the Garden Island (1h30)",e:[
    ["Rainbow Reef diving","adventure","the soft-coral capital of the world"],
    ["Bouma waterfalls","nature","three tiers of jungle falls"],
    ["Beqa shark dive (add-on)","adventure","bull sharks, no cage"]]}]

};

/* attach routes to the destination library */
if (typeof DEST !== "undefined") {
  Object.keys(LEGS).forEach(k => { if (DEST[k]) DEST[k].legs = LEGS[k]; });
}
