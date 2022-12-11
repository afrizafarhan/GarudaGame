class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.replyRepository = replyRepository;
  }

  async execute(threadId, withComment = false) {
    const { rowCount, rows: data } = await this.threadRepository.getThreadById(threadId);
    if (!rowCount) {
      throw new Error('GET_THREAD.NO_THREAD_FOUND');
    }
    let comments;
    if (withComment) {
      const commentId = [];
      comments = (await this.commentRepository.getCommentByThreadId(threadId))
        .rows.map((val) => {
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
        .rows.forEach((reply) => {
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
    const payload = {
      ...data[0],
    };
    if (comments) {
      payload.comments = comments;
    }
    return payload;
  }
}

module.exports = GetThreadUseCase;
