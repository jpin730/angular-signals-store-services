import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable, catchError, map } from 'rxjs'
import { AbstractSignalStoreService } from './abstract-signal-store.service'
import { cloneErrorResponse } from './clone-error-response.util'

export interface Post {
  id: number
  title: string
}

@Injectable()
export class PostsService extends AbstractSignalStoreService<Post> {
  private readonly http = inject(HttpClient)
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com/posts'

  getAll(): Observable<Post[]> {
    return this.requestWrapper(this.http.get<Post[]>(this.baseUrl))
  }

  getPost(id: number): Observable<Post[]> {
    return this.requestWrapper(
      this.http.get<Post>(`${this.baseUrl}/${id}`).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            throw cloneErrorResponse(error, 'Post not found')
          }
          throw error
        }),
      ),
    )
  }

  createPost(title: string): Observable<Post[]> {
    return this.requestWrapper(
      this.http.post<Post>(this.baseUrl, {
        title,
      }),
    )
  }

  updatePost(id: number, title: string): Observable<Post[]> {
    return this.requestWrapper(
      this.http
        .put<Post>(`${this.baseUrl}/${id}`, {
          title,
        })
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 500) {
              throw cloneErrorResponse(error, 'Post not found')
            }
            throw error
          }),
        ),
    )
  }

  deletePost(id: number): Observable<Post[]> {
    return this.requestWrapper(
      this.http
        .delete<Post>(`${this.baseUrl}/${id}`)
        .pipe(map(() => ({ id, title: 'Post deleted' }))),
    )
  }
}
