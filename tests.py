"""Tests for deep-paint project"""

import unittest
from flask import Flask
from model import (User, Image, SourceImage, StyledImage, TFModel, Style,
                   Comment, Like, Tag, ImageTag, db, connect_to_db)
from seed import seed_data

# for drop_everything() helper function
from sqlalchemy.engine import reflection
from sqlalchemy import create_engine
from sqlalchemy.schema import (MetaData, Table, DropTable,
                               ForeignKeyConstraint, DropConstraint)


app = Flask(__name__)
app.config['SECRET_KEY'] = 'tempkey'
POSTGRES_URI = 'postgresql:///deep-paint-testing'


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


class ModelTests(FlaskTests):

    def setUp(self):

        super(ModelTests, self).setUp()

        connect_to_db(app, POSTGRES_URI)
        db.create_all()
        seed_data()

        print 'ModelTests setUp'

    def tearDown(self):

        db.session.close()
        drop_everything()

        print 'ModelTests tearDown'


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

        print 'ModelUserTests setUp'

    def test_user_creation(self):

        self.assertIsInstance(self.user, User)
        self.assertEqual(self.user.user_id, 2)
        self.assertEqual(self.user.username, 'test')
        self.assertEqual(self.user.email, 'test@email.com')
        self.assertTrue(self.user.pref_is_public)
        self.assertIsNone(self.user.pref_tf_model_id)
        self.assertIsNone(self.user.pref_style_id)

        print 'ModelUserTests test_user_creation passed'

    def test_user_set_password(self):

        self.assertTrue(self.user.check_password('password'))
        self.user.set_password('1234')
        self.assertFalse(self.user.check_password('password'))
        self.assertTrue(self.user.check_password('1234'))

        print 'ModelUserTests test_user_set_password passed'

    def test_superuser_creation(self):

        self.assertFalse(self.user.is_superuser)
        superuser = User(username='testsuper', email='super@email.com',
                         hashed_password='', is_superuser=True)
        db.session.add(superuser)
        db.session.commit()
        self.assertTrue(superuser.is_superuser)

        print 'ModelUserTests test_superuser_creation passed'


def drop_everything():
    """Break all contrains and drop tables

    Credit to Michael Bayer
    https://bitbucket.org/zzzeek/sqlalchemy/wiki/UsageRecipes/DropEverything
    """

    engine = create_engine(POSTGRES_URI)

    conn = engine.connect()

    # the transaction only applies if the DB supports
    # transactional DDL, i.e. Postgresql, MS SQL Server
    trans = conn.begin()

    inspector = reflection.Inspector.from_engine(engine)

    # gather all data first before dropping anything.
    # some DBs lock after things have been dropped in
    # a transaction.

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


if __name__ == '__main__':
    unittest.main()
