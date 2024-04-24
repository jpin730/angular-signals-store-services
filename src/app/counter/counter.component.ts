import { Component, inject } from '@angular/core'
import { CounterService } from './counter.service'

@Component({
  selector: 'app-counter',
  standalone: true,
  templateUrl: './counter.component.html',
  providers: [CounterService],
})
export class CounterComponent {
  counterService = inject(CounterService)

  count = this.counterService.count

  increment() {
    this.counterService.increment()
  }

  decrement() {
    this.counterService.decrement()
  }

  incrementBy(value: number) {
    this.counterService.increment(value)
  }
}
