#!/bin/bash

sqlite3 ../assets/gtfs.db <<EOF
select distinct shape_pt_lat as lat, shape_pt_lon as lon from
    shapes where shape_id in (select shape_id from trips where route_id = $1)
EOF
> out
