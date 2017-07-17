'use strict';

const inject = require('./inject');

async function app([$env, $logger, $server, $taskService]) {

  // Start server
  const PORT = $env.PORT || 80;

  $server.listen(PORT, () => {
    $logger.info(`Server listening on port ${PORT}`);
  });

  // Start tasks
  const [allTweetsInterval, bestTweetsInterval] =
    ($env.MODE == 'prod') ?
      [30 * 1000, 120 * 60 * 1000] :
      [10 * 1000, 60 * 1000];

  await Promise.all([
    $taskService.runAllTweetsTask('realDonaldTrump', allTweetsInterval),
    $taskService.runAllTweetsTask('3xchair', allTweetsInterval),
    $taskService.runAllTweetsTask('JoelEmbiid', allTweetsInterval),
    $taskService.runAllTweetsTask('mattyglesias', allTweetsInterval, 10),
    $taskService.runAllTweetsTask('jbouie', allTweetsInterval, 10),
    $taskService.runAllTweetsTask('davidfrum', allTweetsInterval, 2),
    $taskService.runAllTweetsTask('paulkrugman', allTweetsInterval),
    // $taskService.runAllTweetsTask('ColinCowherd', allTweetsInterval),
    // $taskService.runAllTweetsTask('ChelseaClinton', allTweetsInterval),
    // $taskService.runAllTweetsTask('RealSkipBayless', allTweetsInterval),
    // $taskService.runAllTweetsTask('mlombardiNFL', allTweetsInterval),
    // $taskService.runAllTweetsTask('GregABedard', allTweetsInterval),
    // $taskService.runAllTweetsTask('Keefe21', allTweetsInterval),
    // $taskService.runAllTweetsTask('adamjones985', allTweetsInterval),
    // $taskService.runAllTweetsTask('BenVolin', allTweetsInterval),
    // $taskService.runBestTweetsTask('Phi_Delta_Alpha', bestTweetsInterval),
  ]);

}

module.exports = inject(app);
