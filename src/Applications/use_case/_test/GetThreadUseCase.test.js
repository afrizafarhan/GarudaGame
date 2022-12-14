const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('GetThreadUseCase', () => {
  it('should throw error when thread not found', async () => {
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('GET_THREAD.NO_THREAD_FOUND')));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    await expect(getThreadUseCase.execute('thread-123')).rejects.toThrowError('GET_THREAD.NO_THREAD_FOUND');
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
  });
  it('should orchestrating the get thread action correctly', async () => {
    const mockThreadRepository = new ThreadRepository();
    const expectedResult = {
      id: 'thread-123',
      title: 'dicoding',
      body: 'dicoding indonesia',
      username: 'dicoding',
      date: '2021-08-08T07:19:09.775Z',
    };
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'dicoding',
        body: 'dicoding indonesia',
        username: 'dicoding',
        date: '2021-08-08T07:19:09.775Z',
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
    const mockReplyRepository = new ReplyRepository();
    const expectedCommentResult = {
      id: 'comment-123',
      content: 'dicoding',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
    };
    const expectedResult = {
      id: 'thread-123',
      title: 'dicoding',
      body: 'dicoding indonesia',
      username: 'dicoding',
      date: '2021-08-08T07:19:09.775Z',
      comments: [
        expectedCommentResult,
      ],
    };
    mockThreadRepository.verifyAvailabilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'dicoding',
        body: 'dicoding indonesia',
        username: 'dicoding',
        date: '2021-08-08T07:19:09.775Z',
      }));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          content: 'dicoding',
          username: 'dicoding',
          date: '2021-08-08T07:22:33.555Z',
          is_delete: false,
        },
      ]));
    mockReplyRepository.getReplyByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve([]));
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
    const getThread = await getThreadUseCase.execute('thread-123', true);
    expect(getThread).toStrictEqual(expectedResult);
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith('thread-123');
  });
  it('should orchestrating the get thread with deleted comments action correctly', async () => {
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const expectedCommentResult = {
      id: 'comment-123',
      content: '**komentar telah dihapus**',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
    };
    const expectedResult = {
      id: 'thread-123',
      title: 'dicoding',
      body: 'dicoding indonesia',
      username: 'dicoding',
      date: '2021-08-08T07:19:09.775Z',
      comments: [
        expectedCommentResult,
      ],
    };
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'dicoding',
        body: 'dicoding indonesia',
        username: 'dicoding',
        date: '2021-08-08T07:19:09.775Z',
      }));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          content: '**komentar telah dihapus**',
          username: 'dicoding',
          date: '2021-08-08T07:22:33.555Z',
          is_delete: true,
        },
      ]));
    mockReplyRepository.getReplyByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve([]));
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
    const getThread = await getThreadUseCase.execute('thread-123', true);
    expect(getThread).toStrictEqual(expectedResult);
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith('thread-123');
  });
  it('should orchestrating the get thread with comments and reply action correctly', async () => {
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const expectedCommentResult = {
      id: 'comment-123',
      content: 'dicoding',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      replies: [
        {
          id: 'reply-123',
          content: 'Dicoding reply',
          date: '2021-08-08T07:22:33.555Z',
          username: 'Dicoding 1',
        },
        {
          id: 'reply-124',
          content: '**balasan telah dihapus**',
          date: '2021-08-08T07:22:33.555Z',
          username: 'Dicoding 2',
        },
      ],
    };
    const expectedSecondCommentResult = {
      id: 'comment-132',
      content: 'dicoding 2',
      username: 'dicoding 2',
      date: '2021-08-08T07:22:33.555Z',
      replies: [
        {
          id: 'reply-125',
          content: '**balasan telah dihapus**',
          date: '2021-08-08T07:22:33.555Z',
          username: 'Dicoding 2',
        },
      ],
    };
    const expectedResult = {
      id: 'thread-123',
      title: 'dicoding',
      body: 'dicoding indonesia',
      username: 'dicoding',
      date: '2021-08-08T07:19:09.775Z',
      comments: [
        expectedCommentResult,
        expectedSecondCommentResult,
      ],
    };
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'dicoding',
        body: 'dicoding indonesia',
        username: 'dicoding',
        date: '2021-08-08T07:19:09.775Z',
      }));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          content: 'dicoding',
          username: 'dicoding',
          date: '2021-08-08T07:22:33.555Z',
          is_delete: false,
        },
        {
          id: 'comment-132',
          content: 'dicoding 2',
          username: 'dicoding 2',
          date: '2021-08-08T07:22:33.555Z',
          is_delete: false,
        },
      ]));
    mockReplyRepository.getReplyByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'reply-123',
          content: 'Dicoding reply',
          username: 'Dicoding 1',
          date: '2021-08-08T07:22:33.555Z',
          commentId: 'comment-123',
          is_delete: false,
        },
        {
          id: 'reply-124',
          content: '**balasan telah dihapus**',
          username: 'Dicoding 2',
          date: '2021-08-08T07:22:33.555Z',
          commentId: 'comment-123',
          is_delete: true,
        },
        {
          id: 'reply-125',
          content: '**balasan telah dihapus**',
          username: 'Dicoding 2',
          date: '2021-08-08T07:22:33.555Z',
          commentId: 'comment-132',
          is_delete: true,
        },
      ]));
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
    const getThread = await getThreadUseCase.execute('thread-123', true);
    expect(getThread).toStrictEqual(expectedResult);
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith('thread-123');
  });
});
