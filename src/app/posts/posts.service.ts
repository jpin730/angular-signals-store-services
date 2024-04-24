import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable, computed, inject, signal } from '@angular/core'
import { Observable, catchError, tap } from 'rxjs'

interface State<T> {
  data: T
  loading: boolean
  error: string | null
}

export interface Post {
  id: number
  title: string
}

type PostsState = State<Post[]>

@Injectable()
export class PostsService {
  private readonly http = inject(HttpClient)
  private _state = signal<PostsState>({
    data: [],
    loading: false,
    error: null,
  })

  posts = computed(() => this._state().data)
  loading = computed(() => this._state().loading)
  error = computed(() => this._state().error)

  getAll(): Observable<Post[]> {
    this.setLoading(true)
    return this.http
      .get<Post[]>('https://jsonplaceholder.typicode.com/posts')
      .pipe(
        tap((data) => {
          this.setData(data)
        }),
        catchError((error: HttpErrorResponse) => {
          this.setError(error)
          throw error
        }),
      )
  }

  getPost(id: number): Observable<Post> {
    this.setLoading(true)
    return this.http
      .get<Post>(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .pipe(
        tap((data) => {
          this.setData([data])
        }),
        catchError((error: HttpErrorResponse) => {
          this.setError(error)
          throw error
        }),
      )
  }

  createPost(title: string): Observable<Post> {
    this.setLoading(true)
    return this.http
      .post<Post>('https://jsonplaceholder.typicode.com/posts', {
        title,
      })
      .pipe(
        tap((data) => {
          this.setData([data])
        }),
        catchError((error: HttpErrorResponse) => {
          this.setError(error)
          throw error
        }),
      )
  }

  private setData(data: Post[]) {
    this._state.update((state) => ({
      ...state,
      data,
      loading: false,
      error: null,
    }))
  }

  private setLoading(loading = true) {
    this._state.update((state) => ({
      ...state,
      loading,
    }))
  }

  private setError(error: HttpErrorResponse) {
    this._state.update((state) => ({
      ...state,
      data: [],
      loading: false,
      error: error.message,
    }))
  }
}
