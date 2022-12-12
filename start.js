'use strict';

import { execFile } from 'node:child_process';

const REDEPLOY_LIMIT = 10; // 0 for no limit
let redeploys = 0;
let redeployInterval = 2;

function main() {

	// const controller = new AbortController();
	// const { signal } = controller;
	
	const child = execFile('node', ['--harmony', 'main'], /*{ signal },*/ (error) => {

	  if (redeploys == REDEPLOY_LIMIT) {
	  	console.log('Reached deployment limit');
	  	process.exit(1);
	  }

	  redeployInterval = redeployInterval * 1.5 ** redeploys++;
	  console.log(`Redeploy attempt #${redeploys} in ${redeploy_interval} seconds...`);
	  setTimeout(main, redeployInterval);

	});
	
	// controller.abort();

}

main();
