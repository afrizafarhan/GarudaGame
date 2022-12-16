const LikeCommentRepository = require('../LikeCommentRepository');

describe('LikeRepository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const replyRepository = new LikeCommentRepository();
    await expect(replyRepository.addUserLikeComment({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.deleteUserLikeComment({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.verifyUserLikeComment({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
