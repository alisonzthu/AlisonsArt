import React, { Component } from 'react';
import { Divider, Container, Grid, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as UserActions from '../actions/userActionCreator.jsx';
import ArtistAuctions from './ArtistProfile/ArtistAuctions.jsx';
import Artist from './Artist.jsx';

class SaveFollow extends Component {
  constructor(props) {
    super(props);
    this._handleClickArtist = this._handleClickArtist.bind(this);
  }

  componentWillMount() {
    let { userId } = this.props.match.params;
    fetch(`/saves/${userId}`, {
      headers: new Headers ({'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`})
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      this.props.dispatch(UserActions.fetchedSaves(data));
    })
    .catch(err => {
      alert('Sorry! Failed to fetch your saved auctions.');
    });

    fetch(`/follows/${userId}`, {
      headers: new Headers ({'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`})
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      this.props.dispatch(UserActions.fetchedFollows(data));
    })
    .catch(err => {
      alert('Sorry! Failed to fetch your following artists');
    });
  }

  _handleClickArtist(artistId) {
    this.props.history.push(`/artist/${artistId}`);
  }

  render() {
    let { savedAuctions, followingArtists, dispatch, history } = this.props;
    return (
      <Container>
        <h3>Your saved auctions:</h3>
        <Grid>
        {savedAuctions.length === 0 ? <div>You don't have any saves yet</div> : null}
          <Grid.Row columns={3}>
          {savedAuctions.map(auction => {
            return (
              <Grid.Column key={auction.id}>
                <ArtistAuctions auction={auction} dispatch={dispatch} history={history} />
              </Grid.Column>)
          })}
          </Grid.Row>
        </Grid>
        <Divider />
        <div>
          <h3>Your following artists:</h3>
          <Grid>
          {followingArtists.length === 0 ? <div>You are not following any artists yet</div> : null}
            <Grid.Row columns={3}>
            {followingArtists.map(artist => {
              return (
                <Grid.Column>
                <Container>
                  <div 
                    className='imageLink thumbnails'
                    style={{backgroundImage: `url(${artist.image_url})`}}
                    onClick={() => {
                      this._handleClickArtist(artist.followee_id)
                  }} />
                  <div className="artName">{artist.first_name} {artist.last_name}</div>
                </Container>
                </Grid.Column>);
            })}
            </Grid.Row>
          </Grid>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    savedAuctions: state.user.savedAuctions,
    followingArtists: state.user.followingArtists
  }
}

export default connect(mapStateToProps)(SaveFollow);
