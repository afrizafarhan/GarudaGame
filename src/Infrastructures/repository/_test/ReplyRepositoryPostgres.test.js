const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');

const AddReply = require('../../../Domains/replies/entities/AddReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ username: 'dicoding' });
    await UsersTableTestHelper.addUser({ username: 'hantu', id: 'user-124' });
  });
  afterEach(async () => {
    await ReplyTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply to a comment and return recorded reply correcly', async () => {
      await ThreadTableTestHelper.addThread({ userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({
        threadId: 'thread-123',
      });
      const addReply = new AddReply({
        content: 'dicoding',
        commentId: 'comment-123',
        userId: 'user-123',
        threadId: 'thread-123',
      });
      const fakeIdGenerator = () => 123;

      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const data = await replyRepository.addReply(addReply);
      const { comment_id: commentId } = (await ReplyTableTestHelper.findReplyById('reply-123'))[0];
      expect(data.id).toEqual(`reply-${fakeIdGenerator()}`);
      expect(data.content).toEqual(addReply.content);
      expect(data.owner).toEqual(addReply.userId);
      expect(commentId).toEqual(addReply.commentId);
    });
  });

  describe('verifyReplyByIdAndCommentId', () => {
    it('should throw error when reply not accordance to comment', async () => {
      await ThreadTableTestHelper.addThread({ userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({
        threadId: 'thread-123',
      });
      await ReplyTableTestHelper.addReply({
        userId: 'user-124',
      });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepository.verifyReplyByIdAndCommentId('reply-123', 'comment-124'))
        .rejects.toThrow('GET_REPLY.NO_REPLY_FOUND');
    });
    it('should presist get reply by id and comment id', async () => {
      await ThreadTableTestHelper.addThread({ userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({
        threadId: 'thread-123',
      });
      await ReplyTableTestHelper.addReply({
        userId: 'user-124',
      });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepository.verifyReplyByIdAndCommentId('reply-123', 'comment-123'))
        .resolves.not.toThrow('GET_REPLY.NO_REPLY_FOUND');
    });
  });

  describe('verifyOwnerReplyByIdAndUsertId', () => {
    it('should throw error when reply not accordance to comment', async () => {
      await ThreadTableTestHelper.addThread({ userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({
        threadId: 'thread-123',
      });
      await ReplyTableTestHelper.addReply({
        userId: 'user-124',
      });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepository.verifyOwnerReplyByIdAndUserId('reply-123', 'user-123'))
        .rejects.toThrow('VERIFY_OWNER_REPLY.ACCESS_FORBIDEN');
    });
    it('should presist get reply by id and comment id', async () => {
      await ThreadTableTestHelper.addThread({ userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({
        threadId: 'thread-123',
      });
      await ReplyTableTestHelper.addReply({
        userId: 'user-124',
      });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepository.verifyOwnerReplyByIdAndUserId('reply-123', 'user-124'))
        .resolves.not.toThrow('VERIFY_OWNER_REPLY.ACCESS_FORBIDEN');
    });
  });

  describe('deleteReplyById', () => {
    it('should persist delete reply by reply id', async () => {
      await ThreadTableTestHelper.addThread({ userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({
        threadId: 'thread-123',
      });
      await ReplyTableTestHelper.addReply({
        userId: 'user-124',
      });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      await replyRepository.deleteReplyById('reply-123');
      const data = (await ReplyTableTestHelper.findReplyById('reply-123'))[0];
      expect(data.is_delete).toEqual(true);
    });
  });

  describe('getReplyByCommentId', () => {
    it('should persist get reply by comments id', async () => {
      const { id, username } = (await UsersTableTestHelper.findUsersById('user-124'))[0];
      await ThreadTableTestHelper.addThread({ userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({
        threadId: 'thread-123',
      });
      const payload = {
        id: 'reply-123',
        content: 'Dicoding',
        commentId: 'comment-123',
        userId: id,
        date: new Date().toISOString(),
      };
      await ReplyTableTestHelper.addReply(payload);
      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      const data = await replyRepository.getReplyByCommentId(['comment-123']);
      expect(data).toHaveLength(1);

      expect(data[0].id).toEqual(payload.id);
      expect(data[0].content).toEqual(payload.content);
      expect(data[0].commentId).toEqual(payload.commentId);

      expect(data[0].username).toEqual(username);
      expect(data[0].is_delete).toEqual(false);
      expect(data[0].date).toEqual(payload.date);
    });
  });
});
