const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const RecordedThread = require('../../Domains/threads/entities/RecordedThread');
class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(recordThread) {
        const { title, body, userId } = recordThread;
        const id = `thread-${this._idGenerator()}`;
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, user_id',
            values: [id, title, body, userId]
        }
        const result = await this._pool.query(query);
        return new RecordedThread({
            id: result.rows[0].id, title: result.rows[0].title, owner: result.rows[0].user_id
        })
    }
}

module.exports = ThreadRepositoryPostgres;
