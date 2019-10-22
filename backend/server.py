import fastapi
import mongoengine
import starlette.graphql

from src import graphql

mongoengine.connect(db='ll')

app = fastapi.FastAPI()
app.add_route('/', starlette.graphql.GraphQLApp(schema=graphql.SCHEMA))
