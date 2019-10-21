import fastapi
import graphene
import starlette.graphql

app = fastapi.FastAPI()
app.add_route('/', starlette.graphql.GraphQLApp(schema=graphene.Schema()))
