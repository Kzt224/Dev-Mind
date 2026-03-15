import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/libs/notiEmitter.js', () => ({
  emitNotification: jest.fn(),
}));

const { emitNotification } = await import('../src/libs/notiEmitter.js');
const { createAndEmitNotification } = await import('../src/libs/notificationService.js');

describe('createAndEmitNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a notification and emits when io is provided', async () => {
    const mockNoti = { header: 'H', body: 'B', authorId: 2, type: 'INFO' };
    const mockPrisma = { notification: { create: jest.fn().mockResolvedValue(mockNoti) } };
    const mockIo = { id: 'socket' };

    const res = await createAndEmitNotification(mockPrisma, mockIo, { header: 'H', body: 'B', authorId: 2 });

    expect(mockPrisma.notification.create).toHaveBeenCalledWith({ data: { header: 'H', body: 'B', authorId: 2 } });
    expect(emitNotification).toHaveBeenCalledWith(mockIo, 2, { header: 'H', body: 'B', type: 'INFO' });
    expect(res).toEqual(mockNoti);
  });

  it('creates a notification and does not emit when io is null', async () => {
    const mockNoti = { header: 'H2', body: 'B2', authorId: 3 };
    const mockPrisma = { notification: { create: jest.fn().mockResolvedValue(mockNoti) } };

    const res = await createAndEmitNotification(mockPrisma, null, { header: 'H2', body: 'B2', authorId: 3 });

    expect(mockPrisma.notification.create).toHaveBeenCalled();
    expect(emitNotification).not.toHaveBeenCalled();
    expect(res).toEqual(mockNoti);
  });
});
