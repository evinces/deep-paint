"""Flask app for deeppaint"""

from flask import (Flask, render_template, redirect, request, session, flash,
                   jsonify)
from flask_debugtoolbar import DebugToolbarExtension
from model import (User, Image, SourceImage, StyledImage, TFModel, Style,
                   Comment, Like, Tag, ImageTag, db, connect_to_db)


app = Flask(__name__)
app.config['SECRET_KEY'] = 'tempkey'
connect_to_db(app)


# ========================================================================== #
# Home

@app.route('/')
def index():
    images = Image.query.filter(
        db.or_(Image.source_image != None,
               Image.styled_image != None)).order_by(
                   Image.created_at.desc()).limit(20).all()
    image_ids = [image.image_id for image in images]
    return render_template('feed.html', images=image_ids)


@app.route('/ajax/get-image-details.json', methods=['POST'])
def get_image_details():
    ajax = request.get_json()
    image_id = ajax['image_id']
    if image_id is None:
        return jsonify({'message': 'no image_id'})

    image = Image.query.get(image_id)
    result = {
        'image': {
            'image_id': image.image_id,
            'created_at': image.created_at.strftime("%b %d, %Y"),
            'path': image.get_path(),
            'user': {
                'user_id': image.user.user_id,
                'username': image.user.username
            }
        }
    }

    if image.source_image:
        result['image']['source_image'] = {
            'title': image.source_image.title,
            'description': image.source_image.description
        }

    if image.styled_image:
        result['image']['styled_image'] = {
            'artist': image.styled_image.style.artist,
            'title': image.styled_image.style.title,
            'path': image.styled_image.style.image.get_path(),
            'source_image': {
                'title': image.styled_image.source_image.title,
                'image_id': image.styled_image.source_image.image_id
            }
        }
    return jsonify(result)


@app.route('/ajax/toggle-like-state.json', methods=['POST'])
def toggle_like_state():
    ajax = request.get_json()
    user_id = session.get('user_id')
    if (user_id is None or 'user_id' not in ajax or
            'image_id' not in ajax):
        return jsonify({'message': 'permission denied'})

    user = User.query.get(user_id)
    image = Image.query.get(ajax['image_id'])
    Like.toggle(user, image)
    return jsonify({'message': 'success'})


@app.route('/ajax/get-like-state.json', methods=['POST'])
def get_like_state():
    ajax = request.get_json()
    user_id = session.get('user_id')
    if (user_id is None or 'user_id' not in ajax or
            'image_id' not in ajax or int(ajax['user_id']) != user_id):
        return jsonify({'message': 'permission denied'})

    user = User.query.get(user_id)
    image = Image.query.get(ajax['image_id'])
    like = Like.query.filter_by(user=user, image=image).one_or_none()
    if like:
        return jsonify({'isLiked': True})
    return jsonify({'isLiked': False})


# ========================================================================== #
# Signup


@app.route('/signup', methods=['GET'])
def show_signup_form():
    if 'user_id' in session:
        del session['user_id']
    return render_template('signup_form.html')


@app.route('/signup', methods=['POST'])
def process_signup():
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')

    if username is None:
        flash('Enter a username', 'warning')
        return redirect('/signup')
    if email is None:
        flash('Enter a username', 'warning')
        return redirect('/signup')
    if password is None:
        flash('Enter a username', 'warning')
        return redirect('/signup')

    if is_username_taken(username):
        flash('There is already a user with that username', 'warning')
        return redirect('/signup')
    if is_email_taken(email):
        flash('There is already a user with that email', 'warning')
        return redirect('/signup')

    user = User.create(username, email, password)
    session['user_id'] = user.user_id
    flash('Welcome {}!'.format(user), 'primary')
    return redirect('/')


def is_username_taken(username):
    usernames = db.session.query(User.username).order_by(User.username).all()
    return (username,) in usernames


def is_email_taken(email):
    emails = db.session.query(User.email).order_by(User.email).all()
    return (email,) in emails


# ========================================================================== #
# Login / Logout


@app.route('/login', methods=['GET'])
def show_login_form():
    if 'user_id' in session:
        del session['user_id']
    return render_template('login_form.html')


@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')

    user = User.query.filter_by(email=email).one_or_none()
    if user is None or user.check_password(password) is False:
        flash('Invalid email or password', 'warning')
        return redirect('/login')

    session['user_id'] = user.user_id
    flash('Login successful', 'info')
    return redirect('/library')


@app.route('/logout')
def logout():
    if 'user_id' in session:
        del session['user_id']

    flash('Logout successful', 'info')
    return redirect('/login')


@app.route('/loggedin_password_check.json', methods=['POST'])
def password_json():
    result = {}
    user_id = session.get('user_id')
    if user_id is None:
        result['message'] = 'Permission denied'
    else:
        json = request.get_json()
        password = json['password']
        if password is None:
            result['message'] = 'Missing password part'
        else:
            user = User.query.get(user_id)
            result['is_correct'] = user.check_password(password)
    return jsonify(result)


# ========================================================================== #
# User Profile


@app.route('/user/<username>', methods=['GET'])
def show_user_profile(username):
    user = User.query.filter_by(username=username).one_or_none()
    if user is None:
        flash('No user with that username was found', 'warning')
        return redirect('/')

    current_user_id = session.get('user_id')
    if current_user_id is not None and current_user_id == user.user_id:
        return render_template('user_preferences.html', user=user)

    return render_template('user_profile.html', user=user)


