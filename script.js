// ==UserScript==
// @name        Extra Player Details
// @namespace   https://github.com/kamarov-therussiantank
// @author      kamarov
// @description Designed to provide extra information about players
// @version     0.0.1
// @license     GPL-3.0
// @match       https://tanktrouble.com/*
// @run-at      document-end
// @grant       GM_addStyle
// @require     https://update.greasyfork.org/scripts/482092/1309109/TankTrouble%20Development%20Library.js
// @noframes
// ==/UserScript==

GM_addStyle(`
.exp.tooltipstered {
    position: relative;
    height: 30px;
}
#tankinfo .rank, #tankinfo .xp {
    position: relative;
    height: 30px;
}
.exp-bar {
    background-image: image-set(url(https://i.imgur.com/R2CiGV4.png) 1x, url(https://i.imgur.com/6BC4tAu.png) 2x);
    background-size: 10px 22px;
    height: 100%;
}
.about-container {
    position: relative;
    z-index: 2;
    font-size: 12px;
}
.bannedText-container {
    position: relative;
    z-index: 2;
    font-size: 12px;
    margin: 20px 0 20px 0;
}
span.exp-text {
    position: absolute;
    top: 3px;
    left: 32%;
    font-family: 'Arial';
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    text-shadow: -1.4px -1.4px 0 black, 1.4px -1.4px 0 black, -1.4px 1.4px 0 black, 1.4px 1.4px 0 black;
}
#tankinfo .username {
    z-index: 2;
}
.adminBadge {
    z-index: 1;
    position: absolute;
    top: -70px;
    left: 130px;
}
.banned-Icon {
    z-index: 1;
    position: absolute;
    top: -130px;
    left: 10px;
}
tr.tooltipstered {
    display: none !important;
}
.statsContainer img.statsIcon {
    position: absolute;
}
.statsContainer svg {
    left: 45px;
}
.deaths.tooltipstered {
    left: 55px;
}
#tankinfo table td:first-child .statsIcon {
    left: 2px;
}
#tankinfo table td:first-child svg {
    left: 43px;
}
#tankinfo table td:last-child .statsIcon {
    right: 5px;
}
#tankinfo table td:last-child svg {
    left: 5px;
}
`);

