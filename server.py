"""Flask app for deeppaint"""

from flask import Flask, render_template, redirect, request, session, flash
from flask_debugtoolbar import DebugToolbarExtension
from model import (User, Image, SourceImage, StyledImage, TFModel, Style,
                   Comment, Like, Tag, ImageTag, db, connect_to_db)


app = Flask(__name__)
app.config['SECRET_KEY'] = 'tempkey'
connect_to_db(app)


@app.route('/')
def index():
    # index does not exist yet
    return redirect('/library')


@app.route('/library')
def show_library():
    images = Image.query.filter_by(user_id=1).order_by(Image.created_at).all()
    return render_template('library.html', images=images[::-1])


@app.route('/upload', methods=['GET'])
def upload_image_redirect():
    return redirect('/')


@app.route('/upload', methods=['POST'])
def upload_image():
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

    source_image = SourceImage.create(image_file, 1, title, description)
    flash('Image uploaded successfully', 'info')
    return redirect('/')


@app.route('/style', methods=['GET'])
def style_form():
    # print '---------->  enter style get route'
    image_id = request.args.get('image_id')
    # print '---------->  image_id:', image_id
    if image_id is None:
        print 'image_id is None'
        flash('Select an image to style', 'message')
        return redirect('/library')

    image = Image.query.get(int(image_id))
    # print '---------->  ', image
    if image is None:
        # print '---------->  image is None'
        flash('Image not found', 'danger')
        return redirect('/library')

    source_image = image.source_image
    # print '---------->  ', source_image
    if source_image is None:
        # print '---------->  source_image is None'
        flash('Styled images cannot be restyled, choose an unstyled image',
              'warning')
        return redirect('/library')

    # TODO: compare image owner to user in session
    if image.user_id != 1:
        # print '---------->  image.user_id != 1'
        flash('You don\'t have permission to style that image', 'warning')
        return redirect('/library')

    styles = Style.query.all()
    # print '---------->  ', styles

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

    styled_image = StyledImage.create(source_image_id, style_id)
    flash('Style applied successfully', 'info')
    return redirect('/')


if __name__ == '__main__':
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ECHO'] = True
    app.debug = True
    DebugToolbarExtension(app)
    app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
    app.run()
