docker container rm -f arbitr_db
docker build -t arbitr_db db/.
docker run -d --name arbitr_db -p 5433:5432 arbitr_db
