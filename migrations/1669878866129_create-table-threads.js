/* eslint-disable camelcase */
exports.up = pgm => {
    pgm.createTable('threads', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        title: {
            type: 'TEXT',
            notNull: true
        },
        body: {
            type: 'TEXT',
            notNull: true
        },
        userId: {
            type: 'VARCHAR(50)',
            references: 'users',
            notNull: true,
            referencesConstraintName: 'user_thread'
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('threads');
};
