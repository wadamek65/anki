import graphene.relay
import graphene_mongo

from src import db


class Word(graphene_mongo.MongoengineObjectType):
    class Meta:
        model = db.Word


class Vocabulary(graphene_mongo.MongoengineObjectType):
    class Meta:
        model = db.Vocabulary
