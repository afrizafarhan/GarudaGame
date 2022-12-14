const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await ThreadCommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });
  let accessToken = '';
  let userData;
  beforeAll(async () => {
    const requestPayload = {
      username: 'dicoding',
      password: 'secret',
    };
    const server = await createServer(container);
    // add user
    const userResponse = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });
    userData = JSON.parse(userResponse.payload).data;

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: requestPayload,
    });
    const responseJson = JSON.parse(response.payload);
    accessToken = responseJson.data.accessToken;
  });
  describe('when POST /threads', () => {
    it('should response 401, if request not given access token', async () => {
      const requestPayload = {
        title: 'Dicoding',
        body: 'Dicoding indonesia',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson).toHaveProperty('error');
      expect(responseJson).toHaveProperty('message');
      expect(responseJson.error).toEqual('Unauthorized');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {
        title: 'Dicoding',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(responseJson).toHaveProperty('status');
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = {
        title: 123,
        body: true,
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(responseJson).toHaveProperty('status');
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('title dan body harus string');
    });

    it('should response 201', async () => {
      const requestPayload = {
        title: 'Dicoding',
        body: 'Dicoding indonesia',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(typeof responseJson.data).toEqual('object');

      expect(responseJson.data).toHaveProperty('addedThread');
      expect(responseJson.data.addedThread).toHaveProperty('id');
      expect(responseJson.data.addedThread).toHaveProperty('title');
      expect(responseJson.data.addedThread).toHaveProperty('owner');

      expect(responseJson.data.addedThread.title).toEqual(requestPayload.title);
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 404 where thread not found', async () => {
      const server = await createServer(container);
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-125',
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
    it('should response 200 get thread without comment', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'hantu' });
      await ThreadTableTestHelper.addThread({ userId: userData.addedUser.id });
      const server = await createServer(container);
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(typeof responseJson.data).toEqual('object');
      expect(typeof responseJson.data.thread).toEqual('object');
      expect(responseJson.data.thread).toHaveProperty('id');
      expect(responseJson.data.thread).toHaveProperty('title');
      expect(responseJson.data.thread).toHaveProperty('body');
      expect(responseJson.data.thread).toHaveProperty('date');
      expect(responseJson.data.thread).toHaveProperty('username');
      expect(responseJson.data.thread).toHaveProperty('comments');
    });
    it('should response 200 get thread with comment', async () => {
      const secondUser = await UsersTableTestHelper.findUsersById('user-124');
      await ThreadTableTestHelper.addThread({ userId: userData.addedUser.id });
      await ThreadCommentTableTestHelper.addThreadComment({ id: 'comment-123', userId: secondUser[0].id, threadId: 'thread-123' });
      const server = await createServer(container);
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(typeof responseJson.data).toEqual('object');

      expect(typeof responseJson.data.thread).toEqual('object');
      expect(responseJson.data.thread).toHaveProperty('id');
      expect(responseJson.data.thread).toHaveProperty('title');
      expect(responseJson.data.thread).toHaveProperty('body');
      expect(responseJson.data.thread).toHaveProperty('date');
      expect(responseJson.data.thread).toHaveProperty('username');
      expect(responseJson.data.thread).toHaveProperty('comments');
      expect(typeof responseJson.data.thread.comments).toEqual('array');
      expect(responseJson.data.thread.comments[0]).toHaveProperty('id');
      expect(responseJson.data.thread.comments[0]).toHaveProperty('username');
      expect(responseJson.data.thread.comments[0]).toHaveProperty('date');
      expect(responseJson.data.thread.comments[0]).toHaveProperty('content');
    });
    it('should response 200 get thread with comment and replies', async () => {
      const secondUser = await UsersTableTestHelper.findUsersById('user-124');
      await ThreadTableTestHelper.addThread({ userId: userData.addedUser.id });
      await ThreadCommentTableTestHelper.addThreadComment({ id: 'comment-123', userId: secondUser[0].id, threadId: 'thread-123' });
      await ReplyTableTestHelper.addReply({ userId: userData.addedUser.id, content: 'xixixi', commentId: 'comment-123' });
      const server = await createServer(container);
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(typeof responseJson.data).toEqual('object');

      expect(typeof responseJson.data.thread).toEqual('object');
      expect(responseJson.data.thread).toHaveProperty('id');
      expect(responseJson.data.thread).toHaveProperty('title');
      expect(responseJson.data.thread).toHaveProperty('body');
      expect(responseJson.data.thread).toHaveProperty('date');
      expect(responseJson.data.thread).toHaveProperty('username');
      expect(responseJson.data.thread).toHaveProperty('comments');

      expect(typeof responseJson.data.thread.comments).toEqual('array');
      expect(responseJson.data.thread.comments[0]).toHaveProperty('id');
      expect(responseJson.data.thread.comments[0]).toHaveProperty('username');
      expect(responseJson.data.thread.comments[0]).toHaveProperty('date');
      expect(responseJson.data.thread.comments[0]).toHaveProperty('content');
      expect(responseJson.data.thread.comments[0]).toHaveProperty('replies');

      expect(typeof responseJson.data.thread.comments[0].replies).toEqual('array');
      expect(responseJson.data.thread.comments[0].replies).toHaveProperty('id');
      expect(responseJson.data.thread.comments[0].replies).toHaveProperty('content');
      expect(responseJson.data.thread.comments[0].replies).toHaveProperty('date');
      expect(responseJson.data.thread.comments[0].replies).toHaveProperty('username');
    });
  });
});
