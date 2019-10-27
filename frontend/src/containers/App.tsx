import graphql from 'babel-plugin-relay/macro';
import * as React from 'react';
import { QueryRenderer } from 'react-relay';
import { environment } from '../lib/relay';
import { Decks } from './Decks';

export const App = () => {
  return (
    <QueryRenderer
      environment={environment}
      query={graphql`
        query AppQuery($userID: ID!) {
          getUser(id: $userID) {
            id
            name
          }
        }
      `}
      variables={{userID: '5db481774c40a707a806539b'}}
      render={({error, props}: {error: any, props: any}) => {
        if (error) {
          console.error(error);
          return <div>Error!</div>
        }
        if (!props) {
          return <div>Loading...</div>
        }
        console.log(props);
        return <div>
          {props.getUser ? props.getUser.name : ''}
          <Decks/>
        </div>
      }}
    />
  )
};
