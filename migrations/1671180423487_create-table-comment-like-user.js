/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('comment_like_users', {
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'comment_like_users',
    'fk_comment_like_users.comment_id.thread_comments.id',
    'FOREIGN KEY(comment_id) REFERENCES thread_comments(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'comment_like_users',
    'fk_comment_like_users.user_id.users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('comment_like_users');
};
