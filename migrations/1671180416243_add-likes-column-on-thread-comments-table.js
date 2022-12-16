/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('thread_comments', {
    likes: {
      type: 'integer',
      default: 0,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('threads', 'likes');
};
