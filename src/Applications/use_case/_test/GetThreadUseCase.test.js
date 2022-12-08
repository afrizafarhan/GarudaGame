const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');

describe('GetThreadUseCase', () => {
  it('should throw error when thread not found', async () => {
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({ rowCount: 0 }));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    await expect(getThreadUseCase.execute('thread-123')).rejects.toThrowError('GET_THREAD.NO_THREAD_FOUND');
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
  });
  it('should orchestrating the get thread action correctly', async () => {
    const mockThreadRepository = new ThreadRepository();
    const expectedResult = new DetailThread({
      id: 'thread-123',
      title: 'dicoding',
      body: 'dicoding indonesia',
      user_id: 'user-123',
      created_at: '2021-08-08T07:19:09.775Z',
    });
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        rowCount: 1,
        rows: [
          {
            id: 'thread-123',
            title: 'dicoding',
            body: 'dicoding indonesia',
            user_id: 'user-123',
            created_at: '2021-08-08T07:19:09.775Z',
          },
        ],
      }));
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });
    const getThread = await getThreadUseCase.execute('thread-123');
    expect(getThread).toStrictEqual(expectedResult);
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
  });
});
