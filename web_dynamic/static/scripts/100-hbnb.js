$(document).ready(() => {
  const amenName = [];
  const amenID = [];
  const statesID = [];
  const citiesID = [];
  const statesAndCitiesName = [];

  /* Saves/deletes checked/unchecked amenities */
  $('.amenities input[type=checkbox]').click(function () {
    if ($(this).prop('checked') === true) {
      amenName.push($(this).attr('data-name'));
      amenID.push($(this).attr('data-id'));
    } else {
      const index = amenName.indexOf($(this).attr('data-name'));
      amenName.splice(index, 1);
      amenID.splice(index, 1);
    }
    $('div.amenities h4').text(amenName.join(', '));
  });

  /* Saves/deletes checked/unchecked cities */
  $('.locations .city_name input[type=checkbox]').click(function () {
    if ($(this).prop('checked') === true) {
      statesAndCitiesName.push($(this).attr('data-name'));
      citiesID.push($(this).attr('data-id'));
    } else {
      const index = statesAndCitiesName.indexOf($(this).attr('data-name'));
      statesAndCitiesName.splice(index, 1);
      citiesID.splice(index, 1);
    }
    $('div.locations h4').text(statesAndCitiesName.join(', '));
  });

  /* Saves/deletes checked/unchecked states */
  $('.locations .state_name input[type=checkbox]').click(function () {
    if ($(this).prop('checked') === true) {
      statesAndCitiesName.push($(this).attr('data-name'));
      statesID.push($(this).attr('data-id'));
    } else {
      const index = statesAndCitiesName.indexOf($(this).attr('data-name'));
      statesAndCitiesName.splice(index, 1);
      statesID.splice(index, 1);
    }
    $('div.locations h4').text(statesAndCitiesName.join(', '));
  });

  /* HBNB Index - All places */
  $.ajax({
    url: 'http://127.0.0.1:5001/api/v1/places_search/',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: data => {
      displayPlaces(data);
    }
  });

  /* Filter results by amenities */
  $('button.btn-search').click(function () {
    const searchFilter = { amenities: amenID, cities: citiesID, states: statesID };
    $('article').remove();
    $('h2.results').hide();
    $.ajax({
      url: 'http://127.0.0.1:5001/api/v1/places_search/',
      method: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(searchFilter),
      success: data => {
        if (data.length === 0) $('.results').show();
        displayPlaces(data);
      }
    });
  });

  /**
   * Loop through data and display Place objects
   * @param  {object} data - response from web server
   */
  const displayPlaces = (data) => data.map(place => {
    const user = async function () {
      const result = await $.ajax({
        url: `http://127.0.0.1:5001/api/v1/users/${place.user_id}`
      });
      return result; // --> resultUser
    };
    user().then((resultUser) => {
      $('section.places').append(`
    <article class="place-card">
      <div class="place-card__place-name">
        <h2>${place.name}</h2>
      </div>
      <div class="price_by_night">$${place.price_by_night}</div>
      <div class="information">
        <div class="max_guest">
          ${place.max_guest} Guest${(place.max_guest > 1) ? 's' : ''}
        </div>
        <div class="number_rooms">
          ${place.number_rooms} Bedroom${(place.number_rooms > 1) ? 's' : ''}
        </div>
        <div class="number_bathrooms">
          ${place.number_bathrooms} Bathroom${(place.number_bathrooms > 1) ? 's' : ''}
        </div>
      </div>
      <div class="user">
        <span>Owner:</span>
        ${resultUser.first_name} ${resultUser.last_name}
      </div>
      <div class="description">
        <p>${place.description}</p>
      </div>
    </article>`);
    }
    );
  });
});

/* Check API Status */
$.getJSON('http://127.0.0.1:5001/api/v1/status', function (data) {
  if (data.status === 'OK') {
    $('div#api_status').addClass('available');
  } else {
    $('div#api_status').removeClass('available');
  }
});
