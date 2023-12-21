#!/bin/bash

TMP=`mktemp -d`
DEST=`../assets`
MOT_SRC='https://gtfs.mot.gov.il/gtfsfiles'

# Delete already existing database.
test -e $DEST/gtfs.db && rm $DEST/gtfs.db > /dev/null

# Download data from MOT then unzip into TMP directory.
wget --no-check-certificate  \
    $MOT_SRC/israel-public-transportation.zip -O $TMP/israel-public-transportation.zip &&
unzip $TMP/israel-public-transportation.zip -d $TMP

# We don't care about fares or translations.
rm $TMP/fare* $TMP/translations.txt > /dev/null

# Fill the schemas.
sqlite3 $DEST/gtfs.db  <<EOF
CREATE TABLE routes(
    route_id INTEGER PRINARY KEY,
    agency_id INTEGER,
    route_short_name TEXT,
    route_long_name TEXT,
    route_desc TEXT,
    route_type INTEGER,
    route_color TEXT
);
CREATE TABLE agency(
    agency_id INTEGER PRIMARY KEY,
    agency_name TEXT,
    agency_url TEXT,
    agency_timezone TEXT,
    agency_lang TEXT,
    agency_phone TEXT,
    agency_fare_url TEXT
);
CREATE TABLE trips(
    route_id INTEGER,
    service_id INTEGER,
    trip_id TEXT,
    trip_headsign TEXT,
    direction_id INTEGER,
    shape_id INTEGER
);
CREATE TABLE calendar(
    service_id INTEGER PRIMARY KEY,
    sunday INTEGER,
    monday INTEGER,
    tuesday INTEGER,
    wednesday INTEGER,
    thursday INTEGER,
    friday INTEGER,
    saturday INTEGER,
    start_date TEXT,
    end_date TEXT
);
CREATE TABLE stop_times(
    trip_id INTEGER,
    arrival_time TEXT,
    departure_time TEXT,
    stop_id INTEGER,
    stop_sequence INTEGER,
    pickup_type INTEGER,
    drop_off_type INTEGER,
    shape_dist_traveled REAL
);
CREATE TABLE stops(
    stop_id INTEGER PRIMARY KEY,
    stop_code TEXT,
    stop_name TEXT,
    stop_desc TEXT,
    stop_lat REAL,
    stop_lon REAL,
    location_type INTEGER,
    parent_station INTEGER,
    zone_id INTEGER
);
CREATE TABLE shapes(
    shape_id INTEGER,
    shape_pt_lat REAL,
    shape_pt_lon REAL,
    shape_pt_sequence INTEGER
);
CREATE TABLE translations(
    trans_id INTEGER PRIMARY KEY,
    lang TEXT,
    translation TEXT
);
EOF

# Import the CSVs into the database.
for i in $TMP/*.txt; do
FILE=`basename $i`
sqlite3 $DEST/gtfs.db <<EOF
.mode csv
.import '| tail -n +2 $i' `echo $FILE | cut -d '.' -f 1`
EOF

# Index the tables to improve performence.
sqlite3 $DEST/gtfs.db <<EOF
CREATE INDEX stop_times_stop_id_trip_id_index ON stop_times(stop_id, trip_id);
CREATE INDEX routes_route_id_index ON routes(route_id);
CREATE INDEX trips_trip_id ON trips(trip_id);
EOF

echo "done with $FILE"
done 
