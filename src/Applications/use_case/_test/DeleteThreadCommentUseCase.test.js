const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('DeleteThreadCommentUseCase', () => {
  it('should throw error when thread not found', async () => {
    const mockRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123',
    };

    mockRepository.verifyAvailabilityThreadById = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('GET_THREAD.NO_THREAD_FOUND')));
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadRepository: mockRepository,
      commentRepository: mockCommentRepository,
    });
    await expect(deleteThreadCommentUseCase.execute(payload)).rejects.toThrowError('GET_THREAD.NO_THREAD_FOUND');
    expect(mockRepository.verifyAvailabilityThreadById).toBeCalledWith('thread-123');
  });
  it('should throw error when comment not found in thread', async () => {
    const mockRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123',
    };

    mockRepository.verifyAvailabilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailabilityCommentByIdAndThreadId = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('GET_THREAD_COMMENT.NO_THREAD_COMMENT_FOUND')));
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadRepository: mockRepository,
      commentRepository: mockCommentRepository,
    });
    await expect(deleteThreadCommentUseCase.execute(payload)).rejects.toThrowError('GET_THREAD_COMMENT.NO_THREAD_COMMENT_FOUND');
    expect(mockRepository.verifyAvailabilityThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyAvailabilityCommentByIdAndThreadId).toBeCalledWith('comment-123', 'thread-123');
  });
  it('should throw error when user try delete another user comment', async () => {
    const mockRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123',
    };

    mockRepository.verifyAvailabilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailabilityCommentByIdAndThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyOwnerCommentByIdAndUserId = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('VERIFY_COMMENT_OWNER.ACCESS_FORBIDEN')));
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadRepository: mockRepository,
      commentRepository: mockCommentRepository,
    });
    await expect(deleteThreadCommentUseCase.execute(payload)).rejects.toThrowError('VERIFY_COMMENT_OWNER.ACCESS_FORBIDEN');
    expect(mockRepository.verifyAvailabilityThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyAvailabilityCommentByIdAndThreadId).toBeCalledWith('comment-123', 'thread-123');
    expect(mockCommentRepository.verifyOwnerCommentByIdAndUserId).toBeCalledWith('comment-123', 'user-123');
  });
  it('should delete comment thread correcly', async () => {
    const mockRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123',
    };

    mockRepository.verifyAvailabilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailabilityCommentByIdAndThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyOwnerCommentByIdAndUserId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadRepository: mockRepository,
      commentRepository: mockCommentRepository,
    });
    await deleteThreadCommentUseCase.execute(payload);
    expect(mockRepository.verifyAvailabilityThreadById).toBeCalledWith(payload.threadId);
    expect(mockCommentRepository.verifyAvailabilityCommentByIdAndThreadId)
      .toBeCalledWith(payload.commentId, payload.threadId);
    expect(mockCommentRepository.verifyOwnerCommentByIdAndUserId)
      .toBeCalledWith(payload.commentId, payload.userId);
    expect(mockCommentRepository.deleteCommentById).toBeCalledTimes(1);
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(payload.commentId);
  });
});
