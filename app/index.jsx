import { createRoot } from 'react-dom/client';
import 'react';
import { DataTable } from './station.jsx';

let Component = document.getElementById('app');
let App = createRoot(Component);

let Button = document.getElementById('Submit');
let Body = document.body;

Button.addEventListener('click', GetStation);
Body.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    Button.click();
  }
});

let GetLocation = async function() {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
    });
}

let StationClick = async function(Event, RouteID, StationLoc) 
{
    App.render(<div id='map'></div>);

    setTimeout(() => { 

        fetch(`/getRouteShape/${RouteID}`)
            .then((Res) =>  Res.json())
            .then((Res) => {
                var map = L.map('map').setView(StationLoc, 19);
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 25,
                    className: 'map-tiles',
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map);
                L.polyline(Res.Data).addTo(map);
            });

    }, 100);

}

async function GetStation() {
    let StationInput = document.getElementById('StationNumber').value;
    let Table = document.getElementById('StationTable');
    let StopName = document.getElementById('stop_name');
    let Info = await fetch(`/GetStopInfo/${StationInput}`)
                            .then((Res) => Res.json());

    let RouteClickCallback = (Event, RouteID) => {
        StationClick(Event, RouteID, Info.Data[0]);  
    };

    if (Table != undefined) {
        Table.style.animation = 'none';
        setTimeout(() => {
            Table.style.animation = '';
        }, 10);
    }

    if (StopName != undefined) {
        StopName.style.animation = 'none';
        setTimeout(() => {
            StopName.style.animation = '';
            StopName.innerHTML = Info.Data[0].name;
        }, 50);
    }

    fetch(`/getRoutesAtStop/${StationInput}`)
        .then((Res) =>  Res.json())
        .then((Res) => {
            let Data = Res.Data.map((Elem) => {
                return {RouteID: Elem.id,
                        Data: [Elem.line_no, Elem.name]};
            });

            let DT = <DataTable
                            Props = { {Header: ['Number', 'Name'],
                                       Body:  Data,
                                       Callback: RouteClickCallback} }/>


            App.render(DT);
        });

}
