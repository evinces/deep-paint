"""Initial seed data"""

from model import (User, Image, SourceImage, TFModel, Style, db, connect_to_db)
from werkzeug.datastructures import FileStorage


def seed_data():
    tf_model = TFModel.create(title='fast-style-transfer',
                              description='Created by Logan Engstrom')

    style_dir = 'fast-style-transfer/styles/'

    muse_file = FileStorage(stream=open(style_dir + 'muse.ckpt'))
    muse_image = FileStorage(stream=open(style_dir + 'muse.jpg'))
    Style.create(style_file=muse_file, image_file=muse_image,
                 tf_model=tf_model, title='La Muse', artist='Pablo Picasso',
                 description="This painting is also known as Young Woman Drawi\
ng and Two Women. It's a story of two women. One sits, copying what she sees i\
n the mirror set up in front of her; the other sleeps with her head in her arm\
s.\nThere was a series of paintings Picasso did at this time of young women dr\
awing, writing or reading. This is Marie Therese Walther not with the rounded,\
 ample forms the painter normally used to depict her but with an angular style\
. The sleeping girl resembles her as well, and indeed she would be somewhere (\
anywhere's better than nowhere) in Picasso's affections for some years to come\
. Maia, their daughter was born a few months after this was painted, in Octobe\
r 1935.")

    rain_file = FileStorage(stream=open(style_dir + 'rain.ckpt'))
    rain_image = FileStorage(stream=open(style_dir + 'rain.jpg'))
    Style.create(style_file=rain_file, image_file=rain_image,
                 tf_model=tf_model, title='Rain Princess',
                 artist='Leonid Afremov', description="Rain Princess is a pain\
ting by Leonid Afremov which was uploaded on February 17th, 2014.\nYou can buy\
 this painting from his official shop via this link: https://www.etsy.com/list\
ing/16654120")

    scream_file = FileStorage(stream=open(style_dir + 'scream.ckpt'))
    scream_image = FileStorage(stream=open(style_dir + 'scream.jpg'))
    Style.create(style_file=scream_file, image_file=scream_image,
                 tf_model=tf_model, title='The Scream', artist='Edvard Munch',
                 description="Munch's The Scream is an icon of modern art, the\
 Mona Lisa for our time. As Leonardo da Vinci evoked a Renaissance ideal of se\
renity and self-control, Munch defined how we see our own age - wracked with a\
nxiety and uncertainty.")

    udnie_file = FileStorage(stream=open(style_dir + 'udnie.ckpt'))
    udnie_image = FileStorage(stream=open(style_dir + 'udnie.jpg'))
    Style.create(style_file=udnie_file, image_file=udnie_image,
                 tf_model=tf_model, title='Udnie', artist='Francis Picabia',
                 description="Udnie was inspired by a dance performance given \
by the Polish-born actress Stacia Napierkowska on the boat taking Francis Pica\
bia to New York for the Armory Show in 1913. The work combines the decompositi\
on of volumes into planes characteristic of Cubism with the enthusiasm for a w\
orld in movement of Italian Futurism. The energy and vitality of the dance fin\
d expression in springing arabesque, fragmented coloured planes and the jostli\
ng of simplified forms. In the radicalism of its treatment, Udnie marks a deci\
sive step towards the emergence of abstraction in Europe.")

    wave_file = FileStorage(stream=open(style_dir + 'wave.ckpt'))
    wave_image = FileStorage(stream=open(style_dir + 'wave.jpg'))
    Style.create(style_file=wave_file, image_file=wave_image,
                 tf_model=tf_model, title='Under the Wave off Kanagawa',
                 artist='Katsushika Hokusai', description="Katsushika Hokusai'\
s Under the Wave off Kanagawa, also called The Great Wave has became one of th\
e most famous works of art in the world-and debatably the most iconic work of \
Japanese art. Initially, thousands of copies of this print were quickly produc\
ed and sold cheaply. Despite the fact that it was created at a time when Japan\
ese trade was heavily restricted, Hokusai's print displays the influence of Du\
tch art, and proved to be inspirational for many artists working in Europe lat\
er in the nineteenth century.")

    wreck_file = FileStorage(stream=open(style_dir + 'wreck.ckpt'))
    wreck_image = FileStorage(stream=open(style_dir + 'wreck.jpg'))
    Style.create(style_file=wreck_file, image_file=wreck_image,
                 tf_model=tf_model, title='The Shipwreck of the Minotaur',
                 artist='Joseph Mallord William Turner', description="Shipwrec\
k may be regarded as one of the worst things a human being can encounter. The \
sea is no respecter of persons- instantly, 100s of men can be wiped out. Turne\
r's fascination with man vs. nature is display in The Shipwreck. He wished to \
portray the power of the elements and how no one is immune from the dangers of\
 an angry sea; he can struggle and fight but ultimately he will be swallowed u\
p by the sea. The unlikelihood of deliverance from such calamity is great.")

    user = User.create(username='testuser', email='testing@email.com',
                       password='password')

    user_image = FileStorage(stream=open(
        'fast-style-transfer/source-images/cape-flattery.jpg'))
    SourceImage.create(image_file=user_image, user=user,
                       title="Wooden Path in Sunlight", description="Taken at \
Cape Flattery, WA on a sunny day in October, 2017.")


if __name__ == "__main__":
    from flask import Flask
    app = Flask(__name__)

    connect_to_db(app)
    db.create_all()
    seed_data()
