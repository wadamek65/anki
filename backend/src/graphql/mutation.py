import graphene

from src import db
from src.graphql import types


class CreateVocabulary(graphene.Mutation):
    class Arguments:
        owner = graphene.String()

    owner = graphene.String()
    words = graphene.List(types.Word)

    def mutate(self, info, owner):
        print(info, owner)

        db.Vocabulary(owner=owner).save()

        return CreateVocabulary(owner=owner, words={})


class Mutations(graphene.ObjectType):
    create_vocabulary = CreateVocabulary.Field()
