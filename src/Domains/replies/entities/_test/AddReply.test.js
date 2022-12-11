const AddThreadCommentReply = require('../AddReply');

describe('AddThreadComment Entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    const payload = {
      content: 'abc',
      commentId: 'comment-123',
    };

    expect(() => new AddThreadCommentReply(payload)).toThrowError('ADD_THREAD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: true,
      userId: 123,
      commentId: 123,
    };

    expect(() => new AddThreadCommentReply(payload)).toThrowError('ADD_THREAD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addThreadCommentReply object correctly', () => {
    const payload = {
      content: 'dicoding',
      userId: 'user-123',
      commentId: 'comment-123',
    };

    const { content, userId, commentId } = new AddThreadCommentReply(payload);

    expect(content).toEqual(payload.content);
    expect(userId).toEqual(payload.userId);
    expect(commentId).toEqual(payload.commentId);
  });
});
