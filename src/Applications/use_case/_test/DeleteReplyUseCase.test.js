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

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        rowCount: 0,
      }));
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

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        rowCount: 1,
      }));
    mockCommentRepository.getCommentByIdAndThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve({
        rowCount: 0,
      }));
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

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        rowCount: 1,
      }));
    mockCommentRepository.getCommentByIdAndThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve({
        rowCount: 1,
      }));
    mockReplyRepository.getReplyByIdAndCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve({
        rowCount: 0,
      }));
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

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        rowCount: 1,
      }));
    mockCommentRepository.getCommentByIdAndThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve({
        rowCount: 1,
      }));
    mockReplyRepository.getReplyByIdAndCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve({
        rowCount: 1,
        rows: [
          {
            user_id: 'user-124',
          },
        ],
      }));
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        rowCount: 1,
      }));
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
    await expect(deleteReplyUseCase.execute(payload)).rejects.toThrowError('DELETE_REPLY.ACCESS_FORBIDEN');
    expect(mockReplyRepository.getReplyByIdAndCommentId)
      .toBeCalledWith(payload.replyId, payload.commentId);
    expect(mockCommentRepository.getCommentByIdAndThreadId)
      .toBeCalledWith(payload.commentId, payload.threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(payload.threadId);
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

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        rowCount: 1,
      }));
    mockCommentRepository.getCommentByIdAndThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve({
        rowCount: 1,
      }));
    mockReplyRepository.getReplyByIdAndCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve({
        rowCount: 1,
        rows: [
          {
            user_id: 'user-123',
          },
        ],
      }));
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        rowCount: 1,
      }));
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
    const deleteReply = await deleteReplyUseCase.execute(payload);
    expect(deleteReply).toHaveProperty('rowCount');
    expect(mockReplyRepository.deleteReplyById).toBeCalledTimes(1);
    expect(mockReplyRepository.getReplyByIdAndCommentId)
      .toBeCalledWith(payload.replyId, payload.commentId);
    expect(mockCommentRepository.getCommentByIdAndThreadId)
      .toBeCalledWith(payload.commentId, payload.threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(payload.threadId);
  });
});
