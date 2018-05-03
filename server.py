"""Flask app for deeppaint"""

from flask import (Flask, render_template, redirect, request, session, flash,
                   jsonify)
from model import (User, Image, SourceImage, StyledImage, Style, Like, db,
                   connect_to_db)
from flask_debugtoolbar import DebugToolbarExtension
from pprint import pprint


app = Flask(__name__)
app.config['SECRET_KEY'] = 'tempkey'
connect_to_db(app)


# ========================================================================== #
# Home / View routes
# ========================================================================== #


@app.route('/')
def index():
    """Homepage / Feed"""

    return render_template('main.html', view="feed")


@app.route('/<view>', methods=['GET'])
def show_view(view):
    """Generic view"""

    if view not in ['feed', 'library', 'user']:
        view = 'feed'

    return render_template('main.html', view=view)


# ========================================================================== #
# Form Post Endpoints
# ========================================================================== #

# Signup
# -------------------------------------------------------------------------- #


@app.route('/signup', methods=['POST'])
def process_signup():
    """Process user signup from form"""

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
    session['userId'] = user.user_id
    flash('Welcome {}!'.format(user), 'primary')
    return redirect('/')


def is_username_taken(username):
    """Check if username is taken"""

    usernames = db.session.query(User.username).order_by(User.username).all()
    return (username,) in usernames


def is_email_taken(email):
    """Check if email is taken"""

    emails = db.session.query(User.email).order_by(User.email).all()
    return (email,) in emails


# Login / Logout
# -------------------------------------------------------------------------- #


@app.route('/login', methods=['POST'])
def login():
    """Process user login from form"""

    email = request.form.get('email')
    password = request.form.get('password')

    user = User.query.filter_by(email=email).one_or_none()
    if user is None or user.check_password(password) is False:
        flash('Invalid email or password', 'warning')
        return redirect('/login')

    session['userId'] = user.user_id
    flash('Login successful', 'info')
    return redirect('/library')


@app.route('/logout')
def logout():
    """Process user logout"""

    if 'userId' in session:
        del session['userId']

    flash('Logout successful', 'info')
    return redirect('/login')


# Upload
# -------------------------------------------------------------------------- #


@app.route('/upload', methods=['POST'])
def upload_image():
    """Process image upload from form"""

    user_id = session.get('userId')
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


# Style
# -------------------------------------------------------------------------- #


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
# AJAX Endpoints
# ========================================================================== #


# User interactions
# -------------------------------------------------------------------------- #


@app.route('/ajax/get-user.json', methods=['POST'])
def get_user_ajax():
    """Get user details"""

    ajax = request.get_json()
    user_id = ajax['userId']
    if user_id is None:
        return jsonify({'message': 'no userId'})

    user = User.query.get(int(user_id))
    result = {
        'user': {
            'userId': user.user_id,
            'username': user.username,
            'createdAt': user.created_at.strftime("%b %d, %Y")
        }
    }

    if user_id == session.get('userId'):
        result['user']['email'] = user.email
        result['user']['is_public'] = user.pref_is_public

    return jsonify(result)


# Image interactions
# -------------------------------------------------------------------------- #


@app.route('/ajax/get-images.json', methods=['POST'])
def get_images_ajax():
    """Used for React views"""

    ajax = request.get_json()
    limit = ajax['limit']
    offset = ajax['offset']
    order_by_date = ajax['orderByDate']
    user_id = ajax['userId']

    images = Image.query.filter(
        db.or_(Image.source_image != None,
               Image.styled_image != None))

    if user_id:
        images = images.filter(Image.user_id == user_id)
    if order_by_date:
        if order_by_date == "desc":
            images = images.order_by(Image.created_at.desc())
        else:
            images = images.order_by(Image.created_at)
    if limit:
        images = images.limit(int(limit))
    if offset:
        images = images.offset(int(offset))

    images = images.all()

    result = {
        "count": 0,
        "images": []
    }

    for image in images:
        result["count"] += 1
        result["images"].append({
            "imageId": image.image_id,
            "createdAt": image.created_at.strftime("%b %d, %Y"),
            "path": image.get_path(),
            "user": {
                "userId": image.user.user_id,
                "username": image.user.username,
                "createdAt": image.user.created_at.strftime("%b %d, %Y")
            }
        })
        if image.source_image:
            result["images"][-1]["sourceImage"] = {
                "title": image.source_image.title,
                "description": image.source_image.description
            }
        if image.styled_image:
            result["images"][-1]["styledImage"] = {
                "artist": image.styled_image.style.artist,
                "title": image.styled_image.style.title,
                "path": image.styled_image.style.image.get_path(),
                "sourceImage": {
                    "title": image.styled_image.source_image.title,
                    "imageId": image.styled_image.source_image.image_id
                }
            }

    pprint(result)
    return jsonify(result)


@app.route('/ajax/get-image-details.json', methods=['POST'])
def get_image_details_ajax():
    """Image details ajax"""

    ajax = request.get_json()
    image_id = ajax['imageId']
    if image_id is None:
        return jsonify({'message': 'no imageId'})

    image = Image.query.get(image_id)
    result = {
        'image': {
            'imageId': image.image_id,
            'createdAt': image.created_at.strftime("%b %d, %Y"),
            'path': image.get_path(),
            'user': {
                'userId': image.user.user_id,
                'username': image.user.username
            }
        }
    }

    if image.source_image:
        result['image']['sourceImage'] = {
            'title': image.source_image.title,
            'description': image.source_image.description
        }

    if image.styled_image:
        result['image']['styledImage'] = {
            'artist': image.styled_image.style.artist,
            'title': image.styled_image.style.title,
            'path': image.styled_image.style.image.get_path(),
            'sourceImage': {
                'title': image.styled_image.source_image.title,
                'imageId': image.styled_image.source_image.image_id
            }
        }
    return jsonify(result)


# Like interactions
# -------------------------------------------------------------------------- #


@app.route('/ajax/toggle-like-state.json', methods=['POST'])
def toggle_like_state_ajax():
    """Toggle the Like state on an image via ajax"""

    ajax = request.get_json()
    user_id = session.get('userId')
    if user_id is None or 'imageId' not in ajax:
        return jsonify({'message': 'permission denied'})

    user = User.query.get(user_id)
    image = Image.query.get(ajax['imageId'])
    like = Like.toggle(user, image)
    like_count = len(Like.query.filter_by(image=image).all())
    result = {
        'like': {
            'isLiked': like is not None,
            'likeCount': like_count
        }
    }
    return jsonify(result)


@app.route('/ajax/get-like-state.json', methods=['POST'])
def get_like_state_ajax():
    """Get the Like state for an image for the logged in user"""

    ajax = request.get_json()
    user_id = session.get('userId')
    if user_id is None or 'imageId' not in ajax:
        return jsonify({'message': 'permission denied'})

    user = User.query.get(user_id)
    image = Image.query.get(ajax['imageId'])
    like = Like.query.filter_by(user=user, image=image).one_or_none()
    like_count = len(Like.query.filter_by(image=image).all())
    result = {
        'like': {
            'isLiked': like is not None,
            'likeCount': like_count
        }
    }
    return jsonify(result)


# ========================================================================== #
# Main
# ========================================================================== #

if __name__ == '__main__':
    app.debug = True
    DebugToolbarExtension(app)
    app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
    app.run()
