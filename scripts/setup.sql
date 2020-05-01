CREATE TABLE resorts
(
    id      SERIAL NOT NULL
        CONSTRAINT resorts_pk
            PRIMARY KEY,
    name    TEXT,
    slug    TEXT
);

CREATE UNIQUE INDEX resorts_slug_uindex
    ON resorts (slug);

CREATE TABLE pistes
(
    id        SERIAL NOT NULL
        CONSTRAINT pistes_pk
            PRIMARY KEY,
    resort_id INTEGER
        CONSTRAINT pistes_resorts_id_fk
            REFERENCES resorts,
    name      TEXT,
    slug      TEXT,
    path      JSONB,
    graph     JSONB
);

CREATE UNIQUE INDEX pistes_slug_uindex
    ON pistes (slug);
