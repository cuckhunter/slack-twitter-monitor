'use strict';

const fs = require('fs');
const inject = require('./inject');
const path = require('path');

async function app([$env, $logger, $server, $slackService, $taskService]) {

  try {

    const PORT = $env.PORT || 80;

    await $slackService.message({
      channel: 'logging',
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
      
      // 'GolfPhi': ALL,
      'stogachess': ALL, // vin

      /** Politics - Political figures */
      // 'realDonaldTrump': ALL, // suspended
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
      // 'DHS_Wolf': LOW, // deactivated / deleted
      'mtgreenee': DEFAULT,
      'GovRonDeSantis': DEFAULT,
      'SenTomCotton': DEFAULT,

      'ElectionWiz': LOW,

      /** Politics - Commentary */
      // 'CBS_Herridge': LOW,
      'mtracey': HIGH,
      'ggreenwald': HIGH,
      // 'JulianAssange': DEFAULT, // suspended
      'MZHemingway': DEFAULT,
      // 'Snowden': DEFAULT,

      /** Politics - RINOs */
      'BillKristol': [LOW, HIGH],
      // 'BretStephensNYT': LOW, deactivated
      'DavidCornDC': LOW,
      'DavidAFrench': HIGH,
      'davidfrum': [DEFAULT, HIGH],
      'JRubinBlogger': DEFAULT,
      'MaxBoot': LOW,
      // 'JonahDispatch': DEFAULT,
      // 'Timodc': LOW,
      // 'matthewjdowd': LOW,
      'TheRickWilson': LOW,
      // 'prchovanec': LOW,
      // 'monacharenEPPC': DEFAULT, // deactivated
      // 'RadioFreeTom': LOW,
      'sarahjeong': HIGH,
      // 'SteveSchmidtSES': HIGH,
      // 'SykesCharlie': LOW,

      // 'patrickbyrne': LOW, // suspended

      'NateSilver538': ALL,

      'NotMrTibbs': DEFAULT,

      'JohnBrennan': DEFAULT,

      // 'AsstGroyper': HIGH,
      // 'DrDavidDuke': DEFAULT, // suspended
      // 'jartaylor': DEFAULT, // suspended
      // 'NickJFuentes': [DEFAULT, HIGH], // suspended
      // 'Raper6000': LOW, // fuentes alt // suspended
      // 'JadenPMcNeil': LOW,
      // 'EMichaelJones1': LOW, // suspended
      'RichardBSpencer': DEFAULT,

      'Cernovich': LOW,
      
      'AnnCoulter': HIGH,
      'BrittMcHenry': HIGH,
      'BuckSexton': DEFAULT,
      'charliekirk11': LOW,
      'DineshDSouza': DEFAULT,
      //'JackPosobiec': LOW, // protected
      'michellemalkin': DEFAULT,
      // 'mitchellvii': NONE,
      'MrAndyNgo': DEFAULT,
      'realchrisrufo': DEFAULT,
      'RealSaavedra': LOW,
      'seanmdav': LOW,
      // 'SohrabAhmari': DEFAULT, // deactivated
      'ScottMGreer': LOW,
      'MaxNordau': LOW,
      
      'LJZigerell': DEFAULT,
      'robkhenderson': DEFAULT,

      'MarkDice': DEFAULT,

      'EpochTimes': DEFAULT,
      // 'diana_west_': DEFAULT, // suspended
      'chenweihua': DEFAULT,
      // 'liangweihan4': LOW, // suspended
      // 'LiuXiaoqiliu5': LOW, deactivated / deleted / suspended
      // 'LiangHanWei6': LOW,
      // 'Xongkuro': DEFAULT, // manju baturu // suspended
      // 'GGofCA': DEFAULT, // manju baturu // suspended
      // 'prorexAmericae': DEFAULT, // manju, account down

      // 'Gavin_McInnes': DEFAULT, // suspended
      // 'GrrrGraphics': DEFAULT, // suspended
      // 'Jack_Burkman': HIGH, // suspended
      // 'JacobAWohl': DEFAULT, // suspended
      'peterbrimelow': [DEFAULT, HIGH],
      'rooshv': DEFAULT,
      // 'StefanMolyneux': LOW, // suspended
      'Steve_Sailer': LOW,

      // 'JBurtonXP': LOW, // dormant
      // 'RealAlexJones': DEFAULT, // suspended
      'PrisonPlanet': LOW,
      // 'JamesOKeefeIII': LOW, // suspended

      // 'bronzeagemantis': LOW, // suspended
      // 'ESYudkowsky': DEFAULT,
      // 'moldbugman': LOW, // protected
      'Outsideness': DEFAULT,
      // 'thespandrell': DEFAULT, // suspended
      // 'RokoMijicUK': LOW, // protected

      'DGradenigo': HIGH,
      // 'DLoesch': LOW,
      // 'HAGOODMANAUTHOR', // deleted
      'JLPtalk': DEFAULT,
      // 'JournosPostLs': HIGH, // suspended
      // 'porter14159': LOW, // suspended
      // 'RealBrysonGray': LOW,
      'RealCandaceO': DEFAULT,
      // 'RRTIndustries': HIGH, // suspended
      'rrtidotcom': HIGH,
      'TheOfficerTatum': DEFAULT,
      'TitaniaMcGrath': LOW,
      // 'tummymuncher': LOW,
      'VonAbele': ALL,

      // 'AmRenPosts': ALL, // test order, suspended

      // 'ObamaMalik': DEFAULT, // deactivated
      'NoorBinLadin': DEFAULT,
      'JamesADamore': HIGH,
      'KyleKashuv': DEFAULT,
      
      'DonaldJTrumpJr': DEFAULT,
      'EricTrump': LOW,
      'KimStrassel': LOW,
      'realJeffreyLord': LOW,
      'Surabees': HIGH,

      'bariweiss': LOW,
      'benshapiro': DEFAULT,
      'brad_polumbo': LOW,
      // 'CalebJHull': LOW,
      // 'cathyyoung63': LOW,
      // 'CHSommers': LOW,
      'clairlemon': LOW,
      'DouthatNYT': DEFAULT,
      'edasante77': DEFAULT,
      'MattWalshBlog': LOW,
      // 'michaelbd': LOW,
      // 'powellnyt': DEFAULT,
      'roddreher': DEFAULT,
      'RubinReport': LOW,
      'scrowder': LOW,
      'sullydish': HIGH,

      'BretWeinstein': HIGH,
      'EricRWeinstein': HIGH,
      'IAmAdamRobinson': DEFAULT,
      'jordanbpeterson': HIGH,
      'MacaesBruno': [DEFAULT, HIGH],
      //'nntaleb': [DEFAULT, HIGH], // protected
      'RichardDawkins': DEFAULT,
      'robinhanson': HIGH,
      'sapinker': HIGH,
      'ScottAdamsSays': [DEFAULT, HIGH],
      'steak_umm': DEFAULT,
      'tylercowen': HIGH,
      'ATabarrok': DEFAULT,
      // 'neiltyson': DEFAULT,
      'SamHarrisOrg': DEFAULT,

      // 'WokeCapital': LOW, // suspended
      'WokeReligion': DEFAULT,

      'charlesmurray': DEFAULT,
      'ThomasSowell': DEFAULT,

      'johndurant': NONE,

      // 'RogerJStoneJr': ALL, // suspended
      'DavidWohl': LOW,

      'SheriffClarke': LOW,
      
      'THEHermanCain': DEFAULT,

      'DarrenJBeattie': DEFAULT,

      // 'atensnut': DEFAULT, // juanita broaddrick
      'ComfortablySmug': LOW,
      // 'gogreen18': DEFAULT, // laci green

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
      // 'NaomiAKlein': HIGH,
      // 'ddale8': ALL,
      // 'PolitiFact': ALL,
      // 'donnabrazile': DEFAULT,
      // 'sallykohn': DEFAULT,
      'marcushjohnson': LOW,
      'MollyJongFast': LOW,
      // 'shaunking': LOW, // protected
      'tomwatson': DEFAULT,
      'peterdaou': DEFAULT,
      // 'ericgarland': LOW,
      'jonfavs': LOW,
      'jonlovett': LOW,
      'danpfeiffer': LOW,
      'TVietor08': LOW,
      'brhodes': LOW,
      'HeerJeet': LOW,
      // 'TaylorLorenz': HIGH, // protected
      'emilyvdw': DEFAULT,
      'EmilyGorcenski': DEFAULT,

      'benjaminwittes': LOW,
      'tribelaw': [LOW, HIGH],
      'Yascha_Mounk': LOW,

      // 'DrIbram': HIGH,
      // 'gaywonk': DEFAULT, // carlos maza
      'lsarsour': DEFAULT,
      'nhannahjones': DEFAULT,
      // 'RazSimone': HIGH,
      // 'tanehisicoates': DEFAULT, // deactivated
      // 'womensmarch': DEFAULT,

      'ronanfarrow': DEFAULT,

      'davidhogg111': DEFAULT,

      'ChelseaClinton': DEFAULT,

      // 'noahpinion': DEFAULT,

      'ebruenig': LOW, // deactivated
      'MattBruenig': [LOW, HIGH],
      
      'ezraklein': HIGH,
      'mattyglesias': [DEFAULT, HIGH],

      // 'ScottPresler': DEFAULT,

      'rosemcgowan': HIGH,

      // 'funder': LOW, // scott dworkin
      
      'jacobwohlreport': HIGH,
      'jaredlholt': LOW,

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

      /** Culture - Feminists */
      'AmandaMarcotte': LOW,
      'feministabulous': [DEFAULT, HIGH],
      'JessicaValenti': DEFAULT,
      //'sarahcuda': DEFAULT,
      //'susanthesquark': DEFAULT,
      // 'sairasameerarao': DEFAULT, // deactivated

      /** Culture - Catholic */
      'classicaltheis': LOW,
      // 'GrafVonGrau': [DEFAULT, HIGH], // EarlOfGrey suspended
      'JamesMartinSJ': HIGH,
      // 'SerfofGrey': LOW, // suspended
      // 'SirBilly_Bob': DEFAULT, // deactivated or deleted own account
      // 'ServusJC': LOW, // SirBilly_Bob new account // deactivated or deleted
      // 'mcitlfraphorism': HIGH, // deactivated
      // 'NoTrueScotist': DEFAULT, // tradical // deactivated?
      // 'piagnone': DEFAULT, // woke space jesuit
      'SereneJones': HIGH,
      'vermeullarmine': HIGH,
      'Western_Trad': DEFAULT,

      /**
       * Tech / business
       */
      'arrington': LOW,
      'BillGates': DEFAULT,
      'elonmusk': HIGH,
      'joshbloch': HIGH,
      // 'ekp': HIGH, // protected
      'paulg': DEFAULT,
      'sama': HIGH,
      // 'balajis': HIGH,
      // 'naval': DEFAULT,
      // 'michaeljburry': DEFAULT, // protected

      /**
       * Sports
       */
      // 'adamjones985': ALL,
      // 'Bease11': HIGH, // deactivated
      // 'BenVolin': ALL,
      // 'BillSimmons': DEFAULT,
      'BauerOutage': DEFAULT,
      'ClayTravis': DEFAULT,
      // 'ColinCowherd': DEFAULT,
      'DevanFink': LOW,
      'DingerTracker': NONE,
      // 'GCTigerTracker': ALL,
      'gm_reshuffle': HIGH,
      // 'GregABedard': ALL,
      // 'HelmetStalker': ALL,
      // 'jaysonst': DEFAULT,
      'jemelehill': DEFAULT,
      'JoelEmbiid': DEFAULT,
      // 'JoseCanseco': HIGH,
      // 'Kato_Kaelin': ALL,
      // 'Keefe21': ALL,
      // 'KinelRyan': HIGH,
      // 'LennyDykstra': DEFAULT,
      // 'MLBBarrelAlert': ALL,
      'mlombardiNFL': HIGH,
      'NFL_Scorigami': ALL,
      'TheRealOJ32': DEFAULT,
      'pgammo': HIGH,
      'RealSkipBayless': HIGH,
      //'ShoheiOhtaniWAR': ALL,
      'stoolpresidente': HIGH,
      'TomBrady': ALL,
      'tucker_tnl': DEFAULT,
      'whitlockjason': HIGH,
      // 'wojespn': ALL,
      // 'ShamsCharania': ALL,
      // 'kingjames': DEFAULT,
      // 'SHAQ': ALL,
      // 'KevinGarnett5KG': ALL,
      // 'paulpierce34': ALL,
      // 'aubrey_huff': DEFAULT, // suspended
      // 'gehrig38': HIGH, // deactivated

      '3xchair': LOW, // armond white
      'RobAger': HIGH,
      'SonnyBunch': DEFAULT,
      // 'the_moviebob': LOW,

      // 'ABFalecbaldwin': HIGH, // deactivated
      // 'AdamBaldwin': LOW,
      'AndyRichter': DEFAULT,
      'AoDespair': DEFAULT, // david simon
      // 'arthur_affect': DEFAULT,
      'bradrutter': ALL,
      // 'chuckwoolery': LOW, // deactivated
      // 'ginacarano': HIGH,
      // 'jarule': HIGH,
      'jack': DEFAULT,
      'James_Holzhauer': HIGH,
      'jimmy_wales': HIGH,
      'johncusack': DEFAULT,
      'johnlegend': [DEFAULT, HIGH],
      'JohnHinckley20': LOW,
      'jontaffer': HIGH,
      'jonvoight': ALL,
      'joss': [DEFAULT, HIGH],
      'KenJennings': DEFAULT,
      'kirstiealley': DEFAULT,
      // 'NICKIMINAJ': HIGH,
      'normmacdonald': DEFAULT,
      'RealJamesWoods': LOW,
      // 'RobSchneider': DEFAULT,
      'rogcraig': HIGH,
      // 'SageRosenfels18': DEFAULT,
      'SarahKSilverman': [DEFAULT, HIGH],
      // 'thecampaignbook': DEFAULT, // shia labeouf
      'TheRealDisco': DEFAULT,
      'timheidecker': DEFAULT,
      'wilw': HIGH,
      'kanyewest': DEFAULT,
      // 'RandyRRQuaid': HIGH,
      // 'ViKu1111': HIGH, // suspended

      /**
       * Other
       */

      'acsimonds': ALL,

      // 'wsbmod': HIGH,

      // 'AlexBerenson': DEFAULT, // suspended
      // 'GenRescue': HIGH, // berenson alt
      
      'mccloskeyusa': LOW,

      // 'aigkenham': DEFAULT,
      // 'AJA_Cortes': DEFAULT,
      // 'EdLatimore': DEFAULT,

      // 'Ahmadinejad1956': DEFAULT,

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

    tasks.push($taskService.runTrumpDeskTask());
    // tasks.push($taskService.runPredictItTask(5914)); // impeachment

    await Promise.all(tasks);

  } catch (e) {
    setTimeout(() => { throw e; }, 0);
  }

};

module.exports = inject(app);
