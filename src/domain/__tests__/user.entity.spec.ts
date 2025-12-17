import { User } from '../entities/user.entity';

describe('User Entity', () => {
  const mockId = 1;
  const mockAuthId = 'supabase-auth-123';
  const mockFullname = 'Test User';
  const mockCreatedAt = new Date('2024-01-01');
  const mockUpdatedAt = new Date('2024-01-02');

  describe('constructor', () => {
    it('should create user with all properties', () => {
      const user = new User(
        mockId,
        mockAuthId,
        mockFullname,
        mockCreatedAt,
        mockUpdatedAt,
      );

      expect(user.id).toBe(mockId);
      expect(user.auth_id).toBe(mockAuthId);
      expect(user.fullname).toBe(mockFullname);
    });

    it('should create user with optional fullname as undefined', () => {
      const user = new User(mockId, mockAuthId);

      expect(user.fullname).toBeUndefined();
    });
  });

  describe('getters', () => {
    let user: User;

    beforeEach(() => {
      user = new User(
        mockId,
        mockAuthId,
        mockFullname,
        mockCreatedAt,
        mockUpdatedAt,
      );
    });

    it('should return auth_id', () => {
      expect(user.auth_id).toBe(mockAuthId);
    });

    it('should return fullname', () => {
      expect(user.fullname).toBe(mockFullname);
    });

    it('should return id from BaseEntity', () => {
      expect(user.id).toBe(mockId);
    });
  });

  describe('updateProfile', () => {
    let user: User;

    beforeEach(() => {
      user = new User(
        mockId,
        mockAuthId,
        mockFullname,
        mockCreatedAt,
        mockUpdatedAt,
      );
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should update fullname', () => {
      const newFullname = 'Updated Name';

      user.updateProfile(newFullname);

      expect(user.fullname).toBe(newFullname);
    });

    it('should handle undefined fullname', () => {
      user.updateProfile(undefined);

      expect(user.fullname).toBeUndefined();
    });
  });

  describe('immutability', () => {
    it('should not have a setter for auth_id', () => {
      const user = new User(mockId, mockAuthId);

      const descriptor = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(user),
        'auth_id',
      );

      expect(descriptor?.set).toBeUndefined();
    });

    it('should not have a setter for id', () => {
      const user = new User(mockId, mockAuthId);

      const descriptor = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(user),
        'id',
      );

      expect(descriptor?.set).toBeUndefined();
    });
  });
});