@app.route('/user/<username>', methods=["POST"])
def process_user_edit(username):
    current_user_id = session.get('user_id')
    if current_user_id is None:
        flash('Login required to view this page', 'warning')
        return redirect('/login')

    user = User.query.filter_by(username=username).one_or_none()
    if user is None or current_user_id != user.user_id:
        flash('You do not have permission to edit this user', 'warning')
        return redirect('/')

    new_username = request.form.get('username')
    new_email = request.form.get('email')
    new_password = request.form.get('new-password')
    old_password = request.form.get('old-password')

    if user.check_password(old_password) is False:
        flash('Invalid password', 'warning')
        return redirect('/user/{username}'.format(user.username))

    if (new_email != "" and new_email != user.email and
            is_email_taken(new_email)):
        flash('That email is already taken', 'warning')
        return redirect('/user/{username}'.format(user.username))

    if (new_username != "" and new_username != user.username and
            is_username_taken(new_username)):
        flash('That username is already taken', 'warning')
        return redirect('/user/{username}'.format(user.username))

    if new_email != "" and new_email != user.email:
        user.email = new_email

    if new_username != "" and new_username != user.username:
        user.username = new_username

    if new_password != "" and new_password != old_password:
        user.set_password(new_password)

    db.session.commit()
    return redirect('/user/{username}'.format(user.username))


# ========================================================================== #
# Library

@app.route('/library')
def show_library():
    user_id = session.get('user_id')
    if user_id is None:
        flash('Login to view your library', 'warning')
        return redirect('/login')

    user = User.query.get(int(user_id))
    images = Image.query.filter_by(
        user=user).order_by(
            Image.created_at.desc()).all()

    image_ids = [image.image_id for image in images]
    return render_template('library.html', images=image_ids, user=user)


# ========================================================================== #
# Upload

@app.route('/upload', methods=['GET'])
def upload_image_redirect():
    # TODO: create an isolated upload form
    return redirect('/')


@app.route('/upload', methods=['POST'])
def upload_image():
    user_id = session.get('user_id')
    if user_id is None:
        flash('Login to upload images', 'warning')
        return redirect('/login')
    user = User.query.get(int(user_id))

    title = request.form.get('title')
    description = request.form.get('description')

    if 'image' not in request.files:
        flash('No image part', 'danger')
        return redirect('/')

    image_file = request.files['image']
    if image_file.filename == '':
        flash('No selected image', 'danger')
        return redirect('/')

    if not Image.is_allowed_file(image_file.filename):
        flash('Disallowed file type.', 'danger')
        return redirect('/')

    source_image = SourceImage.create(image_file, user, title, description)
    flash('Image uploaded successfully', 'info')

    print '-----> /upload -> ', source_image
    return redirect('/')


# ========================================================================== #
# Style

@app.route('/style', methods=['GET'])
def style_form():
    user_id = session.get('user_id')
    if user_id is None:
        flash('Login to style images', 'warning')
        return redirect('/login')
    user = User.query.get(int(user_id))

    image_id = request.args.get('image_id')
    if image_id is None:
        print 'image_id is None'
        flash('Select an image to style', 'info')
        return redirect('/library')

    image = Image.query.get(int(image_id))
    if image is None:
        flash('Image not found', 'danger')
        return redirect('/library')

    source_image = image.source_image
    if source_image is None:
        flash('Styled images cannot be restyled, choose an unstyled image',
              'warning')
        return redirect('/library')

    if image.user_id != user.user_id:
        flash('You don\'t have permission to style that image', 'warning')
        return redirect('/library')

    styles = Style.query.all()

    return render_template('style_form.html', styles=styles,
                           source_image_id=source_image.source_image_id)


@app.route('/style', methods=['POST'])
def process_style():
    source_image_id = request.form.get('source_image_id')
    style_id = request.form.get('style_id')

    if source_image_id is None:
        flash('No image selected', 'danger')
        return redirect('/style')

    if style_id is None:
        flash('No style selected', 'danger')
        return redirect('/style')

    source_image = SourceImage.query.get(int(source_image_id))
    style = Style.query.get(int(style_id))

    styled_image = StyledImage.create(source_image, style)
    flash('Style applied successfully', 'info')

    print '-----> /style -> ', styled_image
    return redirect('/')


# ========================================================================== #
# Image Details


@app.route('/image.json')
def get_image_json():
    image_id = request.args.get('image_id')
    result = {}

    if image_id is None:
        result['message'] = 'No image_id in request'
        return result

    image = Image.query.get(image_id)
    if image is None:
        result['message'] = 'No image found with that image_id'
        return result

    if image.is_public is False and image.user_id != 1:
        result['message'] = 'Permission denied'
        return result

    if image.source_image:
        source = image.source_image
        style = None
    elif image.styled_image:
        source = image.styled_image.source_image
        style = image.styled_image.style
        style = {
            'title': style.title,
            'artist': style.artist
        }

    source = {
        'title': source.title,
        'description': source.description
    }

    result = {
        'image_id': image.image_id,
        'created_at': image.created_at,
        'path': image.get_path(),
        'source': source,
        'style': style
    }

    return jsonify(result)


# ========================================================================== #
# Main

if __name__ == '__main__':
    app.debug = True
    DebugToolbarExtension(app)
    app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
    app.run()
