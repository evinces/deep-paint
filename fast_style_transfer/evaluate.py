from __future__ import print_function
import transform
import numpy as np
import os
import tensorflow as tf
from utils import save_img, get_img
from collections import defaultdict

BATCH_SIZE = 4
DEVICE = '/device:GPU:0'
BASEDIR = os.getcwd()


def ffwd(data_in, paths_out, checkpoint_dir, device_t='/device:GPU:0',
         batch_size=4, testing=False):

    if testing:
        print('start ffwd')
        print(' data_in: ', data_in)
        print(' paths_out: ', paths_out)
        print(' checkpoint_dir: ', checkpoint_dir)
        print(' device_t: ', device_t)
        print(' batch_size: ', batch_size)

    assert len(paths_out) > 0
    is_paths = type(data_in[0]) == str
    if is_paths:
        assert len(data_in) == len(paths_out)
        img_shape = get_img(data_in[0]).shape
    else:
        assert data_in.size[0] == len(paths_out)
        # img_shape = X[0].shape  # X is not assigned prior to this call <-----

    g = tf.Graph()
    batch_size = min(len(paths_out), batch_size)
    # curr_num = 0  # curr_num is never used <---------------------------------
    soft_config = tf.ConfigProto(allow_soft_placement=True)
    soft_config.gpu_options.allow_growth = True
    with g.as_default(), g.device(device_t), \
            tf.Session(config=soft_config) as sess:
        batch_shape = (batch_size,) + img_shape
        img_placeholder = tf.placeholder(tf.float32, shape=batch_shape,
                                         name='img_placeholder')

        preds = transform.net(img_placeholder)
        saver = tf.train.Saver()
        if os.path.isdir(checkpoint_dir):
            ckpt = tf.train.get_checkpoint_state(checkpoint_dir)
            if ckpt and ckpt.model_checkpoint_path:
                saver.restore(sess, ckpt.model_checkpoint_path)
            else:
                raise Exception("No checkpoint found...")
        else:
            saver.restore(sess, checkpoint_dir)

        num_iters = int(len(paths_out) / batch_size)
        for i in range(num_iters):
            pos = i * batch_size
            curr_batch_out = paths_out[pos:pos + batch_size]
            if is_paths:
                curr_batch_in = data_in[pos:pos + batch_size]
                X = np.zeros(batch_shape, dtype=np.float32)
                for j, path_in in enumerate(curr_batch_in):
                    img = get_img(path_in)
                    assert img.shape == img_shape, \
                        'Images have different dimensions. ' + \
                        'Resize images or use --allow-different-dimensions.'
                    X[j] = img
            else:
                X = data_in[pos:pos + batch_size]

            _preds = sess.run(preds, feed_dict={img_placeholder: X})
            for j, path_out in enumerate(curr_batch_out):
                save_img(path_out, _preds[j])

        remaining_in = data_in[num_iters * batch_size:]
        remaining_out = paths_out[num_iters * batch_size:]
    if len(remaining_in) > 0:
        ffwd(remaining_in, remaining_out, checkpoint_dir,
             device_t=device_t, batch_size=1)


def ffwd_to_img(in_path, out_path, checkpoint_dir, device='/device:CPU:0',
                testing=False):

    if testing:
        print('start ffwd_to_img')
        print(' in_path: ', in_path)
        print(' out_path: ', out_path)
        print(' checkpoint_dir: ', checkpoint_dir)
        print(' device: ', device)

    paths_in, paths_out = [BASEDIR + in_path], [BASEDIR + out_path]
    ffwd(paths_in, paths_out, BASEDIR + checkpoint_dir, batch_size=1,
         device_t=device)


def ffwd_different_dimensions(in_path, out_path, checkpoint_dir,
                              device_t=DEVICE, batch_size=4, testing=False):

    if testing:
        print('start ffwd_different_dimensions')
        print(' in_path: ', in_path)
        print(' out_path: ', out_path)
        print(' checkpoint_dir: ', checkpoint_dir)
        print(' device_t: ', device_t)
        print(' batch_size: ', batch_size)

    in_path_of_shape = defaultdict(list)
    out_path_of_shape = defaultdict(list)
    for i in range(len(in_path)):
        in_image = in_path[i]
        out_image = out_path[i]
        shape = "%dx%dx%d" % get_img(in_image).shape
        in_path_of_shape[shape].append(in_image)
        out_path_of_shape[shape].append(out_image)
    for shape in in_path_of_shape:
        print('Processing images of shape %s' % shape)
        ffwd(in_path_of_shape[shape], out_path_of_shape[shape],
             checkpoint_dir, device_t, batch_size)