"""Tests for deep-paint project"""

import unittest
from flask import Flask
from model import (User, Image, SourceImage, StyledImage, TFModel, Style,
                   Comment, Like, Tag, ImageTag, db, connect_to_db)
from seed import seed_data, FileStorage

# for drop_everything() helper function
from sqlalchemy.engine import reflection
from sqlalchemy import create_engine
from sqlalchemy.schema import (MetaData, Table, DropTable,
                               ForeignKeyConstraint, DropConstraint)


app = Flask(__name__)
app.config['SECRET_KEY'] = 'tempkey'
POSTGRES_URI = 'postgresql:///deep-paint-testing'


# ========================================================================== #
# ========================================================================== #
# Flask Tests

class FlaskTests(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        app.config['SECRET_KEY'] = 'key'
        self.client = app.test_client()

        with self.client as c:
            with c.session_transaction() as sess:
                sess['user_id'] = 1


# ========================================================================== #
# ========================================================================== #
# Model Tests

class AbstractModelTests(FlaskTests):

    def setUp(self):
        super(AbstractModelTests, self).setUp()

        connect_to_db(app, POSTGRES_URI)
        db.create_all()
        seed_data(testing=True)

    def tearDown(self):
        db.session.close()
        drop_everything()


# ========================================================================== #
# User Tests

class ModelUserTests(AbstractModelTests):

    def setUp(self):
        super(ModelUserTests, self).setUp()
        self.user = User.query.get(1)

    def test_user_creation(self):
        print '- test_user_creation'
        user = User.create('test2', 'test2@email.com', 'password')
        self.assertEqual(user.user_id, 2)
        self.assertIsInstance(user, User)
        self.assertEqual(user.username, 'test2')
        self.assertEqual(user.email, 'test2@email.com')
        self.assertTrue(user.check_password('password'))
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.pref_is_public)
        self.assertIsNone(user.pref_tf_model_id)
        self.assertIsNone(user.pref_style_id)
        print '+ passed'

    def test_user_set_password(self):
        print '- test_user_set_password'
        self.assertTrue(self.user.check_password('password'))
        self.user.set_password('1234')
        self.assertFalse(self.user.check_password('password'))
        self.assertTrue(self.user.check_password('1234'))
        print '+ passed'

    def test_user_superuser_creation(self):
        print '- test_user_superuser_creation'
        self.assertFalse(self.user.is_superuser)
        superuser = User.create(username='super', email='super@email.com',
                                password='password', is_superuser=True)
        db.session.add(superuser)
        db.session.commit()
        self.assertTrue(superuser.is_superuser)
        print '+ passed'

    def test_user_is_valid_email(self):
        print '- test_user_is_valid_email'
        email = 'l@' + ('d' * 345) + '.com'  # len(email) > 320
        self.assertFalse(User.is_valid_email(email))
        email = 'localdomain.com'              # email.find('@') == -1
        self.assertFalse(User.is_valid_email(email))
        email = ('l' * 65) + '@domain.com'    # len(localpart) > 64
        self.assertFalse(User.is_valid_email(email))
        email = 'l@' + ('d' * 252) + '.com'  # len(domain) > 255
        self.assertFalse(User.is_valid_email(email))
        email = 'local@.com'                  # email.find('.') == 0
        self.assertFalse(User.is_valid_email(email))
        email = 'local@domaincom'              # email.find('.') == -1
        self.assertFalse(User.is_valid_email(email))
        email = 'local@domain.com'             # valid email
        self.assertTrue(User.is_valid_email(email))
        print '+ passed'

    def test_user_repr(self):
        print '- test_user_repr'
        self.assertEqual(repr(self.user), '<User user_id=1 username="test">')
        print '+ passed'


# ========================================================================== #
# Image Tests

class ModelImageTests(AbstractModelTests):

    def setUp(self):
        super(ModelImageTests, self).setUp()
        self.image = Image.query.get(1)

    def test_image_creation_no_user(self):
        print '- test_image_creation_no_user'
        image_file = FileStorage(stream=open(
            'fast_style_transfer/source-images/cape-flattery.jpg'))
        image = Image.create(image_file)
        self.assertEqual(image.image_id, 9)
        self.assertIsInstance(image, Image)
        self.assertTrue(image.is_public)
        self.assertEqual(image.file_extension, 'jpg')
        self.assertIsNone(image.user_id)
        print '+ passed'

    def test_image_creation_with_user(self):
        print '- test_image_creation_with_user'
        image_file = FileStorage(stream=open(
            'fast_style_transfer/source-images/cape-flattery.jpg'))
        user = User.query.get(1)
        image = Image.create(image_file, user)
        self.assertEqual(image.user_id, 1)
        self.assertIsInstance(image.user, User)
        self.assertEqual(image.is_public, user.pref_is_public)
        print '+ passed'

    def test_image_get_filename(self):
        print '- test_image_get_filename'
        filename = '1.jpg'
        self.assertEqual(self.image.get_filename(), filename)
        print '+ passed'

    def test_image_get_path(self):
        print '- test_image_get_path'
        path = 'static/image/1.jpg'
        self.assertEqual(self.image.get_path(), path)
        print '+ passed'

    def test_image_is_allowed_file(self):
        print '- test_image_is_allowed_file'
        self.assertTrue(Image.is_allowed_file('hello.jpg'))
        self.assertTrue(Image.is_allowed_file('hello.png'))
        self.assertTrue(Image.is_allowed_file('h.e.l.l.o.tif'))
        self.assertFalse(Image.is_allowed_file('hellojpg'))
        self.assertFalse(Image.is_allowed_file('hello.pdf'))
        self.assertFalse(Image.is_allowed_file('hello.zip'))
        print '+ passed'

    def test_image_get_file_extension(self):
        print '- test_image_get_file_extension'
        self.assertEqual(Image.get_file_extension('hello.jpg'), 'jpg')
        self.assertEqual(Image.get_file_extension('h.e.l.l.o.gif'), 'gif')
        print '+ passed'

    def test_image_repr(self):
        print '- test_image_repr'
        self.assertEqual(repr(self.image),
                         '<Image image_id=1 path="static/image/1.jpg">')
        print '+ passed'


