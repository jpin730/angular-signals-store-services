import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable, map } from 'rxjs'
import { AbstractSignalStoreService } from './abstract-signal-store.service'

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
    return this.requestWrapper(this.http.get<Post>(`${this.baseUrl}/${id}`))
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
      this.http.put<Post>(`${this.baseUrl}/${id}`, {
        title,
      }),
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
