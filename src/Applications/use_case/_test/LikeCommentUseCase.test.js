const LikeCommentRepository = require('../../../Domains/likes/LikeCommentRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase.test.js', () => {
  it('should throw error when thread not found', async () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };
    const threadRepository = new ThreadRepository();
    const commentRepository = new CommentRepository();
    const likeCommentRepository = new LikeCommentRepository();
    threadRepository.verifyAvailabilityThreadById = jest.fn()
      .mockImplementation(() => Promise.reject(Error('GET_THREAD.NO_THREAD_FOUND')));
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository,
      commentRepository,
      likeCommentRepository,
    });
    await expect(likeCommentUseCase.execute(payload)).rejects.toThrowError('GET_THREAD.NO_THREAD_FOUND');
    expect(threadRepository.verifyAvailabilityThreadById).toBeCalledWith(payload.threadId);
  });
  it('should throw error when comment not found in thread', async () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };
    const threadRepository = new ThreadRepository();
    const commentRepository = new CommentRepository();
    const likeCommentRepository = new LikeCommentRepository();
    threadRepository.verifyAvailabilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    commentRepository.verifyAvailabilityCommentByIdAndThreadId = jest.fn()
      .mockImplementation(() => Promise.reject(Error('GET_THREAD_COMMENT.NO_THREAD_COMMENT_FOUND')));
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository,
      commentRepository,
      likeCommentRepository,
    });
    await expect(likeCommentUseCase.execute(payload)).rejects.toThrowError('GET_THREAD_COMMENT.NO_THREAD_COMMENT_FOUND');
    expect(threadRepository.verifyAvailabilityThreadById).toBeCalledWith(payload.threadId);
    expect(commentRepository.verifyAvailabilityCommentByIdAndThreadId)
      .toBeCalledWith(payload.commentId, payload.threadId);
  });
  it('should like comment correctly', async () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };
    const threadRepository = new ThreadRepository();
    const commentRepository = new CommentRepository();
    const likeCommentRepository = new LikeCommentRepository();
    threadRepository.verifyAvailabilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    commentRepository.verifyAvailabilityCommentByIdAndThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    commentRepository.incrementLikeCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    likeCommentRepository.verifyUserLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    likeCommentRepository.addUserLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository,
      commentRepository,
      likeCommentRepository,
    });
    await expect(likeCommentUseCase.execute(payload)).resolves.not.toThrowError('GET_THREAD_COMMENT.NO_THREAD_COMMENT_FOUND');
    await expect(likeCommentUseCase.execute(payload)).resolves.not.toThrowError('GET_THREAD.NO_THREAD_FOUND');
    expect(threadRepository.verifyAvailabilityThreadById).toBeCalledWith(payload.threadId);
    expect(commentRepository.verifyAvailabilityCommentByIdAndThreadId)
      .toBeCalledWith(payload.commentId, payload.threadId);
    expect(likeCommentRepository.addUserLikeComment)
      .toBeCalledWith(payload.commentId, payload.userId);
    expect(likeCommentRepository.verifyUserLikeComment)
      .toBeCalledWith(payload.commentId, payload.userId);
    expect(commentRepository.incrementLikeCommentById).toBeCalledWith(payload.commentId);
  });
  it('should dislike comment correctly', async () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };
    const threadRepository = new ThreadRepository();
    const commentRepository = new CommentRepository();
    const likeCommentRepository = new LikeCommentRepository();
    threadRepository.verifyAvailabilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    commentRepository.verifyAvailabilityCommentByIdAndThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    commentRepository.decrementLikeCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    likeCommentRepository.verifyUserLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    likeCommentRepository.deleteUserLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository,
      commentRepository,
      likeCommentRepository,
    });
    await expect(likeCommentUseCase.execute(payload)).resolves.not.toThrowError('GET_THREAD_COMMENT.NO_THREAD_COMMENT_FOUND');
    await expect(likeCommentUseCase.execute(payload)).resolves.not.toThrowError('GET_THREAD.NO_THREAD_FOUND');
    expect(threadRepository.verifyAvailabilityThreadById).toBeCalledWith(payload.threadId);
    expect(commentRepository.verifyAvailabilityCommentByIdAndThreadId)
      .toBeCalledWith(payload.commentId, payload.threadId);
    expect(likeCommentRepository.deleteUserLikeComment)
      .toBeCalledWith(payload.commentId, payload.userId);
    expect(likeCommentRepository.verifyUserLikeComment)
      .toBeCalledWith(payload.commentId, payload.userId);
    expect(commentRepository.decrementLikeCommentById).toBeCalledWith(payload.commentId);
  });
});
