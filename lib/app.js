'use strict';

const fs = require('fs');
const inject = require('./inject');
const path = require('path');

async function app([$env, $logger, $server, $slackService, $taskService]) {

  // Start server
  const PORT = $env.PORT || 80;

  try {

    //const screenNames = fs.readFileSync(path.join($env.HOME, 'screenNames'), 'utf8');
    //$logger.info(`screenNames: ${screenNames}`);

    $server.listen(PORT, () => {
      $logger.info(`Server listening on port ${PORT}`);
    });


    // Start tasks

    await Promise.all([
  // $taskService.runPredictItTask(5087), // Govt shutdown
  $taskService.runAllTweetsTask('realDonaldTrump', false),
  $taskService.runAllTweetsTask('RealSkipBayless', false),
  $taskService.runHighScoringTweetsTask('mtracey', 'high'),
  // $taskService.runAllTweetsTask('NFL_Scorigami'),
  $taskService.runAllTweetsTask('VonAbele'),
  // $taskService.runAllTweetsTask('acsimonds', false), // protected
  $taskService.runHighScoringTweetsTask('NickJFuentes', 'low'),
  $taskService.runHighScoringTweetsTask('BuckSexton'),
  $taskService.runHighScoringTweetsTask('porter14159', 'low'),
  // $taskService.runHighScoringTweetsTask('RRTIndustries'), // suspended
  $taskService.runHighScoringTweetsTask('KenJennings'),
  $taskService.runHighScoringTweetsTask('ScottAdamsSays', 'high'),
  $taskService.runHighScoringTweetsTask('benshapiro'),
  $taskService.runHighScoringTweetsTask('AnnCoulter', 'high'),
  $taskService.runHighScoringTweetsTask('davidfrum'),
  $taskService.runHighScoringTweetsTask('arthur_affect'),
  $taskService.runHighScoringTweetsTask('elonmusk', 'high'),
  $taskService.runHighScoringTweetsTask('NateSilver538', 'high'),
  $taskService.runHighScoringTweetsTask('RichardBSpencer', 'high'),
  $taskService.runHighScoringTweetsTask('DrDavidDuke'),
  $taskService.runHighScoringTweetsTask('ObamaMalik'),
  $taskService.runHighScoringTweetsTask('kurteichenwald'),
  $taskService.runHighScoringTweetsTask('KyleKashuv'),
  // $taskService.runHighScoringTweetsTask('HAGOODMANAUTHOR'), // deactivated
  $taskService.runHighScoringTweetsTask('MacaesBruno'),
  $taskService.runHighScoringTweetsTask('ronanfarrow'),
  $taskService.runHighScoringTweetsTask('DineshDSouza'),
  $taskService.runHighScoringTweetsTask('jordanbpeterson', 'high'),
  $taskService.runHighScoringTweetsTask('michellemalkin', 'high'),
  $taskService.runHighScoringTweetsTask('BrittMcHenry', 'high'),
  $taskService.runHighScoringTweetsTask('joshbloch', 'high'),
  $taskService.runHighScoringTweetsTask('ggreenwald'),
  $taskService.runHighScoringTweetsTask('EricRWeinstein', 'high'),
  $taskService.runHighScoringTweetsTask('BretWeinstein', 'high'),
  $taskService.runHighScoringTweetsTask('IAmAdamRobinson'),
  $taskService.runHighScoringTweetsTask('TheRealDisco'),
  $taskService.runHighScoringTweetsTask('seanmdav', 'low'),
  $taskService.runHighScoringTweetsTask('RealSaavedra', 'low'),
  // $taskService.runHighScoringTweetsTask('femfreq'),
  $taskService.runHighScoringTweetsTask('anitasarkeesian'),
  $taskService.runHighScoringTweetsTask('radicalbytes'),
  // $taskService.runHighScoringTweetsTask('lsarsour'),
  // $taskService.runHighScoringTweetsTask('womensmarch'),
  $taskService.runHighScoringTweetsTask('DonaldJTrumpJr'),
  $taskService.runHighScoringTweetsTask('ekp', 'high'),
  // $taskService.runHighScoringTweetsTask('funder', 'low'),
  $taskService.runHighScoringTweetsTask('edasante77'),
  // $taskService.runHighScoringTweetsTask('EdLatimore'),
  // $taskService.runHighScoringTweetsTask('AJA_Cortes'),
  $taskService.runHighScoringTweetsTask('ComfortablySmug', 'low'),
  $taskService.runHighScoringTweetsTask('peterbrimelow'),
  $taskService.runHighScoringTweetsTask('ezraklein', 'high'),
  $taskService.runHighScoringTweetsTask('DavidAFrench'),
  $taskService.runHighScoringTweetsTask('MattBruenig'),
  $taskService.runHighScoringTweetsTask('ebruenig', 'low'),
  $taskService.runHighScoringTweetsTask('jaredlholt', 'low'),
  $taskService.runHighScoringTweetsTask('ashleyfeinberg', 'low'),
  $taskService.runHighScoringTweetsTask('GrafVonGrau'), // protected
  $taskService.runHighScoringTweetsTask('classicaltheis'),
  // $taskService.runHighScoringTweetsTask('gogreen18'),
  // $taskService.runHighScoringTweetsTask('piagnone'),
  $taskService.runHighScoringTweetsTask('vermeullarmine'),
  $taskService.runHighScoringTweetsTask('davidhogg111', 'low'),
  // $taskService.runAllTweetsTask('MLBBarrelAlert'),
  // $taskService.runAllTweetsTask('HelmetStalker'),
  // $taskService.runAllTweetsTask('ShoheiOhtaniWAR'),
  // $taskService.runAllTweetsTask('GCTigerTracker'),
  // $taskService.runAllTweetsTask('PolitiFact', false),
  // $taskService.runAllTweetsTask('ddale8', false),
  // $taskService.runAllTweetsTask('Kato_Kaelin'),
  $taskService.runHighScoringTweetsTask('RealJamesWoods', 'low'),
  // $taskService.runAllTweetsTask('RogerJStoneJr'), // suspended
  $taskService.runHighScoringTweetsTask('3xchair', 'low'),
  $taskService.runHighScoringTweetsTask('JoelEmbiid'),
  $taskService.runHighScoringTweetsTask('nntaleb'),
  $taskService.runHighScoringTweetsTask('sapinker', 'high'),
  $taskService.runHighScoringTweetsTask('mattyglesias'),
  $taskService.runHighScoringTweetsTask('jbouie', 'low'),
  $taskService.runHighScoringTweetsTask('paulkrugman', 'high'),
  $taskService.runHighScoringTweetsTask('joss'),
  $taskService.runHighScoringTweetsTask('ChelseaClinton'),
  $taskService.runHighScoringTweetsTask('Cernovich', 'low'),
  // $taskService.runHighScoringTweetsTask('mitchellvii'),
  // $taskService.runHighScoringTweetsTask('seanhannity'),
  // $taskService.runHighScoringTweetsTask('JulianAssange'),
  // $taskService.runHighScoringTweetsTask('RealAlexJones'), // suspended
  // $taskService.runHighScoringTweetsTask('PrisonPlanet'),
  // $taskService.runHighScoringTweetsTask('JamesOKeefeIII'),
  $taskService.runHighScoringTweetsTask('piersmorgan'),
  $taskService.runHighScoringTweetsTask('CHSommers'),
  $taskService.runHighScoringTweetsTask('cathyyoung63'),
  $taskService.runHighScoringTweetsTask('clairlemon'),
  $taskService.runHighScoringTweetsTask('sullydish', 'high'),
  // $taskService.runHighScoringTweetsTask('noahpinion'),
  // $taskService.runHighScoringTweetsTask('SheriffClarke'),
  $taskService.runHighScoringTweetsTask('chuckwoolery'),
  $taskService.runHighScoringTweetsTask('johndurant'),
  $taskService.runHighScoringTweetsTask('StefanMolyneux', 'low'),
  // $taskService.runHighScoringTweetsTask('leighalexander'),
  // $taskService.runHighScoringTweetsTask('UnburntWitch'),
  $taskService.runHighScoringTweetsTask('AmandaMarcotte'),
  $taskService.runHighScoringTweetsTask('JessicaValenti'),
  $taskService.runHighScoringTweetsTask('Spacekatgal'),
  // $taskService.runHighScoringTweetsTask('randileeharper'),
  // $taskService.runHighScoringTweetsTask('susanthesquark'),
  // $taskService.runHighScoringTweetsTask('sarahcuda'),
  $taskService.runHighScoringTweetsTask('feministabulous'),
  // $taskService.runHighScoringTweetsTask('stillgray'),
  // $taskService.runHighScoringTweetsTask('aigkenham'),
  // $taskService.runHighScoringTweetsTask('atensnut'),
  // $taskService.runHighScoringTweetsTask('TuckerCarlson'),
  // $taskService.runHighScoringTweetsTask('davidbrockdc'),
  // $taskService.runHighScoringTweetsTask('ananavarro'),
  $taskService.runHighScoringTweetsTask('HillaryClinton', 'high'),
  $taskService.runHighScoringTweetsTask('BernieSanders', 'high'),
  $taskService.runHighScoringTweetsTask('ewarren'),
  $taskService.runHighScoringTweetsTask('KamalaHarris'),
  $taskService.runHighScoringTweetsTask('SenGillibrand', 'high'),
  $taskService.runHighScoringTweetsTask('AOC'),
  $taskService.runHighScoringTweetsTask('TulsiGabbard'),
  $taskService.runHighScoringTweetsTask('tedcruz', 'high'),
  $taskService.runHighScoringTweetsTask('JohnKasich', 'high'),
  $taskService.runHighScoringTweetsTask('JebBush', 'high'),
  $taskService.runHighScoringTweetsTask('BenSasse'),
  $taskService.runHighScoringTweetsTask('SarahPalinUSA', 'high'),
  $taskService.runHighScoringTweetsTask('DrJillStein'),
  // $taskService.runHighScoringTweetsTask('Gavin_McInnes'), // suspended
  // $taskService.runHighScoringTweetsTask('RobSchneider'),
  // $taskService.runHighScoringTweetsTask('EricTrump'),
  // $taskService.runHighScoringTweetsTask('thecampaignbook'),
  $taskService.runHighScoringTweetsTask('johnlegend'),
  // $taskService.runHighScoringTweetsTask('GrrrGraphics'),
  $taskService.runHighScoringTweetsTask('SarahKSilverman'),
  // $taskService.runHighScoringTweetsTask('jartaylor'), // suspended
  // $taskService.runHighScoringTweetsTask('tanehisicoates'), // deactivated
  $taskService.runHighScoringTweetsTask('neeratanden', 'low'),
  // $taskService.runHighScoringTweetsTask('donnabrazile'),
  // $taskService.runHighScoringTweetsTask('Snowden'),
  // $taskService.runHighScoringTweetsTask('realJeffreyLord'),
  // $taskService.runHighScoringTweetsTask('sallykohn'),
  // $taskService.runHighScoringTweetsTask('BenKuchera'),
  // $taskService.runHighScoringTweetsTask('arrington'),
  // $taskService.runHighScoringTweetsTask('neiltyson'),
  $taskService.runHighScoringTweetsTask('paulg', 'high'),
  $taskService.runHighScoringTweetsTask('sama', 'high'),
  // $taskService.runHighScoringTweetsTask('KimStrassel'),
  // $taskService.runAllTweetsTask('mlombardiNFL'),
  $taskService.runHighScoringTweetsTask('stoolpresidente'),
  // $taskService.runHighScoringTweetsTask('BillSimmons'),
  // $taskService.runHighScoringTweetsTask('ColinCowherd'),
  // $taskService.runAllTweetsTask('GregABedard'),
  // $taskService.runAllTweetsTask('Keefe21'),
  // $taskService.runAllTweetsTask('adamjones985'),
  // $taskService.runAllTweetsTask('BenVolin'),
  // $taskService.runHighScoringTweetsTask('ClayTravis'),
  $taskService.runHighScoringTweetsTask('pgammo', 'high'),
  // $taskService.runHighScoringTweetsTask('jaysonst'),
  $taskService.runHighScoringTweetsTask('JoseCanseco', 'high'),
  // $taskService.runHighScoringTweetsTask('RubinReport'),
  $taskService.runHighScoringTweetsTask('balajis', 'high'),
  $taskService.runHighScoringTweetsTask('naval', 'high'),
  // $taskService.runHighScoringTweetsTask('marcushjohnson'),
  $taskService.runHighScoringTweetsTask('robinhanson', 'high'),
  $taskService.runHighScoringTweetsTask('tylercowen', 'high'),
  // $taskService.runHighScoringTweetsTask('Ahmadinejad1956'),
  // $taskService.runHighScoringTweetsTask('JBurtonXP'),
  $taskService.runHighScoringTweetsTask('ericgarland'),
  // $taskService.runHighScoringTweetsTask('JackPosobiec'),
  // $taskService.runHighScoringTweetsTask('charliekirk11'),
  // $taskService.runHighScoringTweetsTask('scrowder'),
  $taskService.runHighScoringTweetsTask('RealCandaceO', 'low'),
  // $taskService.runHighScoringTweetsTask('ScottPresler'),
  // $taskService.runHighScoringTweetsTask('SageRosenfels18'),
  $taskService.runHighScoringTweetsTask('jonfavs', 'low'),
  $taskService.runHighScoringTweetsTask('jonlovett', 'low'),
  $taskService.runHighScoringTweetsTask('danpfeiffer', 'low'),
  $taskService.runHighScoringTweetsTask('TVietor08', 'low'),
  $taskService.runHighScoringTweetsTask('tribelaw'),
  $taskService.runHighScoringTweetsTask('brhodes', 'low'),
  // $taskService.runHighScoringTweetsTask('CalebJHull'),
  // $taskService.runHighScoringTweetsTask('wilw'),
  $taskService.runHighScoringTweetsTask('matthewjdowd', 'low'),
  $taskService.runHighScoringTweetsTask('JRubinBlogger', 'low'),
  $taskService.runHighScoringTweetsTask('MaxBoot', 'low'),
  $taskService.runHighScoringTweetsTask('BretStephensNYT', 'low'),
  $taskService.runHighScoringTweetsTask('HeerJeet', 'low'),
  $taskService.runHighScoringTweetsTask('benjaminwittes', 'low'),
  $taskService.runHighScoringTweetsTask('chrislhayes'),
  // $taskService.runHighScoringTweetsTask('AdamBaldwin'),
  // $taskService.runHighScoringTweetsTask('Yascha_Mounk'),
  // $taskService.runHighScoringTweetsTask('kanyewest'), // deactivated
  $taskService.runHighScoringTweetsTask('BillKristol'),
  // $taskService.runHighScoringTweetsTask('IngrahamAngle'),
  // $taskService.runBestTweetsTask(),
    ]);

  } catch (e) {

    // await $slackService.crashReport(e.stack);
    throw(e);

  }

}

module.exports = inject(app);
