"""Flask app for deeppaint"""

from flask import Flask, render_template, redirect, request, session, flash
from model import (User, Image, SourceImage, StyledImage, TFModel, Style,
                   Comment, Like, Tag, ImageTag, db, connect_to_db)


app = Flask(__name__)
app.config['SECRET_KEY'] = 'tempkey'
connect_to_db(app)


TEST_USER = User.query.get(1)


@app.route('/')
def index():
    return render_template('index.html', user=User.query.get(1))


@app.route('/upload', methods=['GET'])
def image_upload_form():
    return render_template('image_upload_form.html')


@app.route('/upload', methods=['POST'])
def image_file():
    if 'image' not in request.files:
        flash('No image part')
        return redirect('/')

    image_file = request.files['image']
    if image_file.filename == '':
        flash('No selected image')
        return redirect('/')

    if not Image.is_allowed_file(image_file.filename):
        flash('Disallowed file type.')
        return redirect('/')

    source_image = SourceImage.create(image_file, TEST_USER.user_id)
    flash('Image uploaded successfully')
    return redirect('/')


@app.route('/style', methods=['GET'])
def style_form():
    return render_template('style_form.html',
                           source_images=TEST_USER.source_images,
                           styles=Style.query.all())


@app.route('/style', methods=['POST'])
def process_style():
    source_image_id = request.form.get('source_image_id')
    style_id = request.form.get('style_id')

    if source_image_id is None:
        flash('No image selected')
        return redirect('/style')

    if style_id is None:
        flash('No style selected')
        return redirect('/style')

    styled_image = StyledImage.create(source_image_id, style_id)
    flash('Image uploaded successfully')
    return redirect('/')


if __name__ == '__main__':
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.run(debug=True)
