class DetailThread {
  constructor(payload, withComment = false) {
    this.verifyPayload(payload, withComment);
    const {
      id,
      title,
      body,
      user_id: userId,
      created_at: createdAt,
      username,
      comments,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.userId = userId;
    this.date = createdAt;
    this.username = username;
    this.comments = comments;
  }

  verifyPayload(payload, withComment) {
    if (!payload.id || !payload.title || !payload.body || !payload.user_id
      || !payload.created_at || !payload.username) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (withComment && !payload.comments) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof payload.id !== 'string' || typeof payload.title !== 'string' || typeof payload.body !== 'string' || typeof payload.user_id !== 'string' || typeof payload.created_at !== 'string' || typeof payload.username !== 'string') {
      throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    if (withComment && typeof payload.comments !== 'object') {
      throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailThread;
