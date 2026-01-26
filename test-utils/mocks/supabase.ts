/**
 * Supabase client mock utilities for testing
 */

type MockQueryBuilder = {
  select: jest.Mock
  insert: jest.Mock
  update: jest.Mock
  delete: jest.Mock
  eq: jest.Mock
  in: jest.Mock
  not: jest.Mock
  contains: jest.Mock
  order: jest.Mock
  range: jest.Mock
  limit: jest.Mock
  single: jest.Mock
  rpc: jest.Mock
}

export function createMockQueryBuilder(
  resolvedValue: { data: unknown; error: unknown; count?: number } = {
    data: null,
    error: null,
  }
): MockQueryBuilder {
  const builder: MockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    not: jest.fn().mockReturnThis(),
    contains: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue(resolvedValue),
    rpc: jest.fn().mockResolvedValue(resolvedValue),
  }

  // Make chainable methods also resolve to the value
  Object.keys(builder).forEach(key => {
    if (key !== 'single' && key !== 'rpc') {
      const method = builder[key as keyof MockQueryBuilder]
      // Add .then() support for awaiting the chain
      ;(method as jest.Mock).mockImplementation(() => ({
        ...builder,
        then: (resolve: (value: unknown) => void) => resolve(resolvedValue),
      }))
    }
  })

  return builder
}

export function createMockSupabaseClient(overrides: {
  auth?: Partial<{
    getUser: jest.Mock
    signIn: jest.Mock
    signOut: jest.Mock
  }>
  fromResult?: { data: unknown; error: unknown; count?: number }
  rpcResult?: { data: unknown; error: unknown }
} = {}) {
  const queryBuilder = createMockQueryBuilder(overrides.fromResult)

  return {
    auth: {
      getUser: jest
        .fn()
        .mockResolvedValue({ data: { user: null }, error: null }),
      signIn: jest.fn().mockResolvedValue({ data: null, error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      ...overrides.auth,
    },
    from: jest.fn(() => queryBuilder),
    rpc: jest.fn().mockResolvedValue(overrides.rpcResult || { data: null, error: null }),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn().mockResolvedValue({ data: { path: 'test-path' }, error: null }),
        getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/test.jpg' } }),
      })),
    },
  }
}

/**
 * Create a mock authenticated user
 */
export function createMockUser(overrides: Partial<{
  id: string
  email: string
  user_metadata: Record<string, unknown>
}> = {}) {
  return {
    id: overrides.id || 'test-user-id',
    email: overrides.email || 'test@example.com',
    user_metadata: overrides.user_metadata || {},
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  }
}

/**
 * Create a mock profile
 */
export function createMockProfile(overrides: Partial<{
  id: string
  username: string
  full_name: string
  trust_score: number
  trust_level: string
  expression_data: Record<string, unknown>
}> = {}) {
  return {
    id: overrides.id || 'test-user-id',
    username: overrides.username || 'testuser',
    full_name: overrides.full_name || 'Test User',
    trust_score: overrides.trust_score ?? 0,
    trust_level: overrides.trust_level || 'newcomer',
    expression_data: overrides.expression_data || {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}
