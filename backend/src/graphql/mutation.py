import graphene

from src import db


class CreateVocabulary(graphene.Mutation):
    class Arguments:
        owner = graphene.String()
        title = graphene.String()

    owner = graphene.String()
    title = graphene.String()

    def mutate(self, _info, owner, title):
        db.Vocabulary(owner=owner, title=title).save()
        return CreateVocabulary(owner=owner, words={})


class Mutations(graphene.ObjectType):
    create_vocabulary = CreateVocabulary.Field()
