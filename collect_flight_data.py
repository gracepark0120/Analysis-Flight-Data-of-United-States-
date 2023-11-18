# Connection code adapted from https://github.com/SolaceSamples/solace-samples-python/blob/master/patterns/guaranteed_subscriber.py

# Consumer that binds to exclusive durable queue
# Assumes existence of queue on broker holding messages.
# Note: create queue with topic subscription 
# See https://docs.solace.com/Solace-PubSub-Messaging-APIs/API-Developer-Guide/Adding-Topic-Subscriptio.htm for more details

import os
import time
import json

from solace.messaging.messaging_service import MessagingService, ReconnectionListener, ReconnectionAttemptListener, ServiceInterruptionListener, ServiceEvent
from solace.messaging.resources.queue import Queue
from solace.messaging.config.retry_strategy import RetryStrategy
from solace.messaging.receiver.persistent_message_receiver import PersistentMessageReceiver
from solace.messaging.receiver.message_receiver import MessageHandler, InboundMessage
from solace.messaging.errors.pubsubplus_client_error import PubSubPlusClientError
from solace.messaging.config.transport_security_strategy import TLS
from dotenv import load_dotenv
import xmltodict

load_dotenv()
os.environ["PYTHONUNBUFFERED"] = "1" # Disable stdout buffer for Docker/Windows

DATASET_FOLDER = "flights"
existing_dataset_files = sorted(os.listdir(DATASET_FOLDER))
file_idx = int(os.path.splitext(existing_dataset_files[-1])[0].split("_")[1]) if existing_dataset_files else 0
line_count = sum(1 for line in open(os.path.join(DATASET_FOLDER, existing_dataset_files[-1]))) if existing_dataset_files else 0
if file_idx:
    print(f'Continuing from file: "flights_{file_idx}.jsonl" line {line_count}')

def process_message(topic: str, message: str) -> None:
    global file_idx, line_count
    print(f"Written {line_count} / 10000 lines to file \"flights_{file_idx}.jsonl\"", end='\r')
    if topic != 'TFMSR13/4':
        return
    message_dict = xmltodict.parse(message)
    flight_list = message_dict['ds:tfmDataService']['fltdOutput']['fdm:fltdMessage']
    if not isinstance(flight_list, list): # possible flight_list only contains one flight message
        flight_list = [flight_list]
    for flight in flight_list:
        with open(f'flights/flights_{str(file_idx).zfill(3)}.jsonl', 'a') as f:
            f.write(json.dumps(flight) + '\n')
        line_count += 1
        if line_count >= 10000: # 30-100 mb / file
            print()
            print(f"Finished writing 10000 lines to \"flights_{file_idx}\"")
            file_idx += 1
            line_count = 0


# Handle received messages
class MessageHandlerImpl(MessageHandler):
    def on_message(self, message: InboundMessage):
        # Check if the payload is a String or Byte, decode if its the later
        payload = message.get_payload_as_string() if message.get_payload_as_string() != None else message.get_payload_as_bytes()
        if isinstance(payload, bytearray):
            print(f"Received a message of type: {type(payload)}. Decoding to string")
            payload = payload.decode()
        topic = message.get_destination_name()
        process_message(topic, payload)
        

# Inner classes for error handling
class ServiceEventHandler(ReconnectionListener, ReconnectionAttemptListener, ServiceInterruptionListener):
    def on_reconnected(self, e: ServiceEvent):
        print("\non_reconnected")
        print(f"Error cause: {e.get_cause()}")
        print(f"Message: {e.get_message()}")
    
    def on_reconnecting(self, e: "ServiceEvent"):
        print("\non_reconnecting")
        print(f"Error cause: {e.get_cause()}")
        print(f"Message: {e.get_message()}")

    def on_service_interrupted(self, e: "ServiceEvent"):
        print("\non_service_interrupted")
        print(f"Error cause: {e.get_cause()}")
        print(f"Message: {e.get_message()}")


def main():
    subscriptions = ["TFMS"]
    messaging_services = []
    durable_queues = []
    receivers = []
    for subscription in subscriptions:
        # Broker Config. Note: Could pass other properties Look into
        broker_props = {
            "solace.messaging.transport.host": os.environ.get(f'{subscription}_HOST') or "",
            "solace.messaging.service.vpn-name": os.environ.get(f'{subscription}_VPN') or "",
            "solace.messaging.authentication.scheme.basic.username": os.environ.get('SOLACE_USERNAME') or "",
            "solace.messaging.authentication.scheme.basic.password": os.environ.get('SOLACE_PASSWORD') or ""
        }

        # Build A messaging service with a reconnection strategy of 20 retries over an interval of 3 seconds
        # Note: The reconnections strategy could also be configured using the broker properties object
        transport_security = TLS.create().without_certificate_validation()
        messaging_services.append(MessagingService.builder().from_properties(broker_props)\
            .with_transport_security_strategy(transport_security)\
            .with_reconnection_retry_strategy(RetryStrategy.parametrized_retry(20,3000))\
            .build())

        # Queue name. 
        # NOTE: This assumes that a persistent queue already exists on the broker with the right topic subscription 
        queue_name = os.environ.get(f'{subscription}_QUEUE') or ""
        durable_exclusive_queue = Queue.durable_exclusive_queue(queue_name)
        durable_queues.append(durable_exclusive_queue)


    # Event Handling for the messaging service
    service_handler = ServiceEventHandler()
    for messaging_service in messaging_services:
        # Blocking connect thread
        messaging_service.connect()
        print(f'Messaging Service connected: {messaging_service.is_connected}')
        messaging_service.add_reconnection_listener(service_handler)
        messaging_service.add_reconnection_attempt_listener(service_handler)
        messaging_service.add_service_interruption_listener(service_handler)
        

    try:
        for i, durable_queue in enumerate(durable_queues):
            # Build a receiver and bind it to the durable exclusive queue
            persistent_receiver: PersistentMessageReceiver = messaging_services[i].create_persistent_message_receiver_builder()\
                .with_message_auto_acknowledgement()\
                .build(durable_queue)
            receivers.append(persistent_receiver)
            persistent_receiver.start()
            # Callback for received messages
            persistent_receiver.receive_async(MessageHandlerImpl())
            print(f'PERSISTENT receiver started... Bound to Queue [{durable_queue.get_name()}]')

        try: 
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print('\nKeyboardInterrupt received')
    except PubSubPlusClientError as exception:
        print(f'\nMake sure queue exists on broker!')

    finally:
        for receiver in receivers:
            if receiver and receiver.is_running():
                print('\nTerminating receiver')
                receiver.terminate(grace_period = 0)
        for messaging_service in messaging_services:
            print('\nDisconnecting Messaging Service')
            messaging_service.disconnect()

if __name__ == '__main__':
    main()