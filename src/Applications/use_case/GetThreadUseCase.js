class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.replyRepository = replyRepository;
  }

  async execute(threadId, withComment = false) {
    const data = await this.threadRepository.getThreadById(threadId);
    let comments;
    if (withComment) {
      const commentId = [];
      comments = (await this.commentRepository.getCommentByThreadId(threadId))
        .map((val) => {
          commentId.push(val.id);
          return {
            id: val.id,
            username: val.username,
            date: val.date,
            content: val.is_delete ? '**komentar telah dihapus**' : val.content,
            replies: [],
          };
        });
      (await this.replyRepository.getReplyByCommentId(commentId))
        .forEach((reply) => {
          comments.forEach((val) => {
            if (val.id === reply.commentId) {
              val.replies.push({
                id: reply.id,
                username: reply.username,
                date: reply.date,
                content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
              });
            }
          });
        });
      comments = comments.map((val) => {
        if (val.replies.length === 0) {
          return {
            id: val.id,
            username: val.username,
            date: val.date,
            content: val.content,
          };
        }
        return val;
      });
    }
    if (comments) {
      data.comments = comments;
    }
    return data;
  }
}

module.exports = GetThreadUseCase;