(() => {
	Loader.interceptFunction(TankTrouble.TankInfoBox, '_initialize', (original, ...args) => {
		original(...args);

		// Initialize Badges Div
		TankTrouble.TankInfoBox.infoBadgesDiv = $('<div class="badge-container"/>');

		// Define icons for badges
		TankTrouble.TankInfoBox.infoBadgesIcon1 = $('<img class="badgeIcon" src="https://i.imgur.com/zPP4w6O.png"/>'); // Premium
		TankTrouble.TankInfoBox.infoBadgesIcon2 = $('<img class="badgeIcon" src="https://i.imgur.com/FTvsqiv.png"/>'); // Kickstarter
		TankTrouble.TankInfoBox.infoBadgesIcon3 = $('<img class="badgeIcon" src="https://i.imgur.com/PfnLu7l.png"/>'); // Admin
		TankTrouble.TankInfoBox.infoBadgesIcon4 = $('<img class="badgeIcon" src="https://i.imgur.com/1UQeWVB.png"/>'); // Beta Tester
		TankTrouble.TankInfoBox.infoBadgesIcon5 = $('<img class="badgeIcon" src="https://i.imgur.com/9WCCK6U.png"/>'); // Classic Player
		TankTrouble.TankInfoBox.infoBannedIcon = $('<img class="banned-Icon" src="https://i.imgur.com/AlA3MSg.png"/>'); // Banned Player

		// Create Classic Player Badge (with icon & text)
		TankTrouble.TankInfoBox.classicPlayerBadge = $('<div class="classicBadge"/>');
		TankTrouble.TankInfoBox.classicPlayerBadge.append(TankTrouble.TankInfoBox.infoBadgesIcon5);
		TankTrouble.TankInfoBox.classicPlayerBadge.append(TankTrouble.TankInfoBox.classicPlayerText);
    // Create Beta Tester Badge (with icon & text)
		TankTrouble.TankInfoBox.betaTesterBadge = $('<div class="betaTesterBadge"/>');
		TankTrouble.TankInfoBox.betaTesterBadge.append(TankTrouble.TankInfoBox.infoBadgesIcon4);
    // Create Premium Member Badge (with icon & text)
		TankTrouble.TankInfoBox.premiumBadge = $('<div class="premiumMemberBadge"/>');
		TankTrouble.TankInfoBox.premiumBadge.append(TankTrouble.TankInfoBox.infoBadgesIcon1);
    // Create Kickstarter Backer Badge (with icon & text)
		TankTrouble.TankInfoBox.kickstarterBadge = $('<div class="kickstarterBadge"/>');
		TankTrouble.TankInfoBox.kickstarterBadge.append(TankTrouble.TankInfoBox.infoBadgesIcon2);
    // Create Admin Member Badge (with icon & text)
		TankTrouble.TankInfoBox.adminBadge = $('<div class="adminBadge"/>');
		TankTrouble.TankInfoBox.adminBadge.append(TankTrouble.TankInfoBox.infoBadgesIcon3);
    // Banned Player element
		TankTrouble.TankInfoBox.bannedIcon = $('<div class="bannedIcon"/>');
		TankTrouble.TankInfoBox.bannedIcon.append(TankTrouble.TankInfoBox.infoBannedIcon);

    // Experience progress bar
		TankTrouble.TankInfoBox.infoExpDiv = $('<div class="exp tooltipstered"/>');
		TankTrouble.TankInfoBox.infoExpTextDiv = $('<div class="progress"/>');
		TankTrouble.TankInfoBox.infoExpBorder = $('<div class="border"/>');
		TankTrouble.TankInfoBox.infoExpBar = $('<div class="exp-bar"/>');
		TankTrouble.TankInfoBox.infoExpText = $('<span class="exp-text"/>');
		TankTrouble.TankInfoBox.infoExpTextDiv.append(TankTrouble.TankInfoBox.infoExpBorder);
		TankTrouble.TankInfoBox.infoExpTextDiv.append(TankTrouble.TankInfoBox.infoExpBar);
		TankTrouble.TankInfoBox.infoExpTextDiv.append(TankTrouble.TankInfoBox.infoExpText);
		TankTrouble.TankInfoBox.infoExpDiv.append(TankTrouble.TankInfoBox.infoExpTextDiv);
		TankTrouble.TankInfoBox.infoExpDiv.insertAfter(TankTrouble.TankInfoBox.infoRank);

    // Player additional information element
		TankTrouble.TankInfoBox.infoAboutDiv = $('<div class="tooltipstered"/>');
		TankTrouble.TankInfoBox.infoAboutTextDiv = $('<div class="about-container"/>');
		TankTrouble.TankInfoBox.infoAboutText = $('<span class="about-text"/>');
		TankTrouble.TankInfoBox.infoAboutTextDiv.append(TankTrouble.TankInfoBox.infoAboutText);
		TankTrouble.TankInfoBox.infoAboutDiv.append(TankTrouble.TankInfoBox.infoAboutTextDiv);
		TankTrouble.TankInfoBox.infoAboutDiv.insertAfter(TankTrouble.TankInfoBox.infoName);

    // Banned information element
		TankTrouble.TankInfoBox.infoBannedPlayerDiv = $('<div class="tooltipstered"/>');
		TankTrouble.TankInfoBox.infoBannedPlayerTextDiv = $('<div class="bannedText-container"/>');
		TankTrouble.TankInfoBox.infoBannedPlayerText = $('<span class="bannedText-text"/>');
		TankTrouble.TankInfoBox.infoBannedPlayerTextDiv.append(TankTrouble.TankInfoBox.infoBannedPlayerText);
		TankTrouble.TankInfoBox.infoBannedPlayerDiv.append(TankTrouble.TankInfoBox.infoBannedPlayerTextDiv);
		TankTrouble.TankInfoBox.infoBannedPlayerDiv.insertAfter(TankTrouble.TankInfoBox.infoRank);

    // Create a container for the icon and text
    TankTrouble.TankInfoBox.infoDeathsDiv = $('<td class="deaths tooltipstered"/>');
    TankTrouble.TankInfoBox.infoDeaths = $(`
    <div class="statsContainer">
        <img class="statsIcon" src="https://i.imgur.com/ze2jYnc.png" srcset="https://i.imgur.com/XIQFQn6.png 2x"/>
        <div class="hasSVG">
            <svg version="1.1" width="58" height="34">
                <text id="deathsTextOutline" x="1" y="22" text-anchor="start" font-family="Arial Black" font-size="14" fill="none" stroke="black" stroke-linejoin="round" stroke-width="3" letter-spacing="1">N/A</text>
                <text id="deathsText" x="1" y="22" text-anchor="start" font-family="Arial Black" font-size="14" fill="white" letter-spacing="1">N/A</text>
            </svg>
        </div>
    </div>
    `);
    TankTrouble.TankInfoBox.infoDeathsDiv.append(TankTrouble.TankInfoBox.infoDeaths);

    TankTrouble.TankInfoBox.infoDeathsDiv.tooltipster({
    content: 'Deaths',
    position: 'left',
    offsetX: 5
    });

    TankTrouble.TankInfoBox.infoDeathsDiv.insertAfter(TankTrouble.TankInfoBox.infoKillsAndVictoriesTableRow);

		// Style Badges Div
		TankTrouble.TankInfoBox.infoBadgesDiv.css({
			display: 'flex',
			'align-items': 'center',
			'justify-content': 'center',
			'flex-wrap': 'wrap',
			margin: '0px auto',
			width: 'fit-content'
		});

		// Icon Styling
		// Scale the icons
		TankTrouble.TankInfoBox.infoBadgesIcon1.css({
			width: '38px',
			margin: '0'
		});

    TankTrouble.TankInfoBox.infoBadgesIcon2.css({
			width: '38px',
			margin: '0'
		});

    TankTrouble.TankInfoBox.infoBadgesIcon3.css({
			width: '115px',
			margin: '0'
		});

    TankTrouble.TankInfoBox.infoBadgesIcon4.css({
			width: '38px',
			margin: '0'
		});

    TankTrouble.TankInfoBox.infoBadgesIcon5.css({
			width: '38px',
			margin: '0'
		});

    TankTrouble.TankInfoBox.infoBannedIcon.css({
			width: '200px',
			margin: '0',
		});

    TankTrouble.TankInfoBox.classicPlayerBadge.tooltipster({
			position: 'top',
			offsetX: 0
		});

    TankTrouble.TankInfoBox.betaTesterBadge.tooltipster({
			position: 'top',
			offsetX: 0
		});

    TankTrouble.TankInfoBox.premiumBadge.tooltipster({
			position: 'top',
			offsetX: 0
		});

    TankTrouble.TankInfoBox.kickstarterBadge.tooltipster({
			position: 'top',
			offsetX: 0
		});

		TankTrouble.TankInfoBox.infoExpDiv.tooltipster({
			position: 'right',
			offsetX: 5
		});

		// Append all elements
		TankTrouble.TankInfoBox.infoBadgesDiv.append(TankTrouble.TankInfoBox.classicPlayerBadge);
		TankTrouble.TankInfoBox.infoBadgesDiv.append(TankTrouble.TankInfoBox.betaTesterBadge);
		TankTrouble.TankInfoBox.infoBadgesDiv.append(TankTrouble.TankInfoBox.premiumBadge);
		TankTrouble.TankInfoBox.infoBadgesDiv.append(TankTrouble.TankInfoBox.kickstarterBadge);
		TankTrouble.TankInfoBox.infoBadgesDiv.append(TankTrouble.TankInfoBox.adminBadge);
		TankTrouble.TankInfoBox.infoBadgesDiv.append(TankTrouble.TankInfoBox.bannedIcon);
		TankTrouble.TankInfoBox.infoBadgesDiv.insertBefore(TankTrouble.TankInfoBox.infoRank);

		// Hide badges by default
		TankTrouble.TankInfoBox.infoExpDiv.hide();
		TankTrouble.TankInfoBox.infoBadgesDiv.hide();
		TankTrouble.TankInfoBox.classicPlayerBadge.hide();
		TankTrouble.TankInfoBox.betaTesterBadge.hide();
		TankTrouble.TankInfoBox.premiumBadge.hide();
		TankTrouble.TankInfoBox.kickstarterBadge.hide();
		TankTrouble.TankInfoBox.adminBadge.hide();
	});

  // Display
	Loader.interceptFunction(TankTrouble.TankInfoBox, 'show', (original, ...args) => {
		original(...args);

		TankTrouble.TankInfoBox.classicPlayerBadge.tooltipster('content', 'Classic Player');
		TankTrouble.TankInfoBox.betaTesterBadge.tooltipster('content', 'Beta Tester');
		TankTrouble.TankInfoBox.premiumBadge.tooltipster('content', 'Premium Member');
		TankTrouble.TankInfoBox.kickstarterBadge.tooltipster('content', 'Kickstarter Backer');
		TankTrouble.TankInfoBox.infoExpDiv.tooltipster('content', 'Classic EXP');

		const [,, playerId] = args;

		Backend.getInstance().getPlayerDetails(result => {
			if (typeof result === 'object') {
        const playerId = result.getPlayerId();
        const username = result.getUsername()
        const banned = result.getBanned();
				const classicPlayer = result.getExperience();
				const premiumMember = result.getPremium();
				const betaTester = result.getBeta();
				const adminMember = result.getGmLevel();
        const deaths = result.getDeaths();

        $("#deathsTextOutline").text(deaths);
        $("#deathsText").text(deaths);

        const backers = [
  "sukaiyx",
  "Chapter2",
  "Orc-T72",
  "firekingPunch",
  "foxter",
  "infuriater",
  "AvaMax",
  "lorenzo9",
  "FakeDodger",
  "kamarov",
  "commander",
  "00DOG",
  "253",
  "5am",
  "ADIRITU",
  "Argontrax",
  "AwesomeOne554",
  "badbot328",
  "bangbangshoota",
  "BOBYMCBOBO",
  "Bossabot",
  "cayer77",
  "CJCurle15",
  "Cold_Steel",
  "coolboy06",
  "darknessscythe",
  "darkspines32",
  "Deathzero168",
  "domo12",
  "dope112",
  "Drazex",
  "emerald899",
  "2",
  "FLETT77",
  "getreckt",
  "goodguy333",
  "gorman7",
  "Comradeherio",
  "jabez",
  "JHvsKD",
  "KimChiJS",
  "Antiserum",
  "laikacrusher",
  "Lil_Joker",
  "Gentleman",
  "LukeFilewalker",
  "MAXWELL14050",
  "mh1234567890",
  "Axis",
  "moscles25",
  "MostEpic",
  "Mud",
  "Nuclear_Humus",
  "oliverisepic",
  "osiris257",
  "pointfire",
  "QUlD",
  "Rattlesniper",
  "Redwind",
  "rehman",
  "Rektikel",
  "rhak",
  "salope01",
  "satan112",
  "Smartmann19",
  "steven369",
  "Night-Killah",
  "SwagMonster45",
  "Tektank",
  "The-J-Recker",
  "tobi4644",
  "ViciousLooRoll",
  "wajix",
  "Wesley10",
  "WorldDestroyer89",
  "XxRoxarLegendxX",
  "ZzMoleculezzZ",
  "AXTECK456",
  "george8888",
  "thank12",
  "DemonShadow",
  "CJCtioN",
  "MR_KEEFFE",
  "kill-sean",
  "MasterFaith",
  "SwagPants",
  "GhostRider2006",
  "TrophyPRO",
  "pepsi150707",
  "lordnorbert",
  "HCVlogs",
  "testherio",
  "AirDragoon",
  "coolmaltank",
  "imReaper",
  "Kerosene",
  "thisboy123",
  "Giraffe",
  "grandpluto7733",
  "Spiros04",
  "Retroman237",
  "RandomDean",
  "Huntspy",
  "QuickNinja",
  "Zacsolo",
  "fowler400",
  "superstar123456",
  "SuperscizorX",
  "HydroDonkey",
  "King__B",
  "mam5",
  "DR_RAGE",
  "z",
  "SlytherinGhost",
  "DrJekyll",
  "KING06745",
  "4",
  "Faint",
  "VadaptionCalebS",
  "POOPFACE1000",
  "Trololo791",
  "Raezy",
  "Unc1eSalty",
  "YoHypeBroYT",
  "savagetankman",
  "infinitecosmos",
  "Rage",
  "GetGud",
  "CosmosAblaze",
  "Sub-Cold-Snow4K",
  "lucki",
  "tankesitooo",
  "gingersnap4",
  "joelbegalla",
  "cristmasdude",
  "Axuox",
  "Sammylew",
  "YummyFurySword",
  "bababa999",
  "szn",
  "AncientAilen187",
  "CaptainPainSoCool",
  "25moscles",
  "Lichen",
  "lilpeeps223",
  "muirashad",
  "CosmicCal",
  "resolver",
  "Valt_Slash",
  "Bullets4Breakfast",
  "Envy",
  "Sc4r",
  "killem3i",
  "iiRyzex",
  "-0__0-",
  "Vipere",
  "Player",
  "ZERO_GHOST",
  "CannonClasher55",
  "imslayer",
  "NelFusion",
  "Elponche123",
  "proteusnitro",
  "_Trippy_",
  "tankesitaaaX",
  "Etxrnity",
  "dvi9311",
  "OMEGA_GOD",
  "stop1",
  "ONE_SHOT",
  "JuicyQueen",
  "dathidenogla",
  "interpreneur",
  "Tobes951",
  "YuriDior",
  "WhiteWash",
  "feed",
  "IDKWATTOPUT",
  "Captain-Rage",
  "AJC",
  "Yusei",
  "AstridHofferson",
  "mirror",
  "KING_ZERO",
  "PhoenixLife-YT",
  "-mudpaper-",
  "Rage-X",
  "THE_MAD_SCIENTIST",
  "kaag",
  "tank_meme",
  "JenBen98",
  "DrewDD1234",
  "Guanek",
  "ZanyMiniBone",
  "Corvinus",
  "PUBG_2007",
  "Discover",
  "plu",
  "MemeLoco123",
  "Nova-I-The-One",
  "XxTekilla_Sunrise",
  "maxfirex",
  "Questionable",
  "sovietunion1991",
  "CaptainNinja_SoCool",
  "ninjathecoolduda",
  "KillerTitan",
  "Slime13",
  "Toastation",
  "KING_ZERO_GOD",
  "Type-2",
  "reeeeeee3",
  "Bowtie",
  "KingObed972",
  "Anonymouz",
  "Inferi",
  "thunder25",
  "Pastor_Bull",
  "SIayer",
  "voodoodoll",
  "NelMouseon",
  "bhausaheb",
  "XIXIX",
  "Pikachu_2005",
  "Type",
  "VIPMaster",
  "mrkilla",
  "laikilla",
  "peashooter6789",
  "DeliciousORANGE",
  "BrokeBot",
  "xxxXGhosTXxxx",
  "Trooper16",
  "02_",
  "Symbiote",
  "98Flow",
  "MrGreek",
  "xythe",
  "StrangePizzaChilli",
  "Cicada3301",
  "Theo_deo_peo",
  "LordOmbraTank",
  "ertusu",
  "itxchi",
  "XxCoolMan_101xX",
  "TrickshotHacks",
  "OOPs_Sorry",
  "GlocK17",
  "MajesticProtonDog",
  "edwinthebest",
  "Black_Panther_",
  "Monster16",
  "parkh",
  "ShadowAssassin1",
  "S11ThePro",
  "Backer-Box",
  "Bleed",
  "XlegendX",
  "WhiteGlass",
  "SNIPER2",
  "Cloudsy",
  "playergamer1",
  "ORNITANK",
  "Angelhot41",
  "Vponder",
  "bandiru",
  "kittenCrafter",
  "-Bwill",
  "litsniperboii",
  "BxveT",
  "ken2007_",
  "OblivionSav",
  "SavageDoubleOctopusS",
  "Mojito",
  "Rip100dollars",
  "noobherio",
  "Plushbannana",
  "mrrip",
  "amerbot2",
  "Matlobot",
  "jacobhoeta",
  "London_Boy",
  "champz",
  "The_M0D",
  "frostwolf13",
  "Zonks",
  "XlegendX1",
  "Aroma",
  "dizzy254",
  "jadentroy",
  "bandiruu",
  "MiNtYyY",
  "No_Ammo",
  "LIAMTHEWARRIOR",
  "AcePath0515",
  "mrrip2",
  "TheGamers",
  "Kai&nbsp;V.",
  "Søren&nbsp;Boll&nbsp;Overgaard",
  "Binke",
  "Clemens",
  "Anne&nbsp;Sofie",
  "newthy32",
  "Elin",
  "Fraser",
  "supervolcano",
  "Emil&nbsp;Rosdam",
  "fogo76",
  "LittleStorm",
  "jakob&nbsp;baungaard",
  "Elgen",
  "Rishi",
  "jokerfury9",
  "Fillipuster",
  "anna&nbsp;nørgaard",
  "itay&nbsp;hsh",
  "ben314",
  "Grey",
  "ZuperFly",
  "Thomas",
  "VictoryRun",
  "Phil",
  "Reuven&nbsp;Cooper",
    "Grebdivh",
    "Sheep2000",
    "JasonLukeBarber",
    "Julian&nbsp;E.",
    "DStecher",
    "TheUSSR",
    "Roo",
    "KoreanEyeCandy",
    "Shockwave44",
    "René&nbsp;Poulsen",
    "adrianozakka",
    "joebech",
    "omfgwtfbbq",
    "sumtin_baws",
    "Jonathan&nbsp;Lynch&nbsp;(jlynch60)",
    "Playful&nbsp;Invention&nbsp;Company",
    "Nit_Ram",
    "Foxter",
    "AshTheDinosaur",
    "simolo12",
    "jorgen",
    "mauj",
    "Xuequinox",
    "Blue",
    "Kim&nbsp;Bille",
    "THJ113",
    "Dirty_Poul",
    "{-&nbsp;Yomap&nbsp;The&nbsp;Tank&nbsp;-}",
    "Ollie&nbsp;M",
    "Zulc",
    "Luca",
    "emeric2003",
    "Brygge_Cowboy",
    "Spfcuk",
    "Duffme",
    "TopHatGuy",
    "Martin",
    "RidoKilos",
    "TheTobinator",
    "MonkeysWithGuns",
    "Itsajack",
    "Lloydy56",
    "Mason&nbsp;Wang&nbsp;(tvnky)",
    "SirFreddy",
    "badgerpower",
    "kittenkilla",
    "Jakob&nbsp;Thauminator",
    "Marius",
    "Tankiepoofs",
    "Sebastian",
    "SwagRanger45",
    "Darkwall",
    "bipsblazerod",
    "Greg&nbsp;\"Mark&nbsp;Your&nbsp;Target\"&nbsp;H",
    "bohoej",
    "MikO",
    "JohnTheRevelator",
    "PurpleGnome",
    "Kirkegaard",
    "Jon",
    "Annhilator",
    "Luke&nbsp;Filewalker",
    "wheeljack160",
    "Awesomer002",
    "Tristan&nbsp;L.&nbsp;(rYx0)",
    "Emil",
    "DCFBueller",
    "Rum"
];

				// Always show the badges div
				TankTrouble.TankInfoBox.infoBadgesDiv.show();

				// Classic Player badge & Experience progress bar
				if (classicPlayer) {
					TankTrouble.TankInfoBox.infoExpDiv.show();
					TankTrouble.TankInfoBox.classicPlayerBadge.show();
					TankTrouble.TankInfoBox.infoExpText.text(`EXP: ${classicPlayer}`);

         // Check the value of classicPlayer and update the position
         const expTextElement = TankTrouble.TankInfoBox.infoExpText[0];

         if (classicPlayer <= 9999999) {
          expTextElement.style.left = '27%';
         }

         if (classicPlayer <= 999999) {
          expTextElement.style.left = '29%';
         }

         if (classicPlayer <= 99999) {
          expTextElement.style.left = '32%';
         }

         if (classicPlayer <= 9999) {
          expTextElement.style.left = '34%';
         }

         if (classicPlayer <= 999) {
          expTextElement.style.left = '35%';
         }

         if (classicPlayer <= 99) {
          expTextElement.style.left = '37%';
         }

				} else {
					TankTrouble.TankInfoBox.infoExpDiv.hide();
					TankTrouble.TankInfoBox.classicPlayerBadge.hide();
				}

        // Display player info or banned message
        if (banned) {
		    TankTrouble.TankInfoBox.bannedIcon.show();
        TankTrouble.TankInfoBox.infoAboutDiv.show();
        TankTrouble.TankInfoBox.infoAboutText.text(`#${playerId}`);
        TankTrouble.TankInfoBox.infoBannedPlayerDiv.show();
        TankTrouble.TankInfoBox.infoBannedPlayerText.text(`Player has been permanently banned because of rules violation. Player statistics are counted towards the scrapyard.`);
          document.querySelector(".about-container").style.color = "#fff";
          document.querySelector("#tankinfo .rank").style.display = "none";
          document.querySelector("#tankinfo .xp").style.display = "none";
          document.querySelector(".exp.tooltipstered").style.display = "none";
          document.querySelector("#tankinfo table").style.display = "none";
          document.querySelector(".actions.centered").style.display = "none";
        } else if (playerId) {
		    TankTrouble.TankInfoBox.bannedIcon.hide();
        TankTrouble.TankInfoBox.infoBannedPlayerDiv.hide();
        TankTrouble.TankInfoBox.infoAboutDiv.show();
        TankTrouble.TankInfoBox.infoAboutText.text(`#${playerId}`);
          document.querySelector(".about-container").style.color = "";
          document.querySelector("#tankinfo .rank").style.display = "";
          document.querySelector("#tankinfo .xp").style.display = "";
          document.querySelector("#tankinfo table").style.display = "";
          document.querySelector(".actions.centered").style.display = "";
        } else {
        TankTrouble.TankInfoBox.infoAboutDiv.hide();
        document.querySelector(".exp.tooltipstered").style.display = "";
        }

        // Show Kickstarter Badge
            if (backers.includes(username)) {
                TankTrouble.TankInfoBox.kickstarterBadge.show();
            } else {
                TankTrouble.TankInfoBox.kickstarterBadge.hide();
            }

				// Other Badges
				premiumMember ? TankTrouble.TankInfoBox.premiumBadge.show() : TankTrouble.TankInfoBox.premiumBadge.hide();
				betaTester ? TankTrouble.TankInfoBox.betaTesterBadge.show() : TankTrouble.TankInfoBox.betaTesterBadge.hide();
				adminMember ? TankTrouble.TankInfoBox.adminBadge.show() : TankTrouble.TankInfoBox.adminBadge.hide();
			} else {
				TankTrouble.TankInfoBox.infoBadgesDiv.hide();
			}

		}, () => {}, () => {}, playerId, Caches.getPlayerDetailsCache());
	});
})();
