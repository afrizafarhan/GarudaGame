const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('AddReplyUseCase', () => {
  it('should throw error when thread not found', async () => {
    const useCasePayload = {
      content: 'dicoding',
      userId: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyAvailabilityThreadById = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('GET_THREAD.NO_THREAD_FOUND')));

    const getReply = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await expect(getReply.execute(useCasePayload)).rejects.toThrowError('GET_THREAD.NO_THREAD_FOUND');
    expect(mockThreadRepository.verifyAvailabilityThreadById).toBeCalledWith('thread-123');
  });
  it('should throw error when coment on thread not found', async () => {
    const useCasePayload = {
      content: 'dicoding',
      userId: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyAvailabilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyAvailabilityCommentByIdAndThreadId = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('GET_THREAD_COMMENT.NO_THREAD_COMMENT_FOUND')));

    const getReply = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await expect(getReply.execute(useCasePayload)).rejects.toThrowError('GET_THREAD_COMMENT.NO_THREAD_COMMENT_FOUND');
    expect(mockThreadRepository.verifyAvailabilityThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyAvailabilityCommentByIdAndThreadId).toBeCalledWith('comment-123', 'thread-123');
  });
  it('should orchestrating the add reply comment action correctly', async () => {
    const useCasePayload = {
      content: 'dicoding',
      userId: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const expectedReply = {
      id: 'reply-123',
      content: 'dicoding',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyAvailabilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyAvailabilityCommentByIdAndThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'reply-123',
        content: useCasePayload.content,
        owner: useCasePayload.userId,
      }));

    const getReply = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const recordedReply = await getReply.execute(useCasePayload);
    expect(recordedReply).toStrictEqual(expectedReply);
    expect(mockThreadRepository.verifyAvailabilityThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyAvailabilityCommentByIdAndThreadId).toBeCalledWith('comment-123', 'thread-123');
    expect(mockReplyRepository.addReply).toBeCalledWith(useCasePayload);
  });
});
