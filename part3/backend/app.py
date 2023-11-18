from flask import Flask, request, Response, jsonify, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import queue
import time
import json
import random
from dataclasses import dataclass

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://group9:group9@localhost:5432/cs179g"
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# reflect table => easy queries since we dont have to make a class to map the data but we lose column names
with app.app_context():
    flight_data = db.Table('modified_flight_data', db.metadata, autoload=True, autoload_with=db.engine)
COLUMN_NAMES = ["Flight Number", "Airline", "Arrival Airport", "Departure Airport", "Departure Time", "Scheduled Arrival Time", "Actual Arrival Time", "Delayed", "Delay Time", "Passengers", "Distance", "ItinFare"]
def row_to_dict(l):
    return {COLUMN_NAMES[i]:x for i, x in enumerate(l)}

#todo:
# query delay by airline
# query delay by dept/arr airport
# average ticket price by airline
# average ticket price by airport

# fill frontend dropdown boxes for airline/airport filters
@app.route('/get-filter-values', methods=['GET'])
def get_filter_values():
    airlines_rows = db.session.execute('SELECT DISTINCT "Airline" FROM flight_data').fetchall()
    airlines = sorted([x for row in airlines_rows for x in row])
    arr_aprt_rows = db.session.execute('SELECT DISTINCT "Arrival Airport" FROM flight_data').fetchall()
    arr_aprt = sorted([x for row in arr_aprt_rows for x in row])
    dept_aprt_rows = db.session.execute('SELECT DISTINCT "Departure Airport" FROM flight_data').fetchall()
    dept_aprt = sorted([x for row in dept_aprt_rows for x in row])
    delayed_rows = db.session.execute('SELECT DISTINCT "Delayed" FROM flight_data').fetchall()
    delayed = sorted([x for row in delayed_rows for x in row])

    return {"data": {"airlines":airlines, "arrival_airports": arr_aprt, "departure_airports": dept_aprt, "delayed": delayed}}

def generate_where_filter(request_args: dict, filters_arg=[]) -> str:
    filters = filters_arg.copy()
    airline_filter = request_args.get('airline_filter')
    if airline_filter:
        filters.append(f'"Airline"=\'{airline_filter}\'')
    arrival_filter = request_args.get('arrival_filter')
    if arrival_filter:
        filters.append(f'"Arrival Airport"=\'{arrival_filter}\'')
    departure_filter = request_args.get('departure_filter')
    if departure_filter:
        filters.append(f'"Departure Airport"=\'{departure_filter}\'')
    delayed_filter = request_args.get('delayed_filter')
    if delayed_filter:
        filters.append(f'"Delayed"=\'{delayed_filter}\'')

    where_filter = f'WHERE {" AND ".join(filters)}' if filters else ''
    return where_filter

@app.route('/get-stats', methods=['GET'])
def get_stats():
    args = request.args.copy()
    where_filter = generate_where_filter(args)
    total_count = db.session.execute(f'SELECT COUNT(*) FROM flight_data').first()[0]
    filter_count = db.session.execute(f'SELECT COUNT(*) FROM flight_data {where_filter}').first()[0]
    where_filter_1 = generate_where_filter(args, filters_arg=['"Delayed"=true'])
    delay_pct = db.session.execute(f'SELECT COUNT(*) FROM flight_data {where_filter_1}').first()[0]
    # delay_pct = round((delay_pct/filter_count)*100, 4)
    average_delay = db.session.execute(f'SELECT AVG("Delay Time") FROM flight_data {where_filter}').first()[0] or 0
    average_delay = round(float(average_delay/60), 2)
    average_ticket = db.session.execute(f'SELECT AVG("ItinFare") FROM flight_data {where_filter}').first()[0] or 0
    average_ticket = round(float(average_ticket), 2)
    
    return {"data": {
        "total_count": total_count,
        "filter_count": filter_count,
        "delay_pct": delay_pct,
        "average_delay": average_delay,
        "average_ticket": average_ticket
    }}

@app.route('/get-rows', methods=['GET'])
def get_rows():
    where_filter = generate_where_filter(request.args.copy())

    if where_filter:
        rows = db.session.execute(f'SELECT * FROM flight_data {where_filter} LIMIT 100').fetchall()
        data = [row_to_dict([x for x in row]) for row in rows]
    else: # random data
        rows = db.session.execute('SELECT * FROM flight_data OFFSET floor(random() * 6028189) LIMIT 100').fetchall()
        data = [row_to_dict([x for x in row]) for row in rows]
        random.shuffle(data)
    return {"data": data}

# run using `python app.py` in part3 folder
if __name__ == '__main__':
    app.debug = True
    app.run(host="0.0.0.0", threaded=True)
