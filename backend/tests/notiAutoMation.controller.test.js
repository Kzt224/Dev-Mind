import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/libs/notificationService.js', () => ({
  createAndEmitNotification: jest.fn().mockResolvedValue({ id: 1 }),
}));

const { createAndEmitNotification } = await import('../src/libs/notificationService.js');
const { default: SendNotification } = await import('../src/controller/notiAutoMation.controller.js');

describe('SendNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sendSignupNoti calls createAndEmitNotification with correct authorId', async () => {
    const user = { id: '5' };
    const socket = { id: 'socket' };
    const svc = new SendNotification({ user, socketIo: socket });

    await svc.sendSignupNoti();

    expect(createAndEmitNotification).toHaveBeenCalledTimes(1);
    const [prismaArg, ioArg, dataArg] = createAndEmitNotification.mock.calls[0];
    expect(ioArg).toBe(socket);
    expect(dataArg).toMatchObject({ header: 'Welcome!', authorId: 5 });
    expect(dataArg.body).toMatch(/Thank! you for choosing/);
  });
});
