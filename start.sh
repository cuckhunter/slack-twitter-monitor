#!/bin/zsh -u

REDEPLOY_LIMIT=10 # 0 for no limit
redeploys=0
redeploy_interval=2

while true; do
	node --harmony main || on_error
done

on_error() {

	if (( redeploys == REDEPLOY_LIMIT )); then
		echo "Reached deployment limit"
		exit 1
	fi

	printf "%.0f" $(( redeploy_interval * 1.5 ** redeploys++ )) | read redeploy_interval
	echo "Redeploy attempt #$redeploys in $redeploy_interval seconds..."
	sleep $redeploy_interval

}
