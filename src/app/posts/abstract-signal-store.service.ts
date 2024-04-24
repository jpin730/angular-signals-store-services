import { HttpErrorResponse } from '@angular/common/http'
import { computed, signal } from '@angular/core'
import { Observable, catchError, map, tap } from 'rxjs'

export interface State<T> {
  data: T[]
  loading: boolean
  error: string | null
}

export abstract class AbstractSignalStoreService<T> {
  private _state = signal<State<T>>({
    data: [],
    loading: false,
    error: null,
  })

  data = computed(() => this._state().data)
  loading = computed(() => this._state().loading)
  error = computed(() => this._state().error)

  protected requestWrapper(request: Observable<T | T[]>): Observable<T[]> {
    this.setLoading()
    return request.pipe(
      tap((data) => {
        if (Array.isArray(data)) {
          this.setData(data)
          return
        }
        this.setData([data as T])
      }),
      map((data) => {
        if (Array.isArray(data)) {
          return data
        }
        return [data]
      }),
      catchError((error: HttpErrorResponse) => {
        this.setError(error)
        throw error
      }),
    )
  }

  protected setData(data: T[]) {
    this._state.update((state) => ({
      ...state,
      data: structuredClone<T[]>(data),
      loading: false,
      error: null,
    }))
  }

  protected setLoading(loading = true) {
    this._state.update((state) => ({
      ...state,
      loading,
    }))
  }

  protected setError(error: HttpErrorResponse) {
    this._state.update((state) => ({
      ...state,
      data: [],
      loading: false,
      error: error.statusText,
    }))
  }
}
