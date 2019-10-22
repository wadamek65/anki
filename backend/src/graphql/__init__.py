import graphene

from src.graphql import mutation, query, types

SCHEMA = graphene.Schema(query=query.Query, mutation=mutation.Mutations, types=[types.Vocabulary])
