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
  handleClick = () => {
    $("#image-modal").modal("hide");
    this.props.onClickAction(this.props.image);
  }
  render() {
    let title = this.props.name[0].toUpperCase() + this.props.name.slice(1)
    const icons = [
      <span className={`oi ${this.props.iconClass}`} key="oi"></span>
    ];
    if (this.props.badge) {
      icons.push(
        <span className="badge badge-pill ml-1 p-0" key="badge">
          {this.props.badge}
        </span>
      );
    }
    return (
      <button className="border btn bg-white" data-toggle="tooltip"
              id={`${this.props.name}-btn-${this.props.image.imageId}`}
              onClick={e => this.handleClick()}
              ref={el => this.tooltipPart = el} title={title} type="button">
        {icons}
      </button>
    );
  }
}


// Share
// ------------------------------------------------------------------------- //

class ShareButton extends React.Component {
  render() {
    return (
      <ImageButton iconClass="oi-share" image={this.props.image} name="share" />
    );
  }
}

// Edit
// ------------------------------------------------------------------------- //

class EditButton extends React.Component {
  render() {
    return (
      <ImageButton iconClass="oi-cog" image={this.props.image} name="edit"
                   onClickAction={this.props.setEditTarget} />
    );
  }
}

// Like
// ------------------------------------------------------------------------- //

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "isLiked": this.props.image.isLiked,
      "likeCount": this.props.image.likeCount,
    };
  }
  toggleLike = () => {
    if (this.props.loggedInAs !== null) {
      this.setLikeState("/ajax/toggle-like-state.json");
    }
  }
  setLikeState = (url) => {
    fetch(url, {
      body: JSON.stringify({
        "imageId": this.props.image.imageId,
        "userId": (this.props.loggedInAs ? this.props.loggedInAs : null),
      }),
      credentials: "same-origin",
      headers: new Headers({
        "content-type": "application/json"
      }),
      method: "POST",
    })
    .then(r => r.json())
    .then(r => {
      if (r.like) {
        this.setState({
          "isLiked": r.like.isLiked,
          "likeCount": r.like.likeCount,
        });
      } else {
        console.log(r);
      }
    });
  }
  render() {
    let iconClass = "oi-heart";
    if (!this.props.loggedInAs) {
      iconClass += " text-muted";
    } else if (this.state.isLiked) {
      iconClass += " text-danger";
    }
    let name = (this.state.isLiked ? "unlike" : "like");
    return (
      <ImageButton badge={this.state.likeCount} iconClass={iconClass}
                   image={this.props.image} name={name}
                   onClickAction={this.toggleLike} />
    );
  }
}

// Image Link Generic
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

class ImageLinkButton extends ImageButton {
  constructor(props) {
    super(props);
    this.tooltipPart = null;
  }
  componentDidMount() {
    $(this.tooltipPart).tooltip({trigger: 'hover'});
  }
  componentWillUnmount() {
    $(this.tooltipPart).tooltip('hide');
  }
  render() {
    let title = this.props.name[0].toUpperCase() + this.props.name.slice(1);
    return (
      <a className="border btn bg-white" data-toggle="tooltip"
         href="#" id={this.id}
         onClick={e => this.props.onClickAction(this.props.image)}
         ref={el => this.tooltipPart = el} role="button" title={title}>
        <span className={`oi ${this.props.iconClass}`}></span>
      </a>
    );
  }
}

// Style
// ------------------------------------------------------------------------- //

class StyleButton extends React.Component {
  render() {
    return (
      <ImageLinkButton onClickAction={this.props.setStyleTarget}
                       iconClass="oi-brush"
                       image={this.props.image}
                       name="style" />
    );
  }
}

// Nav Button Generic
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

class NavButton extends React.Component {
  render() {
    let title = (this.props.title ? this.props.title :
                 this.props.name[0].toUpperCase() + this.props.name.slice(1));
    let btnColor = (this.props.btnColor ? this.props.btnColor : "btn-light");
    return (
      <button className={`btn mr-2 ${btnColor}`}
              data-target={`#${this.props.name}-modal`}
              data-toggle="modal" id={`navbar${this.props.name}-btn`}
              type="button">
        <span className={`oi mr-2 ${this.props.icon}`}></span>
        {title}
      </button>
    );
  }
}

