from datetime import datetime, timezone
from pyspark.sql import SparkSession
from pyspark.sql.types import StringType,IntegerType
from pyspark.sql.functions import UserDefinedFunction, to_timestamp
from pyspark.sql.functions import collect_list,split,regexp_replace,col,round,concat,lit,avg,when,length,abs
from pyspark.sql.functions import udf

def convert_seconds_to_string(seconds):
    seconds = seconds % (24 * 3600)
    hour = seconds // 3600
    seconds %= 3600
    minutes = seconds // 60
    seconds %= 60
    if hour != 0:
        return "%d hours %d minutes %d seconds" % (hour, minutes, seconds)
    elif minutes != 0:
        return "%d minutes %d seconds" % (minutes, seconds)
    else:
        return "%d seconds" % (seconds)

# determine if delayed or not
@udf(returnType = StringType())
def determine_delay(estimated_time, actual_time):
    if int(estimated_time[8:10]) == int(actual_time[8:10]):
        estimated_time_sec = int(estimated_time[11:13]) * 3600 + int(estimated_time[14:16]) * 60 + int(estimated_time[17:19])
        actual_time_sec = int(actual_time[11:13]) * 3600 + int(actual_time[14:16]) * 60 + int(actual_time[17:19])
        if estimated_time_sec >= actual_time_sec:
            delay = 'NO'
        else: 
            delay = 'YES'
    elif int(estimated_time[8:10]) > int(actual_time[8:10]): # early 
        delay = 'NO'
    else: 
        delay = 'YES'

    return delay

# calculate delayed time(sec)
@udf(returnType = StringType())
def calculate_delay(estimated_time, actual_time):
    estimated_time_sec = int(estimated_time[11:13]) * 3600 + int(estimated_time[14:16]) * 60 + int(estimated_time[17:19])
    actual_time_sec = int(actual_time[11:13]) * 3600 + int(actual_time[14:16]) * 60 + int(actual_time[17:19])
    if int(estimated_time[8:10]) == int(actual_time[8:10]):
        pass
    elif int(estimated_time[8:10]) > int(actual_time[8:10]): 
        estimated_time_sec += 24 * 3600
    else : 
        actual_time_sec += 24 * 3600
    delay_time = abs(estimated_time_sec - actual_time_sec)
    return convert_seconds_to_string(delay_time)

#formats time to more readable format
@udf(returnType = StringType())
def modify_time(time):
    year = str(int(time[0:4]) - 2000)
    month = time[5:7]
    day = time[8:10]
    hour = time[11:13]
    day_night = "AM"
    if (int(hour) > 12):
        hour = str(int(hour) - 12)
        day_night = "PM"
    return month + "/" + day + "/" + year + " " + hour + time[13:19] + " " + day_night


def process_flight_data():
    spark = SparkSession.builder.master("local[*]")\
        .appName('flight-data')\
        .config("spark.driver.extraClassPath", "/home/ubuntu/postgresql-42.5.0.jar")\
        .getOrCreate()
    # flight_data = spark.read.format("json").options(inferschema='true',header='true').load('../part1/flights/flights_000.jsonl')
    flight_data = spark.read.format("json").options(inferschema='true',header='true').load('cs179g_project/part1/flights/')
    flight_data = flight_data.select('@acid', '@airline', '@arrArpt', '@depArpt',\
                                    'fdm:trackInformation.nxcm:qualifiedAircraftId.nxce:igtd',\
                                    'fdm:trackInformation.nxcm:ncsmTrackData.nxcm:eta.@timeValue',\
                                    'fdm:trackInformation.nxcm:ncsmTrackData.nxcm:arrivalFixAndTime.@arrTime')
    # renames the table columns
    new_column_names = ["Flight Number", "Airline", "Arrival Airport", "Departure Airport", "Departure Time", "Scheduled Arrival Time", "Actual Arrival Time"]
    flight_data = flight_data.toDF(*new_column_names)
    # removing invalid departure and arrival times, null values
    flight_data = flight_data.na.drop()
    # removes placeholder letter in front of airport code, if it exists
    flight_data = flight_data.withColumn('Arrival Airport', when(length(col('Arrival Airport')) == 4, col('Arrival Airport').substr(2,3))\
                            .otherwise(col('Arrival Airport')))\
                            .withColumn('Departure Airport', when(length(col('Departure Airport')) == 4, col('Departure Airport').substr(2,3))\
                            .otherwise(col('Departure Airport')))\
                            .withColumn('Delayed', to_timestamp(flight_data["Scheduled Arrival Time"]).cast('long') < to_timestamp(flight_data["Actual Arrival Time"]).cast('long'))\
                            .withColumn('Delay Time', abs(to_timestamp(flight_data["Scheduled Arrival Time"]).cast('long') - to_timestamp(flight_data["Actual Arrival Time"]).cast('long')))\
                            .withColumn('Departure Time', modify_time(col('Departure Time')))\
                            .withColumn('Scheduled Arrival Time', modify_time(col('Scheduled Arrival Time')))\
                            .withColumn('Actual Arrival Time', modify_time(col('Actual Arrival Time')))
        
    # combine with ticket price data
    fares = spark.read.parquet('cs179g_project/part2/ticket_fares/output.parquet/')
    flight_data = flight_data.join(fares, (flight_data.Airline == fares.Airline) 
                                & (flight_data['Arrival Airport'] == fares.Origin)
                                & (flight_data['Departure Airport'] == fares.Dest))\
                        .drop(fares.Airline).drop('ItinID', 'Origin', 'Dest')\
                        .dropDuplicates()

    # write to database
    flight_data.write\
            .format('jdbc')\
            .option('url', 'jdbc:postgresql://localhost:5432/cs179g')\
            .option('dbtable', "modified_flight_data")\
            .option("user", "group9") \
            .option("password", "group9") \
            .option("driver", "org.postgresql.Driver") \
            .mode('append')\
            .save()

from time import perf_counter, sleep
def main():
    # spark = SparkSession.builder.master("local[2]")\
    #     .appName('flight-data')\
    #     .config("spark.driver.extraClassPath", "/home/ubuntu/postgresql-42.5.0.jar")\
    #     .getOrCreate()
    # sc = spark._jsc.sc()
    # result1 = sc.getExecutorMemoryStatus().keys()
    # result2 = [executor.host() for executor in sc.statusTracker().getExecutorInfos()]
    # print(result1, result2)
 #   from pyspark import SparkContext
 #   for j in range(1,10):
  #      sc = SparkContext(master = "local[%d]"%(j))
  #    result1 = sc2.getExecutorMemoryStatus().keys()
    #   result2 = [executor.host() for executor in sc2.statusTracker().getExecutorInfos()]
    #   result3 = len(sc._jsc.sc().statusTracker().getExecutorInfos()) - 1
    #    result4 = int(sc.getConf().get('spark.executor.cores','1'))
    #    print(result1, result2, result3, result4)
    #    print(sc2.getConf().get('spark.executor.instances'))
    #    t0 = perf_counter()
    #    for i in range(10):
    #        sc.parallelize([1,2]*1000000).reduce(lambda x,y : x+y)
    #        #print("sum :",str(sum))
    #    print("%2d executers, time =%4.3f"%(j,perf_counter()-t0))
    #    input()
    #    sc.stop()
    
    sleep(5)

start_time = perf_counter()

main() # Function to measure

passed_time = perf_counter() - start_time

print(f"It took {passed_time} seconds")