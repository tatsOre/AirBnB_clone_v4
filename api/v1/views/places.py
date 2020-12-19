#!/usr/bin/python3
""" objects that handle all default RestFul API actions for Places """
from models.state import State
from models.city import City
from models.place import Place
from models.user import User
from models.amenity import Amenity
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from flasgger.utils import swag_from


@app_views.route('/cities/<city_id>/places', methods=['GET'],
                 strict_slashes=False)
@swag_from('documentation/place/get_places.yml', methods=['GET'])
def get_places(city_id):
    """
    Retrieves the list of all Place objects of a City
    """
    city = storage.get(City, city_id)

    if not city:
        abort(404)

    places = [place.to_dict() for place in city.places]

    return jsonify(places)


@app_views.route('/places/<place_id>', methods=['GET'], strict_slashes=False)
@swag_from('documentation/place/get_place.yml', methods=['GET'])
def get_place(place_id):
    """
    Retrieves a Place object
    """
    place = storage.get(Place, place_id)
    if not place:
        abort(404)

    return jsonify(place.to_dict())


@app_views.route('/places/<place_id>', methods=['DELETE'],
                 strict_slashes=False)
@swag_from('documentation/place/delete_place.yml', methods=['DELETE'])
def delete_place(place_id):
    """
    Deletes a Place Object
    """

    place = storage.get(Place, place_id)

    if not place:
        abort(404)

    storage.delete(place)
    storage.save()

    return make_response(jsonify({}), 200)


@app_views.route('/cities/<city_id>/places', methods=['POST'],
                 strict_slashes=False)
@swag_from('documentation/place/post_place.yml', methods=['POST'])
def post_place(city_id):
    """
    Creates a Place
    """
    city = storage.get(City, city_id)

    if not city:
        abort(404)

    if not request.get_json():
        abort(400, description="Not a JSON")

    if 'user_id' not in request.get_json():
        abort(400, description="Missing user_id")

    data = request.get_json()
    user = storage.get(User, data['user_id'])

    if not user:
        abort(404)

    if 'name' not in request.get_json():
        abort(400, description="Missing name")

    data["city_id"] = city_id
    instance = Place(**data)
    instance.save()
    return make_response(jsonify(instance.to_dict()), 201)


@app_views.route('/places/<place_id>', methods=['PUT'], strict_slashes=False)
@swag_from('documentation/place/put_place.yml', methods=['PUT'])
def put_place(place_id):
    """
    Updates a Place
    """
    place = storage.get(Place, place_id)

    if not place:
        abort(404)

    data = request.get_json()
    if not data:
        abort(400, description="Not a JSON")

    ignore = ['id', 'user_id', 'city_id', 'created_at', 'updated_at']

    for key, value in data.items():
        if key not in ignore:
            setattr(place, key, value)
    storage.save()
    return make_response(jsonify(place.to_dict()), 200)


@app_views.route('/places_search', methods=['POST'], strict_slashes=False)
@swag_from('documentation/place/post_search.yml', methods=['POST'])
def places_search():
    """
    Retrieves all Place objects depending of the JSON in the body
    of the request
    """
    search_parms = request.get_json()
    hbnb_places = storage.all(Place).values()  # All hbnb Place objects
    if search_parms is None:
        abort(400, {'Not a JSON'})
    if len(search_parms) == 0:
        return jsonify([place.to_dict() for place in hbnb_places])

    states = search_parms.get('states')
    cities = search_parms.get('cities')
    amenities = search_parms.get('amenities')
    if not states and not cities and not amenities:
        return jsonify([place.to_dict() for place in hbnb_places])

    state_cities = []  #  Stores cities for each state ID
    all_state_places = []  #  Stores all places in a state ID
    if states:
        for id in states:
            state = storage.get(State, id)
            if state:
                state_cities.extend([city for city in state.cities])
        for city in state_cities:
            for place in city.places:
                all_state_places.append(place)

    all_city_places = []  #  Stores all places in all cities
    if cities:
        for id in cities:
            city = storage.get(City, id)
            if city:
                all_city_places.extend([place for place in city.places])

    searched_places = []
    if amenities:
        if cities or states:
            places_to_search = all_state_places + all_city_places
        elif not cities and not states:
            places_to_search = hbnb_places
        for place in places_to_search:
            amen_list = [item.id for item in place.amenities]
            if all(i in amen_list for i in amenities):
                searched_places.append(place)
        return jsonify([place.to_dict() for place in searched_places])
    else:
        all_places = all_state_places + all_city_places
        return jsonify([place.to_dict() for place in all_places])
