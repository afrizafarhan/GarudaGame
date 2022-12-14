const AddThread = require('../AddThread');

describe('AddThread Entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    const payload = {
      title: 'abc',
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload dit not meet data type specification', () => {
    const payload = {
      title: true,
      body: 123,
      userId: 123,
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addThread object correctly', () => {
    const payload = {
      title: 'abc',
      body: 'abc',
      userId: 'user-123',
    };

    const { title, body, userId } = new AddThread(payload);

    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(userId).toEqual(payload.userId);
  });
});
