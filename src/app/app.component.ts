import { Component } from '@angular/core'
import { CounterComponent } from './counter/counter.component'
import { PostsComponent } from './posts/posts.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CounterComponent, PostsComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
