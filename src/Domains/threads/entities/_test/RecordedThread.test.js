const RecordedThread = require('../RecordedThread');

describe('a RecordedThread entites', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'abcd',
      owner: 'abcd',
    };

    expect(() => new RecordedThread(payload)).toThrowError('RECORDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: true,
      title: 1234,
      owner: {},
    };
    expect(() => new RecordedThread(payload)).toThrowError('RECORDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create recordedThread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'Dicoding',
      owner: 'user-123',
    };

    const recordedThread = new RecordedThread(payload);

    expect(recordedThread.id).toEqual(payload.id);
    expect(recordedThread.title).toEqual(payload.title);
    expect(recordedThread.owner).toEqual(payload.owner);
  });
});