# ========================================================================== #
# SourceImage Tests

class ModelSourceImageTests(AbstractModelTests):

    def setUp(self):
        super(ModelSourceImageTests, self).setUp()
        self.source_image = SourceImage.query.get(1)

    def test_source_image_creation(self):
        print '- test_source_image_creation'
        image_file = FileStorage(stream=open(
            'fast_style_transfer/source-images/cape-flattery.jpg'))
        user = User.query.get(1)
        source_image = SourceImage.create(image_file, user, 'title',
                                          'description')
        self.assertEqual(source_image.source_image_id, 2)
        self.assertIsInstance(source_image, SourceImage)
        self.assertEqual(source_image.title, 'title')
        self.assertEqual(source_image.description, 'description')
        self.assertEqual(source_image.image_id, 9)
        self.assertIsInstance(source_image.image, Image)
        print '+ passed'

    def test_source_image_get_path(self):
        print '- test_source_image_get_path'
        self.assertEqual(self.source_image.get_path(), 'static/image/7.jpg')
        print '+ passed'

    def test_source_image_repr(self):
        print '- test_source_image_repr'
        self.assertEqual(repr(self.source_image),
                         '<SourceImage source_image_id=1 ' +
                         'path="static/image/7.jpg">')
        print '+ passed'


# ========================================================================== #
# StyledImage Tests

class ModelStyledImageTests(AbstractModelTests):

    def setUp(self):
        super(ModelStyledImageTests, self).setUp()
        self.styled_image = StyledImage.query.get(1)

    def test_styled_image_creation(self):
        print '- test_styled_image_creation'
        source_image = SourceImage.query.get(1)
        style = Style.query.get(1)
        styled_image = StyledImage.create(source_image, style)
        self.assertEqual(styled_image.styled_image_id, 2)
        self.assertIsInstance(styled_image, StyledImage)
        self.assertEqual(styled_image.image_id, 9)
        self.assertIsInstance(styled_image.image, Image)
        self.assertEqual(styled_image.style_id, 1)
        self.assertIsInstance(styled_image.style, Style)
        self.assertEqual(styled_image.source_image_id, 1)
        self.assertIsInstance(styled_image.source_image, SourceImage)
        print '+ passed'

    def test_styled_image_get_path(self):
        print '- test_styled_image_get_path'
        self.assertEqual(self.styled_image.get_path(), 'static/image/8.jpg')
        print '+ passed'

    def test_styled_image_repr(self):
        print '- test_styled_image_repr'
        self.assertEqual(repr(self.styled_image),
                         '<StyledImage styled_image_id=1 ' +
                         'path="static/image/8.jpg">')
        print '+ passed'


# ========================================================================== #
# TFModel Tests

class ModelTFModelTests(AbstractModelTests):

    def setUp(self):
        super(ModelTFModelTests, self).setUp()
        self.tf_model = TFModel.query.get(1)

    def test_tf_model_creation(self):
        print '- test_tf_model_creation'
        tf_model = TFModel.create('title', 'description')
        self.assertEqual(tf_model.tf_model_id, 2)
        self.assertIsInstance(tf_model, TFModel)
        self.assertEqual(tf_model.title, 'title')
        self.assertEqual(tf_model.description, 'description')
        print '+ passed'

    def test_tf_model_repr(self):
        print '- test_tf_model_repr'
        self.assertEqual(repr(self.tf_model),
                         '<TFModel tf_model_id=1 title="fast_style_transfer">')
        print '+ passed'


# ========================================================================== #
# Style Tests

