const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const RecordedThread = require('../../../Domains/threads/entities/RecordedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const {add} = require("nodemon/lib/rules");
describe('ThreadRepositoryPostgres', () => {
   beforeAll(async () => {
       await UsersTableTestHelper.addUser({ username: 'dicoding' });
   })
   afterEach(async () => {
       await ThreadTableTestHelper.cleanTable();
       await UsersTableTestHelper.cleanTable();
   })

    afterAll(async () => {
        await pool.end();
    })

    describe('addThread function', () => {
        it('should persist add thread and return recorded thread correctly', async () => {
            const userId = await UsersTableTestHelper.findUsersById('user-123');
            const addThread = new AddThread({
                title: 'dicoding',
                body: 'dicoding indonesia',
                userId: userId[0].id
            });

            const fakeIdGenerator = () => 123;

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            await threadRepositoryPostgres.addThread(addThread);

            const threads = await ThreadTableTestHelper.findThreadById('thread-123');
            expect(threads).toHaveLength(1);
        })
    });
})
