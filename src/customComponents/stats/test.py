import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK
cred = credentials.Certificate(r'C:\Users\smufl\OneDrive\Desktop\SUKOON\src\customComponents\stats\json.json') # Replace with your key file
firebase_admin.initialize_app(cred)

# Get Firestore database reference
db = firestore.client()

# Function to retrieve all documents in "devices" collection
def get_devices():
    devices_ref = db.collection("devices")
    docs = devices_ref.stream()

    devices = {}
    for doc in docs:
        devices[doc.id] = doc.to_dict()

    return devices

# Fetch and print all devices
devices_data = get_devices()
print(devices_data)