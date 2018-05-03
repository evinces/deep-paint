// React classes

// ========================================================================= //
// Buttons
// ========================================================================= //

// Image Generic
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

class ImageButton extends React.Component {
  constructor(props) {
    super(props);
    this.tooltipPart = null;
  }
  componentDidMount() {
    $(this.tooltipPart).tooltip();
  }
  render() {
    return (
      <button className="border btn bg-white"
              data-toggle="tooltip"
              id={`${this.props.name}-btn-${this.props.imageId}`}
              ref={el => this.tooltipPart = el}
              onClick={this.props.onClickAction}
              title={(this.props.name[0].toUpperCase() +
                      this.props.name.slice(1))}
              type="button">
        <span className={`oi ${this.props.iconClass}`}></span>
      </button>
    );
  }
}


// Share
// ------------------------------------------------------------------------- //

class ShareButton extends React.Component {
  render() {
    return (
      <ImageButton iconClass="oi-share"
                   imageId={this.props.imageId}
                   name="share" />
    );
  }
}

// Edit
// ------------------------------------------------------------------------- //

class EditButton extends React.Component {
  render() {
    return (
      <ImageButton iconClass="oi-cog"
                   imageId={this.props.imageId}
                   name="edit" />
    );
  }
}

// Like
// ------------------------------------------------------------------------- //

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {"isLiked": false};
    if (this.props.loggedInAs !== null) {
      this.setLikeState("/ajax/get-like-state.json");
    }
  }
  toggleLike = () => {
    if (this.props.loggedInAs !== null) {
      this.setLikeState("/ajax/toggle-like-state.json");
    }
  }
  setLikeState = (url) => {
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        "imageId": this.props.imageId,
        "userId": this.props.loggedInAs
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
    return (
      <ImageButton iconClass={(this.state.isLiked ?
                               "oi-heart text-danger" :
                               "oi-heart")}
                   imageId={this.props.imageId}
                   name={(this.state.isLiked ? "unlike" : "like")}
                   onClickAction={this.toggleLike} />
    );
  }
}

// Image Link Generic
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

class ImageLinkButton extends ImageButton {
  constructor(props) {
    super(props);
    this.href = `/${this.props.name}?image_id=${this.props.imageId}`;
  }
  render() {
    return (
      <a className="border btn bg-white" data-toggle="tooltip"
         href={this.href} id={this.id} ref={el => this.tooltipPart = el}
         role="button" title={this.title}>
        <span className={`oi ${this.props.iconClass}`}></span>
      </a>
    );
  }
}

// Sytle
// ------------------------------------------------------------------------- //

class StyleButton extends React.Component {
  render() {
    return (
      <ImageLinkButton iconClass="oi-brush"
                       imageId={this.props.imageId}
                       name="style" />
    );
  }
}

// Nav Button Generic
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

class NavButton extends React.Component {
  render() {
    let title = (this.props.title ?
                 this.props.title :
                 this.props.name.charAt(0).toUpperCase() +
                 this.props.name.slice(1));
    let btnColor = (this.props.btnColor ? this.props.btnColor : "btn-light");
    return (
      <button className={`btn mr-2 ${btnColor}`}
              data-target={`#${this.props.name}-modal`}
              data-toggle="modal" id={`navbar${this.props.name}-btn`}
              type="button">
        <span className={`oi ${this.props.icon}`}></span> {title}
      </button>
    );
  }
}

// Upload
// ------------------------------------------------------------------------- //

class UploadNavButton extends React.Component {
  render() {
    return (
      <NavButton name="upload" icon="oi-cloud-upload" />
    );
  }
}

// Login
// ------------------------------------------------------------------------- //

class LoginNavButton extends React.Component {
  render() {
    return (
      <NavButton btnColor="btn-primary" name="login" icon="oi-account-login"
                 title="Login or Signup to Style Photos" />
    );
  }
}

// Nav Link Generic
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

class NavLinkButton extends React.Component {
  render() {
    let title = (this.props.title ?
                 this.props.title :
                 this.props.name.charAt(0).toUpperCase() +
                 this.props.name.slice(1));
    let btnColor = (this.props.btnColor ? this.props.btnColor : "btn-light");
    return (
      <a className={`btn mr-2 ${btnColor}`} href={`/${this.props.name}`}
         id={`navbar-${this.props.name}-btn`}>
        <span className={`oi ${this.props.icon}`}></span> {title}
      </a>
    );
  }
}

// Logout
// ------------------------------------------------------------------------- //

class LogoutNavButton extends React.Component {
  render() {
    return (
      <NavLinkButton name="logout" icon="oi-account-logout" />
    );
  }
}

// Close Modal
// ------------------------------------------------------------------------- //

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

// Submit Form Generic
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

class SubmitFormButton extends React.Component {
  constructor(props) {
    super(props);
    this.id = `${this.props.name}-submit-form-btn`;
    this.title = (this.props.title ?
                  this.props.title :
                  this.props.name[0].toUpperCase() + this.props.name.slice(1));
    this.buttonClass = `btn btn-primary ${this.props.buttonClass}`;
    this.iconClass = `oi ${this.props.iconClass} small"`;
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

// Login Form
// ------------------------------------------------------------------------- //

class LoginSubmitFormButton extends React.Component {
  render() {
    return (
      <SubmitFormButton buttonClass="ml-2"
                        iconClass="oi-account-login"
                        name="login" />
    );
  }
}

// Signup Form
// ------------------------------------------------------------------------- //

class SignupSubmitFormButton extends React.Component {
  render() {
    return (
      <SubmitFormButton buttonClass="ml-auto"
                        iconClass="oi-plus"
                        name="signup" />
    );
  }
}

// Upload Form
// ------------------------------------------------------------------------- //

class UploadSubmitFormButton extends React.Component {
  render() {
    return (
      <SubmitFormButton buttonClass="ml-auto"
                        iconClass="oi-cloud-upload"
                        name="upload" />
    );
  }
}

// Signup Link Form
// ------------------------------------------------------------------------- //

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
// ========================================================================= //

// Card Buttons
// ------------------------------------------------------------------------- //

class CardButtonGroup extends React.Component {
  render() {
    const buttons = [
      <LikeButton imageId={this.props.imageId}
                  loggedInAs={this.props.loggedInAs}
                  key={`${this.props.imageId}-like`} />,
      // <ShareButton imageId={this.props.imageId}
      //              loggedInAs={this.props.loggedInAs}
      //              key={`${this.props.imageId}-share`} />
    ];
    if (this.props.isOwner) {
      if (this.props.isSource) {
        buttons.push(
          <StyleButton imageId={this.props.imageId}
                       loggedInAs={this.props.loggedInAs}
                       key={`${this.props.imageId}-style`} />
        );
      }
      buttons.push(
        <EditButton imageId={this.props.imageId}
                    loggedInAs={this.props.loggedInAs}
                    key={`${this.props.imageId}-edit`} />
      );
    }
    return (
      <nav className="btn-group" role="group">
        {buttons}
      </nav>
    );
  }
}

// ========================================================================= //
// Form Fields
// ========================================================================= //

// Current Password
// ------------------------------------------------------------------------- //

class CurrentPasswordFormField extends React.Component {
  render() {
    if (this.props.useColumns) {
      return (
        <div className="form-group row">
          <label className="col-sm-3 col-form-label"
                 htmlFor="current-password-form-field">
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
          <label htmlFor="current-password-modal-form-field">
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

// Email
// ------------------------------------------------------------------------- //

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

// Upload Title
// ------------------------------------------------------------------------- //

class FileTitleFormField extends React.Component {
  render() {
    return (
      <input className="form-control mb-2" id="file-title-form-field"
             name="title" placeholder="Title" required="true" type="text" />
    )
  }
}

// Upload Description
// ------------------------------------------------------------------------- //

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

// Upload File
// ------------------------------------------------------------------------- //

class FileSelectFormField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {filename: "Choose image file"};
    this.inputEl = null;
  }
  updateLabel = () => {
    this.setState({
      filename: (this.inputEl.files[0] !== undefined ?
                 this.inputEl.files[0].name : "Choose image file")
    });
  }
  render() {
    return (
      <div className="custom-file form-group">
        <input className="custom-file-input form-control"
               id="file-select-form-field" name="image" required="true"
               type="file" onChange={this.updateLabel}
               ref={el => this.inputEl = el} />
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

// Username
// ------------------------------------------------------------------------- //

class UsernameFormField extends React.Component {
  constructor(props) {
    super(props);
    this.inputEl = null;
    this.title = "Usernames must be 3 to 32 characters, must start with a letter, and may only contain lowercase letters, numbers, or dashes.";
  }
  forceLower = () => {
    this.inputEl.value = this.inputEl.value.toLowerCase();
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
                 placeholder="Enter username" ref={el => this.inputEl = el}
                 required="true" title={this.title} type="text" />
        </div>
      </div>
    );
  }
}

// New Password Field Group
// ------------------------------------------------------------------------- //

class NewPasswordFormFieldGroup extends React.Component {
  constructor(props) {
    super(props);
    this.isRequired = this.props.isRequired !== null;
    this.state = {
      strength: null,
      confirmClass: "oi-circle"
    };
    this.newPassEl = null;
    this.confirmEl = null;
  }
  checkStrength = () => {
    const password = this.newPassEl.value;
    const strengths = ["Worst", "Bad", "Weak", "Good", "Strong"];
    if (password !== "") {
      this.setState({
        strength: `Strength: ${strengths[zxcvbn(password).score]}`
      });
    } else {
      this.setState({strength: null});
    }
  }
  checkConfirm = () => {
    this.setState({
      confirmClass: (this.newPassEl.value === this.confirmEl.value ?
                     "oi-circle-check" : "oi-circle-x")
    });
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
                   ref={el => this.newPassEl = el} required={this.isRequired}
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
                <span className={`oi ${this.state.confirmClass}`}></span>
              </div>
            </div>
            <input autoComplete="new-password" className="form-control"
                   id="new-password-confirm-form-field"
                   onChange={this.checkConfirm}
                   placeholder="Re-enter new password"
                   ref={el => this.confirmEl = el} required={this.isRequired}
                   type="password" />
          </div>
        </div>
      </div>
    );
  }
}

// ========================================================================= //
// Card Contents
// ========================================================================= //

// Card Body
// ------------------------------------------------------------------------- //

class CardBody extends React.Component {
  constructor(props) {
    super(props);
    this.tooltipPart = null;
  }
  componentDidMount() {
    $(this.tooltipPart).tooltip();
  }
  render() {
    let title = null;
    let description = null;
    if (this.props.image.sourceImage) {
      title = this.props.image.sourceImage.title;
      description = this.props.image.sourceImage.description;
    } else if (this.props.image.styledImage) {
      title = this.props.image.styledImage.sourceImage.title;
      description = (
        <span>
          Styled as&nbsp;
          <a data-html="true" data-toggle="tooltip"
             id={`styled-image-desc-${this.props.image.imageId}`}
             ref={el => this.tooltipPart = el}
             title={`<img class="img-thumbnail"
                          src="${this.props.image.styledImage.path}">`}>
            <strong>{this.props.image.styledImage.title}</strong>
            &nbsp;by&nbsp;
            <em>{this.props.image.styledImage.artist}</em>
          </a>
        </span>
      );
    }
    return (
      <div className="card-body px-3 py-2">
        <h5 className="card-title">
          {title}
        </h5>
        <p className="card-text m-0">
          {description}
        </p>
      </div>
    );
  }
}

// ========================================================================= //
// Cards
// ========================================================================= //

// Feed
// ------------------------------------------------------------------------- //

class FeedCard extends React.Component {
  render() {
    let isOwner = this.props.image.user.userId == this.props.loggedInAs;
    let isSource = this.props.image.sourceImage != undefined;
    return (
      <div className="card-feed col-12 mx-auto">
        <div className="card mx-2 my-4 shadow-sm">
          <div className="card-img-top">
            <img className="card-img-top image-detail-target"
                 id={this.props.image.imageId}
                 onClick={e => this.props.setFocusImage(this.props.image)}
                 src={this.props.image.path} />
            <div className="card-overlay"></div>
            <a className="card-username" href="#"
               onClick={e => this.props.setFocusUser(this.props.image.user)}>
              @{this.props.image.user.username}
            </a>
          </div>
          <CardBody image={this.props.image} />
          <div className="bg-light card-footer d-flex flex-row pr-1 py-1">
            <small className="text-muted my-auto mr-auto">
              {this.props.image.createdAt}
            </small>
            <CardButtonGroup imageId={this.props.image.imageId}
                             isOwner={isOwner}
                             isSource={isSource}
                             loggedInAs={this.props.loggedInAs} />
          </div>
        </div>
      </div>
    );
  }
}

// Library
// ------------------------------------------------------------------------- //

class LibraryCard extends React.Component {
  render() {
    let isOwner = this.props.image.user.userId == this.props.loggedInAs;
    let isSource = this.props.image.sourceImage != undefined;
    return (
      <div className="col-12 col-sm-11 col-md-6 col-lg-4 col-xl-3 mx-auto">
        <div className="card mx-2 my-4 shadow-sm">
          <img className="card-img-top image-detail-target"
               id={this.props.imageId}
               onClick={e => this.props.setFocusImage(this.props.image)}
               src={this.props.image.path} />
          <CardBody image={this.props.image} />
          <div className="bg-light card-footer d-flex flex-row pr-1 py-1">
            <small className="my-auto mr-auto text-muted">
              {this.props.image.createdAt}
            </small>
            <CardButtonGroup imageId={this.props.image.imageId}
                             isOwner={isOwner}
                             isSource={isSource}
                             loggedInAs={this.props.loggedInAs} />
          </div>
        </div>
      </div>
    );
  }
}

// ========================================================================= //
// Page Elements
// ========================================================================= //

// Library Header
// ------------------------------------------------------------------------- //

class LibraryHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        userId: null,
        username: null,
        createdAt: null
    }};
  }
  componentDidMount() {
    if (this.props.focusUser) {
      this.setState({user: this.props.focusUser});
    } else {
      fetch("/ajax/get-user.json", {
        method: "POST",
        body: JSON.stringify({
          "userId": this.props.loggedInAs
        }),
        credentials: "same-origin",
        headers: new Headers({
          "content-type": "application/json"
        })
      })
      .then(r => r.json())
      .then(r => {
        if (r.user) {
          this.setState({user: r.user});
        } else {
          console.log(r);
        }
      });
    }
  }
  render() {
    return (
      <div className="row">
        <h2 className="col-12 col-md-6">
          @{this.state.user.username}
        </h2>
        <div className="col-12 col-md-6 d-flex flex-row">
          <small className="ml-3 ml-md-auto text-muted">
            Joined on {this.state.user.createdAt}
          </small>
        </div>
      </div>
    );
  }
}

// ========================================================================= //
// Forms
// ========================================================================= //

// Login
// ------------------------------------------------------------------------- //

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

// Signup
// ------------------------------------------------------------------------- //

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
// ========================================================================= //

// Login
// ------------------------------------------------------------------------- //

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

// Upload
// ------------------------------------------------------------------------- //

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

// Image
// ------------------------------------------------------------------------- //

class ImageModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      isOwner: null,
      isSource: null
    };
    this.tooltipPart = null;
  }
  setImage = () => {
    this.setState({
      isOwner: this.props.image.user.userId == this.props.loggedInAs,
      isSource: this.props.image.sourceImage != undefined,
      title: (
         this.props.image.sourceImage != undefined ?
         this.props.image.sourceImage.title :
         this.props.image.styledImage.sourceImage.title
      ),
      description: (
        this.props.image.sourceImage != undefined ? (
          <p className="mx-4 my-2" id="image-modal-description">
            {this.props.image.sourceImage.description}
          </p>
        ) : (
          <p className="mx-4 my-2" id="image-modal-description">
            Styled as&nbsp;
            <a data-html="true"
               data-toggle="tooltip"
               ref={el => this.tooltipPart = el}
               title={`<img class="img-thumbnail"
                            src="${this.props.image.styledImage.path}">`}>
              <strong>
                {this.props.image.styledImage.title}
              </strong> by <em>
                {this.props.image.styledImage.artist}
              </em>
            </a>
          </p>
        )
      )
    });
  }
  componentDidUpdate() {
    $(this.tooltipPart).tooltip();
  }
  render() {
    if (this.props.image === null) {
      return (
        <div aria-hidden="true" className="modal fade" id="image-modal"
             role="dialog" tabIndex="-1" onFocus={this.setImage}>
          <div className="modal-dialog modal-dialog-centered modal-lg"
               role="document">
            <div className="modal-content">
              <p>Loading...</p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div aria-hidden="true" aria-labelledby="image-modal-title"
             className="modal fade" id="image-modal"
             role="dialog" tabIndex="-1" onFocus={this.setImage}>
          <div className="modal-dialog modal-dialog-centered modal-lg"
               role="document">
            <div className="modal-content">
              <div className="modal-header py-2">
                <h5 className="modal-title" id="image-modal-title">
                  {this.state.title}&nbsp;
                  <small className="ml-2 text-muted">by&nbsp;
                    <a href={`/user/${this.props.image.user.username}`}
                       if="image-modal-user">
                      @{this.props.image.user.username}
                    </a>
                  </small>
                </h5>
                <CloseModalButton />
              </div>
              <div className="modal-body p-0">
                <img className="border-bottom d-flex mx-auto w-100"
                     id={this.props.image.imageId}
                     src={this.props.image.path} />
                {this.state.description}
              </div>
              <footer className="modal-footer d-flex flex-row pr-1 py-1">
                <small className="my-auto mr-auto text-muted">
                  {this.props.image.createdAt}
                </small>
                <CardButtonGroup imageId={this.props.image.imageId}
                                 isOwner={this.state.isOwner}
                                 isSource={this.state.isSource}
                                 loggedInAs={this.props.loggedInAs} />
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
// ========================================================================= //

// Brand
// ------------------------------------------------------------------------- //

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

// Navbar
// ------------------------------------------------------------------------- //

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.homeEl = null;
    this.libraryEl = null;
    this.state = {
      aboutClass: "",
      feedClass: "",
      libraryClass: ""
    };
  }
  setActive = () => {
    console.log(`fire setActive, this.props.view = ${this.props.view}`);
    this.setState({
      aboutClass: "",
      feedClass: "",
      libraryClass: ""
    });
    if (this.props.view === "feed") {
      this.setState({feedClass: "active"});
    } else if (this.props.view === "library") {
      this.setState({libraryClass: "active"});
    // } else if (this.props.view === "about") {
    //   this.setState({aboutClass: "active"});
    }
  }
  componentWillMount() {
    this.setActive();
  }
  render() {
    let buttons = null;
    let links = null;
    if (this.props.loggedInAs !== null) {
      buttons = (
        <UploadNavButton />
        <LogoutNavButton />
      );
      links = (
        <li className="nav-item">
          <a className={`nav-link ${this.state.libraryClass}`}
             id="nav-library"
             onClick={e => this.props.setView("library")}
             ref={el => this.libraryEl = el}>
            Library
          </a>
        </li>
      );
    } else {
      buttons = (
        <LoginNavButton />
      );
    }
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
              {buttons}
            </div>
            <ul className="mr-auto navbar-nav order-1">
              <li className="nav-item">
                <a className={`nav-link ${this.state.feedClass}`}
                   id="nav-home" onClick={e => this.props.setView("feed")}
                   ref={el => this.homeEl = el}>
                  Home
                </a>
              </li>
              {links}
              <li className="dropdown nav-item">
                <a aria-expanded="false" aria-haspopup="true"
                   className={`dropdown-toggle nav-link ${this.state.aboutClass}`}
                   data-toggle="dropdown" href="#" id="navbar-about-dropdown">
                  About
                </a>
                <div aria-labelledby="navbar-about-dropdown"
                     className="dropdown-menu">
                  <a className="dropdown-item" href="#"
                     onClick={e => this.props.setView("about")}>
                    About this project
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
  }
}

// ========================================================================= //
// Views
// ========================================================================= //

// Feed / Home
// ------------------------------------------------------------------------- //

class FeedView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {cardList: []};
  }
  componentWillMount() {
    getImages({
      limit: 20,
      offset: null,
      orderByDate: "desc",
      userId: null,
    })
    .then(r => {
      if (r.count > 0) {
        let cardList = this.state.cardList.concat(
          r.images.map(
            (image) => <FeedCard key={image.imageId} image={image}
                                 loggedInAs={this.props.loggedInAs}
                                 setFocusImage={this.props.setFocusImage}
                                 setFocusUser={this.props.setFocusUser} />
          )
        );
        this.setState({cardList: cardList});
      } else {
        console.log('no results found');
      }
    });
  }
  componentWillUnmount() {
    this.setState({cardList: []});
  }
  render() {
    return (
      <div className="row">
        {this.state.cardList}
      </div>
    );
  }
}

// Library / User
// ------------------------------------------------------------------------- //

class LibraryView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {cardList: []};
  }
  componentWillMount() {
    getImages({
      limit: null,
      offset: null,
      orderByDate: true,
      userId: (this.props.focusUser ?
               this.props.focusUser.userId :
               this.props.loggedInAs)
    })
    .then(r => {
      if (r.count > 0) {
        let cardList = this.state.cardList.concat(
          r.images.map(
            (image) => <LibraryCard key={image.imageId} image={image}
                                    loggedInAs={this.props.loggedInAs}
                                    setFocusImage={this.props.setFocusImage} />
          )
        );
        this.setState({cardList: cardList});
      } else {
        console.log('no results found');
      }
    });
  }
  componentWillUnmount() {
    this.setState({cardList: []});
  }
  render() {
    let header = <LibraryHeader loggedInAs={this.props.loggedInAs} />;
    if (this.props.focusUser) {
      header = (
        <LibraryHeader loggedInAs={this.props.loggedInAs}
                       focusUser={this.props.focusUser} />
      );
    }
    return (
      <div>
        {header}
        <div className="row">
          {this.state.cardList}
        </div>
      </div>
    );
  }
}

// ========================================================================= //
// App
// ========================================================================= //

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focusImage: null,
      loggedInAs: (this.props.loggedInAs !== "None" ?
                   this.props.loggedInAs : null),
      focusUser: null,
      view: null
    };
  }
  componentDidMount() {
    this.setView(this.props.view);
  }
  setView = (view) => {
    console.log(`setting view as: ${view}`);
    this.setState({view: view});

    // TODO: replace this with forwarded ref
    let feedEl = $("#nav-home");
    let libraryEl = $("#nav-library");

    if (view === "feed") {
      feedEl.addClass("active");
      libraryEl.removeClass("active");
    } else if (view === "library") {
      feedEl.removeClass("active");
      libraryEl.addClass("active");
    } else {
      feedEl.removeClass("active");
      libraryEl.removeClass("active");
    }
  }
  setFocusImage = (image) => {
    console.log(`setting focusImage as: ${image.imageId}`);
    this.setState({focusImage: image});

    // TODO: replace this with forwarded ref
    $("#image-modal").modal("show");
  }
  setFocusUser = (user) => {
    console.log(`setting setFocusUser as: ${user.username}`);
    this.setState({focusUser: user});
    this.setView("user")
  }
  render() {
    let views = {
      feed: (<FeedView loggedInAs={this.state.loggedInAs}
                       setFocusImage={this.setFocusImage}
                       setFocusUser={this.setFocusUser}
                       setView={this.setView} />),
      library: (<LibraryView loggedInAs={this.state.loggedInAs}
                             setFocusImage={this.setFocusImage}
                             setView={this.setView} />),
      user: (<LibraryView focusUser={this.state.focusUser}
                          loggedInAs={this.state.loggedInAs}
                          setFocusImage={this.setFocusImage}
                          setView={this.setView} />),
      // about: (<AboutView loggedInAs={this.state.loggedInAs}
      //                    setFocusImage={this.setFocusImage}
      //                    setView={this.setView} />)
    };
    return (
      <div id="app">
        <Navbar loggedInAs={this.state.loggedInAs}
                setView={this.setView}
                view={this.state.view} />
        <div id="main-container" className="container mt-4">
          {views[this.state.view]}
        </div>
        <LoginModal />
        <UploadModal />
        <ImageModal image={this.state.focusImage}
                    loggedInAs={this.state.loggedInAs} />
      </div>
    );
  }
}

// ========================================================================= //
// Helper Functions
// ========================================================================= //

// getImages
// ------------------------------------------------------------------------- //

function getImages(requestBody) {
  return fetch("/ajax/get-images.json", {
    method: "POST",
    body: JSON.stringify(requestBody),
    credentials: "same-origin",
    headers: new Headers({
      "content-type": "application/json"
    })
  })
  .then(r => r.json())
  .then(r => {
    console.log(r);
    return r;
  });
}











