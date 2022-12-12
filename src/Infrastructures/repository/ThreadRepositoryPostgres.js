const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addThread(recordThread) {
    const { title, body, userId } = recordThread;
    const id = `thread-${this.idGenerator()}`;
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, user_id as owner',
      values: [id, title, body, userId],
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getThreadById(threadId) {
    const query = {
      text: 'SELECT t.id, t.title, t.body, t.created_at as date, u.username FROM threads t INNER JOIN users u ON u.id = t.user_id WHERE t.id = $1',
      values: [threadId],
    };

    return this.pool.query(query);
  }
}

module.exports = ThreadRepositoryPostgres;
