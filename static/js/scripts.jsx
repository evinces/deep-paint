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
        <span className="oi oi-share"></span>
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
        <span className="oi oi-cog"></span>
      </button>
    );
  }

  componentDidMount() {
    $("#edit-btn-" + this.props.image.image_id).tooltip();
  }
}


class CloseModalButton extends React.Component {
  render() {
    return (
      <button aria-label="Close" className="close" data-dismiss="modal"
              type="button">
        <span aria-hidden="true">&times;</span>
      </button>
    );
  }
}


class UploadNavButton extends React.Component {
  render() {
    return (
      <button className="btn btn-light mr-2" data-target="#upload-modal"
              data-toggle="modal" id="upload-btn" type="button">
        <span className="oi oi-cloud-upload"></span>&nbsp;
        Upload
      </button>
    );
  }
}


class LoginNavButton extends React.Component {
  render() {
    return (
      <button className="btn btn-light" data-target="#login-modal"
              data-toggle="modal" id="navbar-login-btn" type="button">
        <span className="oi oi-account-login"></span>&nbsp;
        Login
      </button>
    );
  }
}


class LogoutNavButton extends React.Component {
  render() {
    return (
      <a className="btn btn-light" href="/logout" id="navbar-logout-btn">
        <span className="oi oi-account-logout"></span>&nbsp;
        Logout
      </a>
    );
  }
}


// ========================================================================= //
// Form Buttons


class LoginSubmitFormButton extends React.Component {
  render() {
    return (
      <button type="submit" className="btn btn-primary ml-2">
        <span className="oi oi-account-login small"></span>&nbsp;
        Login
      </button>
    );
  }
}


class SignupLinkFormButton extends React.Component {
  render() {
    return (
      <a className="btn btn-info ml-auto" href="/signup">
        <span className="oi oi-plus small"></span>&nbsp;
        Signup
      </a>
    );
  }
}


