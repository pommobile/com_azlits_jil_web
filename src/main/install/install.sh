#!/bin/bash -ex

TARGET_DIR=/var/www/localhost
if [ -d $TARGET_DIR ]; then
	rm  -f $TARGET_DIR/index.js
	rm -rf $TARGET_DIR/node_modules
else
	mkdir -p $TARGET_DIR
fi

SOURCE_DIR=/opt/codedeploy-agent/deployment-root/$DEPLOYMENT_GROUP_ID/$DEPLOYMENT_ID/deployment-archive
tar xvfz $SOURCE_DIR/*.tar.gz -C $TARGET_DIR index.js node_modules

