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
    $taskService.runAllTweetsTask('realDonaldTrump', allTweetsInterval)/*,
    $taskService.runBestTweetsTask('Phi_Delta_Alpha', bestTweetsInterval)*/
  ]);

}

module.exports = inject(app);
