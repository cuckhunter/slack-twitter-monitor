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
        [LOW]: 'low',
        [NONE]: 'none'
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
      'BernieSanders': DEFAULT,
      'DrJillStein': [DEFAULT, HIGH],
      'ewarren': [DEFAULT, HIGH],
      'HillaryClinton': HIGH,
      'JebBush': HIGH,
      'JohnKasich': HIGH,
      'KamalaHarris': [DEFAULT, HIGH],
      'PeteButtigieg': DEFAULT,
      'SarahPalinUSA': HIGH,
      'SenGillibrand': DEFAULT,
      'tedcruz': HIGH,
      'TulsiGabbard': DEFAULT,
      'AndrewYang': [DEFAULT, HIGH],
      'JohnDelaney': DEFAULT,
      'RichardGrenell': LOW,
      'HawleyMO': DEFAULT,
      'DHS_Wolf': DEFAULT,

      /** Politics - Commentary */
      'mtracey': DEFAULT,
      'ggreenwald': DEFAULT,
      // 'CBS_Herridge': LOW,
      'MZHemingway': DEFAULT,

      /** Politics - RINOs */
      'BillKristol': [LOW, HIGH],
      // 'BretStephensNYT': LOW, deactivated
      'DavidCornDC': LOW,
      'DavidAFrench': LOW,
      'davidfrum': [DEFAULT, HIGH],
      'JohnBrennan': DEFAULT,
      'JRubinBlogger': DEFAULT,
      'MaxBoot': LOW,

      'JonahDispatch': DEFAULT,

      'Timodc': LOW,

      'benshapiro': DEFAULT,

      'AnnCoulter': HIGH,
      'BrittMcHenry': HIGH,
      'BuckSexton': DEFAULT,
      'charliekirk11': LOW,
      'DineshDSouza': DEFAULT,
      'JackPosobiec': LOW,
      'michellemalkin': DEFAULT,
      // 'mitchellvii': NONE,
      'RealSaavedra': LOW,
      'seanmdav': LOW,
      'SohrabAhmari': DEFAULT,
      'ScottMGreer': LOW,

      'bronzeagemantis': LOW,
      'ESYudkowsky': DEFAULT,
      // 'moldbugman': LOW, // protected
      'Outsideness': DEFAULT,
      'thespandrell': DEFAULT,
      // 'RokoMijicUK': LOW, // protected

      'MarkDice': DEFAULT,

      'EpochTimes': DEFAULT,

      'patrickbyrne': DEFAULT,

      'NateSilver538': HIGH,

      'diana_west_': DEFAULT,

      /* White nationalists */
      // 'DrDavidDuke': DEFAULT, // suspended
      // 'jartaylor': DEFAULT, // suspended
      'NickJFuentes': [DEFAULT, HIGH],
      'JadenPMcNeil': HIGH,
      'EMichaelJones1': LOW,
      'RichardBSpencer': DEFAULT,

      // 'AmRenPosts': ALL, // test order, suspended

      'ObamaMalik': DEFAULT,
      'JamesADamore': HIGH,
      'kurteichenwald': LOW,
      'KyleKashuv': DEFAULT,

      /** Hosts */
      'chrislhayes': DEFAULT,
      'donlemon': DEFAULT,
      'IngrahamAngle': LOW,
      // 'piersmorgan': DEFAULT,
      // 'seanhannity': DEFAULT,
      // 'TuckerCarlson': DEFAULT,

      'ashleyfeinberg': LOW,
      // 'jbouie': LOW, // deactivated
      // 'davidbrockdc': DEFAULT,
      'paulkrugman': HIGH,
      // 'ananavarro': DEFAULT,
      'neeratanden': LOW,
      // 'ddale8': ALL,
      // 'PolitiFact': ALL,
      // 'donnabrazile': DEFAULT,
      // 'sallykohn': DEFAULT,
      'marcushjohnson': LOW,
      'shaunking': LOW,
      'tomwatson': DEFAULT,
      'peterdaou': DEFAULT,
      // 'ericgarland': LOW,
      'jonfavs': LOW,
      'jonlovett': LOW,
      'danpfeiffer': LOW,
      'TVietor08': LOW,
      'brhodes': LOW,
      'matthewjdowd': LOW,
      'HeerJeet': LOW,
      'TaylorLorenz': HIGH,
      'emilyvdw': DEFAULT,

      'ezraklein': HIGH,
      'ebruenig': LOW, // deactivated
      'MattBruenig': [LOW, HIGH],
      'mattyglesias': [DEFAULT, HIGH],
      // 'JBurtonXP': LOW, // dormant
      'bariweiss': LOW,
      // 'RealAlexJones': DEFAULT, // suspended
      'PrisonPlanet': LOW,
      'JamesOKeefeIII': LOW,
      'DonaldJTrumpJr': DEFAULT,
      'edasante77': DEFAULT,
      // 'CalebJHull': LOW,
      'cathyyoung63': LOW,
      'clairlemon': LOW,
      'CHSommers': LOW,
      'EricTrump': LOW,
      // 'Gavin_McInnes': DEFAULT, // suspended
      // 'GrrrGraphics': DEFAULT,
      'KimStrassel': LOW,
      //'Jack_Burkman': HIGH, // suspended
      'peterbrimelow': [DEFAULT, HIGH],
      'Steve_Sailer': LOW,
      'realJeffreyLord': LOW,
      'RubinReport': LOW,
      // 'ScottPresler': DEFAULT,
      'Surabees': HIGH,

      'rosemcgowan': HIGH,

      /**
       * Culture
       */
      // 'arthur_affect': DEFAULT,
      // 'funder': LOW, // scott dworkin
      'jaredlholt': LOW,
      'johncusack': DEFAULT,
      'KenJennings': DEFAULT,
      
      'DGradenigo': HIGH,
      'DLoesch': LOW,
      // 'HAGOODMANAUTHOR'), // deactivated
      // 'liangweihan4': LOW, // suspended
      'LiuXiaoqiliu5': LOW,
      // 'porter14159': LOW, // suspended
      'RealCandaceO': DEFAULT,
      // 'RRTIndustries': HIGH, // suspended
      'scrowder': LOW,
      'TitaniaMcGrath': LOW,
      'VonAbele': ALL,

      'LaurenRowello': DEFAULT,

      /** Culture - Gamergate */
      'anitasarkeesian': DEFAULT,
      // 'BenKuchera': DEFAULT,
      // 'femfreq': DEFAULT,
      // 'leighalexander': DEFAULT,
      // 'MisterAntiBully': LOW, // internetarisotocrat / metokur
      'radicalbytes': DEFAULT, // jonathan mcintosh
      //'randileeharper': DEFAULT,
      'Spacekatgal': [DEFAULT, HIGH], // brianna wu
      // 'stillgray': NONE, // ian miles cheong
      // 'UnburntWitch': DEFAULT, // zoe quinn

      /** Culture - Catholic */
      'classicaltheis': LOW,
      // 'GrafVonGrau': [DEFAULT, HIGH], // EarlOfGrey suspended
      'SerfofGrey': LOW,
      // 'SirBilly_Bob': DEFAULT, // deactivated or deleted own account
      // 'mcitlfraphorism': HIGH, // deactivated
      'NoTrueScotist': LOW, // tradical
      // 'piagnone': DEFAULT, // woke space jesuit
      'SereneJones': HIGH,
      'Western_Trad': DEFAULT,

      // 'DarrenJBeattie': LOW,

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
      'arrington': LOW,
      'elonmusk': HIGH,
      'joshbloch': HIGH,
      // 'ekp': HIGH, // protected
      'paulg': DEFAULT,
      'sama': HIGH,
      // 'balajis': HIGH,
      // 'naval': DEFAULT,
      'michaeljburry': DEFAULT,

      'sairasameerarao': DEFAULT,

      /**
       * Sports
       */
      // 'adamjones985': ALL,
      // 'BenVolin': ALL,
      // 'BillSimmons': DEFAULT,
      'BauerOutage': DEFAULT,
      'ClayTravis': DEFAULT,
      // 'ColinCowherd': DEFAULT,
      'DevanFink': LOW,
      // 'GCTigerTracker': ALL,
      // 'GregABedard': ALL,
      // 'HelmetStalker': ALL,
      // 'jaysonst': DEFAULT,
      'jemelehill': DEFAULT,
      'JoelEmbiid': DEFAULT,
      // 'JoseCanseco': HIGH,
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
      'tucker_tnl': DEFAULT,
      'whitlockjason': DEFAULT,
      // 'wojespn': ALL,
      // 'ShamsCharania': ALL,
      'kingjames': DEFAULT,
      // 'SHAQ': ALL,
      // 'KevinGarnett5KG': ALL,
      // 'paulpierce34': ALL,
      'aubrey_huff': DEFAULT,
      'gehrig38': HIGH,

      /**
       * Other
       */

      '3xchair': LOW, // armond white
      'RobAger': HIGH,
      'SonnyBunch': DEFAULT,
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
      'RichardDawkins': DEFAULT,
      'robinhanson': HIGH,
      'sapinker': HIGH,
      'ScottAdamsSays': [DEFAULT, HIGH],
      'tylercowen': HIGH,
      'ATabarrok': DEFAULT,
      // 'neiltyson': DEFAULT,

      'WokeCapital': LOW,

      'charlesmurray': DEFAULT,

      // 'NaomiAKlein': HIGH,

      'benjaminwittes': LOW,
      'DouthatNYT': DEFAULT,
      'michaelbd': LOW,
      'roddreher': DEFAULT,
      'tribelaw': [LOW, HIGH],
      'vermeullarmine': LOW, // deactivated for lent
      'ThomasSowell': DEFAULT,
      'Yascha_Mounk': LOW,
      'TheRickWilson': LOW,
      'prchovanec': LOW,
      'monacharenEPPC': DEFAULT,
      'RadioFreeTom': LOW,
      'SykesCharlie': LOW,

      'nhannahjones': DEFAULT,

      // 'RazSimone': HIGH,

      'ronanfarrow': DEFAULT,

      'lsarsour': DEFAULT,
      // 'womensmarch': DEFAULT,

      'johndurant': NONE,
      'rooshv': DEFAULT,

      'davidhogg111': DEFAULT,

      'gaywonk': DEFAULT, // carlos maza

      'MollyJongFast': LOW,

      'ABFalecbaldwin': HIGH,
      'AdamBaldwin': LOW,
      'bradrutter': ALL,
      // 'chuckwoolery': LOW, // deactovated
      'jack': DEFAULT,
      'James_Holzhauer': HIGH,
      'jimmy_wales': HIGH,
      'johnlegend': [DEFAULT, HIGH],
      'joss': [DEFAULT, HIGH],
      'kirstiealley': DEFAULT,
      'normmacdonald': DEFAULT,
      'RealJamesWoods': LOW,
      // 'RobSchneider': DEFAULT,
      'rogcraig': HIGH,
      'SageRosenfels18': DEFAULT,
      'SarahKSilverman': [DEFAULT, HIGH],
      'the_moviebob': LOW,
      // 'thecampaignbook': DEFAULT, // shia labeouf
      'TheRealDisco': DEFAULT,
      'wilw': HIGH,
      'kanyewest': HIGH,
      
      'AoDespair': DEFAULT, // david simon

      // 'RogerJStoneJr': ALL, // suspended
      'ChelseaClinton': DEFAULT,
      // 'Ahmadinejad1956': DEFAULT,
      'Cernovich': LOW,
      // 'JulianAssange': DEFAULT, // suspended
      'MattWalshBlog': LOW,
      // 'Snowden': DEFAULT,
      'sullydish': HIGH,
      // 'noahpinion': DEFAULT,
      'SheriffClarke': LOW,
      // 'StefanMolyneux': LOW,
      // 'tanehisicoates': DEFAULT, // deactivated
      // 'JacobAWohl': DEFAULT, // suespended
      'DavidWohl': LOW,
      'jacobwohlreport': HIGH,
      'brad_polumbo': LOW,

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

    // tasks.push($taskService.runPredictItTask(4911)); // kanye president

    await Promise.all(tasks);

  } catch (e) {
    setTimeout(() => { throw e; }, 0);
  }

};

module.exports = inject(app);
