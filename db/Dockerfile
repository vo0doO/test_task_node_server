FROM postgres

ENV POSTGRES_PASSWORD=yoursecretpostgrespassword
WORKDIR /
COPY 0_ddl.sql /docker-entrypoint-initdb.d/
COPY 1_dml.sql /docker-entrypoint-initdb.d/
EXPOSE 5432
CMD ["postgres"]
