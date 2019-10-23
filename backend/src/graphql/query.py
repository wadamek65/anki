import graphene
import graphene_mongo

from src import db


class Word(graphene_mongo.MongoengineObjectType):
    class Meta:
        model = db.Word


class Vocabulary(graphene_mongo.MongoengineObjectType):
    class Meta:
        model = db.Vocabulary


class Query(graphene.ObjectType):
    vocabulary = graphene.List(Vocabulary, owner=graphene.String(required=True))

    @staticmethod
    def resolve_vocabulary(_root, _info, owner):
        return db.Vocabulary.objects(owner=owner)
