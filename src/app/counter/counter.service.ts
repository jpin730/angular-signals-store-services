import { Injectable, computed, signal } from '@angular/core'

interface CounterState {
  count: number
}

@Injectable()
export class CounterService {
  private _state = signal<CounterState>({ count: 0 })

  count = computed(() => this._state().count)

  increment(payload = 1) {
    this._state.update((state) => ({
      ...state,
      count: state.count + payload,
    }))
  }

  decrement(payload = 1) {
    this._state.update((state) => ({
      ...state,
      count: state.count - payload,
    }))
  }
}
