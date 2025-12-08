import { User } from './user.entity';

describe('User Entity', () => {
  const mockId = 'user-123';
  const mockSupabaseAuthId = 'supabase-auth-123';
  const mockEmail = 'test@example.com';
  const mockName = 'Test User';
  const mockAvatarUrl = 'https://example.com/avatar.jpg';
  const mockCreatedAt = new Date('2024-01-01');
  const mockUpdatedAt = new Date('2024-01-02');

  describe('constructor', () => {
    it('should create user with all properties', () => {
      const user = new User(
        mockId,
        mockSupabaseAuthId,
        mockEmail,
        mockName,
        mockAvatarUrl,
        mockCreatedAt,
        mockUpdatedAt,
      );

      expect(user.id).toBe(mockId);
      expect(user.supabaseAuthId).toBe(mockSupabaseAuthId);
      expect(user.email).toBe(mockEmail);
      expect(user.name).toBe(mockName);
      expect(user.avatarUrl).toBe(mockAvatarUrl);
      expect(user.createdAt).toEqual(mockCreatedAt);
      expect(user.updatedAt).toEqual(mockUpdatedAt);
    });

    it('should create user with optional fields as null', () => {
      const user = new User(
        mockId,
        mockSupabaseAuthId,
        mockEmail,
        null,
        null,
        mockCreatedAt,
        mockUpdatedAt,
      );

      expect(user.name).toBeNull();
      expect(user.avatarUrl).toBeNull();
    });

    it('should set timestamps if provided', () => {
      const user = new User(
        mockId,
        mockSupabaseAuthId,
        mockEmail,
        mockName,
        mockAvatarUrl,
        mockCreatedAt,
        mockUpdatedAt,
      );

      expect(user.createdAt).toEqual(mockCreatedAt);
      expect(user.updatedAt).toEqual(mockUpdatedAt);
    });

    it('should use current date if timestamps not provided', () => {
      const beforeCreate = new Date();
      const user = new User(mockId, mockSupabaseAuthId, mockEmail);
      const afterCreate = new Date();

      expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime(),
      );
      expect(user.createdAt.getTime()).toBeLessThanOrEqual(
        afterCreate.getTime(),
      );
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime(),
      );
      expect(user.updatedAt.getTime()).toBeLessThanOrEqual(
        afterCreate.getTime(),
      );
    });
  });

  describe('getters', () => {
    let user: User;

    beforeEach(() => {
      user = new User(
        mockId,
        mockSupabaseAuthId,
        mockEmail,
        mockName,
        mockAvatarUrl,
        mockCreatedAt,
        mockUpdatedAt,
      );
    });

    it('should return supabaseAuthId', () => {
      expect(user.supabaseAuthId).toBe(mockSupabaseAuthId);
    });

    it('should return email', () => {
      expect(user.email).toBe(mockEmail);
    });

    it('should return name', () => {
      expect(user.name).toBe(mockName);
    });

    it('should return avatarUrl', () => {
      expect(user.avatarUrl).toBe(mockAvatarUrl);
    });

    it('should return id from BaseEntity', () => {
      expect(user.id).toBe(mockId);
    });

    it('should return createdAt from BaseEntity', () => {
      expect(user.createdAt).toEqual(mockCreatedAt);
    });

    it('should return updatedAt from BaseEntity', () => {
      expect(user.updatedAt).toEqual(mockUpdatedAt);
    });
  });

  describe('updateProfile', () => {
    let user: User;
    const originalUpdatedAt = new Date('2024-01-02');

    beforeEach(() => {
      user = new User(
        mockId,
        mockSupabaseAuthId,
        mockEmail,
        mockName,
        mockAvatarUrl,
        mockCreatedAt,
        originalUpdatedAt,
      );
      // Wait a bit to ensure timestamp difference
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should update name and avatarUrl', () => {
      const newName = 'Updated Name';
      const newAvatarUrl = 'https://example.com/new-avatar.jpg';

      user.updateProfile(newName, newAvatarUrl);

      expect(user.name).toBe(newName);
      expect(user.avatarUrl).toBe(newAvatarUrl);
    });

    it('should update updatedAt timestamp', () => {
      const newName = 'Updated Name';
      const newAvatarUrl = 'https://example.com/new-avatar.jpg';

      jest.advanceTimersByTime(1000);
      user.updateProfile(newName, newAvatarUrl);

      expect(user.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );
    });

    it('should handle null values for name', () => {
      user.updateProfile(null, mockAvatarUrl);

      expect(user.name).toBeNull();
      expect(user.avatarUrl).toBe(mockAvatarUrl);
    });

    it('should handle null values for avatarUrl', () => {
      user.updateProfile(mockName, null);

      expect(user.name).toBe(mockName);
      expect(user.avatarUrl).toBeNull();
    });

    it('should handle both values as null', () => {
      user.updateProfile(null, null);

      expect(user.name).toBeNull();
      expect(user.avatarUrl).toBeNull();
    });
  });

  describe('immutability', () => {
    it('should not have a setter for email', () => {
      const user = new User(mockId, mockSupabaseAuthId, mockEmail);

      const descriptor = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(user),
        'email',
      );

      expect(descriptor?.set).toBeUndefined();
    });

    it('should not have a setter for supabaseAuthId', () => {
      const user = new User(mockId, mockSupabaseAuthId, mockEmail);

      const descriptor = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(user),
        'supabaseAuthId',
      );

      expect(descriptor?.set).toBeUndefined();
    });

    it('should not have a setter for id', () => {
      const user = new User(mockId, mockSupabaseAuthId, mockEmail);

      const descriptor = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(user),
        'id',
      );

      expect(descriptor?.set).toBeUndefined();
    });
  });
});
