"""Models and database functions for deep-paint"""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from os import remove, path, getcwd
from PIL import Image as PILImage
from time import time
from werkzeug.security import generate_password_hash, check_password_hash

import sys
sys.path.insert(0, 'fast-style-transfer')
from evaluate import ffwd_to_img

db = SQLAlchemy()

FILESTORE_PATH = '/static/'
ALLOWED_EXTENSIONS = set(['gif', 'jpg', 'jpeg', 'png', 'tif', 'tga'])
BASEPATH = getcwd()


# ========================================================================== #
# Mixins

class TimestampMixin(object):
    created_at = db.Column(db.DateTime, nullable=False,
                           default=datetime.utcnow)


# ========================================================================== #
# Users

class User(TimestampMixin, db.Model):
    """User model

    Required fields:
        username          STRING(32) UNIQUE
        email             STRING(320) UNIQUE
        hashed_password   STRING(93)

    Optional fields:
        is_superuser      BOOLEAN
        pref_is_public    BOOLEAN
        pref_tf_model_id  INT REFERENCES tf_models
        pref_style_id     INT REFERENCES styles

    Additional attributes:
        user_id           SERIAL PRIMARY KEY
        created_at        DATETIME DEFAULT datetime.utcnow
        updated_at        DATETIME ONUPDATE datatime.utcnow
        styled_images     List of StyledImage objects
        source_images     List of SourceImage objects
        images            List of Image objects
        comments          List of Comment objects
        likes             List of Like objects
        pref_tf_model     TFModel object
        pref_style        Style object
    """

    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                        nullable=False)
    username = db.Column(db.String(32), nullable=False, unique=True)
    email = db.Column(db.String(320), nullable=False, unique=True)
    hashed_password = db.Column(db.String(93), nullable=False)
    is_superuser = db.Column(db.Boolean, default=False, nullable=False)
    pref_is_public = db.Column(db.Boolean, default=True, nullable=False)
    pref_tf_model_id = db.Column(db.Integer,
                                 db.ForeignKey('tf_models.tf_model_id'))
    pref_style_id = db.Column(db.Integer, db.ForeignKey('styles.style_id'))

    pref_tf_model = db.relationship('TFModel', backref='users')
    pref_style = db.relationship('Style', backref='users')

    source_images = db.relationship('SourceImage', secondary='images')
    styled_images = db.relationship('StyledImage', secondary='images')

    def __repr__(self):
        return '<User user_id={id} username="{username}">'.format(
            id=self.user_id, username=self.username)

    def __str__(self):
        return '@{username}'.format(username=self.username)

    def set_password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)

    @classmethod
    def create(cls, username, email, password, is_superuser=False):
        hashed_password = generate_password_hash(password)
        user = cls(username=username, email=email,
                   hashed_password=hashed_password, is_superuser=is_superuser)
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
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

        domain = email[at_index + 1:]
        if len(domain) > 255:
            return False

        dot_index = domain.find('.')
        if dot_index == 0 or dot_index == -1:
            return False

        return True


# ========================================================================== #
# Images

