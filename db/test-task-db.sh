#!/usr/bin/env bash
docker container rm -f testtask_db
docker build -t testtask_db db/.
docker run -d --name testtask_db -p 5433:5432 testtask_db