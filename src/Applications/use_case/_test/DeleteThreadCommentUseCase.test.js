const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteThreadCommentUseCase', () => {
  it('should throw error when comment not found', async () => {
    const mockRepository = new ThreadRepository();
    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123',
    };

    mockRepository.getThreadCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        rowCount: 0,
      }));
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadRepository: mockRepository,
    });
    await expect(deleteThreadCommentUseCase.execute(payload)).rejects.toThrowError('GET_THREAD_COMMENT.NOT_THREAD_COMMENT_FOUND');
    expect(mockRepository.getThreadCommentById).toBeCalledWith('comment-123', 'thread-123');
  });
  it('should throw error when user try delete another user comment', async () => {
    const mockRepository = new ThreadRepository();
    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123',
    };

    mockRepository.getThreadCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        rowCount: 1,
        rows: [
          {
            id: 'comment-123',
            user_id: 'user-124',
          },
        ],
      }));
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadRepository: mockRepository,
    });
    await expect(deleteThreadCommentUseCase.execute(payload)).rejects.toThrowError('DELETE_THREAD_COMMENT.ACCESS_FORBIDEN');
    expect(mockRepository.getThreadCommentById).toBeCalledWith('comment-123', 'thread-123');
  });
  it('should delete comment thread correcly', async () => {
    const mockRepository = new ThreadRepository();
    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123',
    };
    const expected = {
      rowCount: 1,
      rows: [
        {
          id: 'comment-123',
          user_id: 'user-123',
        },
      ],
    };

    mockRepository.getThreadCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        rowCount: 1,
        rows: [
          {
            id: 'comment-123',
            user_id: 'user-123',
          },
        ],
      }));
    mockRepository.deleteThreadCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        rowCount: 1,
        rows: [
          {
            id: 'comment-123',
            user_id: 'user-123',
          },
        ],
      }));
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadRepository: mockRepository,
    });
    await expect(deleteThreadCommentUseCase.execute(payload)).resolves.toStrictEqual(expected);
    expect(mockRepository.getThreadCommentById).toBeCalledWith('comment-123', 'thread-123');
  });
});
