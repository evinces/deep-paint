"""Flask app for deeppaint"""

from flask import Flask, render_template, redirect, request, session
from model import (User, Image, SourceImage, StyledImage, TFModel, Style,
                   Comment, Like, Tag, ImageTag, db, connect_to_db)

import sys
sys.path.insert(0, 'fast-style-transfer')
import evaluate


app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
connect_to_db(app)


@app.route('/' methods=['GET'])
def image_upload_form():
    return render_template('image_upload_form.html')


@app.route('/' methods=['POST'])
def image_upload():
    if 'image' not in request.files:
        flash('No image part')
        return redirect(request.url)

    image_upload = request.files['image']
    if image_upload.filename == '':
        flash('No selected image')
        return redirect(request.url)

    if not allowed_image(image_upload.filename):
        flash('No selected image')
        return redirect(request.url)

    source_image = SourceImage(file=image_upload, user_id=1)
    db.session.commit()
    flash('Image uploaded successfully')
    return redirect('/')
