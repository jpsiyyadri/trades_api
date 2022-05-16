#!/bin/sh

tar czf trades_api.tar.gz api.js package.json src README.md data
scp trades_api.tar.gz ec2-user@65.1.147.223:~/

rm trades_api.tar.gz

ssh ec2-user@65.1.147.223 << 'ENDSSH'

pm2 stop trades_api
rm -rf trades_api
mkdir trades_api

tar xf trades_api.tar.gz -C trades_api
rm trades_api.tar.gz
cd trades_api

npm install
pm2 start trades_api

ENDSSH
