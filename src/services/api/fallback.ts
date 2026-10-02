export async function withMockFallback<T>(
  apiOperation: (() => Promise<T>) | undefined,
  mockOperation: () => T | Promise<T>,
): Promise<T> {
  if (!apiOperation) return mockOperation()

  try {
    return await apiOperation()
  } catch (error) {
    if (!import.meta.env.DEV || !(error instanceof TypeError)) throw error
    return mockOperation()
  }
}
