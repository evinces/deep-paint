# DeepPaint

DeepPaint is a photo sharing webapp built to feature the author's interest in style-transfer via Tensorflow. The initial release was built untilizing [fast-style-transfer](https://github.com/lengstrom/fast-style-transfer) by [Logan Engstrom](https://github.com/lengstrom).

Users upload photos, share them with the DeepPaint community, then process those photos through the style-transfer model to generate new images that blend the content and features of the source photo with the style and texture of select paintings.

![Homepage](http://cl.evinc.es/rix2/Image%202018-05-20%20at%202.04.45%20PM.png)

## Getting Started

This project is a full-stack web app that leverages multiple technologies and frameworks. The instructions below are meant to guide you through getting a local instance of Deep-Paint up and running.

## Prerequisites

On the back-end, this project was written in **Python 2.7** using **Flask** as the web framework, then **Flask-SQLAlchemy** as the ORM to connect to a **PostgreSQL** database. The style-transfer neural network was built using **Tensorflow**. Prior to getting started, you'll need to make sure you have Python 2.7, and PostgreSQL installed.

I built this project on **macOS High Sierra 10.13.4**, so instructions are written with that OS. If you are running Linux or Windows, your installation steps will be slightly different.

For those of you using macOS, I highly recommend using `brew` to get started.

**Important note**: _These are the steps that worked for my specific environment. Your environment may have different requirements._

1. Install [Homebrew](https://brew.sh/)

```
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

2. Install [Python 2.7](https://www.python.org/)

Using brew:
```
$ brew install python@2
$ pip install --upgrade pip setuptools
$ pip install virtualenv
```

3. Install and setup [PostgreSQL](https://www.postgresql.org/)

```
$ brew install postgres
$ brew services start postgresql
```

## Installing

1. Create a virtual environment.
```
$ virtualenv env
```

2. Install the required python packages. I've included a pip freeze dump: `requirements.txt`.
```
$ pip install -r requirements.txt
```

3. Create the postgres databases.
```
$ createdb deep-paint
$ createdb deep-paint-testing
```

4. Seed the starting data. Download the seed files [here](https://drive.google.com/file/d/1PdZL5JXdtsdnYMHjc-S36vb3shFrycUx/view?usp=sharing). Extract the archive to the project directory, then run seed.py to populate the db.
```
$ python seed.py
```

## Deploying

1. Spin up the web server of your preference. The host used for deep-paint.com is an AWS EC2 large-t2 instance running **Ubuntu 16.4 LTS** with the following config:
```
$ apt-get install -y python-virtualenv
$ apt-get install -y build-essential python-dev
$ apt-get install -y postgresql postgresql-client
$ sudo -u postgres createuser -s ubuntu
$ apt-get install -y postgresql-server-dev-10.3
$ apt-get install -y postgresql-plpython
$ apt-get install -y postgresql-contrib
$ apt-get install -y nginx
```

1a. The PostgreSQL db will also need to be spun up here. If you've already created the db in your local env, I recommend simply dumping your local db into a `.sql` file then reading that into the server.
**On local**:
```
$ pg_dump deep-paint > deep-paint.sql
```
**On server**:
```
$ psql deep-paint < deep-paint.sql
```

2. Clone this repo on the server and `cd` into the directory.
```
$ git clone https://github.com/evinces/deep-paint.git
$ cd deep-paint
```

4. Create a virtual environment and pip install requirements.
```
$ virtualenv env
$ . env/bin/activate
$ pip install -r requirements.txt
```

5. Create a `secrets.sh` file and add a Flask secret key.
```
$ echo "export SECRET_KEY='<fill-with-a-secret-key>'" > secrets.sh
```

6. Spin up the server and verify it is running.
```
$ tmux
$ . env/bin/activate
$ . secrets.sh
$ python server.py
...
[ctrl+b][d]
$ curl http://localhost:5000
```

7. Get an SSL cert from [letsenrypt](https://letsencrypt.org/).
**Note**: _This step is optional but highly recommended._
```
$ sudo apt-get install software-properties-common
$ sudo add-apt-repository ppa:certbot/certbot
$ sudo apt-get update
$ sudo apt-get install python-certbot-nginx
$ sudo certbot --nginx
...
[enter your domain]
```

8. Modify the `nginx.conf` file with your domain name, to route https traffic to localhost on the server.
```
... [after modifying nginx.conf]
$ sudo cp nginx.conf /etc/nginx/sites-enabled/[your-domain].conf
$ sudo /etc/init.d/nginx reload
```

## Built With

* [Flask](http://flask.pocoo.org/) - Back-end framework
* [PostgreSQL](https://www.postgresql.org/) - Database system
* [Tensorflow](https://www.tensorflow.org/) - Machine learning framework
* [React](https://reactjs.org/) - Front-end framework
* [Bootstrap](https://getbootstrap.com/) - Front-end component library

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## Authors

* **Estrella Vinces** - [evinces](https://github.com/evinces)

See also the list of [contributors](https://github.com/evinces/deep-paint/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* [Logan Engstrom](https://github.com/lengstrom) - For [fast-style-transfer](https://github.com/lengstrom/fast-style-transfer) used in the initial code for this project.
* [Hackbright Academy](https://hackbrightacademy.com/) - This was originally conceived of as a student project by Estrella Vinces while attending Hackbright Academy's Full-Stack Software Engineering program.
* Vincent Dumoulin, Jonathon Shlens & Manjunath Kudlur - [A Learned Representation For Artistic Style](https://arxiv.org/abs/1610.07629) - The paper that initially inspired this project.
