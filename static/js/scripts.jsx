class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'isLiked': false
    };
    this.toggleLike = this.toggleLike.bind(this);

    const url = '/ajax/get-like-state.json';
    const data = {
      'user_id': this.props.user_id,
      'image_id': this.props.image_id
    };
    const payload = {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'same-origin',
      headers: new Headers({'content-type': 'application/json'})
    };
    fetch(url, payload)
    .then(r => r.json())
    .then(r => this.setState({
      'isLiked': r.isLiked
    }));
  }

  toggleLike() {
    if (this.state.isLiked) {
      this.setState({'isLiked': false});
    } else {
      this.setState({'isLiked': true});
    }
    const url = '/ajax/toggle-like-state.json';
    const data = {
      'user_id': this.props.user_id,
      'image_id': this.props.image_id
    };
    const payload = {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'same-origin',
      headers: new Headers({'content-type': 'application/json'})
    };
    fetch(url, payload)
    .then(r => r.json())
    .then(r => console.log(r));
  }

  render() {
    if (this.state.isLiked) {
      return (
        <button className="border btn bg-white" data-toggle="tooltip" id="image-modal-like-btn" onClick={this.toggleLike} title="Unlike" type="button">
          <span className="oi oi-heart text-danger"></span>
        </button>
      );
    } else {
      return (
        <button className="border btn bg-white" data-toggle="tooltip" id="image-modal-like-btn" onClick={this.toggleLike} title="Like" type="button">
          <span className="oi oi-heart"></span>
        </button>
      );
    }
  }
}


class CardBody extends React.Component {
  constructor(props) {
    super(props);
    this.image = props.image;
  }

  render() {
    if (this.image.source_image) {
      const src_img = this.image.source_image;
      return (
        <div className="card-body px-3 py-2">
          <h5 className="card-title">{src_img.title}</h5>
          <p className="card-text m-o">
            {src_img.description}
          </p>
        </div>
      );
    } else if (this.image.styled_image) {
      const sty_img = this.image.styled_image;
      return (
        <div className="card-body px-3 py-2">
          <h5 className="card-title">{sty_img.source_image.title}</h5>
          <p className="m-0">
            Styled as <a data-html="true" data-toggle="tooltip" title="<img className='img-thumbnail' src='{sty_img.path}'>"><strong>{sty_img.title}</strong> by <em>{sty_img.artist}</em></a>
          </p>
        </div>
      );
    }
  }
}


class FeedCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'image': null,
      'user': null
    };
    const url = '/ajax/get-image-details.json';
    const data = {'image_id': this.props.image_id};
    const payload = {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'same-origin',
      headers: new Headers({'content-type': 'application/json'})
    };
    fetch(url, payload)
    .then(r => r.json())
    .then(r => this.setState({
      'image': r.image,
      'user': r.image.user
    }));
  }

  render() {
    if (this.state.image === null || this.state.user === null) {
      return (
        <article className="card-feed col-12 mx-auto">
          <p>Loading...</p>
        </article>
      );
    } else {
      return (
        <article className="card-feed col-12 mx-auto">
          <div className="card mx-2 my-4 shadow-sm">
            <div className="card-img-top">
              <img className="card-img-top image-detail-target" id={this.props.image_id} src={this.state.image.path} />
              <div className="card-overlay"></div>
              <a className="card-username" href={"/user/" + this.state.user.username}>
                {"@" + this.state.user.username}
              </a>
            </div>

            <CardBody image={this.state.image} />

            <footer className="bg-light card-footer d-flex flex-row pr-1 py-1">
              <small className="text-muted my-auto mr-auto">
                {this.state.image.created_at}
              </small>
              <nav className="btn-group" role="group">

                <LikeButton user_id={this.props.user_id}
                            image_id={this.state.image.image_id} />

                <button className="border btn bg-white" data-toggle="tooltip" id="image-modal-share-btn" title="Share" type="button">
                  <span className="oi oi-share-boxed"></span>
                </button>
              </nav>
            </footer>
          </div>
        </article>
      );
    }
  }
}


class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.getCards = this.getCards.bind(this);
  }

  getCards() {
    let cards = [];
    for(let i = 0; i < this.props.image_ids.length; i++) {
      cards.push(
        <FeedCard key={this.props.image_ids[i]}
                  image_id={this.props.image_ids[i]}
                  user_id={this.props.user_id}/>
      );
    }
    return cards;
  }

  render() {
    return (
      <div>
        {this.getCards()}
      </div>
    );
  }
}
