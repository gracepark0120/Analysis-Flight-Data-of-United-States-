from json import load
from itertools import chain
from pyspark.sql import SparkSession
from pyspark.sql import functions as F


spark = SparkSession.builder.master("local[1]").appName("Spark").getOrCreate()


IATA_to_ICAO = load(open('IATA_to_ICAO.json'))
IATA_to_ICAO_map = F.create_map([F.lit(x) for x in chain(*IATA_to_ICAO.items())])

coupon_data_path = "./Origin_and_Destination_Survey_DB1BCoupon_2022_2.csv"
# coupon_data_path = "./Coupon_Small.csv"
coupon_data = spark.read.csv(coupon_data_path, header=True, inferSchema=True)\
	.withColumn('Airline', IATA_to_ICAO_map[F.col("TkCarrier")])\
	.select('ItinID', 'Airline', 'Origin', 'Dest', 'Passengers', 'Distance')\

# market_data_path = "./Origin_and_Destination_Survey_DB1BMarket_2022_2.csv"
# market_data_path = "./Market_Small.csv"
# market_data = spark.read.csv(market_data_path, header=True, inferSchema=True)

# ticket_data_path = "./Origin_and_Destination_Survey_DB1BTicket_2022_2.csv"
ticket_data_path = "./Ticket_Small.csv"
ticket_data = spark.read.csv(ticket_data_path, header=True, inferSchema=True)\
	.select('ItinID', 'ItinFare')\
	.filter('ItinFare > 50.0') # trips purchased with frequent-flyer miles or made by airline employees at significantly reduced fares


data = coupon_data.join(ticket_data, coupon_data.ItinID == ticket_data.ItinID).drop(ticket_data.ItinID)
data.show(20)
data.write.csv("./output.csv", mode='overwrite')
data.write.parquet("./output.parquet", mode='overwrite')
