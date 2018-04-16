"""Tests for deep-paint project"""

import unittest
from flask import Flask
from model import (User, Image, SourceImage, StyledImage, TFModel, Style,
                   Comment, Like, Tag, db, connect_to_db)
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

        self.client = app.test_client()
        app.config['TESTING'] = True

        print 'FlaskTests setUp'


# ========================================================================== #
# ========================================================================== #
# Model Tests

class AbstractModelTests(FlaskTests):

    def setUp(self):
        super(AbstractModelTests, self).setUp()

        connect_to_db(app, POSTGRES_URI)
        db.create_all()
        seed_data(testing=True)

        print '  ModelTests setUp'

    def tearDown(self):

        db.session.close()
        drop_everything()

        print '  ModelTests tearDown'


# ========================================================================== #
# User Tests

class ModelUserTests(AbstractModelTests):

    def setUp(self):
        super(ModelUserTests, self).setUp()
        self.user = User.query.get(1)

        print '  ModelUserTests setUp'

    def test_user_creation(self):
        user = User.create('test2', 'test2@email.com', 'password')
        self.assertIsInstance(user, User)
        self.assertEqual(user.user_id, 2)
        self.assertEqual(user.username, 'test2')
        self.assertEqual(user.email, 'test2@email.com')
        self.assertTrue(user.check_password('password'))
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.pref_is_public)
        self.assertIsNone(user.pref_tf_model_id)
        self.assertIsNone(user.pref_style_id)

        print '  ModelUserTests test_user_creation passed'

    def test_user_set_password(self):
        self.assertTrue(self.user.check_password('password'))
        self.user.set_password('1234')
        self.assertFalse(self.user.check_password('password'))
        self.assertTrue(self.user.check_password('1234'))

        print '  ModelUserTests test_user_set_password passed'

    def test_superuser_creation(self):
        self.assertFalse(self.user.is_superuser)
        superuser = User.create(username='super', email='super@email.com',
                                password='password', is_superuser=True)
        db.session.add(superuser)
        db.session.commit()
        self.assertTrue(superuser.is_superuser)

        print '  ModelUserTests test_superuser_creation passed'


# ========================================================================== #
# Image Tests

class ModelImageTests(AbstractModelTests):

    def setUp(self):
        super(ModelImageTests, self).setUp()
        self.image = Image.query.get(1)

        print '  ModelImageTests setUp'

    def test_image_creation(self):
        pass


# ========================================================================== #
# SourceImage Tests

class ModelSourceImageTests(AbstractModelTests):

    def setUp(self):
        super(ModelSourceImageTests, self).setUp()
        self.source_image = SourceImage.query.get(1)

        print '  ModelSourceImageTests setUp'

    def test_source_image_creation(self):
        pass


# ========================================================================== #
# StyledImage Tests

class ModelStyledImageTests(AbstractModelTests):

    def setUp(self):
        super(ModelStyledImageTests, self).setUp()
        self.styled_image = StyledImage.query.get(1)

        print '  ModelStyledImageTests setUp'

    def test_styled_image_creation(self):
        pass


# ========================================================================== #
# TFModel Tests

class ModelTFModelTests(AbstractModelTests):

    def setUp(self):
        super(ModelTFModelTests, self).setUp()
        self.tf_model = TFModel.query.get(1)

        print '  ModelTFModelTests setUp'

    def test_tf_model_creation(self):
        pass


# ========================================================================== #
# Style Tests

class ModelStyleTests(AbstractModelTests):

    def setUp(self):
        super(ModelStyleTests, self).setUp()
        self.style = Style.query.get(1)

        print '  ModelStyleTests setUp'

    def test_style_creation(self):
        pass


# ========================================================================== #
# Comment Tests

class ModelCommentTests(AbstractModelTests):

    def setUp(self):
        super(ModelCommentTests, self).setUp()
        self.comment = Comment.query.get(1)

        print '  ModelCommentTests setUp'

    def test_comment_creation(self):
        pass


# ========================================================================== #
# Like Tests

class ModelLikeTests(AbstractModelTests):

    def setUp(self):
        super(ModelLikeTests, self).setUp()
        self.like = Like.query.filter_by(user_id=1, image_id=1)

        print '  ModelLikeTests setUp'

    def test_like_creation(self):
        pass


# ========================================================================== #
# Tag Tests

class ModelTagTests(AbstractModelTests):

    def setUp(self):
        super(ModelTagTests, self).setUp()
        self.tag = Tag.query.get(1)

        print '  ModelTagTests setUp'

    def test_tag_creation(self):
        pass


# ========================================================================== #
# Helper Functions

def drop_everything():
    """Break all contrains and drop tables

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