class ModelStyleTests(AbstractModelTests):

    def setUp(self):
        super(ModelStyleTests, self).setUp()
        self.style = Style.query.get(1)

    def test_style_creation(self):
        print '- test_style_creation'
        style_file = FileStorage(stream=open(
            'fast_style_transfer/styles/muse.ckpt'))
        image_file = FileStorage(stream=open(
            'fast_style_transfer/styles/muse.jpg'))
        tf_model = TFModel.query.get(1)
        style = Style.create(style_file, image_file, tf_model, 'title',
                             'artist', 'description')
        self.assertEqual(style.style_id, 7)
        self.assertIsInstance(style, Style)
        self.assertEqual(style.title, 'title')
        self.assertEqual(style.artist, 'artist')
        self.assertEqual(style.description, 'description')
        self.assertEqual(style.tf_model_id, 1)
        self.assertIsInstance(style.tf_model, TFModel)
        self.assertEqual(style.image_id, 9)
        self.assertIsInstance(style.image, Image)
        print '+ passed'

    def test_style_repr(self):
        print '- test_style_repr'
        self.assertEqual(repr(self.style),
                         '<Style style_id=1 title="La Muse">')
        print '+ passed'


# ========================================================================== #
# Comment Tests

class ModelCommentTests(AbstractModelTests):

    def setUp(self):
        super(ModelCommentTests, self).setUp()
        self.comment = Comment.query.get(1)

    def test_comment_creation(self):
        print '- test_comment_creation'
        user = User.query.get(1)
        image = Image.query.get(1)
        comment = Comment.create(user, image, 'howdy')
        self.assertEqual(comment.comment_id, 2)
        self.assertIsInstance(comment, Comment)
        self.assertEqual(comment.body, 'howdy')
        self.assertEqual(comment.user_id, 1)
        self.assertIsInstance(comment.user, User)
        self.assertEqual(comment.image_id, 1)
        self.assertIsInstance(comment.image, Image)
        print '+ passed'

    def test_comment_repr(self):
        print '- test_comment_repr'
        self.assertEqual(repr(self.comment),
                         '<Comment comment_id=1 body="hello world">')
        print '+ passed'

    def test_comment_str(self):
        print '- test_comment_str'
        self.assertEqual(str(self.comment), 'hello world')
        print '+ passed'


# ========================================================================== #
# Like Tests

class ModelLikeTests(AbstractModelTests):

    def setUp(self):
        super(ModelLikeTests, self).setUp()
        self.like = Like.query.filter_by(user_id=1, image_id=1).one()

    def test_like_creation(self):
        print '- test_like_creation'
        user = User.query.get(1)
        image = Image.query.get(2)
        like = Like.create(user, image)
        self.assertEqual(like.user_id, 1)
        self.assertIsInstance(like.user, User)
        self.assertEqual(like.image_id, 2)
        self.assertIsInstance(like.image, Image)
        print '+ passed'

    def test_like_repr(self):
        print '- test_like_repr'
        self.assertEqual(repr(self.like), '<Like user_id=1 image_id=1>')
        print '+ passed'


# ========================================================================== #
# Tag Tests

class ModelTagTests(AbstractModelTests):

    def setUp(self):
        super(ModelTagTests, self).setUp()
        self.tag = Tag.query.get(1)

    def test_tag_creation(self):
        print '- test_tag_creation'
        tag = Tag.create('musk')
        self.assertEqual(tag.tag_id, 2)
        self.assertIsInstance(tag, Tag)
        self.assertEqual(tag.name, 'musk')
        print '+ passed'

    def test_tag_repr(self):
        print '- test_tag_repr'
        self.assertEqual(repr(self.tag),
                         '<Tag tag_id=1 name="melon">')
        print '+ passed'

    def test_tag_str(self):
        print '- test_tag_str'
        self.assertEqual(str(self.tag), 'melon')
        print '+ passed'


# ========================================================================== #
# Tag Tests

class ModelImageTagTests(AbstractModelTests):

    def setUp(self):
        super(ModelImageTagTests, self).setUp()
        self.image_tag = ImageTag.query.filter_by(image_id=1, tag_id=1).one()

    def test_image_tag_creation(self):
        print '- test_image_tag_creation'
        image = Image.query.get(2)
        tag = Tag.query.get(1)
        image_tag = ImageTag.create(image, tag)
        self.assertEqual(image_tag.image_id, 2)
        self.assertIsInstance(image_tag.image, Image)
        self.assertEqual(image_tag.tag_id, 1)
        self.assertIsInstance(image_tag.tag, Tag)
        print '+ passed'


# ========================================================================== #
# Helper Functions

def drop_everything():
    """Break all contraints and drop tables

    Credit to Michael Bayer
    https://bitbucket.org/zzzeek/sqlalchemy/wiki/UsageRecipes/DropEverything
    """

    engine = create_engine(POSTGRES_URI)
    conn = engine.connect()
    trans = conn.begin()
    inspector = reflection.Inspector.from_engine(engine)
    metadata = MetaData()

    tbs = []
    all_fks = []

    for table_name in inspector.get_table_names():
        fks = []
        for fk in inspector.get_foreign_keys(table_name):
            if not fk['name']:
                continue
            fks.append(ForeignKeyConstraint((), (), name=fk['name']))
        t = Table(table_name, metadata, *fks)
        tbs.append(t)
        all_fks.extend(fks)

    for fkc in all_fks:
        conn.execute(DropConstraint(fkc))
    for table in tbs:
        conn.execute(DropTable(table))

    trans.commit()


# ========================================================================== #
# Main

if __name__ == '__main__':
    unittest.main()
