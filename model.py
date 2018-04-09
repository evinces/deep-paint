"""Models and database functions for deep-paint"""

from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    """User model"""

    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                        nullable=False)
    username = db.Column(db.String(32), nullable=False)
    email = db.Column(db.String(320), nullable=False)
    hashed_password = db.Column(db.String(93), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    is_superuser = db.Column(db.Boolean, default=False, nullable=False)
    pref_is_public = db.Column(db.Boolean, default=True, nullable=False)

    pref_tf_model_id = db.Column(db.Integer,
                                 db.ForeignKey('tf_models.nn_model_id'))
    pref_style_id = db.Column(db.Integer, db.ForeignKey('styles.style_id'))

    pref_tf_model = db.relationship('TFModel', backref='users')
    pref_style = db.relationship('Style', backref='users')

    def __repr__(self):
        return '<User user_id={user_id} username={username}>'.format(
            user_id=self.user_id, username=self.username)

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


class Image(db.Model):
    """Base image model"""

    __tablename__ = 'images'

    img_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                       nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    is_public = db.Column(db.Boolean, default=False, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))

    user = db.relationship('users', backref='images')

    def __repr__(self):
        return '<Image img_id={img_id} user_id={user_id}>'.format(
            img_id=self.img_id, user_id=self.user_id)

    def get_path(self):
        """Return the file path for image instance"""

        if self.user_id:
            return 'img/{user_id}/{img_id}.png'.format(
                user_id=self.user_id, img_id=self.img_id)
        else:
            return 'img/misc/{img_id}.png'.format(img_id=self.img_id)

    def get_thumbnail_path(self):
        """Return the thumbnail file path for image instance"""

        if self.user_id:
            return 'img/{user_id}/{img_id}_thumb.png'.format(
                user_id=self.user_id, img_id=self.img_id)
        else:
            return 'img/misc/{img_id}_thumb.png'.format(img_id=self.img_id)


class SourceImage(db.Model):
    """Source Image model"""
    pass


class StyledImage(db.Model):
    """Styled Image model"""
    pass


class TFModel(db.Model):
    """Tensorflow model"""
    pass


class Style(db.Model):
    """Style model"""
    pass


class Comment(db.Model):
    """Comment model"""
    pass


class Like(db.Model):
    """Like model"""
    pass


class Tag(db.Model):
    """Tag model"""
    pass


# ImageTags association table
image_tags = db.Table('image_tags',
                      db.Column('tag_id',
                                db.Integer,
                                db.ForeignKey('tags.tag_id'),
                                primary_key=True)
                      db.Column('img_id',
                                db.Ingeter,
                                db.ForeignKey('images.img_id'),
                                primary_key=True))
