const DetailThreadComment = require('../DetailThreadComment');

describe('DetailThreadComment entities', () => {
  it('should throw error when payload not contain needed property', async () => {
    const payload = {
      content: 'dicoding',
    };
    expect(() => new DetailThreadComment(payload)).toThrowError('DETAIL_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload not meet data type specification', async () => {
    const payload = {
      id: 123,
      username: {},
      created_at: 123,
      content: 'Mantap',
    };
    expect(() => new DetailThreadComment(payload)).toThrowError('DETAIL_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create detailThreadComment object correctly', async () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      created_at: new Date('2021-08-08T07:19:09.775Z').toISOString(),
      content: 'Dicoding indonesia',
    };
    const {
      id,
      username,
      date,
      content,
    } = new DetailThreadComment(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.created_at);
    expect(content).toEqual(payload.content);
  });
});
