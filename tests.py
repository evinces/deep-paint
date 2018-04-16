"""Tests for deep-paint project"""

import unittest
from flask import Flask
from model import (User, Image, SourceImage, StyledImage, TFModel, Style,
                   Comment, Like, Tag, ImageTag, db, connect_to_db)
from seed import seed_data_without_files


app = Flask(__name__)
app.config['SECRET_KEY'] = 'tempkey'


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


class ModelTests(FlaskTests):

    def setUp(self):

        super(ModelTests, self).setUp()

        connect_to_db(app, 'postgresql:///deep-paint-testing')
        db.create_all()
        seed_data_without_files()

    def tearDown(self):

        db.session.close()
        db.drop_all()


class ModelUserTests(ModelTests):

    def setUp(self):

        super(ModelUserTests, self).setUp()

        username = 'test'
        email = 'test@email.com'
        password = 'password'

        self.user = User(username=username, email=email, hashed_password='')
        db.session.add(self.user)
        db.session.commit()
        self.user.set_password(password)

    def test_user_creation(self):

        self.assertIsInstance(self.user, User)
        self.assertEqual(self.user.user_id, 2)
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.email, 'test@email.com')
        self.assertTrue(self.user.pref_is_public)
        self.assertIsNone(self.user.pref_tf_model_id)
        self.assertIsNone(self.user.pref_style_id)

    def test_user_set_password(self):

        self.assertTrue(self.user.check_password('password'))
        self.user.set_password('1234')
        self.assertFalse(self.user.check_password('password'))
        self.assertTrue(self.user.check_password('1234'))

    def test_superuser_creation(self):

        self.assertFalse(self.user.is_superuser)
        superuser = User.create('testsuper', 'super@email.com', 'password',
                                is_superuser=True)
        self.assertTrue(superuser.is_superuser)


if __name__ == '__main__':
    unittest.main()
