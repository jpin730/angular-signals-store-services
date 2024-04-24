var yp = Object.defineProperty,
  Dp = Object.defineProperties
var wp = Object.getOwnPropertyDescriptors
var mc = Object.getOwnPropertySymbols
var Cp = Object.prototype.hasOwnProperty,
  Ep = Object.prototype.propertyIsEnumerable
var vc = (e, t, n) =>
    t in e
      ? yp(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  g = (e, t) => {
    for (var n in (t ||= {})) Cp.call(t, n) && vc(e, n, t[n])
    if (mc) for (var n of mc(t)) Ep.call(t, n) && vc(e, n, t[n])
    return e
  },
  R = (e, t) => Dp(e, wp(t))
function yc(e, t) {
  return Object.is(e, t)
}
var Q = null,
  Zr = !1,
  Yr = 1,
  Ze = Symbol('SIGNAL')
function O(e) {
  let t = Q
  return (Q = e), t
}
var Kr = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
}
function Xi(e) {
  if (Zr) throw new Error('')
  if (Q === null) return
  Q.consumerOnSignalRead(e)
  let t = Q.nextProducerIndex++
  if ((Qt(Q), t < Q.producerNode.length && Q.producerNode[t] !== e && Wn(Q))) {
    let n = Q.producerNode[t]
    Jr(n, Q.producerIndexOfThis[t])
  }
  Q.producerNode[t] !== e &&
    ((Q.producerNode[t] = e),
    (Q.producerIndexOfThis[t] = Wn(Q) ? Ic(e, Q, t) : 0)),
    (Q.producerLastReadVersion[t] = e.version)
}
function Ip() {
  Yr++
}
function Dc(e) {
  if (!(Wn(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === Yr)) {
    if (!e.producerMustRecompute(e) && !ns(e)) {
      ;(e.dirty = !1), (e.lastCleanEpoch = Yr)
      return
    }
    e.producerRecomputeValue(e), (e.dirty = !1), (e.lastCleanEpoch = Yr)
  }
}
function wc(e) {
  if (e.liveConsumerNode === void 0) return
  let t = Zr
  Zr = !0
  try {
    for (let n of e.liveConsumerNode) n.dirty || bp(n)
  } finally {
    Zr = t
  }
}
function Cc() {
  return Q?.consumerAllowSignalWrites !== !1
}
function bp(e) {
  ;(e.dirty = !0), wc(e), e.consumerMarkedDirty?.(e)
}
function es(e) {
  return e && (e.nextProducerIndex = 0), O(e)
}
function ts(e, t) {
  if (
    (O(t),
    !(
      !e ||
      e.producerNode === void 0 ||
      e.producerIndexOfThis === void 0 ||
      e.producerLastReadVersion === void 0
    ))
  ) {
    if (Wn(e))
      for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
        Jr(e.producerNode[n], e.producerIndexOfThis[n])
    for (; e.producerNode.length > e.nextProducerIndex; )
      e.producerNode.pop(),
        e.producerLastReadVersion.pop(),
        e.producerIndexOfThis.pop()
  }
}
function ns(e) {
  Qt(e)
  for (let t = 0; t < e.producerNode.length; t++) {
    let n = e.producerNode[t],
      r = e.producerLastReadVersion[t]
    if (r !== n.version || (Dc(n), r !== n.version)) return !0
  }
  return !1
}
function Ec(e) {
  if ((Qt(e), Wn(e)))
    for (let t = 0; t < e.producerNode.length; t++)
      Jr(e.producerNode[t], e.producerIndexOfThis[t])
  ;(e.producerNode.length =
    e.producerLastReadVersion.length =
    e.producerIndexOfThis.length =
      0),
    e.liveConsumerNode &&
      (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0)
}
function Ic(e, t, n) {
  if ((bc(e), Qt(e), e.liveConsumerNode.length === 0))
    for (let r = 0; r < e.producerNode.length; r++)
      e.producerIndexOfThis[r] = Ic(e.producerNode[r], e, r)
  return e.liveConsumerIndexOfThis.push(n), e.liveConsumerNode.push(t) - 1
}
function Jr(e, t) {
  if ((bc(e), Qt(e), e.liveConsumerNode.length === 1))
    for (let r = 0; r < e.producerNode.length; r++)
      Jr(e.producerNode[r], e.producerIndexOfThis[r])
  let n = e.liveConsumerNode.length - 1
  if (
    ((e.liveConsumerNode[t] = e.liveConsumerNode[n]),
    (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n]),
    e.liveConsumerNode.length--,
    e.liveConsumerIndexOfThis.length--,
    t < e.liveConsumerNode.length)
  ) {
    let r = e.liveConsumerIndexOfThis[t],
      o = e.liveConsumerNode[t]
    Qt(o), (o.producerIndexOfThis[r] = t)
  }
}
function Wn(e) {
  return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0
}
function Qt(e) {
  ;(e.producerNode ??= []),
    (e.producerIndexOfThis ??= []),
    (e.producerLastReadVersion ??= [])
}
function bc(e) {
  ;(e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= [])
}
function Mc(e) {
  let t = Object.create(Mp)
  t.computation = e
  let n = () => {
    if ((Dc(t), Xi(t), t.value === Qr)) throw t.error
    return t.value
  }
  return (n[Ze] = t), n
}
var Ki = Symbol('UNSET'),
  Ji = Symbol('COMPUTING'),
  Qr = Symbol('ERRORED'),
  Mp = R(g({}, Kr), {
    value: Ki,
    dirty: !0,
    error: null,
    equal: yc,
    producerMustRecompute(e) {
      return e.value === Ki || e.value === Ji
    },
    producerRecomputeValue(e) {
      if (e.value === Ji) throw new Error('Detected cycle in computations.')
      let t = e.value
      e.value = Ji
      let n = es(e),
        r
      try {
        r = e.computation()
      } catch (o) {
        ;(r = Qr), (e.error = o)
      } finally {
        ts(e, n)
      }
      if (t !== Ki && t !== Qr && r !== Qr && e.equal(t, r)) {
        e.value = t
        return
      }
      ;(e.value = r), e.version++
    },
  })
function _p() {
  throw new Error()
}
var _c = _p
function Sc() {
  _c()
}
function Tc(e) {
  _c = e
}
var Sp = null
function Ac(e) {
  let t = Object.create(Nc)
  t.value = e
  let n = () => (Xi(t), t.value)
  return (n[Ze] = t), n
}
function rs(e, t) {
  Cc() || Sc(), e.equal(e.value, t) || ((e.value = t), Tp(e))
}
function xc(e, t) {
  Cc() || Sc(), rs(e, t(e.value))
}
var Nc = R(g({}, Kr), { equal: yc, value: void 0 })
function Tp(e) {
  e.version++, Ip(), wc(e), Sp?.()
}
function _(e) {
  return typeof e == 'function'
}
function Kt(e) {
  let n = e((r) => {
    Error.call(r), (r.stack = new Error().stack)
  })
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  )
}
var Xr = Kt(
  (e) =>
    function (n) {
      e(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}`
          : ''),
        (this.name = 'UnsubscriptionError'),
        (this.errors = n)
    },
)
function Zn(e, t) {
  if (e) {
    let n = e.indexOf(t)
    0 <= n && e.splice(n, 1)
  }
}
var Z = class e {
  constructor(t) {
    ;(this.initialTeardown = t),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null)
  }
  unsubscribe() {
    let t
    if (!this.closed) {
      this.closed = !0
      let { _parentage: n } = this
      if (n)
        if (((this._parentage = null), Array.isArray(n)))
          for (let i of n) i.remove(this)
        else n.remove(this)
      let { initialTeardown: r } = this
      if (_(r))
        try {
          r()
        } catch (i) {
          t = i instanceof Xr ? i.errors : [i]
        }
      let { _finalizers: o } = this
      if (o) {
        this._finalizers = null
        for (let i of o)
          try {
            Rc(i)
          } catch (s) {
            ;(t = t ?? []),
              s instanceof Xr ? (t = [...t, ...s.errors]) : t.push(s)
          }
      }
      if (t) throw new Xr(t)
    }
  }
  add(t) {
    var n
    if (t && t !== this)
      if (this.closed) Rc(t)
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this)) return
          t._addParent(this)
        }
        ;(this._finalizers =
          (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t)
      }
  }
  _hasParent(t) {
    let { _parentage: n } = this
    return n === t || (Array.isArray(n) && n.includes(t))
  }
  _addParent(t) {
    let { _parentage: n } = this
    this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t
  }
  _removeParent(t) {
    let { _parentage: n } = this
    n === t ? (this._parentage = null) : Array.isArray(n) && Zn(n, t)
  }
  remove(t) {
    let { _finalizers: n } = this
    n && Zn(n, t), t instanceof e && t._removeParent(this)
  }
}
Z.EMPTY = (() => {
  let e = new Z()
  return (e.closed = !0), e
})()
var os = Z.EMPTY
function eo(e) {
  return (
    e instanceof Z ||
    (e && 'closed' in e && _(e.remove) && _(e.add) && _(e.unsubscribe))
  )
}
function Rc(e) {
  _(e) ? e() : e.unsubscribe()
}
var Ae = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
}
var Jt = {
  setTimeout(e, t, ...n) {
    let { delegate: r } = Jt
    return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n)
  },
  clearTimeout(e) {
    let { delegate: t } = Jt
    return (t?.clearTimeout || clearTimeout)(e)
  },
  delegate: void 0,
}
function to(e) {
  Jt.setTimeout(() => {
    let { onUnhandledError: t } = Ae
    if (t) t(e)
    else throw e
  })
}
function Yn() {}
var Oc = is('C', void 0, void 0)
function Fc(e) {
  return is('E', void 0, e)
}
function Pc(e) {
  return is('N', e, void 0)
}
function is(e, t, n) {
  return { kind: e, value: t, error: n }
}
var Et = null
function Xt(e) {
  if (Ae.useDeprecatedSynchronousErrorHandling) {
    let t = !Et
    if ((t && (Et = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = Et
      if (((Et = null), n)) throw r
    }
  } else e()
}
function kc(e) {
  Ae.useDeprecatedSynchronousErrorHandling &&
    Et &&
    ((Et.errorThrown = !0), (Et.error = e))
}
var It = class extends Z {
    constructor(t) {
      super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), eo(t) && t.add(this))
          : (this.destination = Np)
    }
    static create(t, n, r) {
      return new en(t, n, r)
    }
    next(t) {
      this.isStopped ? as(Pc(t), this) : this._next(t)
    }
    error(t) {
      this.isStopped ? as(Fc(t), this) : ((this.isStopped = !0), this._error(t))
    }
    complete() {
      this.isStopped ? as(Oc, this) : ((this.isStopped = !0), this._complete())
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null))
    }
    _next(t) {
      this.destination.next(t)
    }
    _error(t) {
      try {
        this.destination.error(t)
      } finally {
        this.unsubscribe()
      }
    }
    _complete() {
      try {
        this.destination.complete()
      } finally {
        this.unsubscribe()
      }
    }
  },
  Ap = Function.prototype.bind
function ss(e, t) {
  return Ap.call(e, t)
}
var us = class {
    constructor(t) {
      this.partialObserver = t
    }
    next(t) {
      let { partialObserver: n } = this
      if (n.next)
        try {
          n.next(t)
        } catch (r) {
          no(r)
        }
    }
    error(t) {
      let { partialObserver: n } = this
      if (n.error)
        try {
          n.error(t)
        } catch (r) {
          no(r)
        }
      else no(t)
    }
    complete() {
      let { partialObserver: t } = this
      if (t.complete)
        try {
          t.complete()
        } catch (n) {
          no(n)
        }
    }
  },
  en = class extends It {
    constructor(t, n, r) {
      super()
      let o
      if (_(t) || !t)
        o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 }
      else {
        let i
        this && Ae.useDeprecatedNextContext
          ? ((i = Object.create(t)),
            (i.unsubscribe = () => this.unsubscribe()),
            (o = {
              next: t.next && ss(t.next, i),
              error: t.error && ss(t.error, i),
              complete: t.complete && ss(t.complete, i),
            }))
          : (o = t)
      }
      this.destination = new us(o)
    }
  }
function no(e) {
  Ae.useDeprecatedSynchronousErrorHandling ? kc(e) : to(e)
}
function xp(e) {
  throw e
}
function as(e, t) {
  let { onStoppedNotification: n } = Ae
  n && Jt.setTimeout(() => n(e, t))
}
var Np = { closed: !0, next: Yn, error: xp, complete: Yn }
var tn = (typeof Symbol == 'function' && Symbol.observable) || '@@observable'
function ve(e) {
  return e
}
function cs(...e) {
  return ls(e)
}
function ls(e) {
  return e.length === 0
    ? ve
    : e.length === 1
      ? e[0]
      : function (n) {
          return e.reduce((r, o) => o(r), n)
        }
}
var k = (() => {
  class e {
    constructor(n) {
      n && (this._subscribe = n)
    }
    lift(n) {
      let r = new e()
      return (r.source = this), (r.operator = n), r
    }
    subscribe(n, r, o) {
      let i = Op(n) ? n : new en(n, r, o)
      return (
        Xt(() => {
          let { operator: s, source: a } = this
          i.add(
            s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i),
          )
        }),
        i
      )
    }
    _trySubscribe(n) {
      try {
        return this._subscribe(n)
      } catch (r) {
        n.error(r)
      }
    }
    forEach(n, r) {
      return (
        (r = Lc(r)),
        new r((o, i) => {
          let s = new en({
            next: (a) => {
              try {
                n(a)
              } catch (u) {
                i(u), s.unsubscribe()
              }
            },
            error: i,
            complete: o,
          })
          this.subscribe(s)
        })
      )
    }
    _subscribe(n) {
      var r
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(n)
    }
    [tn]() {
      return this
    }
    pipe(...n) {
      return ls(n)(this)
    }
    toPromise(n) {
      return (
        (n = Lc(n)),
        new n((r, o) => {
          let i
          this.subscribe(
            (s) => (i = s),
            (s) => o(s),
            () => r(i),
          )
        })
      )
    }
  }
  return (e.create = (t) => new e(t)), e
})()
function Lc(e) {
  var t
  return (t = e ?? Ae.Promise) !== null && t !== void 0 ? t : Promise
}
function Rp(e) {
  return e && _(e.next) && _(e.error) && _(e.complete)
}
function Op(e) {
  return (e && e instanceof It) || (Rp(e) && eo(e))
}
function ds(e) {
  return _(e?.lift)
}
function F(e) {
  return (t) => {
    if (ds(t))
      return t.lift(function (n) {
        try {
          return e(n, this)
        } catch (r) {
          this.error(r)
        }
      })
    throw new TypeError('Unable to lift unknown Observable type')
  }
}
function N(e, t, n, r, o) {
  return new fs(e, t, n, r, o)
}
var fs = class extends It {
  constructor(t, n, r, o, i, s) {
    super(t),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = n
        ? function (a) {
            try {
              n(a)
            } catch (u) {
              t.error(u)
            }
          }
        : super._next),
      (this._error = o
        ? function (a) {
            try {
              o(a)
            } catch (u) {
              t.error(u)
            } finally {
              this.unsubscribe()
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r()
            } catch (a) {
              t.error(a)
            } finally {
              this.unsubscribe()
            }
          }
        : super._complete)
  }
  unsubscribe() {
    var t
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this
      super.unsubscribe(),
        !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this))
    }
  }
}
function nn() {
  return F((e, t) => {
    let n = null
    e._refCount++
    let r = N(t, void 0, void 0, void 0, () => {
      if (!e || e._refCount <= 0 || 0 < --e._refCount) {
        n = null
        return
      }
      let o = e._connection,
        i = n
      ;(n = null), o && (!i || o === i) && o.unsubscribe(), t.unsubscribe()
    })
    e.subscribe(r), r.closed || (n = e.connect())
  })
}
var rn = class extends k {
  constructor(t, n) {
    super(),
      (this.source = t),
      (this.subjectFactory = n),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      ds(t) && (this.lift = t.lift)
  }
  _subscribe(t) {
    return this.getSubject().subscribe(t)
  }
  getSubject() {
    let t = this._subject
    return (
      (!t || t.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    )
  }
  _teardown() {
    this._refCount = 0
    let { _connection: t } = this
    ;(this._subject = this._connection = null), t?.unsubscribe()
  }
  connect() {
    let t = this._connection
    if (!t) {
      t = this._connection = new Z()
      let n = this.getSubject()
      t.add(
        this.source.subscribe(
          N(
            n,
            void 0,
            () => {
              this._teardown(), n.complete()
            },
            (r) => {
              this._teardown(), n.error(r)
            },
            () => this._teardown(),
          ),
        ),
      ),
        t.closed && ((this._connection = null), (t = Z.EMPTY))
    }
    return t
  }
  refCount() {
    return nn()(this)
  }
}
var Vc = Kt(
  (e) =>
    function () {
      e(this),
        (this.name = 'ObjectUnsubscribedError'),
        (this.message = 'object unsubscribed')
    },
)
var se = (() => {
    class e extends k {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null)
      }
      lift(n) {
        let r = new ro(this, this)
        return (r.operator = n), r
      }
      _throwIfClosed() {
        if (this.closed) throw new Vc()
      }
      next(n) {
        Xt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers))
            for (let r of this.currentObservers) r.next(n)
          }
        })
      }
      error(n) {
        Xt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            ;(this.hasError = this.isStopped = !0), (this.thrownError = n)
            let { observers: r } = this
            for (; r.length; ) r.shift().error(n)
          }
        })
      }
      complete() {
        Xt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0
            let { observers: n } = this
            for (; n.length; ) n.shift().complete()
          }
        })
      }
      unsubscribe() {
        ;(this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null)
      }
      get observed() {
        var n
        return (
          ((n = this.observers) === null || n === void 0 ? void 0 : n.length) >
          0
        )
      }
      _trySubscribe(n) {
        return this._throwIfClosed(), super._trySubscribe(n)
      }
      _subscribe(n) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(n),
          this._innerSubscribe(n)
        )
      }
      _innerSubscribe(n) {
        let { hasError: r, isStopped: o, observers: i } = this
        return r || o
          ? os
          : ((this.currentObservers = null),
            i.push(n),
            new Z(() => {
              ;(this.currentObservers = null), Zn(i, n)
            }))
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: o, isStopped: i } = this
        r ? n.error(o) : i && n.complete()
      }
      asObservable() {
        let n = new k()
        return (n.source = this), n
      }
    }
    return (e.create = (t, n) => new ro(t, n)), e
  })(),
  ro = class extends se {
    constructor(t, n) {
      super(), (this.destination = t), (this.source = n)
    }
    next(t) {
      var n, r
      ;(r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.next) ===
        null ||
        r === void 0 ||
        r.call(n, t)
    }
    error(t) {
      var n, r
      ;(r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.error) ===
        null ||
        r === void 0 ||
        r.call(n, t)
    }
    complete() {
      var t, n
      ;(n =
        (t = this.destination) === null || t === void 0
          ? void 0
          : t.complete) === null ||
        n === void 0 ||
        n.call(t)
    }
    _subscribe(t) {
      var n, r
      return (r =
        (n = this.source) === null || n === void 0
          ? void 0
          : n.subscribe(t)) !== null && r !== void 0
        ? r
        : os
    }
  }
var ee = class extends se {
  constructor(t) {
    super(), (this._value = t)
  }
  get value() {
    return this.getValue()
  }
  _subscribe(t) {
    let n = super._subscribe(t)
    return !n.closed && t.next(this._value), n
  }
  getValue() {
    let { hasError: t, thrownError: n, _value: r } = this
    if (t) throw n
    return this._throwIfClosed(), r
  }
  next(t) {
    super.next((this._value = t))
  }
}
var ye = new k((e) => e.complete())
function jc(e) {
  return e && _(e.schedule)
}
function Uc(e) {
  return e[e.length - 1]
}
function oo(e) {
  return _(Uc(e)) ? e.pop() : void 0
}
function ot(e) {
  return jc(Uc(e)) ? e.pop() : void 0
}
function Bc(e, t, n, r) {
  function o(i) {
    return i instanceof n
      ? i
      : new n(function (s) {
          s(i)
        })
  }
  return new (n || (n = Promise))(function (i, s) {
    function a(l) {
      try {
        c(r.next(l))
      } catch (d) {
        s(d)
      }
    }
    function u(l) {
      try {
        c(r.throw(l))
      } catch (d) {
        s(d)
      }
    }
    function c(l) {
      l.done ? i(l.value) : o(l.value).then(a, u)
    }
    c((r = r.apply(e, t || [])).next())
  })
}
function $c(e) {
  var t = typeof Symbol == 'function' && Symbol.iterator,
    n = t && e[t],
    r = 0
  if (n) return n.call(e)
  if (e && typeof e.length == 'number')
    return {
      next: function () {
        return (
          e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }
        )
      },
    }
  throw new TypeError(
    t ? 'Object is not iterable.' : 'Symbol.iterator is not defined.',
  )
}
function bt(e) {
  return this instanceof bt ? ((this.v = e), this) : new bt(e)
}
function Hc(e, t, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError('Symbol.asyncIterator is not defined.')
  var r = n.apply(e, t || []),
    o,
    i = []
  return (
    (o = {}),
    s('next'),
    s('throw'),
    s('return'),
    (o[Symbol.asyncIterator] = function () {
      return this
    }),
    o
  )
  function s(f) {
    r[f] &&
      (o[f] = function (h) {
        return new Promise(function (m, M) {
          i.push([f, h, m, M]) > 1 || a(f, h)
        })
      })
  }
  function a(f, h) {
    try {
      u(r[f](h))
    } catch (m) {
      d(i[0][3], m)
    }
  }
  function u(f) {
    f.value instanceof bt
      ? Promise.resolve(f.value.v).then(c, l)
      : d(i[0][2], f)
  }
  function c(f) {
    a('next', f)
  }
  function l(f) {
    a('throw', f)
  }
  function d(f, h) {
    f(h), i.shift(), i.length && a(i[0][0], i[0][1])
  }
}
function zc(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError('Symbol.asyncIterator is not defined.')
  var t = e[Symbol.asyncIterator],
    n
  return t
    ? t.call(e)
    : ((e = typeof $c == 'function' ? $c(e) : e[Symbol.iterator]()),
      (n = {}),
      r('next'),
      r('throw'),
      r('return'),
      (n[Symbol.asyncIterator] = function () {
        return this
      }),
      n)
  function r(i) {
    n[i] =
      e[i] &&
      function (s) {
        return new Promise(function (a, u) {
          ;(s = e[i](s)), o(a, u, s.done, s.value)
        })
      }
  }
  function o(i, s, a, u) {
    Promise.resolve(u).then(function (c) {
      i({ value: c, done: a })
    }, s)
  }
}
var io = (e) => e && typeof e.length == 'number' && typeof e != 'function'
function so(e) {
  return _(e?.then)
}
function ao(e) {
  return _(e[tn])
}
function uo(e) {
  return Symbol.asyncIterator && _(e?.[Symbol.asyncIterator])
}
function co(e) {
  return new TypeError(
    `You provided ${e !== null && typeof e == 'object' ? 'an invalid object' : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  )
}
function Fp() {
  return typeof Symbol != 'function' || !Symbol.iterator
    ? '@@iterator'
    : Symbol.iterator
}
var lo = Fp()
function fo(e) {
  return _(e?.[lo])
}
function ho(e) {
  return Hc(this, arguments, function* () {
    let n = e.getReader()
    try {
      for (;;) {
        let { value: r, done: o } = yield bt(n.read())
        if (o) return yield bt(void 0)
        yield yield bt(r)
      }
    } finally {
      n.releaseLock()
    }
  })
}
function po(e) {
  return _(e?.getReader)
}
function W(e) {
  if (e instanceof k) return e
  if (e != null) {
    if (ao(e)) return Pp(e)
    if (io(e)) return kp(e)
    if (so(e)) return Lp(e)
    if (uo(e)) return Gc(e)
    if (fo(e)) return Vp(e)
    if (po(e)) return jp(e)
  }
  throw co(e)
}
function Pp(e) {
  return new k((t) => {
    let n = e[tn]()
    if (_(n.subscribe)) return n.subscribe(t)
    throw new TypeError(
      'Provided object does not correctly implement Symbol.observable',
    )
  })
}
function kp(e) {
  return new k((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n])
    t.complete()
  })
}
function Lp(e) {
  return new k((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete())
      },
      (n) => t.error(n),
    ).then(null, to)
  })
}
function Vp(e) {
  return new k((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return
    t.complete()
  })
}
function Gc(e) {
  return new k((t) => {
    Up(e, t).catch((n) => t.error(n))
  })
}
function jp(e) {
  return Gc(ho(e))
}
function Up(e, t) {
  var n, r, o, i
  return Bc(this, void 0, void 0, function* () {
    try {
      for (n = zc(e); (r = yield n.next()), !r.done; ) {
        let s = r.value
        if ((t.next(s), t.closed)) return
      }
    } catch (s) {
      o = { error: s }
    } finally {
      try {
        r && !r.done && (i = n.return) && (yield i.call(n))
      } finally {
        if (o) throw o.error
      }
    }
    t.complete()
  })
}
function de(e, t, n, r = 0, o = !1) {
  let i = t.schedule(function () {
    n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe()
  }, r)
  if ((e.add(i), !o)) return i
}
function go(e, t = 0) {
  return F((n, r) => {
    n.subscribe(
      N(
        r,
        (o) => de(r, e, () => r.next(o), t),
        () => de(r, e, () => r.complete(), t),
        (o) => de(r, e, () => r.error(o), t),
      ),
    )
  })
}
function mo(e, t = 0) {
  return F((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t))
  })
}
function qc(e, t) {
  return W(e).pipe(mo(t), go(t))
}
function Wc(e, t) {
  return W(e).pipe(mo(t), go(t))
}
function Zc(e, t) {
  return new k((n) => {
    let r = 0
    return t.schedule(function () {
      r === e.length
        ? n.complete()
        : (n.next(e[r++]), n.closed || this.schedule())
    })
  })
}
function Yc(e, t) {
  return new k((n) => {
    let r
    return (
      de(n, t, () => {
        ;(r = e[lo]()),
          de(
            n,
            t,
            () => {
              let o, i
              try {
                ;({ value: o, done: i } = r.next())
              } catch (s) {
                n.error(s)
                return
              }
              i ? n.complete() : n.next(o)
            },
            0,
            !0,
          )
      }),
      () => _(r?.return) && r.return()
    )
  })
}
function vo(e, t) {
  if (!e) throw new Error('Iterable cannot be null')
  return new k((n) => {
    de(n, t, () => {
      let r = e[Symbol.asyncIterator]()
      de(
        n,
        t,
        () => {
          r.next().then((o) => {
            o.done ? n.complete() : n.next(o.value)
          })
        },
        0,
        !0,
      )
    })
  })
}
function Qc(e, t) {
  return vo(ho(e), t)
}
function Kc(e, t) {
  if (e != null) {
    if (ao(e)) return qc(e, t)
    if (io(e)) return Zc(e, t)
    if (so(e)) return Wc(e, t)
    if (uo(e)) return vo(e, t)
    if (fo(e)) return Yc(e, t)
    if (po(e)) return Qc(e, t)
  }
  throw co(e)
}
function z(e, t) {
  return t ? Kc(e, t) : W(e)
}
function b(...e) {
  let t = ot(e)
  return z(e, t)
}
function on(e, t) {
  let n = _(e) ? e : () => e,
    r = (o) => o.error(n())
  return new k(t ? (o) => t.schedule(r, 0, o) : r)
}
function hs(e) {
  return !!e && (e instanceof k || (_(e.lift) && _(e.subscribe)))
}
var Ye = Kt(
  (e) =>
    function () {
      e(this),
        (this.name = 'EmptyError'),
        (this.message = 'no elements in sequence')
    },
)
function E(e, t) {
  return F((n, r) => {
    let o = 0
    n.subscribe(
      N(r, (i) => {
        r.next(e.call(t, i, o++))
      }),
    )
  })
}
var { isArray: $p } = Array
function Bp(e, t) {
  return $p(t) ? e(...t) : e(t)
}
function yo(e) {
  return E((t) => Bp(e, t))
}
var { isArray: Hp } = Array,
  { getPrototypeOf: zp, prototype: Gp, keys: qp } = Object
function Do(e) {
  if (e.length === 1) {
    let t = e[0]
    if (Hp(t)) return { args: t, keys: null }
    if (Wp(t)) {
      let n = qp(t)
      return { args: n.map((r) => t[r]), keys: n }
    }
  }
  return { args: e, keys: null }
}
function Wp(e) {
  return e && typeof e == 'object' && zp(e) === Gp
}
function wo(e, t) {
  return e.reduce((n, r, o) => ((n[r] = t[o]), n), {})
}
function Co(...e) {
  let t = ot(e),
    n = oo(e),
    { args: r, keys: o } = Do(e)
  if (r.length === 0) return z([], t)
  let i = new k(Zp(r, t, o ? (s) => wo(o, s) : ve))
  return n ? i.pipe(yo(n)) : i
}
function Zp(e, t, n = ve) {
  return (r) => {
    Jc(
      t,
      () => {
        let { length: o } = e,
          i = new Array(o),
          s = o,
          a = o
        for (let u = 0; u < o; u++)
          Jc(
            t,
            () => {
              let c = z(e[u], t),
                l = !1
              c.subscribe(
                N(
                  r,
                  (d) => {
                    ;(i[u] = d), l || ((l = !0), a--), a || r.next(n(i.slice()))
                  },
                  () => {
                    --s || r.complete()
                  },
                ),
              )
            },
            r,
          )
      },
      r,
    )
  }
}
function Jc(e, t, n) {
  e ? de(n, e, t) : t()
}
function Xc(e, t, n, r, o, i, s, a) {
  let u = [],
    c = 0,
    l = 0,
    d = !1,
    f = () => {
      d && !u.length && !c && t.complete()
    },
    h = (M) => (c < r ? m(M) : u.push(M)),
    m = (M) => {
      i && t.next(M), c++
      let y = !1
      W(n(M, l++)).subscribe(
        N(
          t,
          (v) => {
            o?.(v), i ? h(v) : t.next(v)
          },
          () => {
            y = !0
          },
          void 0,
          () => {
            if (y)
              try {
                for (c--; u.length && c < r; ) {
                  let v = u.shift()
                  s ? de(t, s, () => m(v)) : m(v)
                }
                f()
              } catch (v) {
                t.error(v)
              }
          },
        ),
      )
    }
  return (
    e.subscribe(
      N(t, h, () => {
        ;(d = !0), f()
      }),
    ),
    () => {
      a?.()
    }
  )
}
function Y(e, t, n = 1 / 0) {
  return _(t)
    ? Y((r, o) => E((i, s) => t(r, i, o, s))(W(e(r, o))), n)
    : (typeof t == 'number' && (n = t), F((r, o) => Xc(r, o, e, n)))
}
function ps(e = 1 / 0) {
  return Y(ve, e)
}
function el() {
  return ps(1)
}
function sn(...e) {
  return el()(z(e, ot(e)))
}
function Eo(e) {
  return new k((t) => {
    W(e()).subscribe(t)
  })
}
function gs(...e) {
  let t = oo(e),
    { args: n, keys: r } = Do(e),
    o = new k((i) => {
      let { length: s } = n
      if (!s) {
        i.complete()
        return
      }
      let a = new Array(s),
        u = s,
        c = s
      for (let l = 0; l < s; l++) {
        let d = !1
        W(n[l]).subscribe(
          N(
            i,
            (f) => {
              d || ((d = !0), c--), (a[l] = f)
            },
            () => u--,
            void 0,
            () => {
              ;(!u || !d) && (c || i.next(r ? wo(r, a) : a), i.complete())
            },
          ),
        )
      }
    })
  return t ? o.pipe(yo(t)) : o
}
function De(e, t) {
  return F((n, r) => {
    let o = 0
    n.subscribe(N(r, (i) => e.call(t, i, o++) && r.next(i)))
  })
}
function fe(e) {
  return F((t, n) => {
    let r = null,
      o = !1,
      i
    ;(r = t.subscribe(
      N(n, void 0, void 0, (s) => {
        ;(i = W(e(s, fe(e)(t)))),
          r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0)
      }),
    )),
      o && (r.unsubscribe(), (r = null), i.subscribe(n))
  })
}
function tl(e, t, n, r, o) {
  return (i, s) => {
    let a = n,
      u = t,
      c = 0
    i.subscribe(
      N(
        s,
        (l) => {
          let d = c++
          ;(u = a ? e(u, l, d) : ((a = !0), l)), r && s.next(u)
        },
        o &&
          (() => {
            a && s.next(u), s.complete()
          }),
      ),
    )
  }
}
function it(e, t) {
  return _(t) ? Y(e, t, 1) : Y(e, 1)
}
function st(e) {
  return F((t, n) => {
    let r = !1
    t.subscribe(
      N(
        n,
        (o) => {
          ;(r = !0), n.next(o)
        },
        () => {
          r || n.next(e), n.complete()
        },
      ),
    )
  })
}
function Qe(e) {
  return e <= 0
    ? () => ye
    : F((t, n) => {
        let r = 0
        t.subscribe(
          N(n, (o) => {
            ++r <= e && (n.next(o), e <= r && n.complete())
          }),
        )
      })
}
function ms(e) {
  return E(() => e)
}
function Io(e = Yp) {
  return F((t, n) => {
    let r = !1
    t.subscribe(
      N(
        n,
        (o) => {
          ;(r = !0), n.next(o)
        },
        () => (r ? n.complete() : n.error(e())),
      ),
    )
  })
}
function Yp() {
  return new Ye()
}
function Mt(e) {
  return F((t, n) => {
    try {
      t.subscribe(n)
    } finally {
      n.add(e)
    }
  })
}
function Le(e, t) {
  let n = arguments.length >= 2
  return (r) =>
    r.pipe(
      e ? De((o, i) => e(o, i, r)) : ve,
      Qe(1),
      n ? st(t) : Io(() => new Ye()),
    )
}
function an(e) {
  return e <= 0
    ? () => ye
    : F((t, n) => {
        let r = []
        t.subscribe(
          N(
            n,
            (o) => {
              r.push(o), e < r.length && r.shift()
            },
            () => {
              for (let o of r) n.next(o)
              n.complete()
            },
            void 0,
            () => {
              r = null
            },
          ),
        )
      })
}
function vs(e, t) {
  let n = arguments.length >= 2
  return (r) =>
    r.pipe(
      e ? De((o, i) => e(o, i, r)) : ve,
      an(1),
      n ? st(t) : Io(() => new Ye()),
    )
}
function ys(e, t) {
  return F(tl(e, t, arguments.length >= 2, !0))
}
function Ds(...e) {
  let t = ot(e)
  return F((n, r) => {
    ;(t ? sn(e, n, t) : sn(e, n)).subscribe(r)
  })
}
function we(e, t) {
  return F((n, r) => {
    let o = null,
      i = 0,
      s = !1,
      a = () => s && !o && r.complete()
    n.subscribe(
      N(
        r,
        (u) => {
          o?.unsubscribe()
          let c = 0,
            l = i++
          W(e(u, l)).subscribe(
            (o = N(
              r,
              (d) => r.next(t ? t(u, d, l, c++) : d),
              () => {
                ;(o = null), a()
              },
            )),
          )
        },
        () => {
          ;(s = !0), a()
        },
      ),
    )
  })
}
function ws(e) {
  return F((t, n) => {
    W(e).subscribe(N(n, () => n.complete(), Yn)), !n.closed && t.subscribe(n)
  })
}
function G(e, t, n) {
  let r = _(e) || t || n ? { next: e, error: t, complete: n } : e
  return r
    ? F((o, i) => {
        var s
        ;(s = r.subscribe) === null || s === void 0 || s.call(r)
        let a = !0
        o.subscribe(
          N(
            i,
            (u) => {
              var c
              ;(c = r.next) === null || c === void 0 || c.call(r, u), i.next(u)
            },
            () => {
              var u
              ;(a = !1),
                (u = r.complete) === null || u === void 0 || u.call(r),
                i.complete()
            },
            (u) => {
              var c
              ;(a = !1),
                (c = r.error) === null || c === void 0 || c.call(r, u),
                i.error(u)
            },
            () => {
              var u, c
              a && ((u = r.unsubscribe) === null || u === void 0 || u.call(r)),
                (c = r.finalize) === null || c === void 0 || c.call(r)
            },
          ),
        )
      })
    : ve
}
var Kp = 'https://g.co/ng/security#xss',
  w = class extends Error {
    constructor(t, n) {
      super(Yo(t, n)), (this.code = t)
    }
  }
function Yo(e, t) {
  return `${`NG0${Math.abs(e)}`}${t ? ': ' + t : ''}`
}
function Qo(e) {
  return { toString: e }.toString()
}
var Qn = globalThis
function j(e) {
  for (let t in e) if (e[t] === j) return t
  throw Error('Could not find renamed property on target object.')
}
function Jp(e, t) {
  for (let n in t) t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n])
}
function he(e) {
  if (typeof e == 'string') return e
  if (Array.isArray(e)) return '[' + e.map(he).join(', ') + ']'
  if (e == null) return '' + e
  if (e.overriddenName) return `${e.overriddenName}`
  if (e.name) return `${e.name}`
  let t = e.toString()
  if (t == null) return '' + t
  let n = t.indexOf(`
`)
  return n === -1 ? t : t.substring(0, n)
}
function nl(e, t) {
  return e == null || e === ''
    ? t === null
      ? ''
      : t
    : t == null || t === ''
      ? e
      : e + ' ' + t
}
var Xp = j({ __forward_ref__: j })
function En(e) {
  return (
    (e.__forward_ref__ = En),
    (e.toString = function () {
      return he(this())
    }),
    e
  )
}
function ae(e) {
  return Ll(e) ? e() : e
}
function Ll(e) {
  return (
    typeof e == 'function' && e.hasOwnProperty(Xp) && e.__forward_ref__ === En
  )
}
function D(e) {
  return {
    token: e.token,
    providedIn: e.providedIn || null,
    factory: e.factory,
    value: void 0,
  }
}
function Pt(e) {
  return { providers: e.providers || [], imports: e.imports || [] }
}
function Ko(e) {
  return rl(e, jl) || rl(e, Ul)
}
function Vl(e) {
  return Ko(e) !== null
}
function rl(e, t) {
  return e.hasOwnProperty(t) ? e[t] : null
}
function eg(e) {
  let t = e && (e[jl] || e[Ul])
  return t || null
}
function ol(e) {
  return e && (e.hasOwnProperty(il) || e.hasOwnProperty(tg)) ? e[il] : null
}
var jl = j({ ɵprov: j }),
  il = j({ ɵinj: j }),
  Ul = j({ ngInjectableDef: j }),
  tg = j({ ngInjectorDef: j }),
  C = class {
    constructor(t, n) {
      ;(this._desc = t),
        (this.ngMetadataName = 'InjectionToken'),
        (this.ɵprov = void 0),
        typeof n == 'number'
          ? (this.__NG_ELEMENT_ID__ = n)
          : n !== void 0 &&
            (this.ɵprov = D({
              token: this,
              providedIn: n.providedIn || 'root',
              factory: n.factory,
            }))
    }
    get multi() {
      return this
    }
    toString() {
      return `InjectionToken ${this._desc}`
    }
  }
function $l(e) {
  return e && !!e.ɵproviders
}
var ng = j({ ɵcmp: j }),
  rg = j({ ɵdir: j }),
  og = j({ ɵpipe: j }),
  ig = j({ ɵmod: j }),
  No = j({ ɵfac: j }),
  Kn = j({ __NG_ELEMENT_ID__: j }),
  sl = j({ __NG_ENV_ID__: j })
function Bl(e) {
  return typeof e == 'string' ? e : e == null ? '' : String(e)
}
function sg(e) {
  return typeof e == 'function'
    ? e.name || e.toString()
    : typeof e == 'object' && e != null && typeof e.type == 'function'
      ? e.type.name || e.type.toString()
      : Bl(e)
}
function ag(e, t) {
  let n = t ? `. Dependency path: ${t.join(' > ')} > ${e}` : ''
  throw new w(-200, e)
}
function Ma(e, t) {
  throw new w(-201, !1)
}
var x = (function (e) {
    return (
      (e[(e.Default = 0)] = 'Default'),
      (e[(e.Host = 1)] = 'Host'),
      (e[(e.Self = 2)] = 'Self'),
      (e[(e.SkipSelf = 4)] = 'SkipSelf'),
      (e[(e.Optional = 8)] = 'Optional'),
      e
    )
  })(x || {}),
  Ls
function Hl() {
  return Ls
}
function Ie(e) {
  let t = Ls
  return (Ls = e), t
}
function zl(e, t, n) {
  let r = Ko(e)
  if (r && r.providedIn == 'root')
    return r.value === void 0 ? (r.value = r.factory()) : r.value
  if (n & x.Optional) return null
  if (t !== void 0) return t
  Ma(e, 'Injector')
}
var ug = {},
  Jn = ug,
  cg = '__NG_DI_FLAG__',
  Ro = 'ngTempTokenPath',
  lg = 'ngTokenPath',
  dg = /\n/gm,
  fg = '\u0275',
  al = '__source',
  dn
function hg() {
  return dn
}
function at(e) {
  let t = dn
  return (dn = e), t
}
function pg(e, t = x.Default) {
  if (dn === void 0) throw new w(-203, !1)
  return dn === null
    ? zl(e, void 0, t)
    : dn.get(e, t & x.Optional ? null : void 0, t)
}
function S(e, t = x.Default) {
  return (Hl() || pg)(ae(e), t)
}
function p(e, t = x.Default) {
  return S(e, Jo(t))
}
function Jo(e) {
  return typeof e > 'u' || typeof e == 'number'
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4)
}
function Vs(e) {
  let t = []
  for (let n = 0; n < e.length; n++) {
    let r = ae(e[n])
    if (Array.isArray(r)) {
      if (r.length === 0) throw new w(900, !1)
      let o,
        i = x.Default
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          u = gg(a)
        typeof u == 'number' ? (u === -1 ? (o = a.token) : (i |= u)) : (o = a)
      }
      t.push(S(o, i))
    } else t.push(S(r))
  }
  return t
}
function gg(e) {
  return e[cg]
}
function mg(e, t, n, r) {
  let o = e[Ro]
  throw (
    (t[al] && o.unshift(t[al]),
    (e.message = vg(
      `
` + e.message,
      o,
      n,
      r,
    )),
    (e[lg] = o),
    (e[Ro] = null),
    e)
  )
}
function vg(e, t, n, r = null) {
  e =
    e &&
    e.charAt(0) ===
      `
` &&
    e.charAt(1) == fg
      ? e.slice(2)
      : e
  let o = he(t)
  if (Array.isArray(t)) o = t.map(he).join(' -> ')
  else if (typeof t == 'object') {
    let i = []
    for (let s in t)
      if (t.hasOwnProperty(s)) {
        let a = t[s]
        i.push(s + ':' + (typeof a == 'string' ? JSON.stringify(a) : he(a)))
      }
    o = `{${i.join(', ')}}`
  }
  return `${n}${r ? '(' + r + ')' : ''}[${o}]: ${e.replace(
    dg,
    `
  `,
  )}`
}
function hn(e, t) {
  let n = e.hasOwnProperty(No)
  return n ? e[No] : null
}
function _a(e, t) {
  e.forEach((n) => (Array.isArray(n) ? _a(n, t) : t(n)))
}
function Gl(e, t, n) {
  t >= e.length ? e.push(n) : e.splice(t, 0, n)
}
function Oo(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0]
}
function yg(e, t, n, r) {
  let o = e.length
  if (o == t) e.push(n, r)
  else if (o === 1) e.push(r, e[0]), (e[0] = n)
  else {
    for (o--, e.push(e[o - 1], e[o]); o > t; ) {
      let i = o - 2
      ;(e[o] = e[i]), o--
    }
    ;(e[t] = n), (e[t + 1] = r)
  }
}
function Dg(e, t, n) {
  let r = pr(e, t)
  return r >= 0 ? (e[r | 1] = n) : ((r = ~r), yg(e, r, t, n)), r
}
function Cs(e, t) {
  let n = pr(e, t)
  if (n >= 0) return e[n | 1]
}
function pr(e, t) {
  return wg(e, t, 1)
}
function wg(e, t, n) {
  let r = 0,
    o = e.length >> n
  for (; o !== r; ) {
    let i = r + ((o - r) >> 1),
      s = e[i << n]
    if (t === s) return i << n
    s > t ? (o = i) : (r = i + 1)
  }
  return ~(o << n)
}
var pn = {},
  be = [],
  gn = new C(''),
  ql = new C('', -1),
  Wl = new C(''),
  Fo = class {
    get(t, n = Jn) {
      if (n === Jn) {
        let r = new Error(`NullInjectorError: No provider for ${he(t)}!`)
        throw ((r.name = 'NullInjectorError'), r)
      }
      return n
    }
  },
  Zl = (function (e) {
    return (e[(e.OnPush = 0)] = 'OnPush'), (e[(e.Default = 1)] = 'Default'), e
  })(Zl || {}),
  Ue = (function (e) {
    return (
      (e[(e.Emulated = 0)] = 'Emulated'),
      (e[(e.None = 2)] = 'None'),
      (e[(e.ShadowDom = 3)] = 'ShadowDom'),
      e
    )
  })(Ue || {}),
  Me = (function (e) {
    return (
      (e[(e.None = 0)] = 'None'),
      (e[(e.SignalBased = 1)] = 'SignalBased'),
      (e[(e.HasDecoratorInputTransform = 2)] = 'HasDecoratorInputTransform'),
      e
    )
  })(Me || {})
function Cg(e, t, n) {
  let r = e.length
  for (;;) {
    let o = e.indexOf(t, n)
    if (o === -1) return o
    if (o === 0 || e.charCodeAt(o - 1) <= 32) {
      let i = t.length
      if (o + i === r || e.charCodeAt(o + i) <= 32) return o
    }
    n = o + 1
  }
}
function js(e, t, n) {
  let r = 0
  for (; r < n.length; ) {
    let o = n[r]
    if (typeof o == 'number') {
      if (o !== 0) break
      r++
      let i = n[r++],
        s = n[r++],
        a = n[r++]
      e.setAttribute(t, s, a, i)
    } else {
      let i = o,
        s = n[++r]
      Ig(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++
    }
  }
  return r
}
function Eg(e) {
  return e === 3 || e === 4 || e === 6
}
function Ig(e) {
  return e.charCodeAt(0) === 64
}
function Xn(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice()
    else {
      let n = -1
      for (let r = 0; r < t.length; r++) {
        let o = t[r]
        typeof o == 'number'
          ? (n = o)
          : n === 0 ||
            (n === -1 || n === 2
              ? ul(e, n, o, null, t[++r])
              : ul(e, n, o, null, null))
      }
    }
  return e
}
function ul(e, t, n, r, o) {
  let i = 0,
    s = e.length
  if (t === -1) s = -1
  else
    for (; i < e.length; ) {
      let a = e[i++]
      if (typeof a == 'number') {
        if (a === t) {
          s = -1
          break
        } else if (a > t) {
          s = i - 1
          break
        }
      }
    }
  for (; i < e.length; ) {
    let a = e[i]
    if (typeof a == 'number') break
    if (a === n) {
      if (r === null) {
        o !== null && (e[i + 1] = o)
        return
      } else if (r === e[i + 1]) {
        e[i + 2] = o
        return
      }
    }
    i++, r !== null && i++, o !== null && i++
  }
  s !== -1 && (e.splice(s, 0, t), (i = s + 1)),
    e.splice(i++, 0, n),
    r !== null && e.splice(i++, 0, r),
    o !== null && e.splice(i++, 0, o)
}
var Yl = 'ng-template'
function bg(e, t, n, r) {
  let o = 0
  if (r) {
    for (; o < t.length && typeof t[o] == 'string'; o += 2)
      if (t[o] === 'class' && Cg(t[o + 1].toLowerCase(), n, 0) !== -1) return !0
  } else if (Sa(e)) return !1
  if (((o = t.indexOf(1, o)), o > -1)) {
    let i
    for (; ++o < t.length && typeof (i = t[o]) == 'string'; )
      if (i.toLowerCase() === n) return !0
  }
  return !1
}
function Sa(e) {
  return e.type === 4 && e.value !== Yl
}
function Mg(e, t, n) {
  let r = e.type === 4 && !n ? Yl : e.value
  return t === r
}
function _g(e, t, n) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? Ag(o) : 0,
    s = !1
  for (let a = 0; a < t.length; a++) {
    let u = t[a]
    if (typeof u == 'number') {
      if (!s && !xe(r) && !xe(u)) return !1
      if (s && xe(u)) continue
      ;(s = !1), (r = u | (r & 1))
      continue
    }
    if (!s)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (u !== '' && !Mg(e, u, n)) || (u === '' && t.length === 1))
        ) {
          if (xe(r)) return !1
          s = !0
        }
      } else if (r & 8) {
        if (o === null || !bg(e, o, u, n)) {
          if (xe(r)) return !1
          s = !0
        }
      } else {
        let c = t[++a],
          l = Sg(u, o, Sa(e), n)
        if (l === -1) {
          if (xe(r)) return !1
          s = !0
          continue
        }
        if (c !== '') {
          let d
          if (
            (l > i ? (d = '') : (d = o[l + 1].toLowerCase()), r & 2 && c !== d)
          ) {
            if (xe(r)) return !1
            s = !0
          }
        }
      }
  }
  return xe(r) || s
}
function xe(e) {
  return (e & 1) === 0
}
function Sg(e, t, n, r) {
  if (t === null) return -1
  let o = 0
  if (r || !n) {
    let i = !1
    for (; o < t.length; ) {
      let s = t[o]
      if (s === e) return o
      if (s === 3 || s === 6) i = !0
      else if (s === 1 || s === 2) {
        let a = t[++o]
        for (; typeof a == 'string'; ) a = t[++o]
        continue
      } else {
        if (s === 4) break
        if (s === 0) {
          o += 4
          continue
        }
      }
      o += i ? 1 : 2
    }
    return -1
  } else return xg(t, e)
}
function Tg(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if (_g(e, t[r], n)) return !0
  return !1
}
function Ag(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t]
    if (Eg(n)) return t
  }
  return e.length
}
function xg(e, t) {
  let n = e.indexOf(4)
  if (n > -1)
    for (n++; n < e.length; ) {
      let r = e[n]
      if (typeof r == 'number') return -1
      if (r === t) return n
      n++
    }
  return -1
}
function cl(e, t) {
  return e ? ':not(' + t.trim() + ')' : t
}
function Ng(e) {
  let t = e[0],
    n = 1,
    r = 2,
    o = '',
    i = !1
  for (; n < e.length; ) {
    let s = e[n]
    if (typeof s == 'string')
      if (r & 2) {
        let a = e[++n]
        o += '[' + s + (a.length > 0 ? '="' + a + '"' : '') + ']'
      } else r & 8 ? (o += '.' + s) : r & 4 && (o += ' ' + s)
    else
      o !== '' && !xe(s) && ((t += cl(i, o)), (o = '')),
        (r = s),
        (i = i || !xe(r))
    n++
  }
  return o !== '' && (t += cl(i, o)), t
}
function Rg(e) {
  return e.map(Ng).join(',')
}
function Og(e) {
  let t = [],
    n = [],
    r = 1,
    o = 2
  for (; r < e.length; ) {
    let i = e[r]
    if (typeof i == 'string')
      o === 2 ? i !== '' && t.push(i, e[++r]) : o === 8 && n.push(i)
    else {
      if (!xe(o)) break
      o = i
    }
    r++
  }
  return { attrs: t, classes: n }
}
function dt(e) {
  return Qo(() => {
    let t = ed(e),
      n = R(g({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === Zl.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || Ue.Emulated,
        styles: e.styles || be,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: '',
      })
    td(n)
    let r = e.dependencies
    return (
      (n.directiveDefs = dl(r, !1)), (n.pipeDefs = dl(r, !0)), (n.id = kg(n)), n
    )
  })
}
function Fg(e) {
  return Tt(e) || Ql(e)
}
function Pg(e) {
  return e !== null
}
function kt(e) {
  return Qo(() => ({
    type: e.type,
    bootstrap: e.bootstrap || be,
    declarations: e.declarations || be,
    imports: e.imports || be,
    exports: e.exports || be,
    transitiveCompileScopes: null,
    schemas: e.schemas || null,
    id: e.id || null,
  }))
}
function ll(e, t) {
  if (e == null) return pn
  let n = {}
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let o = e[r],
        i,
        s,
        a = Me.None
      Array.isArray(o)
        ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i))
        : ((i = o), (s = o)),
        t ? ((n[i] = a !== Me.None ? [r, a] : r), (t[i] = s)) : (n[i] = r)
    }
  return n
}
function He(e) {
  return Qo(() => {
    let t = ed(e)
    return td(t), t
  })
}
function Tt(e) {
  return e[ng] || null
}
function Ql(e) {
  return e[rg] || null
}
function Kl(e) {
  return e[og] || null
}
function Jl(e) {
  let t = Tt(e) || Ql(e) || Kl(e)
  return t !== null ? t.standalone : !1
}
function Xl(e, t) {
  let n = e[ig] || null
  if (!n && t === !0)
    throw new Error(`Type ${he(e)} does not have '\u0275mod' property.`)
  return n
}
function ed(e) {
  let t = {}
  return {
    type: e.type,
    providersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: t,
    inputTransforms: null,
    inputConfig: e.inputs || pn,
    exportAs: e.exportAs || null,
    standalone: e.standalone === !0,
    signals: e.signals === !0,
    selectors: e.selectors || be,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: ll(e.inputs, t),
    outputs: ll(e.outputs),
    debugInfo: null,
  }
}
function td(e) {
  e.features?.forEach((t) => t(e))
}
function dl(e, t) {
  if (!e) return null
  let n = t ? Kl : Fg
  return () => (typeof e == 'function' ? e() : e).map((r) => n(r)).filter(Pg)
}
function kg(e) {
  let t = 0,
    n = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      e.consts,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ].join('|')
  for (let o of n) t = (Math.imul(31, t) + o.charCodeAt(0)) << 0
  return (t += 2147483648), 'c' + t
}
function In(e) {
  return { ɵproviders: e }
}
function Lg(...e) {
  return { ɵproviders: nd(!0, e), ɵfromNgModule: !0 }
}
function nd(e, ...t) {
  let n = [],
    r = new Set(),
    o,
    i = (s) => {
      n.push(s)
    }
  return (
    _a(t, (s) => {
      let a = s
      Us(a, i, [], r) && ((o ||= []), o.push(a))
    }),
    o !== void 0 && rd(o, i),
    n
  )
}
function rd(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: o } = e[n]
    Ta(o, (i) => {
      t(i, r)
    })
  }
}
function Us(e, t, n, r) {
  if (((e = ae(e)), !e)) return !1
  let o = null,
    i = ol(e),
    s = !i && Tt(e)
  if (!i && !s) {
    let u = e.ngModule
    if (((i = ol(u)), i)) o = u
    else return !1
  } else {
    if (s && !s.standalone) return !1
    o = e
  }
  let a = r.has(o)
  if (s) {
    if (a) return !1
    if ((r.add(o), s.dependencies)) {
      let u =
        typeof s.dependencies == 'function' ? s.dependencies() : s.dependencies
      for (let c of u) Us(c, t, n, r)
    }
  } else if (i) {
    if (i.imports != null && !a) {
      r.add(o)
      let c
      try {
        _a(i.imports, (l) => {
          Us(l, t, n, r) && ((c ||= []), c.push(l))
        })
      } finally {
      }
      c !== void 0 && rd(c, t)
    }
    if (!a) {
      let c = hn(o) || (() => new o())
      t({ provide: o, useFactory: c, deps: be }, o),
        t({ provide: Wl, useValue: o, multi: !0 }, o),
        t({ provide: gn, useValue: () => S(o), multi: !0 }, o)
    }
    let u = i.providers
    if (u != null && !a) {
      let c = e
      Ta(u, (l) => {
        t(l, c)
      })
    }
  } else return !1
  return o !== e && e.providers !== void 0
}
function Ta(e, t) {
  for (let n of e)
    $l(n) && (n = n.ɵproviders), Array.isArray(n) ? Ta(n, t) : t(n)
}
var Vg = j({ provide: String, useValue: j })
function od(e) {
  return e !== null && typeof e == 'object' && Vg in e
}
function jg(e) {
  return !!(e && e.useExisting)
}
function Ug(e) {
  return !!(e && e.useFactory)
}
function mn(e) {
  return typeof e == 'function'
}
function $g(e) {
  return !!e.useClass
}
var Xo = new C(''),
  _o = {},
  Bg = {},
  Es
function Aa() {
  return Es === void 0 && (Es = new Fo()), Es
}
var pe = class {},
  er = class extends pe {
    get destroyed() {
      return this._destroyed
    }
    constructor(t, n, r, o) {
      super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = o),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        Bs(t, (s) => this.processProvider(s)),
        this.records.set(ql, un(void 0, this)),
        o.has('environment') && this.records.set(pe, un(void 0, this))
      let i = this.records.get(Xo)
      i != null && typeof i.value == 'string' && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(Wl, be, x.Self)))
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0)
      let t = O(null)
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy()
        let n = this._onDestroyHooks
        this._onDestroyHooks = []
        for (let r of n) r()
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          O(t)
      }
    }
    onDestroy(t) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(t),
        () => this.removeOnDestroy(t)
      )
    }
    runInContext(t) {
      this.assertNotDestroyed()
      let n = at(this),
        r = Ie(void 0),
        o
      try {
        return t()
      } finally {
        at(n), Ie(r)
      }
    }
    get(t, n = Jn, r = x.Default) {
      if ((this.assertNotDestroyed(), t.hasOwnProperty(sl))) return t[sl](this)
      r = Jo(r)
      let o,
        i = at(this),
        s = Ie(void 0)
      try {
        if (!(r & x.SkipSelf)) {
          let u = this.records.get(t)
          if (u === void 0) {
            let c = Wg(t) && Ko(t)
            c && this.injectableDefInScope(c)
              ? (u = un($s(t), _o))
              : (u = null),
              this.records.set(t, u)
          }
          if (u != null) return this.hydrate(t, u)
        }
        let a = r & x.Self ? Aa() : this.parent
        return (n = r & x.Optional && n === Jn ? null : n), a.get(t, n)
      } catch (a) {
        if (a.name === 'NullInjectorError') {
          if (((a[Ro] = a[Ro] || []).unshift(he(t)), i)) throw a
          return mg(a, t, 'R3InjectorError', this.source)
        } else throw a
      } finally {
        Ie(s), at(i)
      }
    }
    resolveInjectorInitializers() {
      let t = O(null),
        n = at(this),
        r = Ie(void 0),
        o
      try {
        let i = this.get(gn, be, x.Self)
        for (let s of i) s()
      } finally {
        at(n), Ie(r), O(t)
      }
    }
    toString() {
      let t = [],
        n = this.records
      for (let r of n.keys()) t.push(he(r))
      return `R3Injector[${t.join(', ')}]`
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new w(205, !1)
    }
    processProvider(t) {
      t = ae(t)
      let n = mn(t) ? t : ae(t && t.provide),
        r = zg(t)
      if (!mn(t) && t.multi === !0) {
        let o = this.records.get(n)
        o ||
          ((o = un(void 0, _o, !0)),
          (o.factory = () => Vs(o.multi)),
          this.records.set(n, o)),
          (n = t),
          o.multi.push(t)
      }
      this.records.set(n, r)
    }
    hydrate(t, n) {
      let r = O(null)
      try {
        return (
          n.value === _o && ((n.value = Bg), (n.value = n.factory())),
          typeof n.value == 'object' &&
            n.value &&
            qg(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        )
      } finally {
        O(r)
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1
      let n = ae(t.providedIn)
      return typeof n == 'string'
        ? n === 'any' || this.scopes.has(n)
        : this.injectorDefTypes.has(n)
    }
    removeOnDestroy(t) {
      let n = this._onDestroyHooks.indexOf(t)
      n !== -1 && this._onDestroyHooks.splice(n, 1)
    }
  }
function $s(e) {
  let t = Ko(e),
    n = t !== null ? t.factory : hn(e)
  if (n !== null) return n
  if (e instanceof C) throw new w(204, !1)
  if (e instanceof Function) return Hg(e)
  throw new w(204, !1)
}
function Hg(e) {
  if (e.length > 0) throw new w(204, !1)
  let n = eg(e)
  return n !== null ? () => n.factory(e) : () => new e()
}
function zg(e) {
  if (od(e)) return un(void 0, e.useValue)
  {
    let t = id(e)
    return un(t, _o)
  }
}
function id(e, t, n) {
  let r
  if (mn(e)) {
    let o = ae(e)
    return hn(o) || $s(o)
  } else if (od(e)) r = () => ae(e.useValue)
  else if (Ug(e)) r = () => e.useFactory(...Vs(e.deps || []))
  else if (jg(e)) r = () => S(ae(e.useExisting))
  else {
    let o = ae(e && (e.useClass || e.provide))
    if (Gg(e)) r = () => new o(...Vs(e.deps))
    else return hn(o) || $s(o)
  }
  return r
}
function un(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 }
}
function Gg(e) {
  return !!e.deps
}
function qg(e) {
  return (
    e !== null && typeof e == 'object' && typeof e.ngOnDestroy == 'function'
  )
}
function Wg(e) {
  return typeof e == 'function' || (typeof e == 'object' && e instanceof C)
}
function Bs(e, t) {
  for (let n of e)
    Array.isArray(n) ? Bs(n, t) : n && $l(n) ? Bs(n.ɵproviders, t) : t(n)
}
function Xe(e, t) {
  e instanceof er && e.assertNotDestroyed()
  let n,
    r = at(e),
    o = Ie(void 0)
  try {
    return t()
  } finally {
    at(r), Ie(o)
  }
}
function Zg() {
  return Hl() !== void 0 || hg() != null
}
function Yg(e) {
  return typeof e == 'function'
}
var et = 0,
  A = 1,
  I = 2,
  re = 3,
  Ne = 4,
  Fe = 5,
  tr = 6,
  nr = 7,
  ce = 8,
  vn = 9,
  $e = 10,
  K = 11,
  rr = 12,
  fl = 13,
  bn = 14,
  Re = 15,
  ei = 16,
  cn = 17,
  yn = 18,
  ti = 19,
  sd = 20,
  ut = 21,
  Is = 22,
  At = 23,
  Oe = 25,
  ad = 1
var xt = 7,
  Po = 8,
  ko = 9,
  le = 10,
  xa = (function (e) {
    return (
      (e[(e.None = 0)] = 'None'),
      (e[(e.HasTransplantedViews = 2)] = 'HasTransplantedViews'),
      e
    )
  })(xa || {})
function _t(e) {
  return Array.isArray(e) && typeof e[ad] == 'object'
}
function tt(e) {
  return Array.isArray(e) && e[ad] === !0
}
function ud(e) {
  return (e.flags & 4) !== 0
}
function ni(e) {
  return e.componentOffset > -1
}
function Na(e) {
  return (e.flags & 1) === 1
}
function ct(e) {
  return !!e.template
}
function Qg(e) {
  return (e[I] & 512) !== 0
}
var Hs = class {
  constructor(t, n, r) {
    ;(this.previousValue = t), (this.currentValue = n), (this.firstChange = r)
  }
  isFirstChange() {
    return this.firstChange
  }
}
function cd(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r)
}
function Mn() {
  return ld
}
function ld(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = Jg), Kg
}
Mn.ngInherit = !0
function Kg() {
  let e = fd(this),
    t = e?.current
  if (t) {
    let n = e.previous
    if (n === pn) e.previous = t
    else for (let r in t) n[r] = t[r]
    ;(e.current = null), this.ngOnChanges(t)
  }
}
function Jg(e, t, n, r, o) {
  let i = this.declaredInputs[r],
    s = fd(e) || Xg(e, { previous: pn, current: null }),
    a = s.current || (s.current = {}),
    u = s.previous,
    c = u[i]
  ;(a[i] = new Hs(c && c.currentValue, n, u === pn)), cd(e, t, o, n)
}
var dd = '__ngSimpleChanges__'
function fd(e) {
  return e[dd] || null
}
function Xg(e, t) {
  return (e[dd] = t)
}
var hl = null
var Ve = function (e, t, n) {
    hl?.(e, t, n)
  },
  em = 'svg',
  tm = 'math',
  nm = !1
function rm() {
  return nm
}
function Be(e) {
  for (; Array.isArray(e); ) e = e[et]
  return e
}
function hd(e, t) {
  return Be(t[e])
}
function Pe(e, t) {
  return Be(t[e.index])
}
function Ra(e, t) {
  return e.data[t]
}
function ft(e, t) {
  let n = t[e]
  return _t(n) ? n : n[et]
}
function Oa(e) {
  return (e[I] & 128) === 128
}
function om(e) {
  return tt(e[re])
}
function Lo(e, t) {
  return t == null ? null : e[t]
}
function pd(e) {
  e[cn] = 0
}
function im(e) {
  e[I] & 1024 || ((e[I] |= 1024), Oa(e) && or(e))
}
function sm(e, t) {
  for (; e > 0; ) (t = t[bn]), e--
  return t
}
function Fa(e) {
  return !!(e[I] & 9216 || e[At]?.dirty)
}
function zs(e) {
  e[$e].changeDetectionScheduler?.notify(1),
    Fa(e)
      ? or(e)
      : e[I] & 64 &&
        (rm()
          ? ((e[I] |= 1024), or(e))
          : e[$e].changeDetectionScheduler?.notify())
}
function or(e) {
  e[$e].changeDetectionScheduler?.notify()
  let t = ir(e)
  for (; t !== null && !(t[I] & 8192 || ((t[I] |= 8192), !Oa(t))); ) t = ir(t)
}
function gd(e, t) {
  if ((e[I] & 256) === 256) throw new w(911, !1)
  e[ut] === null && (e[ut] = []), e[ut].push(t)
}
function am(e, t) {
  if (e[ut] === null) return
  let n = e[ut].indexOf(t)
  n !== -1 && e[ut].splice(n, 1)
}
function ir(e) {
  let t = e[re]
  return tt(t) ? t[re] : t
}
var P = { lFrame: Ed(null), bindingsEnabled: !0, skipHydrationRootTNode: null }
function um() {
  return P.lFrame.elementDepthCount
}
function cm() {
  P.lFrame.elementDepthCount++
}
function lm() {
  P.lFrame.elementDepthCount--
}
function md() {
  return P.bindingsEnabled
}
function dm() {
  return P.skipHydrationRootTNode !== null
}
function fm(e) {
  return P.skipHydrationRootTNode === e
}
function hm() {
  P.skipHydrationRootTNode = null
}
function B() {
  return P.lFrame.lView
}
function _e() {
  return P.lFrame.tView
}
function Se() {
  let e = vd()
  for (; e !== null && e.type === 64; ) e = e.parent
  return e
}
function vd() {
  return P.lFrame.currentTNode
}
function pm() {
  let e = P.lFrame,
    t = e.currentTNode
  return e.isParent ? t : t.parent
}
function gr(e, t) {
  let n = P.lFrame
  ;(n.currentTNode = e), (n.isParent = t)
}
function yd() {
  return P.lFrame.isParent
}
function gm() {
  P.lFrame.isParent = !1
}
function mm(e) {
  return (P.lFrame.bindingIndex = e)
}
function mr() {
  return P.lFrame.bindingIndex++
}
function vm(e) {
  let t = P.lFrame,
    n = t.bindingIndex
  return (t.bindingIndex = t.bindingIndex + e), n
}
function ym() {
  return P.lFrame.inI18n
}
function Dm(e, t) {
  let n = P.lFrame
  ;(n.bindingIndex = n.bindingRootIndex = e), Gs(t)
}
function wm() {
  return P.lFrame.currentDirectiveIndex
}
function Gs(e) {
  P.lFrame.currentDirectiveIndex = e
}
function Cm(e) {
  let t = P.lFrame.currentDirectiveIndex
  return t === -1 ? null : e[t]
}
function Dd(e) {
  P.lFrame.currentQueryIndex = e
}
function Em(e) {
  let t = e[A]
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[Fe] : null
}
function wd(e, t, n) {
  if (n & x.SkipSelf) {
    let o = t,
      i = e
    for (; (o = o.parent), o === null && !(n & x.Host); )
      if (((o = Em(i)), o === null || ((i = i[bn]), o.type & 10))) break
    if (o === null) return !1
    ;(t = o), (e = i)
  }
  let r = (P.lFrame = Cd())
  return (r.currentTNode = t), (r.lView = e), !0
}
function Pa(e) {
  let t = Cd(),
    n = e[A]
  ;(P.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1)
}
function Cd() {
  let e = P.lFrame,
    t = e === null ? null : e.child
  return t === null ? Ed(e) : t
}
function Ed(e) {
  let t = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: !1,
  }
  return e !== null && (e.child = t), t
}
function Id() {
  let e = P.lFrame
  return (P.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
}
var bd = Id
function ka() {
  let e = Id()
  ;(e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0)
}
function Im(e) {
  return (P.lFrame.contextLView = sm(e, P.lFrame.contextLView))[ce]
}
function Lt() {
  return P.lFrame.selectedIndex
}
function Nt(e) {
  P.lFrame.selectedIndex = e
}
function Md() {
  let e = P.lFrame
  return Ra(e.tView, e.selectedIndex)
}
function bm() {
  return P.lFrame.currentNamespace
}
var _d = !0
function La() {
  return _d
}
function Va(e) {
  _d = e
}
function Mm(e, t, n) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype
  if (r) {
    let s = ld(t)
    ;(n.preOrderHooks ??= []).push(e, s),
      (n.preOrderCheckHooks ??= []).push(e, s)
  }
  o && (n.preOrderHooks ??= []).push(0 - e, o),
    i &&
      ((n.preOrderHooks ??= []).push(e, i),
      (n.preOrderCheckHooks ??= []).push(e, i))
}
function ja(e, t) {
  for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
    let i = e.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: u,
        ngAfterViewChecked: c,
        ngOnDestroy: l,
      } = i
    s && (e.contentHooks ??= []).push(-n, s),
      a &&
        ((e.contentHooks ??= []).push(n, a),
        (e.contentCheckHooks ??= []).push(n, a)),
      u && (e.viewHooks ??= []).push(-n, u),
      c &&
        ((e.viewHooks ??= []).push(n, c), (e.viewCheckHooks ??= []).push(n, c)),
      l != null && (e.destroyHooks ??= []).push(n, l)
  }
}
function So(e, t, n) {
  Sd(e, t, 3, n)
}
function To(e, t, n, r) {
  ;(e[I] & 3) === n && Sd(e, t, n, r)
}
function bs(e, t) {
  let n = e[I]
  ;(n & 3) === t && ((n &= 16383), (n += 1), (e[I] = n))
}
function Sd(e, t, n, r) {
  let o = r !== void 0 ? e[cn] & 65535 : 0,
    i = r ?? -1,
    s = t.length - 1,
    a = 0
  for (let u = o; u < s; u++)
    if (typeof t[u + 1] == 'number') {
      if (((a = t[u]), r != null && a >= r)) break
    } else
      t[u] < 0 && (e[cn] += 65536),
        (a < i || i == -1) &&
          (_m(e, n, t, u), (e[cn] = (e[cn] & 4294901760) + u + 2)),
        u++
}
function pl(e, t) {
  Ve(4, e, t)
  let n = O(null)
  try {
    t.call(e)
  } finally {
    O(n), Ve(5, e, t)
  }
}
function _m(e, t, n, r) {
  let o = n[r] < 0,
    i = n[r + 1],
    s = o ? -n[r] : n[r],
    a = e[s]
  o
    ? e[I] >> 14 < e[cn] >> 16 &&
      (e[I] & 3) === t &&
      ((e[I] += 16384), pl(a, i))
    : pl(a, i)
}
var fn = -1,
  Rt = class {
    constructor(t, n, r) {
      ;(this.factory = t),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r)
    }
  }
function Sm(e) {
  return e instanceof Rt
}
function Tm(e) {
  return (e.flags & 8) !== 0
}
function Am(e) {
  return (e.flags & 16) !== 0
}
function Td(e) {
  return e !== fn
}
function Vo(e) {
  return e & 32767
}
function xm(e) {
  return e >> 16
}
function jo(e, t) {
  let n = xm(e),
    r = t
  for (; n > 0; ) (r = r[bn]), n--
  return r
}
var qs = !0
function gl(e) {
  let t = qs
  return (qs = e), t
}
var Nm = 256,
  Ad = Nm - 1,
  xd = 5,
  Rm = 0,
  je = {}
function Om(e, t, n) {
  let r
  typeof n == 'string'
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(Kn) && (r = n[Kn]),
    r == null && (r = n[Kn] = Rm++)
  let o = r & Ad,
    i = 1 << o
  t.data[e + (o >> xd)] |= i
}
function Uo(e, t) {
  let n = Nd(e, t)
  if (n !== -1) return n
  let r = t[A]
  r.firstCreatePass &&
    ((e.injectorIndex = t.length),
    Ms(r.data, e),
    Ms(t, null),
    Ms(r.blueprint, null))
  let o = Ua(e, t),
    i = e.injectorIndex
  if (Td(o)) {
    let s = Vo(o),
      a = jo(o, t),
      u = a[A].data
    for (let c = 0; c < 8; c++) t[i + c] = a[s + c] | u[s + c]
  }
  return (t[i + 8] = o), i
}
function Ms(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t)
}
function Nd(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex
}
function Ua(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex
  let n = 0,
    r = null,
    o = t
  for (; o !== null; ) {
    if (((r = kd(o)), r === null)) return fn
    if ((n++, (o = o[bn]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16)
  }
  return fn
}
function Ws(e, t, n) {
  Om(e, t, n)
}
function Rd(e, t, n) {
  if (n & x.Optional || e !== void 0) return e
  Ma(t, 'NodeInjector')
}
function Od(e, t, n, r) {
  if (
    (n & x.Optional && r === void 0 && (r = null), !(n & (x.Self | x.Host)))
  ) {
    let o = e[vn],
      i = Ie(void 0)
    try {
      return o ? o.get(t, r, n & x.Optional) : zl(t, r, n & x.Optional)
    } finally {
      Ie(i)
    }
  }
  return Rd(r, t, n)
}
function Fd(e, t, n, r = x.Default, o) {
  if (e !== null) {
    if (t[I] & 2048 && !(r & x.Self)) {
      let s = Vm(e, t, n, r, je)
      if (s !== je) return s
    }
    let i = Pd(e, t, n, r, je)
    if (i !== je) return i
  }
  return Od(t, n, r, o)
}
function Pd(e, t, n, r, o) {
  let i = km(n)
  if (typeof i == 'function') {
    if (!wd(t, e, r)) return r & x.Host ? Rd(o, n, r) : Od(t, n, r, o)
    try {
      let s
      if (((s = i(r)), s == null && !(r & x.Optional))) Ma(n)
      else return s
    } finally {
      bd()
    }
  } else if (typeof i == 'number') {
    let s = null,
      a = Nd(e, t),
      u = fn,
      c = r & x.Host ? t[Re][Fe] : null
    for (
      (a === -1 || r & x.SkipSelf) &&
      ((u = a === -1 ? Ua(e, t) : t[a + 8]),
      u === fn || !vl(r, !1)
        ? (a = -1)
        : ((s = t[A]), (a = Vo(u)), (t = jo(u, t))));
      a !== -1;

    ) {
      let l = t[A]
      if (ml(i, a, l.data)) {
        let d = Fm(a, t, n, s, r, c)
        if (d !== je) return d
      }
      ;(u = t[a + 8]),
        u !== fn && vl(r, t[A].data[a + 8] === c) && ml(i, a, t)
          ? ((s = l), (a = Vo(u)), (t = jo(u, t)))
          : (a = -1)
    }
  }
  return o
}
function Fm(e, t, n, r, o, i) {
  let s = t[A],
    a = s.data[e + 8],
    u = r == null ? ni(a) && qs : r != s && (a.type & 3) !== 0,
    c = o & x.Host && i === a,
    l = Pm(a, s, n, u, c)
  return l !== null ? Dn(t, s, l, a) : je
}
function Pm(e, t, n, r, o) {
  let i = e.providerIndexes,
    s = t.data,
    a = i & 1048575,
    u = e.directiveStart,
    c = e.directiveEnd,
    l = i >> 20,
    d = r ? a : a + l,
    f = o ? a + l : c
  for (let h = d; h < f; h++) {
    let m = s[h]
    if ((h < u && n === m) || (h >= u && m.type === n)) return h
  }
  if (o) {
    let h = s[u]
    if (h && ct(h) && h.type === n) return u
  }
  return null
}
function Dn(e, t, n, r) {
  let o = e[n],
    i = t.data
  if (Sm(o)) {
    let s = o
    s.resolving && ag(sg(i[n]))
    let a = gl(s.canSeeViewProviders)
    s.resolving = !0
    let u,
      c = s.injectImpl ? Ie(s.injectImpl) : null,
      l = wd(e, r, x.Default)
    try {
      ;(o = e[n] = s.factory(void 0, i, e, r)),
        t.firstCreatePass && n >= r.directiveStart && Mm(n, i[n], t)
    } finally {
      c !== null && Ie(c), gl(a), (s.resolving = !1), bd()
    }
  }
  return o
}
function km(e) {
  if (typeof e == 'string') return e.charCodeAt(0) || 0
  let t = e.hasOwnProperty(Kn) ? e[Kn] : void 0
  return typeof t == 'number' ? (t >= 0 ? t & Ad : Lm) : t
}
function ml(e, t, n) {
  let r = 1 << e
  return !!(n[t + (e >> xd)] & r)
}
function vl(e, t) {
  return !(e & x.Self) && !(e & x.Host && t)
}
var St = class {
  constructor(t, n) {
    ;(this._tNode = t), (this._lView = n)
  }
  get(t, n, r) {
    return Fd(this._tNode, this._lView, t, Jo(r), n)
  }
}
function Lm() {
  return new St(Se(), B())
}
function ht(e) {
  return Qo(() => {
    let t = e.prototype.constructor,
      n = t[No] || Zs(t),
      r = Object.prototype,
      o = Object.getPrototypeOf(e.prototype).constructor
    for (; o && o !== r; ) {
      let i = o[No] || Zs(o)
      if (i && i !== n) return i
      o = Object.getPrototypeOf(o)
    }
    return (i) => new i()
  })
}
function Zs(e) {
  return Ll(e)
    ? () => {
        let t = Zs(ae(e))
        return t && t()
      }
    : hn(e)
}
function Vm(e, t, n, r, o) {
  let i = e,
    s = t
  for (; i !== null && s !== null && s[I] & 2048 && !(s[I] & 512); ) {
    let a = Pd(i, s, n, r | x.Self, je)
    if (a !== je) return a
    let u = i.parent
    if (!u) {
      let c = s[sd]
      if (c) {
        let l = c.get(n, je, r)
        if (l !== je) return l
      }
      ;(u = kd(s)), (s = s[bn])
    }
    i = u
  }
  return o
}
function kd(e) {
  let t = e[A],
    n = t.type
  return n === 2 ? t.declTNode : n === 1 ? e[Fe] : null
}
function yl(e, t = null, n = null, r) {
  let o = Ld(e, t, n, r)
  return o.resolveInjectorInitializers(), o
}
function Ld(e, t = null, n = null, r, o = new Set()) {
  let i = [n || be, Lg(e)]
  return (
    (r = r || (typeof e == 'object' ? void 0 : he(e))),
    new er(i, t || Aa(), r || null, o)
  )
}
var _n = (() => {
  let t = class t {
    static create(r, o) {
      if (Array.isArray(r)) return yl({ name: '' }, o, r, '')
      {
        let i = r.name ?? ''
        return yl({ name: i }, r.parent, r.providers, i)
      }
    }
  }
  ;(t.THROW_IF_NOT_FOUND = Jn),
    (t.NULL = new Fo()),
    (t.ɵprov = D({ token: t, providedIn: 'any', factory: () => S(ql) })),
    (t.__NG_ELEMENT_ID__ = -1)
  let e = t
  return e
})()
var jm = 'ngOriginalError'
function _s(e) {
  return e[jm]
}
var Ke = class {
    constructor() {
      this._console = console
    }
    handleError(t) {
      let n = this._findOriginalError(t)
      this._console.error('ERROR', t),
        n && this._console.error('ORIGINAL ERROR', n)
    }
    _findOriginalError(t) {
      let n = t && _s(t)
      for (; n && _s(n); ) n = _s(n)
      return n || null
    }
  },
  Vd = new C('', {
    providedIn: 'root',
    factory: () => p(Ke).handleError.bind(void 0),
  }),
  jd = (() => {
    let t = class t {}
    ;(t.__NG_ELEMENT_ID__ = Um), (t.__NG_ENV_ID__ = (r) => r)
    let e = t
    return e
  })(),
  Ys = class extends jd {
    constructor(t) {
      super(), (this._lView = t)
    }
    onDestroy(t) {
      return gd(this._lView, t), () => am(this._lView, t)
    }
  }
function Um() {
  return new Ys(B())
}
function $m() {
  return $a(Se(), B())
}
function $a(e, t) {
  return new Vt(Pe(e, t))
}
var Vt = (() => {
  let t = class t {
    constructor(r) {
      this.nativeElement = r
    }
  }
  t.__NG_ELEMENT_ID__ = $m
  let e = t
  return e
})()
var Qs = class extends se {
  constructor(t = !1) {
    super(),
      (this.destroyRef = void 0),
      (this.__isAsync = t),
      Zg() && (this.destroyRef = p(jd, { optional: !0 }) ?? void 0)
  }
  emit(t) {
    let n = O(null)
    try {
      super.next(t)
    } finally {
      O(n)
    }
  }
  subscribe(t, n, r) {
    let o = t,
      i = n || (() => null),
      s = r
    if (t && typeof t == 'object') {
      let u = t
      ;(o = u.next?.bind(u)), (i = u.error?.bind(u)), (s = u.complete?.bind(u))
    }
    this.__isAsync && ((i = Ss(i)), o && (o = Ss(o)), s && (s = Ss(s)))
    let a = super.subscribe({ next: o, error: i, complete: s })
    return t instanceof Z && t.add(a), a
  }
}
function Ss(e) {
  return (t) => {
    setTimeout(e, void 0, t)
  }
}
var ue = Qs
function Ud(e) {
  return (e.flags & 128) === 128
}
var $d = new Map(),
  Bm = 0
function Hm() {
  return Bm++
}
function zm(e) {
  $d.set(e[ti], e)
}
function Gm(e) {
  $d.delete(e[ti])
}
var Dl = '__ngContext__'
function Ot(e, t) {
  _t(t) ? ((e[Dl] = t[ti]), zm(t)) : (e[Dl] = t)
}
function Bd(e) {
  return zd(e[rr])
}
function Hd(e) {
  return zd(e[Ne])
}
function zd(e) {
  for (; e !== null && !tt(e); ) e = e[Ne]
  return e
}
var Ks
function Gd(e) {
  Ks = e
}
function qm() {
  if (Ks !== void 0) return Ks
  if (typeof document < 'u') return document
  throw new w(210, !1)
}
var Ba = new C('', { providedIn: 'root', factory: () => Wm }),
  Wm = 'ng',
  Ha = new C(''),
  pt = new C('', { providedIn: 'platform', factory: () => 'unknown' })
var za = new C('', {
  providedIn: 'root',
  factory: () =>
    qm().body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') ||
    null,
})
var Zm = 'h',
  Ym = 'b'
var Qm = () => null
function Ga(e, t, n = !1) {
  return Qm(e, t, n)
}
var qd = !1,
  Km = new C('', { providedIn: 'root', factory: () => qd })
var Js = class {
  constructor(t) {
    this.changingThisBreaksApplicationSecurity = t
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Kp})`
  }
}
function qa(e) {
  return e instanceof Js ? e.changingThisBreaksApplicationSecurity : e
}
function Wd(e) {
  return e instanceof Function ? e() : e
}
var Je = (function (e) {
    return (
      (e[(e.Important = 1)] = 'Important'),
      (e[(e.DashCase = 2)] = 'DashCase'),
      e
    )
  })(Je || {}),
  Jm
function Wa(e, t) {
  return Jm(e, t)
}
function ln(e, t, n, r, o) {
  if (r != null) {
    let i,
      s = !1
    tt(r) ? (i = r) : _t(r) && ((s = !0), (r = r[et]))
    let a = Be(r)
    e === 0 && n !== null
      ? o == null
        ? Kd(t, n, a)
        : $o(t, n, a, o || null, !0)
      : e === 1 && n !== null
        ? $o(t, n, a, o || null, !0)
        : e === 2
          ? gv(t, a, s)
          : e === 3 && t.destroyNode(a),
      i != null && vv(t, e, i, n, o)
  }
}
function Xm(e, t) {
  return e.createText(t)
}
function ev(e, t, n) {
  e.setValue(t, n)
}
function Zd(e, t, n) {
  return e.createElement(t, n)
}
function tv(e, t) {
  Yd(e, t), (t[et] = null), (t[Fe] = null)
}
function nv(e, t, n, r, o, i) {
  ;(r[et] = o), (r[Fe] = t), oi(e, r, n, 1, o, i)
}
function Yd(e, t) {
  t[$e].changeDetectionScheduler?.notify(1), oi(e, t, t[K], 2, null, null)
}
function rv(e) {
  let t = e[rr]
  if (!t) return Ts(e[A], e)
  for (; t; ) {
    let n = null
    if (_t(t)) n = t[rr]
    else {
      let r = t[le]
      r && (n = r)
    }
    if (!n) {
      for (; t && !t[Ne] && t !== e; ) _t(t) && Ts(t[A], t), (t = t[re])
      t === null && (t = e), _t(t) && Ts(t[A], t), (n = t && t[Ne])
    }
    t = n
  }
}
function ov(e, t, n, r) {
  let o = le + r,
    i = n.length
  r > 0 && (n[o - 1][Ne] = t),
    r < i - le
      ? ((t[Ne] = n[o]), Gl(n, le + r, t))
      : (n.push(t), (t[Ne] = null)),
    (t[re] = n)
  let s = t[ei]
  s !== null && n !== s && iv(s, t)
  let a = t[yn]
  a !== null && a.insertView(e), zs(t), (t[I] |= 128)
}
function iv(e, t) {
  let n = e[ko],
    o = t[re][re][Re]
  t[Re] !== o && (e[I] |= xa.HasTransplantedViews),
    n === null ? (e[ko] = [t]) : n.push(t)
}
function Qd(e, t) {
  let n = e[ko],
    r = n.indexOf(t)
  n.splice(r, 1)
}
function sr(e, t) {
  if (e.length <= le) return
  let n = le + t,
    r = e[n]
  if (r) {
    let o = r[ei]
    o !== null && o !== e && Qd(o, r), t > 0 && (e[n - 1][Ne] = r[Ne])
    let i = Oo(e, le + t)
    tv(r[A], r)
    let s = i[yn]
    s !== null && s.detachView(i[A]),
      (r[re] = null),
      (r[Ne] = null),
      (r[I] &= -129)
  }
  return r
}
function ri(e, t) {
  if (!(t[I] & 256)) {
    let n = t[K]
    n.destroyNode && oi(e, t, n, 3, null, null), rv(t)
  }
}
function Ts(e, t) {
  if (t[I] & 256) return
  let n = O(null)
  try {
    ;(t[I] &= -129),
      (t[I] |= 256),
      t[At] && Ec(t[At]),
      av(e, t),
      sv(e, t),
      t[A].type === 1 && t[K].destroy()
    let r = t[ei]
    if (r !== null && tt(t[re])) {
      r !== t[re] && Qd(r, t)
      let o = t[yn]
      o !== null && o.detachView(e)
    }
    Gm(t)
  } finally {
    O(n)
  }
}
function sv(e, t) {
  let n = e.cleanup,
    r = t[nr]
  if (n !== null)
    for (let i = 0; i < n.length - 1; i += 2)
      if (typeof n[i] == 'string') {
        let s = n[i + 3]
        s >= 0 ? r[s]() : r[-s].unsubscribe(), (i += 2)
      } else {
        let s = r[n[i + 1]]
        n[i].call(s)
      }
  r !== null && (t[nr] = null)
  let o = t[ut]
  if (o !== null) {
    t[ut] = null
    for (let i = 0; i < o.length; i++) {
      let s = o[i]
      s()
    }
  }
}
function av(e, t) {
  let n
  if (e != null && (n = e.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let o = t[n[r]]
      if (!(o instanceof Rt)) {
        let i = n[r + 1]
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let a = o[i[s]],
              u = i[s + 1]
            Ve(4, a, u)
            try {
              u.call(a)
            } finally {
              Ve(5, a, u)
            }
          }
        else {
          Ve(4, o, i)
          try {
            i.call(o)
          } finally {
            Ve(5, o, i)
          }
        }
      }
    }
}
function uv(e, t, n) {
  return cv(e, t.parent, n)
}
function cv(e, t, n) {
  let r = t
  for (; r !== null && r.type & 40; ) (t = r), (r = t.parent)
  if (r === null) return n[et]
  {
    let { componentOffset: o } = r
    if (o > -1) {
      let { encapsulation: i } = e.data[r.directiveStart + o]
      if (i === Ue.None || i === Ue.Emulated) return null
    }
    return Pe(r, n)
  }
}
function $o(e, t, n, r, o) {
  e.insertBefore(t, n, r, o)
}
function Kd(e, t, n) {
  e.appendChild(t, n)
}
function wl(e, t, n, r, o) {
  r !== null ? $o(e, t, n, r, o) : Kd(e, t, n)
}
function lv(e, t, n, r) {
  e.removeChild(t, n, r)
}
function Za(e, t) {
  return e.parentNode(t)
}
function dv(e, t) {
  return e.nextSibling(t)
}
function fv(e, t, n) {
  return pv(e, t, n)
}
function hv(e, t, n) {
  return e.type & 40 ? Pe(e, n) : null
}
var pv = hv,
  Cl
function Ya(e, t, n, r) {
  let o = uv(e, r, t),
    i = t[K],
    s = r.parent || t[Fe],
    a = fv(s, r, t)
  if (o != null)
    if (Array.isArray(n))
      for (let u = 0; u < n.length; u++) wl(i, o, n[u], a, !1)
    else wl(i, o, n, a, !1)
  Cl !== void 0 && Cl(i, r, t, n, o)
}
function Ao(e, t) {
  if (t !== null) {
    let n = t.type
    if (n & 3) return Pe(t, e)
    if (n & 4) return Xs(-1, e[t.index])
    if (n & 8) {
      let r = t.child
      if (r !== null) return Ao(e, r)
      {
        let o = e[t.index]
        return tt(o) ? Xs(-1, o) : Be(o)
      }
    } else {
      if (n & 32) return Wa(t, e)() || Be(e[t.index])
      {
        let r = Jd(e, t)
        if (r !== null) {
          if (Array.isArray(r)) return r[0]
          let o = ir(e[Re])
          return Ao(o, r)
        } else return Ao(e, t.next)
      }
    }
  }
  return null
}
function Jd(e, t) {
  if (t !== null) {
    let r = e[Re][Fe],
      o = t.projection
    return r.projection[o]
  }
  return null
}
function Xs(e, t) {
  let n = le + e + 1
  if (n < t.length) {
    let r = t[n],
      o = r[A].firstChild
    if (o !== null) return Ao(r, o)
  }
  return t[xt]
}
function gv(e, t, n) {
  let r = Za(e, t)
  r && lv(e, r, t, n)
}
function Qa(e, t, n, r, o, i, s) {
  for (; n != null; ) {
    let a = r[n.index],
      u = n.type
    if (
      (s && t === 0 && (a && Ot(Be(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (u & 8) Qa(e, t, n.child, r, o, i, !1), ln(t, e, o, a, i)
      else if (u & 32) {
        let c = Wa(n, r),
          l
        for (; (l = c()); ) ln(t, e, o, l, i)
        ln(t, e, o, a, i)
      } else u & 16 ? mv(e, t, r, n, o, i) : ln(t, e, o, a, i)
    n = s ? n.projectionNext : n.next
  }
}
function oi(e, t, n, r, o, i) {
  Qa(n, r, e.firstChild, t, o, i, !1)
}
function mv(e, t, n, r, o, i) {
  let s = n[Re],
    u = s[Fe].projection[r.projection]
  if (Array.isArray(u))
    for (let c = 0; c < u.length; c++) {
      let l = u[c]
      ln(t, e, o, l, i)
    }
  else {
    let c = u,
      l = s[re]
    Ud(r) && (c.flags |= 128), Qa(e, t, c, l, o, i, !0)
  }
}
function vv(e, t, n, r, o) {
  let i = n[xt],
    s = Be(n)
  i !== s && ln(t, e, r, i, o)
  for (let a = le; a < n.length; a++) {
    let u = n[a]
    oi(u[A], u, e, t, r, i)
  }
}
function yv(e, t, n, r, o) {
  if (t) o ? e.addClass(n, r) : e.removeClass(n, r)
  else {
    let i = r.indexOf('-') === -1 ? void 0 : Je.DashCase
    o == null
      ? e.removeStyle(n, r, i)
      : (typeof o == 'string' &&
          o.endsWith('!important') &&
          ((o = o.slice(0, -10)), (i |= Je.Important)),
        e.setStyle(n, r, o, i))
  }
}
function Dv(e, t, n) {
  e.setAttribute(t, 'style', n)
}
function Xd(e, t, n) {
  n === '' ? e.removeAttribute(t, 'class') : e.setAttribute(t, 'class', n)
}
function ef(e, t, n) {
  let { mergedAttrs: r, classes: o, styles: i } = n
  r !== null && js(e, t, r),
    o !== null && Xd(e, t, o),
    i !== null && Dv(e, t, i)
}
var Sn = {}
function oe(e = 1) {
  tf(_e(), B(), Lt() + e, !1)
}
function tf(e, t, n, r) {
  if (!r)
    if ((t[I] & 3) === 3) {
      let i = e.preOrderCheckHooks
      i !== null && So(t, i, n)
    } else {
      let i = e.preOrderHooks
      i !== null && To(t, i, 0, n)
    }
  Nt(n)
}
function J(e, t = x.Default) {
  let n = B()
  if (n === null) return S(e, t)
  let r = Se()
  return Fd(r, n, ae(e), t)
}
function nf(e, t, n, r, o, i) {
  let s = O(null)
  try {
    let a = null
    o & Me.SignalBased && (a = t[r][Ze]),
      a !== null && a.transformFn !== void 0 && (i = a.transformFn(i)),
      o & Me.HasDecoratorInputTransform &&
        (i = e.inputTransforms[r].call(t, i)),
      e.setInput !== null ? e.setInput(t, a, i, n, r) : cd(t, a, r, i)
  } finally {
    O(s)
  }
}
function wv(e, t) {
  let n = e.hostBindingOpCodes
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let o = n[r]
        if (o < 0) Nt(~o)
        else {
          let i = o,
            s = n[++r],
            a = n[++r]
          Dm(s, i)
          let u = t[i]
          a(2, u)
        }
      }
    } finally {
      Nt(-1)
    }
}
function ii(e, t, n, r, o, i, s, a, u, c, l) {
  let d = t.blueprint.slice()
  return (
    (d[et] = o),
    (d[I] = r | 4 | 128 | 8 | 64),
    (c !== null || (e && e[I] & 2048)) && (d[I] |= 2048),
    pd(d),
    (d[re] = d[bn] = e),
    (d[ce] = n),
    (d[$e] = s || (e && e[$e])),
    (d[K] = a || (e && e[K])),
    (d[vn] = u || (e && e[vn]) || null),
    (d[Fe] = i),
    (d[ti] = Hm()),
    (d[tr] = l),
    (d[sd] = c),
    (d[Re] = t.type == 2 ? e[Re] : d),
    d
  )
}
function si(e, t, n, r, o) {
  let i = e.data[t]
  if (i === null) (i = Cv(e, t, n, r, o)), ym() && (i.flags |= 32)
  else if (i.type & 64) {
    ;(i.type = n), (i.value = r), (i.attrs = o)
    let s = pm()
    i.injectorIndex = s === null ? -1 : s.injectorIndex
  }
  return gr(i, !0), i
}
function Cv(e, t, n, r, o) {
  let i = vd(),
    s = yd(),
    a = s ? i : i && i.parent,
    u = (e.data[t] = _v(e, a, n, t, r, o))
  return (
    e.firstChild === null && (e.firstChild = u),
    i !== null &&
      (s
        ? i.child == null && u.parent !== null && (i.child = u)
        : i.next === null && ((i.next = u), (u.prev = i))),
    u
  )
}
function rf(e, t, n, r) {
  if (n === 0) return -1
  let o = t.length
  for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null)
  return o
}
function of(e, t, n, r, o) {
  let i = Lt(),
    s = r & 2
  try {
    Nt(-1), s && t.length > Oe && tf(e, t, Oe, !1), Ve(s ? 2 : 0, o), n(r, o)
  } finally {
    Nt(i), Ve(s ? 3 : 1, o)
  }
}
function sf(e, t, n) {
  if (ud(t)) {
    let r = O(null)
    try {
      let o = t.directiveStart,
        i = t.directiveEnd
      for (let s = o; s < i; s++) {
        let a = e.data[s]
        if (a.contentQueries) {
          let u = n[s]
          a.contentQueries(1, u, s)
        }
      }
    } finally {
      O(r)
    }
  }
}
function af(e, t, n) {
  md() && (Rv(e, t, n, Pe(n, t)), (n.flags & 64) === 64 && hf(e, t, n))
}
function uf(e, t, n = Pe) {
  let r = t.localNames
  if (r !== null) {
    let o = t.index + 1
    for (let i = 0; i < r.length; i += 2) {
      let s = r[i + 1],
        a = s === -1 ? n(t, e) : e[s]
      e[o++] = a
    }
  }
}
function cf(e) {
  let t = e.tView
  return t === null || t.incompleteFirstPass
    ? (e.tView = Ka(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id,
      ))
    : t
}
function Ka(e, t, n, r, o, i, s, a, u, c, l) {
  let d = Oe + r,
    f = d + o,
    h = Ev(d, f),
    m = typeof c == 'function' ? c() : c
  return (h[A] = {
    type: e,
    blueprint: h,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: t,
    data: h.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: f,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof i == 'function' ? i() : i,
    pipeRegistry: typeof s == 'function' ? s() : s,
    firstChild: null,
    schemas: u,
    consts: m,
    incompleteFirstPass: !1,
    ssrId: l,
  })
}
function Ev(e, t) {
  let n = []
  for (let r = 0; r < t; r++) n.push(r < e ? null : Sn)
  return n
}
function Iv(e, t, n, r) {
  let i = r.get(Km, qd) || n === Ue.ShadowDom,
    s = e.selectRootElement(t, i)
  return bv(s), s
}
function bv(e) {
  Mv(e)
}
var Mv = () => null
function _v(e, t, n, r, o, i) {
  let s = t ? t.injectorIndex : -1,
    a = 0
  return (
    dm() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: o,
      attrs: i,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: t,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  )
}
function El(e, t, n, r, o) {
  for (let i in t) {
    if (!t.hasOwnProperty(i)) continue
    let s = t[i]
    if (s === void 0) continue
    r ??= {}
    let a,
      u = Me.None
    Array.isArray(s) ? ((a = s[0]), (u = s[1])) : (a = s)
    let c = i
    if (o !== null) {
      if (!o.hasOwnProperty(i)) continue
      c = o[i]
    }
    e === 0 ? Il(r, n, c, a, u) : Il(r, n, c, a)
  }
  return r
}
function Il(e, t, n, r, o) {
  let i
  e.hasOwnProperty(n) ? (i = e[n]).push(t, r) : (i = e[n] = [t, r]),
    o !== void 0 && i.push(o)
}
function Sv(e, t, n) {
  let r = t.directiveStart,
    o = t.directiveEnd,
    i = e.data,
    s = t.attrs,
    a = [],
    u = null,
    c = null
  for (let l = r; l < o; l++) {
    let d = i[l],
      f = n ? n.get(d) : null,
      h = f ? f.inputs : null,
      m = f ? f.outputs : null
    ;(u = El(0, d.inputs, l, u, h)), (c = El(1, d.outputs, l, c, m))
    let M = u !== null && s !== null && !Sa(t) ? $v(u, l, s) : null
    a.push(M)
  }
  u !== null &&
    (u.hasOwnProperty('class') && (t.flags |= 8),
    u.hasOwnProperty('style') && (t.flags |= 16)),
    (t.initialInputs = a),
    (t.inputs = u),
    (t.outputs = c)
}
function Tv(e) {
  return e === 'class'
    ? 'className'
    : e === 'for'
      ? 'htmlFor'
      : e === 'formaction'
        ? 'formAction'
        : e === 'innerHtml'
          ? 'innerHTML'
          : e === 'readonly'
            ? 'readOnly'
            : e === 'tabindex'
              ? 'tabIndex'
              : e
}
function lf(e, t, n, r, o, i, s, a) {
  let u = Pe(t, n),
    c = t.inputs,
    l
  !a && c != null && (l = c[r])
    ? (Ja(e, n, l, r, o), ni(t) && Av(n, t.index))
    : t.type & 3
      ? ((r = Tv(r)),
        (o = s != null ? s(o, t.value || '', r) : o),
        i.setProperty(u, r, o))
      : t.type & 12
}
function Av(e, t) {
  let n = ft(t, e)
  n[I] & 16 || (n[I] |= 64)
}
function df(e, t, n, r) {
  if (md()) {
    let o = r === null ? null : { '': -1 },
      i = Fv(e, n),
      s,
      a
    i === null ? (s = a = null) : ([s, a] = i),
      s !== null && ff(e, t, n, s, o, a),
      o && Pv(n, r, o)
  }
  n.mergedAttrs = Xn(n.mergedAttrs, n.attrs)
}
function ff(e, t, n, r, o, i) {
  for (let c = 0; c < r.length; c++) Ws(Uo(n, t), e, r[c].type)
  Lv(n, e.data.length, r.length)
  for (let c = 0; c < r.length; c++) {
    let l = r[c]
    l.providersResolver && l.providersResolver(l)
  }
  let s = !1,
    a = !1,
    u = rf(e, t, r.length, null)
  for (let c = 0; c < r.length; c++) {
    let l = r[c]
    ;(n.mergedAttrs = Xn(n.mergedAttrs, l.hostAttrs)),
      Vv(e, n, t, u, l),
      kv(u, l, o),
      l.contentQueries !== null && (n.flags |= 4),
      (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) &&
        (n.flags |= 64)
    let d = l.type.prototype
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(n.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
      u++
  }
  Sv(e, n, i)
}
function xv(e, t, n, r, o) {
  let i = o.hostBindings
  if (i) {
    let s = e.hostBindingOpCodes
    s === null && (s = e.hostBindingOpCodes = [])
    let a = ~t.index
    Nv(s) != a && s.push(a), s.push(n, r, i)
  }
}
function Nv(e) {
  let t = e.length
  for (; t > 0; ) {
    let n = e[--t]
    if (typeof n == 'number' && n < 0) return n
  }
  return 0
}
function Rv(e, t, n, r) {
  let o = n.directiveStart,
    i = n.directiveEnd
  ni(n) && jv(t, n, e.data[o + n.componentOffset]),
    e.firstCreatePass || Uo(n, t),
    Ot(r, t)
  let s = n.initialInputs
  for (let a = o; a < i; a++) {
    let u = e.data[a],
      c = Dn(t, e, a, n)
    if ((Ot(c, t), s !== null && Uv(t, a - o, c, u, n, s), ct(u))) {
      let l = ft(n.index, t)
      l[ce] = Dn(t, e, a, n)
    }
  }
}
function hf(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd,
    i = n.index,
    s = wm()
  try {
    Nt(i)
    for (let a = r; a < o; a++) {
      let u = e.data[a],
        c = t[a]
      Gs(a),
        (u.hostBindings !== null || u.hostVars !== 0 || u.hostAttrs !== null) &&
          Ov(u, c)
    }
  } finally {
    Nt(-1), Gs(s)
  }
}
function Ov(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t)
}
function Fv(e, t) {
  let n = e.directiveRegistry,
    r = null,
    o = null
  if (n)
    for (let i = 0; i < n.length; i++) {
      let s = n[i]
      if (Tg(t, s.selectors, !1))
        if ((r || (r = []), ct(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = []
            ;(o = o || new Map()),
              s.findHostDirectiveDefs(s, a, o),
              r.unshift(...a, s)
            let u = a.length
            ea(e, t, u)
          } else r.unshift(s), ea(e, t, 0)
        else (o = o || new Map()), s.findHostDirectiveDefs?.(s, r, o), r.push(s)
    }
  return r === null ? null : [r, o]
}
function ea(e, t, n) {
  ;(t.componentOffset = n), (e.components ??= []).push(t.index)
}
function Pv(e, t, n) {
  if (t) {
    let r = (e.localNames = [])
    for (let o = 0; o < t.length; o += 2) {
      let i = n[t[o + 1]]
      if (i == null) throw new w(-301, !1)
      r.push(t[o], i)
    }
  }
}
function kv(e, t, n) {
  if (n) {
    if (t.exportAs)
      for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e
    ct(t) && (n[''] = e)
  }
}
function Lv(e, t, n) {
  ;(e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + n),
    (e.providerIndexes = t)
}
function Vv(e, t, n, r, o) {
  e.data[r] = o
  let i = o.factory || (o.factory = hn(o.type, !0)),
    s = new Rt(i, ct(o), J)
  ;(e.blueprint[r] = s), (n[r] = s), xv(e, t, r, rf(e, n, o.hostVars, Sn), o)
}
function jv(e, t, n) {
  let r = Pe(t, e),
    o = cf(n),
    i = e[$e].rendererFactory,
    s = 16
  n.signals ? (s = 4096) : n.onPush && (s = 64)
  let a = ai(
    e,
    ii(e, o, null, s, r, t, null, i.createRenderer(r, n), null, null, null),
  )
  e[t.index] = a
}
function Uv(e, t, n, r, o, i) {
  let s = i[t]
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let u = s[a++],
        c = s[a++],
        l = s[a++],
        d = s[a++]
      nf(r, n, u, c, l, d)
    }
}
function $v(e, t, n) {
  let r = null,
    o = 0
  for (; o < n.length; ) {
    let i = n[o]
    if (i === 0) {
      o += 4
      continue
    } else if (i === 5) {
      o += 2
      continue
    }
    if (typeof i == 'number') break
    if (e.hasOwnProperty(i)) {
      r === null && (r = [])
      let s = e[i]
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === t) {
          r.push(i, s[a + 1], s[a + 2], n[o + 1])
          break
        }
    }
    o += 2
  }
  return r
}
function pf(e, t, n, r) {
  return [e, !0, 0, t, null, r, null, n, null, null]
}
function gf(e, t) {
  let n = e.contentQueries
  if (n !== null) {
    let r = O(null)
    try {
      for (let o = 0; o < n.length; o += 2) {
        let i = n[o],
          s = n[o + 1]
        if (s !== -1) {
          let a = e.data[s]
          Dd(i), a.contentQueries(2, t[s], s)
        }
      }
    } finally {
      O(r)
    }
  }
}
function ai(e, t) {
  return e[rr] ? (e[fl][Ne] = t) : (e[rr] = t), (e[fl] = t), t
}
function ta(e, t, n) {
  Dd(0)
  let r = O(null)
  try {
    t(e, n)
  } finally {
    O(r)
  }
}
function Bv(e) {
  return e[nr] || (e[nr] = [])
}
function Hv(e) {
  return e.cleanup || (e.cleanup = [])
}
function mf(e, t) {
  let n = e[vn],
    r = n ? n.get(Ke, null) : null
  r && r.handleError(t)
}
function Ja(e, t, n, r, o) {
  for (let i = 0; i < n.length; ) {
    let s = n[i++],
      a = n[i++],
      u = n[i++],
      c = t[s],
      l = e.data[s]
    nf(l, c, r, a, u, o)
  }
}
function zv(e, t, n) {
  let r = hd(t, e)
  ev(e[K], r, n)
}
function Gv(e, t) {
  let n = ft(t, e),
    r = n[A]
  qv(r, n)
  let o = n[et]
  o !== null && n[tr] === null && (n[tr] = Ga(o, n[vn])), Xa(r, n, n[ce])
}
function qv(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n])
}
function Xa(e, t, n) {
  Pa(t)
  try {
    let r = e.viewQuery
    r !== null && ta(1, r, n)
    let o = e.template
    o !== null && of(e, t, o, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[yn]?.finishViewCreation(e),
      e.staticContentQueries && gf(e, t),
      e.staticViewQueries && ta(2, e.viewQuery, n)
    let i = e.components
    i !== null && Wv(t, i)
  } catch (r) {
    throw (
      (e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      r)
    )
  } finally {
    ;(t[I] &= -5), ka()
  }
}
function Wv(e, t) {
  for (let n = 0; n < t.length; n++) Gv(e, t[n])
}
function eu(e, t, n, r) {
  let o = O(null)
  try {
    let i = t.tView,
      a = e[I] & 4096 ? 4096 : 16,
      u = ii(
        e,
        i,
        n,
        a,
        null,
        t,
        null,
        null,
        r?.injector ?? null,
        r?.embeddedViewInjector ?? null,
        r?.dehydratedView ?? null,
      ),
      c = e[t.index]
    u[ei] = c
    let l = e[yn]
    return l !== null && (u[yn] = l.createEmbeddedView(i)), Xa(i, u, n), u
  } finally {
    O(o)
  }
}
function vf(e, t) {
  let n = le + t
  if (n < e.length) return e[n]
}
function ar(e, t) {
  return !t || t.firstChild === null || Ud(e)
}
function ui(e, t, n, r = !0) {
  let o = t[A]
  if ((ov(o, t, e, n), r)) {
    let s = Xs(n, e),
      a = t[K],
      u = Za(a, e[xt])
    u !== null && nv(o, e[Fe], a, t, u, s)
  }
  let i = t[tr]
  i !== null && i.firstChild !== null && (i.firstChild = null)
}
function yf(e, t) {
  let n = sr(e, t)
  return n !== void 0 && ri(n[A], n), n
}
function Bo(e, t, n, r, o = !1) {
  for (; n !== null; ) {
    let i = t[n.index]
    i !== null && r.push(Be(i)), tt(i) && Zv(i, r)
    let s = n.type
    if (s & 8) Bo(e, t, n.child, r)
    else if (s & 32) {
      let a = Wa(n, t),
        u
      for (; (u = a()); ) r.push(u)
    } else if (s & 16) {
      let a = Jd(t, n)
      if (Array.isArray(a)) r.push(...a)
      else {
        let u = ir(t[Re])
        Bo(u[A], u, a, r, !0)
      }
    }
    n = o ? n.projectionNext : n.next
  }
  return r
}
function Zv(e, t) {
  for (let n = le; n < e.length; n++) {
    let r = e[n],
      o = r[A].firstChild
    o !== null && Bo(r[A], r, o, t)
  }
  e[xt] !== e[et] && t.push(e[xt])
}
var Df = []
function Yv(e) {
  return e[At] ?? Qv(e)
}
function Qv(e) {
  let t = Df.pop() ?? Object.create(Jv)
  return (t.lView = e), t
}
function Kv(e) {
  e.lView[At] !== e && ((e.lView = null), Df.push(e))
}
var Jv = R(g({}, Kr), {
    consumerIsAlwaysLive: !0,
    consumerMarkedDirty: (e) => {
      or(e.lView)
    },
    consumerOnSignalRead() {
      this.lView[At] = this
    },
  }),
  wf = 100
function Cf(e, t = !0, n = 0) {
  let r = e[$e],
    o = r.rendererFactory,
    i = !1
  i || o.begin?.()
  try {
    Xv(e, n)
  } catch (s) {
    throw (t && mf(e, s), s)
  } finally {
    i || (o.end?.(), r.inlineEffectRunner?.flush())
  }
}
function Xv(e, t) {
  na(e, t)
  let n = 0
  for (; Fa(e); ) {
    if (n === wf) throw new w(103, !1)
    n++, na(e, 1)
  }
}
function ey(e, t, n, r) {
  let o = t[I]
  if ((o & 256) === 256) return
  let i = !1
  !i && t[$e].inlineEffectRunner?.flush(), Pa(t)
  let s = null,
    a = null
  !i && ty(e) && ((a = Yv(t)), (s = es(a)))
  try {
    pd(t), mm(e.bindingStartIndex), n !== null && of(e, t, n, 2, r)
    let u = (o & 3) === 3
    if (!i)
      if (u) {
        let d = e.preOrderCheckHooks
        d !== null && So(t, d, null)
      } else {
        let d = e.preOrderHooks
        d !== null && To(t, d, 0, null), bs(t, 0)
      }
    if ((ny(t), Ef(t, 0), e.contentQueries !== null && gf(e, t), !i))
      if (u) {
        let d = e.contentCheckHooks
        d !== null && So(t, d)
      } else {
        let d = e.contentHooks
        d !== null && To(t, d, 1), bs(t, 1)
      }
    wv(e, t)
    let c = e.components
    c !== null && bf(t, c, 0)
    let l = e.viewQuery
    if ((l !== null && ta(2, l, r), !i))
      if (u) {
        let d = e.viewCheckHooks
        d !== null && So(t, d)
      } else {
        let d = e.viewHooks
        d !== null && To(t, d, 2), bs(t, 2)
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[Is])) {
      for (let d of t[Is]) d()
      t[Is] = null
    }
    i || (t[I] &= -73)
  } catch (u) {
    throw (or(t), u)
  } finally {
    a !== null && (ts(a, s), Kv(a)), ka()
  }
}
function ty(e) {
  return e.type !== 2
}
function Ef(e, t) {
  for (let n = Bd(e); n !== null; n = Hd(n))
    for (let r = le; r < n.length; r++) {
      let o = n[r]
      If(o, t)
    }
}
function ny(e) {
  for (let t = Bd(e); t !== null; t = Hd(t)) {
    if (!(t[I] & xa.HasTransplantedViews)) continue
    let n = t[ko]
    for (let r = 0; r < n.length; r++) {
      let o = n[r],
        i = o[re]
      im(o)
    }
  }
}
function ry(e, t, n) {
  let r = ft(t, e)
  If(r, n)
}
function If(e, t) {
  Oa(e) && na(e, t)
}
function na(e, t) {
  let r = e[A],
    o = e[I],
    i = e[At],
    s = !!(t === 0 && o & 16)
  if (
    ((s ||= !!(o & 64 && t === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && ns(i))),
    i && (i.dirty = !1),
    (e[I] &= -9217),
    s)
  )
    ey(r, e, r.template, e[ce])
  else if (o & 8192) {
    Ef(e, 1)
    let a = r.components
    a !== null && bf(e, a, 1)
  }
}
function bf(e, t, n) {
  for (let r = 0; r < t.length; r++) ry(e, t[r], n)
}
function tu(e) {
  for (e[$e].changeDetectionScheduler?.notify(); e; ) {
    e[I] |= 64
    let t = ir(e)
    if (Qg(e) && !t) return e
    e = t
  }
  return null
}
var wn = class {
  get rootNodes() {
    let t = this._lView,
      n = t[A]
    return Bo(n, t, n.firstChild, [])
  }
  constructor(t, n, r = !0) {
    ;(this._lView = t),
      (this._cdRefInjectingView = n),
      (this.notifyErrorHandler = r),
      (this._appRef = null),
      (this._attachedToViewContainer = !1)
  }
  get context() {
    return this._lView[ce]
  }
  set context(t) {
    this._lView[ce] = t
  }
  get destroyed() {
    return (this._lView[I] & 256) === 256
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this)
    else if (this._attachedToViewContainer) {
      let t = this._lView[re]
      if (tt(t)) {
        let n = t[Po],
          r = n ? n.indexOf(this) : -1
        r > -1 && (sr(t, r), Oo(n, r))
      }
      this._attachedToViewContainer = !1
    }
    ri(this._lView[A], this._lView)
  }
  onDestroy(t) {
    gd(this._lView, t)
  }
  markForCheck() {
    tu(this._cdRefInjectingView || this._lView)
  }
  detach() {
    this._lView[I] &= -129
  }
  reattach() {
    zs(this._lView), (this._lView[I] |= 128)
  }
  detectChanges() {
    ;(this._lView[I] |= 1024), Cf(this._lView, this.notifyErrorHandler)
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new w(902, !1)
    this._attachedToViewContainer = !0
  }
  detachFromAppRef() {
    ;(this._appRef = null), Yd(this._lView[A], this._lView)
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new w(902, !1)
    ;(this._appRef = t), zs(this._lView)
  }
}
var KS = new RegExp(`^(\\d+)*(${Ym}|${Zm})*(.*)`)
var oy = () => null
function ur(e, t) {
  return oy(e, t)
}
var ra = class {},
  oa = class {},
  Ho = class {}
function iy(e) {
  let t = Error(`No component factory found for ${he(e)}.`)
  return (t[sy] = e), t
}
var sy = 'ngComponent'
var ia = class {
    resolveComponentFactory(t) {
      throw iy(t)
    }
  },
  ci = (() => {
    let t = class t {}
    t.NULL = new ia()
    let e = t
    return e
  })(),
  cr = class {},
  Tn = (() => {
    let t = class t {
      constructor() {
        this.destroyNode = null
      }
    }
    t.__NG_ELEMENT_ID__ = () => ay()
    let e = t
    return e
  })()
function ay() {
  let e = B(),
    t = Se(),
    n = ft(t.index, e)
  return (_t(n) ? n : e)[K]
}
var uy = (() => {
    let t = class t {}
    t.ɵprov = D({ token: t, providedIn: 'root', factory: () => null })
    let e = t
    return e
  })(),
  As = {}
var bl = new Set()
function jt(e) {
  bl.has(e) ||
    (bl.add(e),
    performance?.mark?.('mark_feature_usage', { detail: { feature: e } }))
}
function Ml(...e) {}
function cy() {
  let e = typeof Qn.requestAnimationFrame == 'function',
    t = Qn[e ? 'requestAnimationFrame' : 'setTimeout'],
    n = Qn[e ? 'cancelAnimationFrame' : 'clearTimeout']
  if (typeof Zone < 'u' && t && n) {
    let r = t[Zone.__symbol__('OriginalDelegate')]
    r && (t = r)
    let o = n[Zone.__symbol__('OriginalDelegate')]
    o && (n = o)
  }
  return { nativeRequestAnimationFrame: t, nativeCancelAnimationFrame: n }
}
var q = class e {
    constructor({
      enableLongStackTrace: t = !1,
      shouldCoalesceEventChangeDetection: n = !1,
      shouldCoalesceRunChangeDetection: r = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new ue(!1)),
        (this.onMicrotaskEmpty = new ue(!1)),
        (this.onStable = new ue(!1)),
        (this.onError = new ue(!1)),
        typeof Zone > 'u')
      )
        throw new w(908, !1)
      Zone.assertZonePatched()
      let o = this
      ;(o._nesting = 0),
        (o._outer = o._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
        t &&
          Zone.longStackTraceZoneSpec &&
          (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
        (o.shouldCoalesceEventChangeDetection = !r && n),
        (o.shouldCoalesceRunChangeDetection = r),
        (o.lastRequestAnimationFrameId = -1),
        (o.nativeRequestAnimationFrame = cy().nativeRequestAnimationFrame),
        fy(o)
    }
    static isInAngularZone() {
      return typeof Zone < 'u' && Zone.current.get('isAngularZone') === !0
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new w(909, !1)
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new w(909, !1)
    }
    run(t, n, r) {
      return this._inner.run(t, n, r)
    }
    runTask(t, n, r, o) {
      let i = this._inner,
        s = i.scheduleEventTask('NgZoneEvent: ' + o, t, ly, Ml, Ml)
      try {
        return i.runTask(s, n, r)
      } finally {
        i.cancelTask(s)
      }
    }
    runGuarded(t, n, r) {
      return this._inner.runGuarded(t, n, r)
    }
    runOutsideAngular(t) {
      return this._outer.run(t)
    }
  },
  ly = {}
function nu(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      e._nesting++, e.onMicrotaskEmpty.emit(null)
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null))
        } finally {
          e.isStable = !0
        }
    }
}
function dy(e) {
  e.isCheckStableRunning ||
    e.lastRequestAnimationFrameId !== -1 ||
    ((e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(
      Qn,
      () => {
        e.fakeTopEventTask ||
          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
            'fakeTopEventTask',
            () => {
              ;(e.lastRequestAnimationFrameId = -1),
                sa(e),
                (e.isCheckStableRunning = !0),
                nu(e),
                (e.isCheckStableRunning = !1)
            },
            void 0,
            () => {},
            () => {},
          )),
          e.fakeTopEventTask.invoke()
      },
    )),
    sa(e))
}
function fy(e) {
  let t = () => {
    dy(e)
  }
  e._inner = e._inner.fork({
    name: 'angular',
    properties: { isAngularZone: !0 },
    onInvokeTask: (n, r, o, i, s, a) => {
      if (hy(a)) return n.invokeTask(o, i, s, a)
      try {
        return _l(e), n.invokeTask(o, i, s, a)
      } finally {
        ;((e.shouldCoalesceEventChangeDetection && i.type === 'eventTask') ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          Sl(e)
      }
    },
    onInvoke: (n, r, o, i, s, a, u) => {
      try {
        return _l(e), n.invoke(o, i, s, a, u)
      } finally {
        e.shouldCoalesceRunChangeDetection && t(), Sl(e)
      }
    },
    onHasTask: (n, r, o, i) => {
      n.hasTask(o, i),
        r === o &&
          (i.change == 'microTask'
            ? ((e._hasPendingMicrotasks = i.microTask), sa(e), nu(e))
            : i.change == 'macroTask' && (e.hasPendingMacrotasks = i.macroTask))
    },
    onHandleError: (n, r, o, i) => (
      n.handleError(o, i), e.runOutsideAngular(() => e.onError.emit(i)), !1
    ),
  })
}
function sa(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.lastRequestAnimationFrameId !== -1)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1)
}
function _l(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null))
}
function Sl(e) {
  e._nesting--, nu(e)
}
function hy(e) {
  return !Array.isArray(e) || e.length !== 1
    ? !1
    : e[0].data?.__ignore_ng_zone__ === !0
}
var Mf = (() => {
  let t = class t {
    constructor() {
      ;(this.handler = null), (this.internalCallbacks = [])
    }
    execute() {
      this.executeInternalCallbacks(), this.handler?.execute()
    }
    executeInternalCallbacks() {
      let r = [...this.internalCallbacks]
      this.internalCallbacks.length = 0
      for (let o of r) o()
    }
    ngOnDestroy() {
      this.handler?.destroy(),
        (this.handler = null),
        (this.internalCallbacks.length = 0)
    }
  }
  t.ɵprov = D({ token: t, providedIn: 'root', factory: () => new t() })
  let e = t
  return e
})()
function aa(e, t, n) {
  let r = n ? e.styles : null,
    o = n ? e.classes : null,
    i = 0
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s]
      if (typeof a == 'number') i = a
      else if (i == 1) o = nl(o, a)
      else if (i == 2) {
        let u = a,
          c = t[++s]
        r = nl(r, u + ': ' + c + ';')
      }
    }
  n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = o) : (e.classesWithoutHost = o)
}
var zo = class extends ci {
  constructor(t) {
    super(), (this.ngModule = t)
  }
  resolveComponentFactory(t) {
    let n = Tt(t)
    return new lr(n, this.ngModule)
  }
}
function Tl(e) {
  let t = []
  for (let n in e) {
    if (!e.hasOwnProperty(n)) continue
    let r = e[n]
    r !== void 0 &&
      t.push({ propName: Array.isArray(r) ? r[0] : r, templateName: n })
  }
  return t
}
function py(e) {
  let t = e.toLowerCase()
  return t === 'svg' ? em : t === 'math' ? tm : null
}
var ua = class {
    constructor(t, n) {
      ;(this.injector = t), (this.parentInjector = n)
    }
    get(t, n, r) {
      r = Jo(r)
      let o = this.injector.get(t, As, r)
      return o !== As || n === As ? o : this.parentInjector.get(t, n, r)
    }
  },
  lr = class extends Ho {
    get inputs() {
      let t = this.componentDef,
        n = t.inputTransforms,
        r = Tl(t.inputs)
      if (n !== null)
        for (let o of r)
          n.hasOwnProperty(o.propName) && (o.transform = n[o.propName])
      return r
    }
    get outputs() {
      return Tl(this.componentDef.outputs)
    }
    constructor(t, n) {
      super(),
        (this.componentDef = t),
        (this.ngModule = n),
        (this.componentType = t.type),
        (this.selector = Rg(t.selectors)),
        (this.ngContentSelectors = t.ngContentSelectors
          ? t.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n)
    }
    create(t, n, r, o) {
      let i = O(null)
      try {
        o = o || this.ngModule
        let s = o instanceof pe ? o : o?.injector
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s)
        let a = s ? new ua(t, s) : t,
          u = a.get(cr, null)
        if (u === null) throw new w(407, !1)
        let c = a.get(uy, null),
          l = a.get(Mf, null),
          d = a.get(ra, null),
          f = {
            rendererFactory: u,
            sanitizer: c,
            inlineEffectRunner: null,
            afterRenderEventManager: l,
            changeDetectionScheduler: d,
          },
          h = u.createRenderer(null, this.componentDef),
          m = this.componentDef.selectors[0][0] || 'div',
          M = r
            ? Iv(h, r, this.componentDef.encapsulation, a)
            : Zd(h, m, py(m)),
          y = 512
        this.componentDef.signals
          ? (y |= 4096)
          : this.componentDef.onPush || (y |= 16)
        let v = null
        M !== null && (v = Ga(M, a, !0))
        let ne = Ka(0, null, null, 1, 0, null, null, null, null, null, null),
          X = ii(null, ne, null, y, null, null, f, h, a, null, v)
        Pa(X)
        let $, ke
        try {
          let me = this.componentDef,
            rt,
            Qi = null
          me.findHostDirectiveDefs
            ? ((rt = []),
              (Qi = new Map()),
              me.findHostDirectiveDefs(me, rt, Qi),
              rt.push(me))
            : (rt = [me])
          let mp = gy(X, M),
            vp = my(mp, M, me, rt, X, f, h)
          ;(ke = Ra(ne, Oe)),
            M && Dy(h, me, M, r),
            n !== void 0 && wy(ke, this.ngContentSelectors, n),
            ($ = yy(vp, me, rt, Qi, X, [Cy])),
            Xa(ne, X, null)
        } finally {
          ka()
        }
        return new ca(this.componentType, $, $a(ke, X), X, ke)
      } finally {
        O(i)
      }
    }
  },
  ca = class extends oa {
    constructor(t, n, r, o, i) {
      super(),
        (this.location = r),
        (this._rootLView = o),
        (this._tNode = i),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new wn(o, void 0, !1)),
        (this.componentType = t)
    }
    setInput(t, n) {
      let r = this._tNode.inputs,
        o
      if (r !== null && (o = r[t])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(t) &&
            Object.is(this.previousInputValues.get(t), n))
        )
          return
        let i = this._rootLView
        Ja(i[A], i, o, t, n), this.previousInputValues.set(t, n)
        let s = ft(this._tNode.index, i)
        tu(s)
      }
    }
    get injector() {
      return new St(this._tNode, this._rootLView)
    }
    destroy() {
      this.hostView.destroy()
    }
    onDestroy(t) {
      this.hostView.onDestroy(t)
    }
  }
function gy(e, t) {
  let n = e[A],
    r = Oe
  return (e[r] = t), si(n, r, 2, '#host', null)
}
function my(e, t, n, r, o, i, s) {
  let a = o[A]
  vy(r, e, t, s)
  let u = null
  t !== null && (u = Ga(t, o[vn]))
  let c = i.rendererFactory.createRenderer(t, n),
    l = 16
  n.signals ? (l = 4096) : n.onPush && (l = 64)
  let d = ii(o, cf(n), null, l, o[e.index], e, i, c, null, null, u)
  return a.firstCreatePass && ea(a, e, r.length - 1), ai(o, d), (o[e.index] = d)
}
function vy(e, t, n, r) {
  for (let o of e) t.mergedAttrs = Xn(t.mergedAttrs, o.hostAttrs)
  t.mergedAttrs !== null &&
    (aa(t, t.mergedAttrs, !0), n !== null && ef(r, n, t))
}
function yy(e, t, n, r, o, i) {
  let s = Se(),
    a = o[A],
    u = Pe(s, o)
  ff(a, o, s, n, null, r)
  for (let l = 0; l < n.length; l++) {
    let d = s.directiveStart + l,
      f = Dn(o, a, d, s)
    Ot(f, o)
  }
  hf(a, o, s), u && Ot(u, o)
  let c = Dn(o, a, s.directiveStart + s.componentOffset, s)
  if (((e[ce] = o[ce] = c), i !== null)) for (let l of i) l(c, t)
  return sf(a, s, o), c
}
function Dy(e, t, n, r) {
  if (r) js(e, n, ['ng-version', '17.3.5'])
  else {
    let { attrs: o, classes: i } = Og(t.selectors[0])
    o && js(e, n, o), i && i.length > 0 && Xd(e, n, i.join(' '))
  }
}
function wy(e, t, n) {
  let r = (e.projection = [])
  for (let o = 0; o < t.length; o++) {
    let i = n[o]
    r.push(i != null ? Array.from(i) : null)
  }
}
function Cy() {
  let e = Se()
  ja(B()[A], e)
}
var li = (() => {
  let t = class t {}
  t.__NG_ELEMENT_ID__ = Ey
  let e = t
  return e
})()
function Ey() {
  let e = Se()
  return by(e, B())
}
var Iy = li,
  _f = class extends Iy {
    constructor(t, n, r) {
      super(),
        (this._lContainer = t),
        (this._hostTNode = n),
        (this._hostLView = r)
    }
    get element() {
      return $a(this._hostTNode, this._hostLView)
    }
    get injector() {
      return new St(this._hostTNode, this._hostLView)
    }
    get parentInjector() {
      let t = Ua(this._hostTNode, this._hostLView)
      if (Td(t)) {
        let n = jo(t, this._hostLView),
          r = Vo(t),
          o = n[A].data[r + 8]
        return new St(o, n)
      } else return new St(null, this._hostLView)
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1)
    }
    get(t) {
      let n = Al(this._lContainer)
      return (n !== null && n[t]) || null
    }
    get length() {
      return this._lContainer.length - le
    }
    createEmbeddedView(t, n, r) {
      let o, i
      typeof r == 'number'
        ? (o = r)
        : r != null && ((o = r.index), (i = r.injector))
      let s = ur(this._lContainer, t.ssrId),
        a = t.createEmbeddedViewImpl(n || {}, i, s)
      return this.insertImpl(a, o, ar(this._hostTNode, s)), a
    }
    createComponent(t, n, r, o, i) {
      let s = t && !Yg(t),
        a
      if (s) a = n
      else {
        let m = n || {}
        ;(a = m.index),
          (r = m.injector),
          (o = m.projectableNodes),
          (i = m.environmentInjector || m.ngModuleRef)
      }
      let u = s ? t : new lr(Tt(t)),
        c = r || this.parentInjector
      if (!i && u.ngModule == null) {
        let M = (s ? c : this.parentInjector).get(pe, null)
        M && (i = M)
      }
      let l = Tt(u.componentType ?? {}),
        d = ur(this._lContainer, l?.id ?? null),
        f = d?.firstChild ?? null,
        h = u.create(c, o, f, i)
      return this.insertImpl(h.hostView, a, ar(this._hostTNode, d)), h
    }
    insert(t, n) {
      return this.insertImpl(t, n, !0)
    }
    insertImpl(t, n, r) {
      let o = t._lView
      if (om(o)) {
        let a = this.indexOf(t)
        if (a !== -1) this.detach(a)
        else {
          let u = o[re],
            c = new _f(u, u[Fe], u[re])
          c.detach(c.indexOf(t))
        }
      }
      let i = this._adjustIndex(n),
        s = this._lContainer
      return ui(s, o, i, r), t.attachToViewContainerRef(), Gl(xs(s), i, t), t
    }
    move(t, n) {
      return this.insert(t, n)
    }
    indexOf(t) {
      let n = Al(this._lContainer)
      return n !== null ? n.indexOf(t) : -1
    }
    remove(t) {
      let n = this._adjustIndex(t, -1),
        r = sr(this._lContainer, n)
      r && (Oo(xs(this._lContainer), n), ri(r[A], r))
    }
    detach(t) {
      let n = this._adjustIndex(t, -1),
        r = sr(this._lContainer, n)
      return r && Oo(xs(this._lContainer), n) != null ? new wn(r) : null
    }
    _adjustIndex(t, n = 0) {
      return t ?? this.length + n
    }
  }
function Al(e) {
  return e[Po]
}
function xs(e) {
  return e[Po] || (e[Po] = [])
}
function by(e, t) {
  let n,
    r = t[e.index]
  return (
    tt(r) ? (n = r) : ((n = pf(r, t, null, e)), (t[e.index] = n), ai(t, n)),
    _y(n, t, e, r),
    new _f(n, e, t)
  )
}
function My(e, t) {
  let n = e[K],
    r = n.createComment(''),
    o = Pe(t, e),
    i = Za(n, o)
  return $o(n, i, r, dv(n, o), !1), r
}
var _y = Ay,
  Sy = () => !1
function Ty(e, t, n) {
  return Sy(e, t, n)
}
function Ay(e, t, n, r) {
  if (e[xt]) return
  let o
  n.type & 8 ? (o = Be(r)) : (o = My(t, n)), (e[xt] = o)
}
function xy(e) {
  return typeof e == 'function' && e[Ze] !== void 0
}
function di(e, t) {
  jt('NgSignals')
  let n = Ac(e),
    r = n[Ze]
  return (
    t?.equal && (r.equal = t.equal),
    (n.set = (o) => rs(r, o)),
    (n.update = (o) => xc(r, o)),
    (n.asReadonly = Ny.bind(n)),
    n
  )
}
function Ny() {
  let e = this[Ze]
  if (e.readonlyFn === void 0) {
    let t = () => this()
    ;(t[Ze] = e), (e.readonlyFn = t)
  }
  return e.readonlyFn
}
function Sf(e) {
  return xy(e) && typeof e.set == 'function'
}
function Ry(e) {
  return Object.getPrototypeOf(e.prototype).constructor
}
function Ut(e) {
  let t = Ry(e.type),
    n = !0,
    r = [e]
  for (; t; ) {
    let o
    if (ct(e)) o = t.ɵcmp || t.ɵdir
    else {
      if (t.ɵcmp) throw new w(903, !1)
      o = t.ɵdir
    }
    if (o) {
      if (n) {
        r.push(o)
        let s = e
        ;(s.inputs = bo(e.inputs)),
          (s.inputTransforms = bo(e.inputTransforms)),
          (s.declaredInputs = bo(e.declaredInputs)),
          (s.outputs = bo(e.outputs))
        let a = o.hostBindings
        a && Ly(e, a)
        let u = o.viewQuery,
          c = o.contentQueries
        if (
          (u && Py(e, u),
          c && ky(e, c),
          Oy(e, o),
          Jp(e.outputs, o.outputs),
          ct(o) && o.data.animation)
        ) {
          let l = e.data
          l.animation = (l.animation || []).concat(o.data.animation)
        }
      }
      let i = o.features
      if (i)
        for (let s = 0; s < i.length; s++) {
          let a = i[s]
          a && a.ngInherit && a(e), a === Ut && (n = !1)
        }
    }
    t = Object.getPrototypeOf(t)
  }
  Fy(r)
}
function Oy(e, t) {
  for (let n in t.inputs) {
    if (!t.inputs.hasOwnProperty(n) || e.inputs.hasOwnProperty(n)) continue
    let r = t.inputs[n]
    if (
      r !== void 0 &&
      ((e.inputs[n] = r),
      (e.declaredInputs[n] = t.declaredInputs[n]),
      t.inputTransforms !== null)
    ) {
      let o = Array.isArray(r) ? r[0] : r
      if (!t.inputTransforms.hasOwnProperty(o)) continue
      ;(e.inputTransforms ??= {}), (e.inputTransforms[o] = t.inputTransforms[o])
    }
  }
}
function Fy(e) {
  let t = 0,
    n = null
  for (let r = e.length - 1; r >= 0; r--) {
    let o = e[r]
    ;(o.hostVars = t += o.hostVars),
      (o.hostAttrs = Xn(o.hostAttrs, (n = Xn(n, o.hostAttrs))))
  }
}
function bo(e) {
  return e === pn ? {} : e === be ? [] : e
}
function Py(e, t) {
  let n = e.viewQuery
  n
    ? (e.viewQuery = (r, o) => {
        t(r, o), n(r, o)
      })
    : (e.viewQuery = t)
}
function ky(e, t) {
  let n = e.contentQueries
  n
    ? (e.contentQueries = (r, o, i) => {
        t(r, o, i), n(r, o, i)
      })
    : (e.contentQueries = t)
}
function Ly(e, t) {
  let n = e.hostBindings
  n
    ? (e.hostBindings = (r, o) => {
        t(r, o), n(r, o)
      })
    : (e.hostBindings = t)
}
var lt = class {},
  dr = class {}
var la = class extends lt {
    constructor(t, n, r) {
      super(),
        (this._parent = n),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new zo(this))
      let o = Xl(t)
      ;(this._bootstrapComponents = Wd(o.bootstrap)),
        (this._r3Injector = Ld(
          t,
          n,
          [
            { provide: lt, useValue: this },
            { provide: ci, useValue: this.componentFactoryResolver },
            ...r,
          ],
          he(t),
          new Set(['environment']),
        )),
        this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(t))
    }
    get injector() {
      return this._r3Injector
    }
    destroy() {
      let t = this._r3Injector
      !t.destroyed && t.destroy(),
        this.destroyCbs.forEach((n) => n()),
        (this.destroyCbs = null)
    }
    onDestroy(t) {
      this.destroyCbs.push(t)
    }
  },
  da = class extends dr {
    constructor(t) {
      super(), (this.moduleType = t)
    }
    create(t) {
      return new la(this.moduleType, t, [])
    }
  }
var Go = class extends lt {
  constructor(t) {
    super(),
      (this.componentFactoryResolver = new zo(this)),
      (this.instance = null)
    let n = new er(
      [
        ...t.providers,
        { provide: lt, useValue: this },
        { provide: ci, useValue: this.componentFactoryResolver },
      ],
      t.parent || Aa(),
      t.debugName,
      new Set(['environment']),
    )
    ;(this.injector = n),
      t.runEnvironmentInitializers && n.resolveInjectorInitializers()
  }
  destroy() {
    this.injector.destroy()
  }
  onDestroy(t) {
    this.injector.onDestroy(t)
  }
}
function ru(e, t, n = null) {
  return new Go({
    providers: e,
    parent: t,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector
}
var An = (() => {
  let t = class t {
    constructor() {
      ;(this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new ee(!1))
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0)
      let r = this.taskId++
      return this.pendingTasks.add(r), r
    }
    remove(r) {
      this.pendingTasks.delete(r),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1)
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1)
    }
  }
  ;(t.ɵfac = function (o) {
    return new (o || t)()
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
  let e = t
  return e
})()
function xn(e, t, n) {
  let r = e[t]
  return Object.is(r, n) ? !1 : ((e[t] = n), !0)
}
function Vy(e) {
  return (e.flags & 32) === 32
}
function jy(e, t, n, r, o, i, s, a, u) {
  let c = t.consts,
    l = si(t, e, 4, s || null, Lo(c, a))
  df(t, n, l, Lo(c, u)), ja(t, l)
  let d = (l.tView = Ka(
    2,
    l,
    r,
    o,
    i,
    t.directiveRegistry,
    t.pipeRegistry,
    null,
    t.schemas,
    c,
    null,
  ))
  return (
    t.queries !== null &&
      (t.queries.template(t, l), (d.queries = t.queries.embeddedTView(l))),
    l
  )
}
function fr(e, t, n, r, o, i, s, a) {
  let u = B(),
    c = _e(),
    l = e + Oe,
    d = c.firstCreatePass ? jy(l, c, u, t, n, r, o, i, s) : c.data[l]
  gr(d, !1)
  let f = Uy(c, u, d, e)
  La() && Ya(c, u, f, d), Ot(f, u)
  let h = pf(f, u, f, d)
  return (
    (u[l] = h),
    ai(u, h),
    Ty(h, d, u),
    Na(d) && af(c, u, d),
    s != null && uf(u, d, a),
    fr
  )
}
var Uy = $y
function $y(e, t, n, r) {
  return Va(!0), t[K].createComment('')
}
function By(e, t, n, r) {
  return xn(e, mr(), n) ? t + Bl(n) + r : Sn
}
function Mo(e, t) {
  return (e << 17) | (t << 2)
}
function Ft(e) {
  return (e >> 17) & 32767
}
function Hy(e) {
  return (e & 2) == 2
}
function zy(e, t) {
  return (e & 131071) | (t << 17)
}
function fa(e) {
  return e | 2
}
function Cn(e) {
  return (e & 131068) >> 2
}
function Ns(e, t) {
  return (e & -131069) | (t << 2)
}
function Gy(e) {
  return (e & 1) === 1
}
function ha(e) {
  return e | 1
}
function qy(e, t, n, r, o, i) {
  let s = i ? t.classBindings : t.styleBindings,
    a = Ft(s),
    u = Cn(s)
  e[r] = n
  let c = !1,
    l
  if (Array.isArray(n)) {
    let d = n
    ;(l = d[1]), (l === null || pr(d, l) > 0) && (c = !0)
  } else l = n
  if (o)
    if (u !== 0) {
      let f = Ft(e[a + 1])
      ;(e[r + 1] = Mo(f, a)),
        f !== 0 && (e[f + 1] = Ns(e[f + 1], r)),
        (e[a + 1] = zy(e[a + 1], r))
    } else
      (e[r + 1] = Mo(a, 0)), a !== 0 && (e[a + 1] = Ns(e[a + 1], r)), (a = r)
  else
    (e[r + 1] = Mo(u, 0)),
      a === 0 ? (a = r) : (e[u + 1] = Ns(e[u + 1], r)),
      (u = r)
  c && (e[r + 1] = fa(e[r + 1])),
    xl(e, l, r, !0),
    xl(e, l, r, !1),
    Wy(t, l, e, r, i),
    (s = Mo(a, u)),
    i ? (t.classBindings = s) : (t.styleBindings = s)
}
function Wy(e, t, n, r, o) {
  let i = o ? e.residualClasses : e.residualStyles
  i != null &&
    typeof t == 'string' &&
    pr(i, t) >= 0 &&
    (n[r + 1] = ha(n[r + 1]))
}
function xl(e, t, n, r) {
  let o = e[n + 1],
    i = t === null,
    s = r ? Ft(o) : Cn(o),
    a = !1
  for (; s !== 0 && (a === !1 || i); ) {
    let u = e[s],
      c = e[s + 1]
    Zy(u, t) && ((a = !0), (e[s + 1] = r ? ha(c) : fa(c))),
      (s = r ? Ft(c) : Cn(c))
  }
  a && (e[n + 1] = r ? fa(o) : ha(o))
}
function Zy(e, t) {
  return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t
    ? !0
    : Array.isArray(e) && typeof t == 'string'
      ? pr(e, t) >= 0
      : !1
}
function $t(e, t, n) {
  let r = B(),
    o = mr()
  if (xn(r, o, t)) {
    let i = _e(),
      s = Md()
    lf(i, s, r, e, t, r[K], n, !1)
  }
  return $t
}
function Nl(e, t, n, r, o) {
  let i = t.inputs,
    s = o ? 'class' : 'style'
  Ja(e, n, i[s], s, r)
}
function ou(e, t) {
  return Yy(e, t, null, !0), ou
}
function Yy(e, t, n, r) {
  let o = B(),
    i = _e(),
    s = vm(2)
  if ((i.firstUpdatePass && Ky(i, e, s, r), t !== Sn && xn(o, s, t))) {
    let a = i.data[Lt()]
    nD(i, a, o, o[K], e, (o[s + 1] = rD(t, n)), r, s)
  }
}
function Qy(e, t) {
  return t >= e.expandoStartIndex
}
function Ky(e, t, n, r) {
  let o = e.data
  if (o[n + 1] === null) {
    let i = o[Lt()],
      s = Qy(e, n)
    oD(i, r) && t === null && !s && (t = !1),
      (t = Jy(o, i, t, r)),
      qy(o, i, t, n, s, r)
  }
}
function Jy(e, t, n, r) {
  let o = Cm(e),
    i = r ? t.residualClasses : t.residualStyles
  if (o === null)
    (r ? t.classBindings : t.styleBindings) === 0 &&
      ((n = Rs(null, e, t, n, r)), (n = hr(n, t.attrs, r)), (i = null))
  else {
    let s = t.directiveStylingLast
    if (s === -1 || e[s] !== o)
      if (((n = Rs(o, e, t, n, r)), i === null)) {
        let u = Xy(e, t, r)
        u !== void 0 &&
          Array.isArray(u) &&
          ((u = Rs(null, e, t, u[1], r)),
          (u = hr(u, t.attrs, r)),
          eD(e, t, r, u))
      } else i = tD(e, t, r)
  }
  return (
    i !== void 0 && (r ? (t.residualClasses = i) : (t.residualStyles = i)), n
  )
}
function Xy(e, t, n) {
  let r = n ? t.classBindings : t.styleBindings
  if (Cn(r) !== 0) return e[Ft(r)]
}
function eD(e, t, n, r) {
  let o = n ? t.classBindings : t.styleBindings
  e[Ft(o)] = r
}
function tD(e, t, n) {
  let r,
    o = t.directiveEnd
  for (let i = 1 + t.directiveStylingLast; i < o; i++) {
    let s = e[i].hostAttrs
    r = hr(r, s, n)
  }
  return hr(r, t.attrs, n)
}
function Rs(e, t, n, r, o) {
  let i = null,
    s = n.directiveEnd,
    a = n.directiveStylingLast
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < s && ((i = t[a]), (r = hr(r, i.hostAttrs, o)), i !== e);

  )
    a++
  return e !== null && (n.directiveStylingLast = a), r
}
function hr(e, t, n) {
  let r = n ? 1 : 2,
    o = -1
  if (t !== null)
    for (let i = 0; i < t.length; i++) {
      let s = t[i]
      typeof s == 'number'
        ? (o = s)
        : o === r &&
          (Array.isArray(e) || (e = e === void 0 ? [] : ['', e]),
          Dg(e, s, n ? !0 : t[++i]))
    }
  return e === void 0 ? null : e
}
function nD(e, t, n, r, o, i, s, a) {
  if (!(t.type & 3)) return
  let u = e.data,
    c = u[a + 1],
    l = Gy(c) ? Rl(u, t, n, o, Cn(c), s) : void 0
  if (!qo(l)) {
    qo(i) || (Hy(c) && (i = Rl(u, null, n, o, a, s)))
    let d = hd(Lt(), n)
    yv(r, s, d, o, i)
  }
}
function Rl(e, t, n, r, o, i) {
  let s = t === null,
    a
  for (; o > 0; ) {
    let u = e[o],
      c = Array.isArray(u),
      l = c ? u[1] : u,
      d = l === null,
      f = n[o + 1]
    f === Sn && (f = d ? be : void 0)
    let h = d ? Cs(f, r) : l === r ? f : void 0
    if ((c && !qo(h) && (h = Cs(u, r)), qo(h) && ((a = h), s))) return a
    let m = e[o + 1]
    o = s ? Ft(m) : Cn(m)
  }
  if (t !== null) {
    let u = i ? t.residualClasses : t.residualStyles
    u != null && (a = Cs(u, r))
  }
  return a
}
function qo(e) {
  return e !== void 0
}
function rD(e, t) {
  return (
    e == null ||
      e === '' ||
      (typeof t == 'string'
        ? (e = e + t)
        : typeof e == 'object' && (e = he(qa(e)))),
    e
  )
}
function oD(e, t) {
  return (e.flags & (t ? 8 : 16)) !== 0
}
var pa = class {
  destroy(t) {}
  updateValue(t, n) {}
  swap(t, n) {
    let r = Math.min(t, n),
      o = Math.max(t, n),
      i = this.detach(o)
    if (o - r > 1) {
      let s = this.detach(r)
      this.attach(r, i), this.attach(o, s)
    } else this.attach(r, i)
  }
  move(t, n) {
    this.attach(n, this.detach(t))
  }
}
function Os(e, t, n, r, o) {
  return e === n && Object.is(t, r) ? 1 : Object.is(o(e, t), o(n, r)) ? -1 : 0
}
function iD(e, t, n) {
  let r,
    o,
    i = 0,
    s = e.length - 1
  if (Array.isArray(t)) {
    let a = t.length - 1
    for (; i <= s && i <= a; ) {
      let u = e.at(i),
        c = t[i],
        l = Os(i, u, i, c, n)
      if (l !== 0) {
        l < 0 && e.updateValue(i, c), i++
        continue
      }
      let d = e.at(s),
        f = t[a],
        h = Os(s, d, a, f, n)
      if (h !== 0) {
        h < 0 && e.updateValue(s, f), s--, a--
        continue
      }
      let m = n(i, u),
        M = n(s, d),
        y = n(i, c)
      if (Object.is(y, M)) {
        let v = n(a, f)
        Object.is(v, m)
          ? (e.swap(i, s), e.updateValue(s, f), a--, s--)
          : e.move(s, i),
          e.updateValue(i, c),
          i++
        continue
      }
      if (((r ??= new Wo()), (o ??= Fl(e, i, s, n)), ga(e, r, i, y)))
        e.updateValue(i, c), i++, s++
      else if (o.has(y)) r.set(m, e.detach(i)), s--
      else {
        let v = e.create(i, t[i])
        e.attach(i, v), i++, s++
      }
    }
    for (; i <= a; ) Ol(e, r, n, i, t[i]), i++
  } else if (t != null) {
    let a = t[Symbol.iterator](),
      u = a.next()
    for (; !u.done && i <= s; ) {
      let c = e.at(i),
        l = u.value,
        d = Os(i, c, i, l, n)
      if (d !== 0) d < 0 && e.updateValue(i, l), i++, (u = a.next())
      else {
        ;(r ??= new Wo()), (o ??= Fl(e, i, s, n))
        let f = n(i, l)
        if (ga(e, r, i, f)) e.updateValue(i, l), i++, s++, (u = a.next())
        else if (!o.has(f))
          e.attach(i, e.create(i, l)), i++, s++, (u = a.next())
        else {
          let h = n(i, c)
          r.set(h, e.detach(i)), s--
        }
      }
    }
    for (; !u.done; ) Ol(e, r, n, e.length, u.value), (u = a.next())
  }
  for (; i <= s; ) e.destroy(e.detach(s--))
  r?.forEach((a) => {
    e.destroy(a)
  })
}
function ga(e, t, n, r) {
  return t !== void 0 && t.has(r)
    ? (e.attach(n, t.get(r)), t.delete(r), !0)
    : !1
}
function Ol(e, t, n, r, o) {
  if (ga(e, t, r, n(r, o))) e.updateValue(r, o)
  else {
    let i = e.create(r, o)
    e.attach(r, i)
  }
}
function Fl(e, t, n, r) {
  let o = new Set()
  for (let i = t; i <= n; i++) o.add(r(i, e.at(i)))
  return o
}
var Wo = class {
  constructor() {
    ;(this.kvMap = new Map()), (this._vMap = void 0)
  }
  has(t) {
    return this.kvMap.has(t)
  }
  delete(t) {
    if (!this.has(t)) return !1
    let n = this.kvMap.get(t)
    return (
      this._vMap !== void 0 && this._vMap.has(n)
        ? (this.kvMap.set(t, this._vMap.get(n)), this._vMap.delete(n))
        : this.kvMap.delete(t),
      !0
    )
  }
  get(t) {
    return this.kvMap.get(t)
  }
  set(t, n) {
    if (this.kvMap.has(t)) {
      let r = this.kvMap.get(t)
      this._vMap === void 0 && (this._vMap = new Map())
      let o = this._vMap
      for (; o.has(r); ) r = o.get(r)
      o.set(r, n)
    } else this.kvMap.set(t, n)
  }
  forEach(t) {
    for (let [n, r] of this.kvMap)
      if ((t(r, n), this._vMap !== void 0)) {
        let o = this._vMap
        for (; o.has(r); ) (r = o.get(r)), t(r, n)
      }
  }
}
function Tf(e, t, n) {
  jt('NgControlFlow')
  let r = B(),
    o = mr(),
    i = Da(r, Oe + e),
    s = 0
  if (xn(r, o, t)) {
    let a = O(null)
    try {
      if ((yf(i, s), t !== -1)) {
        let u = wa(r[A], Oe + t),
          c = ur(i, u.tView.ssrId),
          l = eu(r, u, n, { dehydratedView: c })
        ui(i, l, s, ar(u, c))
      }
    } finally {
      O(a)
    }
  } else {
    let a = vf(i, s)
    a !== void 0 && (a[ce] = n)
  }
}
var ma = class {
  constructor(t, n, r) {
    ;(this.lContainer = t), (this.$implicit = n), (this.$index = r)
  }
  get $count() {
    return this.lContainer.length - le
  }
}
var va = class {
  constructor(t, n, r) {
    ;(this.hasEmptyBlock = t), (this.trackByFn = n), (this.liveCollection = r)
  }
}
function Af(e, t, n, r, o, i, s, a, u, c, l, d, f) {
  jt('NgControlFlow')
  let h = u !== void 0,
    m = B(),
    M = a ? s.bind(m[Re][ce]) : s,
    y = new va(h, M)
  ;(m[Oe + e] = y), fr(e + 1, t, n, r, o, i), h && fr(e + 2, u, c, l, d, f)
}
var ya = class extends pa {
  constructor(t, n, r) {
    super(),
      (this.lContainer = t),
      (this.hostLView = n),
      (this.templateTNode = r),
      (this.needsIndexUpdate = !1)
  }
  get length() {
    return this.lContainer.length - le
  }
  at(t) {
    return this.getLView(t)[ce].$implicit
  }
  attach(t, n) {
    let r = n[tr]
    ;(this.needsIndexUpdate ||= t !== this.length),
      ui(this.lContainer, n, t, ar(this.templateTNode, r))
  }
  detach(t) {
    return (
      (this.needsIndexUpdate ||= t !== this.length - 1), sD(this.lContainer, t)
    )
  }
  create(t, n) {
    let r = ur(this.lContainer, this.templateTNode.tView.ssrId)
    return eu(
      this.hostLView,
      this.templateTNode,
      new ma(this.lContainer, n, t),
      { dehydratedView: r },
    )
  }
  destroy(t) {
    ri(t[A], t)
  }
  updateValue(t, n) {
    this.getLView(t)[ce].$implicit = n
  }
  reset() {
    this.needsIndexUpdate = !1
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let t = 0; t < this.length; t++) this.getLView(t)[ce].$index = t
  }
  getLView(t) {
    return aD(this.lContainer, t)
  }
}
function xf(e) {
  let t = O(null),
    n = Lt()
  try {
    let r = B(),
      o = r[A],
      i = r[n]
    if (i.liveCollection === void 0) {
      let a = n + 1,
        u = Da(r, a),
        c = wa(o, a)
      i.liveCollection = new ya(u, r, c)
    } else i.liveCollection.reset()
    let s = i.liveCollection
    if ((iD(s, e, i.trackByFn), s.updateIndexes(), i.hasEmptyBlock)) {
      let a = mr(),
        u = s.length === 0
      if (xn(r, a, u)) {
        let c = n + 2,
          l = Da(r, c)
        if (u) {
          let d = wa(o, c),
            f = ur(l, d.tView.ssrId),
            h = eu(r, d, void 0, { dehydratedView: f })
          ui(l, h, 0, ar(d, f))
        } else yf(l, 0)
      }
    }
  } finally {
    O(t)
  }
}
function Da(e, t) {
  return e[t]
}
function sD(e, t) {
  return sr(e, t)
}
function aD(e, t) {
  return vf(e, t)
}
function wa(e, t) {
  return Ra(e, t)
}
function uD(e, t, n, r, o, i) {
  let s = t.consts,
    a = Lo(s, o),
    u = si(t, e, 2, r, a)
  return (
    df(t, n, u, Lo(s, i)),
    u.attrs !== null && aa(u, u.attrs, !1),
    u.mergedAttrs !== null && aa(u, u.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, u),
    u
  )
}
function U(e, t, n, r) {
  let o = B(),
    i = _e(),
    s = Oe + e,
    a = o[K],
    u = i.firstCreatePass ? uD(s, i, o, t, n, r) : i.data[s],
    c = cD(i, o, u, a, t, e)
  o[s] = c
  let l = Na(u)
  return (
    gr(u, !0),
    ef(a, c, u),
    !Vy(u) && La() && Ya(i, o, c, u),
    um() === 0 && Ot(c, o),
    cm(),
    l && (af(i, o, u), sf(i, u, o)),
    r !== null && uf(o, u),
    U
  )
}
function V() {
  let e = Se()
  yd() ? gm() : ((e = e.parent), gr(e, !1))
  let t = e
  fm(t) && hm(), lm()
  let n = _e()
  return (
    n.firstCreatePass && (ja(n, e), ud(e) && n.queries.elementEnd(e)),
    t.classesWithoutHost != null &&
      Tm(t) &&
      Nl(n, t, B(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      Am(t) &&
      Nl(n, t, B(), t.stylesWithoutHost, !1),
    V
  )
}
function Nn(e, t, n, r) {
  return U(e, t, n, r), V(), Nn
}
var cD = (e, t, n, r, o, i) => (Va(!0), Zd(r, o, bm()))
var Zo = 'en-US'
var lD = Zo
function dD(e) {
  typeof e == 'string' && (lD = e.toLowerCase().replace(/_/g, '-'))
}
function ie(e, t, n, r) {
  let o = B(),
    i = _e(),
    s = Se()
  return Nf(i, o, o[K], s, e, t, r), ie
}
function fD(e, t, n, r) {
  let o = e.cleanup
  if (o != null)
    for (let i = 0; i < o.length - 1; i += 2) {
      let s = o[i]
      if (s === n && o[i + 1] === r) {
        let a = t[nr],
          u = o[i + 2]
        return a.length > u ? a[u] : null
      }
      typeof s == 'string' && (i += 2)
    }
  return null
}
function Nf(e, t, n, r, o, i, s) {
  let a = Na(r),
    c = e.firstCreatePass && Hv(e),
    l = t[ce],
    d = Bv(t),
    f = !0
  if (r.type & 3 || s) {
    let M = Pe(r, t),
      y = s ? s(M) : M,
      v = d.length,
      ne = s ? ($) => s(Be($[r.index])) : r.index,
      X = null
    if ((!s && a && (X = fD(e, t, o, r.index)), X !== null)) {
      let $ = X.__ngLastListenerFn__ || X
      ;($.__ngNextListenerFn__ = i), (X.__ngLastListenerFn__ = i), (f = !1)
    } else {
      i = kl(r, t, l, i, !1)
      let $ = n.listen(y, o, i)
      d.push(i, $), c && c.push(o, ne, v, v + 1)
    }
  } else i = kl(r, t, l, i, !1)
  let h = r.outputs,
    m
  if (f && h !== null && (m = h[o])) {
    let M = m.length
    if (M)
      for (let y = 0; y < M; y += 2) {
        let v = m[y],
          ne = m[y + 1],
          ke = t[v][ne].subscribe(i),
          me = d.length
        d.push(i, ke), c && c.push(o, r.index, me, -(me + 1))
      }
  }
}
function Pl(e, t, n, r) {
  let o = O(null)
  try {
    return Ve(6, t, n), n(r) !== !1
  } catch (i) {
    return mf(e, i), !1
  } finally {
    Ve(7, t, n), O(o)
  }
}
function kl(e, t, n, r, o) {
  return function i(s) {
    if (s === Function) return r
    let a = e.componentOffset > -1 ? ft(e.index, t) : t
    tu(a)
    let u = Pl(t, n, r, s),
      c = i.__ngNextListenerFn__
    for (; c; ) (u = Pl(t, n, c, s) && u), (c = c.__ngNextListenerFn__)
    return o && u === !1 && s.preventDefault(), u
  }
}
function iu(e = 1) {
  return Im(e)
}
function H(e, t = '') {
  let n = B(),
    r = _e(),
    o = e + Oe,
    i = r.firstCreatePass ? si(r, o, 1, t, null) : r.data[o],
    s = hD(r, n, i, t, e)
  ;(n[o] = s), La() && Ya(r, n, s, i), gr(i, !1)
}
var hD = (e, t, n, r, o) => (Va(!0), Xm(t[K], r))
function ze(e, t, n) {
  let r = B(),
    o = By(r, e, t, n)
  return o !== Sn && zv(r, Lt(), o), ze
}
function vr(e, t, n) {
  Sf(t) && (t = t())
  let r = B(),
    o = mr()
  if (xn(r, o, t)) {
    let i = _e(),
      s = Md()
    lf(i, s, r, e, t, r[K], n, !1)
  }
  return vr
}
function fi(e, t) {
  let n = Sf(e)
  return n && e.set(t), n
}
function yr(e, t) {
  let n = B(),
    r = _e(),
    o = Se()
  return Nf(r, n, n[K], o, e, t), yr
}
function pD(e, t, n) {
  let r = _e()
  if (r.firstCreatePass) {
    let o = ct(e)
    Ca(n, r.data, r.blueprint, o, !0), Ca(t, r.data, r.blueprint, o, !1)
  }
}
function Ca(e, t, n, r, o) {
  if (((e = ae(e)), Array.isArray(e)))
    for (let i = 0; i < e.length; i++) Ca(e[i], t, n, r, o)
  else {
    let i = _e(),
      s = B(),
      a = Se(),
      u = mn(e) ? e : ae(e.provide),
      c = id(e),
      l = a.providerIndexes & 1048575,
      d = a.directiveStart,
      f = a.providerIndexes >> 20
    if (mn(e) || !e.multi) {
      let h = new Rt(c, o, J),
        m = Ps(u, t, o ? l : l + f, d)
      m === -1
        ? (Ws(Uo(a, s), i, u),
          Fs(i, e, t.length),
          t.push(u),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(h),
          s.push(h))
        : ((n[m] = h), (s[m] = h))
    } else {
      let h = Ps(u, t, l + f, d),
        m = Ps(u, t, l, l + f),
        M = h >= 0 && n[h],
        y = m >= 0 && n[m]
      if ((o && !y) || (!o && !M)) {
        Ws(Uo(a, s), i, u)
        let v = vD(o ? mD : gD, n.length, o, r, c)
        !o && y && (n[m].providerFactory = v),
          Fs(i, e, t.length, 0),
          t.push(u),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(v),
          s.push(v)
      } else {
        let v = Rf(n[o ? m : h], c, !o && r)
        Fs(i, e, h > -1 ? h : m, v)
      }
      !o && r && y && n[m].componentProviders++
    }
  }
}
function Fs(e, t, n, r) {
  let o = mn(t),
    i = $g(t)
  if (o || i) {
    let u = (i ? ae(t.useClass) : t).prototype.ngOnDestroy
    if (u) {
      let c = e.destroyHooks || (e.destroyHooks = [])
      if (!o && t.multi) {
        let l = c.indexOf(n)
        l === -1 ? c.push(n, [r, u]) : c[l + 1].push(r, u)
      } else c.push(n, u)
    }
  }
}
function Rf(e, t, n) {
  return n && e.componentProviders++, e.multi.push(t) - 1
}
function Ps(e, t, n, r) {
  for (let o = n; o < r; o++) if (t[o] === e) return o
  return -1
}
function gD(e, t, n, r) {
  return Ea(this.multi, [])
}
function mD(e, t, n, r) {
  let o = this.multi,
    i
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = Dn(n, n[A], this.providerFactory.index, r)
    ;(i = a.slice(0, s)), Ea(o, i)
    for (let u = s; u < a.length; u++) i.push(a[u])
  } else (i = []), Ea(o, i)
  return i
}
function Ea(e, t) {
  for (let n = 0; n < e.length; n++) {
    let r = e[n]
    t.push(r())
  }
  return t
}
function vD(e, t, n, r, o) {
  let i = new Rt(e, n, J)
  return (
    (i.multi = []),
    (i.index = t),
    (i.componentProviders = 0),
    Rf(i, o, r && !n),
    i
  )
}
function gt(e, t = []) {
  return (n) => {
    n.providersResolver = (r, o) => pD(r, o ? o(e) : e, t)
  }
}
var yD = (() => {
  let t = class t {
    constructor(r) {
      ;(this._injector = r), (this.cachedInjectors = new Map())
    }
    getOrCreateStandaloneInjector(r) {
      if (!r.standalone) return null
      if (!this.cachedInjectors.has(r)) {
        let o = nd(!1, r.type),
          i =
            o.length > 0
              ? ru([o], this._injector, `Standalone[${r.type.name}]`)
              : null
        this.cachedInjectors.set(r, i)
      }
      return this.cachedInjectors.get(r)
    }
    ngOnDestroy() {
      try {
        for (let r of this.cachedInjectors.values()) r !== null && r.destroy()
      } finally {
        this.cachedInjectors.clear()
      }
    }
  }
  t.ɵprov = D({
    token: t,
    providedIn: 'environment',
    factory: () => new t(S(pe)),
  })
  let e = t
  return e
})()
function mt(e) {
  jt('NgStandalone'),
    (e.getStandaloneInjector = (t) =>
      t.get(yD).getOrCreateStandaloneInjector(e))
}
var hi = (() => {
  let t = class t {
    log(r) {
      console.log(r)
    }
    warn(r) {
      console.warn(r)
    }
  }
  ;(t.ɵfac = function (o) {
    return new (o || t)()
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'platform' }))
  let e = t
  return e
})()
var Of = new C('')
function Bt(e) {
  return !!e && typeof e.then == 'function'
}
function Ff(e) {
  return !!e && typeof e.subscribe == 'function'
}
var Pf = new C(''),
  kf = (() => {
    let t = class t {
      constructor() {
        ;(this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((r, o) => {
            ;(this.resolve = r), (this.reject = o)
          })),
          (this.appInits = p(Pf, { optional: !0 }) ?? [])
      }
      runInitializers() {
        if (this.initialized) return
        let r = []
        for (let i of this.appInits) {
          let s = i()
          if (Bt(s)) r.push(s)
          else if (Ff(s)) {
            let a = new Promise((u, c) => {
              s.subscribe({ complete: u, error: c })
            })
            r.push(a)
          }
        }
        let o = () => {
          ;(this.done = !0), this.resolve()
        }
        Promise.all(r)
          .then(() => {
            o()
          })
          .catch((i) => {
            this.reject(i)
          }),
          r.length === 0 && o(),
          (this.initialized = !0)
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)()
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })(),
  pi = new C('')
function DD() {
  Tc(() => {
    throw new w(600, !1)
  })
}
function wD(e) {
  return e.isBoundToModule
}
function CD(e, t, n) {
  try {
    let r = n()
    return Bt(r)
      ? r.catch((o) => {
          throw (t.runOutsideAngular(() => e.handleError(o)), o)
        })
      : r
  } catch (r) {
    throw (t.runOutsideAngular(() => e.handleError(r)), r)
  }
}
var Rn = (() => {
  let t = class t {
    constructor() {
      ;(this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = p(Vd)),
        (this.afterRenderEffectManager = p(Mf)),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new se()),
        (this.afterTick = new se()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = p(An).hasPendingTasks.pipe(E((r) => !r))),
        (this._injector = p(pe))
    }
    get destroyed() {
      return this._destroyed
    }
    get injector() {
      return this._injector
    }
    bootstrap(r, o) {
      let i = r instanceof Ho
      if (!this._injector.get(kf).done) {
        let h = !i && Jl(r),
          m = !1
        throw new w(405, m)
      }
      let a
      i ? (a = r) : (a = this._injector.get(ci).resolveComponentFactory(r)),
        this.componentTypes.push(a.componentType)
      let u = wD(a) ? void 0 : this._injector.get(lt),
        c = o || a.selector,
        l = a.create(_n.NULL, [], c, u),
        d = l.location.nativeElement,
        f = l.injector.get(Of, null)
      return (
        f?.registerApplication(d),
        l.onDestroy(() => {
          this.detachView(l.hostView),
            ks(this.components, l),
            f?.unregisterApplication(d)
        }),
        this._loadComponent(l),
        l
      )
    }
    tick() {
      this._tick(!0)
    }
    _tick(r) {
      if (this._runningTick) throw new w(101, !1)
      let o = O(null)
      try {
        ;(this._runningTick = !0), this.detectChangesInAttachedViews(r)
      } catch (i) {
        this.internalErrorHandler(i)
      } finally {
        this.afterTick.next(), (this._runningTick = !1), O(o)
      }
    }
    detectChangesInAttachedViews(r) {
      let o = 0,
        i = this.afterRenderEffectManager
      for (;;) {
        if (o === wf) throw new w(103, !1)
        if (r) {
          let s = o === 0
          this.beforeRender.next(s)
          for (let { _lView: a, notifyErrorHandler: u } of this._views)
            ED(a, s, u)
        }
        if (
          (o++,
          i.executeInternalCallbacks(),
          ![...this.externalTestViews.keys(), ...this._views].some(
            ({ _lView: s }) => Ia(s),
          ) &&
            (i.execute(),
            ![...this.externalTestViews.keys(), ...this._views].some(
              ({ _lView: s }) => Ia(s),
            )))
        )
          break
      }
    }
    attachView(r) {
      let o = r
      this._views.push(o), o.attachToAppRef(this)
    }
    detachView(r) {
      let o = r
      ks(this._views, o), o.detachFromAppRef()
    }
    _loadComponent(r) {
      this.attachView(r.hostView), this.tick(), this.components.push(r)
      let o = this._injector.get(pi, [])
      ;[...this._bootstrapListeners, ...o].forEach((i) => i(r))
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((r) => r()),
            this._views.slice().forEach((r) => r.destroy())
        } finally {
          ;(this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = [])
        }
    }
    onDestroy(r) {
      return this._destroyListeners.push(r), () => ks(this._destroyListeners, r)
    }
    destroy() {
      if (this._destroyed) throw new w(406, !1)
      let r = this._injector
      r.destroy && !r.destroyed && r.destroy()
    }
    get viewCount() {
      return this._views.length
    }
    warnIfDestroyed() {}
  }
  ;(t.ɵfac = function (o) {
    return new (o || t)()
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
  let e = t
  return e
})()
function ks(e, t) {
  let n = e.indexOf(t)
  n > -1 && e.splice(n, 1)
}
function ED(e, t, n) {
  ;(!t && !Ia(e)) || ID(e, n, t)
}
function Ia(e) {
  return Fa(e)
}
function ID(e, t, n) {
  let r
  n ? ((r = 0), (e[I] |= 1024)) : e[I] & 64 ? (r = 0) : (r = 1), Cf(e, t, r)
}
var ba = class {
    constructor(t, n) {
      ;(this.ngModuleFactory = t), (this.componentFactories = n)
    }
  },
  su = (() => {
    let t = class t {
      compileModuleSync(r) {
        return new da(r)
      }
      compileModuleAsync(r) {
        return Promise.resolve(this.compileModuleSync(r))
      }
      compileModuleAndAllComponentsSync(r) {
        let o = this.compileModuleSync(r),
          i = Xl(r),
          s = Wd(i.declarations).reduce((a, u) => {
            let c = Tt(u)
            return c && a.push(new lr(c)), a
          }, [])
        return new ba(o, s)
      }
      compileModuleAndAllComponentsAsync(r) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(r))
      }
      clearCache() {}
      clearCacheFor(r) {}
      getModuleId(r) {}
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)()
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })()
var bD = (() => {
  let t = class t {
    constructor() {
      ;(this.zone = p(q)), (this.applicationRef = p(Rn))
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.zone.run(() => {
                this.applicationRef.tick()
              })
            },
          }))
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe()
    }
  }
  ;(t.ɵfac = function (o) {
    return new (o || t)()
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
  let e = t
  return e
})()
function MD(e) {
  return [
    { provide: q, useFactory: e },
    {
      provide: gn,
      multi: !0,
      useFactory: () => {
        let t = p(bD, { optional: !0 })
        return () => t.initialize()
      },
    },
    {
      provide: gn,
      multi: !0,
      useFactory: () => {
        let t = p(AD)
        return () => {
          t.initialize()
        }
      },
    },
    { provide: Vd, useFactory: _D },
  ]
}
function _D() {
  let e = p(q),
    t = p(Ke)
  return (n) => e.runOutsideAngular(() => t.handleError(n))
}
function SD(e) {
  let t = MD(() => new q(TD(e)))
  return In([[], t])
}
function TD(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  }
}
var AD = (() => {
  let t = class t {
    constructor() {
      ;(this.subscription = new Z()),
        (this.initialized = !1),
        (this.zone = p(q)),
        (this.pendingTasks = p(An))
    }
    initialize() {
      if (this.initialized) return
      this.initialized = !0
      let r = null
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (r = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              q.assertNotInAngularZone(),
                queueMicrotask(() => {
                  r !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(r), (r = null))
                })
            }),
          )
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            q.assertInAngularZone(), (r ??= this.pendingTasks.add())
          }),
        )
    }
    ngOnDestroy() {
      this.subscription.unsubscribe()
    }
  }
  ;(t.ɵfac = function (o) {
    return new (o || t)()
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
  let e = t
  return e
})()
function xD() {
  return (typeof $localize < 'u' && $localize.locale) || Zo
}
var au = new C('', {
  providedIn: 'root',
  factory: () => p(au, x.Optional | x.SkipSelf) || xD(),
})
var Lf = new C('')
var xo = null
function ND(e = [], t) {
  return _n.create({
    name: t,
    providers: [
      { provide: Xo, useValue: 'platform' },
      { provide: Lf, useValue: new Set([() => (xo = null)]) },
      ...e,
    ],
  })
}
function RD(e = []) {
  if (xo) return xo
  let t = ND(e)
  return (xo = t), DD(), OD(t), t
}
function OD(e) {
  e.get(Ha, null)?.forEach((n) => n())
}
var Ht = (() => {
  let t = class t {}
  t.__NG_ELEMENT_ID__ = FD
  let e = t
  return e
})()
function FD(e) {
  return PD(Se(), B(), (e & 16) === 16)
}
function PD(e, t, n) {
  if (ni(e) && !n) {
    let r = ft(e.index, t)
    return new wn(r, r)
  } else if (e.type & 47) {
    let r = t[Re]
    return new wn(r, t)
  }
  return null
}
function Vf(e) {
  try {
    let { rootComponent: t, appProviders: n, platformProviders: r } = e,
      o = RD(r),
      i = [SD(), ...(n || [])],
      a = new Go({
        providers: i,
        parent: o,
        debugName: '',
        runEnvironmentInitializers: !1,
      }).injector,
      u = a.get(q)
    return u.run(() => {
      a.resolveInjectorInitializers()
      let c = a.get(Ke, null),
        l
      u.runOutsideAngular(() => {
        l = u.onError.subscribe({
          next: (h) => {
            c.handleError(h)
          },
        })
      })
      let d = () => a.destroy(),
        f = o.get(Lf)
      return (
        f.add(d),
        a.onDestroy(() => {
          l.unsubscribe(), f.delete(d)
        }),
        CD(c, u, () => {
          let h = a.get(kf)
          return (
            h.runInitializers(),
            h.donePromise.then(() => {
              let m = a.get(au, Zo)
              dD(m || Zo)
              let M = a.get(Rn)
              return t !== void 0 && M.bootstrap(t), M
            })
          )
        })
      )
    })
  } catch (t) {
    return Promise.reject(t)
  }
}
function gi(e) {
  return typeof e == 'boolean' ? e : e != null && e !== 'false'
}
function vt(e, t) {
  jt('NgSignals')
  let n = Mc(e)
  return t?.equal && (n[Ze].equal = t.equal), n
}
var $f = null
function nt() {
  return $f
}
function Bf(e) {
  $f ??= e
}
var mi = class {}
var ge = new C(''),
  Hf = (() => {
    let t = class t {
      historyGo(r) {
        throw new Error('')
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)()
    }),
      (t.ɵprov = D({ token: t, factory: () => p(VD), providedIn: 'platform' }))
    let e = t
    return e
  })()
var VD = (() => {
  let t = class t extends Hf {
    constructor() {
      super(),
        (this._doc = p(ge)),
        (this._location = window.location),
        (this._history = window.history)
    }
    getBaseHrefFromDOM() {
      return nt().getBaseHref(this._doc)
    }
    onPopState(r) {
      let o = nt().getGlobalEventTarget(this._doc, 'window')
      return (
        o.addEventListener('popstate', r, !1),
        () => o.removeEventListener('popstate', r)
      )
    }
    onHashChange(r) {
      let o = nt().getGlobalEventTarget(this._doc, 'window')
      return (
        o.addEventListener('hashchange', r, !1),
        () => o.removeEventListener('hashchange', r)
      )
    }
    get href() {
      return this._location.href
    }
    get protocol() {
      return this._location.protocol
    }
    get hostname() {
      return this._location.hostname
    }
    get port() {
      return this._location.port
    }
    get pathname() {
      return this._location.pathname
    }
    get search() {
      return this._location.search
    }
    get hash() {
      return this._location.hash
    }
    set pathname(r) {
      this._location.pathname = r
    }
    pushState(r, o, i) {
      this._history.pushState(r, o, i)
    }
    replaceState(r, o, i) {
      this._history.replaceState(r, o, i)
    }
    forward() {
      this._history.forward()
    }
    back() {
      this._history.back()
    }
    historyGo(r = 0) {
      this._history.go(r)
    }
    getState() {
      return this._history.state
    }
  }
  ;(t.ɵfac = function (o) {
    return new (o || t)()
  }),
    (t.ɵprov = D({ token: t, factory: () => new t(), providedIn: 'platform' }))
  let e = t
  return e
})()
function zf(e, t) {
  if (e.length == 0) return t
  if (t.length == 0) return e
  let n = 0
  return (
    e.endsWith('/') && n++,
    t.startsWith('/') && n++,
    n == 2 ? e + t.substring(1) : n == 1 ? e + t : e + '/' + t
  )
}
function jf(e) {
  let t = e.match(/#|\?|$/),
    n = (t && t.index) || e.length,
    r = n - (e[n - 1] === '/' ? 1 : 0)
  return e.slice(0, r) + e.slice(n)
}
function zt(e) {
  return e && e[0] !== '?' ? '?' + e : e
}
var vi = (() => {
    let t = class t {
      historyGo(r) {
        throw new Error('')
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)()
    }),
      (t.ɵprov = D({ token: t, factory: () => p(Gf), providedIn: 'root' }))
    let e = t
    return e
  })(),
  jD = new C(''),
  Gf = (() => {
    let t = class t extends vi {
      constructor(r, o) {
        super(),
          (this._platformLocation = r),
          (this._removeListenerFns = []),
          (this._baseHref =
            o ??
            this._platformLocation.getBaseHrefFromDOM() ??
            p(ge).location?.origin ??
            '')
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; ) this._removeListenerFns.pop()()
      }
      onPopState(r) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(r),
          this._platformLocation.onHashChange(r),
        )
      }
      getBaseHref() {
        return this._baseHref
      }
      prepareExternalUrl(r) {
        return zf(this._baseHref, r)
      }
      path(r = !1) {
        let o =
            this._platformLocation.pathname + zt(this._platformLocation.search),
          i = this._platformLocation.hash
        return i && r ? `${o}${i}` : o
      }
      pushState(r, o, i, s) {
        let a = this.prepareExternalUrl(i + zt(s))
        this._platformLocation.pushState(r, o, a)
      }
      replaceState(r, o, i, s) {
        let a = this.prepareExternalUrl(i + zt(s))
        this._platformLocation.replaceState(r, o, a)
      }
      forward() {
        this._platformLocation.forward()
      }
      back() {
        this._platformLocation.back()
      }
      getState() {
        return this._platformLocation.getState()
      }
      historyGo(r = 0) {
        this._platformLocation.historyGo?.(r)
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)(S(Hf), S(jD, 8))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })()
var Dr = (() => {
  let t = class t {
    constructor(r) {
      ;(this._subject = new ue()),
        (this._urlChangeListeners = []),
        (this._urlChangeSubscription = null),
        (this._locationStrategy = r)
      let o = this._locationStrategy.getBaseHref()
      ;(this._basePath = BD(jf(Uf(o)))),
        this._locationStrategy.onPopState((i) => {
          this._subject.emit({
            url: this.path(!0),
            pop: !0,
            state: i.state,
            type: i.type,
          })
        })
    }
    ngOnDestroy() {
      this._urlChangeSubscription?.unsubscribe(),
        (this._urlChangeListeners = [])
    }
    path(r = !1) {
      return this.normalize(this._locationStrategy.path(r))
    }
    getState() {
      return this._locationStrategy.getState()
    }
    isCurrentPathEqualTo(r, o = '') {
      return this.path() == this.normalize(r + zt(o))
    }
    normalize(r) {
      return t.stripTrailingSlash($D(this._basePath, Uf(r)))
    }
    prepareExternalUrl(r) {
      return (
        r && r[0] !== '/' && (r = '/' + r),
        this._locationStrategy.prepareExternalUrl(r)
      )
    }
    go(r, o = '', i = null) {
      this._locationStrategy.pushState(i, '', r, o),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(r + zt(o)), i)
    }
    replaceState(r, o = '', i = null) {
      this._locationStrategy.replaceState(i, '', r, o),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(r + zt(o)), i)
    }
    forward() {
      this._locationStrategy.forward()
    }
    back() {
      this._locationStrategy.back()
    }
    historyGo(r = 0) {
      this._locationStrategy.historyGo?.(r)
    }
    onUrlChange(r) {
      return (
        this._urlChangeListeners.push(r),
        (this._urlChangeSubscription ??= this.subscribe((o) => {
          this._notifyUrlChangeListeners(o.url, o.state)
        })),
        () => {
          let o = this._urlChangeListeners.indexOf(r)
          this._urlChangeListeners.splice(o, 1),
            this._urlChangeListeners.length === 0 &&
              (this._urlChangeSubscription?.unsubscribe(),
              (this._urlChangeSubscription = null))
        }
      )
    }
    _notifyUrlChangeListeners(r = '', o) {
      this._urlChangeListeners.forEach((i) => i(r, o))
    }
    subscribe(r, o, i) {
      return this._subject.subscribe({ next: r, error: o, complete: i })
    }
  }
  ;(t.normalizeQueryParams = zt),
    (t.joinWithSlash = zf),
    (t.stripTrailingSlash = jf),
    (t.ɵfac = function (o) {
      return new (o || t)(S(vi))
    }),
    (t.ɵprov = D({ token: t, factory: () => UD(), providedIn: 'root' }))
  let e = t
  return e
})()
function UD() {
  return new Dr(S(vi))
}
function $D(e, t) {
  if (!e || !t.startsWith(e)) return t
  let n = t.substring(e.length)
  return n === '' || ['/', ';', '?', '#'].includes(n[0]) ? n : t
}
function Uf(e) {
  return e.replace(/\/index.html$/, '')
}
function BD(e) {
  if (new RegExp('^(https?:)?//').test(e)) {
    let [, n] = e.split(/\/\/[^\/]+/)
    return n
  }
  return e
}
function yi(e, t) {
  t = encodeURIComponent(t)
  for (let n of e.split(';')) {
    let r = n.indexOf('='),
      [o, i] = r == -1 ? [n, ''] : [n.slice(0, r), n.slice(r + 1)]
    if (o.trim() === t) return decodeURIComponent(i)
  }
  return null
}
var qf = 'browser',
  HD = 'server'
function Di(e) {
  return e === HD
}
var On = class {}
var Cr = class {},
  Ci = class {},
  Gt = class e {
    constructor(t) {
      ;(this.normalizedNames = new Map()),
        (this.lazyUpdate = null),
        t
          ? typeof t == 'string'
            ? (this.lazyInit = () => {
                ;(this.headers = new Map()),
                  t
                    .split(
                      `
`,
                    )
                    .forEach((n) => {
                      let r = n.indexOf(':')
                      if (r > 0) {
                        let o = n.slice(0, r),
                          i = o.toLowerCase(),
                          s = n.slice(r + 1).trim()
                        this.maybeSetNormalizedName(o, i),
                          this.headers.has(i)
                            ? this.headers.get(i).push(s)
                            : this.headers.set(i, [s])
                      }
                    })
              })
            : typeof Headers < 'u' && t instanceof Headers
              ? ((this.headers = new Map()),
                t.forEach((n, r) => {
                  this.setHeaderEntries(r, n)
                }))
              : (this.lazyInit = () => {
                  ;(this.headers = new Map()),
                    Object.entries(t).forEach(([n, r]) => {
                      this.setHeaderEntries(n, r)
                    })
                })
          : (this.headers = new Map())
    }
    has(t) {
      return this.init(), this.headers.has(t.toLowerCase())
    }
    get(t) {
      this.init()
      let n = this.headers.get(t.toLowerCase())
      return n && n.length > 0 ? n[0] : null
    }
    keys() {
      return this.init(), Array.from(this.normalizedNames.values())
    }
    getAll(t) {
      return this.init(), this.headers.get(t.toLowerCase()) || null
    }
    append(t, n) {
      return this.clone({ name: t, value: n, op: 'a' })
    }
    set(t, n) {
      return this.clone({ name: t, value: n, op: 's' })
    }
    delete(t, n) {
      return this.clone({ name: t, value: n, op: 'd' })
    }
    maybeSetNormalizedName(t, n) {
      this.normalizedNames.has(n) || this.normalizedNames.set(n, t)
    }
    init() {
      this.lazyInit &&
        (this.lazyInit instanceof e
          ? this.copyFrom(this.lazyInit)
          : this.lazyInit(),
        (this.lazyInit = null),
        this.lazyUpdate &&
          (this.lazyUpdate.forEach((t) => this.applyUpdate(t)),
          (this.lazyUpdate = null)))
    }
    copyFrom(t) {
      t.init(),
        Array.from(t.headers.keys()).forEach((n) => {
          this.headers.set(n, t.headers.get(n)),
            this.normalizedNames.set(n, t.normalizedNames.get(n))
        })
    }
    clone(t) {
      let n = new e()
      return (
        (n.lazyInit =
          this.lazyInit && this.lazyInit instanceof e ? this.lazyInit : this),
        (n.lazyUpdate = (this.lazyUpdate || []).concat([t])),
        n
      )
    }
    applyUpdate(t) {
      let n = t.name.toLowerCase()
      switch (t.op) {
        case 'a':
        case 's':
          let r = t.value
          if ((typeof r == 'string' && (r = [r]), r.length === 0)) return
          this.maybeSetNormalizedName(t.name, n)
          let o = (t.op === 'a' ? this.headers.get(n) : void 0) || []
          o.push(...r), this.headers.set(n, o)
          break
        case 'd':
          let i = t.value
          if (!i) this.headers.delete(n), this.normalizedNames.delete(n)
          else {
            let s = this.headers.get(n)
            if (!s) return
            ;(s = s.filter((a) => i.indexOf(a) === -1)),
              s.length === 0
                ? (this.headers.delete(n), this.normalizedNames.delete(n))
                : this.headers.set(n, s)
          }
          break
      }
    }
    setHeaderEntries(t, n) {
      let r = (Array.isArray(n) ? n : [n]).map((i) => i.toString()),
        o = t.toLowerCase()
      this.headers.set(o, r), this.maybeSetNormalizedName(t, o)
    }
    forEach(t) {
      this.init(),
        Array.from(this.normalizedNames.keys()).forEach((n) =>
          t(this.normalizedNames.get(n), this.headers.get(n)),
        )
    }
  }
var lu = class {
  encodeKey(t) {
    return Wf(t)
  }
  encodeValue(t) {
    return Wf(t)
  }
  decodeKey(t) {
    return decodeURIComponent(t)
  }
  decodeValue(t) {
    return decodeURIComponent(t)
  }
}
function WD(e, t) {
  let n = new Map()
  return (
    e.length > 0 &&
      e
        .replace(/^\?/, '')
        .split('&')
        .forEach((o) => {
          let i = o.indexOf('='),
            [s, a] =
              i == -1
                ? [t.decodeKey(o), '']
                : [t.decodeKey(o.slice(0, i)), t.decodeValue(o.slice(i + 1))],
            u = n.get(s) || []
          u.push(a), n.set(s, u)
        }),
    n
  )
}
var ZD = /%(\d[a-f0-9])/gi,
  YD = {
    40: '@',
    '3A': ':',
    24: '$',
    '2C': ',',
    '3B': ';',
    '3D': '=',
    '3F': '?',
    '2F': '/',
  }
function Wf(e) {
  return encodeURIComponent(e).replace(ZD, (t, n) => YD[n] ?? t)
}
function wi(e) {
  return `${e}`
}
var yt = class e {
  constructor(t = {}) {
    if (
      ((this.updates = null),
      (this.cloneFrom = null),
      (this.encoder = t.encoder || new lu()),
      t.fromString)
    ) {
      if (t.fromObject)
        throw new Error('Cannot specify both fromString and fromObject.')
      this.map = WD(t.fromString, this.encoder)
    } else
      t.fromObject
        ? ((this.map = new Map()),
          Object.keys(t.fromObject).forEach((n) => {
            let r = t.fromObject[n],
              o = Array.isArray(r) ? r.map(wi) : [wi(r)]
            this.map.set(n, o)
          }))
        : (this.map = null)
  }
  has(t) {
    return this.init(), this.map.has(t)
  }
  get(t) {
    this.init()
    let n = this.map.get(t)
    return n ? n[0] : null
  }
  getAll(t) {
    return this.init(), this.map.get(t) || null
  }
  keys() {
    return this.init(), Array.from(this.map.keys())
  }
  append(t, n) {
    return this.clone({ param: t, value: n, op: 'a' })
  }
  appendAll(t) {
    let n = []
    return (
      Object.keys(t).forEach((r) => {
        let o = t[r]
        Array.isArray(o)
          ? o.forEach((i) => {
              n.push({ param: r, value: i, op: 'a' })
            })
          : n.push({ param: r, value: o, op: 'a' })
      }),
      this.clone(n)
    )
  }
  set(t, n) {
    return this.clone({ param: t, value: n, op: 's' })
  }
  delete(t, n) {
    return this.clone({ param: t, value: n, op: 'd' })
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((t) => {
          let n = this.encoder.encodeKey(t)
          return this.map
            .get(t)
            .map((r) => n + '=' + this.encoder.encodeValue(r))
            .join('&')
        })
        .filter((t) => t !== '')
        .join('&')
    )
  }
  clone(t) {
    let n = new e({ encoder: this.encoder })
    return (
      (n.cloneFrom = this.cloneFrom || this),
      (n.updates = (this.updates || []).concat(t)),
      n
    )
  }
  init() {
    this.map === null && (this.map = new Map()),
      this.cloneFrom !== null &&
        (this.cloneFrom.init(),
        this.cloneFrom
          .keys()
          .forEach((t) => this.map.set(t, this.cloneFrom.map.get(t))),
        this.updates.forEach((t) => {
          switch (t.op) {
            case 'a':
            case 's':
              let n = (t.op === 'a' ? this.map.get(t.param) : void 0) || []
              n.push(wi(t.value)), this.map.set(t.param, n)
              break
            case 'd':
              if (t.value !== void 0) {
                let r = this.map.get(t.param) || [],
                  o = r.indexOf(wi(t.value))
                o !== -1 && r.splice(o, 1),
                  r.length > 0
                    ? this.map.set(t.param, r)
                    : this.map.delete(t.param)
              } else {
                this.map.delete(t.param)
                break
              }
          }
        }),
        (this.cloneFrom = this.updates = null))
  }
}
var du = class {
  constructor() {
    this.map = new Map()
  }
  set(t, n) {
    return this.map.set(t, n), this
  }
  get(t) {
    return this.map.has(t) || this.map.set(t, t.defaultValue()), this.map.get(t)
  }
  delete(t) {
    return this.map.delete(t), this
  }
  has(t) {
    return this.map.has(t)
  }
  keys() {
    return this.map.keys()
  }
}
function QD(e) {
  switch (e) {
    case 'DELETE':
    case 'GET':
    case 'HEAD':
    case 'OPTIONS':
    case 'JSONP':
      return !1
    default:
      return !0
  }
}
function Zf(e) {
  return typeof ArrayBuffer < 'u' && e instanceof ArrayBuffer
}
function Yf(e) {
  return typeof Blob < 'u' && e instanceof Blob
}
function Qf(e) {
  return typeof FormData < 'u' && e instanceof FormData
}
function KD(e) {
  return typeof URLSearchParams < 'u' && e instanceof URLSearchParams
}
var wr = class e {
    constructor(t, n, r, o) {
      ;(this.url = n),
        (this.body = null),
        (this.reportProgress = !1),
        (this.withCredentials = !1),
        (this.responseType = 'json'),
        (this.method = t.toUpperCase())
      let i
      if (
        (QD(this.method) || o
          ? ((this.body = r !== void 0 ? r : null), (i = o))
          : (i = r),
        i &&
          ((this.reportProgress = !!i.reportProgress),
          (this.withCredentials = !!i.withCredentials),
          i.responseType && (this.responseType = i.responseType),
          i.headers && (this.headers = i.headers),
          i.context && (this.context = i.context),
          i.params && (this.params = i.params),
          (this.transferCache = i.transferCache)),
        (this.headers ??= new Gt()),
        (this.context ??= new du()),
        !this.params)
      )
        (this.params = new yt()), (this.urlWithParams = n)
      else {
        let s = this.params.toString()
        if (s.length === 0) this.urlWithParams = n
        else {
          let a = n.indexOf('?'),
            u = a === -1 ? '?' : a < n.length - 1 ? '&' : ''
          this.urlWithParams = n + u + s
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : typeof this.body == 'string' ||
            Zf(this.body) ||
            Yf(this.body) ||
            Qf(this.body) ||
            KD(this.body)
          ? this.body
          : this.body instanceof yt
            ? this.body.toString()
            : typeof this.body == 'object' ||
                typeof this.body == 'boolean' ||
                Array.isArray(this.body)
              ? JSON.stringify(this.body)
              : this.body.toString()
    }
    detectContentTypeHeader() {
      return this.body === null || Qf(this.body)
        ? null
        : Yf(this.body)
          ? this.body.type || null
          : Zf(this.body)
            ? null
            : typeof this.body == 'string'
              ? 'text/plain'
              : this.body instanceof yt
                ? 'application/x-www-form-urlencoded;charset=UTF-8'
                : typeof this.body == 'object' ||
                    typeof this.body == 'number' ||
                    typeof this.body == 'boolean'
                  ? 'application/json'
                  : null
    }
    clone(t = {}) {
      let n = t.method || this.method,
        r = t.url || this.url,
        o = t.responseType || this.responseType,
        i = t.transferCache ?? this.transferCache,
        s = t.body !== void 0 ? t.body : this.body,
        a = t.withCredentials ?? this.withCredentials,
        u = t.reportProgress ?? this.reportProgress,
        c = t.headers || this.headers,
        l = t.params || this.params,
        d = t.context ?? this.context
      return (
        t.setHeaders !== void 0 &&
          (c = Object.keys(t.setHeaders).reduce(
            (f, h) => f.set(h, t.setHeaders[h]),
            c,
          )),
        t.setParams &&
          (l = Object.keys(t.setParams).reduce(
            (f, h) => f.set(h, t.setParams[h]),
            l,
          )),
        new e(n, r, s, {
          params: l,
          headers: c,
          context: d,
          reportProgress: u,
          responseType: o,
          withCredentials: a,
          transferCache: i,
        })
      )
    }
  },
  Fn = (function (e) {
    return (
      (e[(e.Sent = 0)] = 'Sent'),
      (e[(e.UploadProgress = 1)] = 'UploadProgress'),
      (e[(e.ResponseHeader = 2)] = 'ResponseHeader'),
      (e[(e.DownloadProgress = 3)] = 'DownloadProgress'),
      (e[(e.Response = 4)] = 'Response'),
      (e[(e.User = 5)] = 'User'),
      e
    )
  })(Fn || {}),
  Er = class {
    constructor(t, n = Ii.Ok, r = 'OK') {
      ;(this.headers = t.headers || new Gt()),
        (this.status = t.status !== void 0 ? t.status : n),
        (this.statusText = t.statusText || r),
        (this.url = t.url || null),
        (this.ok = this.status >= 200 && this.status < 300)
    }
  },
  fu = class e extends Er {
    constructor(t = {}) {
      super(t), (this.type = Fn.ResponseHeader)
    }
    clone(t = {}) {
      return new e({
        headers: t.headers || this.headers,
        status: t.status !== void 0 ? t.status : this.status,
        statusText: t.statusText || this.statusText,
        url: t.url || this.url || void 0,
      })
    }
  },
  Ei = class e extends Er {
    constructor(t = {}) {
      super(t),
        (this.type = Fn.Response),
        (this.body = t.body !== void 0 ? t.body : null)
    }
    clone(t = {}) {
      return new e({
        body: t.body !== void 0 ? t.body : this.body,
        headers: t.headers || this.headers,
        status: t.status !== void 0 ? t.status : this.status,
        statusText: t.statusText || this.statusText,
        url: t.url || this.url || void 0,
      })
    }
  },
  Pn = class extends Er {
    constructor(t) {
      super(t, 0, 'Unknown Error'),
        (this.name = 'HttpErrorResponse'),
        (this.ok = !1),
        this.status >= 200 && this.status < 300
          ? (this.message = `Http failure during parsing for ${t.url || '(unknown url)'}`)
          : (this.message = `Http failure response for ${t.url || '(unknown url)'}: ${t.status} ${t.statusText}`),
        (this.error = t.error || null)
    }
  },
  Ii = (function (e) {
    return (
      (e[(e.Continue = 100)] = 'Continue'),
      (e[(e.SwitchingProtocols = 101)] = 'SwitchingProtocols'),
      (e[(e.Processing = 102)] = 'Processing'),
      (e[(e.EarlyHints = 103)] = 'EarlyHints'),
      (e[(e.Ok = 200)] = 'Ok'),
      (e[(e.Created = 201)] = 'Created'),
      (e[(e.Accepted = 202)] = 'Accepted'),
      (e[(e.NonAuthoritativeInformation = 203)] =
        'NonAuthoritativeInformation'),
      (e[(e.NoContent = 204)] = 'NoContent'),
      (e[(e.ResetContent = 205)] = 'ResetContent'),
      (e[(e.PartialContent = 206)] = 'PartialContent'),
      (e[(e.MultiStatus = 207)] = 'MultiStatus'),
      (e[(e.AlreadyReported = 208)] = 'AlreadyReported'),
      (e[(e.ImUsed = 226)] = 'ImUsed'),
      (e[(e.MultipleChoices = 300)] = 'MultipleChoices'),
      (e[(e.MovedPermanently = 301)] = 'MovedPermanently'),
      (e[(e.Found = 302)] = 'Found'),
      (e[(e.SeeOther = 303)] = 'SeeOther'),
      (e[(e.NotModified = 304)] = 'NotModified'),
      (e[(e.UseProxy = 305)] = 'UseProxy'),
      (e[(e.Unused = 306)] = 'Unused'),
      (e[(e.TemporaryRedirect = 307)] = 'TemporaryRedirect'),
      (e[(e.PermanentRedirect = 308)] = 'PermanentRedirect'),
      (e[(e.BadRequest = 400)] = 'BadRequest'),
      (e[(e.Unauthorized = 401)] = 'Unauthorized'),
      (e[(e.PaymentRequired = 402)] = 'PaymentRequired'),
      (e[(e.Forbidden = 403)] = 'Forbidden'),
      (e[(e.NotFound = 404)] = 'NotFound'),
      (e[(e.MethodNotAllowed = 405)] = 'MethodNotAllowed'),
      (e[(e.NotAcceptable = 406)] = 'NotAcceptable'),
      (e[(e.ProxyAuthenticationRequired = 407)] =
        'ProxyAuthenticationRequired'),
      (e[(e.RequestTimeout = 408)] = 'RequestTimeout'),
      (e[(e.Conflict = 409)] = 'Conflict'),
      (e[(e.Gone = 410)] = 'Gone'),
      (e[(e.LengthRequired = 411)] = 'LengthRequired'),
      (e[(e.PreconditionFailed = 412)] = 'PreconditionFailed'),
      (e[(e.PayloadTooLarge = 413)] = 'PayloadTooLarge'),
      (e[(e.UriTooLong = 414)] = 'UriTooLong'),
      (e[(e.UnsupportedMediaType = 415)] = 'UnsupportedMediaType'),
      (e[(e.RangeNotSatisfiable = 416)] = 'RangeNotSatisfiable'),
      (e[(e.ExpectationFailed = 417)] = 'ExpectationFailed'),
      (e[(e.ImATeapot = 418)] = 'ImATeapot'),
      (e[(e.MisdirectedRequest = 421)] = 'MisdirectedRequest'),
      (e[(e.UnprocessableEntity = 422)] = 'UnprocessableEntity'),
      (e[(e.Locked = 423)] = 'Locked'),
      (e[(e.FailedDependency = 424)] = 'FailedDependency'),
      (e[(e.TooEarly = 425)] = 'TooEarly'),
      (e[(e.UpgradeRequired = 426)] = 'UpgradeRequired'),
      (e[(e.PreconditionRequired = 428)] = 'PreconditionRequired'),
      (e[(e.TooManyRequests = 429)] = 'TooManyRequests'),
      (e[(e.RequestHeaderFieldsTooLarge = 431)] =
        'RequestHeaderFieldsTooLarge'),
      (e[(e.UnavailableForLegalReasons = 451)] = 'UnavailableForLegalReasons'),
      (e[(e.InternalServerError = 500)] = 'InternalServerError'),
      (e[(e.NotImplemented = 501)] = 'NotImplemented'),
      (e[(e.BadGateway = 502)] = 'BadGateway'),
      (e[(e.ServiceUnavailable = 503)] = 'ServiceUnavailable'),
      (e[(e.GatewayTimeout = 504)] = 'GatewayTimeout'),
      (e[(e.HttpVersionNotSupported = 505)] = 'HttpVersionNotSupported'),
      (e[(e.VariantAlsoNegotiates = 506)] = 'VariantAlsoNegotiates'),
      (e[(e.InsufficientStorage = 507)] = 'InsufficientStorage'),
      (e[(e.LoopDetected = 508)] = 'LoopDetected'),
      (e[(e.NotExtended = 510)] = 'NotExtended'),
      (e[(e.NetworkAuthenticationRequired = 511)] =
        'NetworkAuthenticationRequired'),
      e
    )
  })(Ii || {})
function cu(e, t) {
  return {
    body: t,
    headers: e.headers,
    context: e.context,
    observe: e.observe,
    params: e.params,
    reportProgress: e.reportProgress,
    responseType: e.responseType,
    withCredentials: e.withCredentials,
    transferCache: e.transferCache,
  }
}
var hu = (() => {
  let t = class t {
    constructor(r) {
      this.handler = r
    }
    request(r, o, i = {}) {
      let s
      if (r instanceof wr) s = r
      else {
        let c
        i.headers instanceof Gt ? (c = i.headers) : (c = new Gt(i.headers))
        let l
        i.params &&
          (i.params instanceof yt
            ? (l = i.params)
            : (l = new yt({ fromObject: i.params }))),
          (s = new wr(r, o, i.body !== void 0 ? i.body : null, {
            headers: c,
            context: i.context,
            params: l,
            reportProgress: i.reportProgress,
            responseType: i.responseType || 'json',
            withCredentials: i.withCredentials,
            transferCache: i.transferCache,
          }))
      }
      let a = b(s).pipe(it((c) => this.handler.handle(c)))
      if (r instanceof wr || i.observe === 'events') return a
      let u = a.pipe(De((c) => c instanceof Ei))
      switch (i.observe || 'body') {
        case 'body':
          switch (s.responseType) {
            case 'arraybuffer':
              return u.pipe(
                E((c) => {
                  if (c.body !== null && !(c.body instanceof ArrayBuffer))
                    throw new Error('Response is not an ArrayBuffer.')
                  return c.body
                }),
              )
            case 'blob':
              return u.pipe(
                E((c) => {
                  if (c.body !== null && !(c.body instanceof Blob))
                    throw new Error('Response is not a Blob.')
                  return c.body
                }),
              )
            case 'text':
              return u.pipe(
                E((c) => {
                  if (c.body !== null && typeof c.body != 'string')
                    throw new Error('Response is not a string.')
                  return c.body
                }),
              )
            case 'json':
            default:
              return u.pipe(E((c) => c.body))
          }
        case 'response':
          return u
        default:
          throw new Error(`Unreachable: unhandled observe type ${i.observe}}`)
      }
    }
    delete(r, o = {}) {
      return this.request('DELETE', r, o)
    }
    get(r, o = {}) {
      return this.request('GET', r, o)
    }
    head(r, o = {}) {
      return this.request('HEAD', r, o)
    }
    jsonp(r, o) {
      return this.request('JSONP', r, {
        params: new yt().append(o, 'JSONP_CALLBACK'),
        observe: 'body',
        responseType: 'json',
      })
    }
    options(r, o = {}) {
      return this.request('OPTIONS', r, o)
    }
    patch(r, o, i = {}) {
      return this.request('PATCH', r, cu(i, o))
    }
    post(r, o, i = {}) {
      return this.request('POST', r, cu(i, o))
    }
    put(r, o, i = {}) {
      return this.request('PUT', r, cu(i, o))
    }
  }
  ;(t.ɵfac = function (o) {
    return new (o || t)(S(Cr))
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac }))
  let e = t
  return e
})()
function JD(e, t) {
  return t(e)
}
function XD(e, t, n) {
  return (r, o) => Xe(n, () => t(r, (i) => e(i, o)))
}
var Xf = new C(''),
  ew = new C(''),
  tw = new C('')
var Kf = (() => {
  let t = class t extends Cr {
    constructor(r, o) {
      super(),
        (this.backend = r),
        (this.injector = o),
        (this.chain = null),
        (this.pendingTasks = p(An))
      let i = p(tw, { optional: !0 })
      this.backend = i ?? r
    }
    handle(r) {
      if (this.chain === null) {
        let i = Array.from(
          new Set([...this.injector.get(Xf), ...this.injector.get(ew, [])]),
        )
        this.chain = i.reduceRight((s, a) => XD(s, a, this.injector), JD)
      }
      let o = this.pendingTasks.add()
      return this.chain(r, (i) => this.backend.handle(i)).pipe(
        Mt(() => this.pendingTasks.remove(o)),
      )
    }
  }
  ;(t.ɵfac = function (o) {
    return new (o || t)(S(Ci), S(pe))
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac }))
  let e = t
  return e
})()
var nw = /^\)\]\}',?\n/
function rw(e) {
  return 'responseURL' in e && e.responseURL
    ? e.responseURL
    : /^X-Request-URL:/m.test(e.getAllResponseHeaders())
      ? e.getResponseHeader('X-Request-URL')
      : null
}
var Jf = (() => {
    let t = class t {
      constructor(r) {
        this.xhrFactory = r
      }
      handle(r) {
        if (r.method === 'JSONP') throw new w(-2800, !1)
        let o = this.xhrFactory
        return (o.ɵloadImpl ? z(o.ɵloadImpl()) : b(null)).pipe(
          we(
            () =>
              new k((s) => {
                let a = o.build()
                if (
                  (a.open(r.method, r.urlWithParams),
                  r.withCredentials && (a.withCredentials = !0),
                  r.headers.forEach((y, v) =>
                    a.setRequestHeader(y, v.join(',')),
                  ),
                  r.headers.has('Accept') ||
                    a.setRequestHeader(
                      'Accept',
                      'application/json, text/plain, */*',
                    ),
                  !r.headers.has('Content-Type'))
                ) {
                  let y = r.detectContentTypeHeader()
                  y !== null && a.setRequestHeader('Content-Type', y)
                }
                if (r.responseType) {
                  let y = r.responseType.toLowerCase()
                  a.responseType = y !== 'json' ? y : 'text'
                }
                let u = r.serializeBody(),
                  c = null,
                  l = () => {
                    if (c !== null) return c
                    let y = a.statusText || 'OK',
                      v = new Gt(a.getAllResponseHeaders()),
                      ne = rw(a) || r.url
                    return (
                      (c = new fu({
                        headers: v,
                        status: a.status,
                        statusText: y,
                        url: ne,
                      })),
                      c
                    )
                  },
                  d = () => {
                    let { headers: y, status: v, statusText: ne, url: X } = l(),
                      $ = null
                    v !== Ii.NoContent &&
                      ($ =
                        typeof a.response > 'u' ? a.responseText : a.response),
                      v === 0 && (v = $ ? Ii.Ok : 0)
                    let ke = v >= 200 && v < 300
                    if (r.responseType === 'json' && typeof $ == 'string') {
                      let me = $
                      $ = $.replace(nw, '')
                      try {
                        $ = $ !== '' ? JSON.parse($) : null
                      } catch (rt) {
                        ;($ = me),
                          ke && ((ke = !1), ($ = { error: rt, text: $ }))
                      }
                    }
                    ke
                      ? (s.next(
                          new Ei({
                            body: $,
                            headers: y,
                            status: v,
                            statusText: ne,
                            url: X || void 0,
                          }),
                        ),
                        s.complete())
                      : s.error(
                          new Pn({
                            error: $,
                            headers: y,
                            status: v,
                            statusText: ne,
                            url: X || void 0,
                          }),
                        )
                  },
                  f = (y) => {
                    let { url: v } = l(),
                      ne = new Pn({
                        error: y,
                        status: a.status || 0,
                        statusText: a.statusText || 'Unknown Error',
                        url: v || void 0,
                      })
                    s.error(ne)
                  },
                  h = !1,
                  m = (y) => {
                    h || (s.next(l()), (h = !0))
                    let v = { type: Fn.DownloadProgress, loaded: y.loaded }
                    y.lengthComputable && (v.total = y.total),
                      r.responseType === 'text' &&
                        a.responseText &&
                        (v.partialText = a.responseText),
                      s.next(v)
                  },
                  M = (y) => {
                    let v = { type: Fn.UploadProgress, loaded: y.loaded }
                    y.lengthComputable && (v.total = y.total), s.next(v)
                  }
                return (
                  a.addEventListener('load', d),
                  a.addEventListener('error', f),
                  a.addEventListener('timeout', f),
                  a.addEventListener('abort', f),
                  r.reportProgress &&
                    (a.addEventListener('progress', m),
                    u !== null &&
                      a.upload &&
                      a.upload.addEventListener('progress', M)),
                  a.send(u),
                  s.next({ type: Fn.Sent }),
                  () => {
                    a.removeEventListener('error', f),
                      a.removeEventListener('abort', f),
                      a.removeEventListener('load', d),
                      a.removeEventListener('timeout', f),
                      r.reportProgress &&
                        (a.removeEventListener('progress', m),
                        u !== null &&
                          a.upload &&
                          a.upload.removeEventListener('progress', M)),
                      a.readyState !== a.DONE && a.abort()
                  }
                )
              }),
          ),
        )
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)(S(On))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })(),
  eh = new C(''),
  ow = 'XSRF-TOKEN',
  iw = new C('', { providedIn: 'root', factory: () => ow }),
  sw = 'X-XSRF-TOKEN',
  aw = new C('', { providedIn: 'root', factory: () => sw }),
  bi = class {},
  uw = (() => {
    let t = class t {
      constructor(r, o, i) {
        ;(this.doc = r),
          (this.platform = o),
          (this.cookieName = i),
          (this.lastCookieString = ''),
          (this.lastToken = null),
          (this.parseCount = 0)
      }
      getToken() {
        if (this.platform === 'server') return null
        let r = this.doc.cookie || ''
        return (
          r !== this.lastCookieString &&
            (this.parseCount++,
            (this.lastToken = yi(r, this.cookieName)),
            (this.lastCookieString = r)),
          this.lastToken
        )
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)(S(ge), S(pt), S(iw))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })()
function cw(e, t) {
  let n = e.url.toLowerCase()
  if (
    !p(eh) ||
    e.method === 'GET' ||
    e.method === 'HEAD' ||
    n.startsWith('http://') ||
    n.startsWith('https://')
  )
    return t(e)
  let r = p(bi).getToken(),
    o = p(aw)
  return (
    r != null &&
      !e.headers.has(o) &&
      (e = e.clone({ headers: e.headers.set(o, r) })),
    t(e)
  )
}
function th(...e) {
  let t = [
    hu,
    Jf,
    Kf,
    { provide: Cr, useExisting: Kf },
    { provide: Ci, useExisting: Jf },
    { provide: Xf, useValue: cw, multi: !0 },
    { provide: eh, useValue: !0 },
    { provide: bi, useClass: uw },
  ]
  for (let n of e) t.push(...n.ɵproviders)
  return In(t)
}
var mu = class extends mi {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0)
    }
  },
  vu = class e extends mu {
    static makeCurrent() {
      Bf(new e())
    }
    onAndCancel(t, n, r) {
      return (
        t.addEventListener(n, r),
        () => {
          t.removeEventListener(n, r)
        }
      )
    }
    dispatchEvent(t, n) {
      t.dispatchEvent(n)
    }
    remove(t) {
      t.parentNode && t.parentNode.removeChild(t)
    }
    createElement(t, n) {
      return (n = n || this.getDefaultDocument()), n.createElement(t)
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument('fakeTitle')
    }
    getDefaultDocument() {
      return document
    }
    isElementNode(t) {
      return t.nodeType === Node.ELEMENT_NODE
    }
    isShadowRoot(t) {
      return t instanceof DocumentFragment
    }
    getGlobalEventTarget(t, n) {
      return n === 'window'
        ? window
        : n === 'document'
          ? t
          : n === 'body'
            ? t.body
            : null
    }
    getBaseHref(t) {
      let n = dw()
      return n == null ? null : fw(n)
    }
    resetBaseElement() {
      Ir = null
    }
    getUserAgent() {
      return window.navigator.userAgent
    }
    getCookie(t) {
      return yi(document.cookie, t)
    }
  },
  Ir = null
function dw() {
  return (
    (Ir = Ir || document.querySelector('base')),
    Ir ? Ir.getAttribute('href') : null
  )
}
function fw(e) {
  return new URL(e, document.baseURI).pathname
}
var hw = (() => {
    let t = class t {
      build() {
        return new XMLHttpRequest()
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)()
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })(),
  yu = new C(''),
  ih = (() => {
    let t = class t {
      constructor(r, o) {
        ;(this._zone = o),
          (this._eventNameToPlugin = new Map()),
          r.forEach((i) => {
            i.manager = this
          }),
          (this._plugins = r.slice().reverse())
      }
      addEventListener(r, o, i) {
        return this._findPluginFor(o).addEventListener(r, o, i)
      }
      getZone() {
        return this._zone
      }
      _findPluginFor(r) {
        let o = this._eventNameToPlugin.get(r)
        if (o) return o
        if (((o = this._plugins.find((s) => s.supports(r))), !o))
          throw new w(5101, !1)
        return this._eventNameToPlugin.set(r, o), o
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)(S(yu), S(q))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })(),
  Mi = class {
    constructor(t) {
      this._doc = t
    }
  },
  pu = 'ng-app-id',
  sh = (() => {
    let t = class t {
      constructor(r, o, i, s = {}) {
        ;(this.doc = r),
          (this.appId = o),
          (this.nonce = i),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = Di(s)),
          this.resetHostNodes()
      }
      addStyles(r) {
        for (let o of r)
          this.changeUsageCount(o, 1) === 1 && this.onStyleAdded(o)
      }
      removeStyles(r) {
        for (let o of r)
          this.changeUsageCount(o, -1) <= 0 && this.onStyleRemoved(o)
      }
      ngOnDestroy() {
        let r = this.styleNodesInDOM
        r && (r.forEach((o) => o.remove()), r.clear())
        for (let o of this.getAllStyles()) this.onStyleRemoved(o)
        this.resetHostNodes()
      }
      addHost(r) {
        this.hostNodes.add(r)
        for (let o of this.getAllStyles()) this.addStyleToHost(r, o)
      }
      removeHost(r) {
        this.hostNodes.delete(r)
      }
      getAllStyles() {
        return this.styleRef.keys()
      }
      onStyleAdded(r) {
        for (let o of this.hostNodes) this.addStyleToHost(o, r)
      }
      onStyleRemoved(r) {
        let o = this.styleRef
        o.get(r)?.elements?.forEach((i) => i.remove()), o.delete(r)
      }
      collectServerRenderedStyles() {
        let r = this.doc.head?.querySelectorAll(`style[${pu}="${this.appId}"]`)
        if (r?.length) {
          let o = new Map()
          return (
            r.forEach((i) => {
              i.textContent != null && o.set(i.textContent, i)
            }),
            o
          )
        }
        return null
      }
      changeUsageCount(r, o) {
        let i = this.styleRef
        if (i.has(r)) {
          let s = i.get(r)
          return (s.usage += o), s.usage
        }
        return i.set(r, { usage: o, elements: [] }), o
      }
      getStyleElement(r, o) {
        let i = this.styleNodesInDOM,
          s = i?.get(o)
        if (s?.parentNode === r) return i.delete(o), s.removeAttribute(pu), s
        {
          let a = this.doc.createElement('style')
          return (
            this.nonce && a.setAttribute('nonce', this.nonce),
            (a.textContent = o),
            this.platformIsServer && a.setAttribute(pu, this.appId),
            r.appendChild(a),
            a
          )
        }
      }
      addStyleToHost(r, o) {
        let i = this.getStyleElement(r, o),
          s = this.styleRef,
          a = s.get(o)?.elements
        a ? a.push(i) : s.set(o, { elements: [i], usage: 1 })
      }
      resetHostNodes() {
        let r = this.hostNodes
        r.clear(), r.add(this.doc.head)
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)(S(ge), S(Ba), S(za, 8), S(pt))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })(),
  gu = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    math: 'http://www.w3.org/1998/MathML/',
  },
  wu = /%COMP%/g,
  ah = '%COMP%',
  pw = `_nghost-${ah}`,
  gw = `_ngcontent-${ah}`,
  mw = !0,
  vw = new C('', { providedIn: 'root', factory: () => mw })
function yw(e) {
  return gw.replace(wu, e)
}
function Dw(e) {
  return pw.replace(wu, e)
}
function uh(e, t) {
  return t.map((n) => n.replace(wu, e))
}
var nh = (() => {
    let t = class t {
      constructor(r, o, i, s, a, u, c, l = null) {
        ;(this.eventManager = r),
          (this.sharedStylesHost = o),
          (this.appId = i),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = u),
          (this.ngZone = c),
          (this.nonce = l),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = Di(u)),
          (this.defaultRenderer = new br(r, a, c, this.platformIsServer))
      }
      createRenderer(r, o) {
        if (!r || !o) return this.defaultRenderer
        this.platformIsServer &&
          o.encapsulation === Ue.ShadowDom &&
          (o = R(g({}, o), { encapsulation: Ue.Emulated }))
        let i = this.getOrCreateRenderer(r, o)
        return (
          i instanceof _i
            ? i.applyToHost(r)
            : i instanceof Mr && i.applyStyles(),
          i
        )
      }
      getOrCreateRenderer(r, o) {
        let i = this.rendererByCompId,
          s = i.get(o.id)
        if (!s) {
          let a = this.doc,
            u = this.ngZone,
            c = this.eventManager,
            l = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            f = this.platformIsServer
          switch (o.encapsulation) {
            case Ue.Emulated:
              s = new _i(c, l, o, this.appId, d, a, u, f)
              break
            case Ue.ShadowDom:
              return new Du(c, l, r, o, a, u, this.nonce, f)
            default:
              s = new Mr(c, l, o, d, a, u, f)
              break
          }
          i.set(o.id, s)
        }
        return s
      }
      ngOnDestroy() {
        this.rendererByCompId.clear()
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)(S(ih), S(sh), S(Ba), S(vw), S(ge), S(pt), S(q), S(za))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })(),
  br = class {
    constructor(t, n, r, o) {
      ;(this.eventManager = t),
        (this.doc = n),
        (this.ngZone = r),
        (this.platformIsServer = o),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null)
    }
    destroy() {}
    createElement(t, n) {
      return n
        ? this.doc.createElementNS(gu[n] || n, t)
        : this.doc.createElement(t)
    }
    createComment(t) {
      return this.doc.createComment(t)
    }
    createText(t) {
      return this.doc.createTextNode(t)
    }
    appendChild(t, n) {
      ;(rh(t) ? t.content : t).appendChild(n)
    }
    insertBefore(t, n, r) {
      t && (rh(t) ? t.content : t).insertBefore(n, r)
    }
    removeChild(t, n) {
      t && t.removeChild(n)
    }
    selectRootElement(t, n) {
      let r = typeof t == 'string' ? this.doc.querySelector(t) : t
      if (!r) throw new w(-5104, !1)
      return n || (r.textContent = ''), r
    }
    parentNode(t) {
      return t.parentNode
    }
    nextSibling(t) {
      return t.nextSibling
    }
    setAttribute(t, n, r, o) {
      if (o) {
        n = o + ':' + n
        let i = gu[o]
        i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r)
      } else t.setAttribute(n, r)
    }
    removeAttribute(t, n, r) {
      if (r) {
        let o = gu[r]
        o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`)
      } else t.removeAttribute(n)
    }
    addClass(t, n) {
      t.classList.add(n)
    }
    removeClass(t, n) {
      t.classList.remove(n)
    }
    setStyle(t, n, r, o) {
      o & (Je.DashCase | Je.Important)
        ? t.style.setProperty(n, r, o & Je.Important ? 'important' : '')
        : (t.style[n] = r)
    }
    removeStyle(t, n, r) {
      r & Je.DashCase ? t.style.removeProperty(n) : (t.style[n] = '')
    }
    setProperty(t, n, r) {
      t != null && (t[n] = r)
    }
    setValue(t, n) {
      t.nodeValue = n
    }
    listen(t, n, r) {
      if (
        typeof t == 'string' &&
        ((t = nt().getGlobalEventTarget(this.doc, t)), !t)
      )
        throw new Error(`Unsupported event target ${t} for event ${n}`)
      return this.eventManager.addEventListener(
        t,
        n,
        this.decoratePreventDefault(r),
      )
    }
    decoratePreventDefault(t) {
      return (n) => {
        if (n === '__ngUnwrap__') return t
        ;(this.platformIsServer ? this.ngZone.runGuarded(() => t(n)) : t(n)) ===
          !1 && n.preventDefault()
      }
    }
  }
function rh(e) {
  return e.tagName === 'TEMPLATE' && e.content !== void 0
}
var Du = class extends br {
    constructor(t, n, r, o, i, s, a, u) {
      super(t, i, s, u),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: 'open' })),
        this.sharedStylesHost.addHost(this.shadowRoot)
      let c = uh(o.id, o.styles)
      for (let l of c) {
        let d = document.createElement('style')
        a && d.setAttribute('nonce', a),
          (d.textContent = l),
          this.shadowRoot.appendChild(d)
      }
    }
    nodeOrShadowRoot(t) {
      return t === this.hostEl ? this.shadowRoot : t
    }
    appendChild(t, n) {
      return super.appendChild(this.nodeOrShadowRoot(t), n)
    }
    insertBefore(t, n, r) {
      return super.insertBefore(this.nodeOrShadowRoot(t), n, r)
    }
    removeChild(t, n) {
      return super.removeChild(this.nodeOrShadowRoot(t), n)
    }
    parentNode(t) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)))
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot)
    }
  },
  Mr = class extends br {
    constructor(t, n, r, o, i, s, a, u) {
      super(t, i, s, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = o),
        (this.styles = u ? uh(u, r.styles) : r.styles)
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles)
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles)
    }
  },
  _i = class extends Mr {
    constructor(t, n, r, o, i, s, a, u) {
      let c = o + '-' + r.id
      super(t, n, r, i, s, a, u, c),
        (this.contentAttr = yw(c)),
        (this.hostAttr = Dw(c))
    }
    applyToHost(t) {
      this.applyStyles(), this.setAttribute(t, this.hostAttr, '')
    }
    createElement(t, n) {
      let r = super.createElement(t, n)
      return super.setAttribute(r, this.contentAttr, ''), r
    }
  },
  ww = (() => {
    let t = class t extends Mi {
      constructor(r) {
        super(r)
      }
      supports(r) {
        return !0
      }
      addEventListener(r, o, i) {
        return (
          r.addEventListener(o, i, !1), () => this.removeEventListener(r, o, i)
        )
      }
      removeEventListener(r, o, i) {
        return r.removeEventListener(o, i)
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)(S(ge))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })(),
  oh = ['alt', 'control', 'meta', 'shift'],
  Cw = {
    '\b': 'Backspace',
    '	': 'Tab',
    '\x7F': 'Delete',
    '\x1B': 'Escape',
    Del: 'Delete',
    Esc: 'Escape',
    Left: 'ArrowLeft',
    Right: 'ArrowRight',
    Up: 'ArrowUp',
    Down: 'ArrowDown',
    Menu: 'ContextMenu',
    Scroll: 'ScrollLock',
    Win: 'OS',
  },
  Ew = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  Iw = (() => {
    let t = class t extends Mi {
      constructor(r) {
        super(r)
      }
      supports(r) {
        return t.parseEventName(r) != null
      }
      addEventListener(r, o, i) {
        let s = t.parseEventName(o),
          a = t.eventCallback(s.fullKey, i, this.manager.getZone())
        return this.manager
          .getZone()
          .runOutsideAngular(() => nt().onAndCancel(r, s.domEventName, a))
      }
      static parseEventName(r) {
        let o = r.toLowerCase().split('.'),
          i = o.shift()
        if (o.length === 0 || !(i === 'keydown' || i === 'keyup')) return null
        let s = t._normalizeKey(o.pop()),
          a = '',
          u = o.indexOf('code')
        if (
          (u > -1 && (o.splice(u, 1), (a = 'code.')),
          oh.forEach((l) => {
            let d = o.indexOf(l)
            d > -1 && (o.splice(d, 1), (a += l + '.'))
          }),
          (a += s),
          o.length != 0 || s.length === 0)
        )
          return null
        let c = {}
        return (c.domEventName = i), (c.fullKey = a), c
      }
      static matchEventFullKeyCode(r, o) {
        let i = Cw[r.key] || r.key,
          s = ''
        return (
          o.indexOf('code.') > -1 && ((i = r.code), (s = 'code.')),
          i == null || !i
            ? !1
            : ((i = i.toLowerCase()),
              i === ' ' ? (i = 'space') : i === '.' && (i = 'dot'),
              oh.forEach((a) => {
                if (a !== i) {
                  let u = Ew[a]
                  u(r) && (s += a + '.')
                }
              }),
              (s += i),
              s === o)
        )
      }
      static eventCallback(r, o, i) {
        return (s) => {
          t.matchEventFullKeyCode(s, r) && i.runGuarded(() => o(s))
        }
      }
      static _normalizeKey(r) {
        return r === 'esc' ? 'escape' : r
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)(S(ge))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })()
function ch(e, t) {
  return Vf(g({ rootComponent: e }, bw(t)))
}
function bw(e) {
  return {
    appProviders: [...Aw, ...(e?.providers ?? [])],
    platformProviders: Tw,
  }
}
function Mw() {
  vu.makeCurrent()
}
function _w() {
  return new Ke()
}
function Sw() {
  return Gd(document), document
}
var Tw = [
  { provide: pt, useValue: qf },
  { provide: Ha, useValue: Mw, multi: !0 },
  { provide: ge, useFactory: Sw, deps: [] },
]
var Aw = [
  { provide: Xo, useValue: 'root' },
  { provide: Ke, useFactory: _w, deps: [] },
  { provide: yu, useClass: ww, multi: !0, deps: [ge, q, pt] },
  { provide: yu, useClass: Iw, multi: !0, deps: [ge] },
  nh,
  sh,
  ih,
  { provide: cr, useExisting: nh },
  { provide: On, useClass: hw, deps: [] },
  [],
]
var lh = (() => {
  let t = class t {
    constructor(r) {
      this._doc = r
    }
    getTitle() {
      return this._doc.title
    }
    setTitle(r) {
      this._doc.title = r || ''
    }
  }
  ;(t.ɵfac = function (o) {
    return new (o || t)(S(ge))
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
  let e = t
  return e
})()
var T = 'primary',
  Ur = Symbol('RouteTitle'),
  Mu = class {
    constructor(t) {
      this.params = t || {}
    }
    has(t) {
      return Object.prototype.hasOwnProperty.call(this.params, t)
    }
    get(t) {
      if (this.has(t)) {
        let n = this.params[t]
        return Array.isArray(n) ? n[0] : n
      }
      return null
    }
    getAll(t) {
      if (this.has(t)) {
        let n = this.params[t]
        return Array.isArray(n) ? n : [n]
      }
      return []
    }
    get keys() {
      return Object.keys(this.params)
    }
  }
function Un(e) {
  return new Mu(e)
}
function Rw(e, t, n) {
  let r = n.path.split('/')
  if (
    r.length > e.length ||
    (n.pathMatch === 'full' && (t.hasChildren() || r.length < e.length))
  )
    return null
  let o = {}
  for (let i = 0; i < r.length; i++) {
    let s = r[i],
      a = e[i]
    if (s.startsWith(':')) o[s.substring(1)] = a
    else if (s !== a.path) return null
  }
  return { consumed: e.slice(0, r.length), posParams: o }
}
function Ow(e, t) {
  if (e.length !== t.length) return !1
  for (let n = 0; n < e.length; ++n) if (!qe(e[n], t[n])) return !1
  return !0
}
function qe(e, t) {
  let n = e ? _u(e) : void 0,
    r = t ? _u(t) : void 0
  if (!n || !r || n.length != r.length) return !1
  let o
  for (let i = 0; i < n.length; i++)
    if (((o = n[i]), !mh(e[o], t[o]))) return !1
  return !0
}
function _u(e) {
  return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)]
}
function mh(e, t) {
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length) return !1
    let n = [...e].sort(),
      r = [...t].sort()
    return n.every((o, i) => r[i] === o)
  } else return e === t
}
function vh(e) {
  return e.length > 0 ? e[e.length - 1] : null
}
function Ct(e) {
  return hs(e) ? e : Bt(e) ? z(Promise.resolve(e)) : b(e)
}
var Fw = { exact: Dh, subset: wh },
  yh = { exact: Pw, subset: kw, ignored: () => !0 }
function dh(e, t, n) {
  return (
    Fw[n.paths](e.root, t.root, n.matrixParams) &&
    yh[n.queryParams](e.queryParams, t.queryParams) &&
    !(n.fragment === 'exact' && e.fragment !== t.fragment)
  )
}
function Pw(e, t) {
  return qe(e, t)
}
function Dh(e, t, n) {
  if (
    !Wt(e.segments, t.segments) ||
    !Ai(e.segments, t.segments, n) ||
    e.numberOfChildren !== t.numberOfChildren
  )
    return !1
  for (let r in t.children)
    if (!e.children[r] || !Dh(e.children[r], t.children[r], n)) return !1
  return !0
}
function kw(e, t) {
  return (
    Object.keys(t).length <= Object.keys(e).length &&
    Object.keys(t).every((n) => mh(e[n], t[n]))
  )
}
function wh(e, t, n) {
  return Ch(e, t, t.segments, n)
}
function Ch(e, t, n, r) {
  if (e.segments.length > n.length) {
    let o = e.segments.slice(0, n.length)
    return !(!Wt(o, n) || t.hasChildren() || !Ai(o, n, r))
  } else if (e.segments.length === n.length) {
    if (!Wt(e.segments, n) || !Ai(e.segments, n, r)) return !1
    for (let o in t.children)
      if (!e.children[o] || !wh(e.children[o], t.children[o], r)) return !1
    return !0
  } else {
    let o = n.slice(0, e.segments.length),
      i = n.slice(e.segments.length)
    return !Wt(e.segments, o) || !Ai(e.segments, o, r) || !e.children[T]
      ? !1
      : Ch(e.children[T], t, i, r)
  }
}
function Ai(e, t, n) {
  return t.every((r, o) => yh[n](e[o].parameters, r.parameters))
}
var Dt = class {
    constructor(t = new L([], {}), n = {}, r = null) {
      ;(this.root = t), (this.queryParams = n), (this.fragment = r)
    }
    get queryParamMap() {
      return (this._queryParamMap ??= Un(this.queryParams)), this._queryParamMap
    }
    toString() {
      return jw.serialize(this)
    }
  },
  L = class {
    constructor(t, n) {
      ;(this.segments = t),
        (this.children = n),
        (this.parent = null),
        Object.values(n).forEach((r) => (r.parent = this))
    }
    hasChildren() {
      return this.numberOfChildren > 0
    }
    get numberOfChildren() {
      return Object.keys(this.children).length
    }
    toString() {
      return xi(this)
    }
  },
  qt = class {
    constructor(t, n) {
      ;(this.path = t), (this.parameters = n)
    }
    get parameterMap() {
      return (this._parameterMap ??= Un(this.parameters)), this._parameterMap
    }
    toString() {
      return Ih(this)
    }
  }
function Lw(e, t) {
  return Wt(e, t) && e.every((n, r) => qe(n.parameters, t[r].parameters))
}
function Wt(e, t) {
  return e.length !== t.length ? !1 : e.every((n, r) => n.path === t[r].path)
}
function Vw(e, t) {
  let n = []
  return (
    Object.entries(e.children).forEach(([r, o]) => {
      r === T && (n = n.concat(t(o, r)))
    }),
    Object.entries(e.children).forEach(([r, o]) => {
      r !== T && (n = n.concat(t(o, r)))
    }),
    n
  )
}
var Ju = (() => {
    let t = class t {}
    ;(t.ɵfac = function (o) {
      return new (o || t)()
    }),
      (t.ɵprov = D({ token: t, factory: () => new Ri(), providedIn: 'root' }))
    let e = t
    return e
  })(),
  Ri = class {
    parse(t) {
      let n = new Tu(t)
      return new Dt(
        n.parseRootSegment(),
        n.parseQueryParams(),
        n.parseFragment(),
      )
    }
    serialize(t) {
      let n = `/${_r(t.root, !0)}`,
        r = Bw(t.queryParams),
        o = typeof t.fragment == 'string' ? `#${Uw(t.fragment)}` : ''
      return `${n}${r}${o}`
    }
  },
  jw = new Ri()
function xi(e) {
  return e.segments.map((t) => Ih(t)).join('/')
}
function _r(e, t) {
  if (!e.hasChildren()) return xi(e)
  if (t) {
    let n = e.children[T] ? _r(e.children[T], !1) : '',
      r = []
    return (
      Object.entries(e.children).forEach(([o, i]) => {
        o !== T && r.push(`${o}:${_r(i, !1)}`)
      }),
      r.length > 0 ? `${n}(${r.join('//')})` : n
    )
  } else {
    let n = Vw(e, (r, o) =>
      o === T ? [_r(e.children[T], !1)] : [`${o}:${_r(r, !1)}`],
    )
    return Object.keys(e.children).length === 1 && e.children[T] != null
      ? `${xi(e)}/${n[0]}`
      : `${xi(e)}/(${n.join('//')})`
  }
}
function Eh(e) {
  return encodeURIComponent(e)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
}
function Si(e) {
  return Eh(e).replace(/%3B/gi, ';')
}
function Uw(e) {
  return encodeURI(e)
}
function Su(e) {
  return Eh(e).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&')
}
function Ni(e) {
  return decodeURIComponent(e)
}
function fh(e) {
  return Ni(e.replace(/\+/g, '%20'))
}
function Ih(e) {
  return `${Su(e.path)}${$w(e.parameters)}`
}
function $w(e) {
  return Object.entries(e)
    .map(([t, n]) => `;${Su(t)}=${Su(n)}`)
    .join('')
}
function Bw(e) {
  let t = Object.entries(e)
    .map(([n, r]) =>
      Array.isArray(r)
        ? r.map((o) => `${Si(n)}=${Si(o)}`).join('&')
        : `${Si(n)}=${Si(r)}`,
    )
    .filter((n) => n)
  return t.length ? `?${t.join('&')}` : ''
}
var Hw = /^[^\/()?;#]+/
function Cu(e) {
  let t = e.match(Hw)
  return t ? t[0] : ''
}
var zw = /^[^\/()?;=#]+/
function Gw(e) {
  let t = e.match(zw)
  return t ? t[0] : ''
}
var qw = /^[^=?&#]+/
function Ww(e) {
  let t = e.match(qw)
  return t ? t[0] : ''
}
var Zw = /^[^&#]+/
function Yw(e) {
  let t = e.match(Zw)
  return t ? t[0] : ''
}
var Tu = class {
  constructor(t) {
    ;(this.url = t), (this.remaining = t)
  }
  parseRootSegment() {
    return (
      this.consumeOptional('/'),
      this.remaining === '' ||
      this.peekStartsWith('?') ||
      this.peekStartsWith('#')
        ? new L([], {})
        : new L([], this.parseChildren())
    )
  }
  parseQueryParams() {
    let t = {}
    if (this.consumeOptional('?'))
      do this.parseQueryParam(t)
      while (this.consumeOptional('&'))
    return t
  }
  parseFragment() {
    return this.consumeOptional('#') ? decodeURIComponent(this.remaining) : null
  }
  parseChildren() {
    if (this.remaining === '') return {}
    this.consumeOptional('/')
    let t = []
    for (
      this.peekStartsWith('(') || t.push(this.parseSegment());
      this.peekStartsWith('/') &&
      !this.peekStartsWith('//') &&
      !this.peekStartsWith('/(');

    )
      this.capture('/'), t.push(this.parseSegment())
    let n = {}
    this.peekStartsWith('/(') && (this.capture('/'), (n = this.parseParens(!0)))
    let r = {}
    return (
      this.peekStartsWith('(') && (r = this.parseParens(!1)),
      (t.length > 0 || Object.keys(n).length > 0) && (r[T] = new L(t, n)),
      r
    )
  }
  parseSegment() {
    let t = Cu(this.remaining)
    if (t === '' && this.peekStartsWith(';')) throw new w(4009, !1)
    return this.capture(t), new qt(Ni(t), this.parseMatrixParams())
  }
  parseMatrixParams() {
    let t = {}
    for (; this.consumeOptional(';'); ) this.parseParam(t)
    return t
  }
  parseParam(t) {
    let n = Gw(this.remaining)
    if (!n) return
    this.capture(n)
    let r = ''
    if (this.consumeOptional('=')) {
      let o = Cu(this.remaining)
      o && ((r = o), this.capture(r))
    }
    t[Ni(n)] = Ni(r)
  }
  parseQueryParam(t) {
    let n = Ww(this.remaining)
    if (!n) return
    this.capture(n)
    let r = ''
    if (this.consumeOptional('=')) {
      let s = Yw(this.remaining)
      s && ((r = s), this.capture(r))
    }
    let o = fh(n),
      i = fh(r)
    if (t.hasOwnProperty(o)) {
      let s = t[o]
      Array.isArray(s) || ((s = [s]), (t[o] = s)), s.push(i)
    } else t[o] = i
  }
  parseParens(t) {
    let n = {}
    for (
      this.capture('(');
      !this.consumeOptional(')') && this.remaining.length > 0;

    ) {
      let r = Cu(this.remaining),
        o = this.remaining[r.length]
      if (o !== '/' && o !== ')' && o !== ';') throw new w(4010, !1)
      let i
      r.indexOf(':') > -1
        ? ((i = r.slice(0, r.indexOf(':'))), this.capture(i), this.capture(':'))
        : t && (i = T)
      let s = this.parseChildren()
      ;(n[i] = Object.keys(s).length === 1 ? s[T] : new L([], s)),
        this.consumeOptional('//')
    }
    return n
  }
  peekStartsWith(t) {
    return this.remaining.startsWith(t)
  }
  consumeOptional(t) {
    return this.peekStartsWith(t)
      ? ((this.remaining = this.remaining.substring(t.length)), !0)
      : !1
  }
  capture(t) {
    if (!this.consumeOptional(t)) throw new w(4011, !1)
  }
}
function bh(e) {
  return e.segments.length > 0 ? new L([], { [T]: e }) : e
}
function Mh(e) {
  let t = {}
  for (let [r, o] of Object.entries(e.children)) {
    let i = Mh(o)
    if (r === T && i.segments.length === 0 && i.hasChildren())
      for (let [s, a] of Object.entries(i.children)) t[s] = a
    else (i.segments.length > 0 || i.hasChildren()) && (t[r] = i)
  }
  let n = new L(e.segments, t)
  return Qw(n)
}
function Qw(e) {
  if (e.numberOfChildren === 1 && e.children[T]) {
    let t = e.children[T]
    return new L(e.segments.concat(t.segments), t.children)
  }
  return e
}
function $n(e) {
  return e instanceof Dt
}
function Kw(e, t, n = null, r = null) {
  let o = _h(e)
  return Sh(o, t, n, r)
}
function _h(e) {
  let t
  function n(i) {
    let s = {}
    for (let u of i.children) {
      let c = n(u)
      s[u.outlet] = c
    }
    let a = new L(i.url, s)
    return i === e && (t = a), a
  }
  let r = n(e.root),
    o = bh(r)
  return t ?? o
}
function Sh(e, t, n, r) {
  let o = e
  for (; o.parent; ) o = o.parent
  if (t.length === 0) return Eu(o, o, o, n, r)
  let i = Jw(t)
  if (i.toRoot()) return Eu(o, o, new L([], {}), n, r)
  let s = Xw(i, o, e),
    a = s.processChildren
      ? Ar(s.segmentGroup, s.index, i.commands)
      : Ah(s.segmentGroup, s.index, i.commands)
  return Eu(o, s.segmentGroup, a, n, r)
}
function Oi(e) {
  return typeof e == 'object' && e != null && !e.outlets && !e.segmentPath
}
function Rr(e) {
  return typeof e == 'object' && e != null && e.outlets
}
function Eu(e, t, n, r, o) {
  let i = {}
  r &&
    Object.entries(r).forEach(([u, c]) => {
      i[u] = Array.isArray(c) ? c.map((l) => `${l}`) : `${c}`
    })
  let s
  e === t ? (s = n) : (s = Th(e, t, n))
  let a = bh(Mh(s))
  return new Dt(a, i, o)
}
function Th(e, t, n) {
  let r = {}
  return (
    Object.entries(e.children).forEach(([o, i]) => {
      i === t ? (r[o] = n) : (r[o] = Th(i, t, n))
    }),
    new L(e.segments, r)
  )
}
var Fi = class {
  constructor(t, n, r) {
    if (
      ((this.isAbsolute = t),
      (this.numberOfDoubleDots = n),
      (this.commands = r),
      t && r.length > 0 && Oi(r[0]))
    )
      throw new w(4003, !1)
    let o = r.find(Rr)
    if (o && o !== vh(r)) throw new w(4004, !1)
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == '/'
    )
  }
}
function Jw(e) {
  if (typeof e[0] == 'string' && e.length === 1 && e[0] === '/')
    return new Fi(!0, 0, e)
  let t = 0,
    n = !1,
    r = e.reduce((o, i, s) => {
      if (typeof i == 'object' && i != null) {
        if (i.outlets) {
          let a = {}
          return (
            Object.entries(i.outlets).forEach(([u, c]) => {
              a[u] = typeof c == 'string' ? c.split('/') : c
            }),
            [...o, { outlets: a }]
          )
        }
        if (i.segmentPath) return [...o, i.segmentPath]
      }
      return typeof i != 'string'
        ? [...o, i]
        : s === 0
          ? (i.split('/').forEach((a, u) => {
              ;(u == 0 && a === '.') ||
                (u == 0 && a === ''
                  ? (n = !0)
                  : a === '..'
                    ? t++
                    : a != '' && o.push(a))
            }),
            o)
          : [...o, i]
    }, [])
  return new Fi(n, t, r)
}
var Vn = class {
  constructor(t, n, r) {
    ;(this.segmentGroup = t), (this.processChildren = n), (this.index = r)
  }
}
function Xw(e, t, n) {
  if (e.isAbsolute) return new Vn(t, !0, 0)
  if (!n) return new Vn(t, !1, NaN)
  if (n.parent === null) return new Vn(n, !0, 0)
  let r = Oi(e.commands[0]) ? 0 : 1,
    o = n.segments.length - 1 + r
  return eC(n, o, e.numberOfDoubleDots)
}
function eC(e, t, n) {
  let r = e,
    o = t,
    i = n
  for (; i > o; ) {
    if (((i -= o), (r = r.parent), !r)) throw new w(4005, !1)
    o = r.segments.length
  }
  return new Vn(r, !1, o - i)
}
function tC(e) {
  return Rr(e[0]) ? e[0].outlets : { [T]: e }
}
function Ah(e, t, n) {
  if (((e ??= new L([], {})), e.segments.length === 0 && e.hasChildren()))
    return Ar(e, t, n)
  let r = nC(e, t, n),
    o = n.slice(r.commandIndex)
  if (r.match && r.pathIndex < e.segments.length) {
    let i = new L(e.segments.slice(0, r.pathIndex), {})
    return (
      (i.children[T] = new L(e.segments.slice(r.pathIndex), e.children)),
      Ar(i, 0, o)
    )
  } else
    return r.match && o.length === 0
      ? new L(e.segments, {})
      : r.match && !e.hasChildren()
        ? Au(e, t, n)
        : r.match
          ? Ar(e, 0, o)
          : Au(e, t, n)
}
function Ar(e, t, n) {
  if (n.length === 0) return new L(e.segments, {})
  {
    let r = tC(n),
      o = {}
    if (
      Object.keys(r).some((i) => i !== T) &&
      e.children[T] &&
      e.numberOfChildren === 1 &&
      e.children[T].segments.length === 0
    ) {
      let i = Ar(e.children[T], t, n)
      return new L(e.segments, i.children)
    }
    return (
      Object.entries(r).forEach(([i, s]) => {
        typeof s == 'string' && (s = [s]),
          s !== null && (o[i] = Ah(e.children[i], t, s))
      }),
      Object.entries(e.children).forEach(([i, s]) => {
        r[i] === void 0 && (o[i] = s)
      }),
      new L(e.segments, o)
    )
  }
}
function nC(e, t, n) {
  let r = 0,
    o = t,
    i = { match: !1, pathIndex: 0, commandIndex: 0 }
  for (; o < e.segments.length; ) {
    if (r >= n.length) return i
    let s = e.segments[o],
      a = n[r]
    if (Rr(a)) break
    let u = `${a}`,
      c = r < n.length - 1 ? n[r + 1] : null
    if (o > 0 && u === void 0) break
    if (u && c && typeof c == 'object' && c.outlets === void 0) {
      if (!ph(u, c, s)) return i
      r += 2
    } else {
      if (!ph(u, {}, s)) return i
      r++
    }
    o++
  }
  return { match: !0, pathIndex: o, commandIndex: r }
}
function Au(e, t, n) {
  let r = e.segments.slice(0, t),
    o = 0
  for (; o < n.length; ) {
    let i = n[o]
    if (Rr(i)) {
      let u = rC(i.outlets)
      return new L(r, u)
    }
    if (o === 0 && Oi(n[0])) {
      let u = e.segments[t]
      r.push(new qt(u.path, hh(n[0]))), o++
      continue
    }
    let s = Rr(i) ? i.outlets[T] : `${i}`,
      a = o < n.length - 1 ? n[o + 1] : null
    s && a && Oi(a)
      ? (r.push(new qt(s, hh(a))), (o += 2))
      : (r.push(new qt(s, {})), o++)
  }
  return new L(r, {})
}
function rC(e) {
  let t = {}
  return (
    Object.entries(e).forEach(([n, r]) => {
      typeof r == 'string' && (r = [r]),
        r !== null && (t[n] = Au(new L([], {}), 0, r))
    }),
    t
  )
}
function hh(e) {
  let t = {}
  return Object.entries(e).forEach(([n, r]) => (t[n] = `${r}`)), t
}
function ph(e, t, n) {
  return e == n.path && qe(t, n.parameters)
}
var xr = 'imperative',
  te = (function (e) {
    return (
      (e[(e.NavigationStart = 0)] = 'NavigationStart'),
      (e[(e.NavigationEnd = 1)] = 'NavigationEnd'),
      (e[(e.NavigationCancel = 2)] = 'NavigationCancel'),
      (e[(e.NavigationError = 3)] = 'NavigationError'),
      (e[(e.RoutesRecognized = 4)] = 'RoutesRecognized'),
      (e[(e.ResolveStart = 5)] = 'ResolveStart'),
      (e[(e.ResolveEnd = 6)] = 'ResolveEnd'),
      (e[(e.GuardsCheckStart = 7)] = 'GuardsCheckStart'),
      (e[(e.GuardsCheckEnd = 8)] = 'GuardsCheckEnd'),
      (e[(e.RouteConfigLoadStart = 9)] = 'RouteConfigLoadStart'),
      (e[(e.RouteConfigLoadEnd = 10)] = 'RouteConfigLoadEnd'),
      (e[(e.ChildActivationStart = 11)] = 'ChildActivationStart'),
      (e[(e.ChildActivationEnd = 12)] = 'ChildActivationEnd'),
      (e[(e.ActivationStart = 13)] = 'ActivationStart'),
      (e[(e.ActivationEnd = 14)] = 'ActivationEnd'),
      (e[(e.Scroll = 15)] = 'Scroll'),
      (e[(e.NavigationSkipped = 16)] = 'NavigationSkipped'),
      e
    )
  })(te || {}),
  Te = class {
    constructor(t, n) {
      ;(this.id = t), (this.url = n)
    }
  },
  Or = class extends Te {
    constructor(t, n, r = 'imperative', o = null) {
      super(t, n),
        (this.type = te.NavigationStart),
        (this.navigationTrigger = r),
        (this.restoredState = o)
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`
    }
  },
  Zt = class extends Te {
    constructor(t, n, r) {
      super(t, n), (this.urlAfterRedirects = r), (this.type = te.NavigationEnd)
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`
    }
  },
  Ee = (function (e) {
    return (
      (e[(e.Redirect = 0)] = 'Redirect'),
      (e[(e.SupersededByNewNavigation = 1)] = 'SupersededByNewNavigation'),
      (e[(e.NoDataFromResolver = 2)] = 'NoDataFromResolver'),
      (e[(e.GuardRejected = 3)] = 'GuardRejected'),
      e
    )
  })(Ee || {}),
  xu = (function (e) {
    return (
      (e[(e.IgnoredSameUrlNavigation = 0)] = 'IgnoredSameUrlNavigation'),
      (e[(e.IgnoredByUrlHandlingStrategy = 1)] =
        'IgnoredByUrlHandlingStrategy'),
      e
    )
  })(xu || {}),
  wt = class extends Te {
    constructor(t, n, r, o) {
      super(t, n),
        (this.reason = r),
        (this.code = o),
        (this.type = te.NavigationCancel)
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`
    }
  },
  Yt = class extends Te {
    constructor(t, n, r, o) {
      super(t, n),
        (this.reason = r),
        (this.code = o),
        (this.type = te.NavigationSkipped)
    }
  },
  Fr = class extends Te {
    constructor(t, n, r, o) {
      super(t, n),
        (this.error = r),
        (this.target = o),
        (this.type = te.NavigationError)
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`
    }
  },
  Pi = class extends Te {
    constructor(t, n, r, o) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.type = te.RoutesRecognized)
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
  },
  Nu = class extends Te {
    constructor(t, n, r, o) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.type = te.GuardsCheckStart)
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
  },
  Ru = class extends Te {
    constructor(t, n, r, o, i) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.shouldActivate = i),
        (this.type = te.GuardsCheckEnd)
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`
    }
  },
  Ou = class extends Te {
    constructor(t, n, r, o) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.type = te.ResolveStart)
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
  },
  Fu = class extends Te {
    constructor(t, n, r, o) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.type = te.ResolveEnd)
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
  },
  Pu = class {
    constructor(t) {
      ;(this.route = t), (this.type = te.RouteConfigLoadStart)
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`
    }
  },
  ku = class {
    constructor(t) {
      ;(this.route = t), (this.type = te.RouteConfigLoadEnd)
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`
    }
  },
  Lu = class {
    constructor(t) {
      ;(this.snapshot = t), (this.type = te.ChildActivationStart)
    }
    toString() {
      return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`
    }
  },
  Vu = class {
    constructor(t) {
      ;(this.snapshot = t), (this.type = te.ChildActivationEnd)
    }
    toString() {
      return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`
    }
  },
  ju = class {
    constructor(t) {
      ;(this.snapshot = t), (this.type = te.ActivationStart)
    }
    toString() {
      return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`
    }
  },
  Uu = class {
    constructor(t) {
      ;(this.snapshot = t), (this.type = te.ActivationEnd)
    }
    toString() {
      return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`
    }
  }
var Pr = class {},
  kr = class {
    constructor(t) {
      this.url = t
    }
  }
var $u = class {
    constructor() {
      ;(this.outlet = null),
        (this.route = null),
        (this.injector = null),
        (this.children = new $i()),
        (this.attachRef = null)
    }
  },
  $i = (() => {
    let t = class t {
      constructor() {
        this.contexts = new Map()
      }
      onChildOutletCreated(r, o) {
        let i = this.getOrCreateContext(r)
        ;(i.outlet = o), this.contexts.set(r, i)
      }
      onChildOutletDestroyed(r) {
        let o = this.getContext(r)
        o && ((o.outlet = null), (o.attachRef = null))
      }
      onOutletDeactivated() {
        let r = this.contexts
        return (this.contexts = new Map()), r
      }
      onOutletReAttached(r) {
        this.contexts = r
      }
      getOrCreateContext(r) {
        let o = this.getContext(r)
        return o || ((o = new $u()), this.contexts.set(r, o)), o
      }
      getContext(r) {
        return this.contexts.get(r) || null
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)()
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })(),
  ki = class {
    constructor(t) {
      this._root = t
    }
    get root() {
      return this._root.value
    }
    parent(t) {
      let n = this.pathFromRoot(t)
      return n.length > 1 ? n[n.length - 2] : null
    }
    children(t) {
      let n = Bu(t, this._root)
      return n ? n.children.map((r) => r.value) : []
    }
    firstChild(t) {
      let n = Bu(t, this._root)
      return n && n.children.length > 0 ? n.children[0].value : null
    }
    siblings(t) {
      let n = Hu(t, this._root)
      return n.length < 2
        ? []
        : n[n.length - 2].children.map((o) => o.value).filter((o) => o !== t)
    }
    pathFromRoot(t) {
      return Hu(t, this._root).map((n) => n.value)
    }
  }
function Bu(e, t) {
  if (e === t.value) return t
  for (let n of t.children) {
    let r = Bu(e, n)
    if (r) return r
  }
  return null
}
function Hu(e, t) {
  if (e === t.value) return [t]
  for (let n of t.children) {
    let r = Hu(e, n)
    if (r.length) return r.unshift(t), r
  }
  return []
}
var Ce = class {
  constructor(t, n) {
    ;(this.value = t), (this.children = n)
  }
  toString() {
    return `TreeNode(${this.value})`
  }
}
function Ln(e) {
  let t = {}
  return e && e.children.forEach((n) => (t[n.value.outlet] = n)), t
}
var Li = class extends ki {
  constructor(t, n) {
    super(t), (this.snapshot = n), ec(this, t)
  }
  toString() {
    return this.snapshot.toString()
  }
}
function xh(e) {
  let t = oC(e),
    n = new ee([new qt('', {})]),
    r = new ee({}),
    o = new ee({}),
    i = new ee({}),
    s = new ee(''),
    a = new Bn(n, r, i, s, o, T, e, t.root)
  return (a.snapshot = t.root), new Li(new Ce(a, []), t)
}
function oC(e) {
  let t = {},
    n = {},
    r = {},
    o = '',
    i = new Lr([], t, r, o, n, T, e, null, {})
  return new Vi('', new Ce(i, []))
}
var Bn = class {
  constructor(t, n, r, o, i, s, a, u) {
    ;(this.urlSubject = t),
      (this.paramsSubject = n),
      (this.queryParamsSubject = r),
      (this.fragmentSubject = o),
      (this.dataSubject = i),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = u),
      (this.title = this.dataSubject?.pipe(E((c) => c[Ur])) ?? b(void 0)),
      (this.url = t),
      (this.params = n),
      (this.queryParams = r),
      (this.fragment = o),
      (this.data = i)
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig
  }
  get root() {
    return this._routerState.root
  }
  get parent() {
    return this._routerState.parent(this)
  }
  get firstChild() {
    return this._routerState.firstChild(this)
  }
  get children() {
    return this._routerState.children(this)
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this)
  }
  get paramMap() {
    return (
      (this._paramMap ??= this.params.pipe(E((t) => Un(t)))), this._paramMap
    )
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(E((t) => Un(t)))),
      this._queryParamMap
    )
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`
  }
}
function Xu(e, t, n = 'emptyOnly') {
  let r,
    { routeConfig: o } = e
  return (
    t !== null &&
    (n === 'always' ||
      o?.path === '' ||
      (!t.component && !t.routeConfig?.loadComponent))
      ? (r = {
          params: g(g({}, t.params), e.params),
          data: g(g({}, t.data), e.data),
          resolve: g(g(g(g({}, e.data), t.data), o?.data), e._resolvedData),
        })
      : (r = {
          params: g({}, e.params),
          data: g({}, e.data),
          resolve: g(g({}, e.data), e._resolvedData ?? {}),
        }),
    o && Rh(o) && (r.resolve[Ur] = o.title),
    r
  )
}
var Lr = class {
    get title() {
      return this.data?.[Ur]
    }
    constructor(t, n, r, o, i, s, a, u, c) {
      ;(this.url = t),
        (this.params = n),
        (this.queryParams = r),
        (this.fragment = o),
        (this.data = i),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = u),
        (this._resolve = c)
    }
    get root() {
      return this._routerState.root
    }
    get parent() {
      return this._routerState.parent(this)
    }
    get firstChild() {
      return this._routerState.firstChild(this)
    }
    get children() {
      return this._routerState.children(this)
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this)
    }
    get paramMap() {
      return (this._paramMap ??= Un(this.params)), this._paramMap
    }
    get queryParamMap() {
      return (this._queryParamMap ??= Un(this.queryParams)), this._queryParamMap
    }
    toString() {
      let t = this.url.map((r) => r.toString()).join('/'),
        n = this.routeConfig ? this.routeConfig.path : ''
      return `Route(url:'${t}', path:'${n}')`
    }
  },
  Vi = class extends ki {
    constructor(t, n) {
      super(n), (this.url = t), ec(this, n)
    }
    toString() {
      return Nh(this._root)
    }
  }
function ec(e, t) {
  ;(t.value._routerState = e), t.children.forEach((n) => ec(e, n))
}
function Nh(e) {
  let t = e.children.length > 0 ? ` { ${e.children.map(Nh).join(', ')} } ` : ''
  return `${e.value}${t}`
}
function Iu(e) {
  if (e.snapshot) {
    let t = e.snapshot,
      n = e._futureSnapshot
    ;(e.snapshot = n),
      qe(t.queryParams, n.queryParams) ||
        e.queryParamsSubject.next(n.queryParams),
      t.fragment !== n.fragment && e.fragmentSubject.next(n.fragment),
      qe(t.params, n.params) || e.paramsSubject.next(n.params),
      Ow(t.url, n.url) || e.urlSubject.next(n.url),
      qe(t.data, n.data) || e.dataSubject.next(n.data)
  } else
    (e.snapshot = e._futureSnapshot), e.dataSubject.next(e._futureSnapshot.data)
}
function zu(e, t) {
  let n = qe(e.params, t.params) && Lw(e.url, t.url),
    r = !e.parent != !t.parent
  return n && !r && (!e.parent || zu(e.parent, t.parent))
}
function Rh(e) {
  return typeof e.title == 'string' || e.title === null
}
var iC = (() => {
    let t = class t {
      constructor() {
        ;(this.activated = null),
          (this._activatedRoute = null),
          (this.name = T),
          (this.activateEvents = new ue()),
          (this.deactivateEvents = new ue()),
          (this.attachEvents = new ue()),
          (this.detachEvents = new ue()),
          (this.parentContexts = p($i)),
          (this.location = p(li)),
          (this.changeDetector = p(Ht)),
          (this.environmentInjector = p(pe)),
          (this.inputBinder = p(tc, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0)
      }
      get activatedComponentRef() {
        return this.activated
      }
      ngOnChanges(r) {
        if (r.name) {
          let { firstChange: o, previousValue: i } = r.name
          if (o) return
          this.isTrackedInParentContexts(i) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(i)),
            this.initializeOutletWithName()
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this)
      }
      isTrackedInParentContexts(r) {
        return this.parentContexts.getContext(r)?.outlet === this
      }
      ngOnInit() {
        this.initializeOutletWithName()
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return
        let r = this.parentContexts.getContext(this.name)
        r?.route &&
          (r.attachRef
            ? this.attach(r.attachRef, r.route)
            : this.activateWith(r.route, r.injector))
      }
      get isActivated() {
        return !!this.activated
      }
      get component() {
        if (!this.activated) throw new w(4012, !1)
        return this.activated.instance
      }
      get activatedRoute() {
        if (!this.activated) throw new w(4012, !1)
        return this._activatedRoute
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {}
      }
      detach() {
        if (!this.activated) throw new w(4012, !1)
        this.location.detach()
        let r = this.activated
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(r.instance),
          r
        )
      }
      attach(r, o) {
        ;(this.activated = r),
          (this._activatedRoute = o),
          this.location.insert(r.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(r.instance)
      }
      deactivate() {
        if (this.activated) {
          let r = this.component
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(r)
        }
      }
      activateWith(r, o) {
        if (this.isActivated) throw new w(4013, !1)
        this._activatedRoute = r
        let i = this.location,
          a = r.snapshot.component,
          u = this.parentContexts.getOrCreateContext(this.name).children,
          c = new Gu(r, u, i.injector)
        ;(this.activated = i.createComponent(a, {
          index: i.length,
          injector: c,
          environmentInjector: o ?? this.environmentInjector,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance)
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)()
    }),
      (t.ɵdir = He({
        type: t,
        selectors: [['router-outlet']],
        inputs: { name: 'name' },
        outputs: {
          activateEvents: 'activate',
          deactivateEvents: 'deactivate',
          attachEvents: 'attach',
          detachEvents: 'detach',
        },
        exportAs: ['outlet'],
        standalone: !0,
        features: [Mn],
      }))
    let e = t
    return e
  })(),
  Gu = class {
    constructor(t, n, r) {
      ;(this.route = t),
        (this.childContexts = n),
        (this.parent = r),
        (this.__ngOutletInjector = !0)
    }
    get(t, n) {
      return t === Bn
        ? this.route
        : t === $i
          ? this.childContexts
          : this.parent.get(t, n)
    }
  },
  tc = new C('')
function sC(e, t, n) {
  let r = Vr(e, t._root, n ? n._root : void 0)
  return new Li(r, t)
}
function Vr(e, t, n) {
  if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
    let r = n.value
    r._futureSnapshot = t.value
    let o = aC(e, t, n)
    return new Ce(r, o)
  } else {
    if (e.shouldAttach(t.value)) {
      let i = e.retrieve(t.value)
      if (i !== null) {
        let s = i.route
        return (
          (s.value._futureSnapshot = t.value),
          (s.children = t.children.map((a) => Vr(e, a))),
          s
        )
      }
    }
    let r = uC(t.value),
      o = t.children.map((i) => Vr(e, i))
    return new Ce(r, o)
  }
}
function aC(e, t, n) {
  return t.children.map((r) => {
    for (let o of n.children)
      if (e.shouldReuseRoute(r.value, o.value.snapshot)) return Vr(e, r, o)
    return Vr(e, r)
  })
}
function uC(e) {
  return new Bn(
    new ee(e.url),
    new ee(e.params),
    new ee(e.queryParams),
    new ee(e.fragment),
    new ee(e.data),
    e.outlet,
    e.component,
    e,
  )
}
var Oh = 'ngNavigationCancelingError'
function Fh(e, t) {
  let { redirectTo: n, navigationBehaviorOptions: r } = $n(t)
      ? { redirectTo: t, navigationBehaviorOptions: void 0 }
      : t,
    o = Ph(!1, Ee.Redirect)
  return (o.url = n), (o.navigationBehaviorOptions = r), o
}
function Ph(e, t) {
  let n = new Error(`NavigationCancelingError: ${e || ''}`)
  return (n[Oh] = !0), (n.cancellationCode = t), n
}
function cC(e) {
  return kh(e) && $n(e.url)
}
function kh(e) {
  return !!e && e[Oh]
}
var lC = (() => {
  let t = class t {}
  ;(t.ɵfac = function (o) {
    return new (o || t)()
  }),
    (t.ɵcmp = dt({
      type: t,
      selectors: [['ng-component']],
      standalone: !0,
      features: [mt],
      decls: 1,
      vars: 0,
      template: function (o, i) {
        o & 1 && Nn(0, 'router-outlet')
      },
      dependencies: [iC],
      encapsulation: 2,
    }))
  let e = t
  return e
})()
function dC(e, t) {
  return (
    e.providers &&
      !e._injector &&
      (e._injector = ru(e.providers, t, `Route: ${e.path}`)),
    e._injector ?? t
  )
}
function nc(e) {
  let t = e.children && e.children.map(nc),
    n = t ? R(g({}, e), { children: t }) : g({}, e)
  return (
    !n.component &&
      !n.loadComponent &&
      (t || n.loadChildren) &&
      n.outlet &&
      n.outlet !== T &&
      (n.component = lC),
    n
  )
}
function We(e) {
  return e.outlet || T
}
function fC(e, t) {
  let n = e.filter((r) => We(r) === t)
  return n.push(...e.filter((r) => We(r) !== t)), n
}
function $r(e) {
  if (!e) return null
  if (e.routeConfig?._injector) return e.routeConfig._injector
  for (let t = e.parent; t; t = t.parent) {
    let n = t.routeConfig
    if (n?._loadedInjector) return n._loadedInjector
    if (n?._injector) return n._injector
  }
  return null
}
var hC = (e, t, n, r) =>
    E(
      (o) => (
        new qu(t, o.targetRouterState, o.currentRouterState, n, r).activate(e),
        o
      ),
    ),
  qu = class {
    constructor(t, n, r, o, i) {
      ;(this.routeReuseStrategy = t),
        (this.futureState = n),
        (this.currState = r),
        (this.forwardEvent = o),
        (this.inputBindingEnabled = i)
    }
    activate(t) {
      let n = this.futureState._root,
        r = this.currState ? this.currState._root : null
      this.deactivateChildRoutes(n, r, t),
        Iu(this.futureState.root),
        this.activateChildRoutes(n, r, t)
    }
    deactivateChildRoutes(t, n, r) {
      let o = Ln(n)
      t.children.forEach((i) => {
        let s = i.value.outlet
        this.deactivateRoutes(i, o[s], r), delete o[s]
      }),
        Object.values(o).forEach((i) => {
          this.deactivateRouteAndItsChildren(i, r)
        })
    }
    deactivateRoutes(t, n, r) {
      let o = t.value,
        i = n ? n.value : null
      if (o === i)
        if (o.component) {
          let s = r.getContext(o.outlet)
          s && this.deactivateChildRoutes(t, n, s.children)
        } else this.deactivateChildRoutes(t, n, r)
      else i && this.deactivateRouteAndItsChildren(n, r)
    }
    deactivateRouteAndItsChildren(t, n) {
      t.value.component &&
      this.routeReuseStrategy.shouldDetach(t.value.snapshot)
        ? this.detachAndStoreRouteSubtree(t, n)
        : this.deactivateRouteAndOutlet(t, n)
    }
    detachAndStoreRouteSubtree(t, n) {
      let r = n.getContext(t.value.outlet),
        o = r && t.value.component ? r.children : n,
        i = Ln(t)
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o)
      if (r && r.outlet) {
        let s = r.outlet.detach(),
          a = r.children.onOutletDeactivated()
        this.routeReuseStrategy.store(t.value.snapshot, {
          componentRef: s,
          route: t,
          contexts: a,
        })
      }
    }
    deactivateRouteAndOutlet(t, n) {
      let r = n.getContext(t.value.outlet),
        o = r && t.value.component ? r.children : n,
        i = Ln(t)
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o)
      r &&
        (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
        (r.attachRef = null),
        (r.route = null))
    }
    activateChildRoutes(t, n, r) {
      let o = Ln(n)
      t.children.forEach((i) => {
        this.activateRoutes(i, o[i.value.outlet], r),
          this.forwardEvent(new Uu(i.value.snapshot))
      }),
        t.children.length && this.forwardEvent(new Vu(t.value.snapshot))
    }
    activateRoutes(t, n, r) {
      let o = t.value,
        i = n ? n.value : null
      if ((Iu(o), o === i))
        if (o.component) {
          let s = r.getOrCreateContext(o.outlet)
          this.activateChildRoutes(t, n, s.children)
        } else this.activateChildRoutes(t, n, r)
      else if (o.component) {
        let s = r.getOrCreateContext(o.outlet)
        if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(o.snapshot)
          this.routeReuseStrategy.store(o.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            Iu(a.route.value),
            this.activateChildRoutes(t, null, s.children)
        } else {
          let a = $r(o.snapshot)
          ;(s.attachRef = null),
            (s.route = o),
            (s.injector = a),
            s.outlet && s.outlet.activateWith(o, s.injector),
            this.activateChildRoutes(t, null, s.children)
        }
      } else this.activateChildRoutes(t, null, r)
    }
  },
  ji = class {
    constructor(t) {
      ;(this.path = t), (this.route = this.path[this.path.length - 1])
    }
  },
  jn = class {
    constructor(t, n) {
      ;(this.component = t), (this.route = n)
    }
  }
function pC(e, t, n) {
  let r = e._root,
    o = t ? t._root : null
  return Sr(r, o, n, [r.value])
}
function gC(e) {
  let t = e.routeConfig ? e.routeConfig.canActivateChild : null
  return !t || t.length === 0 ? null : { node: e, guards: t }
}
function zn(e, t) {
  let n = Symbol(),
    r = t.get(e, n)
  return r === n ? (typeof e == 'function' && !Vl(e) ? e : t.get(e)) : r
}
function Sr(
  e,
  t,
  n,
  r,
  o = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let i = Ln(t)
  return (
    e.children.forEach((s) => {
      mC(s, i[s.value.outlet], n, r.concat([s.value]), o),
        delete i[s.value.outlet]
    }),
    Object.entries(i).forEach(([s, a]) => Nr(a, n.getContext(s), o)),
    o
  )
}
function mC(
  e,
  t,
  n,
  r,
  o = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let i = e.value,
    s = t ? t.value : null,
    a = n ? n.getContext(e.value.outlet) : null
  if (s && i.routeConfig === s.routeConfig) {
    let u = vC(s, i, i.routeConfig.runGuardsAndResolvers)
    u
      ? o.canActivateChecks.push(new ji(r))
      : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
      i.component ? Sr(e, t, a ? a.children : null, r, o) : Sr(e, t, n, r, o),
      u &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        o.canDeactivateChecks.push(new jn(a.outlet.component, s))
  } else
    s && Nr(t, a, o),
      o.canActivateChecks.push(new ji(r)),
      i.component
        ? Sr(e, null, a ? a.children : null, r, o)
        : Sr(e, null, n, r, o)
  return o
}
function vC(e, t, n) {
  if (typeof n == 'function') return n(e, t)
  switch (n) {
    case 'pathParamsChange':
      return !Wt(e.url, t.url)
    case 'pathParamsOrQueryParamsChange':
      return !Wt(e.url, t.url) || !qe(e.queryParams, t.queryParams)
    case 'always':
      return !0
    case 'paramsOrQueryParamsChange':
      return !zu(e, t) || !qe(e.queryParams, t.queryParams)
    case 'paramsChange':
    default:
      return !zu(e, t)
  }
}
function Nr(e, t, n) {
  let r = Ln(e),
    o = e.value
  Object.entries(r).forEach(([i, s]) => {
    o.component
      ? t
        ? Nr(s, t.children.getContext(i), n)
        : Nr(s, null, n)
      : Nr(s, t, n)
  }),
    o.component
      ? t && t.outlet && t.outlet.isActivated
        ? n.canDeactivateChecks.push(new jn(t.outlet.component, o))
        : n.canDeactivateChecks.push(new jn(null, o))
      : n.canDeactivateChecks.push(new jn(null, o))
}
function Br(e) {
  return typeof e == 'function'
}
function yC(e) {
  return typeof e == 'boolean'
}
function DC(e) {
  return e && Br(e.canLoad)
}
function wC(e) {
  return e && Br(e.canActivate)
}
function CC(e) {
  return e && Br(e.canActivateChild)
}
function EC(e) {
  return e && Br(e.canDeactivate)
}
function IC(e) {
  return e && Br(e.canMatch)
}
function Lh(e) {
  return e instanceof Ye || e?.name === 'EmptyError'
}
var Ti = Symbol('INITIAL_VALUE')
function Hn() {
  return we((e) =>
    Co(e.map((t) => t.pipe(Qe(1), Ds(Ti)))).pipe(
      E((t) => {
        for (let n of t)
          if (n !== !0) {
            if (n === Ti) return Ti
            if (n === !1 || n instanceof Dt) return n
          }
        return !0
      }),
      De((t) => t !== Ti),
      Qe(1),
    ),
  )
}
function bC(e, t) {
  return Y((n) => {
    let {
      targetSnapshot: r,
      currentSnapshot: o,
      guards: { canActivateChecks: i, canDeactivateChecks: s },
    } = n
    return s.length === 0 && i.length === 0
      ? b(R(g({}, n), { guardsResult: !0 }))
      : MC(s, r, o, e).pipe(
          Y((a) => (a && yC(a) ? _C(r, i, e, t) : b(a))),
          E((a) => R(g({}, n), { guardsResult: a })),
        )
  })
}
function MC(e, t, n, r) {
  return z(e).pipe(
    Y((o) => NC(o.component, o.route, n, t, r)),
    Le((o) => o !== !0, !0),
  )
}
function _C(e, t, n, r) {
  return z(t).pipe(
    it((o) =>
      sn(
        TC(o.route.parent, r),
        SC(o.route, r),
        xC(e, o.path, n),
        AC(e, o.route, n),
      ),
    ),
    Le((o) => o !== !0, !0),
  )
}
function SC(e, t) {
  return e !== null && t && t(new ju(e)), b(!0)
}
function TC(e, t) {
  return e !== null && t && t(new Lu(e)), b(!0)
}
function AC(e, t, n) {
  let r = t.routeConfig ? t.routeConfig.canActivate : null
  if (!r || r.length === 0) return b(!0)
  let o = r.map((i) =>
    Eo(() => {
      let s = $r(t) ?? n,
        a = zn(i, s),
        u = wC(a) ? a.canActivate(t, e) : Xe(s, () => a(t, e))
      return Ct(u).pipe(Le())
    }),
  )
  return b(o).pipe(Hn())
}
function xC(e, t, n) {
  let r = t[t.length - 1],
    i = t
      .slice(0, t.length - 1)
      .reverse()
      .map((s) => gC(s))
      .filter((s) => s !== null)
      .map((s) =>
        Eo(() => {
          let a = s.guards.map((u) => {
            let c = $r(s.node) ?? n,
              l = zn(u, c),
              d = CC(l) ? l.canActivateChild(r, e) : Xe(c, () => l(r, e))
            return Ct(d).pipe(Le())
          })
          return b(a).pipe(Hn())
        }),
      )
  return b(i).pipe(Hn())
}
function NC(e, t, n, r, o) {
  let i = t && t.routeConfig ? t.routeConfig.canDeactivate : null
  if (!i || i.length === 0) return b(!0)
  let s = i.map((a) => {
    let u = $r(t) ?? o,
      c = zn(a, u),
      l = EC(c) ? c.canDeactivate(e, t, n, r) : Xe(u, () => c(e, t, n, r))
    return Ct(l).pipe(Le())
  })
  return b(s).pipe(Hn())
}
function RC(e, t, n, r) {
  let o = t.canLoad
  if (o === void 0 || o.length === 0) return b(!0)
  let i = o.map((s) => {
    let a = zn(s, e),
      u = DC(a) ? a.canLoad(t, n) : Xe(e, () => a(t, n))
    return Ct(u)
  })
  return b(i).pipe(Hn(), Vh(r))
}
function Vh(e) {
  return cs(
    G((t) => {
      if ($n(t)) throw Fh(e, t)
    }),
    E((t) => t === !0),
  )
}
function OC(e, t, n, r) {
  let o = t.canMatch
  if (!o || o.length === 0) return b(!0)
  let i = o.map((s) => {
    let a = zn(s, e),
      u = IC(a) ? a.canMatch(t, n) : Xe(e, () => a(t, n))
    return Ct(u)
  })
  return b(i).pipe(Hn(), Vh(r))
}
var jr = class {
    constructor(t) {
      this.segmentGroup = t || null
    }
  },
  Ui = class extends Error {
    constructor(t) {
      super(), (this.urlTree = t)
    }
  }
function kn(e) {
  return on(new jr(e))
}
function FC(e) {
  return on(new w(4e3, !1))
}
function PC(e) {
  return on(Ph(!1, Ee.GuardRejected))
}
var Wu = class {
    constructor(t, n) {
      ;(this.urlSerializer = t), (this.urlTree = n)
    }
    lineralizeSegments(t, n) {
      let r = [],
        o = n.root
      for (;;) {
        if (((r = r.concat(o.segments)), o.numberOfChildren === 0)) return b(r)
        if (o.numberOfChildren > 1 || !o.children[T]) return FC(t.redirectTo)
        o = o.children[T]
      }
    }
    applyRedirectCommands(t, n, r) {
      let o = this.applyRedirectCreateUrlTree(
        n,
        this.urlSerializer.parse(n),
        t,
        r,
      )
      if (n.startsWith('/')) throw new Ui(o)
      return o
    }
    applyRedirectCreateUrlTree(t, n, r, o) {
      let i = this.createSegmentGroup(t, n.root, r, o)
      return new Dt(
        i,
        this.createQueryParams(n.queryParams, this.urlTree.queryParams),
        n.fragment,
      )
    }
    createQueryParams(t, n) {
      let r = {}
      return (
        Object.entries(t).forEach(([o, i]) => {
          if (typeof i == 'string' && i.startsWith(':')) {
            let a = i.substring(1)
            r[o] = n[a]
          } else r[o] = i
        }),
        r
      )
    }
    createSegmentGroup(t, n, r, o) {
      let i = this.createSegments(t, n.segments, r, o),
        s = {}
      return (
        Object.entries(n.children).forEach(([a, u]) => {
          s[a] = this.createSegmentGroup(t, u, r, o)
        }),
        new L(i, s)
      )
    }
    createSegments(t, n, r, o) {
      return n.map((i) =>
        i.path.startsWith(':')
          ? this.findPosParam(t, i, o)
          : this.findOrReturn(i, r),
      )
    }
    findPosParam(t, n, r) {
      let o = r[n.path.substring(1)]
      if (!o) throw new w(4001, !1)
      return o
    }
    findOrReturn(t, n) {
      let r = 0
      for (let o of n) {
        if (o.path === t.path) return n.splice(r), o
        r++
      }
      return t
    }
  },
  Zu = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  }
function kC(e, t, n, r, o) {
  let i = rc(e, t, n)
  return i.matched
    ? ((r = dC(t, r)),
      OC(r, t, n, o).pipe(E((s) => (s === !0 ? i : g({}, Zu)))))
    : b(i)
}
function rc(e, t, n) {
  if (t.path === '**') return LC(n)
  if (t.path === '')
    return t.pathMatch === 'full' && (e.hasChildren() || n.length > 0)
      ? g({}, Zu)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: n,
          parameters: {},
          positionalParamSegments: {},
        }
  let o = (t.matcher || Rw)(n, e, t)
  if (!o) return g({}, Zu)
  let i = {}
  Object.entries(o.posParams ?? {}).forEach(([a, u]) => {
    i[a] = u.path
  })
  let s =
    o.consumed.length > 0
      ? g(g({}, i), o.consumed[o.consumed.length - 1].parameters)
      : i
  return {
    matched: !0,
    consumedSegments: o.consumed,
    remainingSegments: n.slice(o.consumed.length),
    parameters: s,
    positionalParamSegments: o.posParams ?? {},
  }
}
function LC(e) {
  return {
    matched: !0,
    parameters: e.length > 0 ? vh(e).parameters : {},
    consumedSegments: e,
    remainingSegments: [],
    positionalParamSegments: {},
  }
}
function gh(e, t, n, r) {
  return n.length > 0 && UC(e, n, r)
    ? {
        segmentGroup: new L(t, jC(r, new L(n, e.children))),
        slicedSegments: [],
      }
    : n.length === 0 && $C(e, n, r)
      ? {
          segmentGroup: new L(e.segments, VC(e, n, r, e.children)),
          slicedSegments: n,
        }
      : { segmentGroup: new L(e.segments, e.children), slicedSegments: n }
}
function VC(e, t, n, r) {
  let o = {}
  for (let i of n)
    if (Bi(e, t, i) && !r[We(i)]) {
      let s = new L([], {})
      o[We(i)] = s
    }
  return g(g({}, r), o)
}
function jC(e, t) {
  let n = {}
  n[T] = t
  for (let r of e)
    if (r.path === '' && We(r) !== T) {
      let o = new L([], {})
      n[We(r)] = o
    }
  return n
}
function UC(e, t, n) {
  return n.some((r) => Bi(e, t, r) && We(r) !== T)
}
function $C(e, t, n) {
  return n.some((r) => Bi(e, t, r))
}
function Bi(e, t, n) {
  return (e.hasChildren() || t.length > 0) && n.pathMatch === 'full'
    ? !1
    : n.path === ''
}
function BC(e, t, n, r) {
  return We(e) !== r && (r === T || !Bi(t, n, e)) ? !1 : rc(t, e, n).matched
}
function HC(e, t, n) {
  return t.length === 0 && !e.children[n]
}
var Yu = class {}
function zC(e, t, n, r, o, i, s = 'emptyOnly') {
  return new Qu(e, t, n, r, o, s, i).recognize()
}
var GC = 31,
  Qu = class {
    constructor(t, n, r, o, i, s, a) {
      ;(this.injector = t),
        (this.configLoader = n),
        (this.rootComponentType = r),
        (this.config = o),
        (this.urlTree = i),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new Wu(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0)
    }
    noMatchError(t) {
      return new w(4002, `'${t.segmentGroup}'`)
    }
    recognize() {
      let t = gh(this.urlTree.root, [], [], this.config).segmentGroup
      return this.match(t).pipe(
        E((n) => {
          let r = new Lr(
              [],
              Object.freeze({}),
              Object.freeze(g({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              T,
              this.rootComponentType,
              null,
              {},
            ),
            o = new Ce(r, n),
            i = new Vi('', o),
            s = Kw(r, [], this.urlTree.queryParams, this.urlTree.fragment)
          return (
            (s.queryParams = this.urlTree.queryParams),
            (i.url = this.urlSerializer.serialize(s)),
            this.inheritParamsAndData(i._root, null),
            { state: i, tree: s }
          )
        }),
      )
    }
    match(t) {
      return this.processSegmentGroup(this.injector, this.config, t, T).pipe(
        fe((r) => {
          if (r instanceof Ui)
            return (this.urlTree = r.urlTree), this.match(r.urlTree.root)
          throw r instanceof jr ? this.noMatchError(r) : r
        }),
      )
    }
    inheritParamsAndData(t, n) {
      let r = t.value,
        o = Xu(r, n, this.paramsInheritanceStrategy)
      ;(r.params = Object.freeze(o.params)),
        (r.data = Object.freeze(o.data)),
        t.children.forEach((i) => this.inheritParamsAndData(i, r))
    }
    processSegmentGroup(t, n, r, o) {
      return r.segments.length === 0 && r.hasChildren()
        ? this.processChildren(t, n, r)
        : this.processSegment(t, n, r, r.segments, o, !0).pipe(
            E((i) => (i instanceof Ce ? [i] : [])),
          )
    }
    processChildren(t, n, r) {
      let o = []
      for (let i of Object.keys(r.children))
        i === 'primary' ? o.unshift(i) : o.push(i)
      return z(o).pipe(
        it((i) => {
          let s = r.children[i],
            a = fC(n, i)
          return this.processSegmentGroup(t, a, s, i)
        }),
        ys((i, s) => (i.push(...s), i)),
        st(null),
        vs(),
        Y((i) => {
          if (i === null) return kn(r)
          let s = jh(i)
          return qC(s), b(s)
        }),
      )
    }
    processSegment(t, n, r, o, i, s) {
      return z(n).pipe(
        it((a) =>
          this.processSegmentAgainstRoute(
            a._injector ?? t,
            n,
            a,
            r,
            o,
            i,
            s,
          ).pipe(
            fe((u) => {
              if (u instanceof jr) return b(null)
              throw u
            }),
          ),
        ),
        Le((a) => !!a),
        fe((a) => {
          if (Lh(a)) return HC(r, o, i) ? b(new Yu()) : kn(r)
          throw a
        }),
      )
    }
    processSegmentAgainstRoute(t, n, r, o, i, s, a) {
      return BC(r, o, i, s)
        ? r.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(t, o, r, i, s)
          : this.allowRedirects && a
            ? this.expandSegmentAgainstRouteUsingRedirect(t, o, n, r, i, s)
            : kn(o)
        : kn(o)
    }
    expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s) {
      let {
        matched: a,
        consumedSegments: u,
        positionalParamSegments: c,
        remainingSegments: l,
      } = rc(n, o, i)
      if (!a) return kn(n)
      o.redirectTo.startsWith('/') &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > GC && (this.allowRedirects = !1))
      let d = this.applyRedirects.applyRedirectCommands(u, o.redirectTo, c)
      return this.applyRedirects
        .lineralizeSegments(o, d)
        .pipe(Y((f) => this.processSegment(t, r, n, f.concat(l), s, !1)))
    }
    matchSegmentAgainstRoute(t, n, r, o, i) {
      let s = kC(n, r, o, t, this.urlSerializer)
      return (
        r.path === '**' && (n.children = {}),
        s.pipe(
          we((a) =>
            a.matched
              ? ((t = r._injector ?? t),
                this.getChildConfig(t, r, o).pipe(
                  we(({ routes: u }) => {
                    let c = r._loadedInjector ?? t,
                      {
                        consumedSegments: l,
                        remainingSegments: d,
                        parameters: f,
                      } = a,
                      h = new Lr(
                        l,
                        f,
                        Object.freeze(g({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        ZC(r),
                        We(r),
                        r.component ?? r._loadedComponent ?? null,
                        r,
                        YC(r),
                      ),
                      { segmentGroup: m, slicedSegments: M } = gh(n, l, d, u)
                    if (M.length === 0 && m.hasChildren())
                      return this.processChildren(c, u, m).pipe(
                        E((v) => (v === null ? null : new Ce(h, v))),
                      )
                    if (u.length === 0 && M.length === 0)
                      return b(new Ce(h, []))
                    let y = We(r) === i
                    return this.processSegment(c, u, m, M, y ? T : i, !0).pipe(
                      E((v) => new Ce(h, v instanceof Ce ? [v] : [])),
                    )
                  }),
                ))
              : kn(n),
          ),
        )
      )
    }
    getChildConfig(t, n, r) {
      return n.children
        ? b({ routes: n.children, injector: t })
        : n.loadChildren
          ? n._loadedRoutes !== void 0
            ? b({ routes: n._loadedRoutes, injector: n._loadedInjector })
            : RC(t, n, r, this.urlSerializer).pipe(
                Y((o) =>
                  o
                    ? this.configLoader.loadChildren(t, n).pipe(
                        G((i) => {
                          ;(n._loadedRoutes = i.routes),
                            (n._loadedInjector = i.injector)
                        }),
                      )
                    : PC(n),
                ),
              )
          : b({ routes: [], injector: t })
    }
  }
function qC(e) {
  e.sort((t, n) =>
    t.value.outlet === T
      ? -1
      : n.value.outlet === T
        ? 1
        : t.value.outlet.localeCompare(n.value.outlet),
  )
}
function WC(e) {
  let t = e.value.routeConfig
  return t && t.path === ''
}
function jh(e) {
  let t = [],
    n = new Set()
  for (let r of e) {
    if (!WC(r)) {
      t.push(r)
      continue
    }
    let o = t.find((i) => r.value.routeConfig === i.value.routeConfig)
    o !== void 0 ? (o.children.push(...r.children), n.add(o)) : t.push(r)
  }
  for (let r of n) {
    let o = jh(r.children)
    t.push(new Ce(r.value, o))
  }
  return t.filter((r) => !n.has(r))
}
function ZC(e) {
  return e.data || {}
}
function YC(e) {
  return e.resolve || {}
}
function QC(e, t, n, r, o, i) {
  return Y((s) =>
    zC(e, t, n, r, s.extractedUrl, o, i).pipe(
      E(({ state: a, tree: u }) =>
        R(g({}, s), { targetSnapshot: a, urlAfterRedirects: u }),
      ),
    ),
  )
}
function KC(e, t) {
  return Y((n) => {
    let {
      targetSnapshot: r,
      guards: { canActivateChecks: o },
    } = n
    if (!o.length) return b(n)
    let i = new Set(o.map((u) => u.route)),
      s = new Set()
    for (let u of i) if (!s.has(u)) for (let c of Uh(u)) s.add(c)
    let a = 0
    return z(s).pipe(
      it((u) =>
        i.has(u)
          ? JC(u, r, e, t)
          : ((u.data = Xu(u, u.parent, e).resolve), b(void 0)),
      ),
      G(() => a++),
      an(1),
      Y((u) => (a === s.size ? b(n) : ye)),
    )
  })
}
function Uh(e) {
  let t = e.children.map((n) => Uh(n)).flat()
  return [e, ...t]
}
function JC(e, t, n, r) {
  let o = e.routeConfig,
    i = e._resolve
  return (
    o?.title !== void 0 && !Rh(o) && (i[Ur] = o.title),
    XC(i, e, t, r).pipe(
      E(
        (s) => (
          (e._resolvedData = s), (e.data = Xu(e, e.parent, n).resolve), null
        ),
      ),
    )
  )
}
function XC(e, t, n, r) {
  let o = _u(e)
  if (o.length === 0) return b({})
  let i = {}
  return z(o).pipe(
    Y((s) =>
      eE(e[s], t, n, r).pipe(
        Le(),
        G((a) => {
          i[s] = a
        }),
      ),
    ),
    an(1),
    ms(i),
    fe((s) => (Lh(s) ? ye : on(s))),
  )
}
function eE(e, t, n, r) {
  let o = $r(t) ?? r,
    i = zn(e, o),
    s = i.resolve ? i.resolve(t, n) : Xe(o, () => i(t, n))
  return Ct(s)
}
function bu(e) {
  return we((t) => {
    let n = e(t)
    return n ? z(n).pipe(E(() => t)) : b(t)
  })
}
var $h = (() => {
    let t = class t {
      buildTitle(r) {
        let o,
          i = r.root
        for (; i !== void 0; )
          (o = this.getResolvedTitleForRoute(i) ?? o),
            (i = i.children.find((s) => s.outlet === T))
        return o
      }
      getResolvedTitleForRoute(r) {
        return r.data[Ur]
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)()
    }),
      (t.ɵprov = D({ token: t, factory: () => p(tE), providedIn: 'root' }))
    let e = t
    return e
  })(),
  tE = (() => {
    let t = class t extends $h {
      constructor(r) {
        super(), (this.title = r)
      }
      updateTitle(r) {
        let o = this.buildTitle(r)
        o !== void 0 && this.title.setTitle(o)
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)(S(lh))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })(),
  oc = new C('', { providedIn: 'root', factory: () => ({}) }),
  ic = new C(''),
  nE = (() => {
    let t = class t {
      constructor() {
        ;(this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = p(su))
      }
      loadComponent(r) {
        if (this.componentLoaders.get(r)) return this.componentLoaders.get(r)
        if (r._loadedComponent) return b(r._loadedComponent)
        this.onLoadStartListener && this.onLoadStartListener(r)
        let o = Ct(r.loadComponent()).pipe(
            E(Bh),
            G((s) => {
              this.onLoadEndListener && this.onLoadEndListener(r),
                (r._loadedComponent = s)
            }),
            Mt(() => {
              this.componentLoaders.delete(r)
            }),
          ),
          i = new rn(o, () => new se()).pipe(nn())
        return this.componentLoaders.set(r, i), i
      }
      loadChildren(r, o) {
        if (this.childrenLoaders.get(o)) return this.childrenLoaders.get(o)
        if (o._loadedRoutes)
          return b({ routes: o._loadedRoutes, injector: o._loadedInjector })
        this.onLoadStartListener && this.onLoadStartListener(o)
        let s = rE(o, this.compiler, r, this.onLoadEndListener).pipe(
            Mt(() => {
              this.childrenLoaders.delete(o)
            }),
          ),
          a = new rn(s, () => new se()).pipe(nn())
        return this.childrenLoaders.set(o, a), a
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)()
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })()
function rE(e, t, n, r) {
  return Ct(e.loadChildren()).pipe(
    E(Bh),
    Y((o) =>
      o instanceof dr || Array.isArray(o) ? b(o) : z(t.compileModuleAsync(o)),
    ),
    E((o) => {
      r && r(e)
      let i,
        s,
        a = !1
      return (
        Array.isArray(o)
          ? ((s = o), (a = !0))
          : ((i = o.create(n).injector),
            (s = i.get(ic, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(nc), injector: i }
      )
    }),
  )
}
function oE(e) {
  return e && typeof e == 'object' && 'default' in e
}
function Bh(e) {
  return oE(e) ? e.default : e
}
var sc = (() => {
    let t = class t {}
    ;(t.ɵfac = function (o) {
      return new (o || t)()
    }),
      (t.ɵprov = D({ token: t, factory: () => p(iE), providedIn: 'root' }))
    let e = t
    return e
  })(),
  iE = (() => {
    let t = class t {
      shouldProcessUrl(r) {
        return !0
      }
      extract(r) {
        return r
      }
      merge(r, o) {
        return r
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)()
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })(),
  sE = new C('')
var aE = (() => {
  let t = class t {
    get hasRequestedNavigation() {
      return this.navigationId !== 0
    }
    constructor() {
      ;(this.currentNavigation = null),
        (this.currentTransition = null),
        (this.lastSuccessfulNavigation = null),
        (this.events = new se()),
        (this.transitionAbortSubject = new se()),
        (this.configLoader = p(nE)),
        (this.environmentInjector = p(pe)),
        (this.urlSerializer = p(Ju)),
        (this.rootContexts = p($i)),
        (this.location = p(Dr)),
        (this.inputBindingEnabled = p(tc, { optional: !0 }) !== null),
        (this.titleStrategy = p($h)),
        (this.options = p(oc, { optional: !0 }) || {}),
        (this.paramsInheritanceStrategy =
          this.options.paramsInheritanceStrategy || 'emptyOnly'),
        (this.urlHandlingStrategy = p(sc)),
        (this.createViewTransition = p(sE, { optional: !0 })),
        (this.navigationId = 0),
        (this.afterPreactivation = () => b(void 0)),
        (this.rootComponentType = null)
      let r = (i) => this.events.next(new Pu(i)),
        o = (i) => this.events.next(new ku(i))
      ;(this.configLoader.onLoadEndListener = o),
        (this.configLoader.onLoadStartListener = r)
    }
    complete() {
      this.transitions?.complete()
    }
    handleNavigationRequest(r) {
      let o = ++this.navigationId
      this.transitions?.next(R(g(g({}, this.transitions.value), r), { id: o }))
    }
    setupNavigations(r, o, i) {
      return (
        (this.transitions = new ee({
          id: 0,
          currentUrlTree: o,
          currentRawUrl: o,
          extractedUrl: this.urlHandlingStrategy.extract(o),
          urlAfterRedirects: this.urlHandlingStrategy.extract(o),
          rawUrl: o,
          extras: {},
          resolve: null,
          reject: null,
          promise: Promise.resolve(!0),
          source: xr,
          restoredState: null,
          currentSnapshot: i.snapshot,
          targetSnapshot: null,
          currentRouterState: i,
          targetRouterState: null,
          guards: { canActivateChecks: [], canDeactivateChecks: [] },
          guardsResult: null,
        })),
        this.transitions.pipe(
          De((s) => s.id !== 0),
          E((s) =>
            R(g({}, s), {
              extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl),
            }),
          ),
          we((s) => {
            let a = !1,
              u = !1
            return b(s).pipe(
              we((c) => {
                if (this.navigationId > s.id)
                  return (
                    this.cancelNavigationTransition(
                      s,
                      '',
                      Ee.SupersededByNewNavigation,
                    ),
                    ye
                  )
                ;(this.currentTransition = s),
                  (this.currentNavigation = {
                    id: c.id,
                    initialUrl: c.rawUrl,
                    extractedUrl: c.extractedUrl,
                    trigger: c.source,
                    extras: c.extras,
                    previousNavigation: this.lastSuccessfulNavigation
                      ? R(g({}, this.lastSuccessfulNavigation), {
                          previousNavigation: null,
                        })
                      : null,
                  })
                let l =
                    !r.navigated ||
                    this.isUpdatingInternalState() ||
                    this.isUpdatedBrowserUrl(),
                  d = c.extras.onSameUrlNavigation ?? r.onSameUrlNavigation
                if (!l && d !== 'reload') {
                  let f = ''
                  return (
                    this.events.next(
                      new Yt(
                        c.id,
                        this.urlSerializer.serialize(c.rawUrl),
                        f,
                        xu.IgnoredSameUrlNavigation,
                      ),
                    ),
                    c.resolve(null),
                    ye
                  )
                }
                if (this.urlHandlingStrategy.shouldProcessUrl(c.rawUrl))
                  return b(c).pipe(
                    we((f) => {
                      let h = this.transitions?.getValue()
                      return (
                        this.events.next(
                          new Or(
                            f.id,
                            this.urlSerializer.serialize(f.extractedUrl),
                            f.source,
                            f.restoredState,
                          ),
                        ),
                        h !== this.transitions?.getValue()
                          ? ye
                          : Promise.resolve(f)
                      )
                    }),
                    QC(
                      this.environmentInjector,
                      this.configLoader,
                      this.rootComponentType,
                      r.config,
                      this.urlSerializer,
                      this.paramsInheritanceStrategy,
                    ),
                    G((f) => {
                      ;(s.targetSnapshot = f.targetSnapshot),
                        (s.urlAfterRedirects = f.urlAfterRedirects),
                        (this.currentNavigation = R(
                          g({}, this.currentNavigation),
                          { finalUrl: f.urlAfterRedirects },
                        ))
                      let h = new Pi(
                        f.id,
                        this.urlSerializer.serialize(f.extractedUrl),
                        this.urlSerializer.serialize(f.urlAfterRedirects),
                        f.targetSnapshot,
                      )
                      this.events.next(h)
                    }),
                  )
                if (
                  l &&
                  this.urlHandlingStrategy.shouldProcessUrl(c.currentRawUrl)
                ) {
                  let {
                      id: f,
                      extractedUrl: h,
                      source: m,
                      restoredState: M,
                      extras: y,
                    } = c,
                    v = new Or(f, this.urlSerializer.serialize(h), m, M)
                  this.events.next(v)
                  let ne = xh(this.rootComponentType).snapshot
                  return (
                    (this.currentTransition = s =
                      R(g({}, c), {
                        targetSnapshot: ne,
                        urlAfterRedirects: h,
                        extras: R(g({}, y), {
                          skipLocationChange: !1,
                          replaceUrl: !1,
                        }),
                      })),
                    (this.currentNavigation.finalUrl = h),
                    b(s)
                  )
                } else {
                  let f = ''
                  return (
                    this.events.next(
                      new Yt(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        f,
                        xu.IgnoredByUrlHandlingStrategy,
                      ),
                    ),
                    c.resolve(null),
                    ye
                  )
                }
              }),
              G((c) => {
                let l = new Nu(
                  c.id,
                  this.urlSerializer.serialize(c.extractedUrl),
                  this.urlSerializer.serialize(c.urlAfterRedirects),
                  c.targetSnapshot,
                )
                this.events.next(l)
              }),
              E(
                (c) => (
                  (this.currentTransition = s =
                    R(g({}, c), {
                      guards: pC(
                        c.targetSnapshot,
                        c.currentSnapshot,
                        this.rootContexts,
                      ),
                    })),
                  s
                ),
              ),
              bC(this.environmentInjector, (c) => this.events.next(c)),
              G((c) => {
                if (((s.guardsResult = c.guardsResult), $n(c.guardsResult)))
                  throw Fh(this.urlSerializer, c.guardsResult)
                let l = new Ru(
                  c.id,
                  this.urlSerializer.serialize(c.extractedUrl),
                  this.urlSerializer.serialize(c.urlAfterRedirects),
                  c.targetSnapshot,
                  !!c.guardsResult,
                )
                this.events.next(l)
              }),
              De((c) =>
                c.guardsResult
                  ? !0
                  : (this.cancelNavigationTransition(c, '', Ee.GuardRejected),
                    !1),
              ),
              bu((c) => {
                if (c.guards.canActivateChecks.length)
                  return b(c).pipe(
                    G((l) => {
                      let d = new Ou(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects),
                        l.targetSnapshot,
                      )
                      this.events.next(d)
                    }),
                    we((l) => {
                      let d = !1
                      return b(l).pipe(
                        KC(
                          this.paramsInheritanceStrategy,
                          this.environmentInjector,
                        ),
                        G({
                          next: () => (d = !0),
                          complete: () => {
                            d ||
                              this.cancelNavigationTransition(
                                l,
                                '',
                                Ee.NoDataFromResolver,
                              )
                          },
                        }),
                      )
                    }),
                    G((l) => {
                      let d = new Fu(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects),
                        l.targetSnapshot,
                      )
                      this.events.next(d)
                    }),
                  )
              }),
              bu((c) => {
                let l = (d) => {
                  let f = []
                  d.routeConfig?.loadComponent &&
                    !d.routeConfig._loadedComponent &&
                    f.push(
                      this.configLoader.loadComponent(d.routeConfig).pipe(
                        G((h) => {
                          d.component = h
                        }),
                        E(() => {}),
                      ),
                    )
                  for (let h of d.children) f.push(...l(h))
                  return f
                }
                return Co(l(c.targetSnapshot.root)).pipe(st(null), Qe(1))
              }),
              bu(() => this.afterPreactivation()),
              we(() => {
                let { currentSnapshot: c, targetSnapshot: l } = s,
                  d = this.createViewTransition?.(
                    this.environmentInjector,
                    c.root,
                    l.root,
                  )
                return d ? z(d).pipe(E(() => s)) : b(s)
              }),
              E((c) => {
                let l = sC(
                  r.routeReuseStrategy,
                  c.targetSnapshot,
                  c.currentRouterState,
                )
                return (
                  (this.currentTransition = s =
                    R(g({}, c), { targetRouterState: l })),
                  (this.currentNavigation.targetRouterState = l),
                  s
                )
              }),
              G(() => {
                this.events.next(new Pr())
              }),
              hC(
                this.rootContexts,
                r.routeReuseStrategy,
                (c) => this.events.next(c),
                this.inputBindingEnabled,
              ),
              Qe(1),
              G({
                next: (c) => {
                  ;(a = !0),
                    (this.lastSuccessfulNavigation = this.currentNavigation),
                    this.events.next(
                      new Zt(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        this.urlSerializer.serialize(c.urlAfterRedirects),
                      ),
                    ),
                    this.titleStrategy?.updateTitle(
                      c.targetRouterState.snapshot,
                    ),
                    c.resolve(!0)
                },
                complete: () => {
                  a = !0
                },
              }),
              ws(
                this.transitionAbortSubject.pipe(
                  G((c) => {
                    throw c
                  }),
                ),
              ),
              Mt(() => {
                !a &&
                  !u &&
                  this.cancelNavigationTransition(
                    s,
                    '',
                    Ee.SupersededByNewNavigation,
                  ),
                  this.currentTransition?.id === s.id &&
                    ((this.currentNavigation = null),
                    (this.currentTransition = null))
              }),
              fe((c) => {
                if (((u = !0), kh(c)))
                  this.events.next(
                    new wt(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      c.message,
                      c.cancellationCode,
                    ),
                  ),
                    cC(c) ? this.events.next(new kr(c.url)) : s.resolve(!1)
                else {
                  this.events.next(
                    new Fr(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      c,
                      s.targetSnapshot ?? void 0,
                    ),
                  )
                  try {
                    s.resolve(r.errorHandler(c))
                  } catch (l) {
                    this.options.resolveNavigationPromiseOnError
                      ? s.resolve(!1)
                      : s.reject(l)
                  }
                }
                return ye
              }),
            )
          }),
        )
      )
    }
    cancelNavigationTransition(r, o, i) {
      let s = new wt(r.id, this.urlSerializer.serialize(r.extractedUrl), o, i)
      this.events.next(s), r.resolve(!1)
    }
    isUpdatingInternalState() {
      return (
        this.currentTransition?.extractedUrl.toString() !==
        this.currentTransition?.currentUrlTree.toString()
      )
    }
    isUpdatedBrowserUrl() {
      return (
        this.urlHandlingStrategy
          .extract(this.urlSerializer.parse(this.location.path(!0)))
          .toString() !== this.currentTransition?.extractedUrl.toString() &&
        !this.currentTransition?.extras.skipLocationChange
      )
    }
  }
  ;(t.ɵfac = function (o) {
    return new (o || t)()
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
  let e = t
  return e
})()
function uE(e) {
  return e !== xr
}
var cE = (() => {
    let t = class t {}
    ;(t.ɵfac = function (o) {
      return new (o || t)()
    }),
      (t.ɵprov = D({ token: t, factory: () => p(lE), providedIn: 'root' }))
    let e = t
    return e
  })(),
  Ku = class {
    shouldDetach(t) {
      return !1
    }
    store(t, n) {}
    shouldAttach(t) {
      return !1
    }
    retrieve(t) {
      return null
    }
    shouldReuseRoute(t, n) {
      return t.routeConfig === n.routeConfig
    }
  },
  lE = (() => {
    let t = class t extends Ku {}
    ;(t.ɵfac = (() => {
      let r
      return function (i) {
        return (r || (r = ht(t)))(i || t)
      }
    })()),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })(),
  Hh = (() => {
    let t = class t {}
    ;(t.ɵfac = function (o) {
      return new (o || t)()
    }),
      (t.ɵprov = D({ token: t, factory: () => p(dE), providedIn: 'root' }))
    let e = t
    return e
  })(),
  dE = (() => {
    let t = class t extends Hh {
      constructor() {
        super(...arguments),
          (this.location = p(Dr)),
          (this.urlSerializer = p(Ju)),
          (this.options = p(oc, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || 'replace'),
          (this.urlHandlingStrategy = p(sc)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || 'deferred'),
          (this.currentUrlTree = new Dt()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = xh(null)),
          (this.stateMemento = this.createStateMemento())
      }
      getCurrentUrlTree() {
        return this.currentUrlTree
      }
      getRawUrlTree() {
        return this.rawUrlTree
      }
      restoredState() {
        return this.location.getState()
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== 'computed'
          ? this.currentPageId
          : this.restoredState()?.ɵrouterPageId ?? this.currentPageId
      }
      getRouterState() {
        return this.routerState
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        }
      }
      registerNonRouterCurrentEntryChangeListener(r) {
        return this.location.subscribe((o) => {
          o.type === 'popstate' && r(o.url, o.state)
        })
      }
      handleRouterEvent(r, o) {
        if (r instanceof Or) this.stateMemento = this.createStateMemento()
        else if (r instanceof Yt) this.rawUrlTree = o.initialUrl
        else if (r instanceof Pi) {
          if (
            this.urlUpdateStrategy === 'eager' &&
            !o.extras.skipLocationChange
          ) {
            let i = this.urlHandlingStrategy.merge(o.finalUrl, o.initialUrl)
            this.setBrowserUrl(i, o)
          }
        } else
          r instanceof Pr
            ? ((this.currentUrlTree = o.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                o.finalUrl,
                o.initialUrl,
              )),
              (this.routerState = o.targetRouterState),
              this.urlUpdateStrategy === 'deferred' &&
                (o.extras.skipLocationChange ||
                  this.setBrowserUrl(this.rawUrlTree, o)))
            : r instanceof wt &&
                (r.code === Ee.GuardRejected ||
                  r.code === Ee.NoDataFromResolver)
              ? this.restoreHistory(o)
              : r instanceof Fr
                ? this.restoreHistory(o, !0)
                : r instanceof Zt &&
                  ((this.lastSuccessfulId = r.id),
                  (this.currentPageId = this.browserPageId))
      }
      setBrowserUrl(r, o) {
        let i = this.urlSerializer.serialize(r)
        if (this.location.isCurrentPathEqualTo(i) || o.extras.replaceUrl) {
          let s = this.browserPageId,
            a = g(g({}, o.extras.state), this.generateNgRouterState(o.id, s))
          this.location.replaceState(i, '', a)
        } else {
          let s = g(
            g({}, o.extras.state),
            this.generateNgRouterState(o.id, this.browserPageId + 1),
          )
          this.location.go(i, '', s)
        }
      }
      restoreHistory(r, o = !1) {
        if (this.canceledNavigationResolution === 'computed') {
          let i = this.browserPageId,
            s = this.currentPageId - i
          s !== 0
            ? this.location.historyGo(s)
            : this.currentUrlTree === r.finalUrl &&
              s === 0 &&
              (this.resetState(r), this.resetUrlToCurrentUrlTree())
        } else
          this.canceledNavigationResolution === 'replace' &&
            (o && this.resetState(r), this.resetUrlToCurrentUrlTree())
      }
      resetState(r) {
        ;(this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            r.finalUrl ?? this.rawUrlTree,
          ))
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          '',
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId),
        )
      }
      generateNgRouterState(r, o) {
        return this.canceledNavigationResolution === 'computed'
          ? { navigationId: r, ɵrouterPageId: o }
          : { navigationId: r }
      }
    }
    ;(t.ɵfac = (() => {
      let r
      return function (i) {
        return (r || (r = ht(t)))(i || t)
      }
    })()),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })(),
  Tr = (function (e) {
    return (
      (e[(e.COMPLETE = 0)] = 'COMPLETE'),
      (e[(e.FAILED = 1)] = 'FAILED'),
      (e[(e.REDIRECTING = 2)] = 'REDIRECTING'),
      e
    )
  })(Tr || {})
function fE(e, t) {
  e.events
    .pipe(
      De(
        (n) =>
          n instanceof Zt ||
          n instanceof wt ||
          n instanceof Fr ||
          n instanceof Yt,
      ),
      E((n) =>
        n instanceof Zt || n instanceof Yt
          ? Tr.COMPLETE
          : (
                n instanceof wt
                  ? n.code === Ee.Redirect ||
                    n.code === Ee.SupersededByNewNavigation
                  : !1
              )
            ? Tr.REDIRECTING
            : Tr.FAILED,
      ),
      De((n) => n !== Tr.REDIRECTING),
      Qe(1),
    )
    .subscribe(() => {
      t()
    })
}
function hE(e) {
  throw e
}
var pE = {
    paths: 'exact',
    fragment: 'ignored',
    matrixParams: 'ignored',
    queryParams: 'exact',
  },
  gE = {
    paths: 'subset',
    fragment: 'ignored',
    matrixParams: 'ignored',
    queryParams: 'subset',
  },
  zh = (() => {
    let t = class t {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree()
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree()
      }
      get events() {
        return this._events
      }
      get routerState() {
        return this.stateManager.getRouterState()
      }
      constructor() {
        ;(this.disposed = !1),
          (this.isNgZoneEnabled = !1),
          (this.console = p(hi)),
          (this.stateManager = p(Hh)),
          (this.options = p(oc, { optional: !0 }) || {}),
          (this.pendingTasks = p(An)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || 'deferred'),
          (this.navigationTransitions = p(aE)),
          (this.urlSerializer = p(Ju)),
          (this.location = p(Dr)),
          (this.urlHandlingStrategy = p(sc)),
          (this._events = new se()),
          (this.errorHandler = this.options.errorHandler || hE),
          (this.navigated = !1),
          (this.routeReuseStrategy = p(cE)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || 'ignore'),
          (this.config = p(ic, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!p(tc, { optional: !0 })),
          (this.eventsSubscription = new Z()),
          (this.isNgZoneEnabled = p(q) instanceof q && q.isInAngularZone()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (r) => {
                this.console.warn(r)
              },
            }),
          this.subscribeToNavigationEvents()
      }
      subscribeToNavigationEvents() {
        let r = this.navigationTransitions.events.subscribe((o) => {
          try {
            let i = this.navigationTransitions.currentTransition,
              s = this.navigationTransitions.currentNavigation
            if (i !== null && s !== null) {
              if (
                (this.stateManager.handleRouterEvent(o, s),
                o instanceof wt &&
                  o.code !== Ee.Redirect &&
                  o.code !== Ee.SupersededByNewNavigation)
              )
                this.navigated = !0
              else if (o instanceof Zt) this.navigated = !0
              else if (o instanceof kr) {
                let a = this.urlHandlingStrategy.merge(o.url, i.currentRawUrl),
                  u = {
                    info: i.extras.info,
                    skipLocationChange: i.extras.skipLocationChange,
                    replaceUrl:
                      this.urlUpdateStrategy === 'eager' || uE(i.source),
                  }
                this.scheduleNavigation(a, xr, null, u, {
                  resolve: i.resolve,
                  reject: i.reject,
                  promise: i.promise,
                })
              }
            }
            vE(o) && this._events.next(o)
          } catch (i) {
            this.navigationTransitions.transitionAbortSubject.next(i)
          }
        })
        this.eventsSubscription.add(r)
      }
      resetRootComponentType(r) {
        ;(this.routerState.root.component = r),
          (this.navigationTransitions.rootComponentType = r)
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              xr,
              this.stateManager.restoredState(),
            )
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (r, o) => {
              setTimeout(() => {
                this.navigateToSyncWithBrowser(r, 'popstate', o)
              }, 0)
            },
          )
      }
      navigateToSyncWithBrowser(r, o, i) {
        let s = { replaceUrl: !0 },
          a = i?.navigationId ? i : null
        if (i) {
          let c = g({}, i)
          delete c.navigationId,
            delete c.ɵrouterPageId,
            Object.keys(c).length !== 0 && (s.state = c)
        }
        let u = this.parseUrl(r)
        this.scheduleNavigation(u, o, a, s)
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree)
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation
      }
      resetConfig(r) {
        ;(this.config = r.map(nc)), (this.navigated = !1)
      }
      ngOnDestroy() {
        this.dispose()
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe()
      }
      createUrlTree(r, o = {}) {
        let {
            relativeTo: i,
            queryParams: s,
            fragment: a,
            queryParamsHandling: u,
            preserveFragment: c,
          } = o,
          l = c ? this.currentUrlTree.fragment : a,
          d = null
        switch (u) {
          case 'merge':
            d = g(g({}, this.currentUrlTree.queryParams), s)
            break
          case 'preserve':
            d = this.currentUrlTree.queryParams
            break
          default:
            d = s || null
        }
        d !== null && (d = this.removeEmptyProps(d))
        let f
        try {
          let h = i ? i.snapshot : this.routerState.snapshot.root
          f = _h(h)
        } catch {
          ;(typeof r[0] != 'string' || !r[0].startsWith('/')) && (r = []),
            (f = this.currentUrlTree.root)
        }
        return Sh(f, r, d, l ?? null)
      }
      navigateByUrl(r, o = { skipLocationChange: !1 }) {
        let i = $n(r) ? r : this.parseUrl(r),
          s = this.urlHandlingStrategy.merge(i, this.rawUrlTree)
        return this.scheduleNavigation(s, xr, null, o)
      }
      navigate(r, o = { skipLocationChange: !1 }) {
        return mE(r), this.navigateByUrl(this.createUrlTree(r, o), o)
      }
      serializeUrl(r) {
        return this.urlSerializer.serialize(r)
      }
      parseUrl(r) {
        try {
          return this.urlSerializer.parse(r)
        } catch {
          return this.urlSerializer.parse('/')
        }
      }
      isActive(r, o) {
        let i
        if (
          (o === !0 ? (i = g({}, pE)) : o === !1 ? (i = g({}, gE)) : (i = o),
          $n(r))
        )
          return dh(this.currentUrlTree, r, i)
        let s = this.parseUrl(r)
        return dh(this.currentUrlTree, s, i)
      }
      removeEmptyProps(r) {
        return Object.entries(r).reduce(
          (o, [i, s]) => (s != null && (o[i] = s), o),
          {},
        )
      }
      scheduleNavigation(r, o, i, s, a) {
        if (this.disposed) return Promise.resolve(!1)
        let u, c, l
        a
          ? ((u = a.resolve), (c = a.reject), (l = a.promise))
          : (l = new Promise((f, h) => {
              ;(u = f), (c = h)
            }))
        let d = this.pendingTasks.add()
        return (
          fE(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(d))
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: o,
            restoredState: i,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: r,
            extras: s,
            resolve: u,
            reject: c,
            promise: l,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          l.catch((f) => Promise.reject(f))
        )
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)()
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })()
function mE(e) {
  for (let t = 0; t < e.length; t++) if (e[t] == null) throw new w(4008, !1)
}
function vE(e) {
  return !(e instanceof Pr) && !(e instanceof kr)
}
var yE = new C('')
function Gh(e, ...t) {
  return In([
    { provide: ic, multi: !0, useValue: e },
    [],
    { provide: Bn, useFactory: DE, deps: [zh] },
    { provide: pi, multi: !0, useFactory: wE },
    t.map((n) => n.ɵproviders),
  ])
}
function DE(e) {
  return e.routerState.root
}
function wE() {
  let e = p(_n)
  return (t) => {
    let n = e.get(Rn)
    if (t !== n.components[0]) return
    let r = e.get(zh),
      o = e.get(CE)
    e.get(EE) === 1 && r.initialNavigation(),
      e.get(IE, null, x.Optional)?.setUpPreloading(),
      e.get(yE, null, x.Optional)?.init(),
      r.resetRootComponentType(n.componentTypes[0]),
      o.closed || (o.next(), o.complete(), o.unsubscribe())
  }
}
var CE = new C('', { factory: () => new se() }),
  EE = new C('', { providedIn: 'root', factory: () => 1 })
var IE = new C('')
var qh = []
var Wh = { providers: [Gh(qh), th()] }
var tp = (() => {
    let t = class t {
      constructor(r, o) {
        ;(this._renderer = r),
          (this._elementRef = o),
          (this.onChange = (i) => {}),
          (this.onTouched = () => {})
      }
      setProperty(r, o) {
        this._renderer.setProperty(this._elementRef.nativeElement, r, o)
      }
      registerOnTouched(r) {
        this.onTouched = r
      }
      registerOnChange(r) {
        this.onChange = r
      }
      setDisabledState(r) {
        this.setProperty('disabled', r)
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)(J(Tn), J(Vt))
    }),
      (t.ɵdir = He({ type: t }))
    let e = t
    return e
  })(),
  np = (() => {
    let t = class t extends tp {}
    ;(t.ɵfac = (() => {
      let r
      return function (i) {
        return (r || (r = ht(t)))(i || t)
      }
    })()),
      (t.ɵdir = He({ type: t, features: [Ut] }))
    let e = t
    return e
  })(),
  dc = new C('')
var bE = { provide: dc, useExisting: En(() => qn), multi: !0 }
function ME() {
  let e = nt() ? nt().getUserAgent() : ''
  return /android (\d+)/.test(e.toLowerCase())
}
var _E = new C(''),
  qn = (() => {
    let t = class t extends tp {
      constructor(r, o, i) {
        super(r, o),
          (this._compositionMode = i),
          (this._composing = !1),
          this._compositionMode == null && (this._compositionMode = !ME())
      }
      writeValue(r) {
        let o = r ?? ''
        this.setProperty('value', o)
      }
      _handleInput(r) {
        ;(!this._compositionMode ||
          (this._compositionMode && !this._composing)) &&
          this.onChange(r)
      }
      _compositionStart() {
        this._composing = !0
      }
      _compositionEnd(r) {
        ;(this._composing = !1), this._compositionMode && this.onChange(r)
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)(J(Tn), J(Vt), J(_E, 8))
    }),
      (t.ɵdir = He({
        type: t,
        selectors: [
          ['input', 'formControlName', '', 3, 'type', 'checkbox'],
          ['textarea', 'formControlName', ''],
          ['input', 'formControl', '', 3, 'type', 'checkbox'],
          ['textarea', 'formControl', ''],
          ['input', 'ngModel', '', 3, 'type', 'checkbox'],
          ['textarea', 'ngModel', ''],
          ['', 'ngDefaultControl', ''],
        ],
        hostBindings: function (o, i) {
          o & 1 &&
            ie('input', function (a) {
              return i._handleInput(a.target.value)
            })('blur', function () {
              return i.onTouched()
            })('compositionstart', function () {
              return i._compositionStart()
            })('compositionend', function (a) {
              return i._compositionEnd(a.target.value)
            })
        },
        features: [gt([bE]), Ut],
      }))
    let e = t
    return e
  })()
var SE = new C(''),
  TE = new C('')
function rp(e) {
  return e != null
}
function op(e) {
  return Bt(e) ? z(e) : e
}
function ip(e) {
  let t = {}
  return (
    e.forEach((n) => {
      t = n != null ? g(g({}, t), n) : t
    }),
    Object.keys(t).length === 0 ? null : t
  )
}
function sp(e, t) {
  return t.map((n) => n(e))
}
function AE(e) {
  return !e.validate
}
function ap(e) {
  return e.map((t) => (AE(t) ? t : (n) => t.validate(n)))
}
function xE(e) {
  if (!e) return null
  let t = e.filter(rp)
  return t.length == 0
    ? null
    : function (n) {
        return ip(sp(n, t))
      }
}
function up(e) {
  return e != null ? xE(ap(e)) : null
}
function NE(e) {
  if (!e) return null
  let t = e.filter(rp)
  return t.length == 0
    ? null
    : function (n) {
        let r = sp(n, t).map(op)
        return gs(r).pipe(E(ip))
      }
}
function cp(e) {
  return e != null ? NE(ap(e)) : null
}
function Zh(e, t) {
  return e === null ? [t] : Array.isArray(e) ? [...e, t] : [e, t]
}
function RE(e) {
  return e._rawValidators
}
function OE(e) {
  return e._rawAsyncValidators
}
function ac(e) {
  return e ? (Array.isArray(e) ? e : [e]) : []
}
function zi(e, t) {
  return Array.isArray(e) ? e.includes(t) : e === t
}
function Yh(e, t) {
  let n = ac(t)
  return (
    ac(e).forEach((o) => {
      zi(n, o) || n.push(o)
    }),
    n
  )
}
function Qh(e, t) {
  return ac(t).filter((n) => !zi(e, n))
}
var Gi = class {
    constructor() {
      ;(this._rawValidators = []),
        (this._rawAsyncValidators = []),
        (this._onDestroyCallbacks = [])
    }
    get value() {
      return this.control ? this.control.value : null
    }
    get valid() {
      return this.control ? this.control.valid : null
    }
    get invalid() {
      return this.control ? this.control.invalid : null
    }
    get pending() {
      return this.control ? this.control.pending : null
    }
    get disabled() {
      return this.control ? this.control.disabled : null
    }
    get enabled() {
      return this.control ? this.control.enabled : null
    }
    get errors() {
      return this.control ? this.control.errors : null
    }
    get pristine() {
      return this.control ? this.control.pristine : null
    }
    get dirty() {
      return this.control ? this.control.dirty : null
    }
    get touched() {
      return this.control ? this.control.touched : null
    }
    get status() {
      return this.control ? this.control.status : null
    }
    get untouched() {
      return this.control ? this.control.untouched : null
    }
    get statusChanges() {
      return this.control ? this.control.statusChanges : null
    }
    get valueChanges() {
      return this.control ? this.control.valueChanges : null
    }
    get path() {
      return null
    }
    _setValidators(t) {
      ;(this._rawValidators = t || []),
        (this._composedValidatorFn = up(this._rawValidators))
    }
    _setAsyncValidators(t) {
      ;(this._rawAsyncValidators = t || []),
        (this._composedAsyncValidatorFn = cp(this._rawAsyncValidators))
    }
    get validator() {
      return this._composedValidatorFn || null
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn || null
    }
    _registerOnDestroy(t) {
      this._onDestroyCallbacks.push(t)
    }
    _invokeOnDestroyCallbacks() {
      this._onDestroyCallbacks.forEach((t) => t()),
        (this._onDestroyCallbacks = [])
    }
    reset(t = void 0) {
      this.control && this.control.reset(t)
    }
    hasError(t, n) {
      return this.control ? this.control.hasError(t, n) : !1
    }
    getError(t, n) {
      return this.control ? this.control.getError(t, n) : null
    }
  },
  uc = class extends Gi {
    get formDirective() {
      return null
    }
    get path() {
      return null
    }
  },
  Gr = class extends Gi {
    constructor() {
      super(...arguments),
        (this._parent = null),
        (this.name = null),
        (this.valueAccessor = null)
    }
  },
  cc = class {
    constructor(t) {
      this._cd = t
    }
    get isTouched() {
      return !!this._cd?.control?.touched
    }
    get isUntouched() {
      return !!this._cd?.control?.untouched
    }
    get isPristine() {
      return !!this._cd?.control?.pristine
    }
    get isDirty() {
      return !!this._cd?.control?.dirty
    }
    get isValid() {
      return !!this._cd?.control?.valid
    }
    get isInvalid() {
      return !!this._cd?.control?.invalid
    }
    get isPending() {
      return !!this._cd?.control?.pending
    }
    get isSubmitted() {
      return !!this._cd?.submitted
    }
  },
  FE = {
    '[class.ng-untouched]': 'isUntouched',
    '[class.ng-touched]': 'isTouched',
    '[class.ng-pristine]': 'isPristine',
    '[class.ng-dirty]': 'isDirty',
    '[class.ng-valid]': 'isValid',
    '[class.ng-invalid]': 'isInvalid',
    '[class.ng-pending]': 'isPending',
  },
  ax = R(g({}, FE), { '[class.ng-submitted]': 'isSubmitted' }),
  qi = (() => {
    let t = class t extends cc {
      constructor(r) {
        super(r)
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)(J(Gr, 2))
    }),
      (t.ɵdir = He({
        type: t,
        selectors: [
          ['', 'formControlName', ''],
          ['', 'ngModel', ''],
          ['', 'formControl', ''],
        ],
        hostVars: 14,
        hostBindings: function (o, i) {
          o & 2 &&
            ou('ng-untouched', i.isUntouched)('ng-touched', i.isTouched)(
              'ng-pristine',
              i.isPristine,
            )('ng-dirty', i.isDirty)('ng-valid', i.isValid)(
              'ng-invalid',
              i.isInvalid,
            )('ng-pending', i.isPending)
        },
        features: [Ut],
      }))
    let e = t
    return e
  })()
var Hr = 'VALID',
  Hi = 'INVALID',
  Gn = 'PENDING',
  zr = 'DISABLED'
function PE(e) {
  return (Wi(e) ? e.validators : e) || null
}
function kE(e) {
  return Array.isArray(e) ? up(e) : e || null
}
function LE(e, t) {
  return (Wi(t) ? t.asyncValidators : e) || null
}
function VE(e) {
  return Array.isArray(e) ? cp(e) : e || null
}
function Wi(e) {
  return e != null && !Array.isArray(e) && typeof e == 'object'
}
var lc = class {
  constructor(t, n) {
    ;(this._pendingDirty = !1),
      (this._hasOwnPendingAsyncValidator = !1),
      (this._pendingTouched = !1),
      (this._onCollectionChange = () => {}),
      (this._parent = null),
      (this.pristine = !0),
      (this.touched = !1),
      (this._onDisabledChange = []),
      this._assignValidators(t),
      this._assignAsyncValidators(n)
  }
  get validator() {
    return this._composedValidatorFn
  }
  set validator(t) {
    this._rawValidators = this._composedValidatorFn = t
  }
  get asyncValidator() {
    return this._composedAsyncValidatorFn
  }
  set asyncValidator(t) {
    this._rawAsyncValidators = this._composedAsyncValidatorFn = t
  }
  get parent() {
    return this._parent
  }
  get valid() {
    return this.status === Hr
  }
  get invalid() {
    return this.status === Hi
  }
  get pending() {
    return this.status == Gn
  }
  get disabled() {
    return this.status === zr
  }
  get enabled() {
    return this.status !== zr
  }
  get dirty() {
    return !this.pristine
  }
  get untouched() {
    return !this.touched
  }
  get updateOn() {
    return this._updateOn
      ? this._updateOn
      : this.parent
        ? this.parent.updateOn
        : 'change'
  }
  setValidators(t) {
    this._assignValidators(t)
  }
  setAsyncValidators(t) {
    this._assignAsyncValidators(t)
  }
  addValidators(t) {
    this.setValidators(Yh(t, this._rawValidators))
  }
  addAsyncValidators(t) {
    this.setAsyncValidators(Yh(t, this._rawAsyncValidators))
  }
  removeValidators(t) {
    this.setValidators(Qh(t, this._rawValidators))
  }
  removeAsyncValidators(t) {
    this.setAsyncValidators(Qh(t, this._rawAsyncValidators))
  }
  hasValidator(t) {
    return zi(this._rawValidators, t)
  }
  hasAsyncValidator(t) {
    return zi(this._rawAsyncValidators, t)
  }
  clearValidators() {
    this.validator = null
  }
  clearAsyncValidators() {
    this.asyncValidator = null
  }
  markAsTouched(t = {}) {
    ;(this.touched = !0),
      this._parent && !t.onlySelf && this._parent.markAsTouched(t)
  }
  markAllAsTouched() {
    this.markAsTouched({ onlySelf: !0 }),
      this._forEachChild((t) => t.markAllAsTouched())
  }
  markAsUntouched(t = {}) {
    ;(this.touched = !1),
      (this._pendingTouched = !1),
      this._forEachChild((n) => {
        n.markAsUntouched({ onlySelf: !0 })
      }),
      this._parent && !t.onlySelf && this._parent._updateTouched(t)
  }
  markAsDirty(t = {}) {
    ;(this.pristine = !1),
      this._parent && !t.onlySelf && this._parent.markAsDirty(t)
  }
  markAsPristine(t = {}) {
    ;(this.pristine = !0),
      (this._pendingDirty = !1),
      this._forEachChild((n) => {
        n.markAsPristine({ onlySelf: !0 })
      }),
      this._parent && !t.onlySelf && this._parent._updatePristine(t)
  }
  markAsPending(t = {}) {
    ;(this.status = Gn),
      t.emitEvent !== !1 && this.statusChanges.emit(this.status),
      this._parent && !t.onlySelf && this._parent.markAsPending(t)
  }
  disable(t = {}) {
    let n = this._parentMarkedDirty(t.onlySelf)
    ;(this.status = zr),
      (this.errors = null),
      this._forEachChild((r) => {
        r.disable(R(g({}, t), { onlySelf: !0 }))
      }),
      this._updateValue(),
      t.emitEvent !== !1 &&
        (this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
      this._updateAncestors(R(g({}, t), { skipPristineCheck: n })),
      this._onDisabledChange.forEach((r) => r(!0))
  }
  enable(t = {}) {
    let n = this._parentMarkedDirty(t.onlySelf)
    ;(this.status = Hr),
      this._forEachChild((r) => {
        r.enable(R(g({}, t), { onlySelf: !0 }))
      }),
      this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent }),
      this._updateAncestors(R(g({}, t), { skipPristineCheck: n })),
      this._onDisabledChange.forEach((r) => r(!1))
  }
  _updateAncestors(t) {
    this._parent &&
      !t.onlySelf &&
      (this._parent.updateValueAndValidity(t),
      t.skipPristineCheck || this._parent._updatePristine(),
      this._parent._updateTouched())
  }
  setParent(t) {
    this._parent = t
  }
  getRawValue() {
    return this.value
  }
  updateValueAndValidity(t = {}) {
    this._setInitialStatus(),
      this._updateValue(),
      this.enabled &&
        (this._cancelExistingSubscription(),
        (this.errors = this._runValidator()),
        (this.status = this._calculateStatus()),
        (this.status === Hr || this.status === Gn) &&
          this._runAsyncValidator(t.emitEvent)),
      t.emitEvent !== !1 &&
        (this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
      this._parent && !t.onlySelf && this._parent.updateValueAndValidity(t)
  }
  _updateTreeValidity(t = { emitEvent: !0 }) {
    this._forEachChild((n) => n._updateTreeValidity(t)),
      this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent })
  }
  _setInitialStatus() {
    this.status = this._allControlsDisabled() ? zr : Hr
  }
  _runValidator() {
    return this.validator ? this.validator(this) : null
  }
  _runAsyncValidator(t) {
    if (this.asyncValidator) {
      ;(this.status = Gn), (this._hasOwnPendingAsyncValidator = !0)
      let n = op(this.asyncValidator(this))
      this._asyncValidationSubscription = n.subscribe((r) => {
        ;(this._hasOwnPendingAsyncValidator = !1),
          this.setErrors(r, { emitEvent: t })
      })
    }
  }
  _cancelExistingSubscription() {
    this._asyncValidationSubscription &&
      (this._asyncValidationSubscription.unsubscribe(),
      (this._hasOwnPendingAsyncValidator = !1))
  }
  setErrors(t, n = {}) {
    ;(this.errors = t), this._updateControlsErrors(n.emitEvent !== !1)
  }
  get(t) {
    let n = t
    return n == null || (Array.isArray(n) || (n = n.split('.')), n.length === 0)
      ? null
      : n.reduce((r, o) => r && r._find(o), this)
  }
  getError(t, n) {
    let r = n ? this.get(n) : this
    return r && r.errors ? r.errors[t] : null
  }
  hasError(t, n) {
    return !!this.getError(t, n)
  }
  get root() {
    let t = this
    for (; t._parent; ) t = t._parent
    return t
  }
  _updateControlsErrors(t) {
    ;(this.status = this._calculateStatus()),
      t && this.statusChanges.emit(this.status),
      this._parent && this._parent._updateControlsErrors(t)
  }
  _initObservables() {
    ;(this.valueChanges = new ue()), (this.statusChanges = new ue())
  }
  _calculateStatus() {
    return this._allControlsDisabled()
      ? zr
      : this.errors
        ? Hi
        : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(Gn)
          ? Gn
          : this._anyControlsHaveStatus(Hi)
            ? Hi
            : Hr
  }
  _anyControlsHaveStatus(t) {
    return this._anyControls((n) => n.status === t)
  }
  _anyControlsDirty() {
    return this._anyControls((t) => t.dirty)
  }
  _anyControlsTouched() {
    return this._anyControls((t) => t.touched)
  }
  _updatePristine(t = {}) {
    ;(this.pristine = !this._anyControlsDirty()),
      this._parent && !t.onlySelf && this._parent._updatePristine(t)
  }
  _updateTouched(t = {}) {
    ;(this.touched = this._anyControlsTouched()),
      this._parent && !t.onlySelf && this._parent._updateTouched(t)
  }
  _registerOnCollectionChange(t) {
    this._onCollectionChange = t
  }
  _setUpdateStrategy(t) {
    Wi(t) && t.updateOn != null && (this._updateOn = t.updateOn)
  }
  _parentMarkedDirty(t) {
    let n = this._parent && this._parent.dirty
    return !t && !!n && !this._parent._anyControlsDirty()
  }
  _find(t) {
    return null
  }
  _assignValidators(t) {
    ;(this._rawValidators = Array.isArray(t) ? t.slice() : t),
      (this._composedValidatorFn = kE(this._rawValidators))
  }
  _assignAsyncValidators(t) {
    ;(this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t),
      (this._composedAsyncValidatorFn = VE(this._rawAsyncValidators))
  }
}
var lp = new C('CallSetDisabledState', {
    providedIn: 'root',
    factory: () => fc,
  }),
  fc = 'always'
function jE(e, t) {
  return [...t.path, e]
}
function UE(e, t, n = fc) {
  BE(e, t),
    t.valueAccessor.writeValue(e.value),
    (e.disabled || n === 'always') &&
      t.valueAccessor.setDisabledState?.(e.disabled),
    HE(e, t),
    GE(e, t),
    zE(e, t),
    $E(e, t)
}
function Kh(e, t) {
  e.forEach((n) => {
    n.registerOnValidatorChange && n.registerOnValidatorChange(t)
  })
}
function $E(e, t) {
  if (t.valueAccessor.setDisabledState) {
    let n = (r) => {
      t.valueAccessor.setDisabledState(r)
    }
    e.registerOnDisabledChange(n),
      t._registerOnDestroy(() => {
        e._unregisterOnDisabledChange(n)
      })
  }
}
function BE(e, t) {
  let n = RE(e)
  t.validator !== null
    ? e.setValidators(Zh(n, t.validator))
    : typeof n == 'function' && e.setValidators([n])
  let r = OE(e)
  t.asyncValidator !== null
    ? e.setAsyncValidators(Zh(r, t.asyncValidator))
    : typeof r == 'function' && e.setAsyncValidators([r])
  let o = () => e.updateValueAndValidity()
  Kh(t._rawValidators, o), Kh(t._rawAsyncValidators, o)
}
function HE(e, t) {
  t.valueAccessor.registerOnChange((n) => {
    ;(e._pendingValue = n),
      (e._pendingChange = !0),
      (e._pendingDirty = !0),
      e.updateOn === 'change' && dp(e, t)
  })
}
function zE(e, t) {
  t.valueAccessor.registerOnTouched(() => {
    ;(e._pendingTouched = !0),
      e.updateOn === 'blur' && e._pendingChange && dp(e, t),
      e.updateOn !== 'submit' && e.markAsTouched()
  })
}
function dp(e, t) {
  e._pendingDirty && e.markAsDirty(),
    e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
    t.viewToModelUpdate(e._pendingValue),
    (e._pendingChange = !1)
}
function GE(e, t) {
  let n = (r, o) => {
    t.valueAccessor.writeValue(r), o && t.viewToModelUpdate(r)
  }
  e.registerOnChange(n),
    t._registerOnDestroy(() => {
      e._unregisterOnChange(n)
    })
}
function qE(e, t) {
  if (!e.hasOwnProperty('model')) return !1
  let n = e.model
  return n.isFirstChange() ? !0 : !Object.is(t, n.currentValue)
}
function WE(e) {
  return Object.getPrototypeOf(e.constructor) === np
}
function ZE(e, t) {
  if (!t) return null
  Array.isArray(t)
  let n, r, o
  return (
    t.forEach((i) => {
      i.constructor === qn ? (n = i) : WE(i) ? (r = i) : (o = i)
    }),
    o || r || n || null
  )
}
function Jh(e, t) {
  let n = e.indexOf(t)
  n > -1 && e.splice(n, 1)
}
function Xh(e) {
  return (
    typeof e == 'object' &&
    e !== null &&
    Object.keys(e).length === 2 &&
    'value' in e &&
    'disabled' in e
  )
}
var YE = class extends lc {
  constructor(t = null, n, r) {
    super(PE(n), LE(r, n)),
      (this.defaultValue = null),
      (this._onChange = []),
      (this._pendingChange = !1),
      this._applyFormState(t),
      this._setUpdateStrategy(n),
      this._initObservables(),
      this.updateValueAndValidity({
        onlySelf: !0,
        emitEvent: !!this.asyncValidator,
      }),
      Wi(n) &&
        (n.nonNullable || n.initialValueIsDefault) &&
        (Xh(t) ? (this.defaultValue = t.value) : (this.defaultValue = t))
  }
  setValue(t, n = {}) {
    ;(this.value = this._pendingValue = t),
      this._onChange.length &&
        n.emitModelToViewChange !== !1 &&
        this._onChange.forEach((r) =>
          r(this.value, n.emitViewToModelChange !== !1),
        ),
      this.updateValueAndValidity(n)
  }
  patchValue(t, n = {}) {
    this.setValue(t, n)
  }
  reset(t = this.defaultValue, n = {}) {
    this._applyFormState(t),
      this.markAsPristine(n),
      this.markAsUntouched(n),
      this.setValue(this.value, n),
      (this._pendingChange = !1)
  }
  _updateValue() {}
  _anyControls(t) {
    return !1
  }
  _allControlsDisabled() {
    return this.disabled
  }
  registerOnChange(t) {
    this._onChange.push(t)
  }
  _unregisterOnChange(t) {
    Jh(this._onChange, t)
  }
  registerOnDisabledChange(t) {
    this._onDisabledChange.push(t)
  }
  _unregisterOnDisabledChange(t) {
    Jh(this._onDisabledChange, t)
  }
  _forEachChild(t) {}
  _syncPendingControls() {
    return this.updateOn === 'submit' &&
      (this._pendingDirty && this.markAsDirty(),
      this._pendingTouched && this.markAsTouched(),
      this._pendingChange)
      ? (this.setValue(this._pendingValue, {
          onlySelf: !0,
          emitModelToViewChange: !1,
        }),
        !0)
      : !1
  }
  _applyFormState(t) {
    Xh(t)
      ? ((this.value = this._pendingValue = t.value),
        t.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = t)
  }
}
var QE = { provide: Gr, useExisting: En(() => qr) },
  ep = Promise.resolve(),
  qr = (() => {
    let t = class t extends Gr {
      constructor(r, o, i, s, a, u) {
        super(),
          (this._changeDetectorRef = a),
          (this.callSetDisabledState = u),
          (this.control = new YE()),
          (this._registered = !1),
          (this.name = ''),
          (this.update = new ue()),
          (this._parent = r),
          this._setValidators(o),
          this._setAsyncValidators(i),
          (this.valueAccessor = ZE(this, s))
      }
      ngOnChanges(r) {
        if ((this._checkForErrors(), !this._registered || 'name' in r)) {
          if (this._registered && (this._checkName(), this.formDirective)) {
            let o = r.name.previousValue
            this.formDirective.removeControl({
              name: o,
              path: this._getPath(o),
            })
          }
          this._setUpControl()
        }
        'isDisabled' in r && this._updateDisabled(r),
          qE(r, this.viewModel) &&
            (this._updateValue(this.model), (this.viewModel = this.model))
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this)
      }
      get path() {
        return this._getPath(this.name)
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null
      }
      viewToModelUpdate(r) {
        ;(this.viewModel = r), this.update.emit(r)
      }
      _setUpControl() {
        this._setUpdateStrategy(),
          this._isStandalone()
            ? this._setUpStandalone()
            : this.formDirective.addControl(this),
          (this._registered = !0)
      }
      _setUpdateStrategy() {
        this.options &&
          this.options.updateOn != null &&
          (this.control._updateOn = this.options.updateOn)
      }
      _isStandalone() {
        return !this._parent || !!(this.options && this.options.standalone)
      }
      _setUpStandalone() {
        UE(this.control, this, this.callSetDisabledState),
          this.control.updateValueAndValidity({ emitEvent: !1 })
      }
      _checkForErrors() {
        this._isStandalone() || this._checkParentType(), this._checkName()
      }
      _checkParentType() {}
      _checkName() {
        this.options && this.options.name && (this.name = this.options.name),
          !this._isStandalone() && this.name
      }
      _updateValue(r) {
        ep.then(() => {
          this.control.setValue(r, { emitViewToModelChange: !1 }),
            this._changeDetectorRef?.markForCheck()
        })
      }
      _updateDisabled(r) {
        let o = r.isDisabled.currentValue,
          i = o !== 0 && gi(o)
        ep.then(() => {
          i && !this.control.disabled
            ? this.control.disable()
            : !i && this.control.disabled && this.control.enable(),
            this._changeDetectorRef?.markForCheck()
        })
      }
      _getPath(r) {
        return this._parent ? jE(r, this._parent) : [r]
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)(
        J(uc, 9),
        J(SE, 10),
        J(TE, 10),
        J(dc, 10),
        J(Ht, 8),
        J(lp, 8),
      )
    }),
      (t.ɵdir = He({
        type: t,
        selectors: [
          ['', 'ngModel', '', 3, 'formControlName', '', 3, 'formControl', ''],
        ],
        inputs: {
          name: 'name',
          isDisabled: [Me.None, 'disabled', 'isDisabled'],
          model: [Me.None, 'ngModel', 'model'],
          options: [Me.None, 'ngModelOptions', 'options'],
        },
        outputs: { update: 'ngModelChange' },
        exportAs: ['ngModel'],
        features: [gt([QE]), Ut, Mn],
      }))
    let e = t
    return e
  })()
var KE = { provide: dc, useExisting: En(() => Wr), multi: !0 },
  Wr = (() => {
    let t = class t extends np {
      writeValue(r) {
        let o = r ?? ''
        this.setProperty('value', o)
      }
      registerOnChange(r) {
        this.onChange = (o) => {
          r(o == '' ? null : parseFloat(o))
        }
      }
    }
    ;(t.ɵfac = (() => {
      let r
      return function (i) {
        return (r || (r = ht(t)))(i || t)
      }
    })()),
      (t.ɵdir = He({
        type: t,
        selectors: [
          ['input', 'type', 'number', 'formControlName', ''],
          ['input', 'type', 'number', 'formControl', ''],
          ['input', 'type', 'number', 'ngModel', ''],
        ],
        hostBindings: function (o, i) {
          o & 1 &&
            ie('input', function (a) {
              return i.onChange(a.target.value)
            })('blur', function () {
              return i.onTouched()
            })
        },
        features: [gt([KE]), Ut],
      }))
    let e = t
    return e
  })()
var JE = (() => {
  let t = class t {}
  ;(t.ɵfac = function (o) {
    return new (o || t)()
  }),
    (t.ɵmod = kt({ type: t })),
    (t.ɵinj = Pt({}))
  let e = t
  return e
})()
var Zi = (() => {
  let t = class t {
    static withConfig(r) {
      return {
        ngModule: t,
        providers: [{ provide: lp, useValue: r.callSetDisabledState ?? fc }],
      }
    }
  }
  ;(t.ɵfac = function (o) {
    return new (o || t)()
  }),
    (t.ɵmod = kt({ type: t })),
    (t.ɵinj = Pt({ imports: [JE] }))
  let e = t
  return e
})()
var hc = (() => {
  let t = class t {
    constructor() {
      ;(this._state = di({ count: 0 })),
        (this.count = vt(() => this._state().count))
    }
    increment(r = 1) {
      this._state.update((o) => R(g({}, o), { count: o.count + r }))
    }
    decrement(r = 1) {
      this._state.update((o) => R(g({}, o), { count: o.count - r }))
    }
  }
  ;(t.ɵfac = function (o) {
    return new (o || t)()
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac }))
  let e = t
  return e
})()
var hp = (() => {
  let t = class t {
    constructor() {
      ;(this.counterService = p(hc)),
        (this.input = 0),
        (this.count = this.counterService.count)
    }
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
  ;(t.ɵfac = function (o) {
    return new (o || t)()
  }),
    (t.ɵcmp = dt({
      type: t,
      selectors: [['app-counter']],
      standalone: !0,
      features: [gt([hc]), mt],
      decls: 11,
      vars: 4,
      consts: [
        [3, 'click'],
        ['type', 'number', 3, 'ngModelChange', 'ngModel'],
      ],
      template: function (o, i) {
        o & 1 &&
          (U(0, 'button', 0),
          ie('click', function () {
            return i.decrement()
          }),
          H(1, 'Decrement -1'),
          V(),
          U(2, 'button', 0),
          ie('click', function () {
            return i.increment()
          }),
          H(3, 'Increment +1'),
          V(),
          U(4, 'input', 1),
          yr('ngModelChange', function (a) {
            return fi(i.input, a) || (i.input = a), a
          }),
          V(),
          U(5, 'button', 0),
          ie('click', function () {
            return i.decrementBy()
          }),
          H(6),
          V(),
          U(7, 'button', 0),
          ie('click', function () {
            return i.incrementBy()
          }),
          H(8),
          V(),
          U(9, 'blockquote'),
          H(10),
          V()),
          o & 2 &&
            (oe(4),
            vr('ngModel', i.input),
            oe(2),
            ze(
              ' Decrement by ',
              i.input,
              `
`,
            ),
            oe(2),
            ze(
              ' Increment by ',
              i.input,
              `
`,
            ),
            oe(2),
            ze('Counter: ', i.count(), ''))
      },
      dependencies: [Zi, qn, Wr, qi, qr],
      encapsulation: 2,
    }))
  let e = t
  return e
})()
var Yi = class {
  constructor() {
    ;(this._state = di({ data: [], loading: !1, error: null })),
      (this.data = vt(() => this._state().data)),
      (this.loading = vt(() => this._state().loading)),
      (this.error = vt(() => this._state().error))
  }
  requestWrapper(t) {
    return (
      this.setLoading(),
      t.pipe(
        G((n) => {
          if (Array.isArray(n)) {
            this.setData(n)
            return
          }
          this.setData([n])
        }),
        E((n) => (Array.isArray(n) ? n : [n])),
        fe((n) => {
          throw (this.setError(n), n)
        }),
      )
    )
  }
  setData(t) {
    this._state.update((n) =>
      R(g({}, n), { data: structuredClone(t), loading: !1, error: null }),
    )
  }
  setLoading(t = !0) {
    this._state.update((n) => R(g({}, n), { loading: t }))
  }
  setError(t) {
    this._state.update((n) =>
      R(g({}, n), { data: [], loading: !1, error: t.statusText }),
    )
  }
}
var pc = (e, t = '') => {
  let { error: n, headers: r, status: o, url: i } = e
  return new Pn({
    error: n,
    headers: r,
    status: o,
    url: i ?? '',
    statusText: t,
  })
}
var gc = (() => {
  let t = class t extends Yi {
    constructor() {
      super(...arguments),
        (this.http = p(hu)),
        (this.baseUrl = 'https://jsonplaceholder.typicode.com/posts')
    }
    getAll() {
      return this.requestWrapper(this.http.get(this.baseUrl))
    }
    getPost(r) {
      return this.requestWrapper(
        this.http.get(`${this.baseUrl}/${r}`).pipe(
          fe((o) => {
            throw o.status === 404 ? pc(o, 'Post not found') : o
          }),
        ),
      )
    }
    createPost(r) {
      return this.requestWrapper(this.http.post(this.baseUrl, { title: r }))
    }
    updatePost(r, o) {
      return this.requestWrapper(
        this.http.put(`${this.baseUrl}/${r}`, { title: o }).pipe(
          fe((i) => {
            throw i.status === 500 ? pc(i, 'Post not found') : i
          }),
        ),
      )
    }
    deletePost(r) {
      return this.requestWrapper(
        this.http
          .delete(`${this.baseUrl}/${r}`)
          .pipe(E(() => ({ id: r, title: 'Post deleted' }))),
      )
    }
  }
  ;(t.ɵfac = (() => {
    let r
    return function (i) {
      return (r || (r = ht(t)))(i || t)
    }
  })()),
    (t.ɵprov = D({ token: t, factory: t.ɵfac }))
  let e = t
  return e
})()
var XE = (e, t) => t.id
function eI(e, t) {
  e & 1 && (U(0, 'blockquote'), H(1, 'Loading...'), V())
}
function tI(e, t) {
  if (
    (e & 1 && (U(0, 'blockquote')(1, 'strong'), H(2, 'Error:'), V(), H(3), V()),
    e & 2)
  ) {
    let n = iu()
    oe(3), ze(' ', n.error(), '')
  }
}
function nI(e, t) {
  if (
    (e & 1 && (U(0, 'blockquote')(1, 'strong'), H(2), V(), H(3), V()), e & 2)
  ) {
    let n = t.$implicit
    oe(2), ze('', n.id, ':'), oe(), ze(' ', n.title, ' ')
  }
}
function rI(e, t) {
  e & 1 && (U(0, 'blockquote'), H(1, 'No posts found!'), V())
}
function oI(e, t) {
  if (
    (e & 1 &&
      Af(0, nI, 4, 2, 'blockquote', null, XE, !1, rI, 2, 0, 'blockquote'),
    e & 2)
  ) {
    let n = iu()
    xf(n.posts())
  }
}
var pp = (() => {
  let t = class t {
    constructor() {
      ;(this.postsService = p(gc)),
        (this.input = 0),
        (this.posts = this.postsService.data),
        (this.loading = this.postsService.loading),
        (this.error = this.postsService.error),
        (this.totalPosts = vt(() => this.posts().length))
    }
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
  ;(t.ɵfac = function (o) {
    return new (o || t)()
  }),
    (t.ɵcmp = dt({
      type: t,
      selectors: [['app-posts']],
      standalone: !0,
      features: [gt([gc]), mt],
      decls: 19,
      vars: 8,
      consts: [
        [3, 'click', 'disabled'],
        ['type', 'number', 3, 'ngModelChange', 'ngModel'],
        [2, 'max-height', '200px', 'overflow-y', 'auto'],
      ],
      template: function (o, i) {
        o & 1 &&
          (U(0, 'button', 0),
          ie('click', function () {
            return i.getAllPosts()
          }),
          H(1, 'get all posts'),
          V(),
          U(2, 'button', 0),
          ie('click', function () {
            return i.createPost()
          }),
          H(3, 'create new post'),
          V(),
          U(4, 'input', 1),
          yr('ngModelChange', function (a) {
            return fi(i.input, a) || (i.input = a), a
          }),
          V(),
          U(5, 'button', 0),
          ie('click', function () {
            return i.getPost()
          }),
          H(6, 'get post by id'),
          V(),
          U(7, 'button', 0),
          ie('click', function () {
            return i.updatePost()
          }),
          H(8, 'update post by id'),
          V(),
          U(9, 'button', 0),
          ie('click', function () {
            return i.deletePost()
          }),
          H(10, 'delete post by id'),
          V(),
          U(11, 'p')(12, 'strong'),
          H(13, 'Total posts in response:'),
          V(),
          H(14),
          V(),
          U(15, 'div', 2),
          fr(16, eI, 2, 0, 'blockquote')(17, tI, 4, 1)(18, oI, 3, 1),
          V()),
          o & 2 &&
            ($t('disabled', i.loading()),
            oe(2),
            $t('disabled', i.loading()),
            oe(2),
            vr('ngModel', i.input),
            oe(),
            $t('disabled', i.loading()),
            oe(2),
            $t('disabled', i.loading()),
            oe(2),
            $t('disabled', i.loading()),
            oe(5),
            ze(' ', i.totalPosts(), ''),
            oe(2),
            Tf(16, i.loading() ? 16 : i.error() ? 17 : 18))
      },
      dependencies: [Zi, qn, Wr, qi, qr],
      encapsulation: 2,
    }))
  let e = t
  return e
})()
var gp = (() => {
  let t = class t {}
  ;(t.ɵfac = function (o) {
    return new (o || t)()
  }),
    (t.ɵcmp = dt({
      type: t,
      selectors: [['app-root']],
      standalone: !0,
      features: [mt],
      decls: 10,
      vars: 0,
      template: function (o, i) {
        o & 1 &&
          (U(0, 'h1'),
          H(1, 'Signals Store Services'),
          V(),
          U(2, 'h2'),
          H(3, 'Simple Store'),
          V(),
          Nn(4, 'hr')(5, 'app-counter'),
          U(6, 'h2'),
          H(7, 'Fetching Store'),
          V(),
          Nn(8, 'hr')(9, 'app-posts'))
      },
      dependencies: [hp, pp],
      encapsulation: 2,
    }))
  let e = t
  return e
})()
ch(gp, Wh).catch((e) => console.error(e))
