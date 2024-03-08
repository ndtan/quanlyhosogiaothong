-- we don't know how to generate root <with-no-name> (class Root) :(
create table officers
(
    id INTEGER not null
        constraint officers_pk
            primary key autoincrement,
    name char(63) not null,
    birthday date,
    department char(31),
    role char(31)
);

create unique index officers_id_uindex
    on officers (id);

create table places
(
    id INTEGER not null
        constraint places_pk
            primary key autoincrement,
    name char(31) not null,
    type char(15) default 'province' not null,
    code char(6)
);

create unique index places_id_uindex
    on places (id);

create table profiles
(
    id INTEGER not null
        constraint profiles_pk
            primary key autoincrement,
    plate char(15) not null,
    plain_plate char(15) not null,
    content varchar(255) not null,
    created_by_id INTEGER not null
        references officers
            on update cascade on delete cascade,
    created_by char(63),
    last_action char(15),
    created_at datetime default (unixepoch()) not null
);

create table manipulations
(
    id INTEGER not null
        constraint manipulations_pk
            primary key autoincrement,
    profile_id INTEGER not null
        references profiles
            on update cascade on delete cascade,
    plate char(15) not null,
    plain_plate char(15) not null,
    action char(15) not null,
    text1 char(31),
    text2 char(31),
    number1 INTEGER,
    number2 INTEGER,
    place_id INTEGER
        references places
            on update cascade on delete cascade,
    place char(31),
    manipulated_at datetime default (unixepoch()),
    manipulated_by_id INTEGER not null
        references officers
            on update cascade on delete cascade,
    manipulated_by char(63) not null,
    return_at datetime,
    return_by_id INTEGER
        references officers
            on update cascade on delete cascade,
    return_by char(63)
);

create index manipulations_action_index
    on manipulations (action);

create unique index manipulations_id_uindex
    on manipulations (id);

create index manipulations_manipulated_at_index
    on manipulations (manipulated_at desc);

create index manipulations_manipulated_by_id_index
    on manipulations (manipulated_by_id);

create index manipulations_place_id_index
    on manipulations (place_id);

create index manipulations_plate_index
    on manipulations (plate);

create index manipulations_profile_id_index
    on manipulations (profile_id);

create index manipulations_return_at_index
    on manipulations (return_at desc);

create index manipulations_return_by_id_index
    on manipulations (return_by_id);

create index manipulations_text1_index
    on manipulations (text1);

create index profiles_created_at_index
    on profiles (created_at);

create index profiles_created_by_id_index
    on profiles (created_by_id);

create unique index profiles_id_uindex
    on profiles (id);

create unique index profiles_plain_plate_uindex
    on profiles (plain_plate);

create unique index profiles_plate_uindex
    on profiles (plate);

create table storage
(
    key char(31) not null
        constraint storage_pk
            primary key,
    value char(255),
    updated_at datetime default (unixepoch())
);

create unique index storage_key_uindex
    on storage (key);
