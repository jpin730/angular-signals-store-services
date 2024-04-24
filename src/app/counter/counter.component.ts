import { Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CounterService } from './counter.service'

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './counter.component.html',
  providers: [CounterService],
})
export class CounterComponent {
  counterService = inject(CounterService)

  input = 0

  count = this.counterService.count

  increment() {
    this.counterService.increment()
  }

  decrement() {
    this.counterService.decrement()
  }

  incrementBy() {
    this.counterService.increment(this.input)
  }

  decrementBy() {
    this.counterService.decrement(this.input)
  }
}
