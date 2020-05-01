CREATE TABLE resorts
(
    id      SERIAL NOT NULL
        CONSTRAINT resorts_pk
            PRIMARY KEY,
    name    TEXT,
    url_key TEXT
);

CREATE UNIQUE INDEX resorts_url_key_uindex
    ON resorts (url_key);

CREATE TABLE pistes
(
    id        SERIAL NOT NULL
        CONSTRAINT pistes_pk
            PRIMARY KEY,
    resort_id INTEGER
        CONSTRAINT pistes_resorts_id_fk
            REFERENCES resorts,
    name      TEXT,
    url_key   TEXT,
    path      JSON,
    graph     JSON
);

CREATE UNIQUE INDEX pistes_url_key_uindex
    ON pistes (url_key);