class Image(TimestampMixin, db.Model):
    """Base image model

    Optional fields:
        is_public       BOOLEAN
        user_id         INT REFERENCES users

    Additional attributes:
        image_id        SERIAL PRIMARY KEY
        created_at      DATETIME DEFAULT datetime.utcnow
        updated_at      DATETIME ONUPDATE datatime.utcnow
        user            User object

    Filename:
        {image_id}.{source_file_extension}

    File path for associated image:
        if user_id:
            {root_path}/image/{user_id}/{filename}
        else:
            {root_path}/image/misc/{filename}
    """

    __tablename__ = 'images'
    _path = FILESTORE_PATH + 'image/'

    image_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                         nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    file_extension = db.Column(db.String(4), nullable=False)
    is_public = db.Column(db.Boolean, default=True, nullable=False)

    user = db.relationship('User', backref='images')

    source_image = db.relationship('SourceImage', lazy='joined', uselist=False)
    styled_image = db.relationship('StyledImage', lazy='joined', uselist=False)

    def __repr__(self):
        return '<Image image_id={id} path="{path}">'.format(
            id=self.image_id, path=self.get_path())

    def get_filename(self):
        return '{id}.{ext}'.format(id=self.image_id, ext=self.file_extension)

    def get_path(self, modifier=None):
        """Return the file path for image instance"""
        filename = self.get_filename()
        if modifier:
            filename = modifier + filename
        return self._path + filename

    @classmethod
    def create(cls, image_file, user=None, is_public=True, resize=True):
        """Add an image to the database and save the image file"""
        image = cls(file_extension=cls.get_file_extension(image_file.filename))
        if user:
            image.user = user
            image.is_public = user.pref_is_public

        db.session.add(image)
        db.session.commit()

        if path.isfile(BASEPATH + image.get_path()):
            remove(BASEPATH + image.get_path())

        image_file.save(BASEPATH + image.get_path())
        if resize:
            cls.resize_image(BASEPATH + image.get_path())

        return image

    @staticmethod
    def is_allowed_file(filename):
        """Verify the file is an image"""
        return ('.' in filename and
                Image.get_file_extension(filename) in ALLOWED_EXTENSIONS)

    @staticmethod
    def get_file_extension(filename):
        return filename.rsplit('.', 1)[1].lower()

    @staticmethod
    def resize_image(image_path, size=(1024, 1024)):
        image = PILImage.open(image_path)
        image.thumbnail(size, PILImage.LANCZOS)
        image.save(image_path)
        image.close()


class SourceImage(db.Model):
    """Source Image model

    Required fields:
        image_id         INT FOREGIN KEY images

    Optional fields:
        title            STRING(128)
        description      STRING(700)

    Additional attributes:
        source_image_id  SERIAL PRIMARY KEY
        styled_images    List of StyledImage objects
        image            Image object
        user             User object
    """

    __tablename__ = 'source_images'

    source_image_id = db.Column(db.Integer, primary_key=True,
                                autoincrement=True,
                                nullable=False)
    title = db.Column(db.String(128), default='', nullable=False)
    description = db.Column(db.String(700), default='', nullable=False)
    image_id = db.Column(db.Integer, db.ForeignKey('images.image_id'),
                         nullable=False)

    image = db.relationship('Image', lazy='joined', uselist=False)

    def __repr__(self):
        return '<SourceImage source_image_id={id} path="{path}">'.format(
            id=self.source_image_id, path=self.get_path())

    def get_path(self):
        return self.image.get_path()

    @classmethod
    def create(cls, image_file, user, title='', description=''):
        image = Image.create(image_file, user)
        source_image = cls(image_id=image.image_id, title=title,
                           description=description)
        db.session.add(source_image)
        db.session.commit()
        return source_image


class StyledImage(db.Model):
    """Styled Image model

    Required fields:
        image_id         INT REFERENCES images
        source_image_id  INT REFERENCES source_images
        style_id         INT REFERENCES styles

    Additional attributes:
        image            Image object
        source_image     SourceImage object
        style            Style object
        user             User object
    """

    __tablename__ = 'styled_images'

    styled_image_id = db.Column(db.Integer, primary_key=True,
                                autoincrement=True,
                                nullable=False)
    image_id = db.Column(db.Integer, db.ForeignKey('images.image_id'),
                         nullable=False)
    source_image_id = db.Column(db.Integer,
                                db.ForeignKey('source_images.source_image_id'),
                                nullable=False)
    style_id = db.Column(db.Integer, db.ForeignKey('styles.style_id'),
                         nullable=False)

    image = db.relationship('Image', lazy='joined', uselist=False)

    source_image = db.relationship('SourceImage', backref='styled_images')
    style = db.relationship('Style', backref='styled_images')

    def __repr__(self):
        return '<StyledImage styled_image_id={id} path="{path}">'.format(
            id=self.styled_image_id, path=self.get_path())

    def get_path(self):
        return self.image.get_path()

    @classmethod
    def create(cls, source_image, style, testing=False):
        user = source_image.image.user

        image = Image(user=user, is_public=user.pref_is_public,
                      file_extension=source_image.image.file_extension)
        db.session.add(image)
        db.session.commit()

        if path.isfile(image.get_path()):
            remove(image.get_path())

        if not testing:
            # apply tensorflow style
            start_time = time()
            ffwd_to_img(source_image.get_path(), image.get_path(),
                        style.get_path())
            end_time = time()
            print '-----> evaluation timing: ', (end_time - start_time)

        styled_image = cls(image=image, source_image=source_image, style=style)
        db.session.add(styled_image)
        db.session.commit()

        return styled_image


