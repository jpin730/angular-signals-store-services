import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable, computed, inject, signal } from '@angular/core'
import { Observable, catchError, map, tap } from 'rxjs'

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
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com/posts'
  private _state = signal<PostsState>({
    data: [],
    loading: false,
    error: null,
  })

  posts = computed(() => this._state().data)
  loading = computed(() => this._state().loading)
  error = computed(() => this._state().error)

  getAll(): Observable<Post[]> {
    return this.requestWrapper(this.http.get<Post[]>(this.baseUrl))
  }

  getPost(id: number): Observable<Post> {
    return this.requestWrapper(this.http.get<Post>(`${this.baseUrl}/${id}`))
  }

  createPost(title: string): Observable<Post> {
    return this.requestWrapper(
      this.http.post<Post>(this.baseUrl, {
        title,
      }),
    )
  }

  updatePost(id: number, title: string): Observable<Post> {
    return this.requestWrapper(
      this.http.put<Post>(`${this.baseUrl}/${id}`, {
        title,
      }),
    )
  }

  deletePost(id: number): Observable<Post> {
    return this.requestWrapper(
      this.http
        .delete<Post>(`${this.baseUrl}/${id}`)
        .pipe(map(() => ({ id, title: 'Post deleted' }))),
    )
  }

  private requestWrapper<T>(request: Observable<T>): Observable<T> {
    this.setLoading()
    return request.pipe(
      tap((data) => {
        if (Array.isArray(data)) {
          this.setData(data)
          return
        }
        this.setData([data as Post])
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