// Upload
// ------------------------------------------------------------------------- //

class UploadNavButton extends React.Component {
  render() {
    return (
      <NavButton btnColor="btn-primary" name="upload" icon="oi-cloud-upload" />
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
    let title = (this.props.title ? this.props.title :
                 this.props.name[0].toUpperCase() + this.props.name.slice(1));
    let btnColor = (this.props.btnColor ? this.props.btnColor : "btn-light");
    return (
      <a className={`btn mr-2 ${btnColor}`} href={`/${this.props.name}`}
         id={`navbar-${this.props.name}-btn`}>
        <span className={`oi mr-2 ${this.props.icon}`}></span>
        {title}
      </a>
    );
  }
}

// Logout
// ------------------------------------------------------------------------- //

class LogoutNavButton extends React.Component {
  render() {
    return (
      <NavLinkButton btnColor="btn-outline-light" icon="oi-account-logout"
                     name="logout" />
    );
  }
}

// Close Modal
// ------------------------------------------------------------------------- //

class CloseModalButton extends React.Component {
  render() {
    return (
      <button className="close" data-dismiss="modal" type="button">
        <span aria-hidden="true">&times;</span>
      </button>
    );
  }
}

// Submit Form Generic
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

class SubmitFormButton extends React.Component {
  render() {
    let id = `${this.props.name}-submit-form-btn`;
    let title = (this.props.title ? this.props.title :
                 this.props.name[0].toUpperCase() + this.props.name.slice(1));
    let buttonClass = `btn btn-primary ${this.props.buttonClass}`;
    let iconClass = `oi mr-2 ${this.props.iconClass} small"`;
    return (
      <button className={buttonClass} id={id} type="submit">
        <span className={iconClass}></span>
        {title}
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

// Edit Form
// ------------------------------------------------------------------------- //

class EditSubmitFormButton extends React.Component {
  render() {
    return (
      <SubmitFormButton buttonClass="ml-2"
                        iconClass="oi-file"
                        name="save"
                        title="Save Changes" />
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
        <span className="oi oi-plus mr-2 small"></span>
        Signup
      </a>
    );
  }
}

// Delete Button
// ------------------------------------------------------------------------- //

// class DeleteButton extends React.Component {
//   triggerDelete = () => {
//     $('#delete-modal').modal('show');
//   }
//   render() {
//     return (
//       <button className="btn btn-info ml-auto" id="delete-btn"
//               onClick={e => this.triggerDelete()}>
//         <span className="oi oi-trash small"></span>&nbsp;
//         Delete Image
//       </button>
//     );
//   }
// }

// class DeleteModal extends React.Component {
//   submitDelete = () => {
//     fetch('/ajax/delete-image.json', {
//       body: JSON.stringify({
//         imageId: this.props.image.imageId,
//         userId: this.props.loggedInAs,
//       }),
//       credentials: "same-origin",
//       headers: new Headers({
//         "content-type": "application/json",
//       }),
//       method: "POST",
//     })
//     .then(r => r.json())
//     .then(r => {
//       if (r.message === "image deleted") {
//         $('#edit-modal').modal('hide');
//         this.setView("library");
//       } else {
//         console.log(r);
//       }
//     });
//   }
//   render() {
//     let body = (
//     );
//     return (
//       <div aria-hidden="true" aria-labelledby="delete-modal-title"
//            className="fade modal" id="delete-modal" role="dialog" tabIndex="-1">
//         <div className="modal-dialog modal-dialog-centered" role="document">
//           <div className="modal-content">
//             <div className="modal-header py-2">
//               <h5 className="modal-title" id="delete-modal-title">Are you sure?</h5>
//               <CloseModalButton />
//             </div>
//             <form action="/delete" method="POST"
//                   onSubmit={e => this.submitDelete(e)}>
//               <div className="modal-footer p-2">
//                 <LoginSubmitFormButton />
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// ========================================================================= //
// Button Groups
// ========================================================================= //

// Card Buttons
// ------------------------------------------------------------------------- //

class CardButtonGroup extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const buttons = [
      <LikeButton image={this.props.image}
                  key={`${this.props.image.imageId}-like`}
                  loggedInAs={this.props.loggedInAs} />,
      // <ShareButton image={this.props.image}
      //              key={`${this.props.image.imageId}-share`}
      //              loggedInAs={this.props.loggedInAs} />
    ];
    if (this.props.isOwner) {
      if (this.props.isSource) {
        buttons.push(
          <StyleButton image={this.props.image}
                       key={`${this.props.image.imageId}-style`}
                       loggedInAs={this.props.loggedInAs}
                       setStyleTarget={this.props.setStyleTarget} />
        );
      }
      buttons.push(
        <EditButton image={this.props.image}
                    key={`${this.props.image.imageId}-edit`}
                    loggedInAs={this.props.loggedInAs}
                    setEditTarget={this.props.setEditTarget} />
      );
    }
    return (
      <nav className="btn-group ml-auto" role="group">
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
    let isRequired = (this.props.isRequired ? true : false);
    let groupClass = (this.props.useColumns ? "form-group row" : "form-group");
    let inputClass = (this.props.useColumns ? "col-sm-9" : undefined);;
    let labelClass = (this.props.useColumns ? "col-form-label col-sm-3" : undefined);
    return (
      <div className={groupClass}>
        <label className={labelClass}>
          Password
        </label>
        <div className={inputClass}>
          <input autoComplete="current-password" className="form-control"
                 name="password" placeholder="Enter password" required={isRequired}
                 type="password"/>
        </div>
      </div>
    );
  }
}

// Email
// ------------------------------------------------------------------------- //

class EmailFormField extends React.Component {
  render() {
    let isRequired = (this.props.isRequired ? true : false);
    let groupClass = (this.props.useColumns ? "form-group row" : "form-group");
    let inputClass = (this.props.useColumns ? "col-sm-9" : undefined);;
    let labelClass = (this.props.useColumns ? "col-form-label col-sm-3" : undefined);
    let placeholder = (this.props.placeholder ?
                       this.props.placeholder : "Enter email");
    return (
      <div className={groupClass}>
        <label className={labelClass}>
          Email address
        </label>
        <div className={inputClass}>
          <input autoComplete="email" className="form-control" name="email"
                 placeholder={placeholder} required={isRequired} type="email" />
        </div>
      </div>
    );
  }
}

// Upload Title
// ------------------------------------------------------------------------- //

class FileTitleFormField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    }
  }
  handleChange = (e) => {
    this.setState({
      value: e.target.value
    });
    if (this.props.callback) {
      this.props.callback(e.target.value);
    }
  }
  render() {
    let placeholder = (this.props.placeholder ? this.props.placeholder :
                       "Enter title...")
    let isRequired = (this.props.isRequired ? true : false);
    return (
      <input className="form-control mb-2" name="title"
             onChange={e => this.handleChange(e)}
             placeholder={placeholder}
             required={isRequired} type="text" value={this.state.value} />
    )
  }
}

