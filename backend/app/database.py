from pymongo import MongoClient
import os

client = MongoClient(os.getenv("MONGO_URI"))
db = client.medvision

users_collection = db.users
