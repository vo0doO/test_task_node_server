#!/usr/bin/env bash

nodemon \
--inspect-brk \
--watch \
./app/models/*spec.js \
node_modules/mocha/bin/_mocha \
./app/models/*.spec.js \
--debug --reporter spec