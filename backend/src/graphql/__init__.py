import graphene

from src.graphql import mutation, query

SCHEMA = graphene.Schema(query=query.Query, mutation=mutation.Mutations, types=[query.Vocabulary, query.Word])
