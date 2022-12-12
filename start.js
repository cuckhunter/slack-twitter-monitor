'use strict';

const { fork } = require('node:child_process');

const REDEPLOY_LIMIT = 10; // 0 for no limit
let redeploys = 0;
let redeployInterval = 2;

function main() {

	// const child = fork('main', ['--harmony'], { stdio: 'pipe' });

	// child.on('close', (code, signal) => {

	// 	if (redeploys == REDEPLOY_LIMIT) {
	// 		console.log('Reached deployment limit');
	// 		process.exit(1);
	// 	}

	// 	redeployInterval = Math.round(redeployInterval * 1.5 ** redeploys++);
	// 	console.log(`Redeploy attempt #${redeploys} in ${redeployInterval} seconds...`);
	// 	setTimeout(main, redeployInterval * 1000);

	// });

	// child.stdout.on('data', (data) => {
	//   process.stdout.write(`stdout: ${data}`); // use instead of console to eliminate trailing newline
	// });

	// child.stderr.on('data', (data) => {
	//   process.stderr.write(`stderr: ${data}`); // use instead of console to eliminate trailing newline
	// });

}

main();
