class Destination {
    constructor(name) {
        this.name = name;
        this.time = [];
    }

}
//I had a lot of trouble getting an API to work for me. I ended up using the API from the video example.
class API {
    

    static getDestinations() {
        return $.get(this.url);
    }

    static getPlace(id) {
        return $.get(this.url + `/${id}`);
    }

    static createPlace(place) {
        return $.post(this.url, place);
    }

    static updatePlace(place) {//call back using AJAX and JQUERY
        return $.ajax({
          url: this.url + `/${place._id}`,
          dataType: 'json',
          data: JSON.stringify(place),
          contentType: 'application/json',
          type: 'PUT'

        });
        
    }

    static deleteDestination(id) {//This is my method to delete destinations, it has a bug, and i could not get it fixed. 
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });    
    }
}
//this method is where the promises are held, an connect JQUERY. 
class DOMManager {
  static places;

  static getDestinations() {
    API.getDestinations().then(places => this.render(places));
  }

  static createPlace(name) {
    API.createPlace(new Destination(name))
    .then(() => {
        return API.getDestinations();
    })
    .then((places) => this.render(places));
  }

  static deleteDestination(id) {
    API.deleteDestination(id)
    .then(() => {
      return API.getDestinations();
    })
    .then((places) => this.render(places)); 
  }
//this method brings back all the submited destinations for the review.
  static render(places) {
    this.places = places;
    $('#app').empty();
    for (let place of places) {
      $('#app').prepend(
        `<div id="${place._id}" class="card">
          <div class="card-header">
            <h2>${place.name}</h2>
            <button class="btn btn-danger" onclick="DOMMangager.deletePlace('${place._id}')">Delete</button>
          </div>
          <div class="card-body">
            <div class="card">
              <div class="row">
                <div class="col-sm">
                  <input type="text" id="${place._id}-room-name" class="form-control" placeHolder="Arrival Date">
                </div>
                <div class="col-sm">
                <input type="text" id="${place._id}-room-area" class="form-control" placeHolder="Departure Date">
                </div>


          </div>
         </div> <br>`        
      );
      
    }   
  }

}
//This allows me to input destinations, for the review
$('#create-new-place').click (() => {
  DOMManager.createPlace($('#new-destination-name').val());
  $('#new-destination-name').val('');
});

DOMManager.getDestinations();