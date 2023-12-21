const sqlite3 = require('sqlite3').verbose();

let GTFS;

async function GTFSOpen() {
    GTFS = new sqlite3.Database('./assets/gtfs.db', sqlite3.OPEN_READONLY,
        (Err) => {
            if (Err)
                console.log(`TransitTool: Encountered error ${Err.message}.`);
            else
                console.log('TransitTool: Opened GTFS connection.');
    });
}

async function GTFSClose() {
    return new Promise((Resolve, Reject) => {
        GTFS.close((Err) => {
            if (Err)
                Reject();
            else {
                console.log(`TransitTool: Closed GTFS connection.`);
                Resolve();
            }
        });
    });
}

async function GTFSGetStopInfo(stop) {
    let Query = `select stop_name as name, 
                 stop_lat as lat, stop_lon as lon from stops where stop_code=? limit 1`
    let Params = [stop];
    return new Promise((Resolve, Reject) => {
        GTFS.all(Query, Params, (Err, Row) => {
            if (Err)
                Reject();
            else {
                Resolve(Row);
            }
        });
    });
}

async function GTFSGetShapeByRoute(route_id) {
    let Query = `select distinct shape_pt_lat as lat, shape_pt_lon as lon from
                 shapes where shape_id in (select shape_id from trips where route_id = ?)
                 limit 2048`
    let Params = [route_id];
    return new Promise((Resolve, Reject) => {
        GTFS.all(Query, Params, (Err, Row) => {
            if (Err)
                Reject();
            else {
                Resolve(Row);
            }
        });
    });
}

async function GTFSGetRoutesAtStop(stop_code) {
    let Query = `select distinct route_id as id, agency_id as agency,
                    route_short_name as line_no, route_long_name as name
                    from routes where route_id in (
                    select route_id from trips where trip_id in (
                        select trip_id from stop_times where (arrival_time - time('now', 'localtime')) >= 0 
                        AND stop_id in (select stop_id from stops where stop_code = ?)))
                    group by line_no limit 1024`;

    let Params = [stop_code];
    return new Promise((Resolve, Reject) => {
        GTFS.all(Query, Params, (Err, Row) => {
            if (Err)
                Reject();
            else {
                Resolve(Row);
            }
        });
    });
}

module.exports = {
    Open: GTFSOpen,
    Close: GTFSClose,
    GetRoutesAtStop: GTFSGetRoutesAtStop,
    GetStopInfo: GTFSGetStopInfo,
    GetShapeByRoute: GTFSGetShapeByRoute
};
