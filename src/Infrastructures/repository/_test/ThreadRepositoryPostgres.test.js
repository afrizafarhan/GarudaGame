const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');

const AddThread = require('../../../Domains/threads/entities/AddThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ username: 'dicoding' });
  });
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return recorded thread correctly', async () => {
      const { id } = (await UsersTableTestHelper.findUsersById('user-123'))[0];
      const addThread = new AddThread({
        title: 'dicoding',
        body: 'dicoding indonesia',
        userId: id,
      });

      const fakeIdGenerator = () => 123;

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const data = await threadRepositoryPostgres.addThread(addThread);
      const { id: threadId, body } = await ThreadTableTestHelper.findThreadById('thread-123');
      expect(threadId).toEqual(data.id);
      expect(addThread.title).toEqual(data.title);
      expect(addThread.userId).toEqual(data.owner);
      expect(addThread.body).toEqual(body);
    });
  });

  describe('getThreadById function', () => {
    it('should throw error when thread not exist in database', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.getThreadById('thread-999')).rejects.toThrowError('GET_THREAD.NO_THREAD_FOUND');
    });
    it('should return thread correctly', async () => {
      const { id: userId, username } = (await UsersTableTestHelper.findUsersById('user-123'))[0];
      await ThreadTableTestHelper
        .addThread({ userId, id: 'thread-123' });
      const {
        id,
        title,
        body,
        created_at: date,
      } = await ThreadTableTestHelper.findThreadById('thread-123');
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const data = await threadRepositoryPostgres.getThreadById('thread-123');
      expect(id).toEqual(data.id);
      expect(title).toEqual(data.title);
      expect(body).toEqual(data.body);
      expect(date).toEqual(data.date);
      expect(username).toEqual(data.username);
    });
  });

  describe('verifyThreadAvailability function', () => {
    it('should throw error when thread not exist in database', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.verifyAvailabilityThreadById('thread-999')).rejects.toThrowError('GET_THREAD.NO_THREAD_FOUND');
    });
    it('should return thread correctly', async () => {
      const { id: userId } = (await UsersTableTestHelper.findUsersById('user-123'))[0];
      await ThreadTableTestHelper
        .addThread({ userId, id: 'thread-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.verifyAvailabilityThreadById('thread-123')).resolves;
    });
  });
});
