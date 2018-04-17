"""Flask app for deeppaint"""

from flask import (Flask, render_template, redirect, request, session, flash,
                   jsonify)
from flask_debugtoolbar import DebugToolbarExtension
from model import (User, Image, SourceImage, StyledImage, TFModel, Style,
                   Comment, Like, Tag, ImageTag, db, connect_to_db)
from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound


app = Flask(__name__)
app.config['SECRET_KEY'] = 'tempkey'
connect_to_db(app)


# ========================================================================== #
# Home

@app.route('/')
def index():
    # index does not exist yet
    return redirect('/library')


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

    print '-----> /login'
    return redirect('/library')


@app.route('/logout')
def logout():
    if 'user_id' in session:
        del session['user_id']

    flash('Logout successful', 'info')

    print '-----> /logout'
    return redirect('/login')


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
        user_id=user.user_id).order_by(
            Image.created_at).all()

    return render_template('library.html', images=images[::-1], user=user)


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
