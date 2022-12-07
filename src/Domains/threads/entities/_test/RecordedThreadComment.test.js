const RecordedCommentThread = require('../RecordedThreadComment');

describe('RecordedThreadComment', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'dicoding',
      owner: 'user-123',
    };
    expect(() => new RecordedCommentThread(payload)).toThrowError('RECORDED_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: 123,
      owner: {},
    };

    expect(() => new RecordedCommentThread(payload)).toThrowError('RECORDED_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create recoredThreadComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'dicoding',
      owner: 'user-213',
    };

    const { id, content, owner } = new RecordedCommentThread(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
