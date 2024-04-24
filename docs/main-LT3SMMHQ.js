var vp = Object.defineProperty,
  yp = Object.defineProperties
var Dp = Object.getOwnPropertyDescriptors
var gc = Object.getOwnPropertySymbols
var wp = Object.prototype.hasOwnProperty,
  Cp = Object.prototype.propertyIsEnumerable
var mc = (e, t, n) =>
    t in e
      ? vp(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  g = (e, t) => {
    for (var n in (t ||= {})) wp.call(t, n) && mc(e, n, t[n])
    if (gc) for (var n of gc(t)) Cp.call(t, n) && mc(e, n, t[n])
    return e
  },
  R = (e, t) => yp(e, Dp(t))
function vc(e, t) {
  return Object.is(e, t)
}
var Q = null,
  Wr = !1,
  Zr = 1,
  Ze = Symbol('SIGNAL')
function O(e) {
  let t = Q
  return (Q = e), t
}
var Qr = {
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
function Xo(e) {
  if (Wr) throw new Error('')
  if (Q === null) return
  Q.consumerOnSignalRead(e)
  let t = Q.nextProducerIndex++
  if ((Qt(Q), t < Q.producerNode.length && Q.producerNode[t] !== e && qn(Q))) {
    let n = Q.producerNode[t]
    Kr(n, Q.producerIndexOfThis[t])
  }
  Q.producerNode[t] !== e &&
    ((Q.producerNode[t] = e),
    (Q.producerIndexOfThis[t] = qn(Q) ? Ec(e, Q, t) : 0)),
    (Q.producerLastReadVersion[t] = e.version)
}
function Ep() {
  Zr++
}
function yc(e) {
  if (!(qn(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === Zr)) {
    if (!e.producerMustRecompute(e) && !ns(e)) {
      ;(e.dirty = !1), (e.lastCleanEpoch = Zr)
      return
    }
    e.producerRecomputeValue(e), (e.dirty = !1), (e.lastCleanEpoch = Zr)
  }
}
function Dc(e) {
  if (e.liveConsumerNode === void 0) return
  let t = Wr
  Wr = !0
  try {
    for (let n of e.liveConsumerNode) n.dirty || Ip(n)
  } finally {
    Wr = t
  }
}
function wc() {
  return Q?.consumerAllowSignalWrites !== !1
}
function Ip(e) {
  ;(e.dirty = !0), Dc(e), e.consumerMarkedDirty?.(e)
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
    if (qn(e))
      for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
        Kr(e.producerNode[n], e.producerIndexOfThis[n])
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
    if (r !== n.version || (yc(n), r !== n.version)) return !0
  }
  return !1
}
function Cc(e) {
  if ((Qt(e), qn(e)))
    for (let t = 0; t < e.producerNode.length; t++)
      Kr(e.producerNode[t], e.producerIndexOfThis[t])
  ;(e.producerNode.length =
    e.producerLastReadVersion.length =
    e.producerIndexOfThis.length =
      0),
    e.liveConsumerNode &&
      (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0)
}
function Ec(e, t, n) {
  if ((Ic(e), Qt(e), e.liveConsumerNode.length === 0))
    for (let r = 0; r < e.producerNode.length; r++)
      e.producerIndexOfThis[r] = Ec(e.producerNode[r], e, r)
  return e.liveConsumerIndexOfThis.push(n), e.liveConsumerNode.push(t) - 1
}
function Kr(e, t) {
  if ((Ic(e), Qt(e), e.liveConsumerNode.length === 1))
    for (let r = 0; r < e.producerNode.length; r++)
      Kr(e.producerNode[r], e.producerIndexOfThis[r])
  let n = e.liveConsumerNode.length - 1
  if (
    ((e.liveConsumerNode[t] = e.liveConsumerNode[n]),
    (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n]),
    e.liveConsumerNode.length--,
    e.liveConsumerIndexOfThis.length--,
    t < e.liveConsumerNode.length)
  ) {
    let r = e.liveConsumerIndexOfThis[t],
      i = e.liveConsumerNode[t]
    Qt(i), (i.producerIndexOfThis[r] = t)
  }
}
function qn(e) {
  return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0
}
function Qt(e) {
  ;(e.producerNode ??= []),
    (e.producerIndexOfThis ??= []),
    (e.producerLastReadVersion ??= [])
}
function Ic(e) {
  ;(e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= [])
}
function bc(e) {
  let t = Object.create(bp)
  t.computation = e
  let n = () => {
    if ((yc(t), Xo(t), t.value === Yr)) throw t.error
    return t.value
  }
  return (n[Ze] = t), n
}
var Ko = Symbol('UNSET'),
  Jo = Symbol('COMPUTING'),
  Yr = Symbol('ERRORED'),
  bp = R(g({}, Qr), {
    value: Ko,
    dirty: !0,
    error: null,
    equal: vc,
    producerMustRecompute(e) {
      return e.value === Ko || e.value === Jo
    },
    producerRecomputeValue(e) {
      if (e.value === Jo) throw new Error('Detected cycle in computations.')
      let t = e.value
      e.value = Jo
      let n = es(e),
        r
      try {
        r = e.computation()
      } catch (i) {
        ;(r = Yr), (e.error = i)
      } finally {
        ts(e, n)
      }
      if (t !== Ko && t !== Yr && r !== Yr && e.equal(t, r)) {
        e.value = t
        return
      }
      ;(e.value = r), e.version++
    },
  })
function Mp() {
  throw new Error()
}
var Mc = Mp
function _c() {
  Mc()
}
function Sc(e) {
  Mc = e
}
var _p = null
function Tc(e) {
  let t = Object.create(xc)
  t.value = e
  let n = () => (Xo(t), t.value)
  return (n[Ze] = t), n
}
function rs(e, t) {
  wc() || _c(), e.equal(e.value, t) || ((e.value = t), Sp(e))
}
function Ac(e, t) {
  wc() || _c(), rs(e, t(e.value))
}
var xc = R(g({}, Qr), { equal: vc, value: void 0 })
function Sp(e) {
  e.version++, Ep(), Dc(e), _p?.()
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
var Jr = Kt(
  (e) =>
    function (n) {
      e(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, i) => `${i + 1}) ${r.toString()}`).join(`
  `)}`
          : ''),
        (this.name = 'UnsubscriptionError'),
        (this.errors = n)
    },
)
function Wn(e, t) {
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
          for (let o of n) o.remove(this)
        else n.remove(this)
      let { initialTeardown: r } = this
      if (_(r))
        try {
          r()
        } catch (o) {
          t = o instanceof Jr ? o.errors : [o]
        }
      let { _finalizers: i } = this
      if (i) {
        this._finalizers = null
        for (let o of i)
          try {
            Nc(o)
          } catch (s) {
            ;(t = t ?? []),
              s instanceof Jr ? (t = [...t, ...s.errors]) : t.push(s)
          }
      }
      if (t) throw new Jr(t)
    }
  }
  add(t) {
    var n
    if (t && t !== this)
      if (this.closed) Nc(t)
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
    n === t ? (this._parentage = null) : Array.isArray(n) && Wn(n, t)
  }
  remove(t) {
    let { _finalizers: n } = this
    n && Wn(n, t), t instanceof e && t._removeParent(this)
  }
}
Z.EMPTY = (() => {
  let e = new Z()
  return (e.closed = !0), e
})()
var is = Z.EMPTY
function Xr(e) {
  return (
    e instanceof Z ||
    (e && 'closed' in e && _(e.remove) && _(e.add) && _(e.unsubscribe))
  )
}
function Nc(e) {
  _(e) ? e() : e.unsubscribe()
}
var Te = {
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
function ei(e) {
  Jt.setTimeout(() => {
    let { onUnhandledError: t } = Te
    if (t) t(e)
    else throw e
  })
}
function Zn() {}
var Rc = os('C', void 0, void 0)
function Oc(e) {
  return os('E', void 0, e)
}
function Fc(e) {
  return os('N', e, void 0)
}
function os(e, t, n) {
  return { kind: e, value: t, error: n }
}
var Et = null
function Xt(e) {
  if (Te.useDeprecatedSynchronousErrorHandling) {
    let t = !Et
    if ((t && (Et = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = Et
      if (((Et = null), n)) throw r
    }
  } else e()
}
function Pc(e) {
  Te.useDeprecatedSynchronousErrorHandling &&
    Et &&
    ((Et.errorThrown = !0), (Et.error = e))
}
var It = class extends Z {
    constructor(t) {
      super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), Xr(t) && t.add(this))
          : (this.destination = xp)
    }
    static create(t, n, r) {
      return new en(t, n, r)
    }
    next(t) {
      this.isStopped ? as(Fc(t), this) : this._next(t)
    }
    error(t) {
      this.isStopped ? as(Oc(t), this) : ((this.isStopped = !0), this._error(t))
    }
    complete() {
      this.isStopped ? as(Rc, this) : ((this.isStopped = !0), this._complete())
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
  Tp = Function.prototype.bind
function ss(e, t) {
  return Tp.call(e, t)
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
          ti(r)
        }
    }
    error(t) {
      let { partialObserver: n } = this
      if (n.error)
        try {
          n.error(t)
        } catch (r) {
          ti(r)
        }
      else ti(t)
    }
    complete() {
      let { partialObserver: t } = this
      if (t.complete)
        try {
          t.complete()
        } catch (n) {
          ti(n)
        }
    }
  },
  en = class extends It {
    constructor(t, n, r) {
      super()
      let i
      if (_(t) || !t)
        i = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 }
      else {
        let o
        this && Te.useDeprecatedNextContext
          ? ((o = Object.create(t)),
            (o.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: t.next && ss(t.next, o),
              error: t.error && ss(t.error, o),
              complete: t.complete && ss(t.complete, o),
            }))
          : (i = t)
      }
      this.destination = new us(i)
    }
  }
function ti(e) {
  Te.useDeprecatedSynchronousErrorHandling ? Pc(e) : ei(e)
}
function Ap(e) {
  throw e
}
function as(e, t) {
  let { onStoppedNotification: n } = Te
  n && Jt.setTimeout(() => n(e, t))
}
var xp = { closed: !0, next: Zn, error: Ap, complete: Zn }
var tn = (typeof Symbol == 'function' && Symbol.observable) || '@@observable'
function me(e) {
  return e
}
function cs(...e) {
  return ls(e)
}
function ls(e) {
  return e.length === 0
    ? me
    : e.length === 1
      ? e[0]
      : function (n) {
          return e.reduce((r, i) => i(r), n)
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
    subscribe(n, r, i) {
      let o = Rp(n) ? n : new en(n, r, i)
      return (
        Xt(() => {
          let { operator: s, source: a } = this
          o.add(
            s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o),
          )
        }),
        o
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
        (r = kc(r)),
        new r((i, o) => {
          let s = new en({
            next: (a) => {
              try {
                n(a)
              } catch (u) {
                o(u), s.unsubscribe()
              }
            },
            error: o,
            complete: i,
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
        (n = kc(n)),
        new n((r, i) => {
          let o
          this.subscribe(
            (s) => (o = s),
            (s) => i(s),
            () => r(o),
          )
        })
      )
    }
  }
  return (e.create = (t) => new e(t)), e
})()
function kc(e) {
  var t
  return (t = e ?? Te.Promise) !== null && t !== void 0 ? t : Promise
}
function Np(e) {
  return e && _(e.next) && _(e.error) && _(e.complete)
}
function Rp(e) {
  return (e && e instanceof It) || (Np(e) && Xr(e))
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
function N(e, t, n, r, i) {
  return new fs(e, t, n, r, i)
}
var fs = class extends It {
  constructor(t, n, r, i, o, s) {
    super(t),
      (this.onFinalize = o),
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
      (this._error = i
        ? function (a) {
            try {
              i(a)
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
      let i = e._connection,
        o = n
      ;(n = null), i && (!o || i === o) && i.unsubscribe(), t.unsubscribe()
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
var Lc = Kt(
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
        let r = new ni(this, this)
        return (r.operator = n), r
      }
      _throwIfClosed() {
        if (this.closed) throw new Lc()
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
        let { hasError: r, isStopped: i, observers: o } = this
        return r || i
          ? is
          : ((this.currentObservers = null),
            o.push(n),
            new Z(() => {
              ;(this.currentObservers = null), Wn(o, n)
            }))
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: i, isStopped: o } = this
        r ? n.error(i) : o && n.complete()
      }
      asObservable() {
        let n = new k()
        return (n.source = this), n
      }
    }
    return (e.create = (t, n) => new ni(t, n)), e
  })(),
  ni = class extends se {
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
        : is
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
var ve = new k((e) => e.complete())
function Vc(e) {
  return e && _(e.schedule)
}
function jc(e) {
  return e[e.length - 1]
}
function ri(e) {
  return _(jc(e)) ? e.pop() : void 0
}
function it(e) {
  return Vc(jc(e)) ? e.pop() : void 0
}
function $c(e, t, n, r) {
  function i(o) {
    return o instanceof n
      ? o
      : new n(function (s) {
          s(o)
        })
  }
  return new (n || (n = Promise))(function (o, s) {
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
      l.done ? o(l.value) : i(l.value).then(a, u)
    }
    c((r = r.apply(e, t || [])).next())
  })
}
function Uc(e) {
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
function Bc(e, t, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError('Symbol.asyncIterator is not defined.')
  var r = n.apply(e, t || []),
    i,
    o = []
  return (
    (i = {}),
    s('next'),
    s('throw'),
    s('return'),
    (i[Symbol.asyncIterator] = function () {
      return this
    }),
    i
  )
  function s(f) {
    r[f] &&
      (i[f] = function (h) {
        return new Promise(function (m, M) {
          o.push([f, h, m, M]) > 1 || a(f, h)
        })
      })
  }
  function a(f, h) {
    try {
      u(r[f](h))
    } catch (m) {
      d(o[0][3], m)
    }
  }
  function u(f) {
    f.value instanceof bt
      ? Promise.resolve(f.value.v).then(c, l)
      : d(o[0][2], f)
  }
  function c(f) {
    a('next', f)
  }
  function l(f) {
    a('throw', f)
  }
  function d(f, h) {
    f(h), o.shift(), o.length && a(o[0][0], o[0][1])
  }
}
function Hc(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError('Symbol.asyncIterator is not defined.')
  var t = e[Symbol.asyncIterator],
    n
  return t
    ? t.call(e)
    : ((e = typeof Uc == 'function' ? Uc(e) : e[Symbol.iterator]()),
      (n = {}),
      r('next'),
      r('throw'),
      r('return'),
      (n[Symbol.asyncIterator] = function () {
        return this
      }),
      n)
  function r(o) {
    n[o] =
      e[o] &&
      function (s) {
        return new Promise(function (a, u) {
          ;(s = e[o](s)), i(a, u, s.done, s.value)
        })
      }
  }
  function i(o, s, a, u) {
    Promise.resolve(u).then(function (c) {
      o({ value: c, done: a })
    }, s)
  }
}
var ii = (e) => e && typeof e.length == 'number' && typeof e != 'function'
function oi(e) {
  return _(e?.then)
}
function si(e) {
  return _(e[tn])
}
function ai(e) {
  return Symbol.asyncIterator && _(e?.[Symbol.asyncIterator])
}
function ui(e) {
  return new TypeError(
    `You provided ${e !== null && typeof e == 'object' ? 'an invalid object' : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  )
}
function Op() {
  return typeof Symbol != 'function' || !Symbol.iterator
    ? '@@iterator'
    : Symbol.iterator
}
var ci = Op()
function li(e) {
  return _(e?.[ci])
}
function di(e) {
  return Bc(this, arguments, function* () {
    let n = e.getReader()
    try {
      for (;;) {
        let { value: r, done: i } = yield bt(n.read())
        if (i) return yield bt(void 0)
        yield yield bt(r)
      }
    } finally {
      n.releaseLock()
    }
  })
}
function fi(e) {
  return _(e?.getReader)
}
function W(e) {
  if (e instanceof k) return e
  if (e != null) {
    if (si(e)) return Fp(e)
    if (ii(e)) return Pp(e)
    if (oi(e)) return kp(e)
    if (ai(e)) return zc(e)
    if (li(e)) return Lp(e)
    if (fi(e)) return Vp(e)
  }
  throw ui(e)
}
function Fp(e) {
  return new k((t) => {
    let n = e[tn]()
    if (_(n.subscribe)) return n.subscribe(t)
    throw new TypeError(
      'Provided object does not correctly implement Symbol.observable',
    )
  })
}
function Pp(e) {
  return new k((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n])
    t.complete()
  })
}
function kp(e) {
  return new k((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete())
      },
      (n) => t.error(n),
    ).then(null, ei)
  })
}
function Lp(e) {
  return new k((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return
    t.complete()
  })
}
function zc(e) {
  return new k((t) => {
    jp(e, t).catch((n) => t.error(n))
  })
}
function Vp(e) {
  return zc(di(e))
}
function jp(e, t) {
  var n, r, i, o
  return $c(this, void 0, void 0, function* () {
    try {
      for (n = Hc(e); (r = yield n.next()), !r.done; ) {
        let s = r.value
        if ((t.next(s), t.closed)) return
      }
    } catch (s) {
      i = { error: s }
    } finally {
      try {
        r && !r.done && (o = n.return) && (yield o.call(n))
      } finally {
        if (i) throw i.error
      }
    }
    t.complete()
  })
}
function de(e, t, n, r = 0, i = !1) {
  let o = t.schedule(function () {
    n(), i ? e.add(this.schedule(null, r)) : this.unsubscribe()
  }, r)
  if ((e.add(o), !i)) return o
}
function hi(e, t = 0) {
  return F((n, r) => {
    n.subscribe(
      N(
        r,
        (i) => de(r, e, () => r.next(i), t),
        () => de(r, e, () => r.complete(), t),
        (i) => de(r, e, () => r.error(i), t),
      ),
    )
  })
}
function pi(e, t = 0) {
  return F((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t))
  })
}
function Gc(e, t) {
  return W(e).pipe(pi(t), hi(t))
}
function qc(e, t) {
  return W(e).pipe(pi(t), hi(t))
}
function Wc(e, t) {
  return new k((n) => {
    let r = 0
    return t.schedule(function () {
      r === e.length
        ? n.complete()
        : (n.next(e[r++]), n.closed || this.schedule())
    })
  })
}
function Zc(e, t) {
  return new k((n) => {
    let r
    return (
      de(n, t, () => {
        ;(r = e[ci]()),
          de(
            n,
            t,
            () => {
              let i, o
              try {
                ;({ value: i, done: o } = r.next())
              } catch (s) {
                n.error(s)
                return
              }
              o ? n.complete() : n.next(i)
            },
            0,
            !0,
          )
      }),
      () => _(r?.return) && r.return()
    )
  })
}
function gi(e, t) {
  if (!e) throw new Error('Iterable cannot be null')
  return new k((n) => {
    de(n, t, () => {
      let r = e[Symbol.asyncIterator]()
      de(
        n,
        t,
        () => {
          r.next().then((i) => {
            i.done ? n.complete() : n.next(i.value)
          })
        },
        0,
        !0,
      )
    })
  })
}
function Yc(e, t) {
  return gi(di(e), t)
}
function Qc(e, t) {
  if (e != null) {
    if (si(e)) return Gc(e, t)
    if (ii(e)) return Wc(e, t)
    if (oi(e)) return qc(e, t)
    if (ai(e)) return gi(e, t)
    if (li(e)) return Zc(e, t)
    if (fi(e)) return Yc(e, t)
  }
  throw ui(e)
}
function z(e, t) {
  return t ? Qc(e, t) : W(e)
}
function b(...e) {
  let t = it(e)
  return z(e, t)
}
function on(e, t) {
  let n = _(e) ? e : () => e,
    r = (i) => i.error(n())
  return new k(t ? (i) => t.schedule(r, 0, i) : r)
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
    let i = 0
    n.subscribe(
      N(r, (o) => {
        r.next(e.call(t, o, i++))
      }),
    )
  })
}
var { isArray: Up } = Array
function $p(e, t) {
  return Up(t) ? e(...t) : e(t)
}
function mi(e) {
  return E((t) => $p(e, t))
}
var { isArray: Bp } = Array,
  { getPrototypeOf: Hp, prototype: zp, keys: Gp } = Object
