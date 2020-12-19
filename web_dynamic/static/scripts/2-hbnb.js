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
