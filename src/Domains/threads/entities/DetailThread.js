class DetailThread {
  constructor(payload) {
    this.verifyPayload(payload);
    const {
      id,
      title,
      body,
      user_id: userId,
      created_at: createdAt,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.userId = userId;
    this.date = createdAt;
  }

  verifyPayload(payload) {
    if (!payload.id || !payload.title || !payload.body || !payload.user_id || !payload.created_at) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof payload.id !== 'string' || typeof payload.title !== 'string' || typeof payload.body !== 'string' || typeof payload.user_id !== 'string' || typeof payload.created_at !== 'string') {
      throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailThread;
