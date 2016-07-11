var MarkerModel = Backbone.Model.extend({
    defaults: {
        //latitude: getRandom(46.41400, 46.58000),
        //longitude: getRandom(30.69000, 30.75000),
        //status: false
    },
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        this.on("change:latitude", function(model) {
            var latitude = model.get("latitude");
            var longitude = model.get("longitude");
            alert(latitude + " " + longitude);
        });
    }
});

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

var MapModel = Backbone.Model.extend({
    defaults: {
        longitude: 30.73262,
        latitude: 46.47747,
        layerUrl: "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'ekvilan.0k8cm24l',
        accessToken: 'pk.eyJ1IjoiZWt2aWxhbiIsImEiOiJjaXFmNmU5YjUwMDhxaTBtY21pbXFkejl1In0.DoAUykH2cGay6X9hlYBPdQ'
    }
});

var MarkerCollection = Backbone.Collection.extend({
    model: MarkerModel
});

var MarkerView = Backbone.View.extend({
    initialize: function(options) {
        this.map = options.map;
        this.marker = L.marker([this.model.get('latitude'), this.model.get('longitude')]);
    },
    render: function() {
        this.marker.addTo(this.map);
    }
});

var MapView = Backbone.View.extend({
    initialize: function() {
        this.render();
    },
    render: function () {
        var mapTemplate = _.template($("#map-template").html(), {});
        this.$el.html(mapTemplate);

        var mymap = L.map('map').setView([this.model.get("latitude"), this.model.get("longitude")], 14);

        L.tileLayer(this.model.get('layerUrl'), {
            attribution: this.model.get("attribution"),
            maxZoom: 18,
            id: this.model.get("id"),
            accessToken: this.model.get("accessToken")
        }).addTo(mymap);

        this.markerView = this.model.get('markers').map(function(marker) {
            return new MarkerView({model:marker, map: mymap}).render();
        });
    }
});


var latMin =  46.41400;
var latMax =  46.58000;
var longMin =  30.69000;
var longMax =  30.75000;

$(document).ready(function() {
    var markers = new MarkerCollection();

    var marker = null;
    for(var i = 0; i < 25; i++) {
        marker = new MarkerModel({
            latitude: getRandom(latMin, latMax),
            longitude: getRandom(longMin, longMax)
        });
        markers.add(marker);
    }

    var map = new MapModel({ markers: markers});
    var mapView = new MapView({el: $("#container"), model: map});

});



