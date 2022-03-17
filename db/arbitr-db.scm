docker container rm -f postgres_db
docker build -t postgres_db db/.
docker run -d --name arbitr_db -p 5433:5432 postgres_db
