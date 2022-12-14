const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should throw error when delete reply thread not found', async () => {
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();

    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123',
      replyId: 'reply-123',
    };

    mockThreadRepository.verifyAvailabilityThreadById = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('GET_THREAD.NO_THREAD_FOUND')));
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
    await expect(deleteReplyUseCase.execute(payload)).rejects.toThrowError('GET_THREAD.NO_THREAD_FOUND');
  });
  it('should throw error when delete reply comment not found', async () => {
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();

    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123',
      replyId: 'reply-123',
    };

    mockThreadRepository.verifyAvailabilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailabilityCommentByIdAndThreadId = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('GET_THREAD_COMMENT.NO_THREAD_COMMENT_FOUND')));
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
    await expect(deleteReplyUseCase.execute(payload)).rejects.toThrowError('GET_THREAD_COMMENT.NO_THREAD_COMMENT_FOUND');
  });
  it('should throw error when delete reply comment not found', async () => {
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();

    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123',
      replyId: 'reply-123',
    };

    mockThreadRepository.verifyAvailabilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailabilityCommentByIdAndThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyByIdAndCommentId = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('GET_REPLY.NO_REPLY_FOUND')));
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
    await expect(deleteReplyUseCase.execute(payload)).rejects.toThrowError('GET_REPLY.NO_REPLY_FOUND');
  });
  it('should throw error acceess forbiden', async () => {
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();

    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123',
      replyId: 'reply-123',
    };

    mockThreadRepository.verifyAvailabilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailabilityCommentByIdAndThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyByIdAndCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyOwnerReplyByIdAndUserId = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('VERIFY_OWNER_REPLY.ACCESS_FORBIDEN')));
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
    await expect(deleteReplyUseCase.execute(payload)).rejects.toThrowError('VERIFY_OWNER_REPLY.ACCESS_FORBIDEN');
    expect(mockThreadRepository.verifyAvailabilityThreadById).toBeCalledWith(payload.threadId);
    expect(mockCommentRepository.verifyAvailabilityCommentByIdAndThreadId)
      .toBeCalledWith(payload.commentId, payload.threadId);
    expect(mockReplyRepository.verifyReplyByIdAndCommentId)
      .toBeCalledWith(payload.replyId, payload.commentId);
    expect(mockReplyRepository.verifyOwnerReplyByIdAndUserId)
      .toBeCalledWith(payload.replyId, payload.userId);
  });
  it('should delete reply correctly', async () => {
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();

    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123',
      replyId: 'reply-123',
    };

    mockThreadRepository.verifyAvailabilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailabilityCommentByIdAndThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyByIdAndCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyOwnerReplyByIdAndUserId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
    await deleteReplyUseCase.execute(payload);
    expect(mockThreadRepository.verifyAvailabilityThreadById).toBeCalledWith(payload.threadId);

    expect(mockCommentRepository.verifyAvailabilityCommentByIdAndThreadId)
      .toBeCalledWith(payload.commentId, payload.threadId);

    expect(mockReplyRepository.verifyReplyByIdAndCommentId)
      .toBeCalledWith(payload.replyId, payload.commentId);
    expect(mockReplyRepository.verifyOwnerReplyByIdAndUserId)
      .toBeCalledWith(payload.replyId, payload.userId);

    expect(mockReplyRepository.deleteReplyById).toBeCalledTimes(1);
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(payload.replyId);
  });
});
