const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadCommentUseCase = require('../AddThreadCommentUseCase');

describe('AddThreadCommentUseCase', () => {
  it('should orchestrating the add comment thread action correctly', async () => {
    const useCasePayload = new AddComment({
      content: 'dicoding',
      userId: 'user-123',
      threadId: 'thread-123',
    });

    const expectedRecordedCommentThread = {
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: useCasePayload.userId,
      }));

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        rowCount: 1,
      }));

    const getThreadCommentUseCase = new AddThreadCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const recordedCommentThread = await getThreadCommentUseCase.execute(useCasePayload);
    expect(recordedCommentThread).toStrictEqual(expectedRecordedCommentThread);
    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
      content: useCasePayload.content,
      userId: useCasePayload.userId,
      threadId: useCasePayload.threadId,
    }));
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
  });
});
