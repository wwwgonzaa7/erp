import { useCallback, useEffect, useState } from 'react'

type CollectionState<T> = {
  data: readonly T[]
  loading: boolean
  error: Error | null
}

type CollectionResult<T> = CollectionState<T> & {
  reload: () => void
}

export function useCollection<T>(load: () => Promise<readonly T[]>): CollectionResult<T> {
  const [state, setState] = useState<CollectionState<T>>({
    data: [],
    loading: true,
    error: null,
  })
  const [version, setVersion] = useState(0)

  const reload = useCallback(() => {
    setState((current) => ({ ...current, loading: true, error: null }))
    setVersion((current) => current + 1)
  }, [])

  useEffect(() => {
    let active = true

    Promise.resolve()
      .then(load)
      .then((data) => {
        if (active) setState({ data, loading: false, error: null })
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            data: [],
            loading: false,
            error: error instanceof Error ? error : new Error('No se pudieron cargar los datos'),
          })
        }
      })

    return () => {
      active = false
    }
  }, [load, version])

  return { ...state, reload }
}
