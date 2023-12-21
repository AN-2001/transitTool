var map;
GetLocation = async function() {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
    });
}

centre = async function() {
    var Loc = await GetLocation();
    var E = [Loc.coords.latitude, Loc.coords.longitude];
    map.setView(E, 13);
    var popup = L.popup()
    .setLatLng(E)
    .setContent('<p>Hello world!<br />This is a nice popup.</p>')
    .openOn(map);
}


callback = async function() {


    L.Control.Recenter = L.Control.extend({
        Button: undefined,
        onAdd: function(map) {
            this.Button = L.DomUtil.create('button');
            this.Button.style.width = '200px';
            this.Button.style.height = '200px';
            this.Button.innerHTML = 'RECENTER';
            L.DomEvent.on(this.Button, 'click', centre);
            return this.Button;
        },

        onRemove: function(map) {
            L.DomEvent.off(this.Button);
        }

    });

    L.control.recenter = function(opts) {
        return new L.Control.Recenter(opts);
    }

    var Loc = await GetLocation();

    map = L.map('map', {
        center: [Loc.coords.latitude, Loc.coords.longitude],
        zoom: 13,
        preferCanvas: true,
    });
    L.control.recenter({position: 'bottomleft'}).addTo(map);

    let Num = document.getElementById('number').value;
    await fetch(`./getRoutesAtStop/${Num}`)
        .then((Res) => {
            return Res.json();
        })
        .then((V) => {
            console.log(V);
        })
        .catch((E) => {
            console.log(`ERROR ${E}`);
        });

    console.log('clicked!');
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}
