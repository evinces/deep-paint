// React classes


// ========================================================================= //
// Buttons


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
      'image_id': this.props.image.image_id
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
      'image_id': this.props.image.image_id
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
        <button className="border btn bg-white" data-toggle="tooltip"
                id={"like-btn-" + this.props.image.image_id}
                onClick={this.toggleLike} title="Unlike" type="button">
          <span className="oi oi-heart text-danger"></span>
        </button>
      );
    } else {
      return (
        <button className="border btn bg-white" data-toggle="tooltip"
                id={"like-btn-" + this.props.image.image_id}
                onClick={this.toggleLike} title="Like" type="button">
          <span className="oi oi-heart"></span>
        </button>
      );
    }
  }

  componentDidUpdate() {
    $("#like-btn-" + this.props.image.image_id).tooltip();
  }
}


class ShareButton extends React.Component {
  render() {
    return (
      <button className="border btn bg-white" data-toggle="tooltip"
              id={"share-btn-" + this.props.image.image_id} title="Share"
              type="button">
        <span className="oi oi-share-boxed"></span>
      </button>
    );
  }

  componentDidMount() {
    $("#share-btn-" + this.props.image.image_id).tooltip();
  }
}


class StyleButton extends React.Component {
  render() {
    return (
      <a className="border btn bg-white" data-toggle="tooltip"
         href={"/style?image_id=" + this.props.image.image_id}
         id={"style-btn-" + this.props.image.image_id} role="button"
         title="Style">
        <span className="oi oi-brush"></span>
      </a>
    );
  }

  componentDidMount() {
    $("#style-btn-" + this.props.image.image_id).tooltip();
  }
}


class EditButton extends React.Component {
  render() {
    return (
      <button className="border btn bg-white" data-toggle="tooltip"
              id={"edit-btn-" + this.props.image.image_id} title="Edit"
              type="button">
        <span className="oi oi-wrench"></span>
      </button>
    );
  }

  componentDidMount() {
    $("#edit-btn-" + this.props.image.image_id).tooltip();
  }
}


// ========================================================================= //
// Button Groups


class FeedCardButtonGroup extends React.Component {
  render() {
    if (this.props.image.user_id === this.props.user_id) {
      return (
        <nav className="btn-group" role="group">
          <StyleButton image={this.props.image} user_id={this.props.user_id} />
          <ShareButton image={this.props.image} user_id={this.props.user_id} />
          <EditButton image={this.props.image} user_id={this.props.user_id} />
        </nav>
      );
    } else {
      return (
        <nav className="btn-group" role="group">
          <LikeButton image={this.props.image} user_id={this.props.user_id} />
          <ShareButton image={this.props.image} user_id={this.props.user_id} />
        </nav>
      );
    }
  }
}


class LibraryCardButtonGroup extends React.Component {
  render() {
    if (this.props.image.source_image) {
      return (
        <nav className="btn-group" role="group">
          <StyleButton image={this.props.image} user_id={this.props.user_id} />
          <ShareButton image={this.props.image} user_id={this.props.user_id} />
          <EditButton image={this.props.image} user_id={this.props.user_id} />
        </nav>
      );
    } else {
      return (
        <nav className="btn-group" role="group">
          <ShareButton image={this.props.image} user_id={this.props.user_id} />
          <EditButton image={this.props.image} user_id={this.props.user_id} />
        </nav>
      );
    }
  }
}


// ========================================================================= //
// Card Contents


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
            Styled as&nbsp;
            <a data-html="true" data-toggle="tooltip" id={"styled-image-desc-" + this.props.image.image_id}
               title={"<img class='img-thumbnail' src=" + sty_img.path + ">"}>
              <strong>{sty_img.title}</strong> by <em>{sty_img.artist}</em>
            </a>
          </p>
        </div>
      );
    }
  }

  componentDidMount() {
    $("#styled-image-desc-" + this.props.image.image_id).tooltip();
  }
}


// ========================================================================= //
// Cards


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

              <FeedCardButtonGroup image={this.state.image}
                                   user_id={this.props.user_id} />

            </footer>
          </div>
        </article>
      );
    }
  }
}


class LibraryCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'image': null
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
      'image': r.image
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
        <article className="col-12 col-sm-11 col-md-6 col-lg-4 col-xl-3
                            mx-auto">
          <div className="card mx-2 my-4 shadow-sm">
            <div className="card-img-top image-detail-target">
              <img className="card-img-top image-detail-target"
                   id={this.props.image_id} src={this.state.image.path} />
            </div>

            <CardBody image={this.state.image} />

            <footer className="bg-light card-footer d-flex flex-row pr-1 py-1">
              <small className="my-auto mr-auto text-muted">
                {this.state.image.created_at}
              </small>

              <LibraryCardButtonGroup image={this.state.image}
                                      user_id={this.props.user_id} />

            </footer>
          </div>
        </article>
      );
    }
  }
}


// ========================================================================= //
// Pages


class FeedPage extends React.Component {
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
      <div className="row">
        {this.getCards()}
      </div>
    );
  }
}


class LibraryPage extends React.Component {
  constructor(props) {
    super(props);
    this.getCards = this.getCards.bind(this);
  }

  getCards() {
    let cards = [];
    for(let i = 0; i < this.props.image_ids.length; i++) {
      cards.push(
        <LibraryCard key={this.props.image_ids[i]}
                     image_id={this.props.image_ids[i]}
                     user_id={this.props.user_id}/>
      );
    }
    return cards;
  }

  render() {
    return (
      <div className="row">
        {this.getCards()}
      </div>
    );
  }
}
