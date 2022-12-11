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
      expect(data.rows).toHaveLength(1);
    });
  });

  describe('getReplyByIdAndCommentId', () => {
    it('should presist get reply by id and comment id', async () => {
      await ThreadTableTestHelper.addThread({ userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({
        threadId: 'thread-123',
      });
      await UsersTableTestHelper.addUser({ username: 'hantu', id: 'user-124' });
      await ReplyTableTestHelper.addReply({
        userId: 'user-124',
      });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      const data = await replyRepository.getReplyByIdAndCommentId('reply-123', 'comment-123');
      expect(data.rowCount).toEqual(1);
    });
  });

  describe('getReplyByCommentId', () => {
    it('should persist get reply by comments id', async () => {
      await ThreadTableTestHelper.addThread({ userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addThreadComment({
        threadId: 'thread-123',
      });
      await ReplyTableTestHelper.addReply({
        userId: 'user-124',
      });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      const data = await replyRepository.getReplyByCommentId(['comment-123']);
      expect(data.rowCount).toEqual(1);
    });
  });
});
