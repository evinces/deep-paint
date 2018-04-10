"""Models and database functions for deep-paint"""

from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()


# ========================================================================== #
# Users

class User(db.Model):
    """User model"""

    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                        nullable=False)
    username = db.Column(db.String(32), nullable=False, unique=True)
    email = db.Column(db.String(320), nullable=False, unique=True)
    hashed_password = db.Column(db.String(93), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    is_superuser = db.Column(db.Boolean, default=False, nullable=False)
    pref_is_public = db.Column(db.Boolean, default=True, nullable=False)

    pref_tf_model_id = db.Column(db.Integer,
                                 db.ForeignKey('tf_models.tf_model_id'))
    pref_tf_model = db.relationship('TFModel', backref='users')

    pref_style_id = db.Column(db.Integer, db.ForeignKey('styles.style_id'))
    pref_style = db.relationship('Style', backref='users')

    def __repr__(self):
        return '<User user_id={id} username={username}>'.format(
            id=self.user_id, username=self.username)

    def set_password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)

    @classmethod
    def is_valid_email(email):
        """Check email for proper lengths and that @ and . symbols exist"""
        if len(email) > 320:
            return False

        at_index = email.find('@')
        if at_index == -1:
            return False

        local = email[:at_index]
        if len(local) > 64:
            return False

        domain = email[at_index+1:]
        if len(domain) > 255:
            return False

        dot_index = domain.find('.')
        if dot_index == 0 or dot_index == -1:
            return False

        return True


# ========================================================================== #
# Images

class Image(db.Model):
    """Base image model"""

    __tablename__ = 'images'

    image_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                         nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    is_public = db.Column(db.Boolean, default=True, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    user = db.relationship('User', backref='images')

    def __repr__(self):
        return '<Image image_id={id} user_id={user_id}>'.format(
            id=self.image_id, user_id=self.user_id)

    def get_path(self):
        """Return the file path for image instance"""
        if self.user_id:
            return 'image/{user_id}/{id}.png'.format(
                user_id=self.user_id, id=self.image_id)
        else:
            return 'image/misc/{id}.png'.format(id=self.image_id)

    def get_thumbnail_path(self):
        """Return the thumbnail file path for image instance"""
        if self.user_id:
            return 'image/{user_id}/{id}_thumb.png'.format(
                user_id=self.user_id, id=self.image_id)
        else:
            return 'image/misc/{id}_thumb.png'.format(id=self.image_id)


class SourceImage(db.Model):
    """Source Image model"""

    __tablename__ = 'source_images'

    source_image_id = db.Column(db.Integer, primary_key=True,
                                autoincrement=True,
                                nullable=False)
    title = db.Column(db.String(128), default='', nullable=False)
    description = db.Column(db.String(700), default='', nullable=False)

    image_id = db.Column(db.Integer, db.ForeignKey('images.image_id'),
                         nullable=False)
    image = db.relationship('Image', backref='source_images')

    def __repr__(self):
        return '<SourceImage source_image_id={id} image_id={image_id}>'.format(
            id=self.source_image_id, image_id=self.image_id)


class StyledImage(db.Model):
    """Styled Image model"""

    __tablename__ = 'styled_images'

    styled_image_id = db.Column(db.Integer, primary_key=True,
                                autoincrement=True,
                                nullable=False)

    image_id = db.Column(db.Integer, db.ForeignKey('images.image_id'),
                         nullable=False)
    image = db.relationship('Image', backref='styled_images')

    source_image_id = db.Column(db.Integer,
                                db.ForeignKey('source_images.source_image_id'),
                                nullable=False)
    source_image = db.relationship('SourceImage', backref='styled_images')

    style_id = db.Column(db.Integer, db.ForeignKey('styles.style_id'),
                         nullable=False)
    style = db.relationship('Style', backref='styled_images')

    def __repr__(self):
        return '<StyledImage styled_image_id={id} image_id={image_id}>'.format(
            id=self.styled_image_id, image_id=self.image_id)


# ========================================================================== #
# TFModels & Styles

class TFModel(db.Model):
    """Tensorflow model"""

    __tablename__ = 'tf_models'

    tf_model_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                            nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    title = db.Column(db.String(128), default='', nullable=False)
    description = db.Column(db.String(700), default='', nullable=False)

    def __repr__(self):
        return '<TFModel tf_model_id={id} title={title}>'.format(
            id=self.tf_model_id, title=self.title)

    def get_path(self):
        return 'tf_models/{id}.mat'.format(id=self.tf_model_id)


class Style(db.Model):
    """Style model"""

    __tablename__ = 'styles'

    style_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                         nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    title = db.Column(db.String(128), default='', nullable=False)
    artist = db.Column(db.String(128), default='', nullable=False)
    description = db.Column(db.String(700), default='', nullable=False)

    tf_model_id = db.Column(db.Integer, db.ForeignKey('tf_models.tf_model_id'),
                            nullable=False)
    tf_model = db.relationship('TFModel', backref='styles')

    image_id = db.Column(db.Integer, db.ForeignKey('images.image_id'),
                         nullable=False)
    image = db.relationship('Image', backref='styles')

    def __repr__(self):
        return '<Style style_id={id} title={title}>'.format(
            id=self.style_id, title=self.title)

    def get_path(self):
        return 'styles/{id}.ckpt'.format(id=self.style_id)


# ========================================================================== #
# Likes & Comments

class Comment(db.Model):
    """Comment model"""

    __tablename__ = 'comments'

    comment_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                           nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    body = db.Column(db.String(256), nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'),
                        nullable=False)
    user = db.relationship('User', backref='comments')

    image_id = db.Column(db.Integer, db.ForeignKey('images.image_id'),
                         nullable=False)
    image = db.relationship('Image', backref='comments')

    def __repr__(self):
        return '<Comment comment_id={id} body={body}>'.format(
            id=self.comment_id, body=self.body)

    def __str__(self):
        return self.body


class Like(db.Model):
    """Like model"""

    __tablename__ = 'likes'

    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'),
                        primary_key=True, nullable=False)
    user = db.relationship('User', backref='likes')

    image_id = db.Column(db.Integer, db.ForeignKey('images.image_id'),
                         primary_key=True, nullable=False)
    images = db.relationship('Image', backref='likes')

    def __repr__(self):
        return '<Like user_id={user} image_id={image}>'.format(
            user=self.user_id, image=self.image_id)


