CREATE TABLE IF NOT EXISTS expressions
(
    id              serial primary key,
    expression      text,
    status          integer,
    data_created    text,
    data_calculated text,
    result          double precision,
    work_start      timestamp
);
