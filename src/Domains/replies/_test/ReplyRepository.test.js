const ReplyRepository = require('../ReplyRepository');

describe('Reply Repository Interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const replyRepository = new ReplyRepository();
    await expect(replyRepository.addReply({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.deleteReplyById({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.getReplyByIdAndCommentId({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.getReplyByCommentId({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
