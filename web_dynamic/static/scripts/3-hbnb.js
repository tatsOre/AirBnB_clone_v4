const amenID = [];
$(document).ready(() => {
  const amenName = [];
  $('input[type=checkbox]').click(function () {
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
});

$.getJSON('http://127.0.0.1:5001/api/v1/status', function (data) {
  if (data.status === 'OK') {
    $('div#api_status').addClass('available');
  } else {
    $('div#api_status').removeClass('available');
  }
});

$.ajax({
  url: 'http://127.0.0.1:5001/api/v1/places_search/',
  method: 'POST',
  contentType: 'application/json',
  data: JSON.stringify({}),
  success: data => {
    data.map(place => {
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
            <span>Owner:</span> Firulais Bayona
          </div>
          <div class="description">
            <p>${place.description}</p>
          </div>
        </article>`);
    });
  }
});
