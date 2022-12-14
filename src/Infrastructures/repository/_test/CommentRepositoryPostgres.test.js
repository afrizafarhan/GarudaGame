const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');

const pool = require('../../database/postgres/pool');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepository', () => {
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

  describe('addComment function', () => {
    it('should persist add thread and return recorded thread comment correctly', async () => {
      const userId = await UsersTableTestHelper.findUsersById('user-123');
      await ThreadTableTestHelper.addThread({ userId: userId[0].id });
      const threadId = await ThreadTableTestHelper.findThreadById('thread-123');
      const addComment = new AddComment({
        content: 'dicoding',
        threadId: threadId.id,
        userId: userId[0].id,
      });
      const fakeIdGenerator = () => 123;

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const comment = await commentRepositoryPostgres.addComment(addComment);

      const threadComments = await ThreadCommentsTableTestHelper.findThreadCommentById('comment-123');
      expect(comment.id).toEqual(`comment-${fakeIdGenerator()}`);
      expect(comment.content).toEqual(addComment.content);
      expect(comment.owner).toEqual(addComment.userId);

      expect(threadComments[0].thread_id).toEqual(addComment.threadId);
      expect(threadComments[0].id).toEqual(`comment-${fakeIdGenerator()}`);
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should persist get comment by thread correctly', async () => {
      const user = await UsersTableTestHelper.findUsersById('user-123');
      const secondUser = await UsersTableTestHelper.findUsersById('user-124');
      const payload = {
        id: 'comment-123',
        content: 'Dicoding',
        threadId: 'thread-123',
        userId: secondUser[0].id,
      };
      await ThreadTableTestHelper.addThread({ userId: user[0].id });
      await ThreadCommentsTableTestHelper.addThreadComment(payload);
      const getComment = (await ThreadCommentsTableTestHelper.findThreadCommentById('comment-123'))[0];
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const data = await commentRepositoryPostgres.getCommentByThreadId('thread-123');
      expect(data).toHaveLength(1);
      expect(data[0].id).toEqual(payload.id);
      expect(data[0].content).toEqual(payload.content);
      expect(data[0].date).toEqual(getComment.created_at);
      expect(data[0].username).toEqual(secondUser[0].username);
      expect(data[0].is_delete).toEqual(false);
    });
  });

  describe('deleteCommentById function', () => {
    it('should persist delete thread correctly', async () => {
      const user = await UsersTableTestHelper.findUsersById('user-123');
      const secondUser = await UsersTableTestHelper.findUsersById('user-124');
      await ThreadTableTestHelper.addThread({ userId: user[0].id });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', userId: secondUser[0].id });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await commentRepositoryPostgres.deleteCommentById('comment-123');
      const threadComment = await ThreadCommentsTableTestHelper.findThreadCommentById('comment-123');
      expect(threadComment[0].is_delete).toEqual(true);
    });
  });

  describe('verifyAvailabilityCommentByIdAndThreadId function', () => {
    it('should throw error when comment id not accordance with thread id', async () => {
      const user = await UsersTableTestHelper.findUsersById('user-123');
      const secondUser = await UsersTableTestHelper.findUsersById('user-124');
      await ThreadTableTestHelper.addThread({ userId: user[0].id });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', userId: secondUser[0].id, threadId: 'thread-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepositoryPostgres.verifyAvailabilityCommentByIdAndThreadId('comment-123', 'thread-124'))
        .rejects.toThrowError('GET_THREAD_COMMENT.NO_THREAD_COMMENT_FOUND');
    });
    it('should not throw error when comment accordance with thread', async () => {
      const user = await UsersTableTestHelper.findUsersById('user-123');
      const secondUser = await UsersTableTestHelper.findUsersById('user-124');
      await ThreadTableTestHelper.addThread({ userId: user[0].id });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', userId: secondUser[0].id, threadId: 'thread-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepositoryPostgres.verifyAvailabilityCommentByIdAndThreadId('comment-123', 'thread-123'))
        .resolves.not.toThrowError('GET_THREAD_COMMENT.NO_THREAD_COMMENT_FOUND');
    });
  });

  describe('verifyOwnerCommentByIdAndUserId function', () => {
    it('should throw error when comment tried to access by a user who does not have permission', async () => {
      const user = await UsersTableTestHelper.findUsersById('user-123');
      const secondUser = await UsersTableTestHelper.findUsersById('user-124');
      await ThreadTableTestHelper.addThread({ userId: user[0].id });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', userId: secondUser[0].id, threadId: 'thread-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepositoryPostgres.verifyOwnerCommentByIdAndUserId('comment-123', 'user-123'))
        .rejects.toThrowError('VERIFY_COMMENT_OWNER.ACCESS_FORBIDEN');
    });
    it('should not throw error when user try to delete their reply', async () => {
      const user = await UsersTableTestHelper.findUsersById('user-123');
      const secondUser = await UsersTableTestHelper.findUsersById('user-124');
      await ThreadTableTestHelper.addThread({ userId: user[0].id });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', userId: secondUser[0].id, threadId: 'thread-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepositoryPostgres.verifyOwnerCommentByIdAndUserId('comment-123', secondUser[0].id))
        .resolves.not.toThrowError('VERIFY_COMMENT_OWNER.ACCESS_FORBIDEN');
    });
  });
});
