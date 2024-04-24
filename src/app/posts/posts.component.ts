import { Component, computed, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PostsService } from './posts.service'

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './posts.component.html',
  providers: [PostsService],
})
export class PostsComponent {
  private readonly postsService = inject(PostsService)

  input = 0

  posts = this.postsService.data
  loading = this.postsService.loading
  error = this.postsService.error

  totalPosts = computed(() => this.posts().length)

  getAllPosts() {
    this.postsService.getAll().subscribe()
  }

  getPost() {
    this.postsService.getPost(this.input).subscribe()
  }

  createPost() {
    this.postsService.createPost('New post').subscribe()
  }

  updatePost() {
    this.postsService.updatePost(this.input, 'Updated post').subscribe()
  }

  deletePost() {
    this.postsService.deletePost(this.input).subscribe()
  }
}
