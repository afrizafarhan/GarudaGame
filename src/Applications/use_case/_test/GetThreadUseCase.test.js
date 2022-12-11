const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

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
      username: 'dicoding',
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
            username: 'dicoding',
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

  it('should orchestrating the get thread with comments action correctly', async () => {
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const expectedCommentResult = {
      id: 'comment-123',
      content: 'dicoding',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
    };
    const expectedResult = new DetailThread({
      id: 'thread-123',
      title: 'dicoding',
      body: 'dicoding indonesia',
      user_id: 'user-123',
      username: 'dicoding',
      created_at: '2021-08-08T07:19:09.775Z',
      comments: [
        expectedCommentResult,
      ],
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
            username: 'dicoding',
            created_at: '2021-08-08T07:19:09.775Z',
          },
        ],
      }));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve({
        rowCount: 1,
        rows: [
          {
            id: 'comment-123',
            content: 'dicoding',
            username: 'dicoding',
            date: '2021-08-08T07:22:33.555Z',
          },
        ],
      }));
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    const getThread = await getThreadUseCase.execute('thread-123', true);
    expect(getThread).toStrictEqual(expectedResult);
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith('thread-123');
  });
  it('should orchestrating the get thread with deleted comments action correctly', async () => {
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const expectedCommentResult = {
      id: 'comment-123',
      content: '**komentar telah dihapus**',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
    };
    const expectedResult = new DetailThread({
      id: 'thread-123',
      title: 'dicoding',
      body: 'dicoding indonesia',
      user_id: 'user-123',
      username: 'dicoding',
      created_at: '2021-08-08T07:19:09.775Z',
      comments: [
        expectedCommentResult,
      ],
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
            username: 'dicoding',
            created_at: '2021-08-08T07:19:09.775Z',
          },
        ],
      }));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve({
        rowCount: 1,
        rows: [
          {
            id: 'comment-123',
            content: '**komentar telah dihapus**',
            username: 'dicoding',
            date: '2021-08-08T07:22:33.555Z',
            is_delete: true,
          },
        ],
      }));
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    const getThread = await getThreadUseCase.execute('thread-123', true);
    expect(getThread).toStrictEqual(expectedResult);
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith('thread-123');
  });
});