function vi(e) {
  if (e.length === 1) {
    let t = e[0]
    if (Bp(t)) return { args: t, keys: null }
    if (qp(t)) {
      let n = Gp(t)
      return { args: n.map((r) => t[r]), keys: n }
    }
  }
  return { args: e, keys: null }
}
function qp(e) {
  return e && typeof e == 'object' && Hp(e) === zp
}
function yi(e, t) {
  return e.reduce((n, r, i) => ((n[r] = t[i]), n), {})
}
function Di(...e) {
  let t = it(e),
    n = ri(e),
    { args: r, keys: i } = vi(e)
  if (r.length === 0) return z([], t)
  let o = new k(Wp(r, t, i ? (s) => yi(i, s) : me))
  return n ? o.pipe(mi(n)) : o
}
function Wp(e, t, n = me) {
  return (r) => {
    Kc(
      t,
      () => {
        let { length: i } = e,
          o = new Array(i),
          s = i,
          a = i
        for (let u = 0; u < i; u++)
          Kc(
            t,
            () => {
              let c = z(e[u], t),
                l = !1
              c.subscribe(
                N(
                  r,
                  (d) => {
                    ;(o[u] = d), l || ((l = !0), a--), a || r.next(n(o.slice()))
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
function Kc(e, t, n) {
  e ? de(n, e, t) : t()
}
function Jc(e, t, n, r, i, o, s, a) {
  let u = [],
    c = 0,
    l = 0,
    d = !1,
    f = () => {
      d && !u.length && !c && t.complete()
    },
    h = (M) => (c < r ? m(M) : u.push(M)),
    m = (M) => {
      o && t.next(M), c++
      let y = !1
      W(n(M, l++)).subscribe(
        N(
          t,
          (v) => {
            i?.(v), o ? h(v) : t.next(v)
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
    ? Y((r, i) => E((o, s) => t(r, o, i, s))(W(e(r, i))), n)
    : (typeof t == 'number' && (n = t), F((r, i) => Jc(r, i, e, n)))
}
function ps(e = 1 / 0) {
  return Y(me, e)
}
function Xc() {
  return ps(1)
}
function sn(...e) {
  return Xc()(z(e, it(e)))
}
function wi(e) {
  return new k((t) => {
    W(e()).subscribe(t)
  })
}
function gs(...e) {
  let t = ri(e),
    { args: n, keys: r } = vi(e),
    i = new k((o) => {
      let { length: s } = n
      if (!s) {
        o.complete()
        return
      }
      let a = new Array(s),
        u = s,
        c = s
      for (let l = 0; l < s; l++) {
        let d = !1
        W(n[l]).subscribe(
          N(
            o,
            (f) => {
              d || ((d = !0), c--), (a[l] = f)
            },
            () => u--,
            void 0,
            () => {
              ;(!u || !d) && (c || o.next(r ? yi(r, a) : a), o.complete())
            },
          ),
        )
      }
    })
  return t ? i.pipe(mi(t)) : i
}
function ye(e, t) {
  return F((n, r) => {
    let i = 0
    n.subscribe(N(r, (o) => e.call(t, o, i++) && r.next(o)))
  })
}
function Ae(e) {
  return F((t, n) => {
    let r = null,
      i = !1,
      o
    ;(r = t.subscribe(
      N(n, void 0, void 0, (s) => {
        ;(o = W(e(s, Ae(e)(t)))),
          r ? (r.unsubscribe(), (r = null), o.subscribe(n)) : (i = !0)
      }),
    )),
      i && (r.unsubscribe(), (r = null), o.subscribe(n))
  })
}
function el(e, t, n, r, i) {
  return (o, s) => {
    let a = n,
      u = t,
      c = 0
    o.subscribe(
      N(
        s,
        (l) => {
          let d = c++
          ;(u = a ? e(u, l, d) : ((a = !0), l)), r && s.next(u)
        },
        i &&
          (() => {
            a && s.next(u), s.complete()
          }),
      ),
    )
  }
}
function ot(e, t) {
  return _(t) ? Y(e, t, 1) : Y(e, 1)
}
function st(e) {
  return F((t, n) => {
    let r = !1
    t.subscribe(
      N(
        n,
        (i) => {
          ;(r = !0), n.next(i)
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
    ? () => ve
    : F((t, n) => {
        let r = 0
        t.subscribe(
          N(n, (i) => {
            ++r <= e && (n.next(i), e <= r && n.complete())
          }),
        )
      })
}
function ms(e) {
  return E(() => e)
}
function Ci(e = Zp) {
  return F((t, n) => {
    let r = !1
    t.subscribe(
      N(
        n,
        (i) => {
          ;(r = !0), n.next(i)
        },
        () => (r ? n.complete() : n.error(e())),
      ),
    )
  })
}
function Zp() {
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
      e ? ye((i, o) => e(i, o, r)) : me,
      Qe(1),
      n ? st(t) : Ci(() => new Ye()),
    )
}
function an(e) {
  return e <= 0
    ? () => ve
    : F((t, n) => {
        let r = []
        t.subscribe(
          N(
            n,
            (i) => {
              r.push(i), e < r.length && r.shift()
            },
            () => {
              for (let i of r) n.next(i)
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
      e ? ye((i, o) => e(i, o, r)) : me,
      an(1),
      n ? st(t) : Ci(() => new Ye()),
    )
}
function ys(e, t) {
  return F(el(e, t, arguments.length >= 2, !0))
}
function Ds(...e) {
  let t = it(e)
  return F((n, r) => {
    ;(t ? sn(e, n, t) : sn(e, n)).subscribe(r)
  })
}
function De(e, t) {
  return F((n, r) => {
    let i = null,
      o = 0,
      s = !1,
      a = () => s && !i && r.complete()
    n.subscribe(
      N(
        r,
        (u) => {
          i?.unsubscribe()
          let c = 0,
            l = o++
          W(e(u, l)).subscribe(
            (i = N(
              r,
              (d) => r.next(t ? t(u, d, l, c++) : d),
              () => {
                ;(i = null), a()
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
    W(e).subscribe(N(n, () => n.complete(), Zn)), !n.closed && t.subscribe(n)
  })
}
function G(e, t, n) {
  let r = _(e) || t || n ? { next: e, error: t, complete: n } : e
  return r
    ? F((i, o) => {
        var s
        ;(s = r.subscribe) === null || s === void 0 || s.call(r)
        let a = !0
        i.subscribe(
          N(
            o,
            (u) => {
              var c
              ;(c = r.next) === null || c === void 0 || c.call(r, u), o.next(u)
            },
            () => {
              var u
              ;(a = !1),
                (u = r.complete) === null || u === void 0 || u.call(r),
                o.complete()
            },
            (u) => {
              var c
              ;(a = !1),
                (c = r.error) === null || c === void 0 || c.call(r, u),
                o.error(u)
            },
            () => {
              var u, c
              a && ((u = r.unsubscribe) === null || u === void 0 || u.call(r)),
                (c = r.finalize) === null || c === void 0 || c.call(r)
            },
          ),
        )
      })
    : me
}
var Qp = 'https://g.co/ng/security#xss',
  w = class extends Error {
    constructor(t, n) {
      super(Wi(t, n)), (this.code = t)
    }
  }
function Wi(e, t) {
  return `${`NG0${Math.abs(e)}`}${t ? ': ' + t : ''}`
}
function Zi(e) {
  return { toString: e }.toString()
}
var Yn = globalThis
function j(e) {
  for (let t in e) if (e[t] === j) return t
  throw Error('Could not find renamed property on target object.')
}
function Kp(e, t) {
  for (let n in t) t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n])
}
function fe(e) {
  if (typeof e == 'string') return e
  if (Array.isArray(e)) return '[' + e.map(fe).join(', ') + ']'
  if (e == null) return '' + e
  if (e.overriddenName) return `${e.overriddenName}`
  if (e.name) return `${e.name}`
  let t = e.toString()
  if (t == null) return '' + t
  let n = t.indexOf(`
`)
  return n === -1 ? t : t.substring(0, n)
}
function tl(e, t) {
  return e == null || e === ''
    ? t === null
      ? ''
      : t
    : t == null || t === ''
      ? e
      : e + ' ' + t
}
var Jp = j({ __forward_ref__: j })
function En(e) {
  return (
    (e.__forward_ref__ = En),
    (e.toString = function () {
      return fe(this())
    }),
    e
  )
}
function ae(e) {
  return kl(e) ? e() : e
}
function kl(e) {
  return (
    typeof e == 'function' && e.hasOwnProperty(Jp) && e.__forward_ref__ === En
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
function Yi(e) {
  return nl(e, Vl) || nl(e, jl)
}
function Ll(e) {
  return Yi(e) !== null
}
function nl(e, t) {
  return e.hasOwnProperty(t) ? e[t] : null
}
function Xp(e) {
  let t = e && (e[Vl] || e[jl])
  return t || null
}
function rl(e) {
  return e && (e.hasOwnProperty(il) || e.hasOwnProperty(eg)) ? e[il] : null
}
var Vl = j({ ɵprov: j }),
  il = j({ ɵinj: j }),
  jl = j({ ngInjectableDef: j }),
  eg = j({ ngInjectorDef: j }),
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
function Ul(e) {
  return e && !!e.ɵproviders
}
var tg = j({ ɵcmp: j }),
  ng = j({ ɵdir: j }),
  rg = j({ ɵpipe: j }),
  ig = j({ ɵmod: j }),
  Ai = j({ ɵfac: j }),
  Qn = j({ __NG_ELEMENT_ID__: j }),
  ol = j({ __NG_ENV_ID__: j })
function $l(e) {
  return typeof e == 'string' ? e : e == null ? '' : String(e)
}
function og(e) {
  return typeof e == 'function'
    ? e.name || e.toString()
    : typeof e == 'object' && e != null && typeof e.type == 'function'
      ? e.type.name || e.type.toString()
      : $l(e)
}
function sg(e, t) {
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
function Bl() {
  return Ls
}
function Ee(e) {
  let t = Ls
  return (Ls = e), t
}
function Hl(e, t, n) {
  let r = Yi(e)
  if (r && r.providedIn == 'root')
    return r.value === void 0 ? (r.value = r.factory()) : r.value
  if (n & x.Optional) return null
  if (t !== void 0) return t
  Ma(e, 'Injector')
}
var ag = {},
  Kn = ag,
  ug = '__NG_DI_FLAG__',
  xi = 'ngTempTokenPath',
  cg = 'ngTokenPath',
  lg = /\n/gm,
  dg = '\u0275',
  sl = '__source',
  dn
function fg() {
  return dn
}
function at(e) {
  let t = dn
  return (dn = e), t
}
function hg(e, t = x.Default) {
  if (dn === void 0) throw new w(-203, !1)
  return dn === null
    ? Hl(e, void 0, t)
    : dn.get(e, t & x.Optional ? null : void 0, t)
}
function S(e, t = x.Default) {
  return (Bl() || hg)(ae(e), t)
}
function p(e, t = x.Default) {
  return S(e, Qi(t))
}
function Qi(e) {
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
      let i,
        o = x.Default
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          u = pg(a)
        typeof u == 'number' ? (u === -1 ? (i = a.token) : (o |= u)) : (i = a)
      }
      t.push(S(i, o))
    } else t.push(S(r))
  }
  return t
}
function pg(e) {
  return e[ug]
}
function gg(e, t, n, r) {
  let i = e[xi]
  throw (
    (t[sl] && i.unshift(t[sl]),
    (e.message = mg(
      `
` + e.message,
      i,
      n,
      r,
    )),
    (e[cg] = i),
    (e[xi] = null),
    e)
  )
}
function mg(e, t, n, r = null) {
  e =
    e &&
    e.charAt(0) ===
      `
` &&
    e.charAt(1) == dg
      ? e.slice(2)
      : e
  let i = fe(t)
  if (Array.isArray(t)) i = t.map(fe).join(' -> ')
  else if (typeof t == 'object') {
    let o = []
    for (let s in t)
      if (t.hasOwnProperty(s)) {
        let a = t[s]
        o.push(s + ':' + (typeof a == 'string' ? JSON.stringify(a) : fe(a)))
      }
    i = `{${o.join(', ')}}`
  }
  return `${n}${r ? '(' + r + ')' : ''}[${i}]: ${e.replace(
    lg,
    `
  `,
  )}`
}
function hn(e, t) {
  let n = e.hasOwnProperty(Ai)
  return n ? e[Ai] : null
}
function _a(e, t) {
  e.forEach((n) => (Array.isArray(n) ? _a(n, t) : t(n)))
}
function zl(e, t, n) {
  t >= e.length ? e.push(n) : e.splice(t, 0, n)
}
function Ni(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0]
}
function vg(e, t, n, r) {
  let i = e.length
  if (i == t) e.push(n, r)
  else if (i === 1) e.push(r, e[0]), (e[0] = n)
  else {
    for (i--, e.push(e[i - 1], e[i]); i > t; ) {
      let o = i - 2
      ;(e[i] = e[o]), i--
    }
    ;(e[t] = n), (e[t + 1] = r)
  }
}
function yg(e, t, n) {
  let r = hr(e, t)
  return r >= 0 ? (e[r | 1] = n) : ((r = ~r), vg(e, r, t, n)), r
}
function Cs(e, t) {
  let n = hr(e, t)
  if (n >= 0) return e[n | 1]
}
function hr(e, t) {
  return Dg(e, t, 1)
}
function Dg(e, t, n) {
  let r = 0,
    i = e.length >> n
  for (; i !== r; ) {
    let o = r + ((i - r) >> 1),
      s = e[o << n]
    if (t === s) return o << n
    s > t ? (i = o) : (r = o + 1)
  }
  return ~(i << n)
}
var pn = {},
  Ie = [],
  gn = new C(''),
  Gl = new C('', -1),
  ql = new C(''),
  Ri = class {
    get(t, n = Kn) {
      if (n === Kn) {
        let r = new Error(`NullInjectorError: No provider for ${fe(t)}!`)
        throw ((r.name = 'NullInjectorError'), r)
      }
      return n
    }
  },
  Wl = (function (e) {
    return (e[(e.OnPush = 0)] = 'OnPush'), (e[(e.Default = 1)] = 'Default'), e
  })(Wl || {}),
  Ue = (function (e) {
    return (
      (e[(e.Emulated = 0)] = 'Emulated'),
      (e[(e.None = 2)] = 'None'),
      (e[(e.ShadowDom = 3)] = 'ShadowDom'),
      e
    )
  })(Ue || {}),
  be = (function (e) {
    return (
      (e[(e.None = 0)] = 'None'),
      (e[(e.SignalBased = 1)] = 'SignalBased'),
      (e[(e.HasDecoratorInputTransform = 2)] = 'HasDecoratorInputTransform'),
      e
    )
  })(be || {})
function wg(e, t, n) {
  let r = e.length
  for (;;) {
    let i = e.indexOf(t, n)
    if (i === -1) return i
    if (i === 0 || e.charCodeAt(i - 1) <= 32) {
      let o = t.length
      if (i + o === r || e.charCodeAt(i + o) <= 32) return i
    }
    n = i + 1
  }
}
function js(e, t, n) {
  let r = 0
  for (; r < n.length; ) {
    let i = n[r]
    if (typeof i == 'number') {
      if (i !== 0) break
      r++
      let o = n[r++],
        s = n[r++],
        a = n[r++]
      e.setAttribute(t, s, a, o)
    } else {
      let o = i,
        s = n[++r]
      Eg(o) ? e.setProperty(t, o, s) : e.setAttribute(t, o, s), r++
    }
  }
  return r
}
function Cg(e) {
  return e === 3 || e === 4 || e === 6
}
function Eg(e) {
  return e.charCodeAt(0) === 64
}
function Jn(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice()
    else {
      let n = -1
      for (let r = 0; r < t.length; r++) {
        let i = t[r]
        typeof i == 'number'
          ? (n = i)
          : n === 0 ||
            (n === -1 || n === 2
              ? al(e, n, i, null, t[++r])
              : al(e, n, i, null, null))
      }
    }
  return e
}
function al(e, t, n, r, i) {
  let o = 0,
    s = e.length
  if (t === -1) s = -1
  else
    for (; o < e.length; ) {
      let a = e[o++]
      if (typeof a == 'number') {
        if (a === t) {
          s = -1
          break
        } else if (a > t) {
          s = o - 1
          break
        }
      }
    }
  for (; o < e.length; ) {
    let a = e[o]
    if (typeof a == 'number') break
    if (a === n) {
      if (r === null) {
        i !== null && (e[o + 1] = i)
        return
      } else if (r === e[o + 1]) {
        e[o + 2] = i
        return
      }
    }
    o++, r !== null && o++, i !== null && o++
  }
  s !== -1 && (e.splice(s, 0, t), (o = s + 1)),
    e.splice(o++, 0, n),
    r !== null && e.splice(o++, 0, r),
    i !== null && e.splice(o++, 0, i)
}
var Zl = 'ng-template'
function Ig(e, t, n, r) {
  let i = 0
  if (r) {
    for (; i < t.length && typeof t[i] == 'string'; i += 2)
      if (t[i] === 'class' && wg(t[i + 1].toLowerCase(), n, 0) !== -1) return !0
  } else if (Sa(e)) return !1
  if (((i = t.indexOf(1, i)), i > -1)) {
    let o
    for (; ++i < t.length && typeof (o = t[i]) == 'string'; )
      if (o.toLowerCase() === n) return !0
  }
  return !1
}
function Sa(e) {
  return e.type === 4 && e.value !== Zl
}
function bg(e, t, n) {
  let r = e.type === 4 && !n ? Zl : e.value
  return t === r
}
function Mg(e, t, n) {
  let r = 4,
    i = e.attrs,
    o = i !== null ? Tg(i) : 0,
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
          (u !== '' && !bg(e, u, n)) || (u === '' && t.length === 1))
        ) {
          if (xe(r)) return !1
          s = !0
        }
      } else if (r & 8) {
        if (i === null || !Ig(e, i, u, n)) {
          if (xe(r)) return !1
          s = !0
        }
      } else {
        let c = t[++a],
          l = _g(u, i, Sa(e), n)
        if (l === -1) {
          if (xe(r)) return !1
          s = !0
          continue
        }
        if (c !== '') {
          let d
          if (
            (l > o ? (d = '') : (d = i[l + 1].toLowerCase()), r & 2 && c !== d)
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
function _g(e, t, n, r) {
  if (t === null) return -1
  let i = 0
  if (r || !n) {
    let o = !1
    for (; i < t.length; ) {
      let s = t[i]
      if (s === e) return i
      if (s === 3 || s === 6) o = !0
      else if (s === 1 || s === 2) {
        let a = t[++i]
        for (; typeof a == 'string'; ) a = t[++i]
        continue
      } else {
        if (s === 4) break
        if (s === 0) {
          i += 4
          continue
        }
      }
      i += o ? 1 : 2
    }
    return -1
  } else return Ag(t, e)
}
function Sg(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if (Mg(e, t[r], n)) return !0
  return !1
}
function Tg(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t]
    if (Cg(n)) return t
  }
  return e.length
}
function Ag(e, t) {
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
function ul(e, t) {
  return e ? ':not(' + t.trim() + ')' : t
}
function xg(e) {
  let t = e[0],
    n = 1,
    r = 2,
    i = '',
    o = !1
  for (; n < e.length; ) {
    let s = e[n]
    if (typeof s == 'string')
      if (r & 2) {
        let a = e[++n]
        i += '[' + s + (a.length > 0 ? '="' + a + '"' : '') + ']'
      } else r & 8 ? (i += '.' + s) : r & 4 && (i += ' ' + s)
    else
      i !== '' && !xe(s) && ((t += ul(o, i)), (i = '')),
        (r = s),
        (o = o || !xe(r))
    n++
  }
  return i !== '' && (t += ul(o, i)), t
}
function Ng(e) {
  return e.map(xg).join(',')
}
function Rg(e) {
  let t = [],
    n = [],
    r = 1,
    i = 2
  for (; r < e.length; ) {
    let o = e[r]
    if (typeof o == 'string')
      i === 2 ? o !== '' && t.push(o, e[++r]) : i === 8 && n.push(o)
    else {
      if (!xe(i)) break
      i = o
    }
    r++
  }
  return { attrs: t, classes: n }
}
function dt(e) {
  return Zi(() => {
    let t = Xl(e),
      n = R(g({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === Wl.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || Ue.Emulated,
        styles: e.styles || Ie,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: '',
      })
    ed(n)
    let r = e.dependencies
    return (
      (n.directiveDefs = ll(r, !1)), (n.pipeDefs = ll(r, !0)), (n.id = Pg(n)), n
    )
  })
}
function Og(e) {
  return Tt(e) || Yl(e)
}
function Fg(e) {
  return e !== null
}
function kt(e) {
  return Zi(() => ({
    type: e.type,
    bootstrap: e.bootstrap || Ie,
    declarations: e.declarations || Ie,
    imports: e.imports || Ie,
    exports: e.exports || Ie,
    transitiveCompileScopes: null,
    schemas: e.schemas || null,
    id: e.id || null,
  }))
}
function cl(e, t) {
  if (e == null) return pn
  let n = {}
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let i = e[r],
        o,
        s,
        a = be.None
      Array.isArray(i)
        ? ((a = i[0]), (o = i[1]), (s = i[2] ?? o))
        : ((o = i), (s = i)),
        t ? ((n[o] = a !== be.None ? [r, a] : r), (t[o] = s)) : (n[o] = r)
    }
  return n
}
function He(e) {
  return Zi(() => {
    let t = Xl(e)
    return ed(t), t
  })
}
function Tt(e) {
  return e[tg] || null
}
function Yl(e) {
  return e[ng] || null
}
function Ql(e) {
  return e[rg] || null
}
function Kl(e) {
  let t = Tt(e) || Yl(e) || Ql(e)
  return t !== null ? t.standalone : !1
}
function Jl(e, t) {
  let n = e[ig] || null
  if (!n && t === !0)
    throw new Error(`Type ${fe(e)} does not have '\u0275mod' property.`)
  return n
}
function Xl(e) {
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
    selectors: e.selectors || Ie,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: cl(e.inputs, t),
    outputs: cl(e.outputs),
    debugInfo: null,
  }
}
function ed(e) {
  e.features?.forEach((t) => t(e))
}
function ll(e, t) {
  if (!e) return null
  let n = t ? Ql : Og
  return () => (typeof e == 'function' ? e() : e).map((r) => n(r)).filter(Fg)
}
function Pg(e) {
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
  for (let i of n) t = (Math.imul(31, t) + i.charCodeAt(0)) << 0
  return (t += 2147483648), 'c' + t
}
function In(e) {
  return { ɵproviders: e }
}
function kg(...e) {
  return { ɵproviders: td(!0, e), ɵfromNgModule: !0 }
}
function td(e, ...t) {
  let n = [],
    r = new Set(),
    i,
    o = (s) => {
      n.push(s)
    }
  return (
    _a(t, (s) => {
      let a = s
      Us(a, o, [], r) && ((i ||= []), i.push(a))
    }),
    i !== void 0 && nd(i, o),
    n
  )
}
function nd(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: i } = e[n]
    Ta(i, (o) => {
      t(o, r)
    })
  }
}
function Us(e, t, n, r) {
  if (((e = ae(e)), !e)) return !1
  let i = null,
    o = rl(e),
    s = !o && Tt(e)
  if (!o && !s) {
    let u = e.ngModule
    if (((o = rl(u)), o)) i = u
    else return !1
  } else {
    if (s && !s.standalone) return !1
    i = e
  }
  let a = r.has(i)
  if (s) {
    if (a) return !1
    if ((r.add(i), s.dependencies)) {
      let u =
        typeof s.dependencies == 'function' ? s.dependencies() : s.dependencies
      for (let c of u) Us(c, t, n, r)
    }
  } else if (o) {
    if (o.imports != null && !a) {
      r.add(i)
      let c
      try {
        _a(o.imports, (l) => {
          Us(l, t, n, r) && ((c ||= []), c.push(l))
        })
      } finally {
      }
      c !== void 0 && nd(c, t)
    }
    if (!a) {
      let c = hn(i) || (() => new i())
      t({ provide: i, useFactory: c, deps: Ie }, i),
        t({ provide: ql, useValue: i, multi: !0 }, i),
        t({ provide: gn, useValue: () => S(i), multi: !0 }, i)
    }
    let u = o.providers
    if (u != null && !a) {
      let c = e
      Ta(u, (l) => {
        t(l, c)
      })
    }
  } else return !1
  return i !== e && e.providers !== void 0
}
function Ta(e, t) {
  for (let n of e)
    Ul(n) && (n = n.ɵproviders), Array.isArray(n) ? Ta(n, t) : t(n)
}
var Lg = j({ provide: String, useValue: j })
function rd(e) {
  return e !== null && typeof e == 'object' && Lg in e
}
function Vg(e) {
  return !!(e && e.useExisting)
}
function jg(e) {
  return !!(e && e.useFactory)
}
function mn(e) {
  return typeof e == 'function'
}
function Ug(e) {
  return !!e.useClass
}
var Ki = new C(''),
  bi = {},
  $g = {},
  Es
function Aa() {
  return Es === void 0 && (Es = new Ri()), Es
}
var he = class {},
  Xn = class extends he {
    get destroyed() {
      return this._destroyed
    }
    constructor(t, n, r, i) {
      super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = i),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        Bs(t, (s) => this.processProvider(s)),
        this.records.set(Gl, un(void 0, this)),
        i.has('environment') && this.records.set(he, un(void 0, this))
      let o = this.records.get(Ki)
      o != null && typeof o.value == 'string' && this.scopes.add(o.value),
        (this.injectorDefTypes = new Set(this.get(ql, Ie, x.Self)))
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
        r = Ee(void 0),
        i
      try {
        return t()
      } finally {
        at(n), Ee(r)
      }
    }
    get(t, n = Kn, r = x.Default) {
      if ((this.assertNotDestroyed(), t.hasOwnProperty(ol))) return t[ol](this)
      r = Qi(r)
      let i,
        o = at(this),
        s = Ee(void 0)
      try {
        if (!(r & x.SkipSelf)) {
          let u = this.records.get(t)
          if (u === void 0) {
            let c = qg(t) && Yi(t)
            c && this.injectableDefInScope(c)
              ? (u = un($s(t), bi))
              : (u = null),
              this.records.set(t, u)
          }
          if (u != null) return this.hydrate(t, u)
        }
        let a = r & x.Self ? Aa() : this.parent
        return (n = r & x.Optional && n === Kn ? null : n), a.get(t, n)
      } catch (a) {
        if (a.name === 'NullInjectorError') {
          if (((a[xi] = a[xi] || []).unshift(fe(t)), o)) throw a
          return gg(a, t, 'R3InjectorError', this.source)
        } else throw a
      } finally {
        Ee(s), at(o)
      }
    }
    resolveInjectorInitializers() {
      let t = O(null),
        n = at(this),
        r = Ee(void 0),
        i
      try {
        let o = this.get(gn, Ie, x.Self)
        for (let s of o) s()
      } finally {
        at(n), Ee(r), O(t)
      }
    }
    toString() {
      let t = [],
        n = this.records
      for (let r of n.keys()) t.push(fe(r))
      return `R3Injector[${t.join(', ')}]`
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new w(205, !1)
    }
    processProvider(t) {
      t = ae(t)
      let n = mn(t) ? t : ae(t && t.provide),
        r = Hg(t)
      if (!mn(t) && t.multi === !0) {
        let i = this.records.get(n)
        i ||
          ((i = un(void 0, bi, !0)),
          (i.factory = () => Vs(i.multi)),
          this.records.set(n, i)),
          (n = t),
          i.multi.push(t)
      }
      this.records.set(n, r)
    }
    hydrate(t, n) {
      let r = O(null)
      try {
        return (
          n.value === bi && ((n.value = $g), (n.value = n.factory())),
          typeof n.value == 'object' &&
            n.value &&
            Gg(n.value) &&
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
  let t = Yi(e),
    n = t !== null ? t.factory : hn(e)
  if (n !== null) return n
  if (e instanceof C) throw new w(204, !1)
  if (e instanceof Function) return Bg(e)
  throw new w(204, !1)
}
function Bg(e) {
  if (e.length > 0) throw new w(204, !1)
  let n = Xp(e)
  return n !== null ? () => n.factory(e) : () => new e()
}
function Hg(e) {
  if (rd(e)) return un(void 0, e.useValue)
  {
    let t = id(e)
    return un(t, bi)
  }
}
function id(e, t, n) {
  let r
  if (mn(e)) {
    let i = ae(e)
    return hn(i) || $s(i)
  } else if (rd(e)) r = () => ae(e.useValue)
  else if (jg(e)) r = () => e.useFactory(...Vs(e.deps || []))
  else if (Vg(e)) r = () => S(ae(e.useExisting))
  else {
    let i = ae(e && (e.useClass || e.provide))
    if (zg(e)) r = () => new i(...Vs(e.deps))
    else return hn(i) || $s(i)
  }
  return r
}
function un(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 }
}
function zg(e) {
  return !!e.deps
}
function Gg(e) {
  return (
    e !== null && typeof e == 'object' && typeof e.ngOnDestroy == 'function'
  )
}
function qg(e) {
  return typeof e == 'function' || (typeof e == 'object' && e instanceof C)
}
function Bs(e, t) {
  for (let n of e)
    Array.isArray(n) ? Bs(n, t) : n && Ul(n) ? Bs(n.ɵproviders, t) : t(n)
}
function Xe(e, t) {
  e instanceof Xn && e.assertNotDestroyed()
  let n,
    r = at(e),
    i = Ee(void 0)
  try {
    return t()
  } finally {
    at(r), Ee(i)
  }
}
function Wg() {
  return Bl() !== void 0 || fg() != null
}
function Zg(e) {
  return typeof e == 'function'
}
var et = 0,
  A = 1,
  I = 2,
  re = 3,
  Ne = 4,
  Fe = 5,
  er = 6,
  tr = 7,
  ce = 8,
  vn = 9,
  $e = 10,
  K = 11,
  nr = 12,
  dl = 13,
  bn = 14,
  Re = 15,
  Ji = 16,
  cn = 17,
  yn = 18,
  Xi = 19,
  od = 20,
  ut = 21,
  Is = 22,
  At = 23,
  Oe = 25,
  sd = 1
var xt = 7,
  Oi = 8,
  Fi = 9,
  le = 10,
  xa = (function (e) {
    return (
      (e[(e.None = 0)] = 'None'),
      (e[(e.HasTransplantedViews = 2)] = 'HasTransplantedViews'),
      e
    )
  })(xa || {})
function _t(e) {
  return Array.isArray(e) && typeof e[sd] == 'object'
}
function tt(e) {
  return Array.isArray(e) && e[sd] === !0
}
function ad(e) {
  return (e.flags & 4) !== 0
}
function eo(e) {
  return e.componentOffset > -1
}
function Na(e) {
  return (e.flags & 1) === 1
}
function ct(e) {
  return !!e.template
}
function Yg(e) {
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
function ud(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r)
}
function Mn() {
  return cd
}
function cd(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = Kg), Qg
}
Mn.ngInherit = !0
function Qg() {
  let e = dd(this),
    t = e?.current
  if (t) {
    let n = e.previous
    if (n === pn) e.previous = t
    else for (let r in t) n[r] = t[r]
    ;(e.current = null), this.ngOnChanges(t)
  }
}
function Kg(e, t, n, r, i) {
  let o = this.declaredInputs[r],
    s = dd(e) || Jg(e, { previous: pn, current: null }),
    a = s.current || (s.current = {}),
    u = s.previous,
    c = u[o]
  ;(a[o] = new Hs(c && c.currentValue, n, u === pn)), ud(e, t, i, n)
}
var ld = '__ngSimpleChanges__'
function dd(e) {
  return e[ld] || null
}
function Jg(e, t) {
  return (e[ld] = t)
}
var fl = null
var Ve = function (e, t, n) {
    fl?.(e, t, n)
  },
  Xg = 'svg',
  em = 'math',
  tm = !1
function nm() {
  return tm
}
function Be(e) {
  for (; Array.isArray(e); ) e = e[et]
  return e
}
function fd(e, t) {
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
function rm(e) {
  return tt(e[re])
}
function Pi(e, t) {
  return t == null ? null : e[t]
}
function hd(e) {
  e[cn] = 0
}
function im(e) {
  e[I] & 1024 || ((e[I] |= 1024), Oa(e) && rr(e))
}
function om(e, t) {
  for (; e > 0; ) (t = t[bn]), e--
  return t
}
function Fa(e) {
  return !!(e[I] & 9216 || e[At]?.dirty)
}
function zs(e) {
  e[$e].changeDetectionScheduler?.notify(1),
    Fa(e)
      ? rr(e)
      : e[I] & 64 &&
        (nm()
          ? ((e[I] |= 1024), rr(e))
          : e[$e].changeDetectionScheduler?.notify())
}
function rr(e) {
  e[$e].changeDetectionScheduler?.notify()
  let t = ir(e)
  for (; t !== null && !(t[I] & 8192 || ((t[I] |= 8192), !Oa(t))); ) t = ir(t)
}
function pd(e, t) {
  if ((e[I] & 256) === 256) throw new w(911, !1)
  e[ut] === null && (e[ut] = []), e[ut].push(t)
}
function sm(e, t) {
  if (e[ut] === null) return
  let n = e[ut].indexOf(t)
  n !== -1 && e[ut].splice(n, 1)
}
function ir(e) {
  let t = e[re]
  return tt(t) ? t[re] : t
}
var P = { lFrame: Cd(null), bindingsEnabled: !0, skipHydrationRootTNode: null }
function am() {
  return P.lFrame.elementDepthCount
}
function um() {
  P.lFrame.elementDepthCount++
}
function cm() {
  P.lFrame.elementDepthCount--
}
function gd() {
  return P.bindingsEnabled
}
function lm() {
  return P.skipHydrationRootTNode !== null
}
function dm(e) {
  return P.skipHydrationRootTNode === e
}
function fm() {
  P.skipHydrationRootTNode = null
}
function B() {
  return P.lFrame.lView
}
function Me() {
  return P.lFrame.tView
}
function _e() {
  let e = md()
  for (; e !== null && e.type === 64; ) e = e.parent
  return e
}
function md() {
  return P.lFrame.currentTNode
}
function hm() {
  let e = P.lFrame,
    t = e.currentTNode
  return e.isParent ? t : t.parent
}
function pr(e, t) {
  let n = P.lFrame
  ;(n.currentTNode = e), (n.isParent = t)
}
function vd() {
  return P.lFrame.isParent
}
function pm() {
  P.lFrame.isParent = !1
}
function gm(e) {
  return (P.lFrame.bindingIndex = e)
}
function gr() {
  return P.lFrame.bindingIndex++
}
function mm(e) {
  let t = P.lFrame,
    n = t.bindingIndex
  return (t.bindingIndex = t.bindingIndex + e), n
}
function vm() {
  return P.lFrame.inI18n
}
function ym(e, t) {
  let n = P.lFrame
  ;(n.bindingIndex = n.bindingRootIndex = e), Gs(t)
}
function Dm() {
  return P.lFrame.currentDirectiveIndex
}
function Gs(e) {
  P.lFrame.currentDirectiveIndex = e
}
function wm(e) {
  let t = P.lFrame.currentDirectiveIndex
  return t === -1 ? null : e[t]
}
function yd(e) {
  P.lFrame.currentQueryIndex = e
}
function Cm(e) {
  let t = e[A]
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[Fe] : null
}
function Dd(e, t, n) {
  if (n & x.SkipSelf) {
    let i = t,
      o = e
    for (; (i = i.parent), i === null && !(n & x.Host); )
      if (((i = Cm(o)), i === null || ((o = o[bn]), i.type & 10))) break
    if (i === null) return !1
    ;(t = i), (e = o)
  }
  let r = (P.lFrame = wd())
  return (r.currentTNode = t), (r.lView = e), !0
}
function Pa(e) {
  let t = wd(),
    n = e[A]
  ;(P.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1)
}
function wd() {
  let e = P.lFrame,
    t = e === null ? null : e.child
  return t === null ? Cd(e) : t
}
function Cd(e) {
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
function Ed() {
  let e = P.lFrame
  return (P.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
}
var Id = Ed
function ka() {
  let e = Ed()
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
function Em(e) {
  return (P.lFrame.contextLView = om(e, P.lFrame.contextLView))[ce]
}
function Lt() {
  return P.lFrame.selectedIndex
}
function Nt(e) {
  P.lFrame.selectedIndex = e
}
function bd() {
  let e = P.lFrame
  return Ra(e.tView, e.selectedIndex)
}
function Im() {
  return P.lFrame.currentNamespace
}
var Md = !0
function La() {
  return Md
}
function Va(e) {
  Md = e
}
function bm(e, t, n) {
  let { ngOnChanges: r, ngOnInit: i, ngDoCheck: o } = t.type.prototype
  if (r) {
    let s = cd(t)
    ;(n.preOrderHooks ??= []).push(e, s),
      (n.preOrderCheckHooks ??= []).push(e, s)
  }
  i && (n.preOrderHooks ??= []).push(0 - e, i),
    o &&
      ((n.preOrderHooks ??= []).push(e, o),
      (n.preOrderCheckHooks ??= []).push(e, o))
}
function ja(e, t) {
  for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
    let o = e.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: u,
        ngAfterViewChecked: c,
        ngOnDestroy: l,
      } = o
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
function Mi(e, t, n) {
  _d(e, t, 3, n)
}
function _i(e, t, n, r) {
  ;(e[I] & 3) === n && _d(e, t, n, r)
}
function bs(e, t) {
  let n = e[I]
  ;(n & 3) === t && ((n &= 16383), (n += 1), (e[I] = n))
}
function _d(e, t, n, r) {
  let i = r !== void 0 ? e[cn] & 65535 : 0,
    o = r ?? -1,
    s = t.length - 1,
    a = 0
  for (let u = i; u < s; u++)
    if (typeof t[u + 1] == 'number') {
      if (((a = t[u]), r != null && a >= r)) break
    } else
      t[u] < 0 && (e[cn] += 65536),
        (a < o || o == -1) &&
          (Mm(e, n, t, u), (e[cn] = (e[cn] & 4294901760) + u + 2)),
        u++
}
function hl(e, t) {
  Ve(4, e, t)
  let n = O(null)
  try {
    t.call(e)
  } finally {
    O(n), Ve(5, e, t)
  }
}
function Mm(e, t, n, r) {
  let i = n[r] < 0,
    o = n[r + 1],
    s = i ? -n[r] : n[r],
    a = e[s]
  i
    ? e[I] >> 14 < e[cn] >> 16 &&
      (e[I] & 3) === t &&
      ((e[I] += 16384), hl(a, o))
    : hl(a, o)
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
function _m(e) {
  return e instanceof Rt
}
function Sm(e) {
  return (e.flags & 8) !== 0
}
function Tm(e) {
  return (e.flags & 16) !== 0
}
function Sd(e) {
  return e !== fn
}
function ki(e) {
  return e & 32767
}
function Am(e) {
  return e >> 16
}
function Li(e, t) {
  let n = Am(e),
    r = t
  for (; n > 0; ) (r = r[bn]), n--
  return r
}
var qs = !0
function pl(e) {
  let t = qs
  return (qs = e), t
}
var xm = 256,
  Td = xm - 1,
  Ad = 5,
  Nm = 0,
  je = {}
function Rm(e, t, n) {
  let r
  typeof n == 'string'
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(Qn) && (r = n[Qn]),
    r == null && (r = n[Qn] = Nm++)
  let i = r & Td,
    o = 1 << i
  t.data[e + (i >> Ad)] |= o
}
function Vi(e, t) {
  let n = xd(e, t)
  if (n !== -1) return n
  let r = t[A]
  r.firstCreatePass &&
    ((e.injectorIndex = t.length),
    Ms(r.data, e),
    Ms(t, null),
    Ms(r.blueprint, null))
  let i = Ua(e, t),
    o = e.injectorIndex
  if (Sd(i)) {
    let s = ki(i),
      a = Li(i, t),
      u = a[A].data
    for (let c = 0; c < 8; c++) t[o + c] = a[s + c] | u[s + c]
  }
  return (t[o + 8] = i), o
}
function Ms(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t)
}
function xd(e, t) {
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
    i = t
  for (; i !== null; ) {
    if (((r = Pd(i)), r === null)) return fn
    if ((n++, (i = i[bn]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16)
  }
  return fn
}
function Ws(e, t, n) {
  Rm(e, t, n)
}
function Nd(e, t, n) {
  if (n & x.Optional || e !== void 0) return e
  Ma(t, 'NodeInjector')
}
function Rd(e, t, n, r) {
  if (
    (n & x.Optional && r === void 0 && (r = null), !(n & (x.Self | x.Host)))
  ) {
    let i = e[vn],
      o = Ee(void 0)
    try {
      return i ? i.get(t, r, n & x.Optional) : Hl(t, r, n & x.Optional)
    } finally {
      Ee(o)
    }
  }
  return Nd(r, t, n)
}
function Od(e, t, n, r = x.Default, i) {
  if (e !== null) {
    if (t[I] & 2048 && !(r & x.Self)) {
      let s = Lm(e, t, n, r, je)
      if (s !== je) return s
    }
    let o = Fd(e, t, n, r, je)
    if (o !== je) return o
  }
  return Rd(t, n, r, i)
}
function Fd(e, t, n, r, i) {
  let o = Pm(n)
  if (typeof o == 'function') {
    if (!Dd(t, e, r)) return r & x.Host ? Nd(i, n, r) : Rd(t, n, r, i)
    try {
      let s
      if (((s = o(r)), s == null && !(r & x.Optional))) Ma(n)
      else return s
    } finally {
      Id()
    }
  } else if (typeof o == 'number') {
    let s = null,
      a = xd(e, t),
      u = fn,
      c = r & x.Host ? t[Re][Fe] : null
    for (
      (a === -1 || r & x.SkipSelf) &&
      ((u = a === -1 ? Ua(e, t) : t[a + 8]),
      u === fn || !ml(r, !1)
        ? (a = -1)
        : ((s = t[A]), (a = ki(u)), (t = Li(u, t))));
      a !== -1;

    ) {
      let l = t[A]
      if (gl(o, a, l.data)) {
        let d = Om(a, t, n, s, r, c)
        if (d !== je) return d
      }
      ;(u = t[a + 8]),
        u !== fn && ml(r, t[A].data[a + 8] === c) && gl(o, a, t)
          ? ((s = l), (a = ki(u)), (t = Li(u, t)))
          : (a = -1)
    }
  }
  return i
}
function Om(e, t, n, r, i, o) {
  let s = t[A],
    a = s.data[e + 8],
    u = r == null ? eo(a) && qs : r != s && (a.type & 3) !== 0,
    c = i & x.Host && o === a,
    l = Fm(a, s, n, u, c)
  return l !== null ? Dn(t, s, l, a) : je
}
function Fm(e, t, n, r, i) {
  let o = e.providerIndexes,
    s = t.data,
    a = o & 1048575,
    u = e.directiveStart,
    c = e.directiveEnd,
    l = o >> 20,
    d = r ? a : a + l,
    f = i ? a + l : c
  for (let h = d; h < f; h++) {
    let m = s[h]
    if ((h < u && n === m) || (h >= u && m.type === n)) return h
  }
  if (i) {
    let h = s[u]
    if (h && ct(h) && h.type === n) return u
  }
  return null
}
function Dn(e, t, n, r) {
  let i = e[n],
    o = t.data
  if (_m(i)) {
    let s = i
    s.resolving && sg(og(o[n]))
    let a = pl(s.canSeeViewProviders)
    s.resolving = !0
    let u,
      c = s.injectImpl ? Ee(s.injectImpl) : null,
      l = Dd(e, r, x.Default)
    try {
      ;(i = e[n] = s.factory(void 0, o, e, r)),
        t.firstCreatePass && n >= r.directiveStart && bm(n, o[n], t)
    } finally {
      c !== null && Ee(c), pl(a), (s.resolving = !1), Id()
    }
  }
  return i
}
function Pm(e) {
  if (typeof e == 'string') return e.charCodeAt(0) || 0
  let t = e.hasOwnProperty(Qn) ? e[Qn] : void 0
  return typeof t == 'number' ? (t >= 0 ? t & Td : km) : t
}
function gl(e, t, n) {
  let r = 1 << e
  return !!(n[t + (e >> Ad)] & r)
}
function ml(e, t) {
  return !(e & x.Self) && !(e & x.Host && t)
}
var St = class {
  constructor(t, n) {
    ;(this._tNode = t), (this._lView = n)
  }
  get(t, n, r) {
    return Od(this._tNode, this._lView, t, Qi(r), n)
  }
}
function km() {
  return new St(_e(), B())
}
function ht(e) {
  return Zi(() => {
    let t = e.prototype.constructor,
      n = t[Ai] || Zs(t),
      r = Object.prototype,
      i = Object.getPrototypeOf(e.prototype).constructor
    for (; i && i !== r; ) {
      let o = i[Ai] || Zs(i)
      if (o && o !== n) return o
      i = Object.getPrototypeOf(i)
    }
    return (o) => new o()
  })
}
function Zs(e) {
  return kl(e)
    ? () => {
        let t = Zs(ae(e))
        return t && t()
      }
    : hn(e)
}
function Lm(e, t, n, r, i) {
  let o = e,
    s = t
  for (; o !== null && s !== null && s[I] & 2048 && !(s[I] & 512); ) {
    let a = Fd(o, s, n, r | x.Self, je)
    if (a !== je) return a
    let u = o.parent
    if (!u) {
      let c = s[od]
      if (c) {
        let l = c.get(n, je, r)
        if (l !== je) return l
      }
      ;(u = Pd(s)), (s = s[bn])
    }
    o = u
  }
  return i
}
function Pd(e) {
  let t = e[A],
    n = t.type
  return n === 2 ? t.declTNode : n === 1 ? e[Fe] : null
}
function vl(e, t = null, n = null, r) {
  let i = kd(e, t, n, r)
  return i.resolveInjectorInitializers(), i
}
function kd(e, t = null, n = null, r, i = new Set()) {
  let o = [n || Ie, kg(e)]
  return (
    (r = r || (typeof e == 'object' ? void 0 : fe(e))),
    new Xn(o, t || Aa(), r || null, i)
  )
}
var _n = (() => {
  let t = class t {
    static create(r, i) {
      if (Array.isArray(r)) return vl({ name: '' }, i, r, '')
      {
        let o = r.name ?? ''
        return vl({ name: o }, r.parent, r.providers, o)
      }
    }
  }
  ;(t.THROW_IF_NOT_FOUND = Kn),
    (t.NULL = new Ri()),
    (t.ɵprov = D({ token: t, providedIn: 'any', factory: () => S(Gl) })),
    (t.__NG_ELEMENT_ID__ = -1)
  let e = t
  return e
})()
var Vm = 'ngOriginalError'
function _s(e) {
  return e[Vm]
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
  Ld = new C('', {
    providedIn: 'root',
    factory: () => p(Ke).handleError.bind(void 0),
  }),
  Vd = (() => {
    let t = class t {}
    ;(t.__NG_ELEMENT_ID__ = jm), (t.__NG_ENV_ID__ = (r) => r)
    let e = t
    return e
  })(),
  Ys = class extends Vd {
    constructor(t) {
      super(), (this._lView = t)
    }
    onDestroy(t) {
      return pd(this._lView, t), () => sm(this._lView, t)
    }
  }
function jm() {
  return new Ys(B())
}
function Um() {
  return $a(_e(), B())
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
  t.__NG_ELEMENT_ID__ = Um
  let e = t
  return e
})()
var Qs = class extends se {
  constructor(t = !1) {
    super(),
      (this.destroyRef = void 0),
      (this.__isAsync = t),
      Wg() && (this.destroyRef = p(Vd, { optional: !0 }) ?? void 0)
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
    let i = t,
      o = n || (() => null),
      s = r
    if (t && typeof t == 'object') {
      let u = t
      ;(i = u.next?.bind(u)), (o = u.error?.bind(u)), (s = u.complete?.bind(u))
    }
    this.__isAsync && ((o = Ss(o)), i && (i = Ss(i)), s && (s = Ss(s)))
    let a = super.subscribe({ next: i, error: o, complete: s })
    return t instanceof Z && t.add(a), a
  }
}
function Ss(e) {
  return (t) => {
    setTimeout(e, void 0, t)
  }
}
var ue = Qs
function jd(e) {
  return (e.flags & 128) === 128
}
var Ud = new Map(),
  $m = 0
function Bm() {
  return $m++
}
function Hm(e) {
  Ud.set(e[Xi], e)
}
function zm(e) {
  Ud.delete(e[Xi])
}
var yl = '__ngContext__'
function Ot(e, t) {
  _t(t) ? ((e[yl] = t[Xi]), Hm(t)) : (e[yl] = t)
}
function $d(e) {
  return Hd(e[nr])
}
function Bd(e) {
  return Hd(e[Ne])
}
function Hd(e) {
  for (; e !== null && !tt(e); ) e = e[Ne]
  return e
}
var Ks
function zd(e) {
  Ks = e
}
function Gm() {
  if (Ks !== void 0) return Ks
  if (typeof document < 'u') return document
  throw new w(210, !1)
}
var Ba = new C('', { providedIn: 'root', factory: () => qm }),
  qm = 'ng',
  Ha = new C(''),
  pt = new C('', { providedIn: 'platform', factory: () => 'unknown' })
var za = new C('', {
  providedIn: 'root',
  factory: () =>
    Gm().body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') ||
    null,
})
var Wm = 'h',
  Zm = 'b'
var Ym = () => null
function Ga(e, t, n = !1) {
  return Ym(e, t, n)
}
var Gd = !1,
  Qm = new C('', { providedIn: 'root', factory: () => Gd })
var Js = class {
  constructor(t) {
    this.changingThisBreaksApplicationSecurity = t
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Qp})`
  }
}
function qa(e) {
  return e instanceof Js ? e.changingThisBreaksApplicationSecurity : e
}
function qd(e) {
  return e instanceof Function ? e() : e
}
var Je = (function (e) {
    return (
      (e[(e.Important = 1)] = 'Important'),
      (e[(e.DashCase = 2)] = 'DashCase'),
      e
    )
  })(Je || {}),
  Km
function Wa(e, t) {
  return Km(e, t)
}
function ln(e, t, n, r, i) {
  if (r != null) {
    let o,
      s = !1
    tt(r) ? (o = r) : _t(r) && ((s = !0), (r = r[et]))
    let a = Be(r)
    e === 0 && n !== null
      ? i == null
        ? Qd(t, n, a)
        : ji(t, n, a, i || null, !0)
      : e === 1 && n !== null
        ? ji(t, n, a, i || null, !0)
        : e === 2
          ? pv(t, a, s)
          : e === 3 && t.destroyNode(a),
      o != null && mv(t, e, o, n, i)
  }
}
function Jm(e, t) {
  return e.createText(t)
}
function Xm(e, t, n) {
  e.setValue(t, n)
}
function Wd(e, t, n) {
  return e.createElement(t, n)
}
function ev(e, t) {
  Zd(e, t), (t[et] = null), (t[Fe] = null)
}
function tv(e, t, n, r, i, o) {
  ;(r[et] = i), (r[Fe] = t), no(e, r, n, 1, i, o)
}
function Zd(e, t) {
  t[$e].changeDetectionScheduler?.notify(1), no(e, t, t[K], 2, null, null)
}
function nv(e) {
  let t = e[nr]
  if (!t) return Ts(e[A], e)
  for (; t; ) {
    let n = null
    if (_t(t)) n = t[nr]
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
function rv(e, t, n, r) {
  let i = le + r,
    o = n.length
  r > 0 && (n[i - 1][Ne] = t),
    r < o - le
      ? ((t[Ne] = n[i]), zl(n, le + r, t))
      : (n.push(t), (t[Ne] = null)),
    (t[re] = n)
  let s = t[Ji]
  s !== null && n !== s && iv(s, t)
  let a = t[yn]
  a !== null && a.insertView(e), zs(t), (t[I] |= 128)
}
function iv(e, t) {
  let n = e[Fi],
    i = t[re][re][Re]
  t[Re] !== i && (e[I] |= xa.HasTransplantedViews),
    n === null ? (e[Fi] = [t]) : n.push(t)
}
function Yd(e, t) {
  let n = e[Fi],
    r = n.indexOf(t)
  n.splice(r, 1)
}
function or(e, t) {
  if (e.length <= le) return
  let n = le + t,
    r = e[n]
  if (r) {
    let i = r[Ji]
    i !== null && i !== e && Yd(i, r), t > 0 && (e[n - 1][Ne] = r[Ne])
    let o = Ni(e, le + t)
    ev(r[A], r)
    let s = o[yn]
    s !== null && s.detachView(o[A]),
      (r[re] = null),
      (r[Ne] = null),
      (r[I] &= -129)
  }
  return r
}
function to(e, t) {
  if (!(t[I] & 256)) {
    let n = t[K]
    n.destroyNode && no(e, t, n, 3, null, null), nv(t)
  }
}
function Ts(e, t) {
  if (t[I] & 256) return
  let n = O(null)
  try {
    ;(t[I] &= -129),
      (t[I] |= 256),
      t[At] && Cc(t[At]),
      sv(e, t),
      ov(e, t),
      t[A].type === 1 && t[K].destroy()
    let r = t[Ji]
    if (r !== null && tt(t[re])) {
      r !== t[re] && Yd(r, t)
      let i = t[yn]
      i !== null && i.detachView(e)
    }
    zm(t)
  } finally {
    O(n)
  }
}
function ov(e, t) {
  let n = e.cleanup,
    r = t[tr]
  if (n !== null)
    for (let o = 0; o < n.length - 1; o += 2)
      if (typeof n[o] == 'string') {
        let s = n[o + 3]
        s >= 0 ? r[s]() : r[-s].unsubscribe(), (o += 2)
      } else {
        let s = r[n[o + 1]]
        n[o].call(s)
      }
  r !== null && (t[tr] = null)
  let i = t[ut]
  if (i !== null) {
    t[ut] = null
    for (let o = 0; o < i.length; o++) {
      let s = i[o]
      s()
    }
  }
}
function sv(e, t) {
  let n
  if (e != null && (n = e.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let i = t[n[r]]
      if (!(i instanceof Rt)) {
        let o = n[r + 1]
        if (Array.isArray(o))
          for (let s = 0; s < o.length; s += 2) {
            let a = i[o[s]],
              u = o[s + 1]
            Ve(4, a, u)
            try {
              u.call(a)
            } finally {
              Ve(5, a, u)
            }
          }
        else {
          Ve(4, i, o)
          try {
            o.call(i)
          } finally {
            Ve(5, i, o)
          }
        }
      }
    }
}
function av(e, t, n) {
  return uv(e, t.parent, n)
}
function uv(e, t, n) {
  let r = t
  for (; r !== null && r.type & 40; ) (t = r), (r = t.parent)
  if (r === null) return n[et]
  {
    let { componentOffset: i } = r
    if (i > -1) {
      let { encapsulation: o } = e.data[r.directiveStart + i]
      if (o === Ue.None || o === Ue.Emulated) return null
    }
    return Pe(r, n)
  }
}
function ji(e, t, n, r, i) {
  e.insertBefore(t, n, r, i)
}
function Qd(e, t, n) {
  e.appendChild(t, n)
}
function Dl(e, t, n, r, i) {
  r !== null ? ji(e, t, n, r, i) : Qd(e, t, n)
}
function cv(e, t, n, r) {
  e.removeChild(t, n, r)
}
function Za(e, t) {
  return e.parentNode(t)
}
function lv(e, t) {
  return e.nextSibling(t)
}
function dv(e, t, n) {
  return hv(e, t, n)
}
function fv(e, t, n) {
  return e.type & 40 ? Pe(e, n) : null
}
var hv = fv,
  wl
function Ya(e, t, n, r) {
  let i = av(e, r, t),
    o = t[K],
    s = r.parent || t[Fe],
    a = dv(s, r, t)
  if (i != null)
    if (Array.isArray(n))
      for (let u = 0; u < n.length; u++) Dl(o, i, n[u], a, !1)
    else Dl(o, i, n, a, !1)
  wl !== void 0 && wl(o, r, t, n, i)
}
function Si(e, t) {
  if (t !== null) {
    let n = t.type
    if (n & 3) return Pe(t, e)
    if (n & 4) return Xs(-1, e[t.index])
    if (n & 8) {
      let r = t.child
      if (r !== null) return Si(e, r)
      {
        let i = e[t.index]
        return tt(i) ? Xs(-1, i) : Be(i)
      }
    } else {
      if (n & 32) return Wa(t, e)() || Be(e[t.index])
      {
        let r = Kd(e, t)
        if (r !== null) {
          if (Array.isArray(r)) return r[0]
          let i = ir(e[Re])
          return Si(i, r)
        } else return Si(e, t.next)
      }
    }
  }
  return null
}
function Kd(e, t) {
  if (t !== null) {
    let r = e[Re][Fe],
      i = t.projection
    return r.projection[i]
  }
  return null
}
function Xs(e, t) {
  let n = le + e + 1
  if (n < t.length) {
    let r = t[n],
      i = r[A].firstChild
    if (i !== null) return Si(r, i)
  }
  return t[xt]
}
function pv(e, t, n) {
  let r = Za(e, t)
  r && cv(e, r, t, n)
}
function Qa(e, t, n, r, i, o, s) {
  for (; n != null; ) {
    let a = r[n.index],
      u = n.type
    if (
      (s && t === 0 && (a && Ot(Be(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (u & 8) Qa(e, t, n.child, r, i, o, !1), ln(t, e, i, a, o)
      else if (u & 32) {
        let c = Wa(n, r),
          l
        for (; (l = c()); ) ln(t, e, i, l, o)
        ln(t, e, i, a, o)
      } else u & 16 ? gv(e, t, r, n, i, o) : ln(t, e, i, a, o)
    n = s ? n.projectionNext : n.next
  }
}
function no(e, t, n, r, i, o) {
  Qa(n, r, e.firstChild, t, i, o, !1)
}
function gv(e, t, n, r, i, o) {
  let s = n[Re],
    u = s[Fe].projection[r.projection]
  if (Array.isArray(u))
    for (let c = 0; c < u.length; c++) {
      let l = u[c]
      ln(t, e, i, l, o)
    }
  else {
    let c = u,
      l = s[re]
    jd(r) && (c.flags |= 128), Qa(e, t, c, l, i, o, !0)
  }
}
function mv(e, t, n, r, i) {
  let o = n[xt],
    s = Be(n)
  o !== s && ln(t, e, r, o, i)
  for (let a = le; a < n.length; a++) {
    let u = n[a]
    no(u[A], u, e, t, r, o)
  }
}
function vv(e, t, n, r, i) {
  if (t) i ? e.addClass(n, r) : e.removeClass(n, r)
  else {
    let o = r.indexOf('-') === -1 ? void 0 : Je.DashCase
    i == null
      ? e.removeStyle(n, r, o)
      : (typeof i == 'string' &&
          i.endsWith('!important') &&
          ((i = i.slice(0, -10)), (o |= Je.Important)),
        e.setStyle(n, r, i, o))
  }
}
function yv(e, t, n) {
  e.setAttribute(t, 'style', n)
}
function Jd(e, t, n) {
  n === '' ? e.removeAttribute(t, 'class') : e.setAttribute(t, 'class', n)
}
function Xd(e, t, n) {
  let { mergedAttrs: r, classes: i, styles: o } = n
  r !== null && js(e, t, r),
    i !== null && Jd(e, t, i),
    o !== null && yv(e, t, o)
}
var Sn = {}
function ie(e = 1) {
  ef(Me(), B(), Lt() + e, !1)
}
function ef(e, t, n, r) {
  if (!r)
    if ((t[I] & 3) === 3) {
      let o = e.preOrderCheckHooks
      o !== null && Mi(t, o, n)
    } else {
      let o = e.preOrderHooks
      o !== null && _i(t, o, 0, n)
    }
  Nt(n)
}
function J(e, t = x.Default) {
  let n = B()
  if (n === null) return S(e, t)
  let r = _e()
  return Od(r, n, ae(e), t)
}
function tf(e, t, n, r, i, o) {
  let s = O(null)
  try {
    let a = null
    i & be.SignalBased && (a = t[r][Ze]),
      a !== null && a.transformFn !== void 0 && (o = a.transformFn(o)),
      i & be.HasDecoratorInputTransform &&
        (o = e.inputTransforms[r].call(t, o)),
      e.setInput !== null ? e.setInput(t, a, o, n, r) : ud(t, a, r, o)
  } finally {
    O(s)
  }
}
function Dv(e, t) {
  let n = e.hostBindingOpCodes
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let i = n[r]
        if (i < 0) Nt(~i)
        else {
          let o = i,
            s = n[++r],
            a = n[++r]
          ym(s, o)
          let u = t[o]
          a(2, u)
        }
      }
    } finally {
      Nt(-1)
    }
}
function ro(e, t, n, r, i, o, s, a, u, c, l) {
  let d = t.blueprint.slice()
  return (
    (d[et] = i),
    (d[I] = r | 4 | 128 | 8 | 64),
    (c !== null || (e && e[I] & 2048)) && (d[I] |= 2048),
    hd(d),
    (d[re] = d[bn] = e),
    (d[ce] = n),
    (d[$e] = s || (e && e[$e])),
    (d[K] = a || (e && e[K])),
    (d[vn] = u || (e && e[vn]) || null),
    (d[Fe] = o),
    (d[Xi] = Bm()),
    (d[er] = l),
    (d[od] = c),
    (d[Re] = t.type == 2 ? e[Re] : d),
    d
  )
}
function io(e, t, n, r, i) {
  let o = e.data[t]
  if (o === null) (o = wv(e, t, n, r, i)), vm() && (o.flags |= 32)
  else if (o.type & 64) {
    ;(o.type = n), (o.value = r), (o.attrs = i)
    let s = hm()
    o.injectorIndex = s === null ? -1 : s.injectorIndex
  }
  return pr(o, !0), o
}
function wv(e, t, n, r, i) {
  let o = md(),
    s = vd(),
    a = s ? o : o && o.parent,
    u = (e.data[t] = Mv(e, a, n, t, r, i))
  return (
    e.firstChild === null && (e.firstChild = u),
    o !== null &&
      (s
        ? o.child == null && u.parent !== null && (o.child = u)
        : o.next === null && ((o.next = u), (u.prev = o))),
    u
  )
}
function nf(e, t, n, r) {
  if (n === 0) return -1
  let i = t.length
  for (let o = 0; o < n; o++) t.push(r), e.blueprint.push(r), e.data.push(null)
  return i
}
function rf(e, t, n, r, i) {
  let o = Lt(),
    s = r & 2
  try {
    Nt(-1), s && t.length > Oe && ef(e, t, Oe, !1), Ve(s ? 2 : 0, i), n(r, i)
  } finally {
    Nt(o), Ve(s ? 3 : 1, i)
  }
}
function of(e, t, n) {
  if (ad(t)) {
    let r = O(null)
    try {
      let i = t.directiveStart,
        o = t.directiveEnd
      for (let s = i; s < o; s++) {
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
function sf(e, t, n) {
  gd() && (Nv(e, t, n, Pe(n, t)), (n.flags & 64) === 64 && ff(e, t, n))
}
function af(e, t, n = Pe) {
  let r = t.localNames
  if (r !== null) {
    let i = t.index + 1
    for (let o = 0; o < r.length; o += 2) {
      let s = r[o + 1],
        a = s === -1 ? n(t, e) : e[s]
      e[i++] = a
    }
  }
}
function uf(e) {
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
function Ka(e, t, n, r, i, o, s, a, u, c, l) {
  let d = Oe + r,
    f = d + i,
    h = Cv(d, f),
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
    directiveRegistry: typeof o == 'function' ? o() : o,
    pipeRegistry: typeof s == 'function' ? s() : s,
    firstChild: null,
    schemas: u,
    consts: m,
    incompleteFirstPass: !1,
    ssrId: l,
  })
}
function Cv(e, t) {
  let n = []
  for (let r = 0; r < t; r++) n.push(r < e ? null : Sn)
  return n
}
function Ev(e, t, n, r) {
  let o = r.get(Qm, Gd) || n === Ue.ShadowDom,
    s = e.selectRootElement(t, o)
  return Iv(s), s
}
function Iv(e) {
  bv(e)
}
var bv = () => null
function Mv(e, t, n, r, i, o) {
  let s = t ? t.injectorIndex : -1,
    a = 0
  return (
    lm() && (a |= 128),
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
      value: i,
      attrs: o,
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
function Cl(e, t, n, r, i) {
  for (let o in t) {
    if (!t.hasOwnProperty(o)) continue
    let s = t[o]
    if (s === void 0) continue
    r ??= {}
    let a,
      u = be.None
    Array.isArray(s) ? ((a = s[0]), (u = s[1])) : (a = s)
    let c = o
    if (i !== null) {
      if (!i.hasOwnProperty(o)) continue
      c = i[o]
    }
    e === 0 ? El(r, n, c, a, u) : El(r, n, c, a)
  }
  return r
}
function El(e, t, n, r, i) {
  let o
  e.hasOwnProperty(n) ? (o = e[n]).push(t, r) : (o = e[n] = [t, r]),
    i !== void 0 && o.push(i)
}
function _v(e, t, n) {
  let r = t.directiveStart,
    i = t.directiveEnd,
    o = e.data,
    s = t.attrs,
    a = [],
    u = null,
    c = null
  for (let l = r; l < i; l++) {
    let d = o[l],
      f = n ? n.get(d) : null,
      h = f ? f.inputs : null,
      m = f ? f.outputs : null
    ;(u = Cl(0, d.inputs, l, u, h)), (c = Cl(1, d.outputs, l, c, m))
    let M = u !== null && s !== null && !Sa(t) ? Uv(u, l, s) : null
    a.push(M)
  }
  u !== null &&
    (u.hasOwnProperty('class') && (t.flags |= 8),
    u.hasOwnProperty('style') && (t.flags |= 16)),
    (t.initialInputs = a),
    (t.inputs = u),
    (t.outputs = c)
}
function Sv(e) {
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
function cf(e, t, n, r, i, o, s, a) {
  let u = Pe(t, n),
    c = t.inputs,
    l
  !a && c != null && (l = c[r])
    ? (Ja(e, n, l, r, i), eo(t) && Tv(n, t.index))
    : t.type & 3
      ? ((r = Sv(r)),
        (i = s != null ? s(i, t.value || '', r) : i),
        o.setProperty(u, r, i))
      : t.type & 12
}
function Tv(e, t) {
  let n = ft(t, e)
  n[I] & 16 || (n[I] |= 64)
}
function lf(e, t, n, r) {
  if (gd()) {
    let i = r === null ? null : { '': -1 },
      o = Ov(e, n),
      s,
      a
    o === null ? (s = a = null) : ([s, a] = o),
      s !== null && df(e, t, n, s, i, a),
      i && Fv(n, r, i)
  }
  n.mergedAttrs = Jn(n.mergedAttrs, n.attrs)
}
function df(e, t, n, r, i, o) {
  for (let c = 0; c < r.length; c++) Ws(Vi(n, t), e, r[c].type)
  kv(n, e.data.length, r.length)
  for (let c = 0; c < r.length; c++) {
    let l = r[c]
    l.providersResolver && l.providersResolver(l)
  }
  let s = !1,
    a = !1,
    u = nf(e, t, r.length, null)
  for (let c = 0; c < r.length; c++) {
    let l = r[c]
    ;(n.mergedAttrs = Jn(n.mergedAttrs, l.hostAttrs)),
      Lv(e, n, t, u, l),
      Pv(u, l, i),
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
  _v(e, n, o)
}
function Av(e, t, n, r, i) {
  let o = i.hostBindings
  if (o) {
    let s = e.hostBindingOpCodes
    s === null && (s = e.hostBindingOpCodes = [])
    let a = ~t.index
    xv(s) != a && s.push(a), s.push(n, r, o)
  }
}
function xv(e) {
  let t = e.length
  for (; t > 0; ) {
    let n = e[--t]
    if (typeof n == 'number' && n < 0) return n
  }
  return 0
}
function Nv(e, t, n, r) {
  let i = n.directiveStart,
    o = n.directiveEnd
  eo(n) && Vv(t, n, e.data[i + n.componentOffset]),
    e.firstCreatePass || Vi(n, t),
    Ot(r, t)
  let s = n.initialInputs
  for (let a = i; a < o; a++) {
    let u = e.data[a],
      c = Dn(t, e, a, n)
    if ((Ot(c, t), s !== null && jv(t, a - i, c, u, n, s), ct(u))) {
      let l = ft(n.index, t)
      l[ce] = Dn(t, e, a, n)
    }
  }
}
function ff(e, t, n) {
  let r = n.directiveStart,
    i = n.directiveEnd,
    o = n.index,
    s = Dm()
  try {
    Nt(o)
    for (let a = r; a < i; a++) {
      let u = e.data[a],
        c = t[a]
      Gs(a),
        (u.hostBindings !== null || u.hostVars !== 0 || u.hostAttrs !== null) &&
          Rv(u, c)
    }
  } finally {
    Nt(-1), Gs(s)
  }
}
function Rv(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t)
}
function Ov(e, t) {
  let n = e.directiveRegistry,
    r = null,
    i = null
  if (n)
    for (let o = 0; o < n.length; o++) {
      let s = n[o]
      if (Sg(t, s.selectors, !1))
        if ((r || (r = []), ct(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = []
            ;(i = i || new Map()),
              s.findHostDirectiveDefs(s, a, i),
              r.unshift(...a, s)
            let u = a.length
            ea(e, t, u)
          } else r.unshift(s), ea(e, t, 0)
        else (i = i || new Map()), s.findHostDirectiveDefs?.(s, r, i), r.push(s)
    }
  return r === null ? null : [r, i]
}
function ea(e, t, n) {
  ;(t.componentOffset = n), (e.components ??= []).push(t.index)
}
function Fv(e, t, n) {
  if (t) {
    let r = (e.localNames = [])
    for (let i = 0; i < t.length; i += 2) {
      let o = n[t[i + 1]]
      if (o == null) throw new w(-301, !1)
      r.push(t[i], o)
    }
  }
}
function Pv(e, t, n) {
  if (n) {
    if (t.exportAs)
      for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e
    ct(t) && (n[''] = e)
  }
}
function kv(e, t, n) {
  ;(e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + n),
    (e.providerIndexes = t)
}
function Lv(e, t, n, r, i) {
  e.data[r] = i
  let o = i.factory || (i.factory = hn(i.type, !0)),
    s = new Rt(o, ct(i), J)
  ;(e.blueprint[r] = s), (n[r] = s), Av(e, t, r, nf(e, n, i.hostVars, Sn), i)
}
function Vv(e, t, n) {
  let r = Pe(t, e),
    i = uf(n),
    o = e[$e].rendererFactory,
    s = 16
  n.signals ? (s = 4096) : n.onPush && (s = 64)
  let a = oo(
    e,
    ro(e, i, null, s, r, t, null, o.createRenderer(r, n), null, null, null),
  )
  e[t.index] = a
}
function jv(e, t, n, r, i, o) {
  let s = o[t]
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let u = s[a++],
        c = s[a++],
        l = s[a++],
        d = s[a++]
      tf(r, n, u, c, l, d)
    }
}
function Uv(e, t, n) {
  let r = null,
    i = 0
  for (; i < n.length; ) {
    let o = n[i]
    if (o === 0) {
      i += 4
      continue
    } else if (o === 5) {
      i += 2
      continue
    }
    if (typeof o == 'number') break
    if (e.hasOwnProperty(o)) {
      r === null && (r = [])
      let s = e[o]
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === t) {
          r.push(o, s[a + 1], s[a + 2], n[i + 1])
          break
        }
    }
    i += 2
  }
  return r
}
function hf(e, t, n, r) {
  return [e, !0, 0, t, null, r, null, n, null, null]
}
function pf(e, t) {
  let n = e.contentQueries
  if (n !== null) {
    let r = O(null)
    try {
      for (let i = 0; i < n.length; i += 2) {
        let o = n[i],
          s = n[i + 1]
        if (s !== -1) {
          let a = e.data[s]
          yd(o), a.contentQueries(2, t[s], s)
        }
      }
    } finally {
      O(r)
    }
  }
}
function oo(e, t) {
  return e[nr] ? (e[dl][Ne] = t) : (e[nr] = t), (e[dl] = t), t
}
function ta(e, t, n) {
  yd(0)
  let r = O(null)
  try {
    t(e, n)
  } finally {
    O(r)
  }
}
function $v(e) {
  return e[tr] || (e[tr] = [])
}
function Bv(e) {
  return e.cleanup || (e.cleanup = [])
}
function gf(e, t) {
  let n = e[vn],
    r = n ? n.get(Ke, null) : null
  r && r.handleError(t)
}
function Ja(e, t, n, r, i) {
  for (let o = 0; o < n.length; ) {
    let s = n[o++],
      a = n[o++],
      u = n[o++],
      c = t[s],
      l = e.data[s]
    tf(l, c, r, a, u, i)
  }
}
function Hv(e, t, n) {
  let r = fd(t, e)
  Xm(e[K], r, n)
}
function zv(e, t) {
  let n = ft(t, e),
    r = n[A]
  Gv(r, n)
  let i = n[et]
  i !== null && n[er] === null && (n[er] = Ga(i, n[vn])), Xa(r, n, n[ce])
}
function Gv(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n])
}
function Xa(e, t, n) {
  Pa(t)
  try {
    let r = e.viewQuery
    r !== null && ta(1, r, n)
    let i = e.template
    i !== null && rf(e, t, i, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[yn]?.finishViewCreation(e),
      e.staticContentQueries && pf(e, t),
      e.staticViewQueries && ta(2, e.viewQuery, n)
    let o = e.components
    o !== null && qv(t, o)
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
function qv(e, t) {
  for (let n = 0; n < t.length; n++) zv(e, t[n])
}
function eu(e, t, n, r) {
  let i = O(null)
  try {
    let o = t.tView,
      a = e[I] & 4096 ? 4096 : 16,
      u = ro(
        e,
        o,
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
    u[Ji] = c
    let l = e[yn]
    return l !== null && (u[yn] = l.createEmbeddedView(o)), Xa(o, u, n), u
  } finally {
    O(i)
  }
}
function mf(e, t) {
  let n = le + t
  if (n < e.length) return e[n]
}
function sr(e, t) {
  return !t || t.firstChild === null || jd(e)
}
function so(e, t, n, r = !0) {
  let i = t[A]
  if ((rv(i, t, e, n), r)) {
    let s = Xs(n, e),
      a = t[K],
      u = Za(a, e[xt])
    u !== null && tv(i, e[Fe], a, t, u, s)
  }
  let o = t[er]
  o !== null && o.firstChild !== null && (o.firstChild = null)
}
function vf(e, t) {
  let n = or(e, t)
  return n !== void 0 && to(n[A], n), n
}
function Ui(e, t, n, r, i = !1) {
  for (; n !== null; ) {
    let o = t[n.index]
    o !== null && r.push(Be(o)), tt(o) && Wv(o, r)
    let s = n.type
    if (s & 8) Ui(e, t, n.child, r)
    else if (s & 32) {
      let a = Wa(n, t),
        u
      for (; (u = a()); ) r.push(u)
    } else if (s & 16) {
      let a = Kd(t, n)
      if (Array.isArray(a)) r.push(...a)
      else {
        let u = ir(t[Re])
        Ui(u[A], u, a, r, !0)
      }
    }
    n = i ? n.projectionNext : n.next
  }
  return r
}
function Wv(e, t) {
  for (let n = le; n < e.length; n++) {
    let r = e[n],
      i = r[A].firstChild
    i !== null && Ui(r[A], r, i, t)
  }
  e[xt] !== e[et] && t.push(e[xt])
}
var yf = []
function Zv(e) {
  return e[At] ?? Yv(e)
}
function Yv(e) {
  let t = yf.pop() ?? Object.create(Kv)
  return (t.lView = e), t
}
function Qv(e) {
  e.lView[At] !== e && ((e.lView = null), yf.push(e))
}
var Kv = R(g({}, Qr), {
    consumerIsAlwaysLive: !0,
    consumerMarkedDirty: (e) => {
      rr(e.lView)
    },
    consumerOnSignalRead() {
      this.lView[At] = this
    },
  }),
  Df = 100
function wf(e, t = !0, n = 0) {
  let r = e[$e],
    i = r.rendererFactory,
    o = !1
  o || i.begin?.()
  try {
    Jv(e, n)
  } catch (s) {
    throw (t && gf(e, s), s)
  } finally {
    o || (i.end?.(), r.inlineEffectRunner?.flush())
  }
}
function Jv(e, t) {
  na(e, t)
  let n = 0
  for (; Fa(e); ) {
    if (n === Df) throw new w(103, !1)
    n++, na(e, 1)
  }
}
function Xv(e, t, n, r) {
  let i = t[I]
  if ((i & 256) === 256) return
  let o = !1
  !o && t[$e].inlineEffectRunner?.flush(), Pa(t)
  let s = null,
    a = null
  !o && ey(e) && ((a = Zv(t)), (s = es(a)))
  try {
    hd(t), gm(e.bindingStartIndex), n !== null && rf(e, t, n, 2, r)
    let u = (i & 3) === 3
    if (!o)
      if (u) {
        let d = e.preOrderCheckHooks
        d !== null && Mi(t, d, null)
      } else {
        let d = e.preOrderHooks
        d !== null && _i(t, d, 0, null), bs(t, 0)
      }
    if ((ty(t), Cf(t, 0), e.contentQueries !== null && pf(e, t), !o))
      if (u) {
        let d = e.contentCheckHooks
        d !== null && Mi(t, d)
      } else {
        let d = e.contentHooks
        d !== null && _i(t, d, 1), bs(t, 1)
      }
    Dv(e, t)
    let c = e.components
    c !== null && If(t, c, 0)
    let l = e.viewQuery
    if ((l !== null && ta(2, l, r), !o))
      if (u) {
        let d = e.viewCheckHooks
        d !== null && Mi(t, d)
      } else {
        let d = e.viewHooks
        d !== null && _i(t, d, 2), bs(t, 2)
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[Is])) {
      for (let d of t[Is]) d()
      t[Is] = null
    }
    o || (t[I] &= -73)
  } catch (u) {
    throw (rr(t), u)
  } finally {
    a !== null && (ts(a, s), Qv(a)), ka()
  }
}
function ey(e) {
  return e.type !== 2
}
function Cf(e, t) {
  for (let n = $d(e); n !== null; n = Bd(n))
    for (let r = le; r < n.length; r++) {
      let i = n[r]
      Ef(i, t)
    }
}
function ty(e) {
  for (let t = $d(e); t !== null; t = Bd(t)) {
    if (!(t[I] & xa.HasTransplantedViews)) continue
    let n = t[Fi]
    for (let r = 0; r < n.length; r++) {
      let i = n[r],
        o = i[re]
      im(i)
    }
  }
}
function ny(e, t, n) {
  let r = ft(t, e)
  Ef(r, n)
}
function Ef(e, t) {
  Oa(e) && na(e, t)
}
function na(e, t) {
  let r = e[A],
    i = e[I],
    o = e[At],
    s = !!(t === 0 && i & 16)
  if (
    ((s ||= !!(i & 64 && t === 0)),
    (s ||= !!(i & 1024)),
    (s ||= !!(o?.dirty && ns(o))),
    o && (o.dirty = !1),
    (e[I] &= -9217),
    s)
  )
    Xv(r, e, r.template, e[ce])
  else if (i & 8192) {
    Cf(e, 1)
    let a = r.components
    a !== null && If(e, a, 1)
  }
}
function If(e, t, n) {
  for (let r = 0; r < t.length; r++) ny(e, t[r], n)
}
function tu(e) {
  for (e[$e].changeDetectionScheduler?.notify(); e; ) {
    e[I] |= 64
    let t = ir(e)
    if (Yg(e) && !t) return e
    e = t
  }
  return null
}
var wn = class {
  get rootNodes() {
    let t = this._lView,
      n = t[A]
    return Ui(n, t, n.firstChild, [])
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
        let n = t[Oi],
          r = n ? n.indexOf(this) : -1
        r > -1 && (or(t, r), Ni(n, r))
      }
      this._attachedToViewContainer = !1
    }
    to(this._lView[A], this._lView)
  }
  onDestroy(t) {
    pd(this._lView, t)
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
    ;(this._lView[I] |= 1024), wf(this._lView, this.notifyErrorHandler)
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new w(902, !1)
    this._attachedToViewContainer = !0
  }
  detachFromAppRef() {
    ;(this._appRef = null), Zd(this._lView[A], this._lView)
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new w(902, !1)
    ;(this._appRef = t), zs(this._lView)
  }
}
var QS = new RegExp(`^(\\d+)*(${Zm}|${Wm})*(.*)`)
var ry = () => null
function ar(e, t) {
  return ry(e, t)
}
var ra = class {},
  ia = class {},
  $i = class {}
function iy(e) {
  let t = Error(`No component factory found for ${fe(e)}.`)
  return (t[oy] = e), t
}
var oy = 'ngComponent'
var oa = class {
    resolveComponentFactory(t) {
      throw iy(t)
    }
  },
  ao = (() => {
    let t = class t {}
    t.NULL = new oa()
    let e = t
    return e
  })(),
  ur = class {},
  Tn = (() => {
    let t = class t {
      constructor() {
        this.destroyNode = null
      }
    }
    t.__NG_ELEMENT_ID__ = () => sy()
    let e = t
    return e
  })()
function sy() {
  let e = B(),
    t = _e(),
    n = ft(t.index, e)
  return (_t(n) ? n : e)[K]
}
var ay = (() => {
    let t = class t {}
    t.ɵprov = D({ token: t, providedIn: 'root', factory: () => null })
    let e = t
    return e
  })(),
  As = {}
var Il = new Set()
function jt(e) {
  Il.has(e) ||
    (Il.add(e),
    performance?.mark?.('mark_feature_usage', { detail: { feature: e } }))
}
function bl(...e) {}
function uy() {
  let e = typeof Yn.requestAnimationFrame == 'function',
    t = Yn[e ? 'requestAnimationFrame' : 'setTimeout'],
    n = Yn[e ? 'cancelAnimationFrame' : 'clearTimeout']
  if (typeof Zone < 'u' && t && n) {
    let r = t[Zone.__symbol__('OriginalDelegate')]
    r && (t = r)
    let i = n[Zone.__symbol__('OriginalDelegate')]
    i && (n = i)
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
      let i = this
      ;(i._nesting = 0),
        (i._outer = i._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
        t &&
          Zone.longStackTraceZoneSpec &&
          (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
        (i.shouldCoalesceEventChangeDetection = !r && n),
        (i.shouldCoalesceRunChangeDetection = r),
        (i.lastRequestAnimationFrameId = -1),
        (i.nativeRequestAnimationFrame = uy().nativeRequestAnimationFrame),
        dy(i)
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
    runTask(t, n, r, i) {
      let o = this._inner,
        s = o.scheduleEventTask('NgZoneEvent: ' + i, t, cy, bl, bl)
      try {
        return o.runTask(s, n, r)
      } finally {
        o.cancelTask(s)
      }
    }
    runGuarded(t, n, r) {
      return this._inner.runGuarded(t, n, r)
    }
    runOutsideAngular(t) {
      return this._outer.run(t)
    }
  },
  cy = {}
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
function ly(e) {
  e.isCheckStableRunning ||
    e.lastRequestAnimationFrameId !== -1 ||
    ((e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(
      Yn,
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
function dy(e) {
  let t = () => {
    ly(e)
  }
  e._inner = e._inner.fork({
    name: 'angular',
    properties: { isAngularZone: !0 },
    onInvokeTask: (n, r, i, o, s, a) => {
      if (fy(a)) return n.invokeTask(i, o, s, a)
      try {
        return Ml(e), n.invokeTask(i, o, s, a)
      } finally {
        ;((e.shouldCoalesceEventChangeDetection && o.type === 'eventTask') ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          _l(e)
      }
    },
    onInvoke: (n, r, i, o, s, a, u) => {
      try {
        return Ml(e), n.invoke(i, o, s, a, u)
      } finally {
        e.shouldCoalesceRunChangeDetection && t(), _l(e)
      }
    },
    onHasTask: (n, r, i, o) => {
      n.hasTask(i, o),
        r === i &&
          (o.change == 'microTask'
            ? ((e._hasPendingMicrotasks = o.microTask), sa(e), nu(e))
            : o.change == 'macroTask' && (e.hasPendingMacrotasks = o.macroTask))
    },
    onHandleError: (n, r, i, o) => (
      n.handleError(i, o), e.runOutsideAngular(() => e.onError.emit(o)), !1
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
function Ml(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null))
}
function _l(e) {
  e._nesting--, nu(e)
}
function fy(e) {
  return !Array.isArray(e) || e.length !== 1
    ? !1
    : e[0].data?.__ignore_ng_zone__ === !0
}
var bf = (() => {
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
      for (let i of r) i()
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
    i = n ? e.classes : null,
    o = 0
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s]
      if (typeof a == 'number') o = a
      else if (o == 1) i = tl(i, a)
      else if (o == 2) {
        let u = a,
          c = t[++s]
        r = tl(r, u + ': ' + c + ';')
      }
    }
  n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = i) : (e.classesWithoutHost = i)
}
var Bi = class extends ao {
  constructor(t) {
    super(), (this.ngModule = t)
  }
  resolveComponentFactory(t) {
    let n = Tt(t)
    return new cr(n, this.ngModule)
  }
}
function Sl(e) {
  let t = []
  for (let n in e) {
    if (!e.hasOwnProperty(n)) continue
    let r = e[n]
    r !== void 0 &&
      t.push({ propName: Array.isArray(r) ? r[0] : r, templateName: n })
  }
  return t
}
function hy(e) {
  let t = e.toLowerCase()
  return t === 'svg' ? Xg : t === 'math' ? em : null
}
var ua = class {
    constructor(t, n) {
      ;(this.injector = t), (this.parentInjector = n)
    }
    get(t, n, r) {
      r = Qi(r)
      let i = this.injector.get(t, As, r)
      return i !== As || n === As ? i : this.parentInjector.get(t, n, r)
    }
  },
  cr = class extends $i {
    get inputs() {
      let t = this.componentDef,
        n = t.inputTransforms,
        r = Sl(t.inputs)
      if (n !== null)
        for (let i of r)
          n.hasOwnProperty(i.propName) && (i.transform = n[i.propName])
      return r
    }
    get outputs() {
      return Sl(this.componentDef.outputs)
    }
    constructor(t, n) {
      super(),
        (this.componentDef = t),
        (this.ngModule = n),
        (this.componentType = t.type),
        (this.selector = Ng(t.selectors)),
        (this.ngContentSelectors = t.ngContentSelectors
          ? t.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n)
    }
    create(t, n, r, i) {
      let o = O(null)
      try {
        i = i || this.ngModule
        let s = i instanceof he ? i : i?.injector
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s)
        let a = s ? new ua(t, s) : t,
          u = a.get(ur, null)
        if (u === null) throw new w(407, !1)
        let c = a.get(ay, null),
          l = a.get(bf, null),
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
            ? Ev(h, r, this.componentDef.encapsulation, a)
            : Wd(h, m, hy(m)),
          y = 512
        this.componentDef.signals
          ? (y |= 4096)
          : this.componentDef.onPush || (y |= 16)
        let v = null
        M !== null && (v = Ga(M, a, !0))
        let ne = Ka(0, null, null, 1, 0, null, null, null, null, null, null),
          X = ro(null, ne, null, y, null, null, f, h, a, null, v)
        Pa(X)
        let $, ke
        try {
          let ge = this.componentDef,
            rt,
            Qo = null
          ge.findHostDirectiveDefs
            ? ((rt = []),
              (Qo = new Map()),
              ge.findHostDirectiveDefs(ge, rt, Qo),
              rt.push(ge))
            : (rt = [ge])
          let gp = py(X, M),
            mp = gy(gp, M, ge, rt, X, f, h)
          ;(ke = Ra(ne, Oe)),
            M && yy(h, ge, M, r),
            n !== void 0 && Dy(ke, this.ngContentSelectors, n),
            ($ = vy(mp, ge, rt, Qo, X, [wy])),
            Xa(ne, X, null)
        } finally {
          ka()
        }
        return new ca(this.componentType, $, $a(ke, X), X, ke)
      } finally {
        O(o)
      }
    }
  },
  ca = class extends ia {
    constructor(t, n, r, i, o) {
      super(),
        (this.location = r),
        (this._rootLView = i),
        (this._tNode = o),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new wn(i, void 0, !1)),
        (this.componentType = t)
    }
    setInput(t, n) {
      let r = this._tNode.inputs,
        i
      if (r !== null && (i = r[t])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(t) &&
            Object.is(this.previousInputValues.get(t), n))
        )
          return
        let o = this._rootLView
        Ja(o[A], o, i, t, n), this.previousInputValues.set(t, n)
        let s = ft(this._tNode.index, o)
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
function py(e, t) {
  let n = e[A],
    r = Oe
  return (e[r] = t), io(n, r, 2, '#host', null)
}
function gy(e, t, n, r, i, o, s) {
  let a = i[A]
  my(r, e, t, s)
  let u = null
  t !== null && (u = Ga(t, i[vn]))
  let c = o.rendererFactory.createRenderer(t, n),
    l = 16
  n.signals ? (l = 4096) : n.onPush && (l = 64)
  let d = ro(i, uf(n), null, l, i[e.index], e, o, c, null, null, u)
  return a.firstCreatePass && ea(a, e, r.length - 1), oo(i, d), (i[e.index] = d)
}
function my(e, t, n, r) {
  for (let i of e) t.mergedAttrs = Jn(t.mergedAttrs, i.hostAttrs)
  t.mergedAttrs !== null &&
    (aa(t, t.mergedAttrs, !0), n !== null && Xd(r, n, t))
}
function vy(e, t, n, r, i, o) {
  let s = _e(),
    a = i[A],
    u = Pe(s, i)
  df(a, i, s, n, null, r)
  for (let l = 0; l < n.length; l++) {
    let d = s.directiveStart + l,
      f = Dn(i, a, d, s)
    Ot(f, i)
  }
  ff(a, i, s), u && Ot(u, i)
  let c = Dn(i, a, s.directiveStart + s.componentOffset, s)
  if (((e[ce] = i[ce] = c), o !== null)) for (let l of o) l(c, t)
  return of(a, s, i), c
}
function yy(e, t, n, r) {
  if (r) js(e, n, ['ng-version', '17.3.5'])
  else {
    let { attrs: i, classes: o } = Rg(t.selectors[0])
    i && js(e, n, i), o && o.length > 0 && Jd(e, n, o.join(' '))
  }
}
function Dy(e, t, n) {
  let r = (e.projection = [])
  for (let i = 0; i < t.length; i++) {
    let o = n[i]
    r.push(o != null ? Array.from(o) : null)
  }
}
function wy() {
  let e = _e()
  ja(B()[A], e)
}
var uo = (() => {
  let t = class t {}
  t.__NG_ELEMENT_ID__ = Cy
  let e = t
  return e
})()
function Cy() {
  let e = _e()
  return Iy(e, B())
}
var Ey = uo,
  Mf = class extends Ey {
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
      if (Sd(t)) {
        let n = Li(t, this._hostLView),
          r = ki(t),
          i = n[A].data[r + 8]
        return new St(i, n)
      } else return new St(null, this._hostLView)
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1)
    }
    get(t) {
      let n = Tl(this._lContainer)
      return (n !== null && n[t]) || null
    }
    get length() {
      return this._lContainer.length - le
    }
    createEmbeddedView(t, n, r) {
      let i, o
      typeof r == 'number'
        ? (i = r)
        : r != null && ((i = r.index), (o = r.injector))
      let s = ar(this._lContainer, t.ssrId),
        a = t.createEmbeddedViewImpl(n || {}, o, s)
      return this.insertImpl(a, i, sr(this._hostTNode, s)), a
    }
    createComponent(t, n, r, i, o) {
      let s = t && !Zg(t),
        a
      if (s) a = n
      else {
        let m = n || {}
        ;(a = m.index),
          (r = m.injector),
          (i = m.projectableNodes),
          (o = m.environmentInjector || m.ngModuleRef)
      }
      let u = s ? t : new cr(Tt(t)),
        c = r || this.parentInjector
      if (!o && u.ngModule == null) {
        let M = (s ? c : this.parentInjector).get(he, null)
        M && (o = M)
      }
      let l = Tt(u.componentType ?? {}),
        d = ar(this._lContainer, l?.id ?? null),
        f = d?.firstChild ?? null,
        h = u.create(c, i, f, o)
      return this.insertImpl(h.hostView, a, sr(this._hostTNode, d)), h
    }
    insert(t, n) {
      return this.insertImpl(t, n, !0)
    }
    insertImpl(t, n, r) {
      let i = t._lView
      if (rm(i)) {
        let a = this.indexOf(t)
        if (a !== -1) this.detach(a)
        else {
          let u = i[re],
            c = new Mf(u, u[Fe], u[re])
          c.detach(c.indexOf(t))
        }
      }
      let o = this._adjustIndex(n),
        s = this._lContainer
      return so(s, i, o, r), t.attachToViewContainerRef(), zl(xs(s), o, t), t
    }
    move(t, n) {
      return this.insert(t, n)
    }
    indexOf(t) {
      let n = Tl(this._lContainer)
      return n !== null ? n.indexOf(t) : -1
    }
    remove(t) {
      let n = this._adjustIndex(t, -1),
        r = or(this._lContainer, n)
      r && (Ni(xs(this._lContainer), n), to(r[A], r))
    }
    detach(t) {
      let n = this._adjustIndex(t, -1),
        r = or(this._lContainer, n)
      return r && Ni(xs(this._lContainer), n) != null ? new wn(r) : null
    }
    _adjustIndex(t, n = 0) {
      return t ?? this.length + n
    }
  }
function Tl(e) {
  return e[Oi]
}
function xs(e) {
  return e[Oi] || (e[Oi] = [])
}
function Iy(e, t) {
  let n,
    r = t[e.index]
  return (
    tt(r) ? (n = r) : ((n = hf(r, t, null, e)), (t[e.index] = n), oo(t, n)),
    My(n, t, e, r),
    new Mf(n, e, t)
  )
}
function by(e, t) {
  let n = e[K],
    r = n.createComment(''),
    i = Pe(t, e),
    o = Za(n, i)
  return ji(n, o, r, lv(n, i), !1), r
}
var My = Ty,
  _y = () => !1
function Sy(e, t, n) {
  return _y(e, t, n)
}
function Ty(e, t, n, r) {
  if (e[xt]) return
  let i
  n.type & 8 ? (i = Be(r)) : (i = by(t, n)), (e[xt] = i)
}
function Ay(e) {
  return typeof e == 'function' && e[Ze] !== void 0
}
function co(e, t) {
  jt('NgSignals')
  let n = Tc(e),
    r = n[Ze]
  return (
    t?.equal && (r.equal = t.equal),
    (n.set = (i) => rs(r, i)),
    (n.update = (i) => Ac(r, i)),
    (n.asReadonly = xy.bind(n)),
    n
  )
}
function xy() {
  let e = this[Ze]
  if (e.readonlyFn === void 0) {
    let t = () => this()
    ;(t[Ze] = e), (e.readonlyFn = t)
  }
  return e.readonlyFn
}
function _f(e) {
  return Ay(e) && typeof e.set == 'function'
}
function Ny(e) {
  return Object.getPrototypeOf(e.prototype).constructor
}
function Ut(e) {
  let t = Ny(e.type),
    n = !0,
    r = [e]
  for (; t; ) {
    let i
    if (ct(e)) i = t.ɵcmp || t.ɵdir
    else {
      if (t.ɵcmp) throw new w(903, !1)
      i = t.ɵdir
    }
    if (i) {
      if (n) {
        r.push(i)
        let s = e
        ;(s.inputs = Ei(e.inputs)),
          (s.inputTransforms = Ei(e.inputTransforms)),
          (s.declaredInputs = Ei(e.declaredInputs)),
          (s.outputs = Ei(e.outputs))
        let a = i.hostBindings
        a && ky(e, a)
        let u = i.viewQuery,
          c = i.contentQueries
        if (
          (u && Fy(e, u),
          c && Py(e, c),
          Ry(e, i),
          Kp(e.outputs, i.outputs),
          ct(i) && i.data.animation)
        ) {
          let l = e.data
          l.animation = (l.animation || []).concat(i.data.animation)
        }
      }
      let o = i.features
      if (o)
        for (let s = 0; s < o.length; s++) {
          let a = o[s]
          a && a.ngInherit && a(e), a === Ut && (n = !1)
        }
    }
    t = Object.getPrototypeOf(t)
  }
  Oy(r)
}
function Ry(e, t) {
  for (let n in t.inputs) {
    if (!t.inputs.hasOwnProperty(n) || e.inputs.hasOwnProperty(n)) continue
    let r = t.inputs[n]
    if (
      r !== void 0 &&
      ((e.inputs[n] = r),
      (e.declaredInputs[n] = t.declaredInputs[n]),
      t.inputTransforms !== null)
    ) {
      let i = Array.isArray(r) ? r[0] : r
      if (!t.inputTransforms.hasOwnProperty(i)) continue
      ;(e.inputTransforms ??= {}), (e.inputTransforms[i] = t.inputTransforms[i])
    }
  }
}
function Oy(e) {
  let t = 0,
    n = null
  for (let r = e.length - 1; r >= 0; r--) {
    let i = e[r]
    ;(i.hostVars = t += i.hostVars),
      (i.hostAttrs = Jn(i.hostAttrs, (n = Jn(n, i.hostAttrs))))
  }
}
function Ei(e) {
  return e === pn ? {} : e === Ie ? [] : e
}
function Fy(e, t) {
  let n = e.viewQuery
  n
    ? (e.viewQuery = (r, i) => {
        t(r, i), n(r, i)
      })
    : (e.viewQuery = t)
}
function Py(e, t) {
  let n = e.contentQueries
  n
    ? (e.contentQueries = (r, i, o) => {
        t(r, i, o), n(r, i, o)
      })
    : (e.contentQueries = t)
}
function ky(e, t) {
  let n = e.hostBindings
  n
    ? (e.hostBindings = (r, i) => {
        t(r, i), n(r, i)
      })
    : (e.hostBindings = t)
}
var lt = class {},
  lr = class {}
var la = class extends lt {
    constructor(t, n, r) {
      super(),
        (this._parent = n),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new Bi(this))
      let i = Jl(t)
      ;(this._bootstrapComponents = qd(i.bootstrap)),
        (this._r3Injector = kd(
          t,
          n,
          [
            { provide: lt, useValue: this },
            { provide: ao, useValue: this.componentFactoryResolver },
            ...r,
          ],
          fe(t),
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
  da = class extends lr {
    constructor(t) {
      super(), (this.moduleType = t)
    }
    create(t) {
      return new la(this.moduleType, t, [])
    }
  }
var Hi = class extends lt {
  constructor(t) {
    super(),
      (this.componentFactoryResolver = new Bi(this)),
      (this.instance = null)
    let n = new Xn(
      [
        ...t.providers,
        { provide: lt, useValue: this },
        { provide: ao, useValue: this.componentFactoryResolver },
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
  return new Hi({
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
  ;(t.ɵfac = function (i) {
    return new (i || t)()
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
  let e = t
  return e
})()
function xn(e, t, n) {
  let r = e[t]
  return Object.is(r, n) ? !1 : ((e[t] = n), !0)
}
function Ly(e) {
  return (e.flags & 32) === 32
}
function Vy(e, t, n, r, i, o, s, a, u) {
  let c = t.consts,
    l = io(t, e, 4, s || null, Pi(c, a))
  lf(t, n, l, Pi(c, u)), ja(t, l)
  let d = (l.tView = Ka(
    2,
    l,
    r,
    i,
    o,
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
function dr(e, t, n, r, i, o, s, a) {
  let u = B(),
    c = Me(),
    l = e + Oe,
    d = c.firstCreatePass ? Vy(l, c, u, t, n, r, i, o, s) : c.data[l]
  pr(d, !1)
  let f = jy(c, u, d, e)
  La() && Ya(c, u, f, d), Ot(f, u)
  let h = hf(f, u, f, d)
  return (
    (u[l] = h),
    oo(u, h),
    Sy(h, d, u),
    Na(d) && sf(c, u, d),
    s != null && af(u, d, a),
    dr
  )
}
var jy = Uy
function Uy(e, t, n, r) {
  return Va(!0), t[K].createComment('')
}
function $y(e, t, n, r) {
  return xn(e, gr(), n) ? t + $l(n) + r : Sn
}
function Ii(e, t) {
  return (e << 17) | (t << 2)
}
function Ft(e) {
  return (e >> 17) & 32767
}
function By(e) {
  return (e & 2) == 2
}
function Hy(e, t) {
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
function zy(e) {
  return (e & 1) === 1
}
function ha(e) {
  return e | 1
}
function Gy(e, t, n, r, i, o) {
  let s = o ? t.classBindings : t.styleBindings,
    a = Ft(s),
    u = Cn(s)
  e[r] = n
  let c = !1,
    l
  if (Array.isArray(n)) {
    let d = n
    ;(l = d[1]), (l === null || hr(d, l) > 0) && (c = !0)
  } else l = n
  if (i)
    if (u !== 0) {
      let f = Ft(e[a + 1])
      ;(e[r + 1] = Ii(f, a)),
        f !== 0 && (e[f + 1] = Ns(e[f + 1], r)),
        (e[a + 1] = Hy(e[a + 1], r))
    } else
      (e[r + 1] = Ii(a, 0)), a !== 0 && (e[a + 1] = Ns(e[a + 1], r)), (a = r)
  else
    (e[r + 1] = Ii(u, 0)),
      a === 0 ? (a = r) : (e[u + 1] = Ns(e[u + 1], r)),
      (u = r)
  c && (e[r + 1] = fa(e[r + 1])),
    Al(e, l, r, !0),
    Al(e, l, r, !1),
    qy(t, l, e, r, o),
    (s = Ii(a, u)),
    o ? (t.classBindings = s) : (t.styleBindings = s)
}
function qy(e, t, n, r, i) {
  let o = i ? e.residualClasses : e.residualStyles
  o != null &&
    typeof t == 'string' &&
    hr(o, t) >= 0 &&
    (n[r + 1] = ha(n[r + 1]))
}
function Al(e, t, n, r) {
  let i = e[n + 1],
    o = t === null,
    s = r ? Ft(i) : Cn(i),
    a = !1
  for (; s !== 0 && (a === !1 || o); ) {
    let u = e[s],
      c = e[s + 1]
    Wy(u, t) && ((a = !0), (e[s + 1] = r ? ha(c) : fa(c))),
      (s = r ? Ft(c) : Cn(c))
  }
  a && (e[n + 1] = r ? fa(i) : ha(i))
}
function Wy(e, t) {
  return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t
    ? !0
    : Array.isArray(e) && typeof t == 'string'
      ? hr(e, t) >= 0
      : !1
}
function $t(e, t, n) {
  let r = B(),
    i = gr()
  if (xn(r, i, t)) {
    let o = Me(),
      s = bd()
    cf(o, s, r, e, t, r[K], n, !1)
  }
  return $t
}
function xl(e, t, n, r, i) {
  let o = t.inputs,
    s = i ? 'class' : 'style'
  Ja(e, n, o[s], s, r)
}
function iu(e, t) {
  return Zy(e, t, null, !0), iu
}
function Zy(e, t, n, r) {
  let i = B(),
    o = Me(),
    s = mm(2)
  if ((o.firstUpdatePass && Qy(o, e, s, r), t !== Sn && xn(i, s, t))) {
    let a = o.data[Lt()]
    tD(o, a, i, i[K], e, (i[s + 1] = nD(t, n)), r, s)
  }
}
function Yy(e, t) {
  return t >= e.expandoStartIndex
}
function Qy(e, t, n, r) {
  let i = e.data
  if (i[n + 1] === null) {
    let o = i[Lt()],
      s = Yy(e, n)
    rD(o, r) && t === null && !s && (t = !1),
      (t = Ky(i, o, t, r)),
      Gy(i, o, t, n, s, r)
  }
}
function Ky(e, t, n, r) {
  let i = wm(e),
    o = r ? t.residualClasses : t.residualStyles
  if (i === null)
    (r ? t.classBindings : t.styleBindings) === 0 &&
      ((n = Rs(null, e, t, n, r)), (n = fr(n, t.attrs, r)), (o = null))
  else {
    let s = t.directiveStylingLast
    if (s === -1 || e[s] !== i)
      if (((n = Rs(i, e, t, n, r)), o === null)) {
        let u = Jy(e, t, r)
        u !== void 0 &&
          Array.isArray(u) &&
          ((u = Rs(null, e, t, u[1], r)),
          (u = fr(u, t.attrs, r)),
          Xy(e, t, r, u))
      } else o = eD(e, t, r)
  }
  return (
    o !== void 0 && (r ? (t.residualClasses = o) : (t.residualStyles = o)), n
  )
}
function Jy(e, t, n) {
  let r = n ? t.classBindings : t.styleBindings
  if (Cn(r) !== 0) return e[Ft(r)]
}
function Xy(e, t, n, r) {
  let i = n ? t.classBindings : t.styleBindings
  e[Ft(i)] = r
}
function eD(e, t, n) {
  let r,
    i = t.directiveEnd
  for (let o = 1 + t.directiveStylingLast; o < i; o++) {
    let s = e[o].hostAttrs
    r = fr(r, s, n)
  }
  return fr(r, t.attrs, n)
}
function Rs(e, t, n, r, i) {
  let o = null,
    s = n.directiveEnd,
    a = n.directiveStylingLast
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < s && ((o = t[a]), (r = fr(r, o.hostAttrs, i)), o !== e);

  )
    a++
  return e !== null && (n.directiveStylingLast = a), r
}
function fr(e, t, n) {
  let r = n ? 1 : 2,
    i = -1
  if (t !== null)
    for (let o = 0; o < t.length; o++) {
      let s = t[o]
      typeof s == 'number'
        ? (i = s)
        : i === r &&
          (Array.isArray(e) || (e = e === void 0 ? [] : ['', e]),
          yg(e, s, n ? !0 : t[++o]))
    }
  return e === void 0 ? null : e
}
function tD(e, t, n, r, i, o, s, a) {
  if (!(t.type & 3)) return
  let u = e.data,
    c = u[a + 1],
    l = zy(c) ? Nl(u, t, n, i, Cn(c), s) : void 0
  if (!zi(l)) {
    zi(o) || (By(c) && (o = Nl(u, null, n, i, a, s)))
    let d = fd(Lt(), n)
    vv(r, s, d, i, o)
  }
}
function Nl(e, t, n, r, i, o) {
  let s = t === null,
    a
  for (; i > 0; ) {
    let u = e[i],
      c = Array.isArray(u),
      l = c ? u[1] : u,
      d = l === null,
      f = n[i + 1]
    f === Sn && (f = d ? Ie : void 0)
    let h = d ? Cs(f, r) : l === r ? f : void 0
    if ((c && !zi(h) && (h = Cs(u, r)), zi(h) && ((a = h), s))) return a
    let m = e[i + 1]
    i = s ? Ft(m) : Cn(m)
  }
  if (t !== null) {
    let u = o ? t.residualClasses : t.residualStyles
    u != null && (a = Cs(u, r))
  }
  return a
}
function zi(e) {
  return e !== void 0
}
function nD(e, t) {
  return (
    e == null ||
      e === '' ||
      (typeof t == 'string'
        ? (e = e + t)
        : typeof e == 'object' && (e = fe(qa(e)))),
    e
  )
}
function rD(e, t) {
  return (e.flags & (t ? 8 : 16)) !== 0
}
var pa = class {
  destroy(t) {}
  updateValue(t, n) {}
  swap(t, n) {
    let r = Math.min(t, n),
      i = Math.max(t, n),
      o = this.detach(i)
    if (i - r > 1) {
      let s = this.detach(r)
      this.attach(r, o), this.attach(i, s)
    } else this.attach(r, o)
  }
  move(t, n) {
    this.attach(n, this.detach(t))
  }
}
function Os(e, t, n, r, i) {
  return e === n && Object.is(t, r) ? 1 : Object.is(i(e, t), i(n, r)) ? -1 : 0
}
function iD(e, t, n) {
  let r,
    i,
    o = 0,
    s = e.length - 1
  if (Array.isArray(t)) {
    let a = t.length - 1
    for (; o <= s && o <= a; ) {
      let u = e.at(o),
        c = t[o],
        l = Os(o, u, o, c, n)
      if (l !== 0) {
        l < 0 && e.updateValue(o, c), o++
        continue
      }
      let d = e.at(s),
        f = t[a],
        h = Os(s, d, a, f, n)
      if (h !== 0) {
        h < 0 && e.updateValue(s, f), s--, a--
        continue
      }
      let m = n(o, u),
        M = n(s, d),
        y = n(o, c)
      if (Object.is(y, M)) {
        let v = n(a, f)
        Object.is(v, m)
          ? (e.swap(o, s), e.updateValue(s, f), a--, s--)
          : e.move(s, o),
          e.updateValue(o, c),
          o++
        continue
      }
      if (((r ??= new Gi()), (i ??= Ol(e, o, s, n)), ga(e, r, o, y)))
        e.updateValue(o, c), o++, s++
      else if (i.has(y)) r.set(m, e.detach(o)), s--
      else {
        let v = e.create(o, t[o])
        e.attach(o, v), o++, s++
      }
    }
    for (; o <= a; ) Rl(e, r, n, o, t[o]), o++
  } else if (t != null) {
    let a = t[Symbol.iterator](),
      u = a.next()
    for (; !u.done && o <= s; ) {
      let c = e.at(o),
        l = u.value,
        d = Os(o, c, o, l, n)
      if (d !== 0) d < 0 && e.updateValue(o, l), o++, (u = a.next())
      else {
        ;(r ??= new Gi()), (i ??= Ol(e, o, s, n))
        let f = n(o, l)
        if (ga(e, r, o, f)) e.updateValue(o, l), o++, s++, (u = a.next())
        else if (!i.has(f))
          e.attach(o, e.create(o, l)), o++, s++, (u = a.next())
        else {
          let h = n(o, c)
          r.set(h, e.detach(o)), s--
        }
      }
    }
    for (; !u.done; ) Rl(e, r, n, e.length, u.value), (u = a.next())
  }
  for (; o <= s; ) e.destroy(e.detach(s--))
  r?.forEach((a) => {
    e.destroy(a)
  })
}
function ga(e, t, n, r) {
  return t !== void 0 && t.has(r)
    ? (e.attach(n, t.get(r)), t.delete(r), !0)
    : !1
}
function Rl(e, t, n, r, i) {
  if (ga(e, t, r, n(r, i))) e.updateValue(r, i)
  else {
    let o = e.create(r, i)
    e.attach(r, o)
  }
}
function Ol(e, t, n, r) {
  let i = new Set()
  for (let o = t; o <= n; o++) i.add(r(o, e.at(o)))
  return i
}
var Gi = class {
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
      let i = this._vMap
      for (; i.has(r); ) r = i.get(r)
      i.set(r, n)
    } else this.kvMap.set(t, n)
  }
  forEach(t) {
    for (let [n, r] of this.kvMap)
      if ((t(r, n), this._vMap !== void 0)) {
        let i = this._vMap
        for (; i.has(r); ) (r = i.get(r)), t(r, n)
      }
  }
}
function Sf(e, t, n) {
  jt('NgControlFlow')
  let r = B(),
    i = gr(),
    o = Da(r, Oe + e),
    s = 0
  if (xn(r, i, t)) {
    let a = O(null)
    try {
      if ((vf(o, s), t !== -1)) {
        let u = wa(r[A], Oe + t),
          c = ar(o, u.tView.ssrId),
          l = eu(r, u, n, { dehydratedView: c })
        so(o, l, s, sr(u, c))
      }
    } finally {
      O(a)
    }
  } else {
    let a = mf(o, s)
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
function Tf(e, t, n, r, i, o, s, a, u, c, l, d, f) {
  jt('NgControlFlow')
  let h = u !== void 0,
    m = B(),
    M = a ? s.bind(m[Re][ce]) : s,
    y = new va(h, M)
  ;(m[Oe + e] = y), dr(e + 1, t, n, r, i, o), h && dr(e + 2, u, c, l, d, f)
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
    let r = n[er]
    ;(this.needsIndexUpdate ||= t !== this.length),
      so(this.lContainer, n, t, sr(this.templateTNode, r))
  }
  detach(t) {
    return (
      (this.needsIndexUpdate ||= t !== this.length - 1), oD(this.lContainer, t)
    )
  }
  create(t, n) {
    let r = ar(this.lContainer, this.templateTNode.tView.ssrId)
    return eu(
      this.hostLView,
      this.templateTNode,
      new ma(this.lContainer, n, t),
      { dehydratedView: r },
    )
  }
  destroy(t) {
    to(t[A], t)
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
    return sD(this.lContainer, t)
  }
}
function Af(e) {
  let t = O(null),
    n = Lt()
  try {
    let r = B(),
      i = r[A],
      o = r[n]
    if (o.liveCollection === void 0) {
      let a = n + 1,
        u = Da(r, a),
        c = wa(i, a)
      o.liveCollection = new ya(u, r, c)
    } else o.liveCollection.reset()
    let s = o.liveCollection
    if ((iD(s, e, o.trackByFn), s.updateIndexes(), o.hasEmptyBlock)) {
      let a = gr(),
        u = s.length === 0
      if (xn(r, a, u)) {
        let c = n + 2,
          l = Da(r, c)
        if (u) {
          let d = wa(i, c),
            f = ar(l, d.tView.ssrId),
            h = eu(r, d, void 0, { dehydratedView: f })
          so(l, h, 0, sr(d, f))
        } else vf(l, 0)
      }
    }
  } finally {
    O(t)
  }
}
function Da(e, t) {
  return e[t]
}
function oD(e, t) {
  return or(e, t)
}
function sD(e, t) {
  return mf(e, t)
}
function wa(e, t) {
  return Ra(e, t)
}
function aD(e, t, n, r, i, o) {
  let s = t.consts,
    a = Pi(s, i),
    u = io(t, e, 2, r, a)
  return (
    lf(t, n, u, Pi(s, o)),
    u.attrs !== null && aa(u, u.attrs, !1),
    u.mergedAttrs !== null && aa(u, u.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, u),
    u
  )
}
function U(e, t, n, r) {
  let i = B(),
    o = Me(),
    s = Oe + e,
    a = i[K],
    u = o.firstCreatePass ? aD(s, o, i, t, n, r) : o.data[s],
    c = uD(o, i, u, a, t, e)
  i[s] = c
  let l = Na(u)
  return (
    pr(u, !0),
    Xd(a, c, u),
    !Ly(u) && La() && Ya(o, i, c, u),
    am() === 0 && Ot(c, i),
    um(),
    l && (sf(o, i, u), of(o, u, i)),
    r !== null && af(i, u),
    U
  )
}
function V() {
  let e = _e()
  vd() ? pm() : ((e = e.parent), pr(e, !1))
  let t = e
  dm(t) && fm(), cm()
  let n = Me()
  return (
    n.firstCreatePass && (ja(n, e), ad(e) && n.queries.elementEnd(e)),
    t.classesWithoutHost != null &&
      Sm(t) &&
      xl(n, t, B(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      Tm(t) &&
      xl(n, t, B(), t.stylesWithoutHost, !1),
    V
  )
}
function Nn(e, t, n, r) {
  return U(e, t, n, r), V(), Nn
}
var uD = (e, t, n, r, i, o) => (Va(!0), Wd(r, i, Im()))
var qi = 'en-US'
var cD = qi
function lD(e) {
  typeof e == 'string' && (cD = e.toLowerCase().replace(/_/g, '-'))
}
function oe(e, t, n, r) {
  let i = B(),
    o = Me(),
    s = _e()
  return xf(o, i, i[K], s, e, t, r), oe
}
function dD(e, t, n, r) {
  let i = e.cleanup
  if (i != null)
    for (let o = 0; o < i.length - 1; o += 2) {
      let s = i[o]
      if (s === n && i[o + 1] === r) {
        let a = t[tr],
          u = i[o + 2]
        return a.length > u ? a[u] : null
      }
      typeof s == 'string' && (o += 2)
    }
  return null
}
function xf(e, t, n, r, i, o, s) {
  let a = Na(r),
    c = e.firstCreatePass && Bv(e),
    l = t[ce],
    d = $v(t),
    f = !0
  if (r.type & 3 || s) {
    let M = Pe(r, t),
      y = s ? s(M) : M,
      v = d.length,
      ne = s ? ($) => s(Be($[r.index])) : r.index,
      X = null
    if ((!s && a && (X = dD(e, t, i, r.index)), X !== null)) {
      let $ = X.__ngLastListenerFn__ || X
      ;($.__ngNextListenerFn__ = o), (X.__ngLastListenerFn__ = o), (f = !1)
    } else {
      o = Pl(r, t, l, o, !1)
      let $ = n.listen(y, i, o)
      d.push(o, $), c && c.push(i, ne, v, v + 1)
    }
  } else o = Pl(r, t, l, o, !1)
  let h = r.outputs,
    m
  if (f && h !== null && (m = h[i])) {
    let M = m.length
    if (M)
      for (let y = 0; y < M; y += 2) {
        let v = m[y],
          ne = m[y + 1],
          ke = t[v][ne].subscribe(o),
          ge = d.length
        d.push(o, ke), c && c.push(i, r.index, ge, -(ge + 1))
      }
  }
}
function Fl(e, t, n, r) {
  let i = O(null)
  try {
    return Ve(6, t, n), n(r) !== !1
  } catch (o) {
    return gf(e, o), !1
  } finally {
    Ve(7, t, n), O(i)
  }
}
function Pl(e, t, n, r, i) {
  return function o(s) {
    if (s === Function) return r
    let a = e.componentOffset > -1 ? ft(e.index, t) : t
    tu(a)
    let u = Fl(t, n, r, s),
      c = o.__ngNextListenerFn__
    for (; c; ) (u = Fl(t, n, c, s) && u), (c = c.__ngNextListenerFn__)
    return i && u === !1 && s.preventDefault(), u
  }
}
function ou(e = 1) {
  return Em(e)
}
function H(e, t = '') {
  let n = B(),
    r = Me(),
    i = e + Oe,
    o = r.firstCreatePass ? io(r, i, 1, t, null) : r.data[i],
    s = fD(r, n, o, t, e)
  ;(n[i] = s), La() && Ya(r, n, s, o), pr(o, !1)
}
var fD = (e, t, n, r, i) => (Va(!0), Jm(t[K], r))
function ze(e, t, n) {
  let r = B(),
    i = $y(r, e, t, n)
  return i !== Sn && Hv(r, Lt(), i), ze
}
function mr(e, t, n) {
  _f(t) && (t = t())
  let r = B(),
    i = gr()
  if (xn(r, i, t)) {
    let o = Me(),
      s = bd()
    cf(o, s, r, e, t, r[K], n, !1)
  }
  return mr
}
function lo(e, t) {
  let n = _f(e)
  return n && e.set(t), n
}
function vr(e, t) {
  let n = B(),
    r = Me(),
    i = _e()
  return xf(r, n, n[K], i, e, t), vr
}
function hD(e, t, n) {
  let r = Me()
  if (r.firstCreatePass) {
    let i = ct(e)
    Ca(n, r.data, r.blueprint, i, !0), Ca(t, r.data, r.blueprint, i, !1)
  }
}
function Ca(e, t, n, r, i) {
  if (((e = ae(e)), Array.isArray(e)))
    for (let o = 0; o < e.length; o++) Ca(e[o], t, n, r, i)
  else {
    let o = Me(),
      s = B(),
      a = _e(),
      u = mn(e) ? e : ae(e.provide),
      c = id(e),
      l = a.providerIndexes & 1048575,
      d = a.directiveStart,
      f = a.providerIndexes >> 20
    if (mn(e) || !e.multi) {
      let h = new Rt(c, i, J),
        m = Ps(u, t, i ? l : l + f, d)
      m === -1
        ? (Ws(Vi(a, s), o, u),
          Fs(o, e, t.length),
          t.push(u),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          n.push(h),
          s.push(h))
        : ((n[m] = h), (s[m] = h))
    } else {
      let h = Ps(u, t, l + f, d),
        m = Ps(u, t, l, l + f),
        M = h >= 0 && n[h],
        y = m >= 0 && n[m]
      if ((i && !y) || (!i && !M)) {
        Ws(Vi(a, s), o, u)
        let v = mD(i ? gD : pD, n.length, i, r, c)
        !i && y && (n[m].providerFactory = v),
          Fs(o, e, t.length, 0),
          t.push(u),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          n.push(v),
          s.push(v)
      } else {
        let v = Nf(n[i ? m : h], c, !i && r)
        Fs(o, e, h > -1 ? h : m, v)
      }
      !i && r && y && n[m].componentProviders++
    }
  }
}
function Fs(e, t, n, r) {
  let i = mn(t),
    o = Ug(t)
  if (i || o) {
    let u = (o ? ae(t.useClass) : t).prototype.ngOnDestroy
    if (u) {
      let c = e.destroyHooks || (e.destroyHooks = [])
      if (!i && t.multi) {
        let l = c.indexOf(n)
        l === -1 ? c.push(n, [r, u]) : c[l + 1].push(r, u)
      } else c.push(n, u)
    }
  }
}
function Nf(e, t, n) {
  return n && e.componentProviders++, e.multi.push(t) - 1
}
function Ps(e, t, n, r) {
  for (let i = n; i < r; i++) if (t[i] === e) return i
  return -1
}
function pD(e, t, n, r) {
  return Ea(this.multi, [])
}
function gD(e, t, n, r) {
  let i = this.multi,
    o
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = Dn(n, n[A], this.providerFactory.index, r)
    ;(o = a.slice(0, s)), Ea(i, o)
    for (let u = s; u < a.length; u++) o.push(a[u])
  } else (o = []), Ea(i, o)
  return o
}
function Ea(e, t) {
  for (let n = 0; n < e.length; n++) {
    let r = e[n]
    t.push(r())
  }
  return t
}
function mD(e, t, n, r, i) {
  let o = new Rt(e, n, J)
  return (
    (o.multi = []),
    (o.index = t),
    (o.componentProviders = 0),
    Nf(o, i, r && !n),
    o
  )
}
function gt(e, t = []) {
  return (n) => {
    n.providersResolver = (r, i) => hD(r, i ? i(e) : e, t)
  }
}
var vD = (() => {
  let t = class t {
    constructor(r) {
      ;(this._injector = r), (this.cachedInjectors = new Map())
    }
    getOrCreateStandaloneInjector(r) {
      if (!r.standalone) return null
      if (!this.cachedInjectors.has(r)) {
        let i = td(!1, r.type),
          o =
            i.length > 0
              ? ru([i], this._injector, `Standalone[${r.type.name}]`)
              : null
        this.cachedInjectors.set(r, o)
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
    factory: () => new t(S(he)),
  })
  let e = t
  return e
})()
function mt(e) {
  jt('NgStandalone'),
    (e.getStandaloneInjector = (t) =>
      t.get(vD).getOrCreateStandaloneInjector(e))
}
var fo = (() => {
  let t = class t {
    log(r) {
      console.log(r)
    }
    warn(r) {
      console.warn(r)
    }
  }
  ;(t.ɵfac = function (i) {
    return new (i || t)()
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'platform' }))
  let e = t
  return e
})()
var Rf = new C('')
function Bt(e) {
  return !!e && typeof e.then == 'function'
}
function Of(e) {
  return !!e && typeof e.subscribe == 'function'
}
var Ff = new C(''),
  Pf = (() => {
    let t = class t {
      constructor() {
        ;(this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((r, i) => {
            ;(this.resolve = r), (this.reject = i)
          })),
          (this.appInits = p(Ff, { optional: !0 }) ?? [])
      }
      runInitializers() {
        if (this.initialized) return
        let r = []
        for (let o of this.appInits) {
          let s = o()
          if (Bt(s)) r.push(s)
          else if (Of(s)) {
            let a = new Promise((u, c) => {
              s.subscribe({ complete: u, error: c })
            })
            r.push(a)
          }
        }
        let i = () => {
          ;(this.done = !0), this.resolve()
        }
        Promise.all(r)
          .then(() => {
            i()
          })
          .catch((o) => {
            this.reject(o)
          }),
          r.length === 0 && i(),
          (this.initialized = !0)
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)()
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })(),
  ho = new C('')
function yD() {
  Sc(() => {
    throw new w(600, !1)
  })
}
function DD(e) {
  return e.isBoundToModule
}
function wD(e, t, n) {
  try {
    let r = n()
    return Bt(r)
      ? r.catch((i) => {
          throw (t.runOutsideAngular(() => e.handleError(i)), i)
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
        (this.internalErrorHandler = p(Ld)),
        (this.afterRenderEffectManager = p(bf)),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new se()),
        (this.afterTick = new se()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = p(An).hasPendingTasks.pipe(E((r) => !r))),
        (this._injector = p(he))
    }
    get destroyed() {
      return this._destroyed
    }
    get injector() {
      return this._injector
    }
    bootstrap(r, i) {
      let o = r instanceof $i
      if (!this._injector.get(Pf).done) {
        let h = !o && Kl(r),
          m = !1
        throw new w(405, m)
      }
      let a
      o ? (a = r) : (a = this._injector.get(ao).resolveComponentFactory(r)),
        this.componentTypes.push(a.componentType)
      let u = DD(a) ? void 0 : this._injector.get(lt),
        c = i || a.selector,
        l = a.create(_n.NULL, [], c, u),
        d = l.location.nativeElement,
        f = l.injector.get(Rf, null)
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
      let i = O(null)
      try {
        ;(this._runningTick = !0), this.detectChangesInAttachedViews(r)
      } catch (o) {
        this.internalErrorHandler(o)
      } finally {
        this.afterTick.next(), (this._runningTick = !1), O(i)
      }
    }
    detectChangesInAttachedViews(r) {
      let i = 0,
        o = this.afterRenderEffectManager
      for (;;) {
        if (i === Df) throw new w(103, !1)
        if (r) {
          let s = i === 0
          this.beforeRender.next(s)
          for (let { _lView: a, notifyErrorHandler: u } of this._views)
            CD(a, s, u)
        }
        if (
          (i++,
          o.executeInternalCallbacks(),
          ![...this.externalTestViews.keys(), ...this._views].some(
            ({ _lView: s }) => Ia(s),
          ) &&
            (o.execute(),
            ![...this.externalTestViews.keys(), ...this._views].some(
              ({ _lView: s }) => Ia(s),
            )))
        )
          break
      }
    }
    attachView(r) {
      let i = r
      this._views.push(i), i.attachToAppRef(this)
    }
    detachView(r) {
      let i = r
      ks(this._views, i), i.detachFromAppRef()
    }
    _loadComponent(r) {
      this.attachView(r.hostView), this.tick(), this.components.push(r)
      let i = this._injector.get(ho, [])
      ;[...this._bootstrapListeners, ...i].forEach((o) => o(r))
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
  ;(t.ɵfac = function (i) {
    return new (i || t)()
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
  let e = t
  return e
})()
function ks(e, t) {
  let n = e.indexOf(t)
  n > -1 && e.splice(n, 1)
}
function CD(e, t, n) {
  ;(!t && !Ia(e)) || ED(e, n, t)
}
function Ia(e) {
  return Fa(e)
}
function ED(e, t, n) {
  let r
  n ? ((r = 0), (e[I] |= 1024)) : e[I] & 64 ? (r = 0) : (r = 1), wf(e, t, r)
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
        let i = this.compileModuleSync(r),
          o = Jl(r),
          s = qd(o.declarations).reduce((a, u) => {
            let c = Tt(u)
            return c && a.push(new cr(c)), a
          }, [])
        return new ba(i, s)
      }
      compileModuleAndAllComponentsAsync(r) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(r))
      }
      clearCache() {}
      clearCacheFor(r) {}
      getModuleId(r) {}
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)()
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })()
var ID = (() => {
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
  ;(t.ɵfac = function (i) {
    return new (i || t)()
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
  let e = t
  return e
})()
function bD(e) {
  return [
    { provide: q, useFactory: e },
    {
      provide: gn,
      multi: !0,
      useFactory: () => {
        let t = p(ID, { optional: !0 })
        return () => t.initialize()
      },
    },
    {
      provide: gn,
      multi: !0,
      useFactory: () => {
        let t = p(TD)
        return () => {
          t.initialize()
        }
      },
    },
    { provide: Ld, useFactory: MD },
  ]
}
function MD() {
  let e = p(q),
    t = p(Ke)
  return (n) => e.runOutsideAngular(() => t.handleError(n))
}
function _D(e) {
  let t = bD(() => new q(SD(e)))
  return In([[], t])
}
function SD(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  }
}
var TD = (() => {
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
  ;(t.ɵfac = function (i) {
    return new (i || t)()
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
  let e = t
  return e
})()
function AD() {
  return (typeof $localize < 'u' && $localize.locale) || qi
}
var au = new C('', {
  providedIn: 'root',
  factory: () => p(au, x.Optional | x.SkipSelf) || AD(),
})
var kf = new C('')
var Ti = null
function xD(e = [], t) {
  return _n.create({
    name: t,
    providers: [
      { provide: Ki, useValue: 'platform' },
      { provide: kf, useValue: new Set([() => (Ti = null)]) },
      ...e,
    ],
  })
}
function ND(e = []) {
  if (Ti) return Ti
  let t = xD(e)
  return (Ti = t), yD(), RD(t), t
}
function RD(e) {
  e.get(Ha, null)?.forEach((n) => n())
}
var Ht = (() => {
  let t = class t {}
  t.__NG_ELEMENT_ID__ = OD
  let e = t
  return e
})()
function OD(e) {
  return FD(_e(), B(), (e & 16) === 16)
}
function FD(e, t, n) {
  if (eo(e) && !n) {
    let r = ft(e.index, t)
    return new wn(r, r)
  } else if (e.type & 47) {
    let r = t[Re]
    return new wn(r, t)
  }
  return null
}
function Lf(e) {
  try {
    let { rootComponent: t, appProviders: n, platformProviders: r } = e,
      i = ND(r),
      o = [_D(), ...(n || [])],
      a = new Hi({
        providers: o,
        parent: i,
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
        f = i.get(kf)
      return (
        f.add(d),
        a.onDestroy(() => {
          l.unsubscribe(), f.delete(d)
        }),
        wD(c, u, () => {
          let h = a.get(Pf)
          return (
            h.runInitializers(),
            h.donePromise.then(() => {
              let m = a.get(au, qi)
              lD(m || qi)
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
function po(e) {
  return typeof e == 'boolean' ? e : e != null && e !== 'false'
}
function vt(e, t) {
  jt('NgSignals')
  let n = bc(e)
  return t?.equal && (n[Ze].equal = t.equal), n
}
var Uf = null
function nt() {
  return Uf
}
function $f(e) {
  Uf ??= e
}
var go = class {}
var pe = new C(''),
  Bf = (() => {
    let t = class t {
      historyGo(r) {
        throw new Error('')
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)()
    }),
      (t.ɵprov = D({ token: t, factory: () => p(LD), providedIn: 'platform' }))
    let e = t
    return e
  })()
var LD = (() => {
  let t = class t extends Bf {
    constructor() {
      super(),
        (this._doc = p(pe)),
        (this._location = window.location),
        (this._history = window.history)
    }
    getBaseHrefFromDOM() {
      return nt().getBaseHref(this._doc)
    }
    onPopState(r) {
      let i = nt().getGlobalEventTarget(this._doc, 'window')
      return (
        i.addEventListener('popstate', r, !1),
        () => i.removeEventListener('popstate', r)
      )
    }
    onHashChange(r) {
      let i = nt().getGlobalEventTarget(this._doc, 'window')
      return (
        i.addEventListener('hashchange', r, !1),
        () => i.removeEventListener('hashchange', r)
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
    pushState(r, i, o) {
      this._history.pushState(r, i, o)
    }
    replaceState(r, i, o) {
      this._history.replaceState(r, i, o)
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
  ;(t.ɵfac = function (i) {
    return new (i || t)()
  }),
    (t.ɵprov = D({ token: t, factory: () => new t(), providedIn: 'platform' }))
  let e = t
  return e
})()
function Hf(e, t) {
  if (e.length == 0) return t
  if (t.length == 0) return e
  let n = 0
  return (
    e.endsWith('/') && n++,
    t.startsWith('/') && n++,
    n == 2 ? e + t.substring(1) : n == 1 ? e + t : e + '/' + t
  )
}
function Vf(e) {
  let t = e.match(/#|\?|$/),
    n = (t && t.index) || e.length,
    r = n - (e[n - 1] === '/' ? 1 : 0)
  return e.slice(0, r) + e.slice(n)
}
function zt(e) {
  return e && e[0] !== '?' ? '?' + e : e
}
var mo = (() => {
    let t = class t {
      historyGo(r) {
        throw new Error('')
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)()
    }),
      (t.ɵprov = D({ token: t, factory: () => p(zf), providedIn: 'root' }))
    let e = t
    return e
  })(),
  VD = new C(''),
  zf = (() => {
    let t = class t extends mo {
      constructor(r, i) {
        super(),
          (this._platformLocation = r),
          (this._removeListenerFns = []),
          (this._baseHref =
            i ??
            this._platformLocation.getBaseHrefFromDOM() ??
            p(pe).location?.origin ??
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
        return Hf(this._baseHref, r)
      }
      path(r = !1) {
        let i =
            this._platformLocation.pathname + zt(this._platformLocation.search),
          o = this._platformLocation.hash
        return o && r ? `${i}${o}` : i
      }
      pushState(r, i, o, s) {
        let a = this.prepareExternalUrl(o + zt(s))
        this._platformLocation.pushState(r, i, a)
      }
      replaceState(r, i, o, s) {
        let a = this.prepareExternalUrl(o + zt(s))
        this._platformLocation.replaceState(r, i, a)
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
    ;(t.ɵfac = function (i) {
      return new (i || t)(S(Bf), S(VD, 8))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })()
var yr = (() => {
  let t = class t {
    constructor(r) {
      ;(this._subject = new ue()),
        (this._urlChangeListeners = []),
        (this._urlChangeSubscription = null),
        (this._locationStrategy = r)
      let i = this._locationStrategy.getBaseHref()
      ;(this._basePath = $D(Vf(jf(i)))),
        this._locationStrategy.onPopState((o) => {
          this._subject.emit({
            url: this.path(!0),
            pop: !0,
            state: o.state,
            type: o.type,
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
    isCurrentPathEqualTo(r, i = '') {
      return this.path() == this.normalize(r + zt(i))
    }
    normalize(r) {
      return t.stripTrailingSlash(UD(this._basePath, jf(r)))
    }
    prepareExternalUrl(r) {
      return (
        r && r[0] !== '/' && (r = '/' + r),
        this._locationStrategy.prepareExternalUrl(r)
      )
    }
    go(r, i = '', o = null) {
      this._locationStrategy.pushState(o, '', r, i),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(r + zt(i)), o)
    }
    replaceState(r, i = '', o = null) {
      this._locationStrategy.replaceState(o, '', r, i),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(r + zt(i)), o)
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
        (this._urlChangeSubscription ??= this.subscribe((i) => {
          this._notifyUrlChangeListeners(i.url, i.state)
        })),
        () => {
          let i = this._urlChangeListeners.indexOf(r)
          this._urlChangeListeners.splice(i, 1),
            this._urlChangeListeners.length === 0 &&
              (this._urlChangeSubscription?.unsubscribe(),
              (this._urlChangeSubscription = null))
        }
      )
    }
    _notifyUrlChangeListeners(r = '', i) {
      this._urlChangeListeners.forEach((o) => o(r, i))
    }
    subscribe(r, i, o) {
      return this._subject.subscribe({ next: r, error: i, complete: o })
    }
  }
  ;(t.normalizeQueryParams = zt),
    (t.joinWithSlash = Hf),
    (t.stripTrailingSlash = Vf),
    (t.ɵfac = function (i) {
      return new (i || t)(S(mo))
    }),
    (t.ɵprov = D({ token: t, factory: () => jD(), providedIn: 'root' }))
  let e = t
  return e
})()
function jD() {
  return new yr(S(mo))
}
function UD(e, t) {
  if (!e || !t.startsWith(e)) return t
  let n = t.substring(e.length)
  return n === '' || ['/', ';', '?', '#'].includes(n[0]) ? n : t
}
function jf(e) {
  return e.replace(/\/index.html$/, '')
}
function $D(e) {
  if (new RegExp('^(https?:)?//').test(e)) {
    let [, n] = e.split(/\/\/[^\/]+/)
    return n
  }
  return e
}
function vo(e, t) {
  t = encodeURIComponent(t)
  for (let n of e.split(';')) {
    let r = n.indexOf('='),
      [i, o] = r == -1 ? [n, ''] : [n.slice(0, r), n.slice(r + 1)]
    if (i.trim() === t) return decodeURIComponent(o)
  }
  return null
}
var Gf = 'browser',
  BD = 'server'
function yo(e) {
  return e === BD
}
var On = class {}
var wr = class {},
  wo = class {},
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
                        let i = n.slice(0, r),
                          o = i.toLowerCase(),
                          s = n.slice(r + 1).trim()
                        this.maybeSetNormalizedName(i, o),
                          this.headers.has(o)
                            ? this.headers.get(o).push(s)
                            : this.headers.set(o, [s])
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
          let i = (t.op === 'a' ? this.headers.get(n) : void 0) || []
          i.push(...r), this.headers.set(n, i)
          break
        case 'd':
          let o = t.value
          if (!o) this.headers.delete(n), this.normalizedNames.delete(n)
          else {
            let s = this.headers.get(n)
            if (!s) return
            ;(s = s.filter((a) => o.indexOf(a) === -1)),
              s.length === 0
                ? (this.headers.delete(n), this.normalizedNames.delete(n))
                : this.headers.set(n, s)
          }
          break
      }
    }
    setHeaderEntries(t, n) {
      let r = (Array.isArray(n) ? n : [n]).map((o) => o.toString()),
        i = t.toLowerCase()
      this.headers.set(i, r), this.maybeSetNormalizedName(t, i)
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
    return qf(t)
  }
  encodeValue(t) {
    return qf(t)
  }
  decodeKey(t) {
    return decodeURIComponent(t)
  }
  decodeValue(t) {
    return decodeURIComponent(t)
  }
}
function qD(e, t) {
  let n = new Map()
  return (
    e.length > 0 &&
      e
        .replace(/^\?/, '')
        .split('&')
        .forEach((i) => {
          let o = i.indexOf('='),
            [s, a] =
              o == -1
                ? [t.decodeKey(i), '']
                : [t.decodeKey(i.slice(0, o)), t.decodeValue(i.slice(o + 1))],
            u = n.get(s) || []
          u.push(a), n.set(s, u)
        }),
    n
  )
}
var WD = /%(\d[a-f0-9])/gi,
  ZD = {
    40: '@',
    '3A': ':',
    24: '$',
    '2C': ',',
    '3B': ';',
    '3D': '=',
    '3F': '?',
    '2F': '/',
  }
function qf(e) {
  return encodeURIComponent(e).replace(WD, (t, n) => ZD[n] ?? t)
}
function Do(e) {
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
      this.map = qD(t.fromString, this.encoder)
    } else
      t.fromObject
        ? ((this.map = new Map()),
          Object.keys(t.fromObject).forEach((n) => {
            let r = t.fromObject[n],
              i = Array.isArray(r) ? r.map(Do) : [Do(r)]
            this.map.set(n, i)
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
        let i = t[r]
        Array.isArray(i)
          ? i.forEach((o) => {
              n.push({ param: r, value: o, op: 'a' })
            })
          : n.push({ param: r, value: i, op: 'a' })
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
              n.push(Do(t.value)), this.map.set(t.param, n)
              break
            case 'd':
              if (t.value !== void 0) {
                let r = this.map.get(t.param) || [],
                  i = r.indexOf(Do(t.value))
                i !== -1 && r.splice(i, 1),
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
function YD(e) {
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
function Wf(e) {
  return typeof ArrayBuffer < 'u' && e instanceof ArrayBuffer
}
function Zf(e) {
  return typeof Blob < 'u' && e instanceof Blob
}
function Yf(e) {
  return typeof FormData < 'u' && e instanceof FormData
}
function QD(e) {
  return typeof URLSearchParams < 'u' && e instanceof URLSearchParams
}
var Dr = class e {
    constructor(t, n, r, i) {
      ;(this.url = n),
        (this.body = null),
        (this.reportProgress = !1),
        (this.withCredentials = !1),
        (this.responseType = 'json'),
        (this.method = t.toUpperCase())
      let o
      if (
        (YD(this.method) || i
          ? ((this.body = r !== void 0 ? r : null), (o = i))
          : (o = r),
        o &&
          ((this.reportProgress = !!o.reportProgress),
          (this.withCredentials = !!o.withCredentials),
          o.responseType && (this.responseType = o.responseType),
          o.headers && (this.headers = o.headers),
          o.context && (this.context = o.context),
          o.params && (this.params = o.params),
          (this.transferCache = o.transferCache)),
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
            Wf(this.body) ||
            Zf(this.body) ||
            Yf(this.body) ||
            QD(this.body)
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
      return this.body === null || Yf(this.body)
        ? null
        : Zf(this.body)
          ? this.body.type || null
          : Wf(this.body)
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
        i = t.responseType || this.responseType,
        o = t.transferCache ?? this.transferCache,
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
          responseType: i,
          withCredentials: a,
          transferCache: o,
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
  Cr = class {
    constructor(t, n = Io.Ok, r = 'OK') {
      ;(this.headers = t.headers || new Gt()),
        (this.status = t.status !== void 0 ? t.status : n),
        (this.statusText = t.statusText || r),
        (this.url = t.url || null),
        (this.ok = this.status >= 200 && this.status < 300)
    }
  },
  fu = class e extends Cr {
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
  Co = class e extends Cr {
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
  Eo = class extends Cr {
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
  Io = (function (e) {
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
  })(Io || {})
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
    request(r, i, o = {}) {
      let s
      if (r instanceof Dr) s = r
      else {
        let c
        o.headers instanceof Gt ? (c = o.headers) : (c = new Gt(o.headers))
        let l
        o.params &&
          (o.params instanceof yt
            ? (l = o.params)
            : (l = new yt({ fromObject: o.params }))),
          (s = new Dr(r, i, o.body !== void 0 ? o.body : null, {
            headers: c,
            context: o.context,
            params: l,
            reportProgress: o.reportProgress,
            responseType: o.responseType || 'json',
            withCredentials: o.withCredentials,
            transferCache: o.transferCache,
          }))
      }
      let a = b(s).pipe(ot((c) => this.handler.handle(c)))
      if (r instanceof Dr || o.observe === 'events') return a
      let u = a.pipe(ye((c) => c instanceof Co))
      switch (o.observe || 'body') {
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
          throw new Error(`Unreachable: unhandled observe type ${o.observe}}`)
      }
    }
    delete(r, i = {}) {
      return this.request('DELETE', r, i)
    }
    get(r, i = {}) {
      return this.request('GET', r, i)
    }
    head(r, i = {}) {
      return this.request('HEAD', r, i)
    }
    jsonp(r, i) {
      return this.request('JSONP', r, {
        params: new yt().append(i, 'JSONP_CALLBACK'),
        observe: 'body',
        responseType: 'json',
      })
    }
    options(r, i = {}) {
      return this.request('OPTIONS', r, i)
    }
    patch(r, i, o = {}) {
      return this.request('PATCH', r, cu(o, i))
    }
    post(r, i, o = {}) {
      return this.request('POST', r, cu(o, i))
    }
    put(r, i, o = {}) {
      return this.request('PUT', r, cu(o, i))
    }
  }
  ;(t.ɵfac = function (i) {
    return new (i || t)(S(wr))
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac }))
  let e = t
  return e
})()
function KD(e, t) {
  return t(e)
}
function JD(e, t, n) {
  return (r, i) => Xe(n, () => t(r, (o) => e(o, i)))
}
var Jf = new C(''),
  XD = new C(''),
  ew = new C('')
var Qf = (() => {
  let t = class t extends wr {
    constructor(r, i) {
      super(),
        (this.backend = r),
        (this.injector = i),
        (this.chain = null),
        (this.pendingTasks = p(An))
      let o = p(ew, { optional: !0 })
      this.backend = o ?? r
    }
    handle(r) {
      if (this.chain === null) {
        let o = Array.from(
          new Set([...this.injector.get(Jf), ...this.injector.get(XD, [])]),
        )
        this.chain = o.reduceRight((s, a) => JD(s, a, this.injector), KD)
      }
      let i = this.pendingTasks.add()
      return this.chain(r, (o) => this.backend.handle(o)).pipe(
        Mt(() => this.pendingTasks.remove(i)),
      )
    }
  }
  ;(t.ɵfac = function (i) {
    return new (i || t)(S(wo), S(he))
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac }))
  let e = t
  return e
})()
var tw = /^\)\]\}',?\n/
function nw(e) {
  return 'responseURL' in e && e.responseURL
    ? e.responseURL
    : /^X-Request-URL:/m.test(e.getAllResponseHeaders())
      ? e.getResponseHeader('X-Request-URL')
      : null
}
var Kf = (() => {
    let t = class t {
      constructor(r) {
        this.xhrFactory = r
      }
      handle(r) {
        if (r.method === 'JSONP') throw new w(-2800, !1)
        let i = this.xhrFactory
        return (i.ɵloadImpl ? z(i.ɵloadImpl()) : b(null)).pipe(
          De(
            () =>
              new k((s) => {
                let a = i.build()
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
                      ne = nw(a) || r.url
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
                    v !== Io.NoContent &&
                      ($ =
                        typeof a.response > 'u' ? a.responseText : a.response),
                      v === 0 && (v = $ ? Io.Ok : 0)
                    let ke = v >= 200 && v < 300
                    if (r.responseType === 'json' && typeof $ == 'string') {
                      let ge = $
                      $ = $.replace(tw, '')
                      try {
                        $ = $ !== '' ? JSON.parse($) : null
                      } catch (rt) {
                        ;($ = ge),
                          ke && ((ke = !1), ($ = { error: rt, text: $ }))
                      }
                    }
                    ke
                      ? (s.next(
                          new Co({
                            body: $,
                            headers: y,
                            status: v,
                            statusText: ne,
                            url: X || void 0,
                          }),
                        ),
                        s.complete())
                      : s.error(
                          new Eo({
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
                      ne = new Eo({
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
    ;(t.ɵfac = function (i) {
      return new (i || t)(S(On))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })(),
  Xf = new C(''),
  rw = 'XSRF-TOKEN',
  iw = new C('', { providedIn: 'root', factory: () => rw }),
  ow = 'X-XSRF-TOKEN',
  sw = new C('', { providedIn: 'root', factory: () => ow }),
  bo = class {},
  aw = (() => {
    let t = class t {
      constructor(r, i, o) {
        ;(this.doc = r),
          (this.platform = i),
          (this.cookieName = o),
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
            (this.lastToken = vo(r, this.cookieName)),
            (this.lastCookieString = r)),
          this.lastToken
        )
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)(S(pe), S(pt), S(iw))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })()
function uw(e, t) {
  let n = e.url.toLowerCase()
  if (
    !p(Xf) ||
    e.method === 'GET' ||
    e.method === 'HEAD' ||
    n.startsWith('http://') ||
    n.startsWith('https://')
  )
    return t(e)
  let r = p(bo).getToken(),
    i = p(sw)
  return (
    r != null &&
      !e.headers.has(i) &&
      (e = e.clone({ headers: e.headers.set(i, r) })),
    t(e)
  )
}
function eh(...e) {
  let t = [
    hu,
    Kf,
    Qf,
    { provide: wr, useExisting: Qf },
    { provide: wo, useExisting: Kf },
    { provide: Jf, useValue: uw, multi: !0 },
    { provide: Xf, useValue: !0 },
    { provide: bo, useClass: aw },
  ]
  for (let n of e) t.push(...n.ɵproviders)
  return In(t)
}
var mu = class extends go {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0)
    }
  },
  vu = class e extends mu {
    static makeCurrent() {
      $f(new e())
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
      let n = lw()
      return n == null ? null : dw(n)
    }
    resetBaseElement() {
      Er = null
    }
    getUserAgent() {
      return window.navigator.userAgent
    }
    getCookie(t) {
      return vo(document.cookie, t)
    }
  },
  Er = null
function lw() {
  return (
    (Er = Er || document.querySelector('base')),
    Er ? Er.getAttribute('href') : null
  )
}
function dw(e) {
  return new URL(e, document.baseURI).pathname
}
var fw = (() => {
    let t = class t {
      build() {
        return new XMLHttpRequest()
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)()
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })(),
  yu = new C(''),
  ih = (() => {
    let t = class t {
      constructor(r, i) {
        ;(this._zone = i),
          (this._eventNameToPlugin = new Map()),
          r.forEach((o) => {
            o.manager = this
          }),
          (this._plugins = r.slice().reverse())
      }
      addEventListener(r, i, o) {
        return this._findPluginFor(i).addEventListener(r, i, o)
      }
      getZone() {
        return this._zone
      }
      _findPluginFor(r) {
        let i = this._eventNameToPlugin.get(r)
        if (i) return i
        if (((i = this._plugins.find((s) => s.supports(r))), !i))
          throw new w(5101, !1)
        return this._eventNameToPlugin.set(r, i), i
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)(S(yu), S(q))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })(),
  Mo = class {
    constructor(t) {
      this._doc = t
    }
  },
  pu = 'ng-app-id',
  oh = (() => {
    let t = class t {
      constructor(r, i, o, s = {}) {
        ;(this.doc = r),
          (this.appId = i),
          (this.nonce = o),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = yo(s)),
          this.resetHostNodes()
      }
      addStyles(r) {
        for (let i of r)
          this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i)
      }
      removeStyles(r) {
        for (let i of r)
          this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i)
      }
      ngOnDestroy() {
        let r = this.styleNodesInDOM
        r && (r.forEach((i) => i.remove()), r.clear())
        for (let i of this.getAllStyles()) this.onStyleRemoved(i)
        this.resetHostNodes()
      }
      addHost(r) {
        this.hostNodes.add(r)
        for (let i of this.getAllStyles()) this.addStyleToHost(r, i)
      }
      removeHost(r) {
        this.hostNodes.delete(r)
      }
      getAllStyles() {
        return this.styleRef.keys()
      }
      onStyleAdded(r) {
        for (let i of this.hostNodes) this.addStyleToHost(i, r)
      }
      onStyleRemoved(r) {
        let i = this.styleRef
        i.get(r)?.elements?.forEach((o) => o.remove()), i.delete(r)
      }
      collectServerRenderedStyles() {
        let r = this.doc.head?.querySelectorAll(`style[${pu}="${this.appId}"]`)
        if (r?.length) {
          let i = new Map()
          return (
            r.forEach((o) => {
              o.textContent != null && i.set(o.textContent, o)
            }),
            i
          )
        }
        return null
      }
      changeUsageCount(r, i) {
        let o = this.styleRef
        if (o.has(r)) {
          let s = o.get(r)
          return (s.usage += i), s.usage
        }
        return o.set(r, { usage: i, elements: [] }), i
      }
      getStyleElement(r, i) {
        let o = this.styleNodesInDOM,
          s = o?.get(i)
        if (s?.parentNode === r) return o.delete(i), s.removeAttribute(pu), s
        {
          let a = this.doc.createElement('style')
          return (
            this.nonce && a.setAttribute('nonce', this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(pu, this.appId),
            r.appendChild(a),
            a
          )
        }
      }
      addStyleToHost(r, i) {
        let o = this.getStyleElement(r, i),
          s = this.styleRef,
          a = s.get(i)?.elements
        a ? a.push(o) : s.set(i, { elements: [o], usage: 1 })
      }
      resetHostNodes() {
        let r = this.hostNodes
        r.clear(), r.add(this.doc.head)
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)(S(pe), S(Ba), S(za, 8), S(pt))
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
  sh = '%COMP%',
  hw = `_nghost-${sh}`,
  pw = `_ngcontent-${sh}`,
  gw = !0,
  mw = new C('', { providedIn: 'root', factory: () => gw })
function vw(e) {
  return pw.replace(wu, e)
}
function yw(e) {
  return hw.replace(wu, e)
}
function ah(e, t) {
  return t.map((n) => n.replace(wu, e))
}
var th = (() => {
    let t = class t {
      constructor(r, i, o, s, a, u, c, l = null) {
        ;(this.eventManager = r),
          (this.sharedStylesHost = i),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = u),
          (this.ngZone = c),
          (this.nonce = l),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = yo(u)),
          (this.defaultRenderer = new Ir(r, a, c, this.platformIsServer))
      }
      createRenderer(r, i) {
        if (!r || !i) return this.defaultRenderer
        this.platformIsServer &&
          i.encapsulation === Ue.ShadowDom &&
          (i = R(g({}, i), { encapsulation: Ue.Emulated }))
        let o = this.getOrCreateRenderer(r, i)
        return (
          o instanceof _o
            ? o.applyToHost(r)
            : o instanceof br && o.applyStyles(),
          o
        )
      }
      getOrCreateRenderer(r, i) {
        let o = this.rendererByCompId,
          s = o.get(i.id)
        if (!s) {
          let a = this.doc,
            u = this.ngZone,
            c = this.eventManager,
            l = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            f = this.platformIsServer
          switch (i.encapsulation) {
            case Ue.Emulated:
              s = new _o(c, l, i, this.appId, d, a, u, f)
              break
            case Ue.ShadowDom:
              return new Du(c, l, r, i, a, u, this.nonce, f)
            default:
              s = new br(c, l, i, d, a, u, f)
              break
          }
          o.set(i.id, s)
        }
        return s
      }
      ngOnDestroy() {
        this.rendererByCompId.clear()
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)(S(ih), S(oh), S(Ba), S(mw), S(pe), S(pt), S(q), S(za))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })(),
  Ir = class {
    constructor(t, n, r, i) {
      ;(this.eventManager = t),
        (this.doc = n),
        (this.ngZone = r),
        (this.platformIsServer = i),
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
      ;(nh(t) ? t.content : t).appendChild(n)
    }
    insertBefore(t, n, r) {
      t && (nh(t) ? t.content : t).insertBefore(n, r)
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
    setAttribute(t, n, r, i) {
      if (i) {
        n = i + ':' + n
        let o = gu[i]
        o ? t.setAttributeNS(o, n, r) : t.setAttribute(n, r)
      } else t.setAttribute(n, r)
    }
    removeAttribute(t, n, r) {
      if (r) {
        let i = gu[r]
        i ? t.removeAttributeNS(i, n) : t.removeAttribute(`${r}:${n}`)
      } else t.removeAttribute(n)
    }
    addClass(t, n) {
      t.classList.add(n)
    }
    removeClass(t, n) {
      t.classList.remove(n)
    }
    setStyle(t, n, r, i) {
      i & (Je.DashCase | Je.Important)
        ? t.style.setProperty(n, r, i & Je.Important ? 'important' : '')
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
function nh(e) {
  return e.tagName === 'TEMPLATE' && e.content !== void 0
}
var Du = class extends Ir {
    constructor(t, n, r, i, o, s, a, u) {
      super(t, o, s, u),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: 'open' })),
        this.sharedStylesHost.addHost(this.shadowRoot)
      let c = ah(i.id, i.styles)
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
  br = class extends Ir {
    constructor(t, n, r, i, o, s, a, u) {
      super(t, o, s, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = u ? ah(u, r.styles) : r.styles)
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles)
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles)
    }
  },
  _o = class extends br {
    constructor(t, n, r, i, o, s, a, u) {
      let c = i + '-' + r.id
      super(t, n, r, o, s, a, u, c),
        (this.contentAttr = vw(c)),
        (this.hostAttr = yw(c))
    }
    applyToHost(t) {
      this.applyStyles(), this.setAttribute(t, this.hostAttr, '')
    }
    createElement(t, n) {
      let r = super.createElement(t, n)
      return super.setAttribute(r, this.contentAttr, ''), r
    }
  },
  Dw = (() => {
    let t = class t extends Mo {
      constructor(r) {
        super(r)
      }
      supports(r) {
        return !0
      }
      addEventListener(r, i, o) {
        return (
          r.addEventListener(i, o, !1), () => this.removeEventListener(r, i, o)
        )
      }
      removeEventListener(r, i, o) {
        return r.removeEventListener(i, o)
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)(S(pe))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })(),
  rh = ['alt', 'control', 'meta', 'shift'],
  ww = {
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
  Cw = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  Ew = (() => {
    let t = class t extends Mo {
      constructor(r) {
        super(r)
      }
      supports(r) {
        return t.parseEventName(r) != null
      }
      addEventListener(r, i, o) {
        let s = t.parseEventName(i),
          a = t.eventCallback(s.fullKey, o, this.manager.getZone())
        return this.manager
          .getZone()
          .runOutsideAngular(() => nt().onAndCancel(r, s.domEventName, a))
      }
      static parseEventName(r) {
        let i = r.toLowerCase().split('.'),
          o = i.shift()
        if (i.length === 0 || !(o === 'keydown' || o === 'keyup')) return null
        let s = t._normalizeKey(i.pop()),
          a = '',
          u = i.indexOf('code')
        if (
          (u > -1 && (i.splice(u, 1), (a = 'code.')),
          rh.forEach((l) => {
            let d = i.indexOf(l)
            d > -1 && (i.splice(d, 1), (a += l + '.'))
          }),
          (a += s),
          i.length != 0 || s.length === 0)
        )
          return null
        let c = {}
        return (c.domEventName = o), (c.fullKey = a), c
      }
      static matchEventFullKeyCode(r, i) {
        let o = ww[r.key] || r.key,
          s = ''
        return (
          i.indexOf('code.') > -1 && ((o = r.code), (s = 'code.')),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === ' ' ? (o = 'space') : o === '.' && (o = 'dot'),
              rh.forEach((a) => {
                if (a !== o) {
                  let u = Cw[a]
                  u(r) && (s += a + '.')
                }
              }),
              (s += o),
              s === i)
        )
      }
      static eventCallback(r, i, o) {
        return (s) => {
          t.matchEventFullKeyCode(s, r) && o.runGuarded(() => i(s))
        }
      }
      static _normalizeKey(r) {
        return r === 'esc' ? 'escape' : r
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)(S(pe))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })()
function uh(e, t) {
  return Lf(g({ rootComponent: e }, Iw(t)))
}
function Iw(e) {
  return {
    appProviders: [...Tw, ...(e?.providers ?? [])],
    platformProviders: Sw,
  }
}
function bw() {
  vu.makeCurrent()
}
function Mw() {
  return new Ke()
}
function _w() {
  return zd(document), document
}
var Sw = [
  { provide: pt, useValue: Gf },
  { provide: Ha, useValue: bw, multi: !0 },
  { provide: pe, useFactory: _w, deps: [] },
]
var Tw = [
  { provide: Ki, useValue: 'root' },
  { provide: Ke, useFactory: Mw, deps: [] },
  { provide: yu, useClass: Dw, multi: !0, deps: [pe, q, pt] },
  { provide: yu, useClass: Ew, multi: !0, deps: [pe] },
  th,
  oh,
  ih,
  { provide: ur, useExisting: th },
  { provide: On, useClass: fw, deps: [] },
  [],
]
var ch = (() => {
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
  ;(t.ɵfac = function (i) {
    return new (i || t)(S(pe))
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
  let e = t
  return e
})()
var T = 'primary',
  jr = Symbol('RouteTitle'),
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
function jn(e) {
  return new Mu(e)
}
function Nw(e, t, n) {
  let r = n.path.split('/')
  if (
    r.length > e.length ||
    (n.pathMatch === 'full' && (t.hasChildren() || r.length < e.length))
  )
    return null
  let i = {}
  for (let o = 0; o < r.length; o++) {
    let s = r[o],
      a = e[o]
    if (s.startsWith(':')) i[s.substring(1)] = a
    else if (s !== a.path) return null
  }
  return { consumed: e.slice(0, r.length), posParams: i }
}
function Rw(e, t) {
  if (e.length !== t.length) return !1
  for (let n = 0; n < e.length; ++n) if (!qe(e[n], t[n])) return !1
  return !0
}
function qe(e, t) {
  let n = e ? _u(e) : void 0,
    r = t ? _u(t) : void 0
  if (!n || !r || n.length != r.length) return !1
  let i
  for (let o = 0; o < n.length; o++)
    if (((i = n[o]), !gh(e[i], t[i]))) return !1
  return !0
}
function _u(e) {
  return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)]
}
function gh(e, t) {
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length) return !1
    let n = [...e].sort(),
      r = [...t].sort()
    return n.every((i, o) => r[o] === i)
  } else return e === t
}
function mh(e) {
  return e.length > 0 ? e[e.length - 1] : null
}
function Ct(e) {
  return hs(e) ? e : Bt(e) ? z(Promise.resolve(e)) : b(e)
}
var Ow = { exact: yh, subset: Dh },
  vh = { exact: Fw, subset: Pw, ignored: () => !0 }
function lh(e, t, n) {
  return (
    Ow[n.paths](e.root, t.root, n.matrixParams) &&
    vh[n.queryParams](e.queryParams, t.queryParams) &&
    !(n.fragment === 'exact' && e.fragment !== t.fragment)
  )
}
function Fw(e, t) {
  return qe(e, t)
}
function yh(e, t, n) {
  if (
    !Wt(e.segments, t.segments) ||
    !Ao(e.segments, t.segments, n) ||
    e.numberOfChildren !== t.numberOfChildren
  )
    return !1
  for (let r in t.children)
    if (!e.children[r] || !yh(e.children[r], t.children[r], n)) return !1
  return !0
}
function Pw(e, t) {
  return (
    Object.keys(t).length <= Object.keys(e).length &&
    Object.keys(t).every((n) => gh(e[n], t[n]))
  )
}
function Dh(e, t, n) {
  return wh(e, t, t.segments, n)
}
function wh(e, t, n, r) {
  if (e.segments.length > n.length) {
    let i = e.segments.slice(0, n.length)
    return !(!Wt(i, n) || t.hasChildren() || !Ao(i, n, r))
  } else if (e.segments.length === n.length) {
    if (!Wt(e.segments, n) || !Ao(e.segments, n, r)) return !1
    for (let i in t.children)
      if (!e.children[i] || !Dh(e.children[i], t.children[i], r)) return !1
    return !0
  } else {
    let i = n.slice(0, e.segments.length),
      o = n.slice(e.segments.length)
    return !Wt(e.segments, i) || !Ao(e.segments, i, r) || !e.children[T]
      ? !1
      : wh(e.children[T], t, o, r)
  }
}
function Ao(e, t, n) {
  return t.every((r, i) => vh[n](e[i].parameters, r.parameters))
}
var Dt = class {
    constructor(t = new L([], {}), n = {}, r = null) {
      ;(this.root = t), (this.queryParams = n), (this.fragment = r)
    }
    get queryParamMap() {
      return (this._queryParamMap ??= jn(this.queryParams)), this._queryParamMap
    }
    toString() {
      return Vw.serialize(this)
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
      return xo(this)
    }
  },
  qt = class {
    constructor(t, n) {
      ;(this.path = t), (this.parameters = n)
    }
    get parameterMap() {
      return (this._parameterMap ??= jn(this.parameters)), this._parameterMap
    }
    toString() {
      return Eh(this)
    }
  }
function kw(e, t) {
  return Wt(e, t) && e.every((n, r) => qe(n.parameters, t[r].parameters))
}
function Wt(e, t) {
  return e.length !== t.length ? !1 : e.every((n, r) => n.path === t[r].path)
}
function Lw(e, t) {
  let n = []
  return (
    Object.entries(e.children).forEach(([r, i]) => {
      r === T && (n = n.concat(t(i, r)))
    }),
    Object.entries(e.children).forEach(([r, i]) => {
      r !== T && (n = n.concat(t(i, r)))
    }),
    n
  )
}
var Ju = (() => {
    let t = class t {}
    ;(t.ɵfac = function (i) {
      return new (i || t)()
    }),
      (t.ɵprov = D({ token: t, factory: () => new Ro(), providedIn: 'root' }))
    let e = t
    return e
  })(),
  Ro = class {
    parse(t) {
      let n = new Tu(t)
      return new Dt(
        n.parseRootSegment(),
        n.parseQueryParams(),
        n.parseFragment(),
      )
    }
    serialize(t) {
      let n = `/${Mr(t.root, !0)}`,
        r = $w(t.queryParams),
        i = typeof t.fragment == 'string' ? `#${jw(t.fragment)}` : ''
      return `${n}${r}${i}`
    }
  },
  Vw = new Ro()
function xo(e) {
  return e.segments.map((t) => Eh(t)).join('/')
}
function Mr(e, t) {
  if (!e.hasChildren()) return xo(e)
  if (t) {
    let n = e.children[T] ? Mr(e.children[T], !1) : '',
      r = []
    return (
      Object.entries(e.children).forEach(([i, o]) => {
        i !== T && r.push(`${i}:${Mr(o, !1)}`)
      }),
      r.length > 0 ? `${n}(${r.join('//')})` : n
    )
  } else {
    let n = Lw(e, (r, i) =>
      i === T ? [Mr(e.children[T], !1)] : [`${i}:${Mr(r, !1)}`],
    )
    return Object.keys(e.children).length === 1 && e.children[T] != null
      ? `${xo(e)}/${n[0]}`
      : `${xo(e)}/(${n.join('//')})`
  }
}
function Ch(e) {
  return encodeURIComponent(e)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
}
function So(e) {
  return Ch(e).replace(/%3B/gi, ';')
}
function jw(e) {
  return encodeURI(e)
}
function Su(e) {
  return Ch(e).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&')
}
function No(e) {
  return decodeURIComponent(e)
}
function dh(e) {
  return No(e.replace(/\+/g, '%20'))
}
function Eh(e) {
  return `${Su(e.path)}${Uw(e.parameters)}`
}
function Uw(e) {
  return Object.entries(e)
    .map(([t, n]) => `;${Su(t)}=${Su(n)}`)
    .join('')
}
function $w(e) {
  let t = Object.entries(e)
    .map(([n, r]) =>
      Array.isArray(r)
        ? r.map((i) => `${So(n)}=${So(i)}`).join('&')
        : `${So(n)}=${So(r)}`,
    )
    .filter((n) => n)
  return t.length ? `?${t.join('&')}` : ''
}
var Bw = /^[^\/()?;#]+/
function Cu(e) {
  let t = e.match(Bw)
  return t ? t[0] : ''
}
var Hw = /^[^\/()?;=#]+/
function zw(e) {
  let t = e.match(Hw)
  return t ? t[0] : ''
}
var Gw = /^[^=?&#]+/
function qw(e) {
  let t = e.match(Gw)
  return t ? t[0] : ''
}
var Ww = /^[^&#]+/
function Zw(e) {
  let t = e.match(Ww)
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
    return this.capture(t), new qt(No(t), this.parseMatrixParams())
  }
  parseMatrixParams() {
    let t = {}
    for (; this.consumeOptional(';'); ) this.parseParam(t)
    return t
  }
  parseParam(t) {
    let n = zw(this.remaining)
    if (!n) return
    this.capture(n)
    let r = ''
    if (this.consumeOptional('=')) {
      let i = Cu(this.remaining)
      i && ((r = i), this.capture(r))
    }
    t[No(n)] = No(r)
  }
  parseQueryParam(t) {
    let n = qw(this.remaining)
    if (!n) return
    this.capture(n)
    let r = ''
    if (this.consumeOptional('=')) {
      let s = Zw(this.remaining)
      s && ((r = s), this.capture(r))
    }
    let i = dh(n),
      o = dh(r)
    if (t.hasOwnProperty(i)) {
      let s = t[i]
      Array.isArray(s) || ((s = [s]), (t[i] = s)), s.push(o)
    } else t[i] = o
  }
  parseParens(t) {
    let n = {}
    for (
      this.capture('(');
      !this.consumeOptional(')') && this.remaining.length > 0;

    ) {
      let r = Cu(this.remaining),
        i = this.remaining[r.length]
      if (i !== '/' && i !== ')' && i !== ';') throw new w(4010, !1)
      let o
      r.indexOf(':') > -1
        ? ((o = r.slice(0, r.indexOf(':'))), this.capture(o), this.capture(':'))
        : t && (o = T)
      let s = this.parseChildren()
      ;(n[o] = Object.keys(s).length === 1 ? s[T] : new L([], s)),
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
function Ih(e) {
  return e.segments.length > 0 ? new L([], { [T]: e }) : e
}
function bh(e) {
  let t = {}
  for (let [r, i] of Object.entries(e.children)) {
    let o = bh(i)
    if (r === T && o.segments.length === 0 && o.hasChildren())
      for (let [s, a] of Object.entries(o.children)) t[s] = a
    else (o.segments.length > 0 || o.hasChildren()) && (t[r] = o)
  }
  let n = new L(e.segments, t)
  return Yw(n)
}
function Yw(e) {
  if (e.numberOfChildren === 1 && e.children[T]) {
    let t = e.children[T]
    return new L(e.segments.concat(t.segments), t.children)
  }
  return e
}
function Un(e) {
  return e instanceof Dt
}
function Qw(e, t, n = null, r = null) {
  let i = Mh(e)
  return _h(i, t, n, r)
}
function Mh(e) {
  let t
  function n(o) {
    let s = {}
    for (let u of o.children) {
      let c = n(u)
      s[u.outlet] = c
    }
    let a = new L(o.url, s)
    return o === e && (t = a), a
  }
  let r = n(e.root),
    i = Ih(r)
  return t ?? i
}
function _h(e, t, n, r) {
  let i = e
  for (; i.parent; ) i = i.parent
  if (t.length === 0) return Eu(i, i, i, n, r)
  let o = Kw(t)
  if (o.toRoot()) return Eu(i, i, new L([], {}), n, r)
  let s = Jw(o, i, e),
    a = s.processChildren
      ? Tr(s.segmentGroup, s.index, o.commands)
      : Th(s.segmentGroup, s.index, o.commands)
  return Eu(i, s.segmentGroup, a, n, r)
}
function Oo(e) {
  return typeof e == 'object' && e != null && !e.outlets && !e.segmentPath
}
function Nr(e) {
  return typeof e == 'object' && e != null && e.outlets
}
function Eu(e, t, n, r, i) {
  let o = {}
  r &&
    Object.entries(r).forEach(([u, c]) => {
      o[u] = Array.isArray(c) ? c.map((l) => `${l}`) : `${c}`
    })
  let s
  e === t ? (s = n) : (s = Sh(e, t, n))
  let a = Ih(bh(s))
  return new Dt(a, o, i)
}
function Sh(e, t, n) {
  let r = {}
  return (
    Object.entries(e.children).forEach(([i, o]) => {
      o === t ? (r[i] = n) : (r[i] = Sh(o, t, n))
    }),
    new L(e.segments, r)
  )
}
var Fo = class {
  constructor(t, n, r) {
    if (
      ((this.isAbsolute = t),
      (this.numberOfDoubleDots = n),
      (this.commands = r),
      t && r.length > 0 && Oo(r[0]))
    )
      throw new w(4003, !1)
    let i = r.find(Nr)
    if (i && i !== mh(r)) throw new w(4004, !1)
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == '/'
    )
  }
}
function Kw(e) {
  if (typeof e[0] == 'string' && e.length === 1 && e[0] === '/')
    return new Fo(!0, 0, e)
  let t = 0,
    n = !1,
    r = e.reduce((i, o, s) => {
      if (typeof o == 'object' && o != null) {
        if (o.outlets) {
          let a = {}
          return (
            Object.entries(o.outlets).forEach(([u, c]) => {
              a[u] = typeof c == 'string' ? c.split('/') : c
            }),
            [...i, { outlets: a }]
          )
        }
        if (o.segmentPath) return [...i, o.segmentPath]
      }
      return typeof o != 'string'
        ? [...i, o]
        : s === 0
          ? (o.split('/').forEach((a, u) => {
              ;(u == 0 && a === '.') ||
                (u == 0 && a === ''
                  ? (n = !0)
                  : a === '..'
                    ? t++
                    : a != '' && i.push(a))
            }),
            i)
          : [...i, o]
    }, [])
  return new Fo(n, t, r)
}
var Ln = class {
  constructor(t, n, r) {
    ;(this.segmentGroup = t), (this.processChildren = n), (this.index = r)
  }
}
function Jw(e, t, n) {
  if (e.isAbsolute) return new Ln(t, !0, 0)
  if (!n) return new Ln(t, !1, NaN)
  if (n.parent === null) return new Ln(n, !0, 0)
  let r = Oo(e.commands[0]) ? 0 : 1,
    i = n.segments.length - 1 + r
  return Xw(n, i, e.numberOfDoubleDots)
}
function Xw(e, t, n) {
  let r = e,
    i = t,
    o = n
  for (; o > i; ) {
    if (((o -= i), (r = r.parent), !r)) throw new w(4005, !1)
    i = r.segments.length
  }
  return new Ln(r, !1, i - o)
}
function eC(e) {
  return Nr(e[0]) ? e[0].outlets : { [T]: e }
}
function Th(e, t, n) {
  if (((e ??= new L([], {})), e.segments.length === 0 && e.hasChildren()))
    return Tr(e, t, n)
  let r = tC(e, t, n),
    i = n.slice(r.commandIndex)
  if (r.match && r.pathIndex < e.segments.length) {
    let o = new L(e.segments.slice(0, r.pathIndex), {})
    return (
      (o.children[T] = new L(e.segments.slice(r.pathIndex), e.children)),
      Tr(o, 0, i)
    )
  } else
    return r.match && i.length === 0
      ? new L(e.segments, {})
      : r.match && !e.hasChildren()
        ? Au(e, t, n)
        : r.match
          ? Tr(e, 0, i)
          : Au(e, t, n)
}
function Tr(e, t, n) {
  if (n.length === 0) return new L(e.segments, {})
  {
    let r = eC(n),
      i = {}
    if (
      Object.keys(r).some((o) => o !== T) &&
      e.children[T] &&
      e.numberOfChildren === 1 &&
      e.children[T].segments.length === 0
    ) {
      let o = Tr(e.children[T], t, n)
      return new L(e.segments, o.children)
    }
    return (
      Object.entries(r).forEach(([o, s]) => {
        typeof s == 'string' && (s = [s]),
          s !== null && (i[o] = Th(e.children[o], t, s))
      }),
      Object.entries(e.children).forEach(([o, s]) => {
        r[o] === void 0 && (i[o] = s)
      }),
      new L(e.segments, i)
    )
  }
}
function tC(e, t, n) {
  let r = 0,
    i = t,
    o = { match: !1, pathIndex: 0, commandIndex: 0 }
  for (; i < e.segments.length; ) {
    if (r >= n.length) return o
    let s = e.segments[i],
      a = n[r]
    if (Nr(a)) break
    let u = `${a}`,
      c = r < n.length - 1 ? n[r + 1] : null
    if (i > 0 && u === void 0) break
    if (u && c && typeof c == 'object' && c.outlets === void 0) {
      if (!hh(u, c, s)) return o
      r += 2
    } else {
      if (!hh(u, {}, s)) return o
      r++
    }
    i++
  }
  return { match: !0, pathIndex: i, commandIndex: r }
}
function Au(e, t, n) {
  let r = e.segments.slice(0, t),
    i = 0
  for (; i < n.length; ) {
    let o = n[i]
    if (Nr(o)) {
      let u = nC(o.outlets)
      return new L(r, u)
    }
    if (i === 0 && Oo(n[0])) {
      let u = e.segments[t]
      r.push(new qt(u.path, fh(n[0]))), i++
      continue
    }
    let s = Nr(o) ? o.outlets[T] : `${o}`,
      a = i < n.length - 1 ? n[i + 1] : null
    s && a && Oo(a)
      ? (r.push(new qt(s, fh(a))), (i += 2))
      : (r.push(new qt(s, {})), i++)
  }
  return new L(r, {})
}
function nC(e) {
  let t = {}
  return (
    Object.entries(e).forEach(([n, r]) => {
      typeof r == 'string' && (r = [r]),
        r !== null && (t[n] = Au(new L([], {}), 0, r))
    }),
    t
  )
}
function fh(e) {
  let t = {}
  return Object.entries(e).forEach(([n, r]) => (t[n] = `${r}`)), t
}
function hh(e, t, n) {
  return e == n.path && qe(t, n.parameters)
}
var Ar = 'imperative',
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
  Se = class {
    constructor(t, n) {
      ;(this.id = t), (this.url = n)
    }
  },
  Rr = class extends Se {
    constructor(t, n, r = 'imperative', i = null) {
      super(t, n),
        (this.type = te.NavigationStart),
        (this.navigationTrigger = r),
        (this.restoredState = i)
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`
    }
  },
  Zt = class extends Se {
    constructor(t, n, r) {
      super(t, n), (this.urlAfterRedirects = r), (this.type = te.NavigationEnd)
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`
    }
  },
  Ce = (function (e) {
    return (
      (e[(e.Redirect = 0)] = 'Redirect'),
      (e[(e.SupersededByNewNavigation = 1)] = 'SupersededByNewNavigation'),
      (e[(e.NoDataFromResolver = 2)] = 'NoDataFromResolver'),
      (e[(e.GuardRejected = 3)] = 'GuardRejected'),
      e
    )
  })(Ce || {}),
  xu = (function (e) {
    return (
      (e[(e.IgnoredSameUrlNavigation = 0)] = 'IgnoredSameUrlNavigation'),
      (e[(e.IgnoredByUrlHandlingStrategy = 1)] =
        'IgnoredByUrlHandlingStrategy'),
      e
    )
  })(xu || {}),
  wt = class extends Se {
    constructor(t, n, r, i) {
      super(t, n),
        (this.reason = r),
        (this.code = i),
        (this.type = te.NavigationCancel)
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`
    }
  },
  Yt = class extends Se {
    constructor(t, n, r, i) {
      super(t, n),
        (this.reason = r),
        (this.code = i),
        (this.type = te.NavigationSkipped)
    }
  },
  Or = class extends Se {
    constructor(t, n, r, i) {
      super(t, n),
        (this.error = r),
        (this.target = i),
        (this.type = te.NavigationError)
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`
    }
  },
  Po = class extends Se {
    constructor(t, n, r, i) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = te.RoutesRecognized)
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
  },
  Nu = class extends Se {
    constructor(t, n, r, i) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = te.GuardsCheckStart)
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
  },
  Ru = class extends Se {
    constructor(t, n, r, i, o) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.shouldActivate = o),
        (this.type = te.GuardsCheckEnd)
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`
    }
  },
  Ou = class extends Se {
    constructor(t, n, r, i) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = te.ResolveStart)
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
  },
  Fu = class extends Se {
    constructor(t, n, r, i) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
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
var Fr = class {},
  Pr = class {
    constructor(t) {
      this.url = t
    }
  }
var $u = class {
    constructor() {
      ;(this.outlet = null),
        (this.route = null),
        (this.injector = null),
        (this.children = new $o()),
        (this.attachRef = null)
    }
  },
  $o = (() => {
    let t = class t {
      constructor() {
        this.contexts = new Map()
      }
      onChildOutletCreated(r, i) {
        let o = this.getOrCreateContext(r)
        ;(o.outlet = i), this.contexts.set(r, o)
      }
      onChildOutletDestroyed(r) {
        let i = this.getContext(r)
        i && ((i.outlet = null), (i.attachRef = null))
      }
      onOutletDeactivated() {
        let r = this.contexts
        return (this.contexts = new Map()), r
      }
      onOutletReAttached(r) {
        this.contexts = r
      }
      getOrCreateContext(r) {
        let i = this.getContext(r)
        return i || ((i = new $u()), this.contexts.set(r, i)), i
      }
      getContext(r) {
        return this.contexts.get(r) || null
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)()
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })(),
  ko = class {
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
        : n[n.length - 2].children.map((i) => i.value).filter((i) => i !== t)
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
var we = class {
  constructor(t, n) {
    ;(this.value = t), (this.children = n)
  }
  toString() {
    return `TreeNode(${this.value})`
  }
}
function kn(e) {
  let t = {}
  return e && e.children.forEach((n) => (t[n.value.outlet] = n)), t
}
var Lo = class extends ko {
  constructor(t, n) {
    super(t), (this.snapshot = n), ec(this, t)
  }
  toString() {
    return this.snapshot.toString()
  }
}
function Ah(e) {
  let t = rC(e),
    n = new ee([new qt('', {})]),
    r = new ee({}),
    i = new ee({}),
    o = new ee({}),
    s = new ee(''),
    a = new $n(n, r, o, s, i, T, e, t.root)
  return (a.snapshot = t.root), new Lo(new we(a, []), t)
}
function rC(e) {
  let t = {},
    n = {},
    r = {},
    i = '',
    o = new kr([], t, r, i, n, T, e, null, {})
  return new Vo('', new we(o, []))
}
var $n = class {
  constructor(t, n, r, i, o, s, a, u) {
    ;(this.urlSubject = t),
      (this.paramsSubject = n),
      (this.queryParamsSubject = r),
      (this.fragmentSubject = i),
      (this.dataSubject = o),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = u),
      (this.title = this.dataSubject?.pipe(E((c) => c[jr])) ?? b(void 0)),
      (this.url = t),
      (this.params = n),
      (this.queryParams = r),
      (this.fragment = i),
      (this.data = o)
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
      (this._paramMap ??= this.params.pipe(E((t) => jn(t)))), this._paramMap
    )
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(E((t) => jn(t)))),
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
    { routeConfig: i } = e
  return (
    t !== null &&
    (n === 'always' ||
      i?.path === '' ||
      (!t.component && !t.routeConfig?.loadComponent))
      ? (r = {
          params: g(g({}, t.params), e.params),
          data: g(g({}, t.data), e.data),
          resolve: g(g(g(g({}, e.data), t.data), i?.data), e._resolvedData),
        })
      : (r = {
          params: g({}, e.params),
          data: g({}, e.data),
          resolve: g(g({}, e.data), e._resolvedData ?? {}),
        }),
    i && Nh(i) && (r.resolve[jr] = i.title),
    r
  )
}
var kr = class {
    get title() {
      return this.data?.[jr]
    }
    constructor(t, n, r, i, o, s, a, u, c) {
      ;(this.url = t),
        (this.params = n),
        (this.queryParams = r),
        (this.fragment = i),
        (this.data = o),
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
      return (this._paramMap ??= jn(this.params)), this._paramMap
    }
    get queryParamMap() {
      return (this._queryParamMap ??= jn(this.queryParams)), this._queryParamMap
    }
    toString() {
      let t = this.url.map((r) => r.toString()).join('/'),
        n = this.routeConfig ? this.routeConfig.path : ''
      return `Route(url:'${t}', path:'${n}')`
    }
  },
  Vo = class extends ko {
    constructor(t, n) {
      super(n), (this.url = t), ec(this, n)
    }
    toString() {
      return xh(this._root)
    }
  }
function ec(e, t) {
  ;(t.value._routerState = e), t.children.forEach((n) => ec(e, n))
}
function xh(e) {
  let t = e.children.length > 0 ? ` { ${e.children.map(xh).join(', ')} } ` : ''
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
      Rw(t.url, n.url) || e.urlSubject.next(n.url),
      qe(t.data, n.data) || e.dataSubject.next(n.data)
  } else
    (e.snapshot = e._futureSnapshot), e.dataSubject.next(e._futureSnapshot.data)
}
function zu(e, t) {
  let n = qe(e.params, t.params) && kw(e.url, t.url),
    r = !e.parent != !t.parent
  return n && !r && (!e.parent || zu(e.parent, t.parent))
}
function Nh(e) {
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
          (this.parentContexts = p($o)),
          (this.location = p(uo)),
          (this.changeDetector = p(Ht)),
          (this.environmentInjector = p(he)),
          (this.inputBinder = p(tc, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0)
      }
      get activatedComponentRef() {
        return this.activated
      }
      ngOnChanges(r) {
        if (r.name) {
          let { firstChange: i, previousValue: o } = r.name
          if (i) return
          this.isTrackedInParentContexts(o) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
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
      attach(r, i) {
        ;(this.activated = r),
          (this._activatedRoute = i),
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
      activateWith(r, i) {
        if (this.isActivated) throw new w(4013, !1)
        this._activatedRoute = r
        let o = this.location,
          a = r.snapshot.component,
          u = this.parentContexts.getOrCreateContext(this.name).children,
          c = new Gu(r, u, o.injector)
        ;(this.activated = o.createComponent(a, {
          index: o.length,
          injector: c,
          environmentInjector: i ?? this.environmentInjector,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance)
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)()
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
      return t === $n
        ? this.route
        : t === $o
          ? this.childContexts
          : this.parent.get(t, n)
    }
  },
  tc = new C('')
function oC(e, t, n) {
  let r = Lr(e, t._root, n ? n._root : void 0)
  return new Lo(r, t)
}
function Lr(e, t, n) {
  if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
    let r = n.value
    r._futureSnapshot = t.value
    let i = sC(e, t, n)
    return new we(r, i)
  } else {
    if (e.shouldAttach(t.value)) {
      let o = e.retrieve(t.value)
      if (o !== null) {
        let s = o.route
        return (
          (s.value._futureSnapshot = t.value),
          (s.children = t.children.map((a) => Lr(e, a))),
          s
        )
      }
    }
    let r = aC(t.value),
      i = t.children.map((o) => Lr(e, o))
    return new we(r, i)
  }
}
function sC(e, t, n) {
  return t.children.map((r) => {
    for (let i of n.children)
      if (e.shouldReuseRoute(r.value, i.value.snapshot)) return Lr(e, r, i)
    return Lr(e, r)
  })
}
function aC(e) {
  return new $n(
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
var Rh = 'ngNavigationCancelingError'
function Oh(e, t) {
  let { redirectTo: n, navigationBehaviorOptions: r } = Un(t)
      ? { redirectTo: t, navigationBehaviorOptions: void 0 }
      : t,
    i = Fh(!1, Ce.Redirect)
  return (i.url = n), (i.navigationBehaviorOptions = r), i
}
function Fh(e, t) {
  let n = new Error(`NavigationCancelingError: ${e || ''}`)
  return (n[Rh] = !0), (n.cancellationCode = t), n
}
function uC(e) {
  return Ph(e) && Un(e.url)
}
function Ph(e) {
  return !!e && e[Rh]
}
var cC = (() => {
  let t = class t {}
  ;(t.ɵfac = function (i) {
    return new (i || t)()
  }),
    (t.ɵcmp = dt({
      type: t,
      selectors: [['ng-component']],
      standalone: !0,
      features: [mt],
      decls: 1,
      vars: 0,
      template: function (i, o) {
        i & 1 && Nn(0, 'router-outlet')
      },
      dependencies: [iC],
      encapsulation: 2,
    }))
  let e = t
  return e
})()
function lC(e, t) {
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
      (n.component = cC),
    n
  )
}
function We(e) {
  return e.outlet || T
}
function dC(e, t) {
  let n = e.filter((r) => We(r) === t)
  return n.push(...e.filter((r) => We(r) !== t)), n
}
function Ur(e) {
  if (!e) return null
  if (e.routeConfig?._injector) return e.routeConfig._injector
  for (let t = e.parent; t; t = t.parent) {
    let n = t.routeConfig
    if (n?._loadedInjector) return n._loadedInjector
    if (n?._injector) return n._injector
  }
  return null
}
var fC = (e, t, n, r) =>
    E(
      (i) => (
        new qu(t, i.targetRouterState, i.currentRouterState, n, r).activate(e),
        i
      ),
    ),
  qu = class {
    constructor(t, n, r, i, o) {
      ;(this.routeReuseStrategy = t),
        (this.futureState = n),
        (this.currState = r),
        (this.forwardEvent = i),
        (this.inputBindingEnabled = o)
    }
    activate(t) {
      let n = this.futureState._root,
        r = this.currState ? this.currState._root : null
      this.deactivateChildRoutes(n, r, t),
        Iu(this.futureState.root),
        this.activateChildRoutes(n, r, t)
    }
    deactivateChildRoutes(t, n, r) {
      let i = kn(n)
      t.children.forEach((o) => {
        let s = o.value.outlet
        this.deactivateRoutes(o, i[s], r), delete i[s]
      }),
        Object.values(i).forEach((o) => {
          this.deactivateRouteAndItsChildren(o, r)
        })
    }
    deactivateRoutes(t, n, r) {
      let i = t.value,
        o = n ? n.value : null
      if (i === o)
        if (i.component) {
          let s = r.getContext(i.outlet)
          s && this.deactivateChildRoutes(t, n, s.children)
        } else this.deactivateChildRoutes(t, n, r)
      else o && this.deactivateRouteAndItsChildren(n, r)
    }
    deactivateRouteAndItsChildren(t, n) {
      t.value.component &&
      this.routeReuseStrategy.shouldDetach(t.value.snapshot)
        ? this.detachAndStoreRouteSubtree(t, n)
        : this.deactivateRouteAndOutlet(t, n)
    }
    detachAndStoreRouteSubtree(t, n) {
      let r = n.getContext(t.value.outlet),
        i = r && t.value.component ? r.children : n,
        o = kn(t)
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i)
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
        i = r && t.value.component ? r.children : n,
        o = kn(t)
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i)
      r &&
        (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
        (r.attachRef = null),
        (r.route = null))
    }
    activateChildRoutes(t, n, r) {
      let i = kn(n)
      t.children.forEach((o) => {
        this.activateRoutes(o, i[o.value.outlet], r),
          this.forwardEvent(new Uu(o.value.snapshot))
      }),
        t.children.length && this.forwardEvent(new Vu(t.value.snapshot))
    }
    activateRoutes(t, n, r) {
      let i = t.value,
        o = n ? n.value : null
      if ((Iu(i), i === o))
        if (i.component) {
          let s = r.getOrCreateContext(i.outlet)
          this.activateChildRoutes(t, n, s.children)
        } else this.activateChildRoutes(t, n, r)
      else if (i.component) {
        let s = r.getOrCreateContext(i.outlet)
        if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(i.snapshot)
          this.routeReuseStrategy.store(i.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            Iu(a.route.value),
            this.activateChildRoutes(t, null, s.children)
        } else {
          let a = Ur(i.snapshot)
          ;(s.attachRef = null),
            (s.route = i),
            (s.injector = a),
            s.outlet && s.outlet.activateWith(i, s.injector),
            this.activateChildRoutes(t, null, s.children)
        }
      } else this.activateChildRoutes(t, null, r)
    }
  },
  jo = class {
    constructor(t) {
      ;(this.path = t), (this.route = this.path[this.path.length - 1])
    }
  },
  Vn = class {
    constructor(t, n) {
      ;(this.component = t), (this.route = n)
    }
  }
function hC(e, t, n) {
  let r = e._root,
    i = t ? t._root : null
  return _r(r, i, n, [r.value])
}
function pC(e) {
  let t = e.routeConfig ? e.routeConfig.canActivateChild : null
  return !t || t.length === 0 ? null : { node: e, guards: t }
}
function Hn(e, t) {
  let n = Symbol(),
    r = t.get(e, n)
  return r === n ? (typeof e == 'function' && !Ll(e) ? e : t.get(e)) : r
}
function _r(
  e,
  t,
  n,
  r,
  i = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let o = kn(t)
  return (
    e.children.forEach((s) => {
      gC(s, o[s.value.outlet], n, r.concat([s.value]), i),
        delete o[s.value.outlet]
    }),
    Object.entries(o).forEach(([s, a]) => xr(a, n.getContext(s), i)),
    i
  )
}
function gC(
  e,
  t,
  n,
  r,
  i = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let o = e.value,
    s = t ? t.value : null,
    a = n ? n.getContext(e.value.outlet) : null
  if (s && o.routeConfig === s.routeConfig) {
    let u = mC(s, o, o.routeConfig.runGuardsAndResolvers)
    u
      ? i.canActivateChecks.push(new jo(r))
      : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
      o.component ? _r(e, t, a ? a.children : null, r, i) : _r(e, t, n, r, i),
      u &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        i.canDeactivateChecks.push(new Vn(a.outlet.component, s))
  } else
    s && xr(t, a, i),
      i.canActivateChecks.push(new jo(r)),
      o.component
        ? _r(e, null, a ? a.children : null, r, i)
        : _r(e, null, n, r, i)
  return i
}
function mC(e, t, n) {
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
function xr(e, t, n) {
  let r = kn(e),
    i = e.value
  Object.entries(r).forEach(([o, s]) => {
    i.component
      ? t
        ? xr(s, t.children.getContext(o), n)
        : xr(s, null, n)
      : xr(s, t, n)
  }),
    i.component
      ? t && t.outlet && t.outlet.isActivated
        ? n.canDeactivateChecks.push(new Vn(t.outlet.component, i))
        : n.canDeactivateChecks.push(new Vn(null, i))
      : n.canDeactivateChecks.push(new Vn(null, i))
}
function $r(e) {
  return typeof e == 'function'
}
function vC(e) {
  return typeof e == 'boolean'
}
function yC(e) {
  return e && $r(e.canLoad)
}
function DC(e) {
  return e && $r(e.canActivate)
}
function wC(e) {
  return e && $r(e.canActivateChild)
}
function CC(e) {
  return e && $r(e.canDeactivate)
}
function EC(e) {
  return e && $r(e.canMatch)
}
function kh(e) {
  return e instanceof Ye || e?.name === 'EmptyError'
}
var To = Symbol('INITIAL_VALUE')
function Bn() {
  return De((e) =>
    Di(e.map((t) => t.pipe(Qe(1), Ds(To)))).pipe(
      E((t) => {
        for (let n of t)
          if (n !== !0) {
            if (n === To) return To
            if (n === !1 || n instanceof Dt) return n
          }
        return !0
      }),
      ye((t) => t !== To),
      Qe(1),
    ),
  )
}
function IC(e, t) {
  return Y((n) => {
    let {
      targetSnapshot: r,
      currentSnapshot: i,
      guards: { canActivateChecks: o, canDeactivateChecks: s },
    } = n
    return s.length === 0 && o.length === 0
      ? b(R(g({}, n), { guardsResult: !0 }))
      : bC(s, r, i, e).pipe(
          Y((a) => (a && vC(a) ? MC(r, o, e, t) : b(a))),
          E((a) => R(g({}, n), { guardsResult: a })),
        )
  })
}
function bC(e, t, n, r) {
  return z(e).pipe(
    Y((i) => xC(i.component, i.route, n, t, r)),
    Le((i) => i !== !0, !0),
  )
}
function MC(e, t, n, r) {
  return z(t).pipe(
    ot((i) =>
      sn(
        SC(i.route.parent, r),
        _C(i.route, r),
        AC(e, i.path, n),
        TC(e, i.route, n),
      ),
    ),
    Le((i) => i !== !0, !0),
  )
}
function _C(e, t) {
  return e !== null && t && t(new ju(e)), b(!0)
}
function SC(e, t) {
  return e !== null && t && t(new Lu(e)), b(!0)
}
function TC(e, t, n) {
  let r = t.routeConfig ? t.routeConfig.canActivate : null
  if (!r || r.length === 0) return b(!0)
  let i = r.map((o) =>
    wi(() => {
      let s = Ur(t) ?? n,
        a = Hn(o, s),
        u = DC(a) ? a.canActivate(t, e) : Xe(s, () => a(t, e))
      return Ct(u).pipe(Le())
    }),
  )
  return b(i).pipe(Bn())
}
function AC(e, t, n) {
  let r = t[t.length - 1],
    o = t
      .slice(0, t.length - 1)
      .reverse()
      .map((s) => pC(s))
      .filter((s) => s !== null)
      .map((s) =>
        wi(() => {
          let a = s.guards.map((u) => {
            let c = Ur(s.node) ?? n,
              l = Hn(u, c),
              d = wC(l) ? l.canActivateChild(r, e) : Xe(c, () => l(r, e))
            return Ct(d).pipe(Le())
          })
          return b(a).pipe(Bn())
        }),
      )
  return b(o).pipe(Bn())
}
function xC(e, t, n, r, i) {
  let o = t && t.routeConfig ? t.routeConfig.canDeactivate : null
  if (!o || o.length === 0) return b(!0)
  let s = o.map((a) => {
    let u = Ur(t) ?? i,
      c = Hn(a, u),
      l = CC(c) ? c.canDeactivate(e, t, n, r) : Xe(u, () => c(e, t, n, r))
    return Ct(l).pipe(Le())
  })
  return b(s).pipe(Bn())
}
function NC(e, t, n, r) {
  let i = t.canLoad
  if (i === void 0 || i.length === 0) return b(!0)
  let o = i.map((s) => {
    let a = Hn(s, e),
      u = yC(a) ? a.canLoad(t, n) : Xe(e, () => a(t, n))
    return Ct(u)
  })
  return b(o).pipe(Bn(), Lh(r))
}
function Lh(e) {
  return cs(
    G((t) => {
      if (Un(t)) throw Oh(e, t)
    }),
    E((t) => t === !0),
  )
}
function RC(e, t, n, r) {
  let i = t.canMatch
  if (!i || i.length === 0) return b(!0)
  let o = i.map((s) => {
    let a = Hn(s, e),
      u = EC(a) ? a.canMatch(t, n) : Xe(e, () => a(t, n))
    return Ct(u)
  })
  return b(o).pipe(Bn(), Lh(r))
}
var Vr = class {
    constructor(t) {
      this.segmentGroup = t || null
    }
  },
  Uo = class extends Error {
    constructor(t) {
      super(), (this.urlTree = t)
    }
  }
function Pn(e) {
  return on(new Vr(e))
}
function OC(e) {
  return on(new w(4e3, !1))
}
function FC(e) {
  return on(Fh(!1, Ce.GuardRejected))
}
var Wu = class {
    constructor(t, n) {
      ;(this.urlSerializer = t), (this.urlTree = n)
    }
    lineralizeSegments(t, n) {
      let r = [],
        i = n.root
      for (;;) {
        if (((r = r.concat(i.segments)), i.numberOfChildren === 0)) return b(r)
        if (i.numberOfChildren > 1 || !i.children[T]) return OC(t.redirectTo)
        i = i.children[T]
      }
    }
    applyRedirectCommands(t, n, r) {
      let i = this.applyRedirectCreateUrlTree(
        n,
        this.urlSerializer.parse(n),
        t,
        r,
      )
      if (n.startsWith('/')) throw new Uo(i)
      return i
    }
    applyRedirectCreateUrlTree(t, n, r, i) {
      let o = this.createSegmentGroup(t, n.root, r, i)
      return new Dt(
        o,
        this.createQueryParams(n.queryParams, this.urlTree.queryParams),
        n.fragment,
      )
    }
    createQueryParams(t, n) {
      let r = {}
      return (
        Object.entries(t).forEach(([i, o]) => {
          if (typeof o == 'string' && o.startsWith(':')) {
            let a = o.substring(1)
            r[i] = n[a]
          } else r[i] = o
        }),
        r
      )
    }
    createSegmentGroup(t, n, r, i) {
      let o = this.createSegments(t, n.segments, r, i),
        s = {}
      return (
        Object.entries(n.children).forEach(([a, u]) => {
          s[a] = this.createSegmentGroup(t, u, r, i)
        }),
        new L(o, s)
      )
    }
    createSegments(t, n, r, i) {
      return n.map((o) =>
        o.path.startsWith(':')
          ? this.findPosParam(t, o, i)
          : this.findOrReturn(o, r),
      )
    }
    findPosParam(t, n, r) {
      let i = r[n.path.substring(1)]
      if (!i) throw new w(4001, !1)
      return i
    }
    findOrReturn(t, n) {
      let r = 0
      for (let i of n) {
        if (i.path === t.path) return n.splice(r), i
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
function PC(e, t, n, r, i) {
  let o = rc(e, t, n)
  return o.matched
    ? ((r = lC(t, r)),
      RC(r, t, n, i).pipe(E((s) => (s === !0 ? o : g({}, Zu)))))
    : b(o)
}
function rc(e, t, n) {
  if (t.path === '**') return kC(n)
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
  let i = (t.matcher || Nw)(n, e, t)
  if (!i) return g({}, Zu)
  let o = {}
  Object.entries(i.posParams ?? {}).forEach(([a, u]) => {
    o[a] = u.path
  })
  let s =
    i.consumed.length > 0
      ? g(g({}, o), i.consumed[i.consumed.length - 1].parameters)
      : o
  return {
    matched: !0,
    consumedSegments: i.consumed,
    remainingSegments: n.slice(i.consumed.length),
    parameters: s,
    positionalParamSegments: i.posParams ?? {},
  }
}
function kC(e) {
  return {
    matched: !0,
    parameters: e.length > 0 ? mh(e).parameters : {},
    consumedSegments: e,
    remainingSegments: [],
    positionalParamSegments: {},
  }
}
function ph(e, t, n, r) {
  return n.length > 0 && jC(e, n, r)
    ? {
        segmentGroup: new L(t, VC(r, new L(n, e.children))),
        slicedSegments: [],
      }
    : n.length === 0 && UC(e, n, r)
      ? {
          segmentGroup: new L(e.segments, LC(e, n, r, e.children)),
          slicedSegments: n,
        }
      : { segmentGroup: new L(e.segments, e.children), slicedSegments: n }
}
function LC(e, t, n, r) {
  let i = {}
  for (let o of n)
    if (Bo(e, t, o) && !r[We(o)]) {
      let s = new L([], {})
      i[We(o)] = s
    }
  return g(g({}, r), i)
}
function VC(e, t) {
  let n = {}
  n[T] = t
  for (let r of e)
    if (r.path === '' && We(r) !== T) {
      let i = new L([], {})
      n[We(r)] = i
    }
  return n
}
function jC(e, t, n) {
  return n.some((r) => Bo(e, t, r) && We(r) !== T)
}
function UC(e, t, n) {
  return n.some((r) => Bo(e, t, r))
}
function Bo(e, t, n) {
  return (e.hasChildren() || t.length > 0) && n.pathMatch === 'full'
    ? !1
    : n.path === ''
}
function $C(e, t, n, r) {
  return We(e) !== r && (r === T || !Bo(t, n, e)) ? !1 : rc(t, e, n).matched
}
function BC(e, t, n) {
  return t.length === 0 && !e.children[n]
}
var Yu = class {}
function HC(e, t, n, r, i, o, s = 'emptyOnly') {
  return new Qu(e, t, n, r, i, s, o).recognize()
}
var zC = 31,
  Qu = class {
    constructor(t, n, r, i, o, s, a) {
      ;(this.injector = t),
        (this.configLoader = n),
        (this.rootComponentType = r),
        (this.config = i),
        (this.urlTree = o),
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
      let t = ph(this.urlTree.root, [], [], this.config).segmentGroup
      return this.match(t).pipe(
        E((n) => {
          let r = new kr(
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
            i = new we(r, n),
            o = new Vo('', i),
            s = Qw(r, [], this.urlTree.queryParams, this.urlTree.fragment)
          return (
            (s.queryParams = this.urlTree.queryParams),
            (o.url = this.urlSerializer.serialize(s)),
            this.inheritParamsAndData(o._root, null),
            { state: o, tree: s }
          )
        }),
      )
    }
    match(t) {
      return this.processSegmentGroup(this.injector, this.config, t, T).pipe(
        Ae((r) => {
          if (r instanceof Uo)
            return (this.urlTree = r.urlTree), this.match(r.urlTree.root)
          throw r instanceof Vr ? this.noMatchError(r) : r
        }),
      )
    }
    inheritParamsAndData(t, n) {
      let r = t.value,
        i = Xu(r, n, this.paramsInheritanceStrategy)
      ;(r.params = Object.freeze(i.params)),
        (r.data = Object.freeze(i.data)),
        t.children.forEach((o) => this.inheritParamsAndData(o, r))
    }
    processSegmentGroup(t, n, r, i) {
      return r.segments.length === 0 && r.hasChildren()
        ? this.processChildren(t, n, r)
        : this.processSegment(t, n, r, r.segments, i, !0).pipe(
            E((o) => (o instanceof we ? [o] : [])),
          )
    }
    processChildren(t, n, r) {
      let i = []
      for (let o of Object.keys(r.children))
        o === 'primary' ? i.unshift(o) : i.push(o)
      return z(i).pipe(
        ot((o) => {
          let s = r.children[o],
            a = dC(n, o)
          return this.processSegmentGroup(t, a, s, o)
        }),
        ys((o, s) => (o.push(...s), o)),
        st(null),
        vs(),
        Y((o) => {
          if (o === null) return Pn(r)
          let s = Vh(o)
          return GC(s), b(s)
        }),
      )
    }
    processSegment(t, n, r, i, o, s) {
      return z(n).pipe(
        ot((a) =>
          this.processSegmentAgainstRoute(
            a._injector ?? t,
            n,
            a,
            r,
            i,
            o,
            s,
          ).pipe(
            Ae((u) => {
              if (u instanceof Vr) return b(null)
              throw u
            }),
          ),
        ),
        Le((a) => !!a),
        Ae((a) => {
          if (kh(a)) return BC(r, i, o) ? b(new Yu()) : Pn(r)
          throw a
        }),
      )
    }
    processSegmentAgainstRoute(t, n, r, i, o, s, a) {
      return $C(r, i, o, s)
        ? r.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(t, i, r, o, s)
          : this.allowRedirects && a
            ? this.expandSegmentAgainstRouteUsingRedirect(t, i, n, r, o, s)
            : Pn(i)
        : Pn(i)
    }
    expandSegmentAgainstRouteUsingRedirect(t, n, r, i, o, s) {
      let {
        matched: a,
        consumedSegments: u,
        positionalParamSegments: c,
        remainingSegments: l,
      } = rc(n, i, o)
      if (!a) return Pn(n)
      i.redirectTo.startsWith('/') &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > zC && (this.allowRedirects = !1))
      let d = this.applyRedirects.applyRedirectCommands(u, i.redirectTo, c)
      return this.applyRedirects
        .lineralizeSegments(i, d)
        .pipe(Y((f) => this.processSegment(t, r, n, f.concat(l), s, !1)))
    }
    matchSegmentAgainstRoute(t, n, r, i, o) {
      let s = PC(n, r, i, t, this.urlSerializer)
      return (
        r.path === '**' && (n.children = {}),
        s.pipe(
          De((a) =>
            a.matched
              ? ((t = r._injector ?? t),
                this.getChildConfig(t, r, i).pipe(
                  De(({ routes: u }) => {
                    let c = r._loadedInjector ?? t,
                      {
                        consumedSegments: l,
                        remainingSegments: d,
                        parameters: f,
                      } = a,
                      h = new kr(
                        l,
                        f,
                        Object.freeze(g({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        WC(r),
                        We(r),
                        r.component ?? r._loadedComponent ?? null,
                        r,
                        ZC(r),
                      ),
                      { segmentGroup: m, slicedSegments: M } = ph(n, l, d, u)
                    if (M.length === 0 && m.hasChildren())
                      return this.processChildren(c, u, m).pipe(
                        E((v) => (v === null ? null : new we(h, v))),
                      )
                    if (u.length === 0 && M.length === 0)
                      return b(new we(h, []))
                    let y = We(r) === o
                    return this.processSegment(c, u, m, M, y ? T : o, !0).pipe(
                      E((v) => new we(h, v instanceof we ? [v] : [])),
                    )
                  }),
                ))
              : Pn(n),
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
            : NC(t, n, r, this.urlSerializer).pipe(
                Y((i) =>
                  i
                    ? this.configLoader.loadChildren(t, n).pipe(
                        G((o) => {
                          ;(n._loadedRoutes = o.routes),
                            (n._loadedInjector = o.injector)
                        }),
                      )
                    : FC(n),
                ),
              )
          : b({ routes: [], injector: t })
    }
  }
function GC(e) {
  e.sort((t, n) =>
    t.value.outlet === T
      ? -1
      : n.value.outlet === T
        ? 1
        : t.value.outlet.localeCompare(n.value.outlet),
  )
}
function qC(e) {
  let t = e.value.routeConfig
  return t && t.path === ''
}
function Vh(e) {
  let t = [],
    n = new Set()
  for (let r of e) {
    if (!qC(r)) {
      t.push(r)
      continue
    }
    let i = t.find((o) => r.value.routeConfig === o.value.routeConfig)
    i !== void 0 ? (i.children.push(...r.children), n.add(i)) : t.push(r)
  }
  for (let r of n) {
    let i = Vh(r.children)
    t.push(new we(r.value, i))
  }
  return t.filter((r) => !n.has(r))
}
function WC(e) {
  return e.data || {}
}
function ZC(e) {
  return e.resolve || {}
}
function YC(e, t, n, r, i, o) {
  return Y((s) =>
    HC(e, t, n, r, s.extractedUrl, i, o).pipe(
      E(({ state: a, tree: u }) =>
        R(g({}, s), { targetSnapshot: a, urlAfterRedirects: u }),
      ),
    ),
  )
}
function QC(e, t) {
  return Y((n) => {
    let {
      targetSnapshot: r,
      guards: { canActivateChecks: i },
    } = n
    if (!i.length) return b(n)
    let o = new Set(i.map((u) => u.route)),
      s = new Set()
    for (let u of o) if (!s.has(u)) for (let c of jh(u)) s.add(c)
    let a = 0
    return z(s).pipe(
      ot((u) =>
        o.has(u)
          ? KC(u, r, e, t)
          : ((u.data = Xu(u, u.parent, e).resolve), b(void 0)),
      ),
      G(() => a++),
      an(1),
      Y((u) => (a === s.size ? b(n) : ve)),
    )
  })
}
function jh(e) {
  let t = e.children.map((n) => jh(n)).flat()
  return [e, ...t]
}
function KC(e, t, n, r) {
  let i = e.routeConfig,
    o = e._resolve
  return (
    i?.title !== void 0 && !Nh(i) && (o[jr] = i.title),
    JC(o, e, t, r).pipe(
      E(
        (s) => (
          (e._resolvedData = s), (e.data = Xu(e, e.parent, n).resolve), null
        ),
      ),
    )
  )
}
function JC(e, t, n, r) {
  let i = _u(e)
  if (i.length === 0) return b({})
  let o = {}
  return z(i).pipe(
    Y((s) =>
      XC(e[s], t, n, r).pipe(
        Le(),
        G((a) => {
          o[s] = a
        }),
      ),
    ),
    an(1),
    ms(o),
    Ae((s) => (kh(s) ? ve : on(s))),
  )
}
function XC(e, t, n, r) {
  let i = Ur(t) ?? r,
    o = Hn(e, i),
    s = o.resolve ? o.resolve(t, n) : Xe(i, () => o(t, n))
  return Ct(s)
}
function bu(e) {
  return De((t) => {
    let n = e(t)
    return n ? z(n).pipe(E(() => t)) : b(t)
  })
}
var Uh = (() => {
    let t = class t {
      buildTitle(r) {
        let i,
          o = r.root
        for (; o !== void 0; )
          (i = this.getResolvedTitleForRoute(o) ?? i),
            (o = o.children.find((s) => s.outlet === T))
        return i
      }
      getResolvedTitleForRoute(r) {
        return r.data[jr]
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)()
    }),
      (t.ɵprov = D({ token: t, factory: () => p(eE), providedIn: 'root' }))
    let e = t
    return e
  })(),
  eE = (() => {
    let t = class t extends Uh {
      constructor(r) {
        super(), (this.title = r)
      }
      updateTitle(r) {
        let i = this.buildTitle(r)
        i !== void 0 && this.title.setTitle(i)
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)(S(ch))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })(),
  ic = new C('', { providedIn: 'root', factory: () => ({}) }),
  oc = new C(''),
  tE = (() => {
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
        let i = Ct(r.loadComponent()).pipe(
            E($h),
            G((s) => {
              this.onLoadEndListener && this.onLoadEndListener(r),
                (r._loadedComponent = s)
            }),
            Mt(() => {
              this.componentLoaders.delete(r)
            }),
          ),
          o = new rn(i, () => new se()).pipe(nn())
        return this.componentLoaders.set(r, o), o
      }
      loadChildren(r, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i)
        if (i._loadedRoutes)
          return b({ routes: i._loadedRoutes, injector: i._loadedInjector })
        this.onLoadStartListener && this.onLoadStartListener(i)
        let s = nE(i, this.compiler, r, this.onLoadEndListener).pipe(
            Mt(() => {
              this.childrenLoaders.delete(i)
            }),
          ),
          a = new rn(s, () => new se()).pipe(nn())
        return this.childrenLoaders.set(i, a), a
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)()
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })()
function nE(e, t, n, r) {
  return Ct(e.loadChildren()).pipe(
    E($h),
    Y((i) =>
      i instanceof lr || Array.isArray(i) ? b(i) : z(t.compileModuleAsync(i)),
    ),
    E((i) => {
      r && r(e)
      let o,
        s,
        a = !1
      return (
        Array.isArray(i)
          ? ((s = i), (a = !0))
          : ((o = i.create(n).injector),
            (s = o.get(oc, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(nc), injector: o }
      )
    }),
  )
}
function rE(e) {
  return e && typeof e == 'object' && 'default' in e
}
function $h(e) {
  return rE(e) ? e.default : e
}
var sc = (() => {
    let t = class t {}
    ;(t.ɵfac = function (i) {
      return new (i || t)()
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
      merge(r, i) {
        return r
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)()
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })(),
  oE = new C('')
var sE = (() => {
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
        (this.configLoader = p(tE)),
        (this.environmentInjector = p(he)),
        (this.urlSerializer = p(Ju)),
        (this.rootContexts = p($o)),
        (this.location = p(yr)),
        (this.inputBindingEnabled = p(tc, { optional: !0 }) !== null),
        (this.titleStrategy = p(Uh)),
        (this.options = p(ic, { optional: !0 }) || {}),
        (this.paramsInheritanceStrategy =
          this.options.paramsInheritanceStrategy || 'emptyOnly'),
        (this.urlHandlingStrategy = p(sc)),
        (this.createViewTransition = p(oE, { optional: !0 })),
        (this.navigationId = 0),
        (this.afterPreactivation = () => b(void 0)),
        (this.rootComponentType = null)
      let r = (o) => this.events.next(new Pu(o)),
        i = (o) => this.events.next(new ku(o))
      ;(this.configLoader.onLoadEndListener = i),
        (this.configLoader.onLoadStartListener = r)
    }
    complete() {
      this.transitions?.complete()
    }
    handleNavigationRequest(r) {
      let i = ++this.navigationId
      this.transitions?.next(R(g(g({}, this.transitions.value), r), { id: i }))
    }
    setupNavigations(r, i, o) {
      return (
        (this.transitions = new ee({
          id: 0,
          currentUrlTree: i,
          currentRawUrl: i,
          extractedUrl: this.urlHandlingStrategy.extract(i),
          urlAfterRedirects: this.urlHandlingStrategy.extract(i),
          rawUrl: i,
          extras: {},
          resolve: null,
          reject: null,
          promise: Promise.resolve(!0),
          source: Ar,
          restoredState: null,
          currentSnapshot: o.snapshot,
          targetSnapshot: null,
          currentRouterState: o,
          targetRouterState: null,
          guards: { canActivateChecks: [], canDeactivateChecks: [] },
          guardsResult: null,
        })),
        this.transitions.pipe(
          ye((s) => s.id !== 0),
          E((s) =>
            R(g({}, s), {
              extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl),
            }),
          ),
          De((s) => {
            let a = !1,
              u = !1
            return b(s).pipe(
              De((c) => {
                if (this.navigationId > s.id)
                  return (
                    this.cancelNavigationTransition(
                      s,
                      '',
                      Ce.SupersededByNewNavigation,
                    ),
                    ve
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
                    ve
                  )
                }
                if (this.urlHandlingStrategy.shouldProcessUrl(c.rawUrl))
                  return b(c).pipe(
                    De((f) => {
                      let h = this.transitions?.getValue()
                      return (
                        this.events.next(
                          new Rr(
                            f.id,
                            this.urlSerializer.serialize(f.extractedUrl),
                            f.source,
                            f.restoredState,
                          ),
                        ),
                        h !== this.transitions?.getValue()
                          ? ve
                          : Promise.resolve(f)
                      )
                    }),
                    YC(
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
                      let h = new Po(
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
                    v = new Rr(f, this.urlSerializer.serialize(h), m, M)
                  this.events.next(v)
                  let ne = Ah(this.rootComponentType).snapshot
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
                    ve
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
                      guards: hC(
                        c.targetSnapshot,
                        c.currentSnapshot,
                        this.rootContexts,
                      ),
                    })),
                  s
                ),
              ),
              IC(this.environmentInjector, (c) => this.events.next(c)),
              G((c) => {
                if (((s.guardsResult = c.guardsResult), Un(c.guardsResult)))
                  throw Oh(this.urlSerializer, c.guardsResult)
                let l = new Ru(
                  c.id,
                  this.urlSerializer.serialize(c.extractedUrl),
                  this.urlSerializer.serialize(c.urlAfterRedirects),
                  c.targetSnapshot,
                  !!c.guardsResult,
                )
                this.events.next(l)
              }),
              ye((c) =>
                c.guardsResult
                  ? !0
                  : (this.cancelNavigationTransition(c, '', Ce.GuardRejected),
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
                    De((l) => {
                      let d = !1
                      return b(l).pipe(
                        QC(
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
                                Ce.NoDataFromResolver,
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
                return Di(l(c.targetSnapshot.root)).pipe(st(null), Qe(1))
              }),
              bu(() => this.afterPreactivation()),
              De(() => {
                let { currentSnapshot: c, targetSnapshot: l } = s,
                  d = this.createViewTransition?.(
                    this.environmentInjector,
                    c.root,
                    l.root,
                  )
                return d ? z(d).pipe(E(() => s)) : b(s)
              }),
              E((c) => {
                let l = oC(
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
                this.events.next(new Fr())
              }),
              fC(
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
                    Ce.SupersededByNewNavigation,
                  ),
                  this.currentTransition?.id === s.id &&
                    ((this.currentNavigation = null),
                    (this.currentTransition = null))
              }),
              Ae((c) => {
                if (((u = !0), Ph(c)))
                  this.events.next(
                    new wt(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      c.message,
                      c.cancellationCode,
                    ),
                  ),
                    uC(c) ? this.events.next(new Pr(c.url)) : s.resolve(!1)
                else {
                  this.events.next(
                    new Or(
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
                return ve
              }),
            )
          }),
        )
      )
    }
    cancelNavigationTransition(r, i, o) {
      let s = new wt(r.id, this.urlSerializer.serialize(r.extractedUrl), i, o)
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
  ;(t.ɵfac = function (i) {
    return new (i || t)()
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
  let e = t
  return e
})()
function aE(e) {
  return e !== Ar
}
var uE = (() => {
    let t = class t {}
    ;(t.ɵfac = function (i) {
      return new (i || t)()
    }),
      (t.ɵprov = D({ token: t, factory: () => p(cE), providedIn: 'root' }))
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
  cE = (() => {
    let t = class t extends Ku {}
    ;(t.ɵfac = (() => {
      let r
      return function (o) {
        return (r || (r = ht(t)))(o || t)
      }
    })()),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })(),
  Bh = (() => {
    let t = class t {}
    ;(t.ɵfac = function (i) {
      return new (i || t)()
    }),
      (t.ɵprov = D({ token: t, factory: () => p(lE), providedIn: 'root' }))
    let e = t
    return e
  })(),
  lE = (() => {
    let t = class t extends Bh {
      constructor() {
        super(...arguments),
          (this.location = p(yr)),
          (this.urlSerializer = p(Ju)),
          (this.options = p(ic, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || 'replace'),
          (this.urlHandlingStrategy = p(sc)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || 'deferred'),
          (this.currentUrlTree = new Dt()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = Ah(null)),
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
        return this.location.subscribe((i) => {
          i.type === 'popstate' && r(i.url, i.state)
        })
      }
      handleRouterEvent(r, i) {
        if (r instanceof Rr) this.stateMemento = this.createStateMemento()
        else if (r instanceof Yt) this.rawUrlTree = i.initialUrl
        else if (r instanceof Po) {
          if (
            this.urlUpdateStrategy === 'eager' &&
            !i.extras.skipLocationChange
          ) {
            let o = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl)
            this.setBrowserUrl(o, i)
          }
        } else
          r instanceof Fr
            ? ((this.currentUrlTree = i.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                i.finalUrl,
                i.initialUrl,
              )),
              (this.routerState = i.targetRouterState),
              this.urlUpdateStrategy === 'deferred' &&
                (i.extras.skipLocationChange ||
                  this.setBrowserUrl(this.rawUrlTree, i)))
            : r instanceof wt &&
                (r.code === Ce.GuardRejected ||
                  r.code === Ce.NoDataFromResolver)
              ? this.restoreHistory(i)
              : r instanceof Or
                ? this.restoreHistory(i, !0)
                : r instanceof Zt &&
                  ((this.lastSuccessfulId = r.id),
                  (this.currentPageId = this.browserPageId))
      }
      setBrowserUrl(r, i) {
        let o = this.urlSerializer.serialize(r)
        if (this.location.isCurrentPathEqualTo(o) || i.extras.replaceUrl) {
          let s = this.browserPageId,
            a = g(g({}, i.extras.state), this.generateNgRouterState(i.id, s))
          this.location.replaceState(o, '', a)
        } else {
          let s = g(
            g({}, i.extras.state),
            this.generateNgRouterState(i.id, this.browserPageId + 1),
          )
          this.location.go(o, '', s)
        }
      }
      restoreHistory(r, i = !1) {
        if (this.canceledNavigationResolution === 'computed') {
          let o = this.browserPageId,
            s = this.currentPageId - o
          s !== 0
            ? this.location.historyGo(s)
            : this.currentUrlTree === r.finalUrl &&
              s === 0 &&
              (this.resetState(r), this.resetUrlToCurrentUrlTree())
        } else
          this.canceledNavigationResolution === 'replace' &&
            (i && this.resetState(r), this.resetUrlToCurrentUrlTree())
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
      generateNgRouterState(r, i) {
        return this.canceledNavigationResolution === 'computed'
          ? { navigationId: r, ɵrouterPageId: i }
          : { navigationId: r }
      }
    }
    ;(t.ɵfac = (() => {
      let r
      return function (o) {
        return (r || (r = ht(t)))(o || t)
      }
    })()),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })(),
  Sr = (function (e) {
    return (
      (e[(e.COMPLETE = 0)] = 'COMPLETE'),
      (e[(e.FAILED = 1)] = 'FAILED'),
      (e[(e.REDIRECTING = 2)] = 'REDIRECTING'),
      e
    )
  })(Sr || {})
function dE(e, t) {
  e.events
    .pipe(
      ye(
        (n) =>
          n instanceof Zt ||
          n instanceof wt ||
          n instanceof Or ||
          n instanceof Yt,
      ),
      E((n) =>
        n instanceof Zt || n instanceof Yt
          ? Sr.COMPLETE
          : (
                n instanceof wt
                  ? n.code === Ce.Redirect ||
                    n.code === Ce.SupersededByNewNavigation
                  : !1
              )
            ? Sr.REDIRECTING
            : Sr.FAILED,
      ),
      ye((n) => n !== Sr.REDIRECTING),
      Qe(1),
    )
    .subscribe(() => {
      t()
    })
}
function fE(e) {
  throw e
}
var hE = {
    paths: 'exact',
    fragment: 'ignored',
    matrixParams: 'ignored',
    queryParams: 'exact',
  },
  pE = {
    paths: 'subset',
    fragment: 'ignored',
    matrixParams: 'ignored',
    queryParams: 'subset',
  },
  Hh = (() => {
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
          (this.console = p(fo)),
          (this.stateManager = p(Bh)),
          (this.options = p(ic, { optional: !0 }) || {}),
          (this.pendingTasks = p(An)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || 'deferred'),
          (this.navigationTransitions = p(sE)),
          (this.urlSerializer = p(Ju)),
          (this.location = p(yr)),
          (this.urlHandlingStrategy = p(sc)),
          (this._events = new se()),
          (this.errorHandler = this.options.errorHandler || fE),
          (this.navigated = !1),
          (this.routeReuseStrategy = p(uE)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || 'ignore'),
          (this.config = p(oc, { optional: !0 })?.flat() ?? []),
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
        let r = this.navigationTransitions.events.subscribe((i) => {
          try {
            let o = this.navigationTransitions.currentTransition,
              s = this.navigationTransitions.currentNavigation
            if (o !== null && s !== null) {
              if (
                (this.stateManager.handleRouterEvent(i, s),
                i instanceof wt &&
                  i.code !== Ce.Redirect &&
                  i.code !== Ce.SupersededByNewNavigation)
              )
                this.navigated = !0
              else if (i instanceof Zt) this.navigated = !0
              else if (i instanceof Pr) {
                let a = this.urlHandlingStrategy.merge(i.url, o.currentRawUrl),
                  u = {
                    info: o.extras.info,
                    skipLocationChange: o.extras.skipLocationChange,
                    replaceUrl:
                      this.urlUpdateStrategy === 'eager' || aE(o.source),
                  }
                this.scheduleNavigation(a, Ar, null, u, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                })
              }
            }
            mE(i) && this._events.next(i)
          } catch (o) {
            this.navigationTransitions.transitionAbortSubject.next(o)
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
              Ar,
              this.stateManager.restoredState(),
            )
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (r, i) => {
              setTimeout(() => {
                this.navigateToSyncWithBrowser(r, 'popstate', i)
              }, 0)
            },
          )
      }
      navigateToSyncWithBrowser(r, i, o) {
        let s = { replaceUrl: !0 },
          a = o?.navigationId ? o : null
        if (o) {
          let c = g({}, o)
          delete c.navigationId,
            delete c.ɵrouterPageId,
            Object.keys(c).length !== 0 && (s.state = c)
        }
        let u = this.parseUrl(r)
        this.scheduleNavigation(u, i, a, s)
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
      createUrlTree(r, i = {}) {
        let {
            relativeTo: o,
            queryParams: s,
            fragment: a,
            queryParamsHandling: u,
            preserveFragment: c,
          } = i,
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
          let h = o ? o.snapshot : this.routerState.snapshot.root
          f = Mh(h)
        } catch {
          ;(typeof r[0] != 'string' || !r[0].startsWith('/')) && (r = []),
            (f = this.currentUrlTree.root)
        }
        return _h(f, r, d, l ?? null)
      }
      navigateByUrl(r, i = { skipLocationChange: !1 }) {
        let o = Un(r) ? r : this.parseUrl(r),
          s = this.urlHandlingStrategy.merge(o, this.rawUrlTree)
        return this.scheduleNavigation(s, Ar, null, i)
      }
      navigate(r, i = { skipLocationChange: !1 }) {
        return gE(r), this.navigateByUrl(this.createUrlTree(r, i), i)
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
      isActive(r, i) {
        let o
        if (
          (i === !0 ? (o = g({}, hE)) : i === !1 ? (o = g({}, pE)) : (o = i),
          Un(r))
        )
          return lh(this.currentUrlTree, r, o)
        let s = this.parseUrl(r)
        return lh(this.currentUrlTree, s, o)
      }
      removeEmptyProps(r) {
        return Object.entries(r).reduce(
          (i, [o, s]) => (s != null && (i[o] = s), i),
          {},
        )
      }
      scheduleNavigation(r, i, o, s, a) {
        if (this.disposed) return Promise.resolve(!1)
        let u, c, l
        a
          ? ((u = a.resolve), (c = a.reject), (l = a.promise))
          : (l = new Promise((f, h) => {
              ;(u = f), (c = h)
            }))
        let d = this.pendingTasks.add()
        return (
          dE(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(d))
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: i,
            restoredState: o,
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
    ;(t.ɵfac = function (i) {
      return new (i || t)()
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })()
function gE(e) {
  for (let t = 0; t < e.length; t++) if (e[t] == null) throw new w(4008, !1)
}
function mE(e) {
  return !(e instanceof Fr) && !(e instanceof Pr)
}
var vE = new C('')
function zh(e, ...t) {
  return In([
    { provide: oc, multi: !0, useValue: e },
    [],
    { provide: $n, useFactory: yE, deps: [Hh] },
    { provide: ho, multi: !0, useFactory: DE },
    t.map((n) => n.ɵproviders),
  ])
}
function yE(e) {
  return e.routerState.root
}
function DE() {
  let e = p(_n)
  return (t) => {
    let n = e.get(Rn)
    if (t !== n.components[0]) return
    let r = e.get(Hh),
      i = e.get(wE)
    e.get(CE) === 1 && r.initialNavigation(),
      e.get(EE, null, x.Optional)?.setUpPreloading(),
      e.get(vE, null, x.Optional)?.init(),
      r.resetRootComponentType(n.componentTypes[0]),
      i.closed || (i.next(), i.complete(), i.unsubscribe())
  }
}
var wE = new C('', { factory: () => new se() }),
  CE = new C('', { providedIn: 'root', factory: () => 1 })
var EE = new C('')
var Gh = []
var qh = { providers: [zh(Gh), eh()] }
var ep = (() => {
    let t = class t {
      constructor(r, i) {
        ;(this._renderer = r),
          (this._elementRef = i),
          (this.onChange = (o) => {}),
          (this.onTouched = () => {})
      }
      setProperty(r, i) {
        this._renderer.setProperty(this._elementRef.nativeElement, r, i)
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
    ;(t.ɵfac = function (i) {
      return new (i || t)(J(Tn), J(Vt))
    }),
      (t.ɵdir = He({ type: t }))
    let e = t
    return e
  })(),
  tp = (() => {
    let t = class t extends ep {}
    ;(t.ɵfac = (() => {
      let r
      return function (o) {
        return (r || (r = ht(t)))(o || t)
      }
    })()),
      (t.ɵdir = He({ type: t, features: [Ut] }))
    let e = t
    return e
  })(),
  dc = new C('')
var IE = { provide: dc, useExisting: En(() => Gn), multi: !0 }
function bE() {
  let e = nt() ? nt().getUserAgent() : ''
  return /android (\d+)/.test(e.toLowerCase())
}
var ME = new C(''),
  Gn = (() => {
    let t = class t extends ep {
      constructor(r, i, o) {
        super(r, i),
          (this._compositionMode = o),
          (this._composing = !1),
          this._compositionMode == null && (this._compositionMode = !bE())
      }
      writeValue(r) {
        let i = r ?? ''
        this.setProperty('value', i)
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
    ;(t.ɵfac = function (i) {
      return new (i || t)(J(Tn), J(Vt), J(ME, 8))
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
        hostBindings: function (i, o) {
          i & 1 &&
            oe('input', function (a) {
              return o._handleInput(a.target.value)
            })('blur', function () {
              return o.onTouched()
            })('compositionstart', function () {
              return o._compositionStart()
            })('compositionend', function (a) {
              return o._compositionEnd(a.target.value)
            })
        },
        features: [gt([IE]), Ut],
      }))
    let e = t
    return e
  })()
var _E = new C(''),
  SE = new C('')
function np(e) {
  return e != null
}
function rp(e) {
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
function op(e, t) {
  return t.map((n) => n(e))
}
function TE(e) {
  return !e.validate
}
function sp(e) {
  return e.map((t) => (TE(t) ? t : (n) => t.validate(n)))
}
function AE(e) {
  if (!e) return null
  let t = e.filter(np)
  return t.length == 0
    ? null
    : function (n) {
        return ip(op(n, t))
      }
}
function ap(e) {
  return e != null ? AE(sp(e)) : null
}
function xE(e) {
  if (!e) return null
  let t = e.filter(np)
  return t.length == 0
    ? null
    : function (n) {
        let r = op(n, t).map(rp)
        return gs(r).pipe(E(ip))
      }
}
function up(e) {
  return e != null ? xE(sp(e)) : null
}
function Wh(e, t) {
  return e === null ? [t] : Array.isArray(e) ? [...e, t] : [e, t]
}
function NE(e) {
  return e._rawValidators
}
function RE(e) {
  return e._rawAsyncValidators
}
function ac(e) {
  return e ? (Array.isArray(e) ? e : [e]) : []
}
function zo(e, t) {
  return Array.isArray(e) ? e.includes(t) : e === t
}
function Zh(e, t) {
  let n = ac(t)
  return (
    ac(e).forEach((i) => {
      zo(n, i) || n.push(i)
    }),
    n
  )
}
function Yh(e, t) {
  return ac(t).filter((n) => !zo(e, n))
}
var Go = class {
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
        (this._composedValidatorFn = ap(this._rawValidators))
    }
    _setAsyncValidators(t) {
      ;(this._rawAsyncValidators = t || []),
        (this._composedAsyncValidatorFn = up(this._rawAsyncValidators))
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
  uc = class extends Go {
    get formDirective() {
      return null
    }
    get path() {
      return null
    }
  },
  zr = class extends Go {
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
  OE = {
    '[class.ng-untouched]': 'isUntouched',
    '[class.ng-touched]': 'isTouched',
    '[class.ng-pristine]': 'isPristine',
    '[class.ng-dirty]': 'isDirty',
    '[class.ng-valid]': 'isValid',
    '[class.ng-invalid]': 'isInvalid',
    '[class.ng-pending]': 'isPending',
  },
  sx = R(g({}, OE), { '[class.ng-submitted]': 'isSubmitted' }),
  qo = (() => {
    let t = class t extends cc {
      constructor(r) {
        super(r)
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)(J(zr, 2))
    }),
      (t.ɵdir = He({
        type: t,
        selectors: [
          ['', 'formControlName', ''],
          ['', 'ngModel', ''],
          ['', 'formControl', ''],
        ],
        hostVars: 14,
        hostBindings: function (i, o) {
          i & 2 &&
            iu('ng-untouched', o.isUntouched)('ng-touched', o.isTouched)(
              'ng-pristine',
              o.isPristine,
            )('ng-dirty', o.isDirty)('ng-valid', o.isValid)(
              'ng-invalid',
              o.isInvalid,
            )('ng-pending', o.isPending)
        },
        features: [Ut],
      }))
    let e = t
    return e
  })()
var Br = 'VALID',
  Ho = 'INVALID',
  zn = 'PENDING',
  Hr = 'DISABLED'
function FE(e) {
  return (Wo(e) ? e.validators : e) || null
}
function PE(e) {
  return Array.isArray(e) ? ap(e) : e || null
}
function kE(e, t) {
  return (Wo(t) ? t.asyncValidators : e) || null
}
function LE(e) {
  return Array.isArray(e) ? up(e) : e || null
}
function Wo(e) {
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
    return this.status === Br
  }
  get invalid() {
    return this.status === Ho
  }
  get pending() {
    return this.status == zn
  }
  get disabled() {
    return this.status === Hr
  }
  get enabled() {
    return this.status !== Hr
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
    this.setValidators(Zh(t, this._rawValidators))
  }
  addAsyncValidators(t) {
    this.setAsyncValidators(Zh(t, this._rawAsyncValidators))
  }
  removeValidators(t) {
    this.setValidators(Yh(t, this._rawValidators))
  }
  removeAsyncValidators(t) {
    this.setAsyncValidators(Yh(t, this._rawAsyncValidators))
  }
  hasValidator(t) {
    return zo(this._rawValidators, t)
  }
  hasAsyncValidator(t) {
    return zo(this._rawAsyncValidators, t)
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
    ;(this.status = zn),
      t.emitEvent !== !1 && this.statusChanges.emit(this.status),
      this._parent && !t.onlySelf && this._parent.markAsPending(t)
  }
  disable(t = {}) {
    let n = this._parentMarkedDirty(t.onlySelf)
    ;(this.status = Hr),
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
    ;(this.status = Br),
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
        (this.status === Br || this.status === zn) &&
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
    this.status = this._allControlsDisabled() ? Hr : Br
  }
  _runValidator() {
    return this.validator ? this.validator(this) : null
  }
  _runAsyncValidator(t) {
    if (this.asyncValidator) {
      ;(this.status = zn), (this._hasOwnPendingAsyncValidator = !0)
      let n = rp(this.asyncValidator(this))
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
      : n.reduce((r, i) => r && r._find(i), this)
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
      ? Hr
      : this.errors
        ? Ho
        : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(zn)
          ? zn
          : this._anyControlsHaveStatus(Ho)
            ? Ho
            : Br
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
    Wo(t) && t.updateOn != null && (this._updateOn = t.updateOn)
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
      (this._composedValidatorFn = PE(this._rawValidators))
  }
  _assignAsyncValidators(t) {
    ;(this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t),
      (this._composedAsyncValidatorFn = LE(this._rawAsyncValidators))
  }
}
var cp = new C('CallSetDisabledState', {
    providedIn: 'root',
    factory: () => fc,
  }),
  fc = 'always'
function VE(e, t) {
  return [...t.path, e]
}
function jE(e, t, n = fc) {
  $E(e, t),
    t.valueAccessor.writeValue(e.value),
    (e.disabled || n === 'always') &&
      t.valueAccessor.setDisabledState?.(e.disabled),
    BE(e, t),
    zE(e, t),
    HE(e, t),
    UE(e, t)
}
function Qh(e, t) {
  e.forEach((n) => {
    n.registerOnValidatorChange && n.registerOnValidatorChange(t)
  })
}
function UE(e, t) {
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
function $E(e, t) {
  let n = NE(e)
  t.validator !== null
    ? e.setValidators(Wh(n, t.validator))
    : typeof n == 'function' && e.setValidators([n])
  let r = RE(e)
  t.asyncValidator !== null
    ? e.setAsyncValidators(Wh(r, t.asyncValidator))
    : typeof r == 'function' && e.setAsyncValidators([r])
  let i = () => e.updateValueAndValidity()
  Qh(t._rawValidators, i), Qh(t._rawAsyncValidators, i)
}
function BE(e, t) {
  t.valueAccessor.registerOnChange((n) => {
    ;(e._pendingValue = n),
      (e._pendingChange = !0),
      (e._pendingDirty = !0),
      e.updateOn === 'change' && lp(e, t)
  })
}
function HE(e, t) {
  t.valueAccessor.registerOnTouched(() => {
    ;(e._pendingTouched = !0),
      e.updateOn === 'blur' && e._pendingChange && lp(e, t),
      e.updateOn !== 'submit' && e.markAsTouched()
  })
}
function lp(e, t) {
  e._pendingDirty && e.markAsDirty(),
    e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
    t.viewToModelUpdate(e._pendingValue),
    (e._pendingChange = !1)
}
function zE(e, t) {
  let n = (r, i) => {
    t.valueAccessor.writeValue(r), i && t.viewToModelUpdate(r)
  }
  e.registerOnChange(n),
    t._registerOnDestroy(() => {
      e._unregisterOnChange(n)
    })
}
function GE(e, t) {
  if (!e.hasOwnProperty('model')) return !1
  let n = e.model
  return n.isFirstChange() ? !0 : !Object.is(t, n.currentValue)
}
function qE(e) {
  return Object.getPrototypeOf(e.constructor) === tp
}
function WE(e, t) {
  if (!t) return null
  Array.isArray(t)
  let n, r, i
  return (
    t.forEach((o) => {
      o.constructor === Gn ? (n = o) : qE(o) ? (r = o) : (i = o)
    }),
    i || r || n || null
  )
}
function Kh(e, t) {
  let n = e.indexOf(t)
  n > -1 && e.splice(n, 1)
}
function Jh(e) {
  return (
    typeof e == 'object' &&
    e !== null &&
    Object.keys(e).length === 2 &&
    'value' in e &&
    'disabled' in e
  )
}
var ZE = class extends lc {
  constructor(t = null, n, r) {
    super(FE(n), kE(r, n)),
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
      Wo(n) &&
        (n.nonNullable || n.initialValueIsDefault) &&
        (Jh(t) ? (this.defaultValue = t.value) : (this.defaultValue = t))
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
    Kh(this._onChange, t)
  }
  registerOnDisabledChange(t) {
    this._onDisabledChange.push(t)
  }
  _unregisterOnDisabledChange(t) {
    Kh(this._onDisabledChange, t)
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
    Jh(t)
      ? ((this.value = this._pendingValue = t.value),
        t.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = t)
  }
}
var YE = { provide: zr, useExisting: En(() => Gr) },
  Xh = Promise.resolve(),
  Gr = (() => {
    let t = class t extends zr {
      constructor(r, i, o, s, a, u) {
        super(),
          (this._changeDetectorRef = a),
          (this.callSetDisabledState = u),
          (this.control = new ZE()),
          (this._registered = !1),
          (this.name = ''),
          (this.update = new ue()),
          (this._parent = r),
          this._setValidators(i),
          this._setAsyncValidators(o),
          (this.valueAccessor = WE(this, s))
      }
      ngOnChanges(r) {
        if ((this._checkForErrors(), !this._registered || 'name' in r)) {
          if (this._registered && (this._checkName(), this.formDirective)) {
            let i = r.name.previousValue
            this.formDirective.removeControl({
              name: i,
              path: this._getPath(i),
            })
          }
          this._setUpControl()
        }
        'isDisabled' in r && this._updateDisabled(r),
          GE(r, this.viewModel) &&
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
        jE(this.control, this, this.callSetDisabledState),
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
        Xh.then(() => {
          this.control.setValue(r, { emitViewToModelChange: !1 }),
            this._changeDetectorRef?.markForCheck()
        })
      }
      _updateDisabled(r) {
        let i = r.isDisabled.currentValue,
          o = i !== 0 && po(i)
        Xh.then(() => {
          o && !this.control.disabled
            ? this.control.disable()
            : !o && this.control.disabled && this.control.enable(),
            this._changeDetectorRef?.markForCheck()
        })
      }
      _getPath(r) {
        return this._parent ? VE(r, this._parent) : [r]
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)(
        J(uc, 9),
        J(_E, 10),
        J(SE, 10),
        J(dc, 10),
        J(Ht, 8),
        J(cp, 8),
      )
    }),
      (t.ɵdir = He({
        type: t,
        selectors: [
          ['', 'ngModel', '', 3, 'formControlName', '', 3, 'formControl', ''],
        ],
        inputs: {
          name: 'name',
          isDisabled: [be.None, 'disabled', 'isDisabled'],
          model: [be.None, 'ngModel', 'model'],
          options: [be.None, 'ngModelOptions', 'options'],
        },
        outputs: { update: 'ngModelChange' },
        exportAs: ['ngModel'],
        features: [gt([YE]), Ut, Mn],
      }))
    let e = t
    return e
  })()
var QE = { provide: dc, useExisting: En(() => qr), multi: !0 },
  qr = (() => {
    let t = class t extends tp {
      writeValue(r) {
        let i = r ?? ''
        this.setProperty('value', i)
      }
      registerOnChange(r) {
        this.onChange = (i) => {
          r(i == '' ? null : parseFloat(i))
        }
      }
    }
    ;(t.ɵfac = (() => {
      let r
      return function (o) {
        return (r || (r = ht(t)))(o || t)
      }
    })()),
      (t.ɵdir = He({
        type: t,
        selectors: [
          ['input', 'type', 'number', 'formControlName', ''],
          ['input', 'type', 'number', 'formControl', ''],
          ['input', 'type', 'number', 'ngModel', ''],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            oe('input', function (a) {
              return o.onChange(a.target.value)
            })('blur', function () {
              return o.onTouched()
            })
        },
        features: [gt([QE]), Ut],
      }))
    let e = t
    return e
  })()
var KE = (() => {
  let t = class t {}
  ;(t.ɵfac = function (i) {
    return new (i || t)()
  }),
    (t.ɵmod = kt({ type: t })),
    (t.ɵinj = Pt({}))
  let e = t
  return e
})()
var Zo = (() => {
  let t = class t {
    static withConfig(r) {
      return {
        ngModule: t,
        providers: [{ provide: cp, useValue: r.callSetDisabledState ?? fc }],
      }
    }
  }
  ;(t.ɵfac = function (i) {
    return new (i || t)()
  }),
    (t.ɵmod = kt({ type: t })),
    (t.ɵinj = Pt({ imports: [KE] }))
  let e = t
  return e
})()
var hc = (() => {
  let t = class t {
    constructor() {
      ;(this._state = co({ count: 0 })),
        (this.count = vt(() => this._state().count))
    }
    increment(r = 1) {
      this._state.update((i) => R(g({}, i), { count: i.count + r }))
    }
    decrement(r = 1) {
      this._state.update((i) => R(g({}, i), { count: i.count - r }))
    }
  }
  ;(t.ɵfac = function (i) {
    return new (i || t)()
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac }))
  let e = t
  return e
})()
var fp = (() => {
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
  ;(t.ɵfac = function (i) {
    return new (i || t)()
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
      template: function (i, o) {
        i & 1 &&
          (U(0, 'button', 0),
          oe('click', function () {
            return o.decrement()
          }),
          H(1, 'Decrement -1'),
          V(),
          U(2, 'button', 0),
          oe('click', function () {
            return o.increment()
          }),
          H(3, 'Increment +1'),
          V(),
          U(4, 'input', 1),
          vr('ngModelChange', function (a) {
            return lo(o.input, a) || (o.input = a), a
          }),
          V(),
          U(5, 'button', 0),
          oe('click', function () {
            return o.decrementBy()
          }),
          H(6),
          V(),
          U(7, 'button', 0),
          oe('click', function () {
            return o.incrementBy()
          }),
          H(8),
          V(),
          U(9, 'blockquote'),
          H(10),
          V()),
          i & 2 &&
            (ie(4),
            mr('ngModel', o.input),
            ie(2),
            ze(
              ' Decrement by ',
              o.input,
              `
`,
            ),
            ie(2),
            ze(
              ' Increment by ',
              o.input,
              `
`,
            ),
            ie(2),
            ze('Counter: ', o.count(), ''))
      },
      dependencies: [Zo, Gn, qr, qo, Gr],
      encapsulation: 2,
    }))
  let e = t
  return e
})()
var Yo = class {
  constructor() {
    ;(this._state = co({ data: [], loading: !1, error: null })),
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
        Ae((n) => {
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
      R(g({}, n), { data: [], loading: !1, error: t.message }),
    )
  }
}
var pc = (() => {
  let t = class t extends Yo {
    constructor() {
      super(...arguments),
        (this.http = p(hu)),
        (this.baseUrl = 'https://jsonplaceholder.typicode.com/posts')
    }
    getAll() {
      return this.requestWrapper(this.http.get(this.baseUrl))
    }
    getPost(r) {
      return this.requestWrapper(this.http.get(`${this.baseUrl}/${r}`))
    }
    createPost(r) {
      return this.requestWrapper(this.http.post(this.baseUrl, { title: r }))
    }
    updatePost(r, i) {
      return this.requestWrapper(
        this.http.put(`${this.baseUrl}/${r}`, { title: i }),
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
    return function (o) {
      return (r || (r = ht(t)))(o || t)
    }
  })()),
    (t.ɵprov = D({ token: t, factory: t.ɵfac }))
  let e = t
  return e
})()
var JE = (e, t) => t.id
function XE(e, t) {
  e & 1 && (U(0, 'blockquote'), H(1, 'Loading...'), V())
}
function eI(e, t) {
  if (
    (e & 1 && (U(0, 'blockquote')(1, 'strong'), H(2, 'Error:'), V(), H(3), V()),
    e & 2)
  ) {
    let n = ou()
    ie(3), ze(' ', n.error(), '')
  }
}
function tI(e, t) {
  if (
    (e & 1 && (U(0, 'blockquote')(1, 'strong'), H(2), V(), H(3), V()), e & 2)
  ) {
    let n = t.$implicit
    ie(2), ze('', n.id, ':'), ie(), ze(' ', n.title, ' ')
  }
}
function nI(e, t) {
  e & 1 && (U(0, 'blockquote'), H(1, 'No posts found!'), V())
}
function rI(e, t) {
  if (
    (e & 1 &&
      Tf(0, tI, 4, 2, 'blockquote', null, JE, !1, nI, 2, 0, 'blockquote'),
    e & 2)
  ) {
    let n = ou()
    Af(n.posts())
  }
}
var hp = (() => {
  let t = class t {
    constructor() {
      ;(this.postsService = p(pc)),
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
  ;(t.ɵfac = function (i) {
    return new (i || t)()
  }),
    (t.ɵcmp = dt({
      type: t,
      selectors: [['app-posts']],
      standalone: !0,
      features: [gt([pc]), mt],
      decls: 19,
      vars: 8,
      consts: [
        [3, 'click', 'disabled'],
        ['type', 'number', 3, 'ngModelChange', 'ngModel'],
        [2, 'max-height', '200px', 'overflow-y', 'auto'],
      ],
      template: function (i, o) {
        i & 1 &&
          (U(0, 'button', 0),
          oe('click', function () {
            return o.getAllPosts()
          }),
          H(1, 'get all posts'),
          V(),
          U(2, 'button', 0),
          oe('click', function () {
            return o.createPost()
          }),
          H(3, 'create new post'),
          V(),
          U(4, 'input', 1),
          vr('ngModelChange', function (a) {
            return lo(o.input, a) || (o.input = a), a
          }),
          V(),
          U(5, 'button', 0),
          oe('click', function () {
            return o.getPost()
          }),
          H(6, 'get post by id'),
          V(),
          U(7, 'button', 0),
          oe('click', function () {
            return o.updatePost()
          }),
          H(8, 'update post by id'),
          V(),
          U(9, 'button', 0),
          oe('click', function () {
            return o.deletePost()
          }),
          H(10, 'delete post by id'),
          V(),
          U(11, 'p')(12, 'strong'),
          H(13, 'Total posts in response:'),
          V(),
          H(14),
          V(),
          U(15, 'div', 2),
          dr(16, XE, 2, 0, 'blockquote')(17, eI, 4, 1)(18, rI, 3, 1),
          V()),
          i & 2 &&
            ($t('disabled', o.loading()),
            ie(2),
            $t('disabled', o.loading()),
            ie(2),
            mr('ngModel', o.input),
            ie(),
            $t('disabled', o.loading()),
            ie(2),
            $t('disabled', o.loading()),
            ie(2),
            $t('disabled', o.loading()),
            ie(5),
            ze(' ', o.totalPosts(), ''),
            ie(2),
            Sf(16, o.loading() ? 16 : o.error() ? 17 : 18))
      },
      dependencies: [Zo, Gn, qr, qo, Gr],
      encapsulation: 2,
    }))
  let e = t
  return e
})()
var pp = (() => {
  let t = class t {}
  ;(t.ɵfac = function (i) {
    return new (i || t)()
  }),
    (t.ɵcmp = dt({
      type: t,
      selectors: [['app-root']],
      standalone: !0,
      features: [mt],
      decls: 10,
      vars: 0,
      template: function (i, o) {
        i & 1 &&
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
      dependencies: [fp, hp],
      encapsulation: 2,
    }))
  let e = t
  return e
})()
uh(pp, qh).catch((e) => console.error(e))