// Upload Description
// ------------------------------------------------------------------------- //

class FileDescriptionFormField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    }
  }
  handleChange = (e) => {
    this.setState({
      value: e.target.value
    });
    if (this.props.callback) {
      this.props.callback(e.target.value);
    }
  }
  render() {
    let placeholder = (this.props.placeholder ? this.props.placeholder :
                       "Enter description...")
    let isRequired = (this.props.isRequired ? true : false);
    return (
      <textarea className="form-control mb-2" defaultValue={this.state.value}
                maxLength="700" name="description"
                onChange={e => this.handleChange(e)}
                placeholder={placeholder} required={isRequired} rows="3">
      </textarea>
    );
  }
}

// Upload File
// ------------------------------------------------------------------------- //

class FileSelectFormField extends React.Component {
  constructor(props) {
    super(props);
    this.inputEl = null;
    this.state = {filename: "Choose image file"};
  }
  updateLabel = () => {
    this.setState({
      filename: (this.inputEl.files[0] !== undefined ?
                 this.inputEl.files[0].name : "Choose image file")
    });
  }
  render() {
    let isRequired = (this.props.isRequired ? true : false);
    return (
      <div className="custom-file form-group">
        <input className="custom-file-input form-control" name="image"
               onChange={this.updateLabel} required={isRequired}
               ref={el => this.inputEl = el} type="file" />
        <label className="custom-file-label text-truncate">
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
    this.inEl = null;
  }
  render() {
    let isRequired = (this.props.isRequired ? true : false);
    let title = "Usernames must be 3 to 32 characters, must start with a letter, and may only contain lowercase letters, numbers, or dashes.";
    let placeholder = (this.props.placeholder ?
                       this.props.placeholder : "Enter username");
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
                 name="username" maxLength="32" minLength="3"
                 onChange={e => this.inEl.value = this.inEl.value.toLowerCase()}
                 pattern="^[a-z]([-]?[a-z0-9])+$" placeholder={placeholder}
                 ref={el => this.inEl = el} required={isRequired} title={title}
                 type="text" />
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
      confirmClass: "oi-circle-check"
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
    this.checkConfirm();
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
    this.title = "";
    this.description = "";
    if (this.props.image.sourceImage) {
      this.title = this.props.image.sourceImage.title;
      this.description = this.props.image.sourceImage.description;
    } else if (this.props.image.styledImage) {
      this.title = this.props.image.styledImage.sourceImage.title;
      this.description = (
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
  }
  componentDidMount() {
    $(this.tooltipPart).tooltip();
  }
  render() {
    return (
      <div className="card-body px-3 py-2">
        <h5 className="card-title mb-0">
          {this.title}
        </h5>
        <small className="d-block mb-2 text-muted">
          {this.props.image.createdAt}
        </small>
        <p className="card-text m-0">
          {this.description}
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
  constructor(props) {
    super(props);
    this.isOwner = this.props.image.user.userId == this.props.loggedInAs;
    this.isSource = this.props.image.sourceImage != undefined;
  }
  render() {
    return (
      <div className="card-feed col-12 mx-auto">
        <div className="card mx-2 my-4 shadow">
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
            <CardButtonGroup image={this.props.image}
                             isOwner={this.isOwner}
                             isSource={this.isSource}
                             loggedInAs={this.props.loggedInAs}
                             setEditTarget={this.props.setEditTarget}
                             setStyleTarget={this.props.setStyleTarget} />
          </div>
        </div>
      </div>
    );
  }
}

// Library
// ------------------------------------------------------------------------- //

class LibraryCard extends React.Component {
  constructor(props) {
    super(props);
    this.isOwner = this.props.image.user.userId == this.props.loggedInAs;
    this.isSource = this.props.image.sourceImage != undefined;
  }
  render() {
    return (
      <div className="col-12 col-sm-11 col-md-6 col-lg-4 col-xl-3 mx-auto">
        <div className="card mx-2 my-4 shadow">
          <img className="card-img-top image-detail-target"
               id={this.props.image.imageId}
               onClick={e => this.props.setFocusImage(this.props.image)}
               src={this.props.image.path} />
          <CardBody image={this.props.image} />
          <div className="bg-light card-footer d-flex flex-row pr-1 py-1">
            <CardButtonGroup image={this.props.image}
                             isOwner={this.isOwner}
                             isSource={this.isSource}
                             loggedInAs={this.props.loggedInAs}
                             setEditTarget={this.props.setEditTarget}
                             setStyleTarget={this.props.setStyleTarget} />
          </div>
        </div>
      </div>
    );
  }
}

// Style
// ------------------------------------------------------------------------- //

class StyleCard extends React.Component {
  render() {
    let bgClass = (this.props.style.styleId === this.props.selectedStyle ?
                   "bg-primary text-light" : "bg-light");
    console.log(`render StyleCard: ${this.props.style.styleId}`);

    return (
      <div className="col-12 col-sm-11 col-md-6 col-lg-4 col-xl-3 mx-auto">
        <div className={`card mx-2 my-4 shadow ${bgClass}`}
             onClick={e => this.props.setStyle(this.props.style.styleId)}>
          <img className="card-img-top image-detail-target"
               id={this.props.style.styleId}
               src={this.props.style.imagePath} />
          <div className="card-body px-3 py-2">
            <h5 className="card-title mb-0">
              {this.props.style.title}
            </h5>
            <em className="card-text m-0">
              {this.props.style.artist}
            </em>
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
          <EmailFormField isRequired useColumns />
          <CurrentPasswordFormField isRequired useColumns />
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
          <UsernameFormField isRequired useColumns />
          <EmailFormField isRequired useColumns />
          <NewPasswordFormFieldGroup isRequired />
          <div className="d-flex flex-row">
            <SignupSubmitFormButton />
          </div>
        </form>
      </div>
    );
  }
}

// Style
// ------------------------------------------------------------------------- //

class StyleForm extends React.Component {
  submitForm = (e) => {
    e.preventDefault();
    this.props.setLoading(true);
    fetch("/ajax/style.json", {
      method: "POST",
      body: JSON.stringify({
        imageId: this.props.styleTarget.imageId,
        styleId: this.props.selectedStyle
      }),
      credentials: "same-origin",
      headers: new Headers({
        "content-type": "application/json"
      })
    })
    .then(r => r.json())
    .then(r => {
      this.props.setView("library");
      if (r.image) {
        this.props.setFocusImage(r.image);
      } else {
        console.log(r);
      }
    });
  }
  render() {
    return (
      <form action="/style" className="col-12 col-md-6 d-flex flex-row"
            id="style-form" method="POST" onSubmit={e => this.submitForm(e)}>
        <input id="source_image_id" name="source_image_id" type="hidden"
               value={this.props.styleTarget.imageId} />
        <input id="style_id_input" name="style_id" type="hidden"
               value={this.props.selectedStyle} />
        <input className="btn btn-primary ml-auto" disabled={this.props.isDisabled}
               id="submit" name="Stylize" type="submit" />
      </form>
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
                <EmailFormField isRequired />
                <CurrentPasswordFormField isRequired />
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
                <FileTitleFormField isRequired />
                <FileDescriptionFormField isRequired />
                <FileSelectFormField isRequired />
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

// Edit
// ------------------------------------------------------------------------- //

class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
    }
    this.modalEl = null;
  }
  setDescription = (description) => {
    this.setState({
      description: description
    });
  }
  setTitle = (title) => {
    this.setState({
      title: title
    });
  }
  submitForm = (e) => {
    e.preventDefault();
    fetch("/ajax/edit-image.json", {
      method: "POST",
      body: JSON.stringify({
        imageId: this.props.image.imageId,
        userId: this.props.loggedInAs,
        title: this.state.title,
        description: this.state.description,
      }),
      credentials: "same-origin",
      headers: new Headers({
        "content-type": "application/json"
      })
    })
    .then(r => r.json())
    .then(r => {
      this.props.setView("library");
      if (r.edits) {
        $(this.modalEl).modal('hide');
        this.props.setFocusImage(r.image);
      } else {
        console.log(r);
      }
    });
  }
  render() {
    let title = "";
    let description = "";
    let message = null;
    if (this.props.image) {
      if (this.props.image.sourceImage) {
        title = this.props.image.sourceImage.title;
        description = this.props.image.sourceImage.description;
        message = (
          <small className="text-muted my-0 mx-2">
            Note: Editing an original image will edit its styled images as well.
          </small>
        );
      } else {
        title = this.props.image.styledImage.sourceImage.title;
        description = this.props.image.styledImage.sourceImage.description;
        message = (
          <small className="text-muted my-0 mx-2">
            Note: Editing a styled image will edit the original as well.
          </small>
        );
      }
    }
    return (
      <div className="modal fade" id="edit-modal" ref={el => this.modalEl = el}
           role="dialog" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header py-2">
              <h5 className="modal-title" id="upload-modal-title">
                Edit image
              </h5>
              <CloseModalButton />
            </div>
            <form action="/edit" encType="multipart/form-data"
                  method="POST" onSubmit={e => this.submitForm(e)}>
              <div className="modal-body">
                <FileTitleFormField callback={this.setTitle}
                                    placeholder={title} />
                <FileDescriptionFormField callback={this.setDescription}
                                          placeholder={description} />
                {message}
              </div>
              <div className="modal-footer p-2">
                <EditSubmitFormButton />
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
                    <a onClick={e => this.props.setFocusUser(this.props.image.user)}
                       idt="image-modal-user">
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
                <CardButtonGroup image={this.props.image}
                                 isOwner={this.state.isOwner}
                                 isSource={this.state.isSource}
                                 loggedInAs={this.props.loggedInAs}
                                 setEditTarget={this.props.setEditTarget}
                                 setStyleTarget={this.props.setStyleTarget} />
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
      <a className="h1 mb-0 navbar-brand" href="#"
         onClick={e => this.props.setView("landing")}>
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
      libraryClass: "",
    };
  }
  setActive = () => {
    console.log(`fire setActive, this.props.view = ${this.props.view}`);
    this.setState({
      aboutClass: "",
      feedClass: "",
      libraryClass: "",
    });
    if (this.props.view === "feed") {
      this.setState({feedClass: "active"});
    } else if (this.props.view === "library") {
      this.setState({libraryClass: "active"});
    } else if (this.props.view === "about") {
      this.setState({aboutClass: "active"});
    }
  }
  componentWillMount() {
    this.setActive();
  }
  render() {
    let buttons = [];
    let links = null;
    if (this.props.loggedInAs !== null) {
      buttons.push(<UploadNavButton key="upload" />);
      buttons.push(<LogoutNavButton key="logout" />);
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
      buttons.push(<LoginNavButton key="login" />);
    }
    return (
      <nav className="bg-dark border-dark navbar navbar-dark navbar-expand-md
                      shadow sticky-top">
        <div className="container">
          <NavBrand setView={this.props.setView} />
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

// About
// ------------------------------------------------------------------------- //

class AboutView extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto">
          <div className="card px-4 py-3 my-5">
            <h3 className="about-header" id="about-deep-paint">About DeepPaint</h3>
            <p>DeepPaint is an image-based social network developed around the core feature of deep neural network powered style-transfer. The project was originally concieved of as a student project for Hackbright Academy by engineering student, Estrella Vinces.</p>
            <p>The front-end was developed initially using Flask to render Jinja templates. Mid-way through the project, development on the front-end was redirected towards React. Over the following two weeks, the project front-end was entirely re-written as a single-page React app. The back-end was developed with Flask-SQLAlchemy to connect to a PostgreSQL database server. Flask handles AJAX calls from React to connect with the database.</p>
            <p>The style-transfer feature is based off of the Tensorflow implementation by Logan Engstrom in <a href="https://github.com/lengstrom/fast-style-transfer/">fast-style-transfer</a>.</p>
          </div>
          <div className="card px-4 py-3 my-5">
            <h3 className="about-header" id="about-deep-paint">About the Author</h3>
            <h4>Estrella Vinces</h4>
            <p><strong>Portfolio</strong>: <a href="http://evinc.es">evinc.es</a></p>
            <p><strong>Bio</strong>: Prior to starting with Hackbright Academy, Estrella had a long, successful career leading and developing Support teams in tech. Most recently, she held the role of Systems Support Engineer at Samsara, an IoT start-up, where she fine-tuned her skills in diagnosing and debugging issues across hardware, cloud software, and mobile platforms. Preceding that, she worked with the prominent video game reseller, Humble Bundle, where she was the Project Manager for the company's ever-growing Support team. Looking forward, she is excited to apply the skills she has developed in her past career and focus them alongside her passion for Machine Learning towards a new role as a Full-Stack Software Engineer while continuing to foster her enthusiasm for learning.</p>
          </div>
        </div>
      </div>
    );
  }
}

// Feed / Home
// ------------------------------------------------------------------------- //

class FeedView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {cardList: []};
  }
  componentWillMount() {
    getImages({
      limit: 50,
      offset: null,
      orderByDate: "desc",
      userId: null,
      loggedInAs: this.props.loggedInAs,
    })
    .then(r => {
      if (r.count > 0) {
        let cardList = this.state.cardList.concat(
          r.images.map((image) =>
            <FeedCard image={image} key={image.imageId}
                      loggedInAs={this.props.loggedInAs}
                      setEditTarget={this.props.setEditTarget}
                      setFocusImage={this.props.setFocusImage}
                      setFocusUser={this.props.setFocusUser}
                      setStyleTarget={this.props.setStyleTarget} />
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

// Landing
// ------------------------------------------------------------------------- //

class LandingView extends React.Component {
  render() {
    return (
      <div className="carousel slide carousel-fade" data-ride="carousel" id="landing-carousel">
        <div className="carousel-inner" onClick={e => this.props.setView("feed")}>
          <div className="carousel-item active" id="slide-1">
            <div className="carousel-caption-background"></div>
            <div className="carousel-caption">
              <h5>DeepPaint</h5>
              <p>Style photos with the power of machine learning</p>
            </div>
          </div>
          <div className="carousel-item" id="slide-2">
            <div className="carousel-caption-background"></div>
            <div className="carousel-caption">
              <h5>Photo Sharing</h5>
              <p>Share your photos with the DeepPaint community</p>
            </div>
          </div>
          <div className="carousel-item" id="slide-3">
            <div className="carousel-caption-background"></div>
            <div className="carousel-caption">
              <h5>Get Started</h5>
              <p>Click anywhere to start styling your photos</p>
            </div>
          </div>
        </div>
        <a className="carousel-control-prev" data-slide="prev"
           href="#landing-carousel" role="button">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </a>
        <a className="carousel-control-next" data-slide="next"
           href="#landing-carousel" role="button">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </a>
        <nav className="navbar fixed-bottom navbar-dark bg-dark">
          <button className="btn btn-outline-light d-flex ml-auto"
                  onClick={e => this.props.setView("feed")}>
            Get Started
          </button>
        </nav>
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
      orderByDate: "desc",
      userId: (this.props.focusUser ?
               this.props.focusUser.userId :
               this.props.loggedInAs),
      loggedInAs: this.props.loggedInAs,
    })
    .then(r => {
      if (r.count > 0) {
        let cardList = this.state.cardList.concat(
          r.images.map((image) =>
            <LibraryCard image={image} key={image.imageId}
                         loggedInAs={this.props.loggedInAs}
                         setEditTarget={this.props.setEditTarget}
                         setFocusImage={this.props.setFocusImage}
                         setStyleTarget={this.props.setStyleTarget} />
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
      <div>
        <LibraryHeader loggedInAs={this.props.loggedInAs}
                       focusUser={this.props.focusUser} />
        <div className="row">
          {this.state.cardList}
        </div>
      </div>
    );
  }
}

// Signup
// ------------------------------------------------------------------------- //

class SignupView extends React.Component {
  render() {
    return (
      <SignupForm />
    );
  }
}

// Style
// ------------------------------------------------------------------------- //

class StyleView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: true,
      isLoading: false,
      selectedStyle: "",
      styleList: [],
    };
  }
  componentWillMount() {
    fetch("/ajax/get-styles.json", {
      body: JSON.stringify({}),
      credentials: "same-origin",
      headers: new Headers({
        "content-type": "application/json"
      }),
      method: "POST",
    })
    .then(r => r.json())
    .then(r => {
      if (r.count > 0) {
        this.setState({styleList: r.styles});
      } else {
        console.log(r);
      }
    });

  }
  setLoading = (isLoading) => {
    this.setState({
      isDisabled: true,
      isLoading: isLoading,
    });
  }
  setStyle = (styleId) => {
    this.setState({
      isDisabled: false,
      selectedStyle: styleId,
    });
  }
  render() {
    let formHeader = "Which style do you want to use?";
    let styleList = this.state.styleList.map((style) =>
      <StyleCard key={style.styleId} selectedStyle={this.state.selectedStyle}
                 setStyle={this.setStyle} style={style} />
    );
    let contents = (
      <div className="row">
          {styleList}
      </div>
    );
    if (this.state.isLoading) {
      contents = (
        <div className="col-12">
          <img className="d-flex mx-auto my-5" id="loading-gif"
               src="/static/image/fluid-loader.gif" />
        </div>
      );
      formHeader = "Painting...";
    }
    return (
      <div className="row">
        <h4 className="col-12 col-md-6">{formHeader}</h4>
        <StyleForm isDisabled={this.state.isDisabled}
                   selectedStyle={this.state.selectedStyle}
                   setFocusImage={this.props.setFocusImage}
                   setLoading={this.setLoading}
                   setView={this.props.setView}
                   styleTarget={this.props.styleTarget} />
        {contents}
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
      editTarget: null,
      focusImage: null,
      focusUser: null,
      loggedInAs: (this.props.loggedInAs !== "None" ?
                   this.props.loggedInAs : null),
      styleTarget: null,
      view: null,
    };
  }
  componentDidMount() {
    this.setView(this.props.view);
  }
  setEditTarget = (image) => {
    console.log("setting editTarget");
    console.log(image);
    this.setState({
      editTarget: image
    });

    // TODO: replace this with forwarded ref
    $("#edit-modal").modal("show");
  }
  setFocusImage = (image) => {
    console.log("setting focusImage");
    console.log(image);
    this.setState({
      focusImage: image
    });

    // TODO: replace this with forwarded ref
    $("#image-modal").modal("show");
  }
  setFocusUser = (user) => {
    console.log("setting focusUser");
    console.log(user);
    this.setState({
      focusUser: user
    });
    if (user.userId == this.props.loggedInAs) {
      this.setView("library");
    }
    this.setView("user");
  }
  setLoggedInAs = (user) => {
    // placeholder
  }
  setStyleTarget = (image) => {
    console.log("setting styleTarget");
    console.log(image);
    this.setState({
      styleTarget: image
    });
    this.setView("style");
  }
  setView = (view) => {
    if (view === "landing" && this.state.loggedInAs) {
      view = "feed";
    }
    console.log("setting view");
    console.log(view);
    this.setState({
      view: "none"
    });
    this.setState({
      view: view
    });

    if (view === "landing") {
      history.pushState({}, view, "/");
    } else {
      history.pushState({}, view, view);
    }

    // TODO: replace this with forwarded ref
    let feedEl = $("#nav-home");
    let libraryEl = $("#nav-library");

    if (view === "feed") {
      feedEl.addClass("active");
      libraryEl.removeClass("active");
    } else if (view === "library") {
      feedEl.removeClass("active");
      libraryEl.addClass("active");
      this.setState({focusUser: null});
    } else {
      feedEl.removeClass("active");
      libraryEl.removeClass("active");
    }
  }
  render() {
    let views = {
      none: "",
      about: (
        <AboutView loggedInAs={this.state.loggedInAs}
                   setFocusImage={this.setFocusImage}
                   setView={this.setView} />
      ),
      feed: (
        <FeedView loggedInAs={this.state.loggedInAs}
                  setEditTarget={this.setEditTarget}
                  setFocusImage={this.setFocusImage}
                  setFocusUser={this.setFocusUser}
                  setStyleTarget={this.setStyleTarget}
                  setView={this.setView} />
      ),
      landing: (
        <LandingView setView={this.setView} />
      ),
      library: (
        <LibraryView focusUser={this.state.focusUser}
                     loggedInAs={this.state.loggedInAs}
                     setEditTarget={this.setEditTarget}
                     setFocusImage={this.setFocusImage}
                     setFocusUser={this.setFocusUser}
                     setStyleTarget={this.setStyleTarget}
                     setView={this.setView} />
      ),
      // login: (
      //   <LoginView setLoggedInAs={this.setLoggedInAs}
      //              setView={this.setView} />
      // ),
      signup: (
        <SignupView setLoggedInAs={this.setLoggedInAs}
                    setView={this.setView} />
      ),
      style: (
        <StyleView loggedInAs={this.state.loggedInAs}
                   setFocusImage={this.setFocusImage}
                   setView={this.setView}
                   styleTarget={this.state.styleTarget} />
      ),
      user: (
        <LibraryView focusUser={this.state.focusUser}
                     loggedInAs={this.state.loggedInAs}
                     setEditTarget={this.setEditTarget}
                     setFocusImage={this.setFocusImage}
                     setFocusUser={this.setFocusUser}
                     setView={this.setView} />
      ),
    };
    let content = (
      <div>
        <Navbar loggedInAs={this.state.loggedInAs}
                setView={this.setView}
                view={this.state.view} />
        <div className="container mt-4" id="main-container">
          {views[this.state.view]}
        </div>
      </div>
    );
    switch (this.state.view) {
      case "landing":
        content = (
          <div className="w-100">
            {views[this.state.view]}
          </div>
        );
      case "about":
        $("body").removeClass("bg-rainbow");
        break;
      default:
        $("body").addClass("bg-rainbow");
    }
    return (
      <div className="w-100" id="app">
        {content}
        <ImageModal image={this.state.focusImage}
                    loggedInAs={this.state.loggedInAs}
                    setEditTarget={this.setEditTarget} />
        <EditModal image={this.state.editTarget}
                   loggedInAs={this.state.loggedInAs}
                   setFocusImage={this.setFocusImage}
                   setView={this.setView} />
        <LoginModal />
        <UploadModal />
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
    body: JSON.stringify(requestBody),
    credentials: "same-origin",
    headers: new Headers({
      "content-type": "application/json"
    }),
    method: "post",
  })
  .then(r => r.json())
  .then(r => {
    console.log(r);
    return r;
  });
}








