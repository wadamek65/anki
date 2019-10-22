import graphene.relay

from src.graphql import types


class Query(graphene.ObjectType):
    vocabulary = graphene.Field(types.Vocabulary)