class UploadSubmitFormButton extends React.Component {
  render() {
    return (
      <button className="btn btn-primary ml-auto" type="submit">
        <span className="oi oi-cloud-upload">&nbsp;</span>
        Upload
      </button>
    );
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
// Form Fields


class CurrentPasswordFormField extends React.Component {
  render() {
    if (this.props.useColumns) {
      return (
        <div className="form-group row">
          <label className="col-sm-3 col-form-label"
                 htmlFor="col-current-password-form-field">
            Password
          </label>
          <div className="col-sm-9">
            <input autoComplete="current-password" className="form-control"
                   id="col-current-password-form-field" name="password"
                   placeholder="Enter password" required="true"
                   type="password"/>
          </div>
        </div>
      );
    } else {
      return (
        <div className="form-group">
          <label htmlFor="current-password-form-field">
            Password
          </label>
          <input autoComplete="current-password" className="form-control"
                 id="current-password-form-field" name="password"
                 placeholder="Enter password" required="true"
                 type="password"/>
        </div>
      );
    }
  }
}


class EmailFormField extends React.Component {
  render() {
    if (this.props.useColumns) {
      return (
        <div className="form-group row">
          <label className="col-sm-3 col-form-label" htmlFor="col-email-form-field">
            Email address
          </label>
          <div className="col-sm-9">
            <input autoComplete="email" className="form-control"
                   id="col-email-form-field" name="email" placeholder="Enter email"
                   required="true" type="email" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="form-group">
          <label htmlFor="email-form-field">
            Email address
          </label>
          <input autoComplete="email" className="form-control"
                 id="email-form-field" name="email" placeholder="Enter email"
                 required="true" type="email" />
        </div>
      );
    }
  }
}


class FileTitleFormField extends React.Component {
  render() {
    return (
      <input className="form-control mb-2" id="file-title-form-field"
             name="title" placeholder="Title" required="true" type="text" />
    )
  }
}


class FileDescriptionFormField extends React.Component {
  render() {
    return (
      <textarea className="form-control mb-2" id="file-description-form-field"
                maxLength="700" name="description" placeholder="Description..."
                rows="3">
      </textarea>
    );
  }
}


class FileSelectFormField extends React.Component {
  constructor(props) {
    super(props);
    this.updateLabel = this.updateLabel.bind(this);
    this.state = {filename: "Choose image file"};
  }

  updateLabel() {
    const file = document.querySelector('#file-select-form-field').files[0];
    if (file !== undefined) {
      this.setState({filename: file.name});
    } else {
      this.setState({filename: "Choose image file"});
    }
  }

  render() {
    return (
      <div className="custom-file form-group">
        <input className="custom-file-input form-control"
               id="file-select-form-field" name="image" required="true"
               type="file" onChange={this.updateLabel} />
        <label className="custom-file-label text-truncate"
               htmlFor="file-select-form-field"
               id="file-select-form-field-label">
          {this.state.filename}
        </label>
        <small className="ml-2 text-muted">
          File types: .gif .jpg .jpeg .png .tif .tga
        </small>
      </div>
    );
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
          <div className="card mx-2 my-4 shadow-sm">
            <p>Loading...</p>
          </div>
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
        <article className="col-12 col-sm-11 col-md-6 col-lg-4 col-xl-3
                            mx-auto">
          <div className="card mx-2 my-4 shadow-sm">
            <p>Loading...</p>
          </div>
        </article>
      );
    } else {
      return (
        <article className="col-12 col-sm-11 col-md-6 col-lg-4 col-xl-3
                            mx-auto">
          <div className="card mx-2 my-4 shadow-sm">
            <img className="card-img-top image-detail-target"
                 id={this.props.image_id} src={this.state.image.path} />

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
// Forms


class LoginForm extends React.Component {
  render() {
    return (
      <div className="col-sm-12 col-md-10 col-lg-8 mx-auto">
        <form action="/login" method="POST">
          <div className="form-group row">
            <h3 className="ml-4 ml-sm-0">Login</h3>
          </div>

          <EmailFormField useColumns />
          <CurrentPasswordFormField useColumns />

          <div className="d-flex flex-row">

            <SignupLinkFormButton />
            <LoginSubmitFormButton />

          </div>
        </form>
      </div>
    );
  }
}


class SignupForm extends React.Component {
  render() {
    return (
      <div className="col-sm-12 col-md-10 col-lg-8 mx-auto">
        <form action="/login" method="POST">
          <div className="form-group row">
            <h3 className="ml-4 ml-sm-0">Login Form</h3>
          </div>

          <EmailFormField />
          <CurrentPasswordFormField />

          <div className="d-flex flex-row">

            <SignupLinkFormButton />
            <LoginFormButton />

          </div>
        </form>
      </div>
    );
  }
}


// ========================================================================= //
// Modals


class LoginModal extends React.Component {
  render() {
    return (
      <div aria-hidden="true" aria-labelledby="login-modal-title"
           className="fade modal" id="login-modal" role="dialog" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header py-2">
              <h5 className="modal-title" id="login-modal-title">Login</h5>

              <CloseModalButton />

            </div>
            <form action="/login" method="POST">
              <div className="modal-body">

                <EmailFormField />
                <CurrentPasswordFormField />

              </div>
              <div className="modal-footer p-2">

                <SignupLinkFormButton />
                <LoginSubmitFormButton />

              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}


class UploadModal extends React.Component {
  render() {
    return (
      <div aria-hidden="true" aria-labelledby="upload-modal-title"
           className="modal fade" id="upload-modal" role="dialog"
           tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header py-2">
              <h5 className="modal-title" id="upload-modal-title">
                Choose an image file to upload
              </h5>

              <CloseModalButton />

            </div>
            <form action="/upload" encType="multipart/form-data"
                  method="POST">
              <div className="modal-body">

                <FileTitleFormField />
                <FileDescriptionFormField />
                <FileSelectFormField />

              </div>
              <div className="modal-footer p-2">

                <UploadSubmitFormButton />

              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}


class ImageModal extends React.Component {
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
        <div aria-hidden="true" class="modal fade" id="image-modal" role="dialog"
           tabindex="-1">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <p>Loading...</p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div aria-hidden="true" class="modal fade" id="image-modal" role="dialog"
           tabindex="-1">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="image-modal-title">
                  {this.state.image.title}
                </h5>
                <CloseModalButton />
              </div>
              <div class="modal-body">
                <img class="border d-flex mx-auto rounded"
                     id={this.state.image.image_id}
                     src={this.state.image.path} />
                <h6 id="image-modal-user">
                  <a href={"/user/" + this.state.image.user.username}>
                    @{this.state.image.user.username}
                  </a>
                </h6>
                <p id="image-modal-description">
                  {this.state.image.description}
                </p>
              </div>
              <footer className="modal-footer d-flex flex-row pr-1 py-1">
                <small className="my-auto mr-auto text-muted">
                  {this.state.image.created_at}
                </small>
                <FeedCardButtonGroup image={this.state.image}
                                     user_id={this.props.user_id} />
              </footer>
            </div>
          </div>
        </div>
      );
    }
  }
}


// ========================================================================= //
// Navbar


class Navbar extends React.Component {
  render() {
    if (this.props.user_id) {
      return (
        <nav className="bg-dark border-dark navbar navbar-dark navbar-expand-md
                        shadow sticky-top">
          <div className="container">
            <a className="h1 mb-0 navbar-brand" href="/">
              <span className="oi oi-brush"></span>&nbsp;
              Deep-Paint
            </a>
            <button aria-controls="navbar-toggle" aria-expanded="false"
                    aria-label="Toggle navigation" className="navbar-toggler"
                    data-target="#navbar-toggle" data-toggle="collapse"
                    type="button">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbar-toggle">
              <div className="ml-auto order-2">

                <UploadNavButton />
                <LogoutNavButton />

              </div>
              <ul className="mr-auto navbar-nav order-1">
                <li className="nav-item">
                  <a className="nav-link" href="/" id="nav-home">Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/library" id="nav-library">
                    Library
                  </a>
                </li>
                <li className="dropdown nav-item">
                  <a aria-expanded="false" aria-haspopup="true"
                     className="dropdown-toggle nav-link"
                     data-toggle="dropdown" id="navbar-about-dropdown">
                    About
                  </a>
                  <div aria-labelledby="navbar-about-dropdown"
                       className="dropdown-menu">
                    <a className="dropdown-item" href="/about">
                      About this project
                    </a>
                    <a className="dropdown-item" href="/about#tensorflow">
                      How does style-transfer work?
                    </a>
                    <a className="dropdown-item"
                       href="https://github.com/evinces/deep-paint">
                      <small>
                        <span className="oi oi-external-link"></span>
                      </small>&nbsp;
                      View the project GitHub
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      );
    } else {
      return (
        <nav className="bg-dark border-dark navbar navbar-dark navbar-expand-md
                    shadow sticky-top">
          <div className="container">
            <a className="h1 mb-0 navbar-brand" href="/">
              <span className="oi oi-brush"></span>&nbsp;
              Deep-Paint
            </a>
            <button aria-controls="navbar-toggle" aria-expanded="false"
                    aria-label="Toggle navigation" className="navbar-toggler"
                    data-target="#navbar-toggle" data-toggle="collapse"
                    type="button">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbar-toggle">
              <div className="ml-auto order-2">
                <LoginNavButton />
              </div>
              <ul className="mr-auto navbar-nav order-1">
                <li className="nav-item">
                  <a className="nav-link" href="/" id="nav-home">Home</a>
                </li>
                <li className="dropdown nav-item">
                  <a aria-expanded="false" aria-haspopup="true"
                     className="dropdown-toggle nav-link"
                     data-toggle="dropdown" id="navbar-about-dropdown">
                    About
                  </a>
                  <div aria-labelledby="navbar-about-dropdown"
                       className="dropdown-menu">
                    <a className="dropdown-item" href="/about">
                      About this project
                    </a>
                    <a className="dropdown-item" href="/about#tensorflow">
                      How does style-transfer work?
                    </a>
                    <a className="dropdown-item"
                       href="https://github.com/evinces/deep-paint">
                      <small>
                        <span className="oi oi-external-link"></span>&nbsp;
                      </small>
                      View the project GitHub
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
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