# ========================================================================== #
# TFModels & Styles

class TFModel(db.Model):
    """Tensorflow model

    Base tensorflow model from which Styles are derived

    Optional fields:
        title        STRING(128)
        description  STRING(700)

    Additional attributes:
        styles       List of Style objects
        users        List of User objects

    Filename:
        {tf_model_id}.mat

    Filepath:
        {root_path}/tf_model/{filename}
    """

    __tablename__ = 'tf_models'
    _path = FILESTORE_PATH + 'tf_model/'

    tf_model_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                            nullable=False)
    title = db.Column(db.String(128), default='', nullable=False, unique=True)
    description = db.Column(db.String(700), default='', nullable=False)

    def __repr__(self):
        return '<TFModel tf_model_id={id} title="{title}">'.format(
            id=self.tf_model_id, title=self.title)

    @classmethod
    def create(cls, title='', description=''):
        tf_model = cls(title=title, description=description)
        db.session.add(tf_model)
        db.session.commit()
        return tf_model


class Style(db.Model):
    """Style model

    Reference to tensorfolw checkpoint used for image styling

    Required fields:
        tf_model_id    INT REFERENCES tf_models
        image_id       INT REFERENCES images

    Optional fields:
        title          STRING(128)
        artist         STRING(128)
        description    STRING(700)

    Additional attributes:
        style_id       SERIAL PRIMARY KEY
        tf_model       TFModel object
        style          Style object
        image          Image object
        styled_images  StyledImage object
        users          List of User objects

    Filename:
        {style_id}.ckpt

    Filepath:
        {root_path}/style/{filename}
    """

    __tablename__ = 'styles'
    _path = FILESTORE_PATH + 'style/'

    style_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                         nullable=False)
    title = db.Column(db.String(128), default='', nullable=False)
    artist = db.Column(db.String(128), default='', nullable=False)
    description = db.Column(db.String(700), default='', nullable=False)
    tf_model_id = db.Column(db.Integer, db.ForeignKey('tf_models.tf_model_id'),
                            nullable=False)
    image_id = db.Column(db.Integer, db.ForeignKey('images.image_id'),
                         nullable=False)

    tf_model = db.relationship('TFModel', backref='styles')
    image = db.relationship('Image', backref='styles')

    def __repr__(self):
        return '<Style style_id={id} title="{title}">'.format(
            id=self.style_id, title=self.title)

    def get_path(self):
        return self._path + '{id}.ckpt'.format(id=self.style_id)

    @classmethod
    def create(cls, style_file, image_file, tf_model, title='', artist='',
               description=''):
        image = Image.create(image_file)
        style = cls(tf_model=tf_model, image=image, title=title, artist=artist,
                    description=description)
        db.session.add(style)
        db.session.commit()

        if path.isfile(BASEPATH + style.get_path()):
            remove(BASEPATH + style.get_path())
        style_file.save(BASEPATH + style.get_path())

        return style


# ========================================================================== #
# Likes & Comments

