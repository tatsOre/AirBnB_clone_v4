$(document).ready(() => {
  const amenName = [];
  const amenID = [];
  const statesID = [];
  const citiesID = [];
  const statesAndCitiesName = [];
  console.log(icons);

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
      data.forEach(place => { displayPlace(place); });
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
        data.forEach(place => { displayPlace(place); });
      }
    });
  });
});

/**
 * Retrieves information of a user by id
 * @param {string} userId - user ID to search in the API.
 */
async function getUser (userId) {
  let result;
  try {
    result = await $.ajax({
      url: `http://127.0.0.1:5001/api/v1/users/${userId}`
    });
    return result;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Display Place objects
 * @param {object} place - Response from web server.
 */
async function displayPlace (place) {
  const userData = await getUser(place.user_id);
  const userName = `${userData.first_name} ${userData.last_name}`;
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
            ${userName}
        </div>
        <div class="description">
          <p>${place.description}</p>
        </div>
        <div class="amenities">
          <div>
            <h2 class="amenities-title" data-placeID=${place.id}>Amenities</h2>
            <span class="show-amenities" data-placeID=${place.id}>Show</span>
          </div>
          <ul class="amenities-list" data-placeID=${place.id}></ul>
        </div>
        <div class="reviews">
          <div>
            <h2 class="reviews-title" data-placeID=${place.id}>Reviews</h2>
            <span class="show-reviews" data-placeID=${place.id}>Show</span>
          </div>
          <ul class="reviews-list" data-placeID=${place.id}> </ul>
        </div>
      </article>`);
}

$(document).on('click', 'span.show-amenities', function () {
  const placeID = $(this).attr('data-placeID');
  if ($(this).text() === 'Show') {
    $(this).text('Hide');
    $(`span.show-amenities[data-placeID=${placeID}]`).addClass('rotate__icon');
    const URL = `http://127.0.0.1:5001/api/v1/places/${placeID}/amenities`;
    $.get(URL, function (data) {
      $(`.amenities-title[data-placeID=${placeID}]`).text(data.length + ' Amenities');
      data.forEach(amenity => { displayAmenity(placeID, amenity); });
    });
  } else {
    $(this).text('Show');
    $(`span.show-amenities[data-placeID=${placeID}]`).removeClass('rotate__icon');
    $(`.amenities-title[data-placeID=${placeID}]`).text('Amenities');
    $(`.amenities-list[data-placeID=${placeID}] .amen_item`).remove();
  }
});

/**
 * Display formatted amenity objects of a Place.
 * @param {string} placeID - Place ID.
 * @param {object} amenity - Response from web server.
 */
function displayAmenity (placeID, amenity) {
  $(`.amenities-list[data-placeID=${placeID}]`).append(`
  <li class="amen_item" data-amenID=${amenity.id} data-amename=${amenity.name}>
    <i class="amen-icon fas fa-${icons[amenity.name]}"></i> ${amenity.name}
  </li>`);
}

$(document).on('click', 'span.show-reviews', function () {
  const placeID = $(this).attr('data-placeID');
  if ($(this).text() === 'Show') {
    $(`span.show-reviews[data-placeID=${placeID}]`).addClass('rotate__icon');
    $(this).text('Hide');
    const URL = `http://127.0.0.1:5001/api/v1/places/${placeID}/reviews`;
    $.get(URL, function (data) {
      $(`.reviews-title[data-placeID=${placeID}]`).text(data.length + ' Reviews');
      data.forEach(review => { displayReview(placeID, review); });
    });
  } else {
    $(this).text('Show');
    $(`span.show-reviews[data-placeID=${placeID}]`).removeClass('rotate__icon');
    $(`.reviews-title[data-placeID=${placeID}]`).text('Reviews');
    $(`.reviews-list[data-placeID=${placeID}] .rev_item`).remove();
  }
});

/**
 * Display formatted review objects of a Place.
 * @param {string} placeID - Place ID.
 * @param {object} review - Response from web server.
 */
async function displayReview (placeID, review) {
  const userData = await getUser(review.user_id);
  const userName = `${userData.first_name} ${userData.last_name}`;

  $(`.reviews-list[data-placeID=${placeID}]`).append(`
  <li class="rev_item" data-revID=${review.id}>
    <h3 class="reviewer-date">
        From ${userName} the ${getDate(review.created_at)}
    </h3>
    <p class="reviewer-message">${review.text}</p>
  </li>`);
}

const getDate = (dateJSON) => {
  const datetime = new Date(dateJSON);
  const day = getNumberWithOrdinal(datetime.getDate());
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(datetime);
  const year = datetime.getFullYear();
  return `${day} ${month} ${year}`;
};

const getNumberWithOrdinal = (day) => {
  const ord = ['th', 'st', 'nd', 'rd'];
  const v = day % 100;
  return day + (ord[(v - 20) % 10] || ord[v] || ord[0]);
};

/* Check API Status */
$.getJSON('http://127.0.0.1:5001/api/v1/status', function (data) {
  if (data.status === 'OK') {
    $('div#api_status').addClass('available');
  } else {
    $('div#api_status').removeClass('available');
  }
});
