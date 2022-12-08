const DetailThread = require('../DetailThread');

describe('DetailThread', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      body: 'dicoding',
    };
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload not meet data type specification', async () => {
    const payload = {
      id: 123,
      title: {},
      body: {},
      user_id: 123,
      created_at: 123,
      updated_at: 123,
    };
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create detailThread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'Dicoding',
      body: 'Dicoding Indonesia',
      user_id: 'user-123',
      created_at: new Date('2021-08-08T07:19:09.775Z').toISOString(),
      updated_at: new Date('2021-08-08T07:19:09.775Z').toISOString(),
    };
    const {
      id,
      title,
      body,
      userId,
      date,
    } = new DetailThread(payload);
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(userId).toEqual(payload.user_id);
    expect(date).toEqual(payload.created_at);
  });
});
