// React classes


// ========================================================================= //
// Buttons


class ImageButton extends React.Component {
  constructor(props) {
    super(props);
    this.tooltipPart = null;
    this.id = this.props.name + "-btn-" + this.props.imageId;
    this.title = this.props.name[0].toUpperCase() + this.props.name.slice(1);
  }

  componentDidMount() {
    $(this.tooltipPart).tooltip();
  }

  render() {
    return (
      <button className="border btn bg-white" data-toggle="tooltip"
              id={this.id} ref={el => this.tooltipPart = el}
              title={this.title} type="button"
              onClick={this.props.onClickAction}>
        <span className={"oi " + this.props.iconClass}></span>
      </button>
    );
  }
}


class ShareButton extends React.Component {
  render() {
    return (
      <ImageButton iconClass="oi-share"
                   imageId={this.props.imageId}
                   name="share" />
    );
  }
}


class EditButton extends React.Component {
  render() {
    return (
      <ImageButton iconClass="oi-cog"
                   imageId={this.props.imageId}
                   name="edit" />
    );
  }
}


class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {"isLiked": false};
    this.setLikeState("/ajax/get-like-state.json");
  }

  toggleLike = () => {
    this.setLikeState("/ajax/toggle-like-state.json");
  }

  setLikeState = (url) => {
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        "imageId": this.props.imageId
      }),
      credentials: "same-origin",
      headers: new Headers({
        "content-type": "application/json"
      })
    })
    .then(r => r.json())
    .then(r => r.isLiked !== undefined ?
               this.setState({"isLiked": r.isLiked}) :
               console.log(r));
  }

  render() {
    let iconClass = this.state.isLiked ? "oi-heart text-danger" : "oi-heart";
    let name = this.state.isLiked ? "unlike" : "like";
    return (
      <ImageButton iconClass={iconClass}
                   imageId={this.props.imageId}
                   name={name}
                   onClickAction={this.toggleLike} />
    );
  }
}


class ImageLinkButton extends ImageButton {
  constructor(props) {
    super(props);
    this.href = "/" + this.props.name + "?image_id=" + this.props.imageId;
  }

  render() {
    return (
      <a className="border btn bg-white" data-toggle="tooltip"
         href={this.href} id={this.id} ref={el => this.btnEl = el}
         role="button" title={this.title}>
        <span className={"oi " + this.props.iconClass}></span>
      </a>
    );
  }
}


class StyleButton extends React.Component {
  render() {
    return (
      <ImageLinkButton iconClass="oi-brush"
                       imageId={this.props.imageId}
                       name="style" />
    );
  }
}


class NavButton extends React.Component {
  render() {
    return (
      <button className="btn btn-light mr-2"
              data-target={"#" + this.props.name + "-modal"}
              data-toggle="modal" id={"navbar " + this.props.name + "-btn"}
              type="button">
        <span className={"oi " + this.props.icon}></span>&nbsp;
        {this.props.name.charAt(0).toUpperCase() + this.props.name.slice(1)}
      </button>
    );
  }
}

class UploadNavButton extends React.Component {
  render() {
    return (
      <NavButton name="upload" icon="oi-cloud-upload" />
    );
  }
}


class LoginNavButton extends React.Component {
  render() {
    return (
      <NavButton name="login" icon="oi-account-login" />
    );
  }
}


class NavAButton extends React.Component {
  render() {
    return (
      <a className="btn btn-light" href={"/" + this.props.name}
         id={"navbar-" + this.props.name + "-btn"}>
        <span className={"oi " + this.props.icon}></span>&nbsp;
        {this.props.name.charAt(0).toUpperCase() + this.props.name.slice(1)}
      </a>
    );
  }
}


