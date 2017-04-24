import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Image, Divider, Grid, Button, Segment } from 'semantic-ui-react';
//this imageGallery is causing a warning on React.createClass will be removed in v16
import * as ArtistAction from '../actions/artistActionCreator.jsx';
import ArtistAuctions from './ArtistProfile/ArtistAuctions.jsx';
import * as UserActions from '../actions/userActionCreator.jsx';
import * as ChatActions from '../actions/chatActionCreator.jsx';

class Artist extends Component {
  constructor(props){
    super(props);
    this.state= {
      active: false
    }
    this._socialMedia = this._socialMedia.bind(this);
    this.directMessageHandler = this.directMessageHandler.bind(this);
    this._handleFollow = this._handleFollow.bind(this);
  }

  directMessageHandler() {
    let receiverId = this.props.match.params.artistId;
    let roomname;
    if (this.props.userId > receiverId) {
      roomname = this.props.userId + receiverId;
    } else {
      roomname = receiverId + this.props.userId;
    }
    fetch(`/messages/${Number(this.props.userId)}/?receiver_id=${Number(receiverId)}`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
      })
    })
    .then((response) => {
      if (!response.ok) {
        throw Error('failed to retrieve messages...')
      }
      return response.json();
    })
    .then((data) => {
      let { dispatch } = this.props;
      dispatch(ChatActions.initRoom(receiverId, data, roomname));
    })
    .catch((error) => {
      console.log('retrieveMessages failed! error: ', error);
    })
  }

  componentWillMount() {
    //should have a detailed, user customized profile
    let { dispatch } = this.props;
    let artistId = this.props.match.params.artistId;
    dispatch(ArtistAction.fetchingArtist(true));
    fetch('/artist/' + this.props.match.params.artistId)
    .then(response => {
      if(!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then(data => {
      dispatch(ArtistAction.fetchingArtist(false));
      dispatch(ArtistAction.fetchArtistSuccess(data));
      dispatch(ArtistAction.fetchArtistErrored(false, null));
    })
    .catch(err => {
      dispatch(ArtistAction.fetchingArtist(false));
      dispatch(ArtistAction.fetchArtistErrored(true, err));
    });
  }

  _socialMedia(link) {
    if(link) {
      window.open(link);
    }
  }

  _handleFollow() {
    fetch('/follows', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
      }),
      body: JSON.stringify(this.props.match.params.artistId)
    })
    .then(response => {
      if (!response.ok) {
        throw Error('failed to follow!');
      }
      return response.json();
    })
    .then(data => {
      this.setState((prevState) =>{
        return {active: !prevState.active};
      });
    })
    .catch(err => {
      alert('Something went wrong, can\'t follow artist');
    });
  }
  
  render(){
    let { artistId } = this.props.match.params;
    let { userId } = this.props.user;
    let { dispatch, ongoingAuctions, passedAuctions } = this.props;
    let { isFetching, fetchArtistErrored, fetchedArtist } = this.props.artist;
    console.log(this.state.active);
    if (fetchArtistErrored) {
      return (
        <div>
          Something's wrong and we can't get the info for this artist. Sorry!
        </div>
      );
    } else if (isFetching) {
      return (
        <div>
          loading~~
        </div>
      );
    } else {
      if (Object.keys(fetchedArtist).length === 0) {
        return(
          <div>
            still loading~
          </div>
        );
      } else {
        if (!fetchedArtist.profile) {
          return (
            <div>
              Sorry, we don't have a profile page for this artist!
            </div>
          );
        }
        let { fb_link, twitter_link, inst_link, profile, username} = fetchedArtist.profile;
        let { history } = this.props;
        return (
          <Container>
            <Container>
              <Container>
                <span>{username}</span>
                {' '}
                <button onClick={this.directMessageHandler}>Direct message</button>
                {' '}
                {fb_link ? <Button circular color='facebook' icon='facebook' onClick={() => {
                  this._socialMedia(fb_link);
                }}/> : null}
                {' '}
                {twitter_link ? <Button circular color='twitter' icon='twitter' onClick={() => {
                  this._socialMedia(twitter_link);
                }}/> : null}
                {' '}
                {inst_link ? <Button circular color='instagram' icon='instagram' onClick={() => {
                  this._socialMedia(inst_link);
                }}/> : null}
                {userId !== artistId ? <Button icon="heart" content="follow this artist" toggle active={this.state.active} onClick={this._handleFollow} /> : null}
              </Container>
              <Grid verticalAlign='middle'>
                <Grid.Row>
                  <Grid.Column width={8} >
                    <Image src="./assets/temp.png" centered />
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Container fluid textAlign="justified">
                    {profile}
                    </Container>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Container>
            <Grid divided={true}>
            <h3>Ongoing auctions:</h3>
              <Grid.Row columns={3}>
              {ongoingAuctions.length === 0 ? <span>No ongoing auctions for this artist</span> : null}
              {ongoingAuctions.map(auction => (
                <Grid.Column key={auction.id}>
                  <ArtistAuctions auction={auction} history={history} dispatch={dispatch} />
                </Grid.Column>
                ))}
              </Grid.Row>
            </Grid>
            <Grid divided={true}>
            <h3>Passed auctions:</h3>
              <Grid.Row columns={3}>
              {passedAuctions.length === 0 ? <span>No passed auctions for this artist</span> : null}
              {passedAuctions.map(auction => (
                <Grid.Column key={auction.id}>
                  <ArtistAuctions auction={auction} history={history} dispatch={dispatch} />
                </Grid.Column>
                ))}
              </Grid.Row>
            </Grid>
          </Container>
        )
      }
    }
  } 
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    artist: state.artist,
    userId: state.user.userId,
    ongoingAuctions: state.artist.fetchedArtist.ongoingAuctions,
    passedAuctions: state.artist.fetchedArtist.passedAuctions
  };
};

export default connect(mapStateToProps)(Artist);
