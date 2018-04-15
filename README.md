# Deep-Paint

Deep-paint is a photo sharing app built to feature the author's interest in style-transfer via Tensorflow. The initial release was built untilizing [fast-style-transfer](https://github.com/lengstrom/fast-style-transfer) by [Logan Engstrom](https://github.com/lengstrom).

## Getting Started

This project is a full-stack web app that leverages multiple technologies and frameworks. The instructions below are meant to guide you through getting a local instance of Deep-Paint up and running.

### Prerequisites

On the back-end, this project was written in **Python 2.7** using **Flask-SQLAlchemy** to connect to a **PostgreSQL** server. The style-transfer neural network was built using Tensorflow. Prior to getting started, you'll need to make sure you have Python 2.7, PostgreSQL, and Tensorflow installed.

I built this project on **macOS High Sierra 10.13.4**, so instructions are written with that OS. If you are running Linux of Windows, your installation steps will be slightly different.

For those of you using macOS, I highly recommend using `brew` to get started.

**Important note**: _These are the steps that worked for my specific environment. Your environment may have different requirements._

#### Install [Homebrew](https://brew.sh/)

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

#### Install [Python 2.7](https://www.python.org/)

Using brew:
```
brew install python@2
pip install --upgrade pip setuptools
pip install virtualenv
```

#### Install [Tensorflow](https://www.tensorflow.org/install/)

_Note: I highly recommend installing components like tensorflow within a virtualenv_
```
pip install tensorflow
```

#### Install and setup [PostgreSQL](https://www.postgresql.org/)

```
brew install postgres
brew services start postgresql
```

### Installing

#### Create a virualenv

```
virtualenv env
```

#### Install the required python packages

I've included a pip freeze dump `requirements.txt`.

```
pip install -r requirements.txt
```

#### Create psql databases

```
createdb deep-paint
createdb deep-paint-testing
```

#### Seed the starting data

```
python seed.py
```

... More details coming soon.