class LogoutNavButton extends React.Component {
  render() {
    return (
      <NavAButton name="logout" icon="oi-account-logout" />
    );
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


// ========================================================================= //
// Form Buttons


class SubmitFormButton extends React.Component {
  constructor(props) {
    super(props);
    this.id = this.props.name + "-submit-form-btn";
    this.title = this.props.name[0].toUpperCase() + this.props.name.slice(1);
    this.buttonClass = "btn btn-primary " + this.props.buttonClass
    this.iconClass = "oi " + this.props.iconClass + " small"
  }

  render() {
    return (
      <button className={this.buttonClass} id={this.id} type="submit">
        <span className={this.iconClass}></span>&nbsp;
        {this.title}
      </button>
    );
  }
}


class LoginSubmitFormButton extends React.Component {
  render() {
    return (
      <SubmitFormButton buttonClass="ml-2"
                        iconClass="oi-account-login"
                        name="login" />
    );
  }
}


class SignupSubmitFormButton extends React.Component {
  render() {
    return (
      <SubmitFormButton buttonClass="ml-auto"
                        iconClass="oi-plus"
                        name="signup" />
    );
  }
}


class UploadSubmitFormButton extends React.Component {
  render() {
    return (
      <SubmitFormButton buttonClass="ml-auto"
                        iconClass="oi-cloud-upload"
                        name="upload" />
    );
  }
}


class SignupLinkFormButton extends React.Component {
  render() {
    return (
      <a className="btn btn-info ml-auto" href="/signup"
         id="signup-link-form-btn">
        <span className="oi oi-plus small"></span>&nbsp;
        Signup
      </a>
    );
  }
}


// ========================================================================= //
// Button Groups


class FeedCardButtonGroup extends React.Component {
  render() {
    if (this.props.image.userId === this.props.userId) {
      return (
        <nav className="btn-group" role="group">
          <StyleButton imageId={this.props.image.imageId}
                       userId={this.props.userId} />
          <ShareButton imageId={this.props.image.imageId}
                       userId={this.props.userId} />
          <EditButton imageId={this.props.image.imageId}
                      userId={this.props.userId} />
        </nav>
      );
    } else {
      return (
        <nav className="btn-group" role="group">
          <LikeButton imageId={this.props.image.imageId}
                      userId={this.props.userId} />
          <ShareButton imageId={this.props.image.imageId}
                       userId={this.props.userId} />
        </nav>
      );
    }
  }
}


class LibraryCardButtonGroup extends React.Component {
  render() {
    if (this.props.isSource) {
      return (
        <nav className="btn-group" role="group">
          <StyleButton imageId={this.props.imageId}
                       userId={this.props.userId} />
          <ShareButton imageId={this.props.imageId}
                       userId={this.props.userId} />
          <EditButton imageId={this.props.imageId}
                      userId={this.props.userId} />
        </nav>
      );
    } else {
      return (
        <nav className="btn-group" role="group">
          <ShareButton imageId={this.props.imageId}
                       userId={this.props.userId} />
          <EditButton imageId={this.props.imageId}
                      userId={this.props.userId} />
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
                   id="current-password-form-field" name="password"
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
                 id="current-password-modal-form-field" name="password"
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
                   id="email-form-field" name="email" placeholder="Enter email"
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
                 id="email-modal-form-field" name="email"
                 placeholder="Enter email" required="true" type="email" />
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


class UsernameFormField extends React.Component {
  constructor(props) {
    super(props);
    this.forceLower = this.forceLower.bind(this);
  }

  forceLower() {
    let field = document.querySelector('#username-form-field');
    field.value = field.value.toLower();
  }

  render() {
    return (
      <div className="form-group row">
        <label className="col-sm-4 col-md-3 col-form-label"
               htmlFor="username-form-field">
          Username
        </label>
        <div className="col-sm-8 col-md-9 input-group">
          <div className="input-group-prepend">
            <div className="input-group-text">@</div>
          </div>
          <input autoComplete="username" className="form-control"
                 id="username-form-field" name="username" minLength="3"
                 maxLength="32" onChange={this.forceLower}
                 pattern="^[a-z](?:[-]?[a-z0-9]+)+"
                 placeholder="Enter username" required="true"
                 title="Usernames must be 3 to 32 characters, must start with a letter, and may only contain lowercase letters, numbers, or dashes."
                 type="text" />
        </div>
      </div>
    );
  }
}


class NewPasswordFormFieldGroup extends React.Component {
  constructor(props) {
    super(props);
    this.isRequired = this.props.isRequired !== null;
    this.state = {
      strength: " ",
      confirmClass: "oi-circle"
    };
    this.checkStrength = this.checkStrength.bind(this);
    this.checkConfirm = this.checkConfirm.bind(this);
    this.strengths = {
      0: "Worst",
      1: "Bad",
      2: "Weak",
      3: "Good",
      4: "Strong"
    }
  }

  checkStrength() {
    let password = document.querySelector("#new-password-form-field").value;
    let result = zxcvbn(password);
    if (password !== "") {
      this.setState({strength: "Password Strength: " +
                               this.strengths[result.score]});
    } else {
      this.setState({strength: " "});
    }
  }

  checkConfirm() {
    let password = document.querySelector("#new-password-form-field").value;
    let confirm = document.querySelector("#new-password-confirm-form-field").value;
    if (password === confirm) {
      this.setState({confirmClass: "oi-circle-check"});
    } else {
      this.setState({confirmClass: "oi-circle-x"});
    }
  }

  render() {
    return (
      <div className="m-0 p-0">
        <div className="form-group row">
          <div className="col-12 d-flex flex-row m-0">
            <small className="my-0 ml-auto mr-3 text-muted"
               id="new-password-strength">
              {this.state.strength}&nbsp;
            </small>
          </div>
          <label className="col-sm-4 col-md-3 col-form-label"
                 htmlFor="new-password-form-field">
            Password
          </label>
          <div className="col-sm-8 col-md-9">
            <input autoComplete="new-password" className="form-control"
                   id="new-password-form-field" minLength="8" name="password"
                   onChange={this.checkStrength}
                   placeholder="Enter new password"
                   required={this.isRequired}
                   title="Passwords must have at least 8 characters"
                   type="password" />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-4 col-md-3 col-form-label"
                 htmlFor="new-password-confirm-form-field">
                Confirm Password
          </label>
          <div className="col-sm-8 col-md-9 input-group">
            <div className="input-group-prepend">
              <div className="input-group-text" id="password-confirm-display">
                <span className={"oi " + this.state.confirmClass}></span>
              </div>
            </div>
            <input autoComplete="new-password" className="form-control"
                   id="new-password-confirm-form-field"
                   onChange={this.checkConfirm}
                   placeholder="Re-enter new password"
                   required={this.isRequired} type="password" />
          </div>
        </div>
      </div>
    );
  }
}


// ========================================================================= //
// Card Contents


class CardBody extends React.Component {
  constructor(props) {
    super(props);
    this.tooltipPart = null;
  }

  componentDidMount() {
    $(this.tooltipPart).tooltip();
  }

  render() {
    if (this.props.image.sourceImage) {
      const srcImg = this.props.image.sourceImage;
      return (
        <div className="card-body px-3 py-2">
          <h5 className="card-title">{srcImg.title}</h5>
          <p className="card-text m-o">
            {srcImg.description}
          </p>
        </div>
      );
    } else if (this.props.image.styledImage) {
      const styImg = this.props.image.styledImage;
      return (
        <div className="card-body px-3 py-2">
          <h5 className="card-title">{styImg.sourceImage.title}</h5>
          <p className="m-0">
            Styled as&nbsp;
            <a data-html="true" data-toggle="tooltip"
               id={"styled-image-desc-" + this.props.image.imageId}
               ref={el => this.tooltipPart = el}
               title={"<img class='img-thumbnail' src=" + styImg.path + ">"}>
              <strong>{styImg.title}</strong> by <em>{styImg.artist}</em>
            </a>
          </p>
        </div>
      );
    }
  }
}


// ========================================================================= //
// Cards


class FeedCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'image': null
    };
    this.payload = {
      method: 'POST',
      body: JSON.stringify({
        'imageId': this.props.imageId
      }),
      credentials: 'same-origin',
      headers: new Headers({
        'content-type': 'application/json'
      })
    };
    fetch('/ajax/get-image-details.json', this.payload)
    .then(r => r.json())
    .then(r => this.setState({
      'image': r.image
    }));
  }

  render() {
    if (this.state.image === null) {
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
              <img className="card-img-top image-detail-target"
                   id={this.props.imageId} src={this.state.image.path} />
              <div className="card-overlay"></div>
              <a className="card-username"
                 href={"/user/" + this.state.image.user.username}>
                {"@" + this.state.image.user.username}
              </a>
            </div>

            <CardBody image={this.state.image} />

            <footer className="bg-light card-footer d-flex flex-row pr-1 py-1">
              <small className="text-muted my-auto mr-auto">
                {this.state.image.createdAt}
              </small>

              <FeedCardButtonGroup image={this.state.image}
                                   userId={this.props.userId} />

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
    this.payload = {
      method: 'POST',
      body: JSON.stringify({
        'imageId': this.props.imageId
      }),
      credentials: 'same-origin',
      headers: new Headers({
        'content-type': 'application/json'
      })
    };
    fetch('/ajax/get-image-details.json', this.payload)
    .then(r => r.json())
    .then(r => this.setState({
      'image': r.image
    }));
  }

  render() {
    if (this.state.image === null) {
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
                 id={this.props.imageId} src={this.state.image.path} />

            <CardBody image={this.state.image} />

            <footer className="bg-light card-footer d-flex flex-row pr-1 py-1">
              <small className="my-auto mr-auto text-muted">
                {this.state.image.createdAt}
              </small>

              <LibraryCardButtonGroup imageId={this.state.image.imageId}
                                      isSource={this.state.image.sourceImage !== undefined}
                                      userId={this.props.userId} />

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
      <div className="col-md-12 col-lg-10 mx-auto">
        <form action="/signup" method="POST">
          <div className="form-group row">
            <h3 className="ml-4 ml-sm-0">Signup</h3>
          </div>

          <UsernameFormField useColumns />
          <EmailFormField useColumns />
          <NewPasswordFormFieldGroup isRequired />

          <div className="d-flex flex-row">

            <SignupSubmitFormButton />

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


// TODO: need to fix this modal
class ImageModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'image': null
    };
    const url = '/ajax/get-image-details.json';
    const data = {'imageId': this.props.imageId};
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
                     id={this.state.image.imageId}
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
                                     userId={this.props.userId} />
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


class NavBrand extends React.Component {
  render() {
    return (
      <a className="h1 mb-0 navbar-brand" href="/">
        <span className="oi oi-brush"></span>&nbsp;
        DeepPaint
      </a>
    );
  }
}


class Navbar extends React.Component {
  render() {
    if (this.props.userId) {
      return (
        <nav className="bg-dark border-dark navbar navbar-dark navbar-expand-md
                        shadow sticky-top">
          <div className="container">
            <NavBrand />
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
                  <a className="nav-link" href="/" id="nav-home">
                    Home
                  </a>
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
            <NavBrand />
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
  getCards = () => {
    let cards = [];
    for(let i = 0; i < this.props.imageIds.length; i++) {
      cards.push(
        <FeedCard key={this.props.imageIds[i]}
                  imageId={this.props.imageIds[i]}
                  userId={this.props.userId}/>
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
  getCards = () => {
    let cards = [];
    for(let i = 0; i < this.props.imageIds.length; i++) {
      cards.push(
        <LibraryCard key={this.props.imageIds[i]}
                     imageId={this.props.imageIds[i]}
                     userId={this.props.userId}/>
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
