import { jest } from '@jest/globals';

// mock notificationService so no real IO
jest.unstable_mockModule('../src/libs/notificationService.js', () => ({
  createAndEmitNotification: jest.fn().mockResolvedValue({ id: 123 }),
}));

const { createAndEmitNotification } = await import('../src/libs/notificationService.js');
const { default: UserNoti } = await import('../src/controller/userNoti/updateUserInfoNoti.js');

describe('UserNoti', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('updateInfoNoti sends notice with proper header/body', async () => {
    const date = '2026-03-01T12:00:00Z';
    const userId = 42;
    const socket = { id: 's' };
    const n = new UserNoti({ date, userId, socketIo: socket });
    await n.updateInfoNoti();
    expect(createAndEmitNotification).toHaveBeenCalledTimes(1);
    const [prismaArg, ioArg, dataArg] = createAndEmitNotification.mock.calls[0];
    expect(ioArg).toBe(socket);
    expect(dataArg).toMatchObject({ authorId: userId });
    expect(dataArg.header).toMatch(/information/);
  });

  test('updatePasswordNoti sends notice with correct wording', async () => {
    const date = '2026-03-01';
    const userId = 99;
    const n = new UserNoti({ date, userId });
    await n.updatePasswordNoti();
    expect(createAndEmitNotification).toHaveBeenCalledTimes(1);
    const dataArg = createAndEmitNotification.mock.calls[0][2];
    expect(dataArg.header).toContain('password');
    expect(dataArg.body).toContain(date);
  });
});
