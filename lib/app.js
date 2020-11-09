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
      'JoeBiden': LOW,
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
      'DHS_Wolf': LOW,

      'Wizard_Predicts': ALL,

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
      'JRubinBlogger': LOW,
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
      // 'MaxNordau': LOW, // suspended

      'bronzeagemantis': LOW,
      // 'ESYudkowsky': DEFAULT,
      // 'moldbugman': LOW, // protected
      'Outsideness': DEFAULT,
      'thespandrell': DEFAULT,
      // 'RokoMijicUK': LOW, // protected

      'MarkDice': DEFAULT,

      'EpochTimes': DEFAULT,

      'patrickbyrne': DEFAULT,

      'NateSilver538': ALL,

      'diana_west_': DEFAULT,

      /* White nationalists */
      // 'DrDavidDuke': DEFAULT, // suspended
      // 'jartaylor': DEFAULT, // suspended
      'NickJFuentes': [DEFAULT, HIGH],
      'JadenPMcNeil': LOW,
      'EMichaelJones1': LOW,
      'RichardBSpencer': DEFAULT,

      // 'AmRenPosts': ALL, // test order, suspended

      'ObamaMalik': DEFAULT,
      'NoorBinLadin': HIGH,
      'JamesADamore': HIGH,
      'KyleKashuv': DEFAULT,
      
      'kurteichenwald': LOW,

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
      // 'shaunking': LOW, // protected
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
      'TaylorLorenz': DEFAULT,
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
      // 'HAGOODMANAUTHOR', // deleted
      // 'liangweihan4': LOW, // suspended
      // 'LiuXiaoqiliu5': LOW, deactivated / deleted 
      // 'porter14159': LOW, // suspended
      'RealBrysonGray': LOW,
      'RealCandaceO': DEFAULT,
      // 'RRTIndustries': HIGH, // suspended
      'rrtidotcom': HIGH,
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
      'ServusJC': LOW, // SirBilly_Bob new account
      // 'mcitlfraphorism': HIGH, // deactivated
      'NoTrueScotist': DEFAULT, // tradical
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

      // 'sairasameerarao': DEFAULT, // deactivated

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
      'stoolpresidente': HIGH,
      'TomBrady': ALL,
      'tucker_tnl': DEFAULT,
      'whitlockjason': HIGH,
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
      'acsimonds': ALL,
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
      'SamHarrisOrg': DEFAULT,
      
      'WokeCapital': LOW,

      'charlesmurray': DEFAULT,

      // 'NaomiAKlein': HIGH,

      'benjaminwittes': LOW,
      'DouthatNYT': DEFAULT,
      'michaelbd': LOW,
      'roddreher': DEFAULT,
      'tribelaw': [LOW, HIGH],
      // 'vermeullarmine': LOW, // deactivated?
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

      'DrIbram': HIGH,

      'ABFalecbaldwin': HIGH,
      'AdamBaldwin': LOW,
      'AndyRichter': DEFAULT,
      'bradrutter': ALL,
      // 'chuckwoolery': LOW, // deactovated
      'jack': DEFAULT,
      'James_Holzhauer': HIGH,
      'jimmy_wales': HIGH,
      'johnlegend': [DEFAULT, HIGH],
      'jonvoight': ALL,
      'joss': [DEFAULT, HIGH],
      'kirstiealley': DEFAULT,
      'normmacdonald': DEFAULT,
      'RealJamesWoods': LOW,
      // 'RobSchneider': DEFAULT,
      'rogcraig': HIGH,
      // 'SageRosenfels18': DEFAULT,
      'SarahKSilverman': [DEFAULT, HIGH],
      'the_moviebob': LOW,
      // 'thecampaignbook': DEFAULT, // shia labeouf
      'TheRealDisco': DEFAULT,
      'timheidecker': DEFAULT,
      'wilw': HIGH,
      'kanyewest': DEFAULT,
      'RandyRRQuaid': HIGH,
      
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

      'THEHermanCain': DEFAULT,

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

    tasks.push($taskService.runPredictItTask(3698)); // president

    await Promise.all(tasks);

  } catch (e) {
    setTimeout(() => { throw e; }, 0);
  }

};

module.exports = inject(app);
