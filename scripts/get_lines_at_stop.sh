#!/bin/bash

#SELECT distinct r.*
#    FROM stops s
#    INNER JOIN stop_times st ON s.stop_id = st.stop_id
#    INNER JOIN trips t ON t.trip_id = st.trip_id
#    INNER JOIN routes r ON r.route_id = t.route_id
#    WHERE s.stop_code = $1;

#select distinct r.* from routes r where route_id in (
#    select route_id from trips where trip_id in (
#        select trip_id from stop_times t where arrival_time - time('now', 'localtime') > 0 AND stop_id in (
#            select stop_id from stops where stop_code = $1)));

#select distinct r.* from routes r where route_id in (
#    select route_id from trips where trip_id in (
#        select trip_id from stop_times t where arrival_time - time('now', 'localtime') > 0 
#        AND strftime('%m', arrival_time ) - strftime('%m', time('now', 'localtime')) < 1
#        AND stop_id in (
#            select stop_id from stops where stop_code = $1)));

sqlite3 ../assets/gtfs.db <<EOF

select distinct r.* from routes r where route_id in (
    select route_id from trips where trip_id in (
        select trip_id from stop_times t where (arrival_time - time('now', 'localtime')) >= 0 
        AND stop_id in (
            select stop_id from stops where stop_code = $1)));



EOF
> out
