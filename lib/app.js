'use strict';

const fs = require('fs');
const inject = require('./inject');
const path = require('path');

async function app([$env, $logger, $server, $slackService, $taskService]) {

  try {

    const PORT = $env.PORT || 80;

    await $slackService.message({
      channel: '#slack-twitter-monitor',
      username: 'debug',
      text: 'app started',
    });

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
      'AmRenPosts': ALL, // test order
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
      'PeteButtigieg': DEFAULT,
      'SarahPalinUSA': HIGH,
      'SenGillibrand': HIGH,
      'tedcruz': HIGH,
      'TulsiGabbard': DEFAULT,
      'AndrewYang': [LOW, HIGH],
      'JohnDelaney': DEFAULT,

      /** Politics - Commentary */
      'mtracey': DEFAULT,
      'ggreenwald': DEFAULT,

      /** Politics - RINOs */
      'BillKristol': [LOW, HIGH],
      // 'BretStephensNYT': [LOW, DEFAULT], deactivated
      'DavidCornDC': DEFAULT,
      'DavidAFrench': DEFAULT,
      'davidfrum': [DEFAULT, HIGH],
      'JohnBrennan': DEFAULT,
      'JRubinBlogger': [LOW, DEFAULT],
      'MaxBoot': [LOW, DEFAULT],

      'benshapiro': DEFAULT,

      // 'AmRenPosts': ALL,
      'AnnCoulter': HIGH,
      // 'BrittMcHenry': HIGH, // deactivated
      'BuckSexton': DEFAULT,
      'charliekirk11': [NONE, DEFAULT],
      'DineshDSouza': DEFAULT,
      'JackPosobiec': [NONE, DEFAULT],
      'michellemalkin': DEFAULT,
      // 'mitchellvii': [NONE, DEFAULT],
      'RealSaavedra': LOW,
      'seanmdav': LOW,
      // 'SohrabAhmari': DEFAULT, // deactivated
      'ScottMGreer': LOW,

      'NateSilver538': HIGH,

      /* White nationalists */
      'DrDavidDuke': DEFAULT,
      // 'jartaylor': DEFAULT, // suspended
      'NickJFuentes': [DEFAULT, HIGH],
      'EMichaelJones1': LOW,
      'RichardBSpencer': HIGH,

      'ObamaMalik': DEFAULT,
      'kurteichenwald': LOW,
      'KyleKashuv': DEFAULT,

      /** Hosts */
      'chrislhayes': DEFAULT,
      'donlemon': DEFAULT,
      'IngrahamAngle': [NONE, DEFAULT],
      // 'piersmorgan': DEFAULT,
      // 'seanhannity': DEFAULT,
      // 'TuckerCarlson': DEFAULT,

      'ashleyfeinberg': LOW,
      'jbouie': LOW,
      // 'davidbrockdc': DEFAULT,
      'paulkrugman': HIGH,
      // 'ananavarro': DEFAULT,
      'neeratanden': LOW,
      // 'ddale8': ALL,
      // 'PolitiFact': ALL,
      // 'donnabrazile': DEFAULT,
      // 'sallykohn': DEFAULT,
      'marcushjohnson': [LOW, DEFAULT],
      'tomwatson': DEFAULT,
      'peterdaou': LOW,
      // 'ericgarland': LOW,
      'jonfavs': [LOW, DEFAULT],
      'jonlovett': [LOW, DEFAULT],
      'danpfeiffer': [LOW, DEFAULT],
      'TVietor08': [LOW, DEFAULT],
      'brhodes': [LOW, DEFAULT],
      'matthewjdowd': LOW,
      'HeerJeet': [LOW, DEFAULT],

      'ezraklein': HIGH,
      // 'ebruenig': [NONE, DEFAULT], // deactivated
      'MattBruenig': [NONE, HIGH],
      'mattyglesias': [DEFAULT, HIGH],
      // 'JBurtonXP': [NONE, DEFAULT], // dormant
      'bariweiss': [NONE, DEFAULT],

      // 'RealAlexJones': DEFAULT, // suspended
      'PrisonPlanet': [NONE, DEFAULT],
      'JamesOKeefeIII': [NONE, LOW],
      'DonaldJTrumpJr': DEFAULT,
      'edasante77': [DEFAULT, HIGH],
      // 'CalebJHull': [NONE, DEFAULT],
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
      'Surabees': HIGH,

      /**
       * Culture
       */
      // 'arthur_affect': DEFAULT,
      'DLoesch': LOW,
      // 'funder': [NONE, LOW],
      // 'HAGOODMANAUTHOR'), // deactivated
      'jaredlholt': [LOW, DEFAULT],
      'johncusack': DEFAULT,
      // 'liangweihan4': LOW, // suspended
      'KenJennings': DEFAULT,
      // 'porter14159': [LOW, DEFAULT], // suspended
      'RealCandaceO': DEFAULT,
      // 'RRTIndustries': HIGH, // suspended
      'scrowder': [NONE, DEFAULT],
      'TitaniaMcGrath': [LOW, DEFAULT],
      'VonAbele': ALL,


      /** Culture - Gamergate */
      'anitasarkeesian': DEFAULT,
      // 'BenKuchera': DEFAULT,
      // 'femfreq': DEFAULT,
      //'leighalexander': DEFAULT,
      // 'MisterAntiBully': [NONE, DEFAULT], // internetarisotocrat / metokur
      'radicalbytes': DEFAULT, // jonathan mcintosh
      //'randileeharper': DEFAULT,
      'Spacekatgal': [DEFAULT, HIGH], // brianna wu
      // 'stillgray': [NONE, DEFAULT], // ian miles cheong
      //'UnburntWitch': DEFAULT, // zoe quinn

      /** Culture - Catholic */
      'classicaltheis': LOW,
      // 'GrafVonGrau': [DEFAULT, HIGH], // EarlOfGrey suspended
      'SerfofGrey': LOW,
      // 'mcitlfraphorism': HIGH, // deactivated
      'NoTrueScotist': LOW, // tradical
      // 'piagnone': DEFAULT, // woke space jesuit
      'SereneJones': HIGH,

      /** Culture - Feminists */
      'AmandaMarcotte': LOW,
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
      // 'balajis': HIGH,
      // 'naval': DEFAULT,

      /**
       * Sports
       */
      // 'adamjones985': ALL,
      // 'BenVolin': ALL,
      // 'BillSimmons': DEFAULT,
      'ClayTravis': DEFAULT,
      // 'ColinCowherd': DEFAULT,
      'DevanFink': DEFAULT,
      // 'GCTigerTracker': ALL,
      // 'GregABedard': ALL,
      // 'HelmetStalker': ALL,
      // 'jaysonst': DEFAULT,
      'JoelEmbiid': DEFAULT,
      'JoseCanseco': HIGH,
      // 'Kato_Kaelin': ALL_EXCLUDE_REPLIES,
      // 'Keefe21': ALL,
      // 'MLBBarrelAlert': ALL,
      'mlombardiNFL': HIGH,
      'NFL_Scorigami': ALL,
      'TheRealOJ32': DEFAULT,
      'pgammo': HIGH,
      'RealSkipBayless': ALL,
      'ShoheiOhtaniWAR': ALL,
      'stoolpresidente': DEFAULT,
      'TomBrady': ALL,
      'tucker_tnl': LOW,

      /**
       * Other
       */

      '3xchair': [LOW, DEFAULT], // armond white
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
      'ATabarrok': DEFAULT,
      // 'neiltyson': DEFAULT,

      'charlesmurray': DEFAULT,

      'benjaminwittes': [LOW, DEFAULT],
      'DouthatNYT': HIGH,
      'michaelbd': DEFAULT,
      'roddreher': HIGH,
      'tribelaw': [LOW, HIGH],
      'vermeullarmine': DEFAULT,
      'Yascha_Mounk': [NONE, DEFAULT],

      'ronanfarrow': DEFAULT,

      // 'lsarsour': DEFAULT,
      // 'womensmarch': DEFAULT,

      'johndurant': [NONE, DEFAULT],

      'davidhogg111': DEFAULT,

      'gaywonk': DEFAULT, // carlos maza

      'AdamBaldwin': [NONE, DEFAULT],
      'bradrutter': ALL,
      'chuckwoolery': [NONE, DEFAULT],
      'jack': DEFAULT,
      'James_Holzhauer': HIGH,
      'jimmy_wales': HIGH,
      'johnlegend': [DEFAULT, HIGH],
      'joss': [DEFAULT, HIGH],
      'normmacdonald': HIGH,
      'RealJamesWoods': [LOW, DEFAULT],
      // 'RobSchneider': DEFAULT,
      'rogcraig': ALL,
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
      'MattWalshBlog': DEFAULT,
      // 'Snowden': DEFAULT,
      'sullydish': HIGH,
      // 'noahpinion': DEFAULT,
      'SheriffClarke': [NONE, DEFAULT],
      // 'StefanMolyneux': [LOW, DEFAULT],
      // 'tanehisicoates': DEFAULT, // deactivated
      // 'JacobAWohl': [DEFAULT], // suespended

      /** Yang */
      // 'sp4wnsong': LOW,
      // 'vapidcontent': LOW,
      // 'kantbotjr': LOW,
      // 'yangster2020': LOW,
      // 'Yangstar78': LOW,
      // 'thotlinemiami85': LOW,
      // 
      // 'AndrewBond3': ALL,

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

    // tasks.push($taskService.runPredictItTask(3537)); // impeachment

    await Promise.all(tasks);

  } catch (e) {
    setTimeout(() => { throw e; }, 0);
  }

};

module.exports = inject(app);
