const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const LikeCommentTableTestHelper = require('../../../../tests/LikeCommentTableTestHelper');

const pool = require('../../database/postgres/pool');
const LikeCommentRepositoryPostgres = require('../LikeCommentRepositoryPostgres');

describe('LikeCommentRepository', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ username: 'dicoding' });
    await UsersTableTestHelper.addUser({ id: 'user-124', username: 'hantu' });
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
  describe('addUserLikeComment function', () => {
    it('should persist add user like correctly', async () => {
      const user = await UsersTableTestHelper.findUsersById('user-123');
      const secondUser = await UsersTableTestHelper.findUsersById('user-124');
      await ThreadTableTestHelper.addThread({ userId: user[0].id });
      const payload = {
        id: 'comment-123',
        content: 'Dicoding',
        threadId: 'thread-123',
        userId: secondUser[0].id,
        date: new Date().toISOString(),
        likes: 0,
      };
      await ThreadCommentsTableTestHelper.addThreadComment(payload);
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool);
      const addLike = await likeCommentRepositoryPostgres.addUserLikeComment(payload.id, 'user-123');
      expect(addLike.commentId).toEqual(payload.id);
      expect(addLike.userId).toEqual('user-123');
    });
  });
  describe('deleteUserLikeComment function', () => {
    it('should persist add user like correctly', async () => {
      const user = await UsersTableTestHelper.findUsersById('user-123');
      const secondUser = await UsersTableTestHelper.findUsersById('user-124');
      await ThreadTableTestHelper.addThread({ userId: user[0].id });
      const payload = {
        id: 'comment-123',
        content: 'Dicoding',
        threadId: 'thread-123',
        userId: secondUser[0].id,
        date: new Date().toISOString(),
        likes: 0,
      };
      await ThreadCommentsTableTestHelper.addThreadComment(payload);
      await LikeCommentTableTestHelper.addLikeComment({ commentId: payload.id, userId: 'user-123' });
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool);
      const addLike = await likeCommentRepositoryPostgres.deleteUserLikeComment(payload.id, 'user-123');
      expect(addLike.commentId).toEqual(payload.id);
      expect(addLike.userId).toEqual('user-123');
    });
  });

  describe('verifyUserLikeComment function', () => {
    it('should return true when like not found', async () => {
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool);
      const result = await likeCommentRepositoryPostgres.verifyUserLikeComment('comment-123', 'user-123');
      expect(result).toEqual(true);
    });
    it('should return false when like found', async () => {
      const user = await UsersTableTestHelper.findUsersById('user-123');
      const secondUser = await UsersTableTestHelper.findUsersById('user-124');
      await ThreadTableTestHelper.addThread({ userId: user[0].id });
      const payload = {
        id: 'comment-123',
        content: 'Dicoding',
        threadId: 'thread-123',
        userId: secondUser[0].id,
        date: new Date().toISOString(),
        likes: 0,
      };
      await ThreadCommentsTableTestHelper.addThreadComment(payload);
      await LikeCommentTableTestHelper.addLikeComment({ commentId: payload.id, userId: 'user-123' });
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool);
      const result = await likeCommentRepositoryPostgres.verifyUserLikeComment('comment-123', 'user-123');
      expect(result).toEqual(false);
    });
  });
});