# ========================================================================== #
# Tags

class Tag(db.Model):
    """Tag model"""

    __tablename__ = 'tags'

    tag_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                       nullable=False)
    name = db.Column(db.String(32), nullable=False)

    images = db.relationship('Image', secondary='image_tags', backref='tags')

    def __repr__(self):
        return '<Tag tag_id={id} name={name}>'.format(
            id=self.tag_id, name=self.name)

    def __str__(self):
        return self.name


class ImageTag(db.Model):
    """ImageTag association table model"""

    __tablename__ = 'image_tags'

    tag_id = db.Column(db.Integer, db.ForeignKey('tags.tag_id'),
                       primary_key=True)
    image_id = db.Column(db.Integer, db.ForeignKey('images.image_id'),
                         primary_key=True)


# ========================================================================== #
# Helper functions

def seed_data():
    tf = TFModel(title='fast-style-transfer',
                 description='Created by Logan Engstrom')
    db.session.add(tf)
    db.session.commit()

    test_user = User(username='TestUser', email='estrella+dptest@evinc.es',
                     hashed_password=generate_password_hash(
                        'faketestpassword'))
    db.session.add(test_user)
    db.session.commit()

    wave_image = Image()

    db.session.add(wave_image)
    db.session.commit()

    wave_desc = "\
The image depicts an enormous wave threatening boats off the coast of the \
town of Kanagawa (the present-day city of Yokohama, Kanagawa Prefecture). \
While sometimes assumed to be a tsunami, the wave is more likely to be a \
large rogue wave. As in many of the prints in the series, it depicts the \
area around Mount Fuji under particular conditions, and the mountain itself \
appears in the background."

    wave_style = Style(title='The Great Wave off Kanagawa',
                       artist='Katsushika Hokusai',
                       description=wave_desc,
                       tf_model_id=tf.tf_model_id,
                       image_id=wave_image.image_id)

    db.session.add(wave_style)
    db.session.commit()


if __name__ == "__main__":
    from flask import Flask
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres:///deep-paint'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ECHO'] = True
    db.app = app
    db.init_app(app)
    db.create_all()

    # seed_data()
