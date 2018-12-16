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
  // $taskService.runPredictItTask(3812), // AZ senator
  $taskService.runAllTweetsTask('realDonaldTrump', false),
  // $taskService.runAllTweetsTask('RealSkipBayless', false),
  $taskService.runHighScoringTweetsTask('RealSkipBayless'),
  $taskService.runAllTweetsTask('mtracey'),
  $taskService.runAllTweetsTask('NFL_Scorigami'),
  $taskService.runAllTweetsTask('VonAbele'),
  // $taskService.runAllTweetsTask('acsimonds', false), // protected
  $taskService.runHighScoringTweetsTask('NickJFuentes'),
  $taskService.runHighScoringTweetsTask('BuckSexton'),
  // $taskService.runHighScoringTweetsTask('porter14159'),
  $taskService.runHighScoringTweetsTask('RRTIndustries'),
  $taskService.runHighScoringTweetsTask('KenJennings'),
  $taskService.runHighScoringTweetsTask('ScottAdamsSays'),
  $taskService.runHighScoringTweetsTask('benshapiro'),
  $taskService.runHighScoringTweetsTask('AnnCoulter'),
  $taskService.runHighScoringTweetsTask('davidfrum'),
  $taskService.runHighScoringTweetsTask('radicalbytes'),
  $taskService.runHighScoringTweetsTask('arthur_affect'),
  $taskService.runHighScoringTweetsTask('elonmusk'),
  $taskService.runHighScoringTweetsTask('NateSilver538'),
  $taskService.runHighScoringTweetsTask('RichardBSpencer'),
  $taskService.runHighScoringTweetsTask('ObamaMalik'),
  $taskService.runHighScoringTweetsTask('kurteichenwald'),
  $taskService.runHighScoringTweetsTask('KyleKashuv'),
  $taskService.runHighScoringTweetsTask('HAGOODMANAUTHOR'),
  $taskService.runHighScoringTweetsTask('MacaesBruno'),
  $taskService.runHighScoringTweetsTask('ronanfarrow'),
  $taskService.runHighScoringTweetsTask('DineshDSouza'),
  $taskService.runHighScoringTweetsTask('jordanbpeterson'),
  $taskService.runHighScoringTweetsTask('michellemalkin'),
  $taskService.runHighScoringTweetsTask('BrittMcHenry'),
  $taskService.runHighScoringTweetsTask('joshbloch'),
  $taskService.runHighScoringTweetsTask('ggreenwald'),
  $taskService.runHighScoringTweetsTask('EricRWeinstein'),
  $taskService.runHighScoringTweetsTask('BretWeinstein'),
  $taskService.runHighScoringTweetsTask('TheRealDisco'),
  $taskService.runHighScoringTweetsTask('seanmdav'),
  $taskService.runHighScoringTweetsTask('RealSaavedra'),
  $taskService.runHighScoringTweetsTask('femfreq'),
  $taskService.runHighScoringTweetsTask('anitasarkeesian'),
  $taskService.runHighScoringTweetsTask('lsarsour'),
  $taskService.runHighScoringTweetsTask('womensmarch'),
  $taskService.runHighScoringTweetsTask('DonaldJTrumpJr'),
  $taskService.runHighScoringTweetsTask('ekp'),
  // $taskService.runHighScoringTweetsTask('funder'),
  $taskService.runHighScoringTweetsTask('edasante77'),
  $taskService.runHighScoringTweetsTask('EdLatimore'),
  // $taskService.runHighScoringTweetsTask('AJA_Cortes'),
  $taskService.runHighScoringTweetsTask('stoolpresidente'),
  // $taskService.runHighScoringTweetsTask('ComfortablySmug'),
  $taskService.runHighScoringTweetsTask('peterbrimelow'),
  $taskService.runHighScoringTweetsTask('ezraklein'),
  $taskService.runHighScoringTweetsTask('DavidAFrench'),
  $taskService.runHighScoringTweetsTask('MattBruenig'),
  $taskService.runHighScoringTweetsTask('ebruenig'),
  $taskService.runHighScoringTweetsTask('jaredlholt'),
  $taskService.runHighScoringTweetsTask('ashleyfeinberg'),
  $taskService.runHighScoringTweetsTask('GrafVonGrau'),
  // $taskService.runHighScoringTweetsTask('classicaltheis'),
  $taskService.runHighScoringTweetsTask('gogreen18'),
  // $taskService.runHighScoringTweetsTask('davidhogg111'),
  // // $taskService.runAllTweetsTask('MLBBarrelAlert'),
  // // $taskService.runAllTweetsTask('HelmetStalker'),
  // // $taskService.runAllTweetsTask('ShoheiOhtaniWAR'),
  // $taskService.runAllTweetsTask('GCTigerTracker'),
  // // $taskService.runAllTweetsTask('PolitiFact', false),
  // // $taskService.runAllTweetsTask('ddale8', false),
  // // $taskService.runAllTweetsTask('Kato_Kaelin'),
  // $taskService.runHighScoringTweetsTask('RealJamesWoods'),
  // // $taskService.runAllTweetsTask('RogerJStoneJr'), // account suspended
  // // $taskService.runAllTweetsTask('3xchair'),
  // // $taskService.runAllTweetsTask('JoelEmbiid'),
  // $taskService.runHighScoringTweetsTask('nntaleb'),
  // $taskService.runHighScoringTweetsTask('mattyglesias'),
  // // $taskService.runHighScoringTweetsTask('jbouie'),
  // $taskService.runHighScoringTweetsTask('paulkrugman'),
  // // $taskService.runHighScoringTweetsTask('joss'),
  // // $taskService.runHighScoringTweetsTask('ColinCowherd'),
  // $taskService.runHighScoringTweetsTask('ChelseaClinton'),
  // // $taskService.runHighScoringTweetsTask('Cernovich'),
  // // $taskService.runHighScoringTweetsTask('mitchellvii'),
  // // $taskService.runHighScoringTweetsTask('seanhannity'),
  // // $taskService.runHighScoringTweetsTask('JulianAssange'),
  // // $taskService.runHighScoringTweetsTask('RealAlexJones'), // account suspended
  // $taskService.runHighScoringTweetsTask('PrisonPlanet'),
  // $taskService.runHighScoringTweetsTask('JamesOKeefeIII'),
  // $taskService.runHighScoringTweetsTask('piersmorgan'),
  // // $taskService.runHighScoringTweetsTask('CHSommers'),
  // // $taskService.runHighScoringTweetsTask('SheriffClarke'),
  // $taskService.runHighScoringTweetsTask('chuckwoolery'),
  // $taskService.runHighScoringTweetsTask('johndurant'),
  // $taskService.runHighScoringTweetsTask('StefanMolyneux'),
  // // $taskService.runHighScoringTweetsTask('leighalexander'),
  // // $taskService.runHighScoringTweetsTask('UnburntWitch'),
  // $taskService.runHighScoringTweetsTask('AmandaMarcotte'),
  // $taskService.runHighScoringTweetsTask('JessicaValenti'),
  // $taskService.runHighScoringTweetsTask('Spacekatgal'),
  // // $taskService.runHighScoringTweetsTask('randileeharper'),
  // // $taskService.runHighScoringTweetsTask('susanthesquark'),
  // // $taskService.runHighScoringTweetsTask('sarahcuda'),
  // // $taskService.runHighScoringTweetsTask('feministabulous'),
  // // $taskService.runHighScoringTweetsTask('stillgray'),
  // // $taskService.runHighScoringTweetsTask('aigkenham'),
  // // $taskService.runHighScoringTweetsTask('atensnut'),
  // $taskService.runHighScoringTweetsTask('TuckerCarlson'),
  // $taskService.runHighScoringTweetsTask('davidbrockdc'),
  // // $taskService.runHighScoringTweetsTask('ananavarro'),
  // $taskService.runHighScoringTweetsTask('HillaryClinton'),
  // $taskService.runHighScoringTweetsTask('BernieSanders'),
  // // $taskService.runHighScoringTweetsTask('Gavin_McInnes'), // account suspended
  // // $taskService.runHighScoringTweetsTask('RobSchneider'),
  // $taskService.runHighScoringTweetsTask('tedcruz'),
  // // $taskService.runHighScoringTweetsTask('JohnKasich'),
  // // $taskService.runHighScoringTweetsTask('JebBush'),
  // // $taskService.runHighScoringTweetsTask('EricTrump'),
  // // $taskService.runHighScoringTweetsTask('thecampaignbook'),
  // $taskService.runHighScoringTweetsTask('johnlegend'),
  // $taskService.runHighScoringTweetsTask('mlombardiNFL'),
  // // $taskService.runHighScoringTweetsTask('GrrrGraphics'),
  // // $taskService.runHighScoringTweetsTask('SarahKSilverman'),
  // $taskService.runHighScoringTweetsTask('SenWarren'),
  // // $taskService.runHighScoringTweetsTask('jartaylor'), // account suspended
  // // $taskService.runHighScoringTweetsTask('tanehisicoates'), // deactivated
  // // $taskService.runHighScoringTweetsTask('neeratanden'),
  // // $taskService.runHighScoringTweetsTask('BillSimmons'),
  // // $taskService.runHighScoringTweetsTask('KamalaHarris'),
  // // $taskService.runHighScoringTweetsTask('donnabrazile'),
  // // $taskService.runHighScoringTweetsTask('Snowden'),
  // // $taskService.runHighScoringTweetsTask('realJeffreyLord'),
  // // $taskService.runHighScoringTweetsTask('sallykohn'),
  // // $taskService.runHighScoringTweetsTask('BenKuchera'),
  // $taskService.runHighScoringTweetsTask('BenSasse'),
  // $taskService.runHighScoringTweetsTask('SarahPalinUSA'),
  // // $taskService.runHighScoringTweetsTask('arrington'),
  // // $taskService.runHighScoringTweetsTask('neiltyson'),
  // // $taskService.runHighScoringTweetsTask('sama'),
  // $taskService.runHighScoringTweetsTask('KimStrassel'),
  // // $taskService.runAllTweetsTask('GregABedard'),
  // // $taskService.runAllTweetsTask('Keefe21'),
  // // $taskService.runAllTweetsTask('adamjones985'),
  // // $taskService.runAllTweetsTask('BenVolin'),
  // $taskService.runHighScoringTweetsTask('ClayTravis'),
  // $taskService.runHighScoringTweetsTask('pgammo'),
  // $taskService.runHighScoringTweetsTask('jaysonst'),
  // // $taskService.runHighScoringTweetsTask('RubinReport'),
  // // $taskService.runHighScoringTweetsTask('balajis'),
  // // $taskService.runHighScoringTweetsTask('marcushjohnson'),
  // // $taskService.runHighScoringTweetsTask('robinhanson'),
  // // $taskService.runHighScoringTweetsTask('tylercowen'),
  // // $taskService.runHighScoringTweetsTask('Ahmadinejad1956'),
  // $taskService.runHighScoringTweetsTask('JBurtonXP'),
  // $taskService.runHighScoringTweetsTask('ericgarland'),
  // // $taskService.runHighScoringTweetsTask('JackPosobiec'),
  // // $taskService.runHighScoringTweetsTask('charliekirk11'),
  // // $taskService.runHighScoringTweetsTask('scrowder'),
  // // $taskService.runHighScoringTweetsTask('RealCandaceO'),
  // // $taskService.runHighScoringTweetsTask('ScottPresler'),
  // // $taskService.runHighScoringTweetsTask('SageRosenfels18'),
  // // $taskService.runHighScoringTweetsTask('jonfavs'),
  // // $taskService.runHighScoringTweetsTask('jonlovett'),
  // // $taskService.runHighScoringTweetsTask('danpfeiffer'),
  // // $taskService.runHighScoringTweetsTask('TVietor08'),
  // // $taskService.runHighScoringTweetsTask('brhodes'),
  // // $taskService.runHighScoringTweetsTask('CalebJHull'),
  // // $taskService.runHighScoringTweetsTask('wilw'), // deactivated
  // $taskService.runHighScoringTweetsTask('matthewjdowd'),
  // // $taskService.runHighScoringTweetsTask('JRubinBlogger'),
  // // $taskService.runHighScoringTweetsTask('MaxBoot'),
  // $taskService.runHighScoringTweetsTask('HeerJeet'),
  // // $taskService.runHighScoringTweetsTask('gillibrandny'),
  // $taskService.runHighScoringTweetsTask('benjaminwittes'),
  // $taskService.runHighScoringTweetsTask('chrislhayes'),
  // // $taskService.runHighScoringTweetsTask('AdamBaldwin'),
  // // $taskService.runHighScoringTweetsTask('Yascha_Mounk'),
  // // $taskService.runHighScoringTweetsTask('kanyewest'), // deactivated
  // // $taskService.runHighScoringTweetsTask('BillKristol'),
  // $taskService.runHighScoringTweetsTask('IngrahamAngle'),
  // // $taskService.runBestTweetsTask(),
    ]);

  } catch (e) {

    await $slackService.crashReport(e.stack);
    throw(e);

  }

}

module.exports = inject(app);
