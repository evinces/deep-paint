"""Flask app for deeppaint"""

from flask import Flask, render_template, redirect, request, session, flash
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
    source_images = User.query.get(1).source_images
    styles = Style.query.all()
    return render_template('style_form.html',
                           source_images=source_images,
                           styles=styles)


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
    app.run(debug=True)
