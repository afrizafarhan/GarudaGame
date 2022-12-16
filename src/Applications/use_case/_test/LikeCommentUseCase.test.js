const LikeRepository = require('../../../Domains/likes/LikeRepository');
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
    const likeRepository = new LikeRepository();
    threadRepository.verifyAvailabilityThreadById = jest.fn()
      .mockImplementation(() => Promise.reject(Error('GET_THREAD.NO_THREAD_FOUND')));
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository,
      commentRepository,
      likeRepository,
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
    const likeRepository = new LikeRepository();
    threadRepository.verifyAvailabilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    commentRepository.verifyAvailabilityCommentByIdAndThreadId = jest.fn()
      .mockImplementation(() => Promise.reject(Error('GET_THREAD_COMMENT.NO_THREAD_COMMENT_FOUND')));
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository,
      commentRepository,
      likeRepository,
    });
    await expect(likeCommentUseCase.execute(payload)).rejects.toThrowError('GET_THREAD_COMMENT.NO_THREAD_COMMENT_FOUND');
    expect(threadRepository.verifyAvailabilityThreadById).toBeCalledWith(payload.threadId);
    expect(commentRepository.verifyAvailabilityCommentByIdAndThreadId)
      .toBeCalledWith(payload.commentId, payload.threadId);
  });
  it('should increment like correctly', async () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };
    const threadRepository = new ThreadRepository();
    const commentRepository = new CommentRepository();
    const likeRepository = new LikeRepository();
    threadRepository.verifyAvailabilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    commentRepository.verifyAvailabilityCommentByIdAndThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    likeRepository.verifyUserLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    likeRepository.addUserLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository,
      commentRepository,
      likeRepository,
    });
    await expect(likeCommentUseCase.execute(payload)).resolves.not.toThrowError('GET_THREAD_COMMENT.NO_THREAD_COMMENT_FOUND');
    await expect(likeCommentUseCase.execute(payload)).resolves.not.toThrowError('GET_THREAD.NO_THREAD_FOUND');
    expect(threadRepository.verifyAvailabilityThreadById).toBeCalledWith(payload.threadId);
    expect(commentRepository.verifyAvailabilityCommentByIdAndThreadId)
      .toBeCalledWith(payload.commentId, payload.threadId);
    expect(likeRepository.addUserLikeComment).toBeCalledWith(payload.commentId, payload.userId);
    expect(likeRepository.verifyUserLikeComment).toBeCalledWith(payload.commentId, payload.userId);
  });
  it('should decrement like correctly', async () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };
    const threadRepository = new ThreadRepository();
    const commentRepository = new CommentRepository();
    const likeRepository = new LikeRepository();
    threadRepository.verifyAvailabilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    commentRepository.verifyAvailabilityCommentByIdAndThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    likeRepository.verifyUserLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    likeRepository.deleteUserLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository,
      commentRepository,
      likeRepository,
    });
    await expect(likeCommentUseCase.execute(payload)).resolves.not.toThrowError('GET_THREAD_COMMENT.NO_THREAD_COMMENT_FOUND');
    await expect(likeCommentUseCase.execute(payload)).resolves.not.toThrowError('GET_THREAD.NO_THREAD_FOUND');
    expect(threadRepository.verifyAvailabilityThreadById).toBeCalledWith(payload.threadId);
    expect(commentRepository.verifyAvailabilityCommentByIdAndThreadId)
      .toBeCalledWith(payload.commentId, payload.threadId);
    expect(likeRepository.deleteUserLikeComment).toBeCalledWith(payload.commentId, payload.userId);
    expect(likeRepository.verifyUserLikeComment).toBeCalledWith(payload.commentId, payload.userId);
  });
});
