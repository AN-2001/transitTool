const Express = require('express');
const App = Express();
const GTFS = require('./gtfs/gtfs');

GTFS.Open();

async function OnExit() {
    await GTFS.Close();
    process.exit(0);
}

process.on('SIGINT', OnExit.bind(null));
process.on('uncaughtException', OnExit.bind(null));
App.use(Express.static('public'));

App.get('/getRoutesAtStop/:Stop', (Req, Res) => {
    GTFS.GetRoutesAtStop(Req.params.Stop).then(Value => {
        Res.json({
            Status: 'Success',
            Data: Value
        });
    });
});

App.get('/GetStopInfo/:Stop', (Req, Res) => {
    GTFS.GetStopInfo(Req.params.Stop).then(Value => {
        Res.json({
            Status: 'Success',
            Data: Value
        });
    });
});

App.get('/getRouteShape/:Route', (Req, Res) => {
    GTFS.GetShapeByRoute(Req.params.Route).then(Value => {
        Res.json({
            Status: 'Success',
            Data: Value
        });
    });
});

 
App.listen(8000, '192.168.1.104', () => {
     console.log(`TransitTool: listening on ${8000}`);
});