class Comment(TimestampMixin, db.Model):
    """Comment model

    User comments on an image

    Tablename:
        comments

    Required fields:
        body        STRING(256)
        user_id     INT REFERENCES users
        image_id    INT REFERENCES images

    Additional attributes:
        comment_id  SERIAL PRIMARY KEY
        created_at  DATETIME DEFAULT datetime.utcnow
        updated_at  DATETIME ONUPDATE datatime.utcnow
        user        User object
        image       Image object
    """

    __tablename__ = 'comments'

    comment_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                           nullable=False)
    body = db.Column(db.String(256), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'),
                        nullable=False)
    image_id = db.Column(db.Integer, db.ForeignKey('images.image_id'),
                         nullable=False)

    user = db.relationship('User', backref='comments')
    image = db.relationship('Image', backref='comments')

    def __repr__(self):
        return '<Comment comment_id={id} body="{body}">'.format(
            id=self.comment_id, body=self.body)

    def __str__(self):
        return self.body

    @classmethod
    def create(cls, user, image, body):
        comment = cls(user=user, image=image, body=body)
        db.session.add(comment)
        db.session.commit()
        return comment


class Like(db.Model):
    """Like model

    User likes on an image

    Tablename:
        likes

    Required fields:
        user_id   INT PRIMARY KEY REFERENCES users
        image_id  INT PRIMARY KEY REFERENCES images
        user      User object
        image     Image object
    """

    __tablename__ = 'likes'

    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'),
                        primary_key=True, nullable=False)
    image_id = db.Column(db.Integer, db.ForeignKey('images.image_id'),
                         primary_key=True, nullable=False)

    user = db.relationship('User', backref='likes')
    image = db.relationship('Image', backref='likes')

    def __repr__(self):
        return '<Like user_id={user} image_id={image}>'.format(
            user=self.user_id, image=self.image_id)

    @classmethod
    def toggle(cls, user, image):
        like = Like.query.filter_by(user=user, image=image).one_or_none()
        if like:
            db.session.delete(like)
            db.session.commit()
            return None

        like = cls(user=user, image=image)
        db.session.add(like)
        db.session.commit()
        return like

    @classmethod
    def create(cls, user, image):
        like = cls(user=user, image=image)
        db.session.add(like)
        db.session.commit()
        return like


# ========================================================================== #
# Tags

class Tag(db.Model):
    """Tag model

    User configured image category

    Tablename:
        tags

    Required fields:
        name    STRING(32)

    Additional attributes:
        tag_id  SERIAL PRIMARY KEY
        images  List of Image objects
    """

    __tablename__ = 'tags'

    tag_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                       nullable=False)
    name = db.Column(db.String(32), nullable=False, unique=True)

    images = db.relationship('Image', secondary='image_tags', backref='tags')

    def __repr__(self):
        return '<Tag tag_id={id} name="{name}">'.format(
            id=self.tag_id, name=self.name)

    def __str__(self):
        return self.name

    @classmethod
    def create(cls, name):
        tag = cls(name=name)
        db.session.add(tag)
        db.session.commit()
        return tag


class ImageTag(db.Model):
    """ImageTag association table model

    Tablename:
        image_tags

    Required fields:
        tag_id    INT PRIMARY KEY REFERENCES tags
        image_id  INT PRIMARY KEY REFERENCES images
    """

    __tablename__ = 'image_tags'

    tag_id = db.Column(db.Integer, db.ForeignKey('tags.tag_id'),
                       primary_key=True)
    image_id = db.Column(db.Integer, db.ForeignKey('images.image_id'),
                         primary_key=True)
    tag = db.relationship('Tag')
    image = db.relationship('Image')

    @classmethod
    def create(cls, image, tag):
        image_tag = cls(image=image, tag=tag)
        db.session.add(image_tag)
        db.session.commit()
        return image_tag


# ========================================================================== #
# Helper functions

def connect_to_db(app, db_uri='postgres:///deep-paint'):
    app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    app.config['SQLALCHEMY_ECHO'] = False
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.app = app
    db.init_app(app)


if __name__ == "__main__":  # pragma: no cover
    from flask import Flask
    app = Flask(__name__)

    connect_to_db(app)
