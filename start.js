'use strict';

// import { execFile } from 'node:child_process';
const { fork } = require('node:child_process');

const REDEPLOY_LIMIT = 10; // 0 for no limit
let redeploys = 0;
let redeployInterval = 2;

const redeploy = (fn) => {
	
	if (redeploys == REDEPLOY_LIMIT) {
		console.log('Reached deployment limit');
		process.exit(1);
	}

	redeployInterval = redeployInterval * 1.5 ** redeploys++;
	console.log(`Redeploy attempt #${redeploys} in ${redeploy_interval} seconds...`);
	setTimeout(fn, redeployInterval);

}

function main() {

	// const controller = new AbortController();
	// const { signal } = controller;
	
	const child = fork('main', ['--harmony'], /*{ signal }*/);

	child.on('error', (err) => {
		redeploy(main);
	});

	child.on('close', (err) => {
		redeploy(main);
	});

	child.stdout.on('data', (data) => {
	  console.log(`stdout: ${data}`);
	});

	child.stderr.on('data', (data) => {
	  console.error(`stderr: ${data}`);
	});
	
	// controller.abort();

}

main();
