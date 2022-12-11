const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');

const pool = require('../../database/postgres/pool');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepository', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ username: 'dicoding' });
  });
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add thread and return recorded thread comment correctly', async () => {
      const userId = await UsersTableTestHelper.findUsersById('user-123');
      await ThreadTableTestHelper.addThread({ userId: userId[0].id });
      const threadId = await ThreadTableTestHelper.findThreadById('thread-123');
      const addComment = new AddComment({
        content: 'dicoding',
        threadId: threadId[0].id,
        userId: userId[0].id,
      });
      const fakeIdGenerator = () => 123;

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addComment(addComment);

      const threadComments = await ThreadCommentsTableTestHelper.findThreadCommentById('comment-123');
      expect(threadComments).toHaveLength(1);
      expect(threadComments[0].content).toEqual(addComment.content);
      expect(threadComments[0].user_id).toEqual(addComment.userId);
    });
  });

  describe('getCommentById function', () => {
    it('should persist delete thread correctly', async () => {
      const user = await UsersTableTestHelper.findUsersById('user-123');
      await UsersTableTestHelper.addUser({
        id: 'user-124',
        username: 'dicoding 123',
      });
      const secondUser = await UsersTableTestHelper.findUsersById('user-124');
      await ThreadTableTestHelper.addThread({ userId: user[0].id });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', userId: secondUser[0].id });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const data = await commentRepositoryPostgres.getCommentById('comment-123');
      expect(data.rowCount).toEqual(1);
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should persist comment thread correctly', async () => {
      const user = await UsersTableTestHelper.findUsersById('user-123');
      const secondUser = await UsersTableTestHelper.findUsersById('user-124');
      await ThreadTableTestHelper.addThread({ userId: user[0].id });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', userId: secondUser[0].id, threadId: 'thread-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const data = await commentRepositoryPostgres.getCommentByThreadId('thread-123');
      expect(data.rowCount).toEqual(1);
    });
  });

  describe('getCommentByIdAndThreadId function', () => {
    it('should persist comment thread correctly', async () => {
      const user = await UsersTableTestHelper.findUsersById('user-123');
      const secondUser = await UsersTableTestHelper.findUsersById('user-124');
      await ThreadTableTestHelper.addThread({ userId: user[0].id });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', userId: secondUser[0].id, threadId: 'thread-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const data = await commentRepositoryPostgres.getCommentByIdAndThreadId('comment-123', 'thread-123');
      expect(data.rowCount).toEqual(1);
    });
  });

  describe('deleteCommentById function', () => {
    it('should persist delete thread correctly', async () => {
      const user = await UsersTableTestHelper.findUsersById('user-123');
      const secondUser = await UsersTableTestHelper.findUsersById('user-124');
      await ThreadTableTestHelper.addThread({ userId: user[0].id });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', userId: secondUser[0].id });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const data = await commentRepositoryPostgres.deleteCommentById('comment-123');
      expect(data.rowCount).toEqual(1);
    });
  });
});
