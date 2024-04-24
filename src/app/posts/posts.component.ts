import { Component, inject } from '@angular/core'
import { PostsService } from './posts.service'

@Component({
  selector: 'app-posts',
  standalone: true,
  templateUrl: './posts.component.html',
  providers: [PostsService],
})
export class PostsComponent {
  private readonly postsService = inject(PostsService)

  posts = this.postsService.posts
  loading = this.postsService.loading
  error = this.postsService.error

  getAllPosts() {
    this.postsService.getAll().subscribe()
  }

  getPost(id: number) {
    this.postsService.getPost(id).subscribe()
  }

  createPost() {
    this.postsService.createPost('New post').subscribe()
  }

  updatePost(id: number) {
    this.postsService.updatePost(id, 'Updated post').subscribe()
  }

  deletePost(id: number) {
    this.postsService.deletePost(id).subscribe()
  }
}
