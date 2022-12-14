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
      const { body } = await ThreadTableTestHelper.findThreadById('thread-123');
      expect(data.id).toEqual(`thread-${fakeIdGenerator()}`);
      expect(data.title).toEqual(addThread.title);
      expect(data.owner).toEqual(addThread.userId);
      expect(body).toEqual(addThread.body);
    });
  });

  describe('getThreadById function', () => {
    it('should throw error when thread not exist in database', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.getThreadById('thread-999')).rejects.toThrowError('GET_THREAD.NO_THREAD_FOUND');
    });
    it('should return thread correctly', async () => {
      const { id: userId, username } = (await UsersTableTestHelper.findUsersById('user-123'))[0];
      const payload = {
        id: 'thread-123',
        title: 'Dicoding',
        body: 'Dicoding Indonesia',
        userId,
      };
      await ThreadTableTestHelper
        .addThread(payload);
      const {
        created_at: date,
      } = await ThreadTableTestHelper.findThreadById('thread-123');
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const data = await threadRepositoryPostgres.getThreadById('thread-123');
      expect(data.id).toEqual(payload.id);
      expect(data.title).toEqual(payload.title);
      expect(data.body).toEqual(payload.body);
      expect(data.date).toEqual(date);
      expect(data.username).toEqual(username);
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
      await expect(threadRepositoryPostgres.verifyAvailabilityThreadById('thread-123')).resolves.not.toThrowError(Error('GET_THREAD.NO_THREAD_FOUND'));
    });
  });
});
