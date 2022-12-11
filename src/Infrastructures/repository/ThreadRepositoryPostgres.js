const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const RecordedThread = require('../../Domains/threads/entities/RecordedThread');
const RecordedThreadComment = require('../../Domains/threads/entities/RecordedThreadComment');

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
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, user_id',
      values: [id, title, body, userId],
    };
    const result = await this.pool.query(query);
    return new RecordedThread({
      id: result.rows[0].id, title: result.rows[0].title, owner: result.rows[0].user_id,
    });
  }

  async getThreadById(threadId) {
    const query = {
      text: 'SELECT t.id, t.title, t.body, t.created_at, t.user_id, u.username FROM threads t INNER JOIN users u ON u.id = t.user_id WHERE t.id = $1',
      values: [threadId],
    };

    return this.pool.query(query);
  }
}

module.exports = ThreadRepositoryPostgres;
