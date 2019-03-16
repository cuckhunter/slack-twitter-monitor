'use strict';

const fs = require('fs');
const inject = require('./inject');
const path = require('path');

async function app([$env, $logger, $server, $slackService, $taskService]) {

  const PORT = $env.PORT || 80;

  $server.listen(PORT, () => {
    $logger.info(`Server listening on port ${PORT}`);
  });

  const [ALL, ALL_EXCLUDE_REPLIES, HIGH, DEFAULT, LOW, NONE] = [...Array(6).keys()];

  const levelMap = (level) => {
    return {
      [HIGH]: 'high',
      [DEFAULT]: 'default',
      [LOW]: 'low',
    }[level];
  };

  const settings = {

    /**
     * Politics
     */

      /** Politics - Political figures */
      'realDonaldTrump': ALL,
      'AOC': [DEFAULT, HIGH],
      'BenSasse': DEFAULT,
      'BernieSanders': HIGH,
      'DrJillStein': [DEFAULT, HIGH],
      'ewarren': [DEFAULT, HIGH],
      'HillaryClinton': HIGH,
      'JebBush': HIGH,
      'JohnKasich': HIGH,
      'KamalaHarris': [DEFAULT, HIGH],
      'SarahPalinUSA': HIGH,
      'SenGillibrand': HIGH,
      'tedcruz': HIGH,
      'TulsiGabbard': DEFAULT,
      'AndrewYangVFA': [LOW, HIGH],

      /** Politics - Commentary */
      'mtracey': [DEFAULT, HIGH],
      'ggreenwald': DEFAULT,

      /** Politics - RINOs */
      'DavidAFrench': DEFAULT,
      'davidfrum': [DEFAULT, HIGH],
      'JRubinBlogger': [LOW, DEFAULT],
      'MaxBoot': [LOW, DEFAULT],
      'BretStephensNYT': [LOW, DEFAULT],
      'BillKristol': [LOW, HIGH],

      'DineshDSouza': DEFAULT,

      'michellemalkin': HIGH,

      'BrittMcHenry': HIGH,
      'BuckSexton': DEFAULT,
      'charliekirk11': [NONE, DEFAULT],
      'JackPosobiec': [NONE, DEFAULT],
      'mitchellvii': [NONE, DEFAULT],
      'RealSaavedra': LOW,
      'seanmdav': LOW,

    'benshapiro': DEFAULT,
    'AnnCoulter': HIGH,
    'NateSilver538': HIGH,

      /* White nationalists */
      'DrDavidDuke': DEFAULT,
      // 'jartaylor': DEFAULT, // suspended
      'NickJFuentes': [LOW, HIGH],
      'RichardBSpencer': HIGH,

    'ObamaMalik': DEFAULT,
    'kurteichenwald': DEFAULT,
    'KyleKashuv': HIGH,

      /** Hosts */
      'chrislhayes': DEFAULT,
      'IngrahamAngle': [NONE, DEFAULT],
      'piersmorgan': DEFAULT,
      // 'seanhannity': DEFAULT,
      // 'TuckerCarlson': DEFAULT,

    'ashleyfeinberg': LOW,
    'jbouie': LOW,
    // 'davidbrockdc': DEFAULT,
    'paulkrugman': HIGH,
    // 'ananavarro': DEFAULT,
    'neeratanden': [LOW, DEFAULT],
    // 'ddale8': ALL,
    // 'PolitiFact': ALL,
    // 'donnabrazile': DEFAULT,
    // 'sallykohn': DEFAULT,
    'marcushjohnson': [LOW, DEFAULT],
    'tomwatson': [DEFAULT, DEFAULT],
    'ericgarland': DEFAULT,
    'jonfavs': [LOW, DEFAULT],
    'jonlovett': [LOW, DEFAULT],
    'danpfeiffer': [LOW, DEFAULT],
    'TVietor08': [LOW, DEFAULT],
    'brhodes': [LOW, DEFAULT],
    'matthewjdowd': LOW,
    'HeerJeet': [LOW, DEFAULT],

    'ezraklein': HIGH,
    'ebruenig': [NONE, DEFAULT],
    'MattBruenig': [NONE, HIGH],
    'mattyglesias': [DEFAULT, HIGH],
    // 'JBurtonXP': [NONE, DEFAULT], // dormant
    'bariweiss': [NONE, DEFAULT],

    // 'RealAlexJones': DEFAULT, // suspended
    'PrisonPlanet': [NONE, DEFAULT],
    'JamesOKeefeIII': [NONE, LOW],
    'DonaldJTrumpJr': DEFAULT,
    'edasante77': [DEFAULT, HIGH],
    'CalebJHull': [NONE, DEFAULT],
    'cathyyoung63': [NONE, DEFAULT],
    'clairlemon': [NONE, DEFAULT],
    'CHSommers': [NONE, DEFAULT],
    'EricTrump': [NONE, DEFAULT],
    // 'Gavin_McInnes': DEFAULT, // suspended
    // 'GrrrGraphics': DEFAULT,
    'KimStrassel': [NONE, DEFAULT],
    'peterbrimelow': [DEFAULT, HIGH],
    'realJeffreyLord': [NONE, DEFAULT],
    'RubinReport': [NONE, DEFAULT],
    // 'ScottPresler': DEFAULT,


    /**
     * Culture
     */
    'jaredlholt': [LOW, DEFAULT],
    'funder': [NONE, LOW],
    'scrowder': [NONE, DEFAULT],
    'VonAbele': ALL,
    'KenJennings': DEFAULT,
    'arthur_affect': DEFAULT,
    'porter14159': [LOW, DEFAULT],
    // 'RRTIndustries': HIGH, // suspended
    // 'HAGOODMANAUTHOR'), // deactivated
    'RealCandaceO': [HIGH, DEFAULT],
    'TitaniaMcGrath': [DEFAULT, HIGH],
    'DLoesch': HIGH,

      /** Culture - Gamergate */
      'anitasarkeesian': DEFAULT,
      // 'BenKuchera': DEFAULT,
      // 'femfreq': DEFAULT,
      //'leighalexander': DEFAULT,
      'MisterAntiBully': [NONE, DEFAULT], // internetarisotocrat / metokur
      'radicalbytes': DEFAULT, // jonathan mcintosh
      //'randileeharper': DEFAULT,
      'Spacekatgal': [DEFAULT, HIGH], // brianna wu
      'stillgray': [NONE, DEFAULT], // ian miles cheong
      //'UnburntWitch': DEFAULT, // zoe quinn

      /** Culture - Catholic */
      'classicaltheis': [DEFAULT, HIGH],
      'GrafVonGrau': [DEFAULT, HIGH],
      // 'piagnone': DEFAULT, // woke space jesuit
      'NoTrueScotist': [NONE, DEFAULT], // tradical

      /** Culture - Feminists */
      'AmandaMarcotte': DEFAULT,
      'feministabulous': [DEFAULT, HIGH],
      'JessicaValenti': DEFAULT,
      //'sarahcuda': DEFAULT,
      //'susanthesquark': DEFAULT,
    
    // 'atensnut': DEFAULT, // juanita broaddrick
    'ComfortablySmug': LOW,
    // 'gogreen18': DEFAULT, // laci green

    /**
     * Tech / business
     */
    'arrington': [NONE, DEFAULT],
    'elonmusk': HIGH,
    'joshbloch': HIGH,
    'ekp': HIGH,
    'paulg': HIGH,
    'sama': HIGH,
    'balajis': HIGH,
    'naval': HIGH,

    /**
     * Sports
     */
    // 'adamjones985': ALL,
    // 'BenVolin': ALL,
    // 'BillSimmons': DEFAULT,
    // 'ClayTravis': DEFAULT,
    // 'ColinCowherd': DEFAULT,
    // 'GCTigerTracker': ALL,
    // 'GregABedard': ALL,
    // 'HelmetStalker': ALL,
    // 'jaysonst': DEFAULT,
    'JoelEmbiid': DEFAULT,
    'JoseCanseco': HIGH,
    // 'Kato_Kaelin': ALL_EXCLUDE_REPLIES,
    // 'Keefe21': ALL,
    // 'MLBBarrelAlert': ALL,
    // 'mlombardiNFL': ALL,
    'NFL_Scorigami': ALL,
    'stoolpresidente': DEFAULT,
    // 'ShoheiOhtaniWAR': ALL,
    'pgammo': HIGH,
    'RealSkipBayless': ALL,

    /**
     * Other
     */

    '3xchair': [LOW, DEFAULT],
    // 'acsimonds': ALL, // protected
    // 'aigkenham': DEFAULT,
    // 'AJA_Cortes': DEFAULT,
    // 'EdLatimore': DEFAULT,

    'BretWeinstein': HIGH,
    'EricRWeinstein': HIGH,
    'IAmAdamRobinson': DEFAULT,
    'jordanbpeterson': HIGH,
    'MacaesBruno': [DEFAULT, HIGH],
    'nntaleb': [DEFAULT, HIGH],
    'robinhanson': HIGH,
    'sapinker': HIGH,
    'ScottAdamsSays': [DEFAULT, HIGH],
    'tylercowen': HIGH,
    'ATabarrok': HIGH,
    // 'neiltyson': DEFAULT,

    'benjaminwittes': [LOW, DEFAULT],
    'tribelaw': [LOW, HIGH],
    'vermeullarmine': DEFAULT,
    'Yascha_Mounk': [NONE, DEFAULT],

    'ronanfarrow': DEFAULT,

    // 'lsarsour': DEFAULT,
    // 'womensmarch': DEFAULT,

    'johndurant': [NONE, DEFAULT],

    'davidhogg111': [LOW, DEFAULT],

    'AdamBaldwin': [NONE, DEFAULT],
    'chuckwoolery': [NONE, DEFAULT],
    'johnlegend': [DEFAULT, HIGH],
    'joss': [DEFAULT, HIGH],
    'normmacdonald': DEFAULT,
    'RealJamesWoods': [LOW, DEFAULT],
    // 'RobSchneider': DEFAULT,
    // 'SageRosenfels18': DEFAULT,
    'SarahKSilverman': [DEFAULT, HIGH],
    // 'thecampaignbook': DEFAULT, // shia labeouf
    'TheRealDisco': DEFAULT,
    'wilw': HIGH,
    // 'kanyewest': DEFAULT, // dormant

    // 'RogerJStoneJr': ALL, // suspended
    'ChelseaClinton': DEFAULT,
    // 'Ahmadinejad1956': DEFAULT,
    'Cernovich': LOW,
    // 'JulianAssange': DEFAULT, // suspended
    // 'Snowden': DEFAULT,
    'sullydish': HIGH,
    // 'noahpinion': DEFAULT,
    'SheriffClarke': [NONE, DEFAULT],
    'StefanMolyneux': [LOW, DEFAULT],
    // 'tanehisicoates': DEFAULT, // deactivated
    // 'JacobAWohl': [DEFAULT], // suespended
    
    /** Yang */
    // 'sp4wnsong': LOW,
    // 'vapidcontent': LOW,
    // 'kantbotjr': LOW,
    // 'yangster2020': LOW,
    // 'Yangstar78': LOW,
    // 'thotlinemiami85': LOW,

  };

  const tasks = [];

  for (const [key, value] of Object.entries(settings)) {

    switch (value) {
      case ALL:
        tasks.push($taskService.runAllTweetsTask(key, false));
        break;
      case ALL_EXCLUDE_REPLIES:
        tasks.push($taskService.runAllTweetsTask(key));
        break;
      default:
        tasks.push($taskService.runHighScoringTweetsTask(key, [].concat(value).map(levelMap)));
        break;
    }

  }

  await Promise.all(tasks);

};

module.exports = inject(app);
