var mp = Object.defineProperty,
  vp = Object.defineProperties
var yp = Object.getOwnPropertyDescriptors
var pc = Object.getOwnPropertySymbols
var Dp = Object.prototype.hasOwnProperty,
  wp = Object.prototype.propertyIsEnumerable
var gc = (e, t, r) =>
    t in e
      ? mp(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (e[t] = r),
  g = (e, t) => {
    for (var r in (t ||= {})) Dp.call(t, r) && gc(e, r, t[r])
    if (pc) for (var r of pc(t)) wp.call(t, r) && gc(e, r, t[r])
    return e
  },
  R = (e, t) => vp(e, yp(t))
function mc(e, t) {
  return Object.is(e, t)
}
var Q = null,
  Wr = !1,
  Zr = 1,
  We = Symbol('SIGNAL')
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
function Jo(e) {
  if (Wr) throw new Error('')
  if (Q === null) return
  Q.consumerOnSignalRead(e)
  let t = Q.nextProducerIndex++
  if ((Zt(Q), t < Q.producerNode.length && Q.producerNode[t] !== e && qn(Q))) {
    let r = Q.producerNode[t]
    Kr(r, Q.producerIndexOfThis[t])
  }
  Q.producerNode[t] !== e &&
    ((Q.producerNode[t] = e),
    (Q.producerIndexOfThis[t] = qn(Q) ? Cc(e, Q, t) : 0)),
    (Q.producerLastReadVersion[t] = e.version)
}
function Cp() {
  Zr++
}
function vc(e) {
  if (!(qn(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === Zr)) {
    if (!e.producerMustRecompute(e) && !ts(e)) {
      ;(e.dirty = !1), (e.lastCleanEpoch = Zr)
      return
    }
    e.producerRecomputeValue(e), (e.dirty = !1), (e.lastCleanEpoch = Zr)
  }
}
function yc(e) {
  if (e.liveConsumerNode === void 0) return
  let t = Wr
  Wr = !0
  try {
    for (let r of e.liveConsumerNode) r.dirty || Ep(r)
  } finally {
    Wr = t
  }
}
function Dc() {
  return Q?.consumerAllowSignalWrites !== !1
}
function Ep(e) {
  ;(e.dirty = !0), yc(e), e.consumerMarkedDirty?.(e)
}
function Xo(e) {
  return e && (e.nextProducerIndex = 0), O(e)
}
function es(e, t) {
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
      for (let r = e.nextProducerIndex; r < e.producerNode.length; r++)
        Kr(e.producerNode[r], e.producerIndexOfThis[r])
    for (; e.producerNode.length > e.nextProducerIndex; )
      e.producerNode.pop(),
        e.producerLastReadVersion.pop(),
        e.producerIndexOfThis.pop()
  }
}
function ts(e) {
  Zt(e)
  for (let t = 0; t < e.producerNode.length; t++) {
    let r = e.producerNode[t],
      n = e.producerLastReadVersion[t]
    if (n !== r.version || (vc(r), n !== r.version)) return !0
  }
  return !1
}
function wc(e) {
  if ((Zt(e), qn(e)))
    for (let t = 0; t < e.producerNode.length; t++)
      Kr(e.producerNode[t], e.producerIndexOfThis[t])
  ;(e.producerNode.length =
    e.producerLastReadVersion.length =
    e.producerIndexOfThis.length =
      0),
    e.liveConsumerNode &&
      (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0)
}
function Cc(e, t, r) {
  if ((Ec(e), Zt(e), e.liveConsumerNode.length === 0))
    for (let n = 0; n < e.producerNode.length; n++)
      e.producerIndexOfThis[n] = Cc(e.producerNode[n], e, n)
  return e.liveConsumerIndexOfThis.push(r), e.liveConsumerNode.push(t) - 1
}
function Kr(e, t) {
  if ((Ec(e), Zt(e), e.liveConsumerNode.length === 1))
    for (let n = 0; n < e.producerNode.length; n++)
      Kr(e.producerNode[n], e.producerIndexOfThis[n])
  let r = e.liveConsumerNode.length - 1
  if (
    ((e.liveConsumerNode[t] = e.liveConsumerNode[r]),
    (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[r]),
    e.liveConsumerNode.length--,
    e.liveConsumerIndexOfThis.length--,
    t < e.liveConsumerNode.length)
  ) {
    let n = e.liveConsumerIndexOfThis[t],
      i = e.liveConsumerNode[t]
    Zt(i), (i.producerIndexOfThis[n] = t)
  }
}
function qn(e) {
  return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0
}
function Zt(e) {
  ;(e.producerNode ??= []),
    (e.producerIndexOfThis ??= []),
    (e.producerLastReadVersion ??= [])
}
function Ec(e) {
  ;(e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= [])
}
function Ic(e) {
  let t = Object.create(Ip)
  t.computation = e
  let r = () => {
    if ((vc(t), Jo(t), t.value === Yr)) throw t.error
    return t.value
  }
  return (r[We] = t), r
}
var Qo = Symbol('UNSET'),
  Ko = Symbol('COMPUTING'),
  Yr = Symbol('ERRORED'),
  Ip = R(g({}, Qr), {
    value: Qo,
    dirty: !0,
    error: null,
    equal: mc,
    producerMustRecompute(e) {
      return e.value === Qo || e.value === Ko
    },
    producerRecomputeValue(e) {
      if (e.value === Ko) throw new Error('Detected cycle in computations.')
      let t = e.value
      e.value = Ko
      let r = Xo(e),
        n
      try {
        n = e.computation()
      } catch (i) {
        ;(n = Yr), (e.error = i)
      } finally {
        es(e, r)
      }
      if (t !== Qo && t !== Yr && n !== Yr && e.equal(t, n)) {
        e.value = t
        return
      }
      ;(e.value = n), e.version++
    },
  })
function bp() {
  throw new Error()
}
var bc = bp
function Mc() {
  bc()
}
function _c(e) {
  bc = e
}
var Mp = null
function Sc(e) {
  let t = Object.create(Ac)
  t.value = e
  let r = () => (Jo(t), t.value)
  return (r[We] = t), r
}
function ns(e, t) {
  Dc() || Mc(), e.equal(e.value, t) || ((e.value = t), _p(e))
}
function Tc(e, t) {
  Dc() || Mc(), ns(e, t(e.value))
}
var Ac = R(g({}, Qr), { equal: mc, value: void 0 })
function _p(e) {
  e.version++, Cp(), yc(e), Mp?.()
}
function _(e) {
  return typeof e == 'function'
}
function Yt(e) {
  let r = e((n) => {
    Error.call(n), (n.stack = new Error().stack)
  })
  return (
    (r.prototype = Object.create(Error.prototype)),
    (r.prototype.constructor = r),
    r
  )
}
var Jr = Yt(
  (e) =>
    function (r) {
      e(this),
        (this.message = r
          ? `${r.length} errors occurred during unsubscription:
${r.map((n, i) => `${i + 1}) ${n.toString()}`).join(`
  `)}`
          : ''),
        (this.name = 'UnsubscriptionError'),
        (this.errors = r)
    },
)
function Wn(e, t) {
  if (e) {
    let r = e.indexOf(t)
    0 <= r && e.splice(r, 1)
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
      let { _parentage: r } = this
      if (r)
        if (((this._parentage = null), Array.isArray(r)))
          for (let o of r) o.remove(this)
        else r.remove(this)
      let { initialTeardown: n } = this
      if (_(n))
        try {
          n()
        } catch (o) {
          t = o instanceof Jr ? o.errors : [o]
        }
      let { _finalizers: i } = this
      if (i) {
        this._finalizers = null
        for (let o of i)
          try {
            xc(o)
          } catch (s) {
            ;(t = t ?? []),
              s instanceof Jr ? (t = [...t, ...s.errors]) : t.push(s)
          }
      }
      if (t) throw new Jr(t)
    }
  }
  add(t) {
    var r
    if (t && t !== this)
      if (this.closed) xc(t)
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this)) return
          t._addParent(this)
        }
        ;(this._finalizers =
          (r = this._finalizers) !== null && r !== void 0 ? r : []).push(t)
      }
  }
  _hasParent(t) {
    let { _parentage: r } = this
    return r === t || (Array.isArray(r) && r.includes(t))
  }
  _addParent(t) {
    let { _parentage: r } = this
    this._parentage = Array.isArray(r) ? (r.push(t), r) : r ? [r, t] : t
  }
  _removeParent(t) {
    let { _parentage: r } = this
    r === t ? (this._parentage = null) : Array.isArray(r) && Wn(r, t)
  }
  remove(t) {
    let { _finalizers: r } = this
    r && Wn(r, t), t instanceof e && t._removeParent(this)
  }
}
Z.EMPTY = (() => {
  let e = new Z()
  return (e.closed = !0), e
})()
var rs = Z.EMPTY
function Xr(e) {
  return (
    e instanceof Z ||
    (e && 'closed' in e && _(e.remove) && _(e.add) && _(e.unsubscribe))
  )
}
function xc(e) {
  _(e) ? e() : e.unsubscribe()
}
var Te = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
}
var Qt = {
  setTimeout(e, t, ...r) {
    let { delegate: n } = Qt
    return n?.setTimeout ? n.setTimeout(e, t, ...r) : setTimeout(e, t, ...r)
  },
  clearTimeout(e) {
    let { delegate: t } = Qt
    return (t?.clearTimeout || clearTimeout)(e)
  },
  delegate: void 0,
}
function ei(e) {
  Qt.setTimeout(() => {
    let { onUnhandledError: t } = Te
    if (t) t(e)
    else throw e
  })
}
function Zn() {}
var Nc = is('C', void 0, void 0)
function Rc(e) {
  return is('E', void 0, e)
}
function Oc(e) {
  return is('N', e, void 0)
}
function is(e, t, r) {
  return { kind: e, value: t, error: r }
}
var wt = null
function Kt(e) {
  if (Te.useDeprecatedSynchronousErrorHandling) {
    let t = !wt
    if ((t && (wt = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: r, error: n } = wt
      if (((wt = null), r)) throw n
    }
  } else e()
}
function Fc(e) {
  Te.useDeprecatedSynchronousErrorHandling &&
    wt &&
    ((wt.errorThrown = !0), (wt.error = e))
}
var Ct = class extends Z {
    constructor(t) {
      super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), Xr(t) && t.add(this))
          : (this.destination = Ap)
    }
    static create(t, r, n) {
      return new Jt(t, r, n)
    }
    next(t) {
      this.isStopped ? ss(Oc(t), this) : this._next(t)
    }
    error(t) {
      this.isStopped ? ss(Rc(t), this) : ((this.isStopped = !0), this._error(t))
    }
    complete() {
      this.isStopped ? ss(Nc, this) : ((this.isStopped = !0), this._complete())
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
  Sp = Function.prototype.bind
function os(e, t) {
  return Sp.call(e, t)
}
var as = class {
    constructor(t) {
      this.partialObserver = t
    }
    next(t) {
      let { partialObserver: r } = this
      if (r.next)
        try {
          r.next(t)
        } catch (n) {
          ti(n)
        }
    }
    error(t) {
      let { partialObserver: r } = this
      if (r.error)
        try {
          r.error(t)
        } catch (n) {
          ti(n)
        }
      else ti(t)
    }
    complete() {
      let { partialObserver: t } = this
      if (t.complete)
        try {
          t.complete()
        } catch (r) {
          ti(r)
        }
    }
  },
  Jt = class extends Ct {
    constructor(t, r, n) {
      super()
      let i
      if (_(t) || !t)
        i = { next: t ?? void 0, error: r ?? void 0, complete: n ?? void 0 }
      else {
        let o
        this && Te.useDeprecatedNextContext
          ? ((o = Object.create(t)),
            (o.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: t.next && os(t.next, o),
              error: t.error && os(t.error, o),
              complete: t.complete && os(t.complete, o),
            }))
          : (i = t)
      }
      this.destination = new as(i)
    }
  }
function ti(e) {
  Te.useDeprecatedSynchronousErrorHandling ? Fc(e) : ei(e)
}
function Tp(e) {
  throw e
}
function ss(e, t) {
  let { onStoppedNotification: r } = Te
  r && Qt.setTimeout(() => r(e, t))
}
var Ap = { closed: !0, next: Zn, error: Tp, complete: Zn }
var Xt = (typeof Symbol == 'function' && Symbol.observable) || '@@observable'
function me(e) {
  return e
}
function us(...e) {
  return cs(e)
}
function cs(e) {
  return e.length === 0
    ? me
    : e.length === 1
      ? e[0]
      : function (r) {
          return e.reduce((n, i) => i(n), r)
        }
}
var k = (() => {
  class e {
    constructor(r) {
      r && (this._subscribe = r)
    }
    lift(r) {
      let n = new e()
      return (n.source = this), (n.operator = r), n
    }
    subscribe(r, n, i) {
      let o = Np(r) ? r : new Jt(r, n, i)
      return (
        Kt(() => {
          let { operator: s, source: a } = this
          o.add(
            s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o),
          )
        }),
        o
      )
    }
    _trySubscribe(r) {
      try {
        return this._subscribe(r)
      } catch (n) {
        r.error(n)
      }
    }
    forEach(r, n) {
      return (
        (n = Pc(n)),
        new n((i, o) => {
          let s = new Jt({
            next: (a) => {
              try {
                r(a)
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
    _subscribe(r) {
      var n
      return (n = this.source) === null || n === void 0
        ? void 0
        : n.subscribe(r)
    }
    [Xt]() {
      return this
    }
    pipe(...r) {
      return cs(r)(this)
    }
    toPromise(r) {
      return (
        (r = Pc(r)),
        new r((n, i) => {
          let o
          this.subscribe(
            (s) => (o = s),
            (s) => i(s),
            () => n(o),
          )
        })
      )
    }
  }
  return (e.create = (t) => new e(t)), e
})()
function Pc(e) {
  var t
  return (t = e ?? Te.Promise) !== null && t !== void 0 ? t : Promise
}
function xp(e) {
  return e && _(e.next) && _(e.error) && _(e.complete)
}
function Np(e) {
  return (e && e instanceof Ct) || (xp(e) && Xr(e))
}
function ls(e) {
  return _(e?.lift)
}
function F(e) {
  return (t) => {
    if (ls(t))
      return t.lift(function (r) {
        try {
          return e(r, this)
        } catch (n) {
          this.error(n)
        }
      })
    throw new TypeError('Unable to lift unknown Observable type')
  }
}
function N(e, t, r, n, i) {
  return new ds(e, t, r, n, i)
}
var ds = class extends Ct {
  constructor(t, r, n, i, o, s) {
    super(t),
      (this.onFinalize = o),
      (this.shouldUnsubscribe = s),
      (this._next = r
        ? function (a) {
            try {
              r(a)
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
      (this._complete = n
        ? function () {
            try {
              n()
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
      let { closed: r } = this
      super.unsubscribe(),
        !r && ((t = this.onFinalize) === null || t === void 0 || t.call(this))
    }
  }
}
function en() {
  return F((e, t) => {
    let r = null
    e._refCount++
    let n = N(t, void 0, void 0, void 0, () => {
      if (!e || e._refCount <= 0 || 0 < --e._refCount) {
        r = null
        return
      }
      let i = e._connection,
        o = r
      ;(r = null), i && (!o || i === o) && i.unsubscribe(), t.unsubscribe()
    })
    e.subscribe(n), n.closed || (r = e.connect())
  })
}
var tn = class extends k {
  constructor(t, r) {
    super(),
      (this.source = t),
      (this.subjectFactory = r),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      ls(t) && (this.lift = t.lift)
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
      let r = this.getSubject()
      t.add(
        this.source.subscribe(
          N(
            r,
            void 0,
            () => {
              this._teardown(), r.complete()
            },
            (n) => {
              this._teardown(), r.error(n)
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
    return en()(this)
  }
}
var kc = Yt(
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
      lift(r) {
        let n = new ni(this, this)
        return (n.operator = r), n
      }
      _throwIfClosed() {
        if (this.closed) throw new kc()
      }
      next(r) {
        Kt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers))
            for (let n of this.currentObservers) n.next(r)
          }
        })
      }
      error(r) {
        Kt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            ;(this.hasError = this.isStopped = !0), (this.thrownError = r)
            let { observers: n } = this
            for (; n.length; ) n.shift().error(r)
          }
        })
      }
      complete() {
        Kt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0
            let { observers: r } = this
            for (; r.length; ) r.shift().complete()
          }
        })
      }
      unsubscribe() {
        ;(this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null)
      }
      get observed() {
        var r
        return (
          ((r = this.observers) === null || r === void 0 ? void 0 : r.length) >
          0
        )
      }
      _trySubscribe(r) {
        return this._throwIfClosed(), super._trySubscribe(r)
      }
      _subscribe(r) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(r),
          this._innerSubscribe(r)
        )
      }
      _innerSubscribe(r) {
        let { hasError: n, isStopped: i, observers: o } = this
        return n || i
          ? rs
          : ((this.currentObservers = null),
            o.push(r),
            new Z(() => {
              ;(this.currentObservers = null), Wn(o, r)
            }))
      }
      _checkFinalizedStatuses(r) {
        let { hasError: n, thrownError: i, isStopped: o } = this
        n ? r.error(i) : o && r.complete()
      }
      asObservable() {
        let r = new k()
        return (r.source = this), r
      }
    }
    return (e.create = (t, r) => new ni(t, r)), e
  })(),
  ni = class extends se {
    constructor(t, r) {
      super(), (this.destination = t), (this.source = r)
    }
    next(t) {
      var r, n
      ;(n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.next) ===
        null ||
        n === void 0 ||
        n.call(r, t)
    }
    error(t) {
      var r, n
      ;(n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.error) ===
        null ||
        n === void 0 ||
        n.call(r, t)
    }
    complete() {
      var t, r
      ;(r =
        (t = this.destination) === null || t === void 0
          ? void 0
          : t.complete) === null ||
        r === void 0 ||
        r.call(t)
    }
    _subscribe(t) {
      var r, n
      return (n =
        (r = this.source) === null || r === void 0
          ? void 0
          : r.subscribe(t)) !== null && n !== void 0
        ? n
        : rs
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
    let r = super._subscribe(t)
    return !r.closed && t.next(this._value), r
  }
  getValue() {
    let { hasError: t, thrownError: r, _value: n } = this
    if (t) throw r
    return this._throwIfClosed(), n
  }
  next(t) {
    super.next((this._value = t))
  }
}
var ve = new k((e) => e.complete())
function Lc(e) {
  return e && _(e.schedule)
}
function Vc(e) {
  return e[e.length - 1]
}
function ri(e) {
  return _(Vc(e)) ? e.pop() : void 0
}
function it(e) {
  return Lc(Vc(e)) ? e.pop() : void 0
}
function Uc(e, t, r, n) {
  function i(o) {
    return o instanceof r
      ? o
      : new r(function (s) {
          s(o)
        })
  }
  return new (r || (r = Promise))(function (o, s) {
    function a(l) {
      try {
        c(n.next(l))
      } catch (d) {
        s(d)
      }
    }
    function u(l) {
      try {
        c(n.throw(l))
      } catch (d) {
        s(d)
      }
    }
    function c(l) {
      l.done ? o(l.value) : i(l.value).then(a, u)
    }
    c((n = n.apply(e, t || [])).next())
  })
}
function jc(e) {
  var t = typeof Symbol == 'function' && Symbol.iterator,
    r = t && e[t],
    n = 0
  if (r) return r.call(e)
  if (e && typeof e.length == 'number')
    return {
      next: function () {
        return (
          e && n >= e.length && (e = void 0), { value: e && e[n++], done: !e }
        )
      },
    }
  throw new TypeError(
    t ? 'Object is not iterable.' : 'Symbol.iterator is not defined.',
  )
}
function Et(e) {
  return this instanceof Et ? ((this.v = e), this) : new Et(e)
}
function $c(e, t, r) {
  if (!Symbol.asyncIterator)
    throw new TypeError('Symbol.asyncIterator is not defined.')
  var n = r.apply(e, t || []),
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
    n[f] &&
      (i[f] = function (h) {
        return new Promise(function (m, b) {
          o.push([f, h, m, b]) > 1 || a(f, h)
        })
      })
  }
  function a(f, h) {
    try {
      u(n[f](h))
    } catch (m) {
      d(o[0][3], m)
    }
  }
  function u(f) {
    f.value instanceof Et
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
function Bc(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError('Symbol.asyncIterator is not defined.')
  var t = e[Symbol.asyncIterator],
    r
  return t
    ? t.call(e)
    : ((e = typeof jc == 'function' ? jc(e) : e[Symbol.iterator]()),
      (r = {}),
      n('next'),
      n('throw'),
      n('return'),
      (r[Symbol.asyncIterator] = function () {
        return this
      }),
      r)
  function n(o) {
    r[o] =
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
  return _(e[Xt])
}
function ai(e) {
  return Symbol.asyncIterator && _(e?.[Symbol.asyncIterator])
}
function ui(e) {
  return new TypeError(
    `You provided ${e !== null && typeof e == 'object' ? 'an invalid object' : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  )
}
function Rp() {
  return typeof Symbol != 'function' || !Symbol.iterator
    ? '@@iterator'
    : Symbol.iterator
}
var ci = Rp()
function li(e) {
  return _(e?.[ci])
}
function di(e) {
  return $c(this, arguments, function* () {
    let r = e.getReader()
    try {
      for (;;) {
        let { value: n, done: i } = yield Et(r.read())
        if (i) return yield Et(void 0)
        yield yield Et(n)
      }
    } finally {
      r.releaseLock()
    }
  })
}
function fi(e) {
  return _(e?.getReader)
}
function W(e) {
  if (e instanceof k) return e
  if (e != null) {
    if (si(e)) return Op(e)
    if (ii(e)) return Fp(e)
    if (oi(e)) return Pp(e)
    if (ai(e)) return Hc(e)
    if (li(e)) return kp(e)
    if (fi(e)) return Lp(e)
  }
  throw ui(e)
}
function Op(e) {
  return new k((t) => {
    let r = e[Xt]()
    if (_(r.subscribe)) return r.subscribe(t)
    throw new TypeError(
      'Provided object does not correctly implement Symbol.observable',
    )
  })
}
function Fp(e) {
  return new k((t) => {
    for (let r = 0; r < e.length && !t.closed; r++) t.next(e[r])
    t.complete()
  })
}
function Pp(e) {
  return new k((t) => {
    e.then(
      (r) => {
        t.closed || (t.next(r), t.complete())
      },
      (r) => t.error(r),
    ).then(null, ei)
  })
}
function kp(e) {
  return new k((t) => {
    for (let r of e) if ((t.next(r), t.closed)) return
    t.complete()
  })
}
function Hc(e) {
  return new k((t) => {
    Vp(e, t).catch((r) => t.error(r))
  })
}
function Lp(e) {
  return Hc(di(e))
}
function Vp(e, t) {
  var r, n, i, o
  return Uc(this, void 0, void 0, function* () {
    try {
      for (r = Bc(e); (n = yield r.next()), !n.done; ) {
        let s = n.value
        if ((t.next(s), t.closed)) return
      }
    } catch (s) {
      i = { error: s }
    } finally {
      try {
        n && !n.done && (o = r.return) && (yield o.call(r))
      } finally {
        if (i) throw i.error
      }
    }
    t.complete()
  })
}
function de(e, t, r, n = 0, i = !1) {
  let o = t.schedule(function () {
    r(), i ? e.add(this.schedule(null, n)) : this.unsubscribe()
  }, n)
  if ((e.add(o), !i)) return o
}
function hi(e, t = 0) {
  return F((r, n) => {
    r.subscribe(
      N(
        n,
        (i) => de(n, e, () => n.next(i), t),
        () => de(n, e, () => n.complete(), t),
        (i) => de(n, e, () => n.error(i), t),
      ),
    )
  })
}
function pi(e, t = 0) {
  return F((r, n) => {
    n.add(e.schedule(() => r.subscribe(n), t))
  })
}
function zc(e, t) {
  return W(e).pipe(pi(t), hi(t))
}
function Gc(e, t) {
  return W(e).pipe(pi(t), hi(t))
}
function qc(e, t) {
  return new k((r) => {
    let n = 0
    return t.schedule(function () {
      n === e.length
        ? r.complete()
        : (r.next(e[n++]), r.closed || this.schedule())
    })
  })
}
function Wc(e, t) {
  return new k((r) => {
    let n
    return (
      de(r, t, () => {
        ;(n = e[ci]()),
          de(
            r,
            t,
            () => {
              let i, o
              try {
                ;({ value: i, done: o } = n.next())
              } catch (s) {
                r.error(s)
                return
              }
              o ? r.complete() : r.next(i)
            },
            0,
            !0,
          )
      }),
      () => _(n?.return) && n.return()
    )
  })
}
function gi(e, t) {
  if (!e) throw new Error('Iterable cannot be null')
  return new k((r) => {
    de(r, t, () => {
      let n = e[Symbol.asyncIterator]()
      de(
        r,
        t,
        () => {
          n.next().then((i) => {
            i.done ? r.complete() : r.next(i.value)
          })
        },
        0,
        !0,
      )
    })
  })
}
function Zc(e, t) {
  return gi(di(e), t)
}
function Yc(e, t) {
  if (e != null) {
    if (si(e)) return zc(e, t)
    if (ii(e)) return qc(e, t)
    if (oi(e)) return Gc(e, t)
    if (ai(e)) return gi(e, t)
    if (li(e)) return Wc(e, t)
    if (fi(e)) return Zc(e, t)
  }
  throw ui(e)
}
function H(e, t) {
  return t ? Yc(e, t) : W(e)
}
function I(...e) {
  let t = it(e)
  return H(e, t)
}
function nn(e, t) {
  let r = _(e) ? e : () => e,
    n = (i) => i.error(r())
  return new k(t ? (i) => t.schedule(n, 0, i) : n)
}
function fs(e) {
  return !!e && (e instanceof k || (_(e.lift) && _(e.subscribe)))
}
var Ze = Yt(
  (e) =>
    function () {
      e(this),
        (this.name = 'EmptyError'),
        (this.message = 'no elements in sequence')
    },
)
function M(e, t) {
  return F((r, n) => {
    let i = 0
    r.subscribe(
      N(n, (o) => {
        n.next(e.call(t, o, i++))
      }),
    )
  })
}
var { isArray: jp } = Array
function Up(e, t) {
  return jp(t) ? e(...t) : e(t)
}
function mi(e) {
  return M((t) => Up(e, t))
}
var { isArray: $p } = Array,
  { getPrototypeOf: Bp, prototype: Hp, keys: zp } = Object
function vi(e) {
  if (e.length === 1) {
    let t = e[0]
    if ($p(t)) return { args: t, keys: null }
    if (Gp(t)) {
      let r = zp(t)
      return { args: r.map((n) => t[n]), keys: r }
    }
  }
  return { args: e, keys: null }
}
function Gp(e) {
  return e && typeof e == 'object' && Bp(e) === Hp
}
function yi(e, t) {
  return e.reduce((r, n, i) => ((r[n] = t[i]), r), {})
}
function Di(...e) {
  let t = it(e),
    r = ri(e),
    { args: n, keys: i } = vi(e)
  if (n.length === 0) return H([], t)
  let o = new k(qp(n, t, i ? (s) => yi(i, s) : me))
  return r ? o.pipe(mi(r)) : o
}
function qp(e, t, r = me) {
  return (n) => {
    Qc(
      t,
      () => {
        let { length: i } = e,
          o = new Array(i),
          s = i,
          a = i
        for (let u = 0; u < i; u++)
          Qc(
            t,
            () => {
              let c = H(e[u], t),
                l = !1
              c.subscribe(
                N(
                  n,
                  (d) => {
                    ;(o[u] = d), l || ((l = !0), a--), a || n.next(r(o.slice()))
                  },
                  () => {
                    --s || n.complete()
                  },
                ),
              )
            },
            n,
          )
      },
      n,
    )
  }
}
function Qc(e, t, r) {
  e ? de(r, e, t) : t()
}
function Kc(e, t, r, n, i, o, s, a) {
  let u = [],
    c = 0,
    l = 0,
    d = !1,
    f = () => {
      d && !u.length && !c && t.complete()
    },
    h = (b) => (c < n ? m(b) : u.push(b)),
    m = (b) => {
      o && t.next(b), c++
      let y = !1
      W(r(b, l++)).subscribe(
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
                for (c--; u.length && c < n; ) {
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
function Y(e, t, r = 1 / 0) {
  return _(t)
    ? Y((n, i) => M((o, s) => t(n, o, i, s))(W(e(n, i))), r)
    : (typeof t == 'number' && (r = t), F((n, i) => Kc(n, i, e, r)))
}
function hs(e = 1 / 0) {
  return Y(me, e)
}
function Jc() {
  return hs(1)
}
function rn(...e) {
  return Jc()(H(e, it(e)))
}
function wi(e) {
  return new k((t) => {
    W(e()).subscribe(t)
  })
}
function ps(...e) {
  let t = ri(e),
    { args: r, keys: n } = vi(e),
    i = new k((o) => {
      let { length: s } = r
      if (!s) {
        o.complete()
        return
      }
      let a = new Array(s),
        u = s,
        c = s
      for (let l = 0; l < s; l++) {
        let d = !1
        W(r[l]).subscribe(
          N(
            o,
            (f) => {
              d || ((d = !0), c--), (a[l] = f)
            },
            () => u--,
            void 0,
            () => {
              ;(!u || !d) && (c || o.next(n ? yi(n, a) : a), o.complete())
            },
          ),
        )
      }
    })
  return t ? i.pipe(mi(t)) : i
}
function ye(e, t) {
  return F((r, n) => {
    let i = 0
    r.subscribe(N(n, (o) => e.call(t, o, i++) && n.next(o)))
  })
}
function Ae(e) {
  return F((t, r) => {
    let n = null,
      i = !1,
      o
    ;(n = t.subscribe(
      N(r, void 0, void 0, (s) => {
        ;(o = W(e(s, Ae(e)(t)))),
          n ? (n.unsubscribe(), (n = null), o.subscribe(r)) : (i = !0)
      }),
    )),
      i && (n.unsubscribe(), (n = null), o.subscribe(r))
  })
}
function Xc(e, t, r, n, i) {
  return (o, s) => {
    let a = r,
      u = t,
      c = 0
    o.subscribe(
      N(
        s,
        (l) => {
          let d = c++
          ;(u = a ? e(u, l, d) : ((a = !0), l)), n && s.next(u)
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
  return F((t, r) => {
    let n = !1
    t.subscribe(
      N(
        r,
        (i) => {
          ;(n = !0), r.next(i)
        },
        () => {
          n || r.next(e), r.complete()
        },
      ),
    )
  })
}
function Ye(e) {
  return e <= 0
    ? () => ve
    : F((t, r) => {
        let n = 0
        t.subscribe(
          N(r, (i) => {
            ++n <= e && (r.next(i), e <= n && r.complete())
          }),
        )
      })
}
function gs(e) {
  return M(() => e)
}
function Ci(e = Wp) {
  return F((t, r) => {
    let n = !1
    t.subscribe(
      N(
        r,
        (i) => {
          ;(n = !0), r.next(i)
        },
        () => (n ? r.complete() : r.error(e())),
      ),
    )
  })
}
function Wp() {
  return new Ze()
}
function It(e) {
  return F((t, r) => {
    try {
      t.subscribe(r)
    } finally {
      r.add(e)
    }
  })
}
function Le(e, t) {
  let r = arguments.length >= 2
  return (n) =>
    n.pipe(
      e ? ye((i, o) => e(i, o, n)) : me,
      Ye(1),
      r ? st(t) : Ci(() => new Ze()),
    )
}
function on(e) {
  return e <= 0
    ? () => ve
    : F((t, r) => {
        let n = []
        t.subscribe(
          N(
            r,
            (i) => {
              n.push(i), e < n.length && n.shift()
            },
            () => {
              for (let i of n) r.next(i)
              r.complete()
            },
            void 0,
            () => {
              n = null
            },
          ),
        )
      })
}
function ms(e, t) {
  let r = arguments.length >= 2
  return (n) =>
    n.pipe(
      e ? ye((i, o) => e(i, o, n)) : me,
      on(1),
      r ? st(t) : Ci(() => new Ze()),
    )
}
function vs(e, t) {
  return F(Xc(e, t, arguments.length >= 2, !0))
}
function ys(...e) {
  let t = it(e)
  return F((r, n) => {
    ;(t ? rn(e, r, t) : rn(e, r)).subscribe(n)
  })
}
function De(e, t) {
  return F((r, n) => {
    let i = null,
      o = 0,
      s = !1,
      a = () => s && !i && n.complete()
    r.subscribe(
      N(
        n,
        (u) => {
          i?.unsubscribe()
          let c = 0,
            l = o++
          W(e(u, l)).subscribe(
            (i = N(
              n,
              (d) => n.next(t ? t(u, d, l, c++) : d),
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
function Ds(e) {
  return F((t, r) => {
    W(e).subscribe(N(r, () => r.complete(), Zn)), !r.closed && t.subscribe(r)
  })
}
function G(e, t, r) {
  let n = _(e) || t || r ? { next: e, error: t, complete: r } : e
  return n
    ? F((i, o) => {
        var s
        ;(s = n.subscribe) === null || s === void 0 || s.call(n)
        let a = !0
        i.subscribe(
          N(
            o,
            (u) => {
              var c
              ;(c = n.next) === null || c === void 0 || c.call(n, u), o.next(u)
            },
            () => {
              var u
              ;(a = !1),
                (u = n.complete) === null || u === void 0 || u.call(n),
                o.complete()
            },
            (u) => {
              var c
              ;(a = !1),
                (c = n.error) === null || c === void 0 || c.call(n, u),
                o.error(u)
            },
            () => {
              var u, c
              a && ((u = n.unsubscribe) === null || u === void 0 || u.call(n)),
                (c = n.finalize) === null || c === void 0 || c.call(n)
            },
          ),
        )
      })
    : me
}
var Yp = 'https://g.co/ng/security#xss',
  w = class extends Error {
    constructor(t, r) {
      super(Wi(t, r)), (this.code = t)
    }
  }
function Wi(e, t) {
  return `${`NG0${Math.abs(e)}`}${t ? ': ' + t : ''}`
}
function Zi(e) {
  return { toString: e }.toString()
}
var Yn = globalThis
function V(e) {
  for (let t in e) if (e[t] === V) return t
  throw Error('Could not find renamed property on target object.')
}
function Qp(e, t) {
  for (let r in t) t.hasOwnProperty(r) && !e.hasOwnProperty(r) && (e[r] = t[r])
}
function fe(e) {
  if (typeof e == 'string') return e
  if (Array.isArray(e)) return '[' + e.map(fe).join(', ') + ']'
  if (e == null) return '' + e
  if (e.overriddenName) return `${e.overriddenName}`
  if (e.name) return `${e.name}`
  let t = e.toString()
  if (t == null) return '' + t
  let r = t.indexOf(`
`)
  return r === -1 ? t : t.substring(0, r)
}
function el(e, t) {
  return e == null || e === ''
    ? t === null
      ? ''
      : t
    : t == null || t === ''
      ? e
      : e + ' ' + t
}
var Kp = V({ __forward_ref__: V })
function wn(e) {
  return (
    (e.__forward_ref__ = wn),
    (e.toString = function () {
      return fe(this())
    }),
    e
  )
}
function ae(e) {
  return Pl(e) ? e() : e
}
function Pl(e) {
  return (
    typeof e == 'function' && e.hasOwnProperty(Kp) && e.__forward_ref__ === wn
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
function Ot(e) {
  return { providers: e.providers || [], imports: e.imports || [] }
}
function Yi(e) {
  return tl(e, Ll) || tl(e, Vl)
}
function kl(e) {
  return Yi(e) !== null
}
function tl(e, t) {
  return e.hasOwnProperty(t) ? e[t] : null
}
function Jp(e) {
  let t = e && (e[Ll] || e[Vl])
  return t || null
}
function nl(e) {
  return e && (e.hasOwnProperty(rl) || e.hasOwnProperty(Xp)) ? e[rl] : null
}
var Ll = V({ ɵprov: V }),
  rl = V({ ɵinj: V }),
  Vl = V({ ngInjectableDef: V }),
  Xp = V({ ngInjectorDef: V }),
  C = class {
    constructor(t, r) {
      ;(this._desc = t),
        (this.ngMetadataName = 'InjectionToken'),
        (this.ɵprov = void 0),
        typeof r == 'number'
          ? (this.__NG_ELEMENT_ID__ = r)
          : r !== void 0 &&
            (this.ɵprov = D({
              token: this,
              providedIn: r.providedIn || 'root',
              factory: r.factory,
            }))
    }
    get multi() {
      return this
    }
    toString() {
      return `InjectionToken ${this._desc}`
    }
  }
function jl(e) {
  return e && !!e.ɵproviders
}
var eg = V({ ɵcmp: V }),
  tg = V({ ɵdir: V }),
  ng = V({ ɵpipe: V }),
  rg = V({ ɵmod: V }),
  Ai = V({ ɵfac: V }),
  Qn = V({ __NG_ELEMENT_ID__: V }),
  il = V({ __NG_ENV_ID__: V })
function Ul(e) {
  return typeof e == 'string' ? e : e == null ? '' : String(e)
}
function ig(e) {
  return typeof e == 'function'
    ? e.name || e.toString()
    : typeof e == 'object' && e != null && typeof e.type == 'function'
      ? e.type.name || e.type.toString()
      : Ul(e)
}
function og(e, t) {
  let r = t ? `. Dependency path: ${t.join(' > ')} > ${e}` : ''
  throw new w(-200, e)
}
function ba(e, t) {
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
  ks
function $l() {
  return ks
}
function Ee(e) {
  let t = ks
  return (ks = e), t
}
function Bl(e, t, r) {
  let n = Yi(e)
  if (n && n.providedIn == 'root')
    return n.value === void 0 ? (n.value = n.factory()) : n.value
  if (r & x.Optional) return null
  if (t !== void 0) return t
  ba(e, 'Injector')
}
var sg = {},
  Kn = sg,
  ag = '__NG_DI_FLAG__',
  xi = 'ngTempTokenPath',
  ug = 'ngTokenPath',
  cg = /\n/gm,
  lg = '\u0275',
  ol = '__source',
  cn
function dg() {
  return cn
}
function at(e) {
  let t = cn
  return (cn = e), t
}
function fg(e, t = x.Default) {
  if (cn === void 0) throw new w(-203, !1)
  return cn === null
    ? Bl(e, void 0, t)
    : cn.get(e, t & x.Optional ? null : void 0, t)
}
function S(e, t = x.Default) {
  return ($l() || fg)(ae(e), t)
}
function p(e, t = x.Default) {
  return S(e, Qi(t))
}
function Qi(e) {
  return typeof e > 'u' || typeof e == 'number'
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4)
}
function Ls(e) {
  let t = []
  for (let r = 0; r < e.length; r++) {
    let n = ae(e[r])
    if (Array.isArray(n)) {
      if (n.length === 0) throw new w(900, !1)
      let i,
        o = x.Default
      for (let s = 0; s < n.length; s++) {
        let a = n[s],
          u = hg(a)
        typeof u == 'number' ? (u === -1 ? (i = a.token) : (o |= u)) : (i = a)
      }
      t.push(S(i, o))
    } else t.push(S(n))
  }
  return t
}
function hg(e) {
  return e[ag]
}
function pg(e, t, r, n) {
  let i = e[xi]
  throw (
    (t[ol] && i.unshift(t[ol]),
    (e.message = gg(
      `
` + e.message,
      i,
      r,
      n,
    )),
    (e[ug] = i),
    (e[xi] = null),
    e)
  )
}
function gg(e, t, r, n = null) {
  e =
    e &&
    e.charAt(0) ===
      `
` &&
    e.charAt(1) == lg
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
  return `${r}${n ? '(' + n + ')' : ''}[${i}]: ${e.replace(
    cg,
    `
  `,
  )}`
}
function dn(e, t) {
  let r = e.hasOwnProperty(Ai)
  return r ? e[Ai] : null
}
function Ma(e, t) {
  e.forEach((r) => (Array.isArray(r) ? Ma(r, t) : t(r)))
}
function Hl(e, t, r) {
  t >= e.length ? e.push(r) : e.splice(t, 0, r)
}
function Ni(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0]
}
function mg(e, t, r, n) {
  let i = e.length
  if (i == t) e.push(r, n)
  else if (i === 1) e.push(n, e[0]), (e[0] = r)
  else {
    for (i--, e.push(e[i - 1], e[i]); i > t; ) {
      let o = i - 2
      ;(e[i] = e[o]), i--
    }
    ;(e[t] = r), (e[t + 1] = n)
  }
}
function vg(e, t, r) {
  let n = hr(e, t)
  return n >= 0 ? (e[n | 1] = r) : ((n = ~n), mg(e, n, t, r)), n
}
function ws(e, t) {
  let r = hr(e, t)
  if (r >= 0) return e[r | 1]
}
function hr(e, t) {
  return yg(e, t, 1)
}
function yg(e, t, r) {
  let n = 0,
    i = e.length >> r
  for (; i !== n; ) {
    let o = n + ((i - n) >> 1),
      s = e[o << r]
    if (t === s) return o << r
    s > t ? (i = o) : (n = o + 1)
  }
  return ~(i << r)
}
var fn = {},
  Ie = [],
  hn = new C(''),
  zl = new C('', -1),
  Gl = new C(''),
  Ri = class {
    get(t, r = Kn) {
      if (r === Kn) {
        let n = new Error(`NullInjectorError: No provider for ${fe(t)}!`)
        throw ((n.name = 'NullInjectorError'), n)
      }
      return r
    }
  },
  ql = (function (e) {
    return (e[(e.OnPush = 0)] = 'OnPush'), (e[(e.Default = 1)] = 'Default'), e
  })(ql || {}),
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
function Dg(e, t, r) {
  let n = e.length
  for (;;) {
    let i = e.indexOf(t, r)
    if (i === -1) return i
    if (i === 0 || e.charCodeAt(i - 1) <= 32) {
      let o = t.length
      if (i + o === n || e.charCodeAt(i + o) <= 32) return i
    }
    r = i + 1
  }
}
function Vs(e, t, r) {
  let n = 0
  for (; n < r.length; ) {
    let i = r[n]
    if (typeof i == 'number') {
      if (i !== 0) break
      n++
      let o = r[n++],
        s = r[n++],
        a = r[n++]
      e.setAttribute(t, s, a, o)
    } else {
      let o = i,
        s = r[++n]
      Cg(o) ? e.setProperty(t, o, s) : e.setAttribute(t, o, s), n++
    }
  }
  return n
}
function wg(e) {
  return e === 3 || e === 4 || e === 6
}
function Cg(e) {
  return e.charCodeAt(0) === 64
}
function Jn(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice()
    else {
      let r = -1
      for (let n = 0; n < t.length; n++) {
        let i = t[n]
        typeof i == 'number'
          ? (r = i)
          : r === 0 ||
            (r === -1 || r === 2
              ? sl(e, r, i, null, t[++n])
              : sl(e, r, i, null, null))
      }
    }
  return e
}
function sl(e, t, r, n, i) {
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
    if (a === r) {
      if (n === null) {
        i !== null && (e[o + 1] = i)
        return
      } else if (n === e[o + 1]) {
        e[o + 2] = i
        return
      }
    }
    o++, n !== null && o++, i !== null && o++
  }
  s !== -1 && (e.splice(s, 0, t), (o = s + 1)),
    e.splice(o++, 0, r),
    n !== null && e.splice(o++, 0, n),
    i !== null && e.splice(o++, 0, i)
}
var Wl = 'ng-template'
function Eg(e, t, r, n) {
  let i = 0
  if (n) {
    for (; i < t.length && typeof t[i] == 'string'; i += 2)
      if (t[i] === 'class' && Dg(t[i + 1].toLowerCase(), r, 0) !== -1) return !0
  } else if (_a(e)) return !1
  if (((i = t.indexOf(1, i)), i > -1)) {
    let o
    for (; ++i < t.length && typeof (o = t[i]) == 'string'; )
      if (o.toLowerCase() === r) return !0
  }
  return !1
}
function _a(e) {
  return e.type === 4 && e.value !== Wl
}
function Ig(e, t, r) {
  let n = e.type === 4 && !r ? Wl : e.value
  return t === n
}
function bg(e, t, r) {
  let n = 4,
    i = e.attrs,
    o = i !== null ? Sg(i) : 0,
    s = !1
  for (let a = 0; a < t.length; a++) {
    let u = t[a]
    if (typeof u == 'number') {
      if (!s && !xe(n) && !xe(u)) return !1
      if (s && xe(u)) continue
      ;(s = !1), (n = u | (n & 1))
      continue
    }
    if (!s)
      if (n & 4) {
        if (
          ((n = 2 | (n & 1)),
          (u !== '' && !Ig(e, u, r)) || (u === '' && t.length === 1))
        ) {
          if (xe(n)) return !1
          s = !0
        }
      } else if (n & 8) {
        if (i === null || !Eg(e, i, u, r)) {
          if (xe(n)) return !1
          s = !0
        }
      } else {
        let c = t[++a],
          l = Mg(u, i, _a(e), r)
        if (l === -1) {
          if (xe(n)) return !1
          s = !0
          continue
        }
        if (c !== '') {
          let d
          if (
            (l > o ? (d = '') : (d = i[l + 1].toLowerCase()), n & 2 && c !== d)
          ) {
            if (xe(n)) return !1
            s = !0
          }
        }
      }
  }
  return xe(n) || s
}
function xe(e) {
  return (e & 1) === 0
}
function Mg(e, t, r, n) {
  if (t === null) return -1
  let i = 0
  if (n || !r) {
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
  } else return Tg(t, e)
}
function _g(e, t, r = !1) {
  for (let n = 0; n < t.length; n++) if (bg(e, t[n], r)) return !0
  return !1
}
function Sg(e) {
  for (let t = 0; t < e.length; t++) {
    let r = e[t]
    if (wg(r)) return t
  }
  return e.length
}
function Tg(e, t) {
  let r = e.indexOf(4)
  if (r > -1)
    for (r++; r < e.length; ) {
      let n = e[r]
      if (typeof n == 'number') return -1
      if (n === t) return r
      r++
    }
  return -1
}
function al(e, t) {
  return e ? ':not(' + t.trim() + ')' : t
}
function Ag(e) {
  let t = e[0],
    r = 1,
    n = 2,
    i = '',
    o = !1
  for (; r < e.length; ) {
    let s = e[r]
    if (typeof s == 'string')
      if (n & 2) {
        let a = e[++r]
        i += '[' + s + (a.length > 0 ? '="' + a + '"' : '') + ']'
      } else n & 8 ? (i += '.' + s) : n & 4 && (i += ' ' + s)
    else
      i !== '' && !xe(s) && ((t += al(o, i)), (i = '')),
        (n = s),
        (o = o || !xe(n))
    r++
  }
  return i !== '' && (t += al(o, i)), t
}
function xg(e) {
  return e.map(Ag).join(',')
}
function Ng(e) {
  let t = [],
    r = [],
    n = 1,
    i = 2
  for (; n < e.length; ) {
    let o = e[n]
    if (typeof o == 'string')
      i === 2 ? o !== '' && t.push(o, e[++n]) : i === 8 && r.push(o)
    else {
      if (!xe(i)) break
      i = o
    }
    n++
  }
  return { attrs: t, classes: r }
}
function dt(e) {
  return Zi(() => {
    let t = Jl(e),
      r = R(g({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === ql.OnPush,
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
    Xl(r)
    let n = e.dependencies
    return (
      (r.directiveDefs = cl(n, !1)), (r.pipeDefs = cl(n, !0)), (r.id = Fg(r)), r
    )
  })
}
function Rg(e) {
  return _t(e) || Zl(e)
}
function Og(e) {
  return e !== null
}
function Ft(e) {
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
function ul(e, t) {
  if (e == null) return fn
  let r = {}
  for (let n in e)
    if (e.hasOwnProperty(n)) {
      let i = e[n],
        o,
        s,
        a = be.None
      Array.isArray(i)
        ? ((a = i[0]), (o = i[1]), (s = i[2] ?? o))
        : ((o = i), (s = i)),
        t ? ((r[o] = a !== be.None ? [n, a] : n), (t[o] = s)) : (r[o] = n)
    }
  return r
}
function He(e) {
  return Zi(() => {
    let t = Jl(e)
    return Xl(t), t
  })
}
function _t(e) {
  return e[eg] || null
}
function Zl(e) {
  return e[tg] || null
}
function Yl(e) {
  return e[ng] || null
}
function Ql(e) {
  let t = _t(e) || Zl(e) || Yl(e)
  return t !== null ? t.standalone : !1
}
function Kl(e, t) {
  let r = e[rg] || null
  if (!r && t === !0)
    throw new Error(`Type ${fe(e)} does not have '\u0275mod' property.`)
  return r
}
function Jl(e) {
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
    inputConfig: e.inputs || fn,
    exportAs: e.exportAs || null,
    standalone: e.standalone === !0,
    signals: e.signals === !0,
    selectors: e.selectors || Ie,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: ul(e.inputs, t),
    outputs: ul(e.outputs),
    debugInfo: null,
  }
}
function Xl(e) {
  e.features?.forEach((t) => t(e))
}
function cl(e, t) {
  if (!e) return null
  let r = t ? Yl : Rg
  return () => (typeof e == 'function' ? e() : e).map((n) => r(n)).filter(Og)
}
function Fg(e) {
  let t = 0,
    r = [
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
  for (let i of r) t = (Math.imul(31, t) + i.charCodeAt(0)) << 0
  return (t += 2147483648), 'c' + t
}
function Cn(e) {
  return { ɵproviders: e }
}
function Pg(...e) {
  return { ɵproviders: ed(!0, e), ɵfromNgModule: !0 }
}
function ed(e, ...t) {
  let r = [],
    n = new Set(),
    i,
    o = (s) => {
      r.push(s)
    }
  return (
    Ma(t, (s) => {
      let a = s
      js(a, o, [], n) && ((i ||= []), i.push(a))
    }),
    i !== void 0 && td(i, o),
    r
  )
}
function td(e, t) {
  for (let r = 0; r < e.length; r++) {
    let { ngModule: n, providers: i } = e[r]
    Sa(i, (o) => {
      t(o, n)
    })
  }
}
function js(e, t, r, n) {
  if (((e = ae(e)), !e)) return !1
  let i = null,
    o = nl(e),
    s = !o && _t(e)
  if (!o && !s) {
    let u = e.ngModule
    if (((o = nl(u)), o)) i = u
    else return !1
  } else {
    if (s && !s.standalone) return !1
    i = e
  }
  let a = n.has(i)
  if (s) {
    if (a) return !1
    if ((n.add(i), s.dependencies)) {
      let u =
        typeof s.dependencies == 'function' ? s.dependencies() : s.dependencies
      for (let c of u) js(c, t, r, n)
    }
  } else if (o) {
    if (o.imports != null && !a) {
      n.add(i)
      let c
      try {
        Ma(o.imports, (l) => {
          js(l, t, r, n) && ((c ||= []), c.push(l))
        })
      } finally {
      }
      c !== void 0 && td(c, t)
    }
    if (!a) {
      let c = dn(i) || (() => new i())
      t({ provide: i, useFactory: c, deps: Ie }, i),
        t({ provide: Gl, useValue: i, multi: !0 }, i),
        t({ provide: hn, useValue: () => S(i), multi: !0 }, i)
    }
    let u = o.providers
    if (u != null && !a) {
      let c = e
      Sa(u, (l) => {
        t(l, c)
      })
    }
  } else return !1
  return i !== e && e.providers !== void 0
}
function Sa(e, t) {
  for (let r of e)
    jl(r) && (r = r.ɵproviders), Array.isArray(r) ? Sa(r, t) : t(r)
}
var kg = V({ provide: String, useValue: V })
function nd(e) {
  return e !== null && typeof e == 'object' && kg in e
}
function Lg(e) {
  return !!(e && e.useExisting)
}
function Vg(e) {
  return !!(e && e.useFactory)
}
function pn(e) {
  return typeof e == 'function'
}
function jg(e) {
  return !!e.useClass
}
var Ki = new C(''),
  bi = {},
  Ug = {},
  Cs
function Ta() {
  return Cs === void 0 && (Cs = new Ri()), Cs
}
var he = class {},
  Xn = class extends he {
    get destroyed() {
      return this._destroyed
    }
    constructor(t, r, n, i) {
      super(),
        (this.parent = r),
        (this.source = n),
        (this.scopes = i),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        $s(t, (s) => this.processProvider(s)),
        this.records.set(zl, sn(void 0, this)),
        i.has('environment') && this.records.set(he, sn(void 0, this))
      let o = this.records.get(Ki)
      o != null && typeof o.value == 'string' && this.scopes.add(o.value),
        (this.injectorDefTypes = new Set(this.get(Gl, Ie, x.Self)))
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0)
      let t = O(null)
      try {
        for (let n of this._ngOnDestroyHooks) n.ngOnDestroy()
        let r = this._onDestroyHooks
        this._onDestroyHooks = []
        for (let n of r) n()
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
      let r = at(this),
        n = Ee(void 0),
        i
      try {
        return t()
      } finally {
        at(r), Ee(n)
      }
    }
    get(t, r = Kn, n = x.Default) {
      if ((this.assertNotDestroyed(), t.hasOwnProperty(il))) return t[il](this)
      n = Qi(n)
      let i,
        o = at(this),
        s = Ee(void 0)
      try {
        if (!(n & x.SkipSelf)) {
          let u = this.records.get(t)
          if (u === void 0) {
            let c = Gg(t) && Yi(t)
            c && this.injectableDefInScope(c)
              ? (u = sn(Us(t), bi))
              : (u = null),
              this.records.set(t, u)
          }
          if (u != null) return this.hydrate(t, u)
        }
        let a = n & x.Self ? Ta() : this.parent
        return (r = n & x.Optional && r === Kn ? null : r), a.get(t, r)
      } catch (a) {
        if (a.name === 'NullInjectorError') {
          if (((a[xi] = a[xi] || []).unshift(fe(t)), o)) throw a
          return pg(a, t, 'R3InjectorError', this.source)
        } else throw a
      } finally {
        Ee(s), at(o)
      }
    }
    resolveInjectorInitializers() {
      let t = O(null),
        r = at(this),
        n = Ee(void 0),
        i
      try {
        let o = this.get(hn, Ie, x.Self)
        for (let s of o) s()
      } finally {
        at(r), Ee(n), O(t)
      }
    }
    toString() {
      let t = [],
        r = this.records
      for (let n of r.keys()) t.push(fe(n))
      return `R3Injector[${t.join(', ')}]`
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new w(205, !1)
    }
    processProvider(t) {
      t = ae(t)
      let r = pn(t) ? t : ae(t && t.provide),
        n = Bg(t)
      if (!pn(t) && t.multi === !0) {
        let i = this.records.get(r)
        i ||
          ((i = sn(void 0, bi, !0)),
          (i.factory = () => Ls(i.multi)),
          this.records.set(r, i)),
          (r = t),
          i.multi.push(t)
      }
      this.records.set(r, n)
    }
    hydrate(t, r) {
      let n = O(null)
      try {
        return (
          r.value === bi && ((r.value = Ug), (r.value = r.factory())),
          typeof r.value == 'object' &&
            r.value &&
            zg(r.value) &&
            this._ngOnDestroyHooks.add(r.value),
          r.value
        )
      } finally {
        O(n)
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1
      let r = ae(t.providedIn)
      return typeof r == 'string'
        ? r === 'any' || this.scopes.has(r)
        : this.injectorDefTypes.has(r)
    }
    removeOnDestroy(t) {
      let r = this._onDestroyHooks.indexOf(t)
      r !== -1 && this._onDestroyHooks.splice(r, 1)
    }
  }
function Us(e) {
  let t = Yi(e),
    r = t !== null ? t.factory : dn(e)
  if (r !== null) return r
  if (e instanceof C) throw new w(204, !1)
  if (e instanceof Function) return $g(e)
  throw new w(204, !1)
}
function $g(e) {
  if (e.length > 0) throw new w(204, !1)
  let r = Jp(e)
  return r !== null ? () => r.factory(e) : () => new e()
}
function Bg(e) {
  if (nd(e)) return sn(void 0, e.useValue)
  {
    let t = rd(e)
    return sn(t, bi)
  }
}
function rd(e, t, r) {
  let n
  if (pn(e)) {
    let i = ae(e)
    return dn(i) || Us(i)
  } else if (nd(e)) n = () => ae(e.useValue)
  else if (Vg(e)) n = () => e.useFactory(...Ls(e.deps || []))
  else if (Lg(e)) n = () => S(ae(e.useExisting))
  else {
    let i = ae(e && (e.useClass || e.provide))
    if (Hg(e)) n = () => new i(...Ls(e.deps))
    else return dn(i) || Us(i)
  }
  return n
}
function sn(e, t, r = !1) {
  return { factory: e, value: t, multi: r ? [] : void 0 }
}
function Hg(e) {
  return !!e.deps
}
function zg(e) {
  return (
    e !== null && typeof e == 'object' && typeof e.ngOnDestroy == 'function'
  )
}
function Gg(e) {
  return typeof e == 'function' || (typeof e == 'object' && e instanceof C)
}
function $s(e, t) {
  for (let r of e)
    Array.isArray(r) ? $s(r, t) : r && jl(r) ? $s(r.ɵproviders, t) : t(r)
}
function Je(e, t) {
  e instanceof Xn && e.assertNotDestroyed()
  let r,
    n = at(e),
    i = Ee(void 0)
  try {
    return t()
  } finally {
    at(n), Ee(i)
  }
}
function qg() {
  return $l() !== void 0 || dg() != null
}
function Wg(e) {
  return typeof e == 'function'
}
var Xe = 0,
  A = 1,
  E = 2,
  re = 3,
  Ne = 4,
  Fe = 5,
  er = 6,
  tr = 7,
  ce = 8,
  gn = 9,
  $e = 10,
  K = 11,
  nr = 12,
  ll = 13,
  En = 14,
  Re = 15,
  Ji = 16,
  an = 17,
  mn = 18,
  Xi = 19,
  id = 20,
  ut = 21,
  Es = 22,
  St = 23,
  Oe = 25,
  od = 1
var Tt = 7,
  Oi = 8,
  Fi = 9,
  le = 10,
  Aa = (function (e) {
    return (
      (e[(e.None = 0)] = 'None'),
      (e[(e.HasTransplantedViews = 2)] = 'HasTransplantedViews'),
      e
    )
  })(Aa || {})
function bt(e) {
  return Array.isArray(e) && typeof e[od] == 'object'
}
function et(e) {
  return Array.isArray(e) && e[od] === !0
}
function sd(e) {
  return (e.flags & 4) !== 0
}
function eo(e) {
  return e.componentOffset > -1
}
function xa(e) {
  return (e.flags & 1) === 1
}
function ct(e) {
  return !!e.template
}
function Zg(e) {
  return (e[E] & 512) !== 0
}
var Bs = class {
  constructor(t, r, n) {
    ;(this.previousValue = t), (this.currentValue = r), (this.firstChange = n)
  }
  isFirstChange() {
    return this.firstChange
  }
}
function ad(e, t, r, n) {
  t !== null ? t.applyValueToInputSignal(t, n) : (e[r] = n)
}
function In() {
  return ud
}
function ud(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = Qg), Yg
}
In.ngInherit = !0
function Yg() {
  let e = ld(this),
    t = e?.current
  if (t) {
    let r = e.previous
    if (r === fn) e.previous = t
    else for (let n in t) r[n] = t[n]
    ;(e.current = null), this.ngOnChanges(t)
  }
}
function Qg(e, t, r, n, i) {
  let o = this.declaredInputs[n],
    s = ld(e) || Kg(e, { previous: fn, current: null }),
    a = s.current || (s.current = {}),
    u = s.previous,
    c = u[o]
  ;(a[o] = new Bs(c && c.currentValue, r, u === fn)), ad(e, t, i, r)
}
var cd = '__ngSimpleChanges__'
function ld(e) {
  return e[cd] || null
}
function Kg(e, t) {
  return (e[cd] = t)
}
var dl = null
var Ve = function (e, t, r) {
    dl?.(e, t, r)
  },
  Jg = 'svg',
  Xg = 'math',
  em = !1
function tm() {
  return em
}
function Be(e) {
  for (; Array.isArray(e); ) e = e[Xe]
  return e
}
function dd(e, t) {
  return Be(t[e])
}
function Pe(e, t) {
  return Be(t[e.index])
}
function Na(e, t) {
  return e.data[t]
}
function ft(e, t) {
  let r = t[e]
  return bt(r) ? r : r[Xe]
}
function Ra(e) {
  return (e[E] & 128) === 128
}
function nm(e) {
  return et(e[re])
}
function Pi(e, t) {
  return t == null ? null : e[t]
}
function fd(e) {
  e[an] = 0
}
function rm(e) {
  e[E] & 1024 || ((e[E] |= 1024), Ra(e) && rr(e))
}
function im(e, t) {
  for (; e > 0; ) (t = t[En]), e--
  return t
}
function Oa(e) {
  return !!(e[E] & 9216 || e[St]?.dirty)
}
function Hs(e) {
  e[$e].changeDetectionScheduler?.notify(1),
    Oa(e)
      ? rr(e)
      : e[E] & 64 &&
        (tm()
          ? ((e[E] |= 1024), rr(e))
          : e[$e].changeDetectionScheduler?.notify())
}
function rr(e) {
  e[$e].changeDetectionScheduler?.notify()
  let t = ir(e)
  for (; t !== null && !(t[E] & 8192 || ((t[E] |= 8192), !Ra(t))); ) t = ir(t)
}
function hd(e, t) {
  if ((e[E] & 256) === 256) throw new w(911, !1)
  e[ut] === null && (e[ut] = []), e[ut].push(t)
}
function om(e, t) {
  if (e[ut] === null) return
  let r = e[ut].indexOf(t)
  r !== -1 && e[ut].splice(r, 1)
}
function ir(e) {
  let t = e[re]
  return et(t) ? t[re] : t
}
var P = { lFrame: wd(null), bindingsEnabled: !0, skipHydrationRootTNode: null }
function sm() {
  return P.lFrame.elementDepthCount
}
function am() {
  P.lFrame.elementDepthCount++
}
function um() {
  P.lFrame.elementDepthCount--
}
function pd() {
  return P.bindingsEnabled
}
function cm() {
  return P.skipHydrationRootTNode !== null
}
function lm(e) {
  return P.skipHydrationRootTNode === e
}
function dm() {
  P.skipHydrationRootTNode = null
}
function B() {
  return P.lFrame.lView
}
function Me() {
  return P.lFrame.tView
}
function _e() {
  let e = gd()
  for (; e !== null && e.type === 64; ) e = e.parent
  return e
}
function gd() {
  return P.lFrame.currentTNode
}
function fm() {
  let e = P.lFrame,
    t = e.currentTNode
  return e.isParent ? t : t.parent
}
function pr(e, t) {
  let r = P.lFrame
  ;(r.currentTNode = e), (r.isParent = t)
}
function md() {
  return P.lFrame.isParent
}
function hm() {
  P.lFrame.isParent = !1
}
function pm(e) {
  return (P.lFrame.bindingIndex = e)
}
function gr() {
  return P.lFrame.bindingIndex++
}
function gm(e) {
  let t = P.lFrame,
    r = t.bindingIndex
  return (t.bindingIndex = t.bindingIndex + e), r
}
function mm() {
  return P.lFrame.inI18n
}
function vm(e, t) {
  let r = P.lFrame
  ;(r.bindingIndex = r.bindingRootIndex = e), zs(t)
}
function ym() {
  return P.lFrame.currentDirectiveIndex
}
function zs(e) {
  P.lFrame.currentDirectiveIndex = e
}
function Dm(e) {
  let t = P.lFrame.currentDirectiveIndex
  return t === -1 ? null : e[t]
}
function vd(e) {
  P.lFrame.currentQueryIndex = e
}
function wm(e) {
  let t = e[A]
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[Fe] : null
}
function yd(e, t, r) {
  if (r & x.SkipSelf) {
    let i = t,
      o = e
    for (; (i = i.parent), i === null && !(r & x.Host); )
      if (((i = wm(o)), i === null || ((o = o[En]), i.type & 10))) break
    if (i === null) return !1
    ;(t = i), (e = o)
  }
  let n = (P.lFrame = Dd())
  return (n.currentTNode = t), (n.lView = e), !0
}
function Fa(e) {
  let t = Dd(),
    r = e[A]
  ;(P.lFrame = t),
    (t.currentTNode = r.firstChild),
    (t.lView = e),
    (t.tView = r),
    (t.contextLView = e),
    (t.bindingIndex = r.bindingStartIndex),
    (t.inI18n = !1)
}
function Dd() {
  let e = P.lFrame,
    t = e === null ? null : e.child
  return t === null ? wd(e) : t
}
function wd(e) {
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
function Cd() {
  let e = P.lFrame
  return (P.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
}
var Ed = Cd
function Pa() {
  let e = Cd()
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
function Cm(e) {
  return (P.lFrame.contextLView = im(e, P.lFrame.contextLView))[ce]
}
function Pt() {
  return P.lFrame.selectedIndex
}
function At(e) {
  P.lFrame.selectedIndex = e
}
function Id() {
  let e = P.lFrame
  return Na(e.tView, e.selectedIndex)
}
function Em() {
  return P.lFrame.currentNamespace
}
var bd = !0
function ka() {
  return bd
}
function La(e) {
  bd = e
}
function Im(e, t, r) {
  let { ngOnChanges: n, ngOnInit: i, ngDoCheck: o } = t.type.prototype
  if (n) {
    let s = ud(t)
    ;(r.preOrderHooks ??= []).push(e, s),
      (r.preOrderCheckHooks ??= []).push(e, s)
  }
  i && (r.preOrderHooks ??= []).push(0 - e, i),
    o &&
      ((r.preOrderHooks ??= []).push(e, o),
      (r.preOrderCheckHooks ??= []).push(e, o))
}
function Va(e, t) {
  for (let r = t.directiveStart, n = t.directiveEnd; r < n; r++) {
    let o = e.data[r].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: u,
        ngAfterViewChecked: c,
        ngOnDestroy: l,
      } = o
    s && (e.contentHooks ??= []).push(-r, s),
      a &&
        ((e.contentHooks ??= []).push(r, a),
        (e.contentCheckHooks ??= []).push(r, a)),
      u && (e.viewHooks ??= []).push(-r, u),
      c &&
        ((e.viewHooks ??= []).push(r, c), (e.viewCheckHooks ??= []).push(r, c)),
      l != null && (e.destroyHooks ??= []).push(r, l)
  }
}
function Mi(e, t, r) {
  Md(e, t, 3, r)
}
function _i(e, t, r, n) {
  ;(e[E] & 3) === r && Md(e, t, r, n)
}
function Is(e, t) {
  let r = e[E]
  ;(r & 3) === t && ((r &= 16383), (r += 1), (e[E] = r))
}
function Md(e, t, r, n) {
  let i = n !== void 0 ? e[an] & 65535 : 0,
    o = n ?? -1,
    s = t.length - 1,
    a = 0
  for (let u = i; u < s; u++)
    if (typeof t[u + 1] == 'number') {
      if (((a = t[u]), n != null && a >= n)) break
    } else
      t[u] < 0 && (e[an] += 65536),
        (a < o || o == -1) &&
          (bm(e, r, t, u), (e[an] = (e[an] & 4294901760) + u + 2)),
        u++
}
function fl(e, t) {
  Ve(4, e, t)
  let r = O(null)
  try {
    t.call(e)
  } finally {
    O(r), Ve(5, e, t)
  }
}
function bm(e, t, r, n) {
  let i = r[n] < 0,
    o = r[n + 1],
    s = i ? -r[n] : r[n],
    a = e[s]
  i
    ? e[E] >> 14 < e[an] >> 16 &&
      (e[E] & 3) === t &&
      ((e[E] += 16384), fl(a, o))
    : fl(a, o)
}
var ln = -1,
  xt = class {
    constructor(t, r, n) {
      ;(this.factory = t),
        (this.resolving = !1),
        (this.canSeeViewProviders = r),
        (this.injectImpl = n)
    }
  }
function Mm(e) {
  return e instanceof xt
}
function _m(e) {
  return (e.flags & 8) !== 0
}
function Sm(e) {
  return (e.flags & 16) !== 0
}
function _d(e) {
  return e !== ln
}
function ki(e) {
  return e & 32767
}
function Tm(e) {
  return e >> 16
}
function Li(e, t) {
  let r = Tm(e),
    n = t
  for (; r > 0; ) (n = n[En]), r--
  return n
}
var Gs = !0
function hl(e) {
  let t = Gs
  return (Gs = e), t
}
var Am = 256,
  Sd = Am - 1,
  Td = 5,
  xm = 0,
  je = {}
function Nm(e, t, r) {
  let n
  typeof r == 'string'
    ? (n = r.charCodeAt(0) || 0)
    : r.hasOwnProperty(Qn) && (n = r[Qn]),
    n == null && (n = r[Qn] = xm++)
  let i = n & Sd,
    o = 1 << i
  t.data[e + (i >> Td)] |= o
}
function Vi(e, t) {
  let r = Ad(e, t)
  if (r !== -1) return r
  let n = t[A]
  n.firstCreatePass &&
    ((e.injectorIndex = t.length),
    bs(n.data, e),
    bs(t, null),
    bs(n.blueprint, null))
  let i = ja(e, t),
    o = e.injectorIndex
  if (_d(i)) {
    let s = ki(i),
      a = Li(i, t),
      u = a[A].data
    for (let c = 0; c < 8; c++) t[o + c] = a[s + c] | u[s + c]
  }
  return (t[o + 8] = i), o
}
function bs(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t)
}
function Ad(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex
}
function ja(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex
  let r = 0,
    n = null,
    i = t
  for (; i !== null; ) {
    if (((n = Fd(i)), n === null)) return ln
    if ((r++, (i = i[En]), n.injectorIndex !== -1))
      return n.injectorIndex | (r << 16)
  }
  return ln
}
function qs(e, t, r) {
  Nm(e, t, r)
}
function xd(e, t, r) {
  if (r & x.Optional || e !== void 0) return e
  ba(t, 'NodeInjector')
}
function Nd(e, t, r, n) {
  if (
    (r & x.Optional && n === void 0 && (n = null), !(r & (x.Self | x.Host)))
  ) {
    let i = e[gn],
      o = Ee(void 0)
    try {
      return i ? i.get(t, n, r & x.Optional) : Bl(t, n, r & x.Optional)
    } finally {
      Ee(o)
    }
  }
  return xd(n, t, r)
}
function Rd(e, t, r, n = x.Default, i) {
  if (e !== null) {
    if (t[E] & 2048 && !(n & x.Self)) {
      let s = km(e, t, r, n, je)
      if (s !== je) return s
    }
    let o = Od(e, t, r, n, je)
    if (o !== je) return o
  }
  return Nd(t, r, n, i)
}
function Od(e, t, r, n, i) {
  let o = Fm(r)
  if (typeof o == 'function') {
    if (!yd(t, e, n)) return n & x.Host ? xd(i, r, n) : Nd(t, r, n, i)
    try {
      let s
      if (((s = o(n)), s == null && !(n & x.Optional))) ba(r)
      else return s
    } finally {
      Ed()
    }
  } else if (typeof o == 'number') {
    let s = null,
      a = Ad(e, t),
      u = ln,
      c = n & x.Host ? t[Re][Fe] : null
    for (
      (a === -1 || n & x.SkipSelf) &&
      ((u = a === -1 ? ja(e, t) : t[a + 8]),
      u === ln || !gl(n, !1)
        ? (a = -1)
        : ((s = t[A]), (a = ki(u)), (t = Li(u, t))));
      a !== -1;

    ) {
      let l = t[A]
      if (pl(o, a, l.data)) {
        let d = Rm(a, t, r, s, n, c)
        if (d !== je) return d
      }
      ;(u = t[a + 8]),
        u !== ln && gl(n, t[A].data[a + 8] === c) && pl(o, a, t)
          ? ((s = l), (a = ki(u)), (t = Li(u, t)))
          : (a = -1)
    }
  }
  return i
}
function Rm(e, t, r, n, i, o) {
  let s = t[A],
    a = s.data[e + 8],
    u = n == null ? eo(a) && Gs : n != s && (a.type & 3) !== 0,
    c = i & x.Host && o === a,
    l = Om(a, s, r, u, c)
  return l !== null ? vn(t, s, l, a) : je
}
function Om(e, t, r, n, i) {
  let o = e.providerIndexes,
    s = t.data,
    a = o & 1048575,
    u = e.directiveStart,
    c = e.directiveEnd,
    l = o >> 20,
    d = n ? a : a + l,
    f = i ? a + l : c
  for (let h = d; h < f; h++) {
    let m = s[h]
    if ((h < u && r === m) || (h >= u && m.type === r)) return h
  }
  if (i) {
    let h = s[u]
    if (h && ct(h) && h.type === r) return u
  }
  return null
}
function vn(e, t, r, n) {
  let i = e[r],
    o = t.data
  if (Mm(i)) {
    let s = i
    s.resolving && og(ig(o[r]))
    let a = hl(s.canSeeViewProviders)
    s.resolving = !0
    let u,
      c = s.injectImpl ? Ee(s.injectImpl) : null,
      l = yd(e, n, x.Default)
    try {
      ;(i = e[r] = s.factory(void 0, o, e, n)),
        t.firstCreatePass && r >= n.directiveStart && Im(r, o[r], t)
    } finally {
      c !== null && Ee(c), hl(a), (s.resolving = !1), Ed()
    }
  }
  return i
}
function Fm(e) {
  if (typeof e == 'string') return e.charCodeAt(0) || 0
  let t = e.hasOwnProperty(Qn) ? e[Qn] : void 0
  return typeof t == 'number' ? (t >= 0 ? t & Sd : Pm) : t
}
function pl(e, t, r) {
  let n = 1 << e
  return !!(r[t + (e >> Td)] & n)
}
function gl(e, t) {
  return !(e & x.Self) && !(e & x.Host && t)
}
var Mt = class {
  constructor(t, r) {
    ;(this._tNode = t), (this._lView = r)
  }
  get(t, r, n) {
    return Rd(this._tNode, this._lView, t, Qi(n), r)
  }
}
function Pm() {
  return new Mt(_e(), B())
}
function bn(e) {
  return Zi(() => {
    let t = e.prototype.constructor,
      r = t[Ai] || Ws(t),
      n = Object.prototype,
      i = Object.getPrototypeOf(e.prototype).constructor
    for (; i && i !== n; ) {
      let o = i[Ai] || Ws(i)
      if (o && o !== r) return o
      i = Object.getPrototypeOf(i)
    }
    return (o) => new o()
  })
}
function Ws(e) {
  return Pl(e)
    ? () => {
        let t = Ws(ae(e))
        return t && t()
      }
    : dn(e)
}
function km(e, t, r, n, i) {
  let o = e,
    s = t
  for (; o !== null && s !== null && s[E] & 2048 && !(s[E] & 512); ) {
    let a = Od(o, s, r, n | x.Self, je)
    if (a !== je) return a
    let u = o.parent
    if (!u) {
      let c = s[id]
      if (c) {
        let l = c.get(r, je, n)
        if (l !== je) return l
      }
      ;(u = Fd(s)), (s = s[En])
    }
    o = u
  }
  return i
}
function Fd(e) {
  let t = e[A],
    r = t.type
  return r === 2 ? t.declTNode : r === 1 ? e[Fe] : null
}
function ml(e, t = null, r = null, n) {
  let i = Pd(e, t, r, n)
  return i.resolveInjectorInitializers(), i
}
function Pd(e, t = null, r = null, n, i = new Set()) {
  let o = [r || Ie, Pg(e)]
  return (
    (n = n || (typeof e == 'object' ? void 0 : fe(e))),
    new Xn(o, t || Ta(), n || null, i)
  )
}
var Mn = (() => {
  let t = class t {
    static create(n, i) {
      if (Array.isArray(n)) return ml({ name: '' }, i, n, '')
      {
        let o = n.name ?? ''
        return ml({ name: o }, n.parent, n.providers, o)
      }
    }
  }
  ;(t.THROW_IF_NOT_FOUND = Kn),
    (t.NULL = new Ri()),
    (t.ɵprov = D({ token: t, providedIn: 'any', factory: () => S(zl) })),
    (t.__NG_ELEMENT_ID__ = -1)
  let e = t
  return e
})()
var Lm = 'ngOriginalError'
function Ms(e) {
  return e[Lm]
}
var Qe = class {
    constructor() {
      this._console = console
    }
    handleError(t) {
      let r = this._findOriginalError(t)
      this._console.error('ERROR', t),
        r && this._console.error('ORIGINAL ERROR', r)
    }
    _findOriginalError(t) {
      let r = t && Ms(t)
      for (; r && Ms(r); ) r = Ms(r)
      return r || null
    }
  },
  kd = new C('', {
    providedIn: 'root',
    factory: () => p(Qe).handleError.bind(void 0),
  }),
  Ld = (() => {
    let t = class t {}
    ;(t.__NG_ELEMENT_ID__ = Vm), (t.__NG_ENV_ID__ = (n) => n)
    let e = t
    return e
  })(),
  Zs = class extends Ld {
    constructor(t) {
      super(), (this._lView = t)
    }
    onDestroy(t) {
      return hd(this._lView, t), () => om(this._lView, t)
    }
  }
function Vm() {
  return new Zs(B())
}
function jm() {
  return Ua(_e(), B())
}
function Ua(e, t) {
  return new kt(Pe(e, t))
}
var kt = (() => {
  let t = class t {
    constructor(n) {
      this.nativeElement = n
    }
  }
  t.__NG_ELEMENT_ID__ = jm
  let e = t
  return e
})()
var Ys = class extends se {
  constructor(t = !1) {
    super(),
      (this.destroyRef = void 0),
      (this.__isAsync = t),
      qg() && (this.destroyRef = p(Ld, { optional: !0 }) ?? void 0)
  }
  emit(t) {
    let r = O(null)
    try {
      super.next(t)
    } finally {
      O(r)
    }
  }
  subscribe(t, r, n) {
    let i = t,
      o = r || (() => null),
      s = n
    if (t && typeof t == 'object') {
      let u = t
      ;(i = u.next?.bind(u)), (o = u.error?.bind(u)), (s = u.complete?.bind(u))
    }
    this.__isAsync && ((o = _s(o)), i && (i = _s(i)), s && (s = _s(s)))
    let a = super.subscribe({ next: i, error: o, complete: s })
    return t instanceof Z && t.add(a), a
  }
}
function _s(e) {
  return (t) => {
    setTimeout(e, void 0, t)
  }
}
var ue = Ys
function Vd(e) {
  return (e.flags & 128) === 128
}
var jd = new Map(),
  Um = 0
function $m() {
  return Um++
}
function Bm(e) {
  jd.set(e[Xi], e)
}
function Hm(e) {
  jd.delete(e[Xi])
}
var vl = '__ngContext__'
function Nt(e, t) {
  bt(t) ? ((e[vl] = t[Xi]), Bm(t)) : (e[vl] = t)
}
function Ud(e) {
  return Bd(e[nr])
}
function $d(e) {
  return Bd(e[Ne])
}
function Bd(e) {
  for (; e !== null && !et(e); ) e = e[Ne]
  return e
}
var Qs
function Hd(e) {
  Qs = e
}
function zm() {
  if (Qs !== void 0) return Qs
  if (typeof document < 'u') return document
  throw new w(210, !1)
}
var $a = new C('', { providedIn: 'root', factory: () => Gm }),
  Gm = 'ng',
  Ba = new C(''),
  ht = new C('', { providedIn: 'platform', factory: () => 'unknown' })
var Ha = new C('', {
  providedIn: 'root',
  factory: () =>
    zm().body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') ||
    null,
})
var qm = 'h',
  Wm = 'b'
var Zm = () => null
function za(e, t, r = !1) {
  return Zm(e, t, r)
}
var zd = !1,
  Ym = new C('', { providedIn: 'root', factory: () => zd })
var Ks = class {
  constructor(t) {
    this.changingThisBreaksApplicationSecurity = t
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Yp})`
  }
}
function Ga(e) {
  return e instanceof Ks ? e.changingThisBreaksApplicationSecurity : e
}
function Gd(e) {
  return e instanceof Function ? e() : e
}
var Ke = (function (e) {
    return (
      (e[(e.Important = 1)] = 'Important'),
      (e[(e.DashCase = 2)] = 'DashCase'),
      e
    )
  })(Ke || {}),
  Qm
function qa(e, t) {
  return Qm(e, t)
}
function un(e, t, r, n, i) {
  if (n != null) {
    let o,
      s = !1
    et(n) ? (o = n) : bt(n) && ((s = !0), (n = n[Xe]))
    let a = Be(n)
    e === 0 && r !== null
      ? i == null
        ? Yd(t, r, a)
        : ji(t, r, a, i || null, !0)
      : e === 1 && r !== null
        ? ji(t, r, a, i || null, !0)
        : e === 2
          ? hv(t, a, s)
          : e === 3 && t.destroyNode(a),
      o != null && gv(t, e, o, r, i)
  }
}
function Km(e, t) {
  return e.createText(t)
}
function Jm(e, t, r) {
  e.setValue(t, r)
}
function qd(e, t, r) {
  return e.createElement(t, r)
}
function Xm(e, t) {
  Wd(e, t), (t[Xe] = null), (t[Fe] = null)
}
function ev(e, t, r, n, i, o) {
  ;(n[Xe] = i), (n[Fe] = t), no(e, n, r, 1, i, o)
}
function Wd(e, t) {
  t[$e].changeDetectionScheduler?.notify(1), no(e, t, t[K], 2, null, null)
}
function tv(e) {
  let t = e[nr]
  if (!t) return Ss(e[A], e)
  for (; t; ) {
    let r = null
    if (bt(t)) r = t[nr]
    else {
      let n = t[le]
      n && (r = n)
    }
    if (!r) {
      for (; t && !t[Ne] && t !== e; ) bt(t) && Ss(t[A], t), (t = t[re])
      t === null && (t = e), bt(t) && Ss(t[A], t), (r = t && t[Ne])
    }
    t = r
  }
}
function nv(e, t, r, n) {
  let i = le + n,
    o = r.length
  n > 0 && (r[i - 1][Ne] = t),
    n < o - le
      ? ((t[Ne] = r[i]), Hl(r, le + n, t))
      : (r.push(t), (t[Ne] = null)),
    (t[re] = r)
  let s = t[Ji]
  s !== null && r !== s && rv(s, t)
  let a = t[mn]
  a !== null && a.insertView(e), Hs(t), (t[E] |= 128)
}
function rv(e, t) {
  let r = e[Fi],
    i = t[re][re][Re]
  t[Re] !== i && (e[E] |= Aa.HasTransplantedViews),
    r === null ? (e[Fi] = [t]) : r.push(t)
}
function Zd(e, t) {
  let r = e[Fi],
    n = r.indexOf(t)
  r.splice(n, 1)
}
function or(e, t) {
  if (e.length <= le) return
  let r = le + t,
    n = e[r]
  if (n) {
    let i = n[Ji]
    i !== null && i !== e && Zd(i, n), t > 0 && (e[r - 1][Ne] = n[Ne])
    let o = Ni(e, le + t)
    Xm(n[A], n)
    let s = o[mn]
    s !== null && s.detachView(o[A]),
      (n[re] = null),
      (n[Ne] = null),
      (n[E] &= -129)
  }
  return n
}
function to(e, t) {
  if (!(t[E] & 256)) {
    let r = t[K]
    r.destroyNode && no(e, t, r, 3, null, null), tv(t)
  }
}
function Ss(e, t) {
  if (t[E] & 256) return
  let r = O(null)
  try {
    ;(t[E] &= -129),
      (t[E] |= 256),
      t[St] && wc(t[St]),
      ov(e, t),
      iv(e, t),
      t[A].type === 1 && t[K].destroy()
    let n = t[Ji]
    if (n !== null && et(t[re])) {
      n !== t[re] && Zd(n, t)
      let i = t[mn]
      i !== null && i.detachView(e)
    }
    Hm(t)
  } finally {
    O(r)
  }
}
function iv(e, t) {
  let r = e.cleanup,
    n = t[tr]
  if (r !== null)
    for (let o = 0; o < r.length - 1; o += 2)
      if (typeof r[o] == 'string') {
        let s = r[o + 3]
        s >= 0 ? n[s]() : n[-s].unsubscribe(), (o += 2)
      } else {
        let s = n[r[o + 1]]
        r[o].call(s)
      }
  n !== null && (t[tr] = null)
  let i = t[ut]
  if (i !== null) {
    t[ut] = null
    for (let o = 0; o < i.length; o++) {
      let s = i[o]
      s()
    }
  }
}
function ov(e, t) {
  let r
  if (e != null && (r = e.destroyHooks) != null)
    for (let n = 0; n < r.length; n += 2) {
      let i = t[r[n]]
      if (!(i instanceof xt)) {
        let o = r[n + 1]
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
function sv(e, t, r) {
  return av(e, t.parent, r)
}
function av(e, t, r) {
  let n = t
  for (; n !== null && n.type & 40; ) (t = n), (n = t.parent)
  if (n === null) return r[Xe]
  {
    let { componentOffset: i } = n
    if (i > -1) {
      let { encapsulation: o } = e.data[n.directiveStart + i]
      if (o === Ue.None || o === Ue.Emulated) return null
    }
    return Pe(n, r)
  }
}
function ji(e, t, r, n, i) {
  e.insertBefore(t, r, n, i)
}
function Yd(e, t, r) {
  e.appendChild(t, r)
}
function yl(e, t, r, n, i) {
  n !== null ? ji(e, t, r, n, i) : Yd(e, t, r)
}
function uv(e, t, r, n) {
  e.removeChild(t, r, n)
}
function Wa(e, t) {
  return e.parentNode(t)
}
function cv(e, t) {
  return e.nextSibling(t)
}
function lv(e, t, r) {
  return fv(e, t, r)
}
function dv(e, t, r) {
  return e.type & 40 ? Pe(e, r) : null
}
var fv = dv,
  Dl
function Za(e, t, r, n) {
  let i = sv(e, n, t),
    o = t[K],
    s = n.parent || t[Fe],
    a = lv(s, n, t)
  if (i != null)
    if (Array.isArray(r))
      for (let u = 0; u < r.length; u++) yl(o, i, r[u], a, !1)
    else yl(o, i, r, a, !1)
  Dl !== void 0 && Dl(o, n, t, r, i)
}
function Si(e, t) {
  if (t !== null) {
    let r = t.type
    if (r & 3) return Pe(t, e)
    if (r & 4) return Js(-1, e[t.index])
    if (r & 8) {
      let n = t.child
      if (n !== null) return Si(e, n)
      {
        let i = e[t.index]
        return et(i) ? Js(-1, i) : Be(i)
      }
    } else {
      if (r & 32) return qa(t, e)() || Be(e[t.index])
      {
        let n = Qd(e, t)
        if (n !== null) {
          if (Array.isArray(n)) return n[0]
          let i = ir(e[Re])
          return Si(i, n)
        } else return Si(e, t.next)
      }
    }
  }
  return null
}
function Qd(e, t) {
  if (t !== null) {
    let n = e[Re][Fe],
      i = t.projection
    return n.projection[i]
  }
  return null
}
function Js(e, t) {
  let r = le + e + 1
  if (r < t.length) {
    let n = t[r],
      i = n[A].firstChild
    if (i !== null) return Si(n, i)
  }
  return t[Tt]
}
function hv(e, t, r) {
  let n = Wa(e, t)
  n && uv(e, n, t, r)
}
function Ya(e, t, r, n, i, o, s) {
  for (; r != null; ) {
    let a = n[r.index],
      u = r.type
    if (
      (s && t === 0 && (a && Nt(Be(a), n), (r.flags |= 2)),
      (r.flags & 32) !== 32)
    )
      if (u & 8) Ya(e, t, r.child, n, i, o, !1), un(t, e, i, a, o)
      else if (u & 32) {
        let c = qa(r, n),
          l
        for (; (l = c()); ) un(t, e, i, l, o)
        un(t, e, i, a, o)
      } else u & 16 ? pv(e, t, n, r, i, o) : un(t, e, i, a, o)
    r = s ? r.projectionNext : r.next
  }
}
function no(e, t, r, n, i, o) {
  Ya(r, n, e.firstChild, t, i, o, !1)
}
function pv(e, t, r, n, i, o) {
  let s = r[Re],
    u = s[Fe].projection[n.projection]
  if (Array.isArray(u))
    for (let c = 0; c < u.length; c++) {
      let l = u[c]
      un(t, e, i, l, o)
    }
  else {
    let c = u,
      l = s[re]
    Vd(n) && (c.flags |= 128), Ya(e, t, c, l, i, o, !0)
  }
}
function gv(e, t, r, n, i) {
  let o = r[Tt],
    s = Be(r)
  o !== s && un(t, e, n, o, i)
  for (let a = le; a < r.length; a++) {
    let u = r[a]
    no(u[A], u, e, t, n, o)
  }
}
function mv(e, t, r, n, i) {
  if (t) i ? e.addClass(r, n) : e.removeClass(r, n)
  else {
    let o = n.indexOf('-') === -1 ? void 0 : Ke.DashCase
    i == null
      ? e.removeStyle(r, n, o)
      : (typeof i == 'string' &&
          i.endsWith('!important') &&
          ((i = i.slice(0, -10)), (o |= Ke.Important)),
        e.setStyle(r, n, i, o))
  }
}
function vv(e, t, r) {
  e.setAttribute(t, 'style', r)
}
function Kd(e, t, r) {
  r === '' ? e.removeAttribute(t, 'class') : e.setAttribute(t, 'class', r)
}
function Jd(e, t, r) {
  let { mergedAttrs: n, classes: i, styles: o } = r
  n !== null && Vs(e, t, n),
    i !== null && Kd(e, t, i),
    o !== null && vv(e, t, o)
}
var _n = {}
function ie(e = 1) {
  Xd(Me(), B(), Pt() + e, !1)
}
function Xd(e, t, r, n) {
  if (!n)
    if ((t[E] & 3) === 3) {
      let o = e.preOrderCheckHooks
      o !== null && Mi(t, o, r)
    } else {
      let o = e.preOrderHooks
      o !== null && _i(t, o, 0, r)
    }
  At(r)
}
function J(e, t = x.Default) {
  let r = B()
  if (r === null) return S(e, t)
  let n = _e()
  return Rd(n, r, ae(e), t)
}
function ef(e, t, r, n, i, o) {
  let s = O(null)
  try {
    let a = null
    i & be.SignalBased && (a = t[n][We]),
      a !== null && a.transformFn !== void 0 && (o = a.transformFn(o)),
      i & be.HasDecoratorInputTransform &&
        (o = e.inputTransforms[n].call(t, o)),
      e.setInput !== null ? e.setInput(t, a, o, r, n) : ad(t, a, n, o)
  } finally {
    O(s)
  }
}
function yv(e, t) {
  let r = e.hostBindingOpCodes
  if (r !== null)
    try {
      for (let n = 0; n < r.length; n++) {
        let i = r[n]
        if (i < 0) At(~i)
        else {
          let o = i,
            s = r[++n],
            a = r[++n]
          vm(s, o)
          let u = t[o]
          a(2, u)
        }
      }
    } finally {
      At(-1)
    }
}
function ro(e, t, r, n, i, o, s, a, u, c, l) {
  let d = t.blueprint.slice()
  return (
    (d[Xe] = i),
    (d[E] = n | 4 | 128 | 8 | 64),
    (c !== null || (e && e[E] & 2048)) && (d[E] |= 2048),
    fd(d),
    (d[re] = d[En] = e),
    (d[ce] = r),
    (d[$e] = s || (e && e[$e])),
    (d[K] = a || (e && e[K])),
    (d[gn] = u || (e && e[gn]) || null),
    (d[Fe] = o),
    (d[Xi] = $m()),
    (d[er] = l),
    (d[id] = c),
    (d[Re] = t.type == 2 ? e[Re] : d),
    d
  )
}
function io(e, t, r, n, i) {
  let o = e.data[t]
  if (o === null) (o = Dv(e, t, r, n, i)), mm() && (o.flags |= 32)
  else if (o.type & 64) {
    ;(o.type = r), (o.value = n), (o.attrs = i)
    let s = fm()
    o.injectorIndex = s === null ? -1 : s.injectorIndex
  }
  return pr(o, !0), o
}
function Dv(e, t, r, n, i) {
  let o = gd(),
    s = md(),
    a = s ? o : o && o.parent,
    u = (e.data[t] = bv(e, a, r, t, n, i))
  return (
    e.firstChild === null && (e.firstChild = u),
    o !== null &&
      (s
        ? o.child == null && u.parent !== null && (o.child = u)
        : o.next === null && ((o.next = u), (u.prev = o))),
    u
  )
}
function tf(e, t, r, n) {
  if (r === 0) return -1
  let i = t.length
  for (let o = 0; o < r; o++) t.push(n), e.blueprint.push(n), e.data.push(null)
  return i
}
function nf(e, t, r, n, i) {
  let o = Pt(),
    s = n & 2
  try {
    At(-1), s && t.length > Oe && Xd(e, t, Oe, !1), Ve(s ? 2 : 0, i), r(n, i)
  } finally {
    At(o), Ve(s ? 3 : 1, i)
  }
}
function rf(e, t, r) {
  if (sd(t)) {
    let n = O(null)
    try {
      let i = t.directiveStart,
        o = t.directiveEnd
      for (let s = i; s < o; s++) {
        let a = e.data[s]
        if (a.contentQueries) {
          let u = r[s]
          a.contentQueries(1, u, s)
        }
      }
    } finally {
      O(n)
    }
  }
}
function of(e, t, r) {
  pd() && (xv(e, t, r, Pe(r, t)), (r.flags & 64) === 64 && df(e, t, r))
}
function sf(e, t, r = Pe) {
  let n = t.localNames
  if (n !== null) {
    let i = t.index + 1
    for (let o = 0; o < n.length; o += 2) {
      let s = n[o + 1],
        a = s === -1 ? r(t, e) : e[s]
      e[i++] = a
    }
  }
}
function af(e) {
  let t = e.tView
  return t === null || t.incompleteFirstPass
    ? (e.tView = Qa(
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
function Qa(e, t, r, n, i, o, s, a, u, c, l) {
  let d = Oe + n,
    f = d + i,
    h = wv(d, f),
    m = typeof c == 'function' ? c() : c
  return (h[A] = {
    type: e,
    blueprint: h,
    template: r,
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
function wv(e, t) {
  let r = []
  for (let n = 0; n < t; n++) r.push(n < e ? null : _n)
  return r
}
function Cv(e, t, r, n) {
  let o = n.get(Ym, zd) || r === Ue.ShadowDom,
    s = e.selectRootElement(t, o)
  return Ev(s), s
}
function Ev(e) {
  Iv(e)
}
var Iv = () => null
function bv(e, t, r, n, i, o) {
  let s = t ? t.injectorIndex : -1,
    a = 0
  return (
    cm() && (a |= 128),
    {
      type: r,
      index: n,
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
function wl(e, t, r, n, i) {
  for (let o in t) {
    if (!t.hasOwnProperty(o)) continue
    let s = t[o]
    if (s === void 0) continue
    n ??= {}
    let a,
      u = be.None
    Array.isArray(s) ? ((a = s[0]), (u = s[1])) : (a = s)
    let c = o
    if (i !== null) {
      if (!i.hasOwnProperty(o)) continue
      c = i[o]
    }
    e === 0 ? Cl(n, r, c, a, u) : Cl(n, r, c, a)
  }
  return n
}
function Cl(e, t, r, n, i) {
  let o
  e.hasOwnProperty(r) ? (o = e[r]).push(t, n) : (o = e[r] = [t, n]),
    i !== void 0 && o.push(i)
}
function Mv(e, t, r) {
  let n = t.directiveStart,
    i = t.directiveEnd,
    o = e.data,
    s = t.attrs,
    a = [],
    u = null,
    c = null
  for (let l = n; l < i; l++) {
    let d = o[l],
      f = r ? r.get(d) : null,
      h = f ? f.inputs : null,
      m = f ? f.outputs : null
    ;(u = wl(0, d.inputs, l, u, h)), (c = wl(1, d.outputs, l, c, m))
    let b = u !== null && s !== null && !_a(t) ? jv(u, l, s) : null
    a.push(b)
  }
  u !== null &&
    (u.hasOwnProperty('class') && (t.flags |= 8),
    u.hasOwnProperty('style') && (t.flags |= 16)),
    (t.initialInputs = a),
    (t.inputs = u),
    (t.outputs = c)
}
function _v(e) {
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
function uf(e, t, r, n, i, o, s, a) {
  let u = Pe(t, r),
    c = t.inputs,
    l
  !a && c != null && (l = c[n])
    ? (Ka(e, r, l, n, i), eo(t) && Sv(r, t.index))
    : t.type & 3
      ? ((n = _v(n)),
        (i = s != null ? s(i, t.value || '', n) : i),
        o.setProperty(u, n, i))
      : t.type & 12
}
function Sv(e, t) {
  let r = ft(t, e)
  r[E] & 16 || (r[E] |= 64)
}
function cf(e, t, r, n) {
  if (pd()) {
    let i = n === null ? null : { '': -1 },
      o = Rv(e, r),
      s,
      a
    o === null ? (s = a = null) : ([s, a] = o),
      s !== null && lf(e, t, r, s, i, a),
      i && Ov(r, n, i)
  }
  r.mergedAttrs = Jn(r.mergedAttrs, r.attrs)
}
function lf(e, t, r, n, i, o) {
  for (let c = 0; c < n.length; c++) qs(Vi(r, t), e, n[c].type)
  Pv(r, e.data.length, n.length)
  for (let c = 0; c < n.length; c++) {
    let l = n[c]
    l.providersResolver && l.providersResolver(l)
  }
  let s = !1,
    a = !1,
    u = tf(e, t, n.length, null)
  for (let c = 0; c < n.length; c++) {
    let l = n[c]
    ;(r.mergedAttrs = Jn(r.mergedAttrs, l.hostAttrs)),
      kv(e, r, t, u, l),
      Fv(u, l, i),
      l.contentQueries !== null && (r.flags |= 4),
      (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) &&
        (r.flags |= 64)
    let d = l.type.prototype
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(r.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(r.index), (a = !0)),
      u++
  }
  Mv(e, r, o)
}
function Tv(e, t, r, n, i) {
  let o = i.hostBindings
  if (o) {
    let s = e.hostBindingOpCodes
    s === null && (s = e.hostBindingOpCodes = [])
    let a = ~t.index
    Av(s) != a && s.push(a), s.push(r, n, o)
  }
}
function Av(e) {
  let t = e.length
  for (; t > 0; ) {
    let r = e[--t]
    if (typeof r == 'number' && r < 0) return r
  }
  return 0
}
function xv(e, t, r, n) {
  let i = r.directiveStart,
    o = r.directiveEnd
  eo(r) && Lv(t, r, e.data[i + r.componentOffset]),
    e.firstCreatePass || Vi(r, t),
    Nt(n, t)
  let s = r.initialInputs
  for (let a = i; a < o; a++) {
    let u = e.data[a],
      c = vn(t, e, a, r)
    if ((Nt(c, t), s !== null && Vv(t, a - i, c, u, r, s), ct(u))) {
      let l = ft(r.index, t)
      l[ce] = vn(t, e, a, r)
    }
  }
}
function df(e, t, r) {
  let n = r.directiveStart,
    i = r.directiveEnd,
    o = r.index,
    s = ym()
  try {
    At(o)
    for (let a = n; a < i; a++) {
      let u = e.data[a],
        c = t[a]
      zs(a),
        (u.hostBindings !== null || u.hostVars !== 0 || u.hostAttrs !== null) &&
          Nv(u, c)
    }
  } finally {
    At(-1), zs(s)
  }
}
function Nv(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t)
}
function Rv(e, t) {
  let r = e.directiveRegistry,
    n = null,
    i = null
  if (r)
    for (let o = 0; o < r.length; o++) {
      let s = r[o]
      if (_g(t, s.selectors, !1))
        if ((n || (n = []), ct(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = []
            ;(i = i || new Map()),
              s.findHostDirectiveDefs(s, a, i),
              n.unshift(...a, s)
            let u = a.length
            Xs(e, t, u)
          } else n.unshift(s), Xs(e, t, 0)
        else (i = i || new Map()), s.findHostDirectiveDefs?.(s, n, i), n.push(s)
    }
  return n === null ? null : [n, i]
}
function Xs(e, t, r) {
  ;(t.componentOffset = r), (e.components ??= []).push(t.index)
}
function Ov(e, t, r) {
  if (t) {
    let n = (e.localNames = [])
    for (let i = 0; i < t.length; i += 2) {
      let o = r[t[i + 1]]
      if (o == null) throw new w(-301, !1)
      n.push(t[i], o)
    }
  }
}
function Fv(e, t, r) {
  if (r) {
    if (t.exportAs)
      for (let n = 0; n < t.exportAs.length; n++) r[t.exportAs[n]] = e
    ct(t) && (r[''] = e)
  }
}
function Pv(e, t, r) {
  ;(e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + r),
    (e.providerIndexes = t)
}
function kv(e, t, r, n, i) {
  e.data[n] = i
  let o = i.factory || (i.factory = dn(i.type, !0)),
    s = new xt(o, ct(i), J)
  ;(e.blueprint[n] = s), (r[n] = s), Tv(e, t, n, tf(e, r, i.hostVars, _n), i)
}
function Lv(e, t, r) {
  let n = Pe(t, e),
    i = af(r),
    o = e[$e].rendererFactory,
    s = 16
  r.signals ? (s = 4096) : r.onPush && (s = 64)
  let a = oo(
    e,
    ro(e, i, null, s, n, t, null, o.createRenderer(n, r), null, null, null),
  )
  e[t.index] = a
}
function Vv(e, t, r, n, i, o) {
  let s = o[t]
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let u = s[a++],
        c = s[a++],
        l = s[a++],
        d = s[a++]
      ef(n, r, u, c, l, d)
    }
}
function jv(e, t, r) {
  let n = null,
    i = 0
  for (; i < r.length; ) {
    let o = r[i]
    if (o === 0) {
      i += 4
      continue
    } else if (o === 5) {
      i += 2
      continue
    }
    if (typeof o == 'number') break
    if (e.hasOwnProperty(o)) {
      n === null && (n = [])
      let s = e[o]
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === t) {
          n.push(o, s[a + 1], s[a + 2], r[i + 1])
          break
        }
    }
    i += 2
  }
  return n
}
function ff(e, t, r, n) {
  return [e, !0, 0, t, null, n, null, r, null, null]
}
function hf(e, t) {
  let r = e.contentQueries
  if (r !== null) {
    let n = O(null)
    try {
      for (let i = 0; i < r.length; i += 2) {
        let o = r[i],
          s = r[i + 1]
        if (s !== -1) {
          let a = e.data[s]
          vd(o), a.contentQueries(2, t[s], s)
        }
      }
    } finally {
      O(n)
    }
  }
}
function oo(e, t) {
  return e[nr] ? (e[ll][Ne] = t) : (e[nr] = t), (e[ll] = t), t
}
function ea(e, t, r) {
  vd(0)
  let n = O(null)
  try {
    t(e, r)
  } finally {
    O(n)
  }
}
function Uv(e) {
  return e[tr] || (e[tr] = [])
}
function $v(e) {
  return e.cleanup || (e.cleanup = [])
}
function pf(e, t) {
  let r = e[gn],
    n = r ? r.get(Qe, null) : null
  n && n.handleError(t)
}
function Ka(e, t, r, n, i) {
  for (let o = 0; o < r.length; ) {
    let s = r[o++],
      a = r[o++],
      u = r[o++],
      c = t[s],
      l = e.data[s]
    ef(l, c, n, a, u, i)
  }
}
function Bv(e, t, r) {
  let n = dd(t, e)
  Jm(e[K], n, r)
}
function Hv(e, t) {
  let r = ft(t, e),
    n = r[A]
  zv(n, r)
  let i = r[Xe]
  i !== null && r[er] === null && (r[er] = za(i, r[gn])), Ja(n, r, r[ce])
}
function zv(e, t) {
  for (let r = t.length; r < e.blueprint.length; r++) t.push(e.blueprint[r])
}
function Ja(e, t, r) {
  Fa(t)
  try {
    let n = e.viewQuery
    n !== null && ea(1, n, r)
    let i = e.template
    i !== null && nf(e, t, i, 1, r),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[mn]?.finishViewCreation(e),
      e.staticContentQueries && hf(e, t),
      e.staticViewQueries && ea(2, e.viewQuery, r)
    let o = e.components
    o !== null && Gv(t, o)
  } catch (n) {
    throw (
      (e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      n)
    )
  } finally {
    ;(t[E] &= -5), Pa()
  }
}
function Gv(e, t) {
  for (let r = 0; r < t.length; r++) Hv(e, t[r])
}
function Xa(e, t, r, n) {
  let i = O(null)
  try {
    let o = t.tView,
      a = e[E] & 4096 ? 4096 : 16,
      u = ro(
        e,
        o,
        r,
        a,
        null,
        t,
        null,
        null,
        n?.injector ?? null,
        n?.embeddedViewInjector ?? null,
        n?.dehydratedView ?? null,
      ),
      c = e[t.index]
    u[Ji] = c
    let l = e[mn]
    return l !== null && (u[mn] = l.createEmbeddedView(o)), Ja(o, u, r), u
  } finally {
    O(i)
  }
}
function gf(e, t) {
  let r = le + t
  if (r < e.length) return e[r]
}
function sr(e, t) {
  return !t || t.firstChild === null || Vd(e)
}
function so(e, t, r, n = !0) {
  let i = t[A]
  if ((nv(i, t, e, r), n)) {
    let s = Js(r, e),
      a = t[K],
      u = Wa(a, e[Tt])
    u !== null && ev(i, e[Fe], a, t, u, s)
  }
  let o = t[er]
  o !== null && o.firstChild !== null && (o.firstChild = null)
}
function mf(e, t) {
  let r = or(e, t)
  return r !== void 0 && to(r[A], r), r
}
function Ui(e, t, r, n, i = !1) {
  for (; r !== null; ) {
    let o = t[r.index]
    o !== null && n.push(Be(o)), et(o) && qv(o, n)
    let s = r.type
    if (s & 8) Ui(e, t, r.child, n)
    else if (s & 32) {
      let a = qa(r, t),
        u
      for (; (u = a()); ) n.push(u)
    } else if (s & 16) {
      let a = Qd(t, r)
      if (Array.isArray(a)) n.push(...a)
      else {
        let u = ir(t[Re])
        Ui(u[A], u, a, n, !0)
      }
    }
    r = i ? r.projectionNext : r.next
  }
  return n
}
function qv(e, t) {
  for (let r = le; r < e.length; r++) {
    let n = e[r],
      i = n[A].firstChild
    i !== null && Ui(n[A], n, i, t)
  }
  e[Tt] !== e[Xe] && t.push(e[Tt])
}
var vf = []
function Wv(e) {
  return e[St] ?? Zv(e)
}
function Zv(e) {
  let t = vf.pop() ?? Object.create(Qv)
  return (t.lView = e), t
}
function Yv(e) {
  e.lView[St] !== e && ((e.lView = null), vf.push(e))
}
var Qv = R(g({}, Qr), {
    consumerIsAlwaysLive: !0,
    consumerMarkedDirty: (e) => {
      rr(e.lView)
    },
    consumerOnSignalRead() {
      this.lView[St] = this
    },
  }),
  yf = 100
function Df(e, t = !0, r = 0) {
  let n = e[$e],
    i = n.rendererFactory,
    o = !1
  o || i.begin?.()
  try {
    Kv(e, r)
  } catch (s) {
    throw (t && pf(e, s), s)
  } finally {
    o || (i.end?.(), n.inlineEffectRunner?.flush())
  }
}
function Kv(e, t) {
  ta(e, t)
  let r = 0
  for (; Oa(e); ) {
    if (r === yf) throw new w(103, !1)
    r++, ta(e, 1)
  }
}
function Jv(e, t, r, n) {
  let i = t[E]
  if ((i & 256) === 256) return
  let o = !1
  !o && t[$e].inlineEffectRunner?.flush(), Fa(t)
  let s = null,
    a = null
  !o && Xv(e) && ((a = Wv(t)), (s = Xo(a)))
  try {
    fd(t), pm(e.bindingStartIndex), r !== null && nf(e, t, r, 2, n)
    let u = (i & 3) === 3
    if (!o)
      if (u) {
        let d = e.preOrderCheckHooks
        d !== null && Mi(t, d, null)
      } else {
        let d = e.preOrderHooks
        d !== null && _i(t, d, 0, null), Is(t, 0)
      }
    if ((ey(t), wf(t, 0), e.contentQueries !== null && hf(e, t), !o))
      if (u) {
        let d = e.contentCheckHooks
        d !== null && Mi(t, d)
      } else {
        let d = e.contentHooks
        d !== null && _i(t, d, 1), Is(t, 1)
      }
    yv(e, t)
    let c = e.components
    c !== null && Ef(t, c, 0)
    let l = e.viewQuery
    if ((l !== null && ea(2, l, n), !o))
      if (u) {
        let d = e.viewCheckHooks
        d !== null && Mi(t, d)
      } else {
        let d = e.viewHooks
        d !== null && _i(t, d, 2), Is(t, 2)
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[Es])) {
      for (let d of t[Es]) d()
      t[Es] = null
    }
    o || (t[E] &= -73)
  } catch (u) {
    throw (rr(t), u)
  } finally {
    a !== null && (es(a, s), Yv(a)), Pa()
  }
}
function Xv(e) {
  return e.type !== 2
}
function wf(e, t) {
  for (let r = Ud(e); r !== null; r = $d(r))
    for (let n = le; n < r.length; n++) {
      let i = r[n]
      Cf(i, t)
    }
}
function ey(e) {
  for (let t = Ud(e); t !== null; t = $d(t)) {
    if (!(t[E] & Aa.HasTransplantedViews)) continue
    let r = t[Fi]
    for (let n = 0; n < r.length; n++) {
      let i = r[n],
        o = i[re]
      rm(i)
    }
  }
}
function ty(e, t, r) {
  let n = ft(t, e)
  Cf(n, r)
}
function Cf(e, t) {
  Ra(e) && ta(e, t)
}
function ta(e, t) {
  let n = e[A],
    i = e[E],
    o = e[St],
    s = !!(t === 0 && i & 16)
  if (
    ((s ||= !!(i & 64 && t === 0)),
    (s ||= !!(i & 1024)),
    (s ||= !!(o?.dirty && ts(o))),
    o && (o.dirty = !1),
    (e[E] &= -9217),
    s)
  )
    Jv(n, e, n.template, e[ce])
  else if (i & 8192) {
    wf(e, 1)
    let a = n.components
    a !== null && Ef(e, a, 1)
  }
}
function Ef(e, t, r) {
  for (let n = 0; n < t.length; n++) ty(e, t[n], r)
}
function eu(e) {
  for (e[$e].changeDetectionScheduler?.notify(); e; ) {
    e[E] |= 64
    let t = ir(e)
    if (Zg(e) && !t) return e
    e = t
  }
  return null
}
var yn = class {
  get rootNodes() {
    let t = this._lView,
      r = t[A]
    return Ui(r, t, r.firstChild, [])
  }
  constructor(t, r, n = !0) {
    ;(this._lView = t),
      (this._cdRefInjectingView = r),
      (this.notifyErrorHandler = n),
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
    return (this._lView[E] & 256) === 256
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this)
    else if (this._attachedToViewContainer) {
      let t = this._lView[re]
      if (et(t)) {
        let r = t[Oi],
          n = r ? r.indexOf(this) : -1
        n > -1 && (or(t, n), Ni(r, n))
      }
      this._attachedToViewContainer = !1
    }
    to(this._lView[A], this._lView)
  }
  onDestroy(t) {
    hd(this._lView, t)
  }
  markForCheck() {
    eu(this._cdRefInjectingView || this._lView)
  }
  detach() {
    this._lView[E] &= -129
  }
  reattach() {
    Hs(this._lView), (this._lView[E] |= 128)
  }
  detectChanges() {
    ;(this._lView[E] |= 1024), Df(this._lView, this.notifyErrorHandler)
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new w(902, !1)
    this._attachedToViewContainer = !0
  }
  detachFromAppRef() {
    ;(this._appRef = null), Wd(this._lView[A], this._lView)
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new w(902, !1)
    ;(this._appRef = t), Hs(this._lView)
  }
}
var YS = new RegExp(`^(\\d+)*(${Wm}|${qm})*(.*)`)
var ny = () => null
function ar(e, t) {
  return ny(e, t)
}
var na = class {},
  ra = class {},
  $i = class {}
function ry(e) {
  let t = Error(`No component factory found for ${fe(e)}.`)
  return (t[iy] = e), t
}
var iy = 'ngComponent'
var ia = class {
    resolveComponentFactory(t) {
      throw ry(t)
    }
  },
  ao = (() => {
    let t = class t {}
    t.NULL = new ia()
    let e = t
    return e
  })(),
  ur = class {},
  Sn = (() => {
    let t = class t {
      constructor() {
        this.destroyNode = null
      }
    }
    t.__NG_ELEMENT_ID__ = () => oy()
    let e = t
    return e
  })()
function oy() {
  let e = B(),
    t = _e(),
    r = ft(t.index, e)
  return (bt(r) ? r : e)[K]
}
var sy = (() => {
    let t = class t {}
    t.ɵprov = D({ token: t, providedIn: 'root', factory: () => null })
    let e = t
    return e
  })(),
  Ts = {}
var El = new Set()
function Lt(e) {
  El.has(e) ||
    (El.add(e),
    performance?.mark?.('mark_feature_usage', { detail: { feature: e } }))
}
function Il(...e) {}
function ay() {
  let e = typeof Yn.requestAnimationFrame == 'function',
    t = Yn[e ? 'requestAnimationFrame' : 'setTimeout'],
    r = Yn[e ? 'cancelAnimationFrame' : 'clearTimeout']
  if (typeof Zone < 'u' && t && r) {
    let n = t[Zone.__symbol__('OriginalDelegate')]
    n && (t = n)
    let i = r[Zone.__symbol__('OriginalDelegate')]
    i && (r = i)
  }
  return { nativeRequestAnimationFrame: t, nativeCancelAnimationFrame: r }
}
var q = class e {
    constructor({
      enableLongStackTrace: t = !1,
      shouldCoalesceEventChangeDetection: r = !1,
      shouldCoalesceRunChangeDetection: n = !1,
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
        (i.shouldCoalesceEventChangeDetection = !n && r),
        (i.shouldCoalesceRunChangeDetection = n),
        (i.lastRequestAnimationFrameId = -1),
        (i.nativeRequestAnimationFrame = ay().nativeRequestAnimationFrame),
        ly(i)
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
    run(t, r, n) {
      return this._inner.run(t, r, n)
    }
    runTask(t, r, n, i) {
      let o = this._inner,
        s = o.scheduleEventTask('NgZoneEvent: ' + i, t, uy, Il, Il)
      try {
        return o.runTask(s, r, n)
      } finally {
        o.cancelTask(s)
      }
    }
    runGuarded(t, r, n) {
      return this._inner.runGuarded(t, r, n)
    }
    runOutsideAngular(t) {
      return this._outer.run(t)
    }
  },
  uy = {}
function tu(e) {
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
function cy(e) {
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
                oa(e),
                (e.isCheckStableRunning = !0),
                tu(e),
                (e.isCheckStableRunning = !1)
            },
            void 0,
            () => {},
            () => {},
          )),
          e.fakeTopEventTask.invoke()
      },
    )),
    oa(e))
}
function ly(e) {
  let t = () => {
    cy(e)
  }
  e._inner = e._inner.fork({
    name: 'angular',
    properties: { isAngularZone: !0 },
    onInvokeTask: (r, n, i, o, s, a) => {
      if (dy(a)) return r.invokeTask(i, o, s, a)
      try {
        return bl(e), r.invokeTask(i, o, s, a)
      } finally {
        ;((e.shouldCoalesceEventChangeDetection && o.type === 'eventTask') ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          Ml(e)
      }
    },
    onInvoke: (r, n, i, o, s, a, u) => {
      try {
        return bl(e), r.invoke(i, o, s, a, u)
      } finally {
        e.shouldCoalesceRunChangeDetection && t(), Ml(e)
      }
    },
    onHasTask: (r, n, i, o) => {
      r.hasTask(i, o),
        n === i &&
          (o.change == 'microTask'
            ? ((e._hasPendingMicrotasks = o.microTask), oa(e), tu(e))
            : o.change == 'macroTask' && (e.hasPendingMacrotasks = o.macroTask))
    },
    onHandleError: (r, n, i, o) => (
      r.handleError(i, o), e.runOutsideAngular(() => e.onError.emit(o)), !1
    ),
  })
}
function oa(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.lastRequestAnimationFrameId !== -1)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1)
}
function bl(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null))
}
function Ml(e) {
  e._nesting--, tu(e)
}
function dy(e) {
  return !Array.isArray(e) || e.length !== 1
    ? !1
    : e[0].data?.__ignore_ng_zone__ === !0
}
var If = (() => {
  let t = class t {
    constructor() {
      ;(this.handler = null), (this.internalCallbacks = [])
    }
    execute() {
      this.executeInternalCallbacks(), this.handler?.execute()
    }
    executeInternalCallbacks() {
      let n = [...this.internalCallbacks]
      this.internalCallbacks.length = 0
      for (let i of n) i()
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
function sa(e, t, r) {
  let n = r ? e.styles : null,
    i = r ? e.classes : null,
    o = 0
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s]
      if (typeof a == 'number') o = a
      else if (o == 1) i = el(i, a)
      else if (o == 2) {
        let u = a,
          c = t[++s]
        n = el(n, u + ': ' + c + ';')
      }
    }
  r ? (e.styles = n) : (e.stylesWithoutHost = n),
    r ? (e.classes = i) : (e.classesWithoutHost = i)
}
var Bi = class extends ao {
  constructor(t) {
    super(), (this.ngModule = t)
  }
  resolveComponentFactory(t) {
    let r = _t(t)
    return new cr(r, this.ngModule)
  }
}
function _l(e) {
  let t = []
  for (let r in e) {
    if (!e.hasOwnProperty(r)) continue
    let n = e[r]
    n !== void 0 &&
      t.push({ propName: Array.isArray(n) ? n[0] : n, templateName: r })
  }
  return t
}
function fy(e) {
  let t = e.toLowerCase()
  return t === 'svg' ? Jg : t === 'math' ? Xg : null
}
var aa = class {
    constructor(t, r) {
      ;(this.injector = t), (this.parentInjector = r)
    }
    get(t, r, n) {
      n = Qi(n)
      let i = this.injector.get(t, Ts, n)
      return i !== Ts || r === Ts ? i : this.parentInjector.get(t, r, n)
    }
  },
  cr = class extends $i {
    get inputs() {
      let t = this.componentDef,
        r = t.inputTransforms,
        n = _l(t.inputs)
      if (r !== null)
        for (let i of n)
          r.hasOwnProperty(i.propName) && (i.transform = r[i.propName])
      return n
    }
    get outputs() {
      return _l(this.componentDef.outputs)
    }
    constructor(t, r) {
      super(),
        (this.componentDef = t),
        (this.ngModule = r),
        (this.componentType = t.type),
        (this.selector = xg(t.selectors)),
        (this.ngContentSelectors = t.ngContentSelectors
          ? t.ngContentSelectors
          : []),
        (this.isBoundToModule = !!r)
    }
    create(t, r, n, i) {
      let o = O(null)
      try {
        i = i || this.ngModule
        let s = i instanceof he ? i : i?.injector
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s)
        let a = s ? new aa(t, s) : t,
          u = a.get(ur, null)
        if (u === null) throw new w(407, !1)
        let c = a.get(sy, null),
          l = a.get(If, null),
          d = a.get(na, null),
          f = {
            rendererFactory: u,
            sanitizer: c,
            inlineEffectRunner: null,
            afterRenderEventManager: l,
            changeDetectionScheduler: d,
          },
          h = u.createRenderer(null, this.componentDef),
          m = this.componentDef.selectors[0][0] || 'div',
          b = n
            ? Cv(h, n, this.componentDef.encapsulation, a)
            : qd(h, m, fy(m)),
          y = 512
        this.componentDef.signals
          ? (y |= 4096)
          : this.componentDef.onPush || (y |= 16)
        let v = null
        b !== null && (v = za(b, a, !0))
        let ne = Qa(0, null, null, 1, 0, null, null, null, null, null, null),
          X = ro(null, ne, null, y, null, null, f, h, a, null, v)
        Fa(X)
        let $, ke
        try {
          let ge = this.componentDef,
            rt,
            Yo = null
          ge.findHostDirectiveDefs
            ? ((rt = []),
              (Yo = new Map()),
              ge.findHostDirectiveDefs(ge, rt, Yo),
              rt.push(ge))
            : (rt = [ge])
          let pp = hy(X, b),
            gp = py(pp, b, ge, rt, X, f, h)
          ;(ke = Na(ne, Oe)),
            b && vy(h, ge, b, n),
            r !== void 0 && yy(ke, this.ngContentSelectors, r),
            ($ = my(gp, ge, rt, Yo, X, [Dy])),
            Ja(ne, X, null)
        } finally {
          Pa()
        }
        return new ua(this.componentType, $, Ua(ke, X), X, ke)
      } finally {
        O(o)
      }
    }
  },
  ua = class extends ra {
    constructor(t, r, n, i, o) {
      super(),
        (this.location = n),
        (this._rootLView = i),
        (this._tNode = o),
        (this.previousInputValues = null),
        (this.instance = r),
        (this.hostView = this.changeDetectorRef = new yn(i, void 0, !1)),
        (this.componentType = t)
    }
    setInput(t, r) {
      let n = this._tNode.inputs,
        i
      if (n !== null && (i = n[t])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(t) &&
            Object.is(this.previousInputValues.get(t), r))
        )
          return
        let o = this._rootLView
        Ka(o[A], o, i, t, r), this.previousInputValues.set(t, r)
        let s = ft(this._tNode.index, o)
        eu(s)
      }
    }
    get injector() {
      return new Mt(this._tNode, this._rootLView)
    }
    destroy() {
      this.hostView.destroy()
    }
    onDestroy(t) {
      this.hostView.onDestroy(t)
    }
  }
function hy(e, t) {
  let r = e[A],
    n = Oe
  return (e[n] = t), io(r, n, 2, '#host', null)
}
function py(e, t, r, n, i, o, s) {
  let a = i[A]
  gy(n, e, t, s)
  let u = null
  t !== null && (u = za(t, i[gn]))
  let c = o.rendererFactory.createRenderer(t, r),
    l = 16
  r.signals ? (l = 4096) : r.onPush && (l = 64)
  let d = ro(i, af(r), null, l, i[e.index], e, o, c, null, null, u)
  return a.firstCreatePass && Xs(a, e, n.length - 1), oo(i, d), (i[e.index] = d)
}
function gy(e, t, r, n) {
  for (let i of e) t.mergedAttrs = Jn(t.mergedAttrs, i.hostAttrs)
  t.mergedAttrs !== null &&
    (sa(t, t.mergedAttrs, !0), r !== null && Jd(n, r, t))
}
function my(e, t, r, n, i, o) {
  let s = _e(),
    a = i[A],
    u = Pe(s, i)
  lf(a, i, s, r, null, n)
  for (let l = 0; l < r.length; l++) {
    let d = s.directiveStart + l,
      f = vn(i, a, d, s)
    Nt(f, i)
  }
  df(a, i, s), u && Nt(u, i)
  let c = vn(i, a, s.directiveStart + s.componentOffset, s)
  if (((e[ce] = i[ce] = c), o !== null)) for (let l of o) l(c, t)
  return rf(a, s, i), c
}
function vy(e, t, r, n) {
  if (n) Vs(e, r, ['ng-version', '17.3.5'])
  else {
    let { attrs: i, classes: o } = Ng(t.selectors[0])
    i && Vs(e, r, i), o && o.length > 0 && Kd(e, r, o.join(' '))
  }
}
function yy(e, t, r) {
  let n = (e.projection = [])
  for (let i = 0; i < t.length; i++) {
    let o = r[i]
    n.push(o != null ? Array.from(o) : null)
  }
}
function Dy() {
  let e = _e()
  Va(B()[A], e)
}
var uo = (() => {
  let t = class t {}
  t.__NG_ELEMENT_ID__ = wy
  let e = t
  return e
})()
function wy() {
  let e = _e()
  return Ey(e, B())
}
var Cy = uo,
  bf = class extends Cy {
    constructor(t, r, n) {
      super(),
        (this._lContainer = t),
        (this._hostTNode = r),
        (this._hostLView = n)
    }
    get element() {
      return Ua(this._hostTNode, this._hostLView)
    }
    get injector() {
      return new Mt(this._hostTNode, this._hostLView)
    }
    get parentInjector() {
      let t = ja(this._hostTNode, this._hostLView)
      if (_d(t)) {
        let r = Li(t, this._hostLView),
          n = ki(t),
          i = r[A].data[n + 8]
        return new Mt(i, r)
      } else return new Mt(null, this._hostLView)
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1)
    }
    get(t) {
      let r = Sl(this._lContainer)
      return (r !== null && r[t]) || null
    }
    get length() {
      return this._lContainer.length - le
    }
    createEmbeddedView(t, r, n) {
      let i, o
      typeof n == 'number'
        ? (i = n)
        : n != null && ((i = n.index), (o = n.injector))
      let s = ar(this._lContainer, t.ssrId),
        a = t.createEmbeddedViewImpl(r || {}, o, s)
      return this.insertImpl(a, i, sr(this._hostTNode, s)), a
    }
    createComponent(t, r, n, i, o) {
      let s = t && !Wg(t),
        a
      if (s) a = r
      else {
        let m = r || {}
        ;(a = m.index),
          (n = m.injector),
          (i = m.projectableNodes),
          (o = m.environmentInjector || m.ngModuleRef)
      }
      let u = s ? t : new cr(_t(t)),
        c = n || this.parentInjector
      if (!o && u.ngModule == null) {
        let b = (s ? c : this.parentInjector).get(he, null)
        b && (o = b)
      }
      let l = _t(u.componentType ?? {}),
        d = ar(this._lContainer, l?.id ?? null),
        f = d?.firstChild ?? null,
        h = u.create(c, i, f, o)
      return this.insertImpl(h.hostView, a, sr(this._hostTNode, d)), h
    }
    insert(t, r) {
      return this.insertImpl(t, r, !0)
    }
    insertImpl(t, r, n) {
      let i = t._lView
      if (nm(i)) {
        let a = this.indexOf(t)
        if (a !== -1) this.detach(a)
        else {
          let u = i[re],
            c = new bf(u, u[Fe], u[re])
          c.detach(c.indexOf(t))
        }
      }
      let o = this._adjustIndex(r),
        s = this._lContainer
      return so(s, i, o, n), t.attachToViewContainerRef(), Hl(As(s), o, t), t
    }
    move(t, r) {
      return this.insert(t, r)
    }
    indexOf(t) {
      let r = Sl(this._lContainer)
      return r !== null ? r.indexOf(t) : -1
    }
    remove(t) {
      let r = this._adjustIndex(t, -1),
        n = or(this._lContainer, r)
      n && (Ni(As(this._lContainer), r), to(n[A], n))
    }
    detach(t) {
      let r = this._adjustIndex(t, -1),
        n = or(this._lContainer, r)
      return n && Ni(As(this._lContainer), r) != null ? new yn(n) : null
    }
    _adjustIndex(t, r = 0) {
      return t ?? this.length + r
    }
  }
function Sl(e) {
  return e[Oi]
}
function As(e) {
  return e[Oi] || (e[Oi] = [])
}
function Ey(e, t) {
  let r,
    n = t[e.index]
  return (
    et(n) ? (r = n) : ((r = ff(n, t, null, e)), (t[e.index] = r), oo(t, r)),
    by(r, t, e, n),
    new bf(r, e, t)
  )
}
function Iy(e, t) {
  let r = e[K],
    n = r.createComment(''),
    i = Pe(t, e),
    o = Wa(r, i)
  return ji(r, o, n, cv(r, i), !1), n
}
var by = Sy,
  My = () => !1
function _y(e, t, r) {
  return My(e, t, r)
}
function Sy(e, t, r, n) {
  if (e[Tt]) return
  let i
  r.type & 8 ? (i = Be(n)) : (i = Iy(t, r)), (e[Tt] = i)
}
function Ty(e) {
  return typeof e == 'function' && e[We] !== void 0
}
function co(e, t) {
  Lt('NgSignals')
  let r = Sc(e),
    n = r[We]
  return (
    t?.equal && (n.equal = t.equal),
    (r.set = (i) => ns(n, i)),
    (r.update = (i) => Tc(n, i)),
    (r.asReadonly = Ay.bind(r)),
    r
  )
}
function Ay() {
  let e = this[We]
  if (e.readonlyFn === void 0) {
    let t = () => this()
    ;(t[We] = e), (e.readonlyFn = t)
  }
  return e.readonlyFn
}
function Mf(e) {
  return Ty(e) && typeof e.set == 'function'
}
function xy(e) {
  return Object.getPrototypeOf(e.prototype).constructor
}
function Vt(e) {
  let t = xy(e.type),
    r = !0,
    n = [e]
  for (; t; ) {
    let i
    if (ct(e)) i = t.ɵcmp || t.ɵdir
    else {
      if (t.ɵcmp) throw new w(903, !1)
      i = t.ɵdir
    }
    if (i) {
      if (r) {
        n.push(i)
        let s = e
        ;(s.inputs = Ei(e.inputs)),
          (s.inputTransforms = Ei(e.inputTransforms)),
          (s.declaredInputs = Ei(e.declaredInputs)),
          (s.outputs = Ei(e.outputs))
        let a = i.hostBindings
        a && Py(e, a)
        let u = i.viewQuery,
          c = i.contentQueries
        if (
          (u && Oy(e, u),
          c && Fy(e, c),
          Ny(e, i),
          Qp(e.outputs, i.outputs),
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
          a && a.ngInherit && a(e), a === Vt && (r = !1)
        }
    }
    t = Object.getPrototypeOf(t)
  }
  Ry(n)
}
function Ny(e, t) {
  for (let r in t.inputs) {
    if (!t.inputs.hasOwnProperty(r) || e.inputs.hasOwnProperty(r)) continue
    let n = t.inputs[r]
    if (
      n !== void 0 &&
      ((e.inputs[r] = n),
      (e.declaredInputs[r] = t.declaredInputs[r]),
      t.inputTransforms !== null)
    ) {
      let i = Array.isArray(n) ? n[0] : n
      if (!t.inputTransforms.hasOwnProperty(i)) continue
      ;(e.inputTransforms ??= {}), (e.inputTransforms[i] = t.inputTransforms[i])
    }
  }
}
function Ry(e) {
  let t = 0,
    r = null
  for (let n = e.length - 1; n >= 0; n--) {
    let i = e[n]
    ;(i.hostVars = t += i.hostVars),
      (i.hostAttrs = Jn(i.hostAttrs, (r = Jn(r, i.hostAttrs))))
  }
}
function Ei(e) {
  return e === fn ? {} : e === Ie ? [] : e
}
function Oy(e, t) {
  let r = e.viewQuery
  r
    ? (e.viewQuery = (n, i) => {
        t(n, i), r(n, i)
      })
    : (e.viewQuery = t)
}
function Fy(e, t) {
  let r = e.contentQueries
  r
    ? (e.contentQueries = (n, i, o) => {
        t(n, i, o), r(n, i, o)
      })
    : (e.contentQueries = t)
}
function Py(e, t) {
  let r = e.hostBindings
  r
    ? (e.hostBindings = (n, i) => {
        t(n, i), r(n, i)
      })
    : (e.hostBindings = t)
}
var lt = class {},
  lr = class {}
var ca = class extends lt {
    constructor(t, r, n) {
      super(),
        (this._parent = r),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new Bi(this))
      let i = Kl(t)
      ;(this._bootstrapComponents = Gd(i.bootstrap)),
        (this._r3Injector = Pd(
          t,
          r,
          [
            { provide: lt, useValue: this },
            { provide: ao, useValue: this.componentFactoryResolver },
            ...n,
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
        this.destroyCbs.forEach((r) => r()),
        (this.destroyCbs = null)
    }
    onDestroy(t) {
      this.destroyCbs.push(t)
    }
  },
  la = class extends lr {
    constructor(t) {
      super(), (this.moduleType = t)
    }
    create(t) {
      return new ca(this.moduleType, t, [])
    }
  }
var Hi = class extends lt {
  constructor(t) {
    super(),
      (this.componentFactoryResolver = new Bi(this)),
      (this.instance = null)
    let r = new Xn(
      [
        ...t.providers,
        { provide: lt, useValue: this },
        { provide: ao, useValue: this.componentFactoryResolver },
      ],
      t.parent || Ta(),
      t.debugName,
      new Set(['environment']),
    )
    ;(this.injector = r),
      t.runEnvironmentInitializers && r.resolveInjectorInitializers()
  }
  destroy() {
    this.injector.destroy()
  }
  onDestroy(t) {
    this.injector.onDestroy(t)
  }
}
function nu(e, t, r = null) {
  return new Hi({
    providers: e,
    parent: t,
    debugName: r,
    runEnvironmentInitializers: !0,
  }).injector
}
var Tn = (() => {
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
      let n = this.taskId++
      return this.pendingTasks.add(n), n
    }
    remove(n) {
      this.pendingTasks.delete(n),
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
function An(e, t, r) {
  let n = e[t]
  return Object.is(n, r) ? !1 : ((e[t] = r), !0)
}
function ky(e) {
  return (e.flags & 32) === 32
}
function Ly(e, t, r, n, i, o, s, a, u) {
  let c = t.consts,
    l = io(t, e, 4, s || null, Pi(c, a))
  cf(t, r, l, Pi(c, u)), Va(t, l)
  let d = (l.tView = Qa(
    2,
    l,
    n,
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
function dr(e, t, r, n, i, o, s, a) {
  let u = B(),
    c = Me(),
    l = e + Oe,
    d = c.firstCreatePass ? Ly(l, c, u, t, r, n, i, o, s) : c.data[l]
  pr(d, !1)
  let f = Vy(c, u, d, e)
  ka() && Za(c, u, f, d), Nt(f, u)
  let h = ff(f, u, f, d)
  return (
    (u[l] = h),
    oo(u, h),
    _y(h, d, u),
    xa(d) && of(c, u, d),
    s != null && sf(u, d, a),
    dr
  )
}
var Vy = jy
function jy(e, t, r, n) {
  return La(!0), t[K].createComment('')
}
function Uy(e, t, r, n) {
  return An(e, gr(), r) ? t + Ul(r) + n : _n
}
function Ii(e, t) {
  return (e << 17) | (t << 2)
}
function Rt(e) {
  return (e >> 17) & 32767
}
function $y(e) {
  return (e & 2) == 2
}
function By(e, t) {
  return (e & 131071) | (t << 17)
}
function da(e) {
  return e | 2
}
function Dn(e) {
  return (e & 131068) >> 2
}
function xs(e, t) {
  return (e & -131069) | (t << 2)
}
function Hy(e) {
  return (e & 1) === 1
}
function fa(e) {
  return e | 1
}
function zy(e, t, r, n, i, o) {
  let s = o ? t.classBindings : t.styleBindings,
    a = Rt(s),
    u = Dn(s)
  e[n] = r
  let c = !1,
    l
  if (Array.isArray(r)) {
    let d = r
    ;(l = d[1]), (l === null || hr(d, l) > 0) && (c = !0)
  } else l = r
  if (i)
    if (u !== 0) {
      let f = Rt(e[a + 1])
      ;(e[n + 1] = Ii(f, a)),
        f !== 0 && (e[f + 1] = xs(e[f + 1], n)),
        (e[a + 1] = By(e[a + 1], n))
    } else
      (e[n + 1] = Ii(a, 0)), a !== 0 && (e[a + 1] = xs(e[a + 1], n)), (a = n)
  else
    (e[n + 1] = Ii(u, 0)),
      a === 0 ? (a = n) : (e[u + 1] = xs(e[u + 1], n)),
      (u = n)
  c && (e[n + 1] = da(e[n + 1])),
    Tl(e, l, n, !0),
    Tl(e, l, n, !1),
    Gy(t, l, e, n, o),
    (s = Ii(a, u)),
    o ? (t.classBindings = s) : (t.styleBindings = s)
}
function Gy(e, t, r, n, i) {
  let o = i ? e.residualClasses : e.residualStyles
  o != null &&
    typeof t == 'string' &&
    hr(o, t) >= 0 &&
    (r[n + 1] = fa(r[n + 1]))
}
function Tl(e, t, r, n) {
  let i = e[r + 1],
    o = t === null,
    s = n ? Rt(i) : Dn(i),
    a = !1
  for (; s !== 0 && (a === !1 || o); ) {
    let u = e[s],
      c = e[s + 1]
    qy(u, t) && ((a = !0), (e[s + 1] = n ? fa(c) : da(c))),
      (s = n ? Rt(c) : Dn(c))
  }
  a && (e[r + 1] = n ? da(i) : fa(i))
}
function qy(e, t) {
  return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t
    ? !0
    : Array.isArray(e) && typeof t == 'string'
      ? hr(e, t) >= 0
      : !1
}
function jt(e, t, r) {
  let n = B(),
    i = gr()
  if (An(n, i, t)) {
    let o = Me(),
      s = Id()
    uf(o, s, n, e, t, n[K], r, !1)
  }
  return jt
}
function Al(e, t, r, n, i) {
  let o = t.inputs,
    s = i ? 'class' : 'style'
  Ka(e, r, o[s], s, n)
}
function ru(e, t) {
  return Wy(e, t, null, !0), ru
}
function Wy(e, t, r, n) {
  let i = B(),
    o = Me(),
    s = gm(2)
  if ((o.firstUpdatePass && Yy(o, e, s, n), t !== _n && An(i, s, t))) {
    let a = o.data[Pt()]
    eD(o, a, i, i[K], e, (i[s + 1] = tD(t, r)), n, s)
  }
}
function Zy(e, t) {
  return t >= e.expandoStartIndex
}
function Yy(e, t, r, n) {
  let i = e.data
  if (i[r + 1] === null) {
    let o = i[Pt()],
      s = Zy(e, r)
    nD(o, n) && t === null && !s && (t = !1),
      (t = Qy(i, o, t, n)),
      zy(i, o, t, r, s, n)
  }
}
function Qy(e, t, r, n) {
  let i = Dm(e),
    o = n ? t.residualClasses : t.residualStyles
  if (i === null)
    (n ? t.classBindings : t.styleBindings) === 0 &&
      ((r = Ns(null, e, t, r, n)), (r = fr(r, t.attrs, n)), (o = null))
  else {
    let s = t.directiveStylingLast
    if (s === -1 || e[s] !== i)
      if (((r = Ns(i, e, t, r, n)), o === null)) {
        let u = Ky(e, t, n)
        u !== void 0 &&
          Array.isArray(u) &&
          ((u = Ns(null, e, t, u[1], n)),
          (u = fr(u, t.attrs, n)),
          Jy(e, t, n, u))
      } else o = Xy(e, t, n)
  }
  return (
    o !== void 0 && (n ? (t.residualClasses = o) : (t.residualStyles = o)), r
  )
}
function Ky(e, t, r) {
  let n = r ? t.classBindings : t.styleBindings
  if (Dn(n) !== 0) return e[Rt(n)]
}
function Jy(e, t, r, n) {
  let i = r ? t.classBindings : t.styleBindings
  e[Rt(i)] = n
}
function Xy(e, t, r) {
  let n,
    i = t.directiveEnd
  for (let o = 1 + t.directiveStylingLast; o < i; o++) {
    let s = e[o].hostAttrs
    n = fr(n, s, r)
  }
  return fr(n, t.attrs, r)
}
function Ns(e, t, r, n, i) {
  let o = null,
    s = r.directiveEnd,
    a = r.directiveStylingLast
  for (
    a === -1 ? (a = r.directiveStart) : a++;
    a < s && ((o = t[a]), (n = fr(n, o.hostAttrs, i)), o !== e);

  )
    a++
  return e !== null && (r.directiveStylingLast = a), n
}
function fr(e, t, r) {
  let n = r ? 1 : 2,
    i = -1
  if (t !== null)
    for (let o = 0; o < t.length; o++) {
      let s = t[o]
      typeof s == 'number'
        ? (i = s)
        : i === n &&
          (Array.isArray(e) || (e = e === void 0 ? [] : ['', e]),
          vg(e, s, r ? !0 : t[++o]))
    }
  return e === void 0 ? null : e
}
function eD(e, t, r, n, i, o, s, a) {
  if (!(t.type & 3)) return
  let u = e.data,
    c = u[a + 1],
    l = Hy(c) ? xl(u, t, r, i, Dn(c), s) : void 0
  if (!zi(l)) {
    zi(o) || ($y(c) && (o = xl(u, null, r, i, a, s)))
    let d = dd(Pt(), r)
    mv(n, s, d, i, o)
  }
}
function xl(e, t, r, n, i, o) {
  let s = t === null,
    a
  for (; i > 0; ) {
    let u = e[i],
      c = Array.isArray(u),
      l = c ? u[1] : u,
      d = l === null,
      f = r[i + 1]
    f === _n && (f = d ? Ie : void 0)
    let h = d ? ws(f, n) : l === n ? f : void 0
    if ((c && !zi(h) && (h = ws(u, n)), zi(h) && ((a = h), s))) return a
    let m = e[i + 1]
    i = s ? Rt(m) : Dn(m)
  }
  if (t !== null) {
    let u = o ? t.residualClasses : t.residualStyles
    u != null && (a = ws(u, n))
  }
  return a
}
function zi(e) {
  return e !== void 0
}
function tD(e, t) {
  return (
    e == null ||
      e === '' ||
      (typeof t == 'string'
        ? (e = e + t)
        : typeof e == 'object' && (e = fe(Ga(e)))),
    e
  )
}
function nD(e, t) {
  return (e.flags & (t ? 8 : 16)) !== 0
}
var ha = class {
  destroy(t) {}
  updateValue(t, r) {}
  swap(t, r) {
    let n = Math.min(t, r),
      i = Math.max(t, r),
      o = this.detach(i)
    if (i - n > 1) {
      let s = this.detach(n)
      this.attach(n, o), this.attach(i, s)
    } else this.attach(n, o)
  }
  move(t, r) {
    this.attach(r, this.detach(t))
  }
}
function Rs(e, t, r, n, i) {
  return e === r && Object.is(t, n) ? 1 : Object.is(i(e, t), i(r, n)) ? -1 : 0
}
function rD(e, t, r) {
  let n,
    i,
    o = 0,
    s = e.length - 1
  if (Array.isArray(t)) {
    let a = t.length - 1
    for (; o <= s && o <= a; ) {
      let u = e.at(o),
        c = t[o],
        l = Rs(o, u, o, c, r)
      if (l !== 0) {
        l < 0 && e.updateValue(o, c), o++
        continue
      }
      let d = e.at(s),
        f = t[a],
        h = Rs(s, d, a, f, r)
      if (h !== 0) {
        h < 0 && e.updateValue(s, f), s--, a--
        continue
      }
      let m = r(o, u),
        b = r(s, d),
        y = r(o, c)
      if (Object.is(y, b)) {
        let v = r(a, f)
        Object.is(v, m)
          ? (e.swap(o, s), e.updateValue(s, f), a--, s--)
          : e.move(s, o),
          e.updateValue(o, c),
          o++
        continue
      }
      if (((n ??= new Gi()), (i ??= Rl(e, o, s, r)), pa(e, n, o, y)))
        e.updateValue(o, c), o++, s++
      else if (i.has(y)) n.set(m, e.detach(o)), s--
      else {
        let v = e.create(o, t[o])
        e.attach(o, v), o++, s++
      }
    }
    for (; o <= a; ) Nl(e, n, r, o, t[o]), o++
  } else if (t != null) {
    let a = t[Symbol.iterator](),
      u = a.next()
    for (; !u.done && o <= s; ) {
      let c = e.at(o),
        l = u.value,
        d = Rs(o, c, o, l, r)
      if (d !== 0) d < 0 && e.updateValue(o, l), o++, (u = a.next())
      else {
        ;(n ??= new Gi()), (i ??= Rl(e, o, s, r))
        let f = r(o, l)
        if (pa(e, n, o, f)) e.updateValue(o, l), o++, s++, (u = a.next())
        else if (!i.has(f))
          e.attach(o, e.create(o, l)), o++, s++, (u = a.next())
        else {
          let h = r(o, c)
          n.set(h, e.detach(o)), s--
        }
      }
    }
    for (; !u.done; ) Nl(e, n, r, e.length, u.value), (u = a.next())
  }
  for (; o <= s; ) e.destroy(e.detach(s--))
  n?.forEach((a) => {
    e.destroy(a)
  })
}
function pa(e, t, r, n) {
  return t !== void 0 && t.has(n)
    ? (e.attach(r, t.get(n)), t.delete(n), !0)
    : !1
}
function Nl(e, t, r, n, i) {
  if (pa(e, t, n, r(n, i))) e.updateValue(n, i)
  else {
    let o = e.create(n, i)
    e.attach(n, o)
  }
}
function Rl(e, t, r, n) {
  let i = new Set()
  for (let o = t; o <= r; o++) i.add(n(o, e.at(o)))
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
    let r = this.kvMap.get(t)
    return (
      this._vMap !== void 0 && this._vMap.has(r)
        ? (this.kvMap.set(t, this._vMap.get(r)), this._vMap.delete(r))
        : this.kvMap.delete(t),
      !0
    )
  }
  get(t) {
    return this.kvMap.get(t)
  }
  set(t, r) {
    if (this.kvMap.has(t)) {
      let n = this.kvMap.get(t)
      this._vMap === void 0 && (this._vMap = new Map())
      let i = this._vMap
      for (; i.has(n); ) n = i.get(n)
      i.set(n, r)
    } else this.kvMap.set(t, r)
  }
  forEach(t) {
    for (let [r, n] of this.kvMap)
      if ((t(n, r), this._vMap !== void 0)) {
        let i = this._vMap
        for (; i.has(n); ) (n = i.get(n)), t(n, r)
      }
  }
}
function _f(e, t, r) {
  Lt('NgControlFlow')
  let n = B(),
    i = gr(),
    o = ya(n, Oe + e),
    s = 0
  if (An(n, i, t)) {
    let a = O(null)
    try {
      if ((mf(o, s), t !== -1)) {
        let u = Da(n[A], Oe + t),
          c = ar(o, u.tView.ssrId),
          l = Xa(n, u, r, { dehydratedView: c })
        so(o, l, s, sr(u, c))
      }
    } finally {
      O(a)
    }
  } else {
    let a = gf(o, s)
    a !== void 0 && (a[ce] = r)
  }
}
var ga = class {
  constructor(t, r, n) {
    ;(this.lContainer = t), (this.$implicit = r), (this.$index = n)
  }
  get $count() {
    return this.lContainer.length - le
  }
}
var ma = class {
  constructor(t, r, n) {
    ;(this.hasEmptyBlock = t), (this.trackByFn = r), (this.liveCollection = n)
  }
}
function Sf(e, t, r, n, i, o, s, a, u, c, l, d, f) {
  Lt('NgControlFlow')
  let h = u !== void 0,
    m = B(),
    b = a ? s.bind(m[Re][ce]) : s,
    y = new ma(h, b)
  ;(m[Oe + e] = y), dr(e + 1, t, r, n, i, o), h && dr(e + 2, u, c, l, d, f)
}
var va = class extends ha {
  constructor(t, r, n) {
    super(),
      (this.lContainer = t),
      (this.hostLView = r),
      (this.templateTNode = n),
      (this.needsIndexUpdate = !1)
  }
  get length() {
    return this.lContainer.length - le
  }
  at(t) {
    return this.getLView(t)[ce].$implicit
  }
  attach(t, r) {
    let n = r[er]
    ;(this.needsIndexUpdate ||= t !== this.length),
      so(this.lContainer, r, t, sr(this.templateTNode, n))
  }
  detach(t) {
    return (
      (this.needsIndexUpdate ||= t !== this.length - 1), iD(this.lContainer, t)
    )
  }
  create(t, r) {
    let n = ar(this.lContainer, this.templateTNode.tView.ssrId)
    return Xa(
      this.hostLView,
      this.templateTNode,
      new ga(this.lContainer, r, t),
      { dehydratedView: n },
    )
  }
  destroy(t) {
    to(t[A], t)
  }
  updateValue(t, r) {
    this.getLView(t)[ce].$implicit = r
  }
  reset() {
    this.needsIndexUpdate = !1
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let t = 0; t < this.length; t++) this.getLView(t)[ce].$index = t
  }
  getLView(t) {
    return oD(this.lContainer, t)
  }
}
function Tf(e) {
  let t = O(null),
    r = Pt()
  try {
    let n = B(),
      i = n[A],
      o = n[r]
    if (o.liveCollection === void 0) {
      let a = r + 1,
        u = ya(n, a),
        c = Da(i, a)
      o.liveCollection = new va(u, n, c)
    } else o.liveCollection.reset()
    let s = o.liveCollection
    if ((rD(s, e, o.trackByFn), s.updateIndexes(), o.hasEmptyBlock)) {
      let a = gr(),
        u = s.length === 0
      if (An(n, a, u)) {
        let c = r + 2,
          l = ya(n, c)
        if (u) {
          let d = Da(i, c),
            f = ar(l, d.tView.ssrId),
            h = Xa(n, d, void 0, { dehydratedView: f })
          so(l, h, 0, sr(d, f))
        } else mf(l, 0)
      }
    }
  } finally {
    O(t)
  }
}
function ya(e, t) {
  return e[t]
}
function iD(e, t) {
  return or(e, t)
}
function oD(e, t) {
  return gf(e, t)
}
function Da(e, t) {
  return Na(e, t)
}
function sD(e, t, r, n, i, o) {
  let s = t.consts,
    a = Pi(s, i),
    u = io(t, e, 2, n, a)
  return (
    cf(t, r, u, Pi(s, o)),
    u.attrs !== null && sa(u, u.attrs, !1),
    u.mergedAttrs !== null && sa(u, u.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, u),
    u
  )
}
function U(e, t, r, n) {
  let i = B(),
    o = Me(),
    s = Oe + e,
    a = i[K],
    u = o.firstCreatePass ? sD(s, o, i, t, r, n) : o.data[s],
    c = aD(o, i, u, a, t, e)
  i[s] = c
  let l = xa(u)
  return (
    pr(u, !0),
    Jd(a, c, u),
    !ky(u) && ka() && Za(o, i, c, u),
    sm() === 0 && Nt(c, i),
    am(),
    l && (of(o, i, u), rf(o, u, i)),
    n !== null && sf(i, u),
    U
  )
}
function j() {
  let e = _e()
  md() ? hm() : ((e = e.parent), pr(e, !1))
  let t = e
  lm(t) && dm(), um()
  let r = Me()
  return (
    r.firstCreatePass && (Va(r, e), sd(e) && r.queries.elementEnd(e)),
    t.classesWithoutHost != null &&
      _m(t) &&
      Al(r, t, B(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      Sm(t) &&
      Al(r, t, B(), t.stylesWithoutHost, !1),
    j
  )
}
function xn(e, t, r, n) {
  return U(e, t, r, n), j(), xn
}
var aD = (e, t, r, n, i, o) => (La(!0), qd(n, i, Em()))
var qi = 'en-US'
var uD = qi
function cD(e) {
  typeof e == 'string' && (uD = e.toLowerCase().replace(/_/g, '-'))
}
function oe(e, t, r, n) {
  let i = B(),
    o = Me(),
    s = _e()
  return Af(o, i, i[K], s, e, t, n), oe
}
function lD(e, t, r, n) {
  let i = e.cleanup
  if (i != null)
    for (let o = 0; o < i.length - 1; o += 2) {
      let s = i[o]
      if (s === r && i[o + 1] === n) {
        let a = t[tr],
          u = i[o + 2]
        return a.length > u ? a[u] : null
      }
      typeof s == 'string' && (o += 2)
    }
  return null
}
function Af(e, t, r, n, i, o, s) {
  let a = xa(n),
    c = e.firstCreatePass && $v(e),
    l = t[ce],
    d = Uv(t),
    f = !0
  if (n.type & 3 || s) {
    let b = Pe(n, t),
      y = s ? s(b) : b,
      v = d.length,
      ne = s ? ($) => s(Be($[n.index])) : n.index,
      X = null
    if ((!s && a && (X = lD(e, t, i, n.index)), X !== null)) {
      let $ = X.__ngLastListenerFn__ || X
      ;($.__ngNextListenerFn__ = o), (X.__ngLastListenerFn__ = o), (f = !1)
    } else {
      o = Fl(n, t, l, o, !1)
      let $ = r.listen(y, i, o)
      d.push(o, $), c && c.push(i, ne, v, v + 1)
    }
  } else o = Fl(n, t, l, o, !1)
  let h = n.outputs,
    m
  if (f && h !== null && (m = h[i])) {
    let b = m.length
    if (b)
      for (let y = 0; y < b; y += 2) {
        let v = m[y],
          ne = m[y + 1],
          ke = t[v][ne].subscribe(o),
          ge = d.length
        d.push(o, ke), c && c.push(i, n.index, ge, -(ge + 1))
      }
  }
}
function Ol(e, t, r, n) {
  let i = O(null)
  try {
    return Ve(6, t, r), r(n) !== !1
  } catch (o) {
    return pf(e, o), !1
  } finally {
    Ve(7, t, r), O(i)
  }
}
function Fl(e, t, r, n, i) {
  return function o(s) {
    if (s === Function) return n
    let a = e.componentOffset > -1 ? ft(e.index, t) : t
    eu(a)
    let u = Ol(t, r, n, s),
      c = o.__ngNextListenerFn__
    for (; c; ) (u = Ol(t, r, c, s) && u), (c = c.__ngNextListenerFn__)
    return i && u === !1 && s.preventDefault(), u
  }
}
function iu(e = 1) {
  return Cm(e)
}
function z(e, t = '') {
  let r = B(),
    n = Me(),
    i = e + Oe,
    o = n.firstCreatePass ? io(n, i, 1, t, null) : n.data[i],
    s = dD(n, r, o, t, e)
  ;(r[i] = s), ka() && Za(n, r, s, o), pr(o, !1)
}
var dD = (e, t, r, n, i) => (La(!0), Km(t[K], n))
function tt(e, t, r) {
  let n = B(),
    i = Uy(n, e, t, r)
  return i !== _n && Bv(n, Pt(), i), tt
}
function mr(e, t, r) {
  Mf(t) && (t = t())
  let n = B(),
    i = gr()
  if (An(n, i, t)) {
    let o = Me(),
      s = Id()
    uf(o, s, n, e, t, n[K], r, !1)
  }
  return mr
}
function lo(e, t) {
  let r = Mf(e)
  return r && e.set(t), r
}
function vr(e, t) {
  let r = B(),
    n = Me(),
    i = _e()
  return Af(n, r, r[K], i, e, t), vr
}
function fD(e, t, r) {
  let n = Me()
  if (n.firstCreatePass) {
    let i = ct(e)
    wa(r, n.data, n.blueprint, i, !0), wa(t, n.data, n.blueprint, i, !1)
  }
}
function wa(e, t, r, n, i) {
  if (((e = ae(e)), Array.isArray(e)))
    for (let o = 0; o < e.length; o++) wa(e[o], t, r, n, i)
  else {
    let o = Me(),
      s = B(),
      a = _e(),
      u = pn(e) ? e : ae(e.provide),
      c = rd(e),
      l = a.providerIndexes & 1048575,
      d = a.directiveStart,
      f = a.providerIndexes >> 20
    if (pn(e) || !e.multi) {
      let h = new xt(c, i, J),
        m = Fs(u, t, i ? l : l + f, d)
      m === -1
        ? (qs(Vi(a, s), o, u),
          Os(o, e, t.length),
          t.push(u),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          r.push(h),
          s.push(h))
        : ((r[m] = h), (s[m] = h))
    } else {
      let h = Fs(u, t, l + f, d),
        m = Fs(u, t, l, l + f),
        b = h >= 0 && r[h],
        y = m >= 0 && r[m]
      if ((i && !y) || (!i && !b)) {
        qs(Vi(a, s), o, u)
        let v = gD(i ? pD : hD, r.length, i, n, c)
        !i && y && (r[m].providerFactory = v),
          Os(o, e, t.length, 0),
          t.push(u),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          r.push(v),
          s.push(v)
      } else {
        let v = xf(r[i ? m : h], c, !i && n)
        Os(o, e, h > -1 ? h : m, v)
      }
      !i && n && y && r[m].componentProviders++
    }
  }
}
function Os(e, t, r, n) {
  let i = pn(t),
    o = jg(t)
  if (i || o) {
    let u = (o ? ae(t.useClass) : t).prototype.ngOnDestroy
    if (u) {
      let c = e.destroyHooks || (e.destroyHooks = [])
      if (!i && t.multi) {
        let l = c.indexOf(r)
        l === -1 ? c.push(r, [n, u]) : c[l + 1].push(n, u)
      } else c.push(r, u)
    }
  }
}
function xf(e, t, r) {
  return r && e.componentProviders++, e.multi.push(t) - 1
}
function Fs(e, t, r, n) {
  for (let i = r; i < n; i++) if (t[i] === e) return i
  return -1
}
function hD(e, t, r, n) {
  return Ca(this.multi, [])
}
function pD(e, t, r, n) {
  let i = this.multi,
    o
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = vn(r, r[A], this.providerFactory.index, n)
    ;(o = a.slice(0, s)), Ca(i, o)
    for (let u = s; u < a.length; u++) o.push(a[u])
  } else (o = []), Ca(i, o)
  return o
}
function Ca(e, t) {
  for (let r = 0; r < e.length; r++) {
    let n = e[r]
    t.push(n())
  }
  return t
}
function gD(e, t, r, n, i) {
  let o = new xt(e, r, J)
  return (
    (o.multi = []),
    (o.index = t),
    (o.componentProviders = 0),
    xf(o, i, n && !r),
    o
  )
}
function pt(e, t = []) {
  return (r) => {
    r.providersResolver = (n, i) => fD(n, i ? i(e) : e, t)
  }
}
var mD = (() => {
  let t = class t {
    constructor(n) {
      ;(this._injector = n), (this.cachedInjectors = new Map())
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null
      if (!this.cachedInjectors.has(n)) {
        let i = ed(!1, n.type),
          o =
            i.length > 0
              ? nu([i], this._injector, `Standalone[${n.type.name}]`)
              : null
        this.cachedInjectors.set(n, o)
      }
      return this.cachedInjectors.get(n)
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy()
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
function gt(e) {
  Lt('NgStandalone'),
    (e.getStandaloneInjector = (t) =>
      t.get(mD).getOrCreateStandaloneInjector(e))
}
var fo = (() => {
  let t = class t {
    log(n) {
      console.log(n)
    }
    warn(n) {
      console.warn(n)
    }
  }
  ;(t.ɵfac = function (i) {
    return new (i || t)()
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'platform' }))
  let e = t
  return e
})()
var Nf = new C('')
function Ut(e) {
  return !!e && typeof e.then == 'function'
}
function Rf(e) {
  return !!e && typeof e.subscribe == 'function'
}
var Of = new C(''),
  Ff = (() => {
    let t = class t {
      constructor() {
        ;(this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((n, i) => {
            ;(this.resolve = n), (this.reject = i)
          })),
          (this.appInits = p(Of, { optional: !0 }) ?? [])
      }
      runInitializers() {
        if (this.initialized) return
        let n = []
        for (let o of this.appInits) {
          let s = o()
          if (Ut(s)) n.push(s)
          else if (Rf(s)) {
            let a = new Promise((u, c) => {
              s.subscribe({ complete: u, error: c })
            })
            n.push(a)
          }
        }
        let i = () => {
          ;(this.done = !0), this.resolve()
        }
        Promise.all(n)
          .then(() => {
            i()
          })
          .catch((o) => {
            this.reject(o)
          }),
          n.length === 0 && i(),
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
function vD() {
  _c(() => {
    throw new w(600, !1)
  })
}
function yD(e) {
  return e.isBoundToModule
}
function DD(e, t, r) {
  try {
    let n = r()
    return Ut(n)
      ? n.catch((i) => {
          throw (t.runOutsideAngular(() => e.handleError(i)), i)
        })
      : n
  } catch (n) {
    throw (t.runOutsideAngular(() => e.handleError(n)), n)
  }
}
var Nn = (() => {
  let t = class t {
    constructor() {
      ;(this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = p(kd)),
        (this.afterRenderEffectManager = p(If)),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new se()),
        (this.afterTick = new se()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = p(Tn).hasPendingTasks.pipe(M((n) => !n))),
        (this._injector = p(he))
    }
    get destroyed() {
      return this._destroyed
    }
    get injector() {
      return this._injector
    }
    bootstrap(n, i) {
      let o = n instanceof $i
      if (!this._injector.get(Ff).done) {
        let h = !o && Ql(n),
          m = !1
        throw new w(405, m)
      }
      let a
      o ? (a = n) : (a = this._injector.get(ao).resolveComponentFactory(n)),
        this.componentTypes.push(a.componentType)
      let u = yD(a) ? void 0 : this._injector.get(lt),
        c = i || a.selector,
        l = a.create(Mn.NULL, [], c, u),
        d = l.location.nativeElement,
        f = l.injector.get(Nf, null)
      return (
        f?.registerApplication(d),
        l.onDestroy(() => {
          this.detachView(l.hostView),
            Ps(this.components, l),
            f?.unregisterApplication(d)
        }),
        this._loadComponent(l),
        l
      )
    }
    tick() {
      this._tick(!0)
    }
    _tick(n) {
      if (this._runningTick) throw new w(101, !1)
      let i = O(null)
      try {
        ;(this._runningTick = !0), this.detectChangesInAttachedViews(n)
      } catch (o) {
        this.internalErrorHandler(o)
      } finally {
        this.afterTick.next(), (this._runningTick = !1), O(i)
      }
    }
    detectChangesInAttachedViews(n) {
      let i = 0,
        o = this.afterRenderEffectManager
      for (;;) {
        if (i === yf) throw new w(103, !1)
        if (n) {
          let s = i === 0
          this.beforeRender.next(s)
          for (let { _lView: a, notifyErrorHandler: u } of this._views)
            wD(a, s, u)
        }
        if (
          (i++,
          o.executeInternalCallbacks(),
          ![...this.externalTestViews.keys(), ...this._views].some(
            ({ _lView: s }) => Ea(s),
          ) &&
            (o.execute(),
            ![...this.externalTestViews.keys(), ...this._views].some(
              ({ _lView: s }) => Ea(s),
            )))
        )
          break
      }
    }
    attachView(n) {
      let i = n
      this._views.push(i), i.attachToAppRef(this)
    }
    detachView(n) {
      let i = n
      Ps(this._views, i), i.detachFromAppRef()
    }
    _loadComponent(n) {
      this.attachView(n.hostView), this.tick(), this.components.push(n)
      let i = this._injector.get(ho, [])
      ;[...this._bootstrapListeners, ...i].forEach((o) => o(n))
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy())
        } finally {
          ;(this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = [])
        }
    }
    onDestroy(n) {
      return this._destroyListeners.push(n), () => Ps(this._destroyListeners, n)
    }
    destroy() {
      if (this._destroyed) throw new w(406, !1)
      let n = this._injector
      n.destroy && !n.destroyed && n.destroy()
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
function Ps(e, t) {
  let r = e.indexOf(t)
  r > -1 && e.splice(r, 1)
}
function wD(e, t, r) {
  ;(!t && !Ea(e)) || CD(e, r, t)
}
function Ea(e) {
  return Oa(e)
}
function CD(e, t, r) {
  let n
  r ? ((n = 0), (e[E] |= 1024)) : e[E] & 64 ? (n = 0) : (n = 1), Df(e, t, n)
}
var Ia = class {
    constructor(t, r) {
      ;(this.ngModuleFactory = t), (this.componentFactories = r)
    }
  },
  ou = (() => {
    let t = class t {
      compileModuleSync(n) {
        return new la(n)
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n))
      }
      compileModuleAndAllComponentsSync(n) {
        let i = this.compileModuleSync(n),
          o = Kl(n),
          s = Gd(o.declarations).reduce((a, u) => {
            let c = _t(u)
            return c && a.push(new cr(c)), a
          }, [])
        return new Ia(i, s)
      }
      compileModuleAndAllComponentsAsync(n) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(n))
      }
      clearCache() {}
      clearCacheFor(n) {}
      getModuleId(n) {}
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)()
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })()
var ED = (() => {
  let t = class t {
    constructor() {
      ;(this.zone = p(q)), (this.applicationRef = p(Nn))
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
function ID(e) {
  return [
    { provide: q, useFactory: e },
    {
      provide: hn,
      multi: !0,
      useFactory: () => {
        let t = p(ED, { optional: !0 })
        return () => t.initialize()
      },
    },
    {
      provide: hn,
      multi: !0,
      useFactory: () => {
        let t = p(SD)
        return () => {
          t.initialize()
        }
      },
    },
    { provide: kd, useFactory: bD },
  ]
}
function bD() {
  let e = p(q),
    t = p(Qe)
  return (r) => e.runOutsideAngular(() => t.handleError(r))
}
function MD(e) {
  let t = ID(() => new q(_D(e)))
  return Cn([[], t])
}
function _D(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  }
}
var SD = (() => {
  let t = class t {
    constructor() {
      ;(this.subscription = new Z()),
        (this.initialized = !1),
        (this.zone = p(q)),
        (this.pendingTasks = p(Tn))
    }
    initialize() {
      if (this.initialized) return
      this.initialized = !0
      let n = null
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              q.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null))
                })
            }),
          )
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            q.assertInAngularZone(), (n ??= this.pendingTasks.add())
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
function TD() {
  return (typeof $localize < 'u' && $localize.locale) || qi
}
var su = new C('', {
  providedIn: 'root',
  factory: () => p(su, x.Optional | x.SkipSelf) || TD(),
})
var Pf = new C('')
var Ti = null
function AD(e = [], t) {
  return Mn.create({
    name: t,
    providers: [
      { provide: Ki, useValue: 'platform' },
      { provide: Pf, useValue: new Set([() => (Ti = null)]) },
      ...e,
    ],
  })
}
function xD(e = []) {
  if (Ti) return Ti
  let t = AD(e)
  return (Ti = t), vD(), ND(t), t
}
function ND(e) {
  e.get(Ba, null)?.forEach((r) => r())
}
var $t = (() => {
  let t = class t {}
  t.__NG_ELEMENT_ID__ = RD
  let e = t
  return e
})()
function RD(e) {
  return OD(_e(), B(), (e & 16) === 16)
}
function OD(e, t, r) {
  if (eo(e) && !r) {
    let n = ft(e.index, t)
    return new yn(n, n)
  } else if (e.type & 47) {
    let n = t[Re]
    return new yn(n, t)
  }
  return null
}
function kf(e) {
  try {
    let { rootComponent: t, appProviders: r, platformProviders: n } = e,
      i = xD(n),
      o = [MD(), ...(r || [])],
      a = new Hi({
        providers: o,
        parent: i,
        debugName: '',
        runEnvironmentInitializers: !1,
      }).injector,
      u = a.get(q)
    return u.run(() => {
      a.resolveInjectorInitializers()
      let c = a.get(Qe, null),
        l
      u.runOutsideAngular(() => {
        l = u.onError.subscribe({
          next: (h) => {
            c.handleError(h)
          },
        })
      })
      let d = () => a.destroy(),
        f = i.get(Pf)
      return (
        f.add(d),
        a.onDestroy(() => {
          l.unsubscribe(), f.delete(d)
        }),
        DD(c, u, () => {
          let h = a.get(Ff)
          return (
            h.runInitializers(),
            h.donePromise.then(() => {
              let m = a.get(su, qi)
              cD(m || qi)
              let b = a.get(Nn)
              return t !== void 0 && b.bootstrap(t), b
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
function Rn(e, t) {
  Lt('NgSignals')
  let r = Ic(e)
  return t?.equal && (r[We].equal = t.equal), r
}
var jf = null
function nt() {
  return jf
}
function Uf(e) {
  jf ??= e
}
var go = class {}
var pe = new C(''),
  $f = (() => {
    let t = class t {
      historyGo(n) {
        throw new Error('')
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)()
    }),
      (t.ɵprov = D({ token: t, factory: () => p(kD), providedIn: 'platform' }))
    let e = t
    return e
  })()
var kD = (() => {
  let t = class t extends $f {
    constructor() {
      super(),
        (this._doc = p(pe)),
        (this._location = window.location),
        (this._history = window.history)
    }
    getBaseHrefFromDOM() {
      return nt().getBaseHref(this._doc)
    }
    onPopState(n) {
      let i = nt().getGlobalEventTarget(this._doc, 'window')
      return (
        i.addEventListener('popstate', n, !1),
        () => i.removeEventListener('popstate', n)
      )
    }
    onHashChange(n) {
      let i = nt().getGlobalEventTarget(this._doc, 'window')
      return (
        i.addEventListener('hashchange', n, !1),
        () => i.removeEventListener('hashchange', n)
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
    set pathname(n) {
      this._location.pathname = n
    }
    pushState(n, i, o) {
      this._history.pushState(n, i, o)
    }
    replaceState(n, i, o) {
      this._history.replaceState(n, i, o)
    }
    forward() {
      this._history.forward()
    }
    back() {
      this._history.back()
    }
    historyGo(n = 0) {
      this._history.go(n)
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
function Bf(e, t) {
  if (e.length == 0) return t
  if (t.length == 0) return e
  let r = 0
  return (
    e.endsWith('/') && r++,
    t.startsWith('/') && r++,
    r == 2 ? e + t.substring(1) : r == 1 ? e + t : e + '/' + t
  )
}
function Lf(e) {
  let t = e.match(/#|\?|$/),
    r = (t && t.index) || e.length,
    n = r - (e[r - 1] === '/' ? 1 : 0)
  return e.slice(0, n) + e.slice(r)
}
function Bt(e) {
  return e && e[0] !== '?' ? '?' + e : e
}
var mo = (() => {
    let t = class t {
      historyGo(n) {
        throw new Error('')
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)()
    }),
      (t.ɵprov = D({ token: t, factory: () => p(Hf), providedIn: 'root' }))
    let e = t
    return e
  })(),
  LD = new C(''),
  Hf = (() => {
    let t = class t extends mo {
      constructor(n, i) {
        super(),
          (this._platformLocation = n),
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
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n),
        )
      }
      getBaseHref() {
        return this._baseHref
      }
      prepareExternalUrl(n) {
        return Bf(this._baseHref, n)
      }
      path(n = !1) {
        let i =
            this._platformLocation.pathname + Bt(this._platformLocation.search),
          o = this._platformLocation.hash
        return o && n ? `${i}${o}` : i
      }
      pushState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + Bt(s))
        this._platformLocation.pushState(n, i, a)
      }
      replaceState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + Bt(s))
        this._platformLocation.replaceState(n, i, a)
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
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n)
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)(S($f), S(LD, 8))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })()
var yr = (() => {
  let t = class t {
    constructor(n) {
      ;(this._subject = new ue()),
        (this._urlChangeListeners = []),
        (this._urlChangeSubscription = null),
        (this._locationStrategy = n)
      let i = this._locationStrategy.getBaseHref()
      ;(this._basePath = UD(Lf(Vf(i)))),
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
    path(n = !1) {
      return this.normalize(this._locationStrategy.path(n))
    }
    getState() {
      return this._locationStrategy.getState()
    }
    isCurrentPathEqualTo(n, i = '') {
      return this.path() == this.normalize(n + Bt(i))
    }
    normalize(n) {
      return t.stripTrailingSlash(jD(this._basePath, Vf(n)))
    }
    prepareExternalUrl(n) {
      return (
        n && n[0] !== '/' && (n = '/' + n),
        this._locationStrategy.prepareExternalUrl(n)
      )
    }
    go(n, i = '', o = null) {
      this._locationStrategy.pushState(o, '', n, i),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Bt(i)), o)
    }
    replaceState(n, i = '', o = null) {
      this._locationStrategy.replaceState(o, '', n, i),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Bt(i)), o)
    }
    forward() {
      this._locationStrategy.forward()
    }
    back() {
      this._locationStrategy.back()
    }
    historyGo(n = 0) {
      this._locationStrategy.historyGo?.(n)
    }
    onUrlChange(n) {
      return (
        this._urlChangeListeners.push(n),
        (this._urlChangeSubscription ??= this.subscribe((i) => {
          this._notifyUrlChangeListeners(i.url, i.state)
        })),
        () => {
          let i = this._urlChangeListeners.indexOf(n)
          this._urlChangeListeners.splice(i, 1),
            this._urlChangeListeners.length === 0 &&
              (this._urlChangeSubscription?.unsubscribe(),
              (this._urlChangeSubscription = null))
        }
      )
    }
    _notifyUrlChangeListeners(n = '', i) {
      this._urlChangeListeners.forEach((o) => o(n, i))
    }
    subscribe(n, i, o) {
      return this._subject.subscribe({ next: n, error: i, complete: o })
    }
  }
  ;(t.normalizeQueryParams = Bt),
    (t.joinWithSlash = Bf),
    (t.stripTrailingSlash = Lf),
    (t.ɵfac = function (i) {
      return new (i || t)(S(mo))
    }),
    (t.ɵprov = D({ token: t, factory: () => VD(), providedIn: 'root' }))
  let e = t
  return e
})()
function VD() {
  return new yr(S(mo))
}
function jD(e, t) {
  if (!e || !t.startsWith(e)) return t
  let r = t.substring(e.length)
  return r === '' || ['/', ';', '?', '#'].includes(r[0]) ? r : t
}
function Vf(e) {
  return e.replace(/\/index.html$/, '')
}
function UD(e) {
  if (new RegExp('^(https?:)?//').test(e)) {
    let [, r] = e.split(/\/\/[^\/]+/)
    return r
  }
  return e
}
function vo(e, t) {
  t = encodeURIComponent(t)
  for (let r of e.split(';')) {
    let n = r.indexOf('='),
      [i, o] = n == -1 ? [r, ''] : [r.slice(0, n), r.slice(n + 1)]
    if (i.trim() === t) return decodeURIComponent(o)
  }
  return null
}
var zf = 'browser',
  $D = 'server'
function yo(e) {
  return e === $D
}
var On = class {}
var wr = class {},
  wo = class {},
  Ht = class e {
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
                    .forEach((r) => {
                      let n = r.indexOf(':')
                      if (n > 0) {
                        let i = r.slice(0, n),
                          o = i.toLowerCase(),
                          s = r.slice(n + 1).trim()
                        this.maybeSetNormalizedName(i, o),
                          this.headers.has(o)
                            ? this.headers.get(o).push(s)
                            : this.headers.set(o, [s])
                      }
                    })
              })
            : typeof Headers < 'u' && t instanceof Headers
              ? ((this.headers = new Map()),
                t.forEach((r, n) => {
                  this.setHeaderEntries(n, r)
                }))
              : (this.lazyInit = () => {
                  ;(this.headers = new Map()),
                    Object.entries(t).forEach(([r, n]) => {
                      this.setHeaderEntries(r, n)
                    })
                })
          : (this.headers = new Map())
    }
    has(t) {
      return this.init(), this.headers.has(t.toLowerCase())
    }
    get(t) {
      this.init()
      let r = this.headers.get(t.toLowerCase())
      return r && r.length > 0 ? r[0] : null
    }
    keys() {
      return this.init(), Array.from(this.normalizedNames.values())
    }
    getAll(t) {
      return this.init(), this.headers.get(t.toLowerCase()) || null
    }
    append(t, r) {
      return this.clone({ name: t, value: r, op: 'a' })
    }
    set(t, r) {
      return this.clone({ name: t, value: r, op: 's' })
    }
    delete(t, r) {
      return this.clone({ name: t, value: r, op: 'd' })
    }
    maybeSetNormalizedName(t, r) {
      this.normalizedNames.has(r) || this.normalizedNames.set(r, t)
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
        Array.from(t.headers.keys()).forEach((r) => {
          this.headers.set(r, t.headers.get(r)),
            this.normalizedNames.set(r, t.normalizedNames.get(r))
        })
    }
    clone(t) {
      let r = new e()
      return (
        (r.lazyInit =
          this.lazyInit && this.lazyInit instanceof e ? this.lazyInit : this),
        (r.lazyUpdate = (this.lazyUpdate || []).concat([t])),
        r
      )
    }
    applyUpdate(t) {
      let r = t.name.toLowerCase()
      switch (t.op) {
        case 'a':
        case 's':
          let n = t.value
          if ((typeof n == 'string' && (n = [n]), n.length === 0)) return
          this.maybeSetNormalizedName(t.name, r)
          let i = (t.op === 'a' ? this.headers.get(r) : void 0) || []
          i.push(...n), this.headers.set(r, i)
          break
        case 'd':
          let o = t.value
          if (!o) this.headers.delete(r), this.normalizedNames.delete(r)
          else {
            let s = this.headers.get(r)
            if (!s) return
            ;(s = s.filter((a) => o.indexOf(a) === -1)),
              s.length === 0
                ? (this.headers.delete(r), this.normalizedNames.delete(r))
                : this.headers.set(r, s)
          }
          break
      }
    }
    setHeaderEntries(t, r) {
      let n = (Array.isArray(r) ? r : [r]).map((o) => o.toString()),
        i = t.toLowerCase()
      this.headers.set(i, n), this.maybeSetNormalizedName(t, i)
    }
    forEach(t) {
      this.init(),
        Array.from(this.normalizedNames.keys()).forEach((r) =>
          t(this.normalizedNames.get(r), this.headers.get(r)),
        )
    }
  }
var cu = class {
  encodeKey(t) {
    return Gf(t)
  }
  encodeValue(t) {
    return Gf(t)
  }
  decodeKey(t) {
    return decodeURIComponent(t)
  }
  decodeValue(t) {
    return decodeURIComponent(t)
  }
}
function GD(e, t) {
  let r = new Map()
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
            u = r.get(s) || []
          u.push(a), r.set(s, u)
        }),
    r
  )
}
var qD = /%(\d[a-f0-9])/gi,
  WD = {
    40: '@',
    '3A': ':',
    24: '$',
    '2C': ',',
    '3B': ';',
    '3D': '=',
    '3F': '?',
    '2F': '/',
  }
function Gf(e) {
  return encodeURIComponent(e).replace(qD, (t, r) => WD[r] ?? t)
}
function Do(e) {
  return `${e}`
}
var mt = class e {
  constructor(t = {}) {
    if (
      ((this.updates = null),
      (this.cloneFrom = null),
      (this.encoder = t.encoder || new cu()),
      t.fromString)
    ) {
      if (t.fromObject)
        throw new Error('Cannot specify both fromString and fromObject.')
      this.map = GD(t.fromString, this.encoder)
    } else
      t.fromObject
        ? ((this.map = new Map()),
          Object.keys(t.fromObject).forEach((r) => {
            let n = t.fromObject[r],
              i = Array.isArray(n) ? n.map(Do) : [Do(n)]
            this.map.set(r, i)
          }))
        : (this.map = null)
  }
  has(t) {
    return this.init(), this.map.has(t)
  }
  get(t) {
    this.init()
    let r = this.map.get(t)
    return r ? r[0] : null
  }
  getAll(t) {
    return this.init(), this.map.get(t) || null
  }
  keys() {
    return this.init(), Array.from(this.map.keys())
  }
  append(t, r) {
    return this.clone({ param: t, value: r, op: 'a' })
  }
  appendAll(t) {
    let r = []
    return (
      Object.keys(t).forEach((n) => {
        let i = t[n]
        Array.isArray(i)
          ? i.forEach((o) => {
              r.push({ param: n, value: o, op: 'a' })
            })
          : r.push({ param: n, value: i, op: 'a' })
      }),
      this.clone(r)
    )
  }
  set(t, r) {
    return this.clone({ param: t, value: r, op: 's' })
  }
  delete(t, r) {
    return this.clone({ param: t, value: r, op: 'd' })
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((t) => {
          let r = this.encoder.encodeKey(t)
          return this.map
            .get(t)
            .map((n) => r + '=' + this.encoder.encodeValue(n))
            .join('&')
        })
        .filter((t) => t !== '')
        .join('&')
    )
  }
  clone(t) {
    let r = new e({ encoder: this.encoder })
    return (
      (r.cloneFrom = this.cloneFrom || this),
      (r.updates = (this.updates || []).concat(t)),
      r
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
              let r = (t.op === 'a' ? this.map.get(t.param) : void 0) || []
              r.push(Do(t.value)), this.map.set(t.param, r)
              break
            case 'd':
              if (t.value !== void 0) {
                let n = this.map.get(t.param) || [],
                  i = n.indexOf(Do(t.value))
                i !== -1 && n.splice(i, 1),
                  n.length > 0
                    ? this.map.set(t.param, n)
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
var lu = class {
  constructor() {
    this.map = new Map()
  }
  set(t, r) {
    return this.map.set(t, r), this
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
function ZD(e) {
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
function qf(e) {
  return typeof ArrayBuffer < 'u' && e instanceof ArrayBuffer
}
function Wf(e) {
  return typeof Blob < 'u' && e instanceof Blob
}
function Zf(e) {
  return typeof FormData < 'u' && e instanceof FormData
}
function YD(e) {
  return typeof URLSearchParams < 'u' && e instanceof URLSearchParams
}
var Dr = class e {
    constructor(t, r, n, i) {
      ;(this.url = r),
        (this.body = null),
        (this.reportProgress = !1),
        (this.withCredentials = !1),
        (this.responseType = 'json'),
        (this.method = t.toUpperCase())
      let o
      if (
        (ZD(this.method) || i
          ? ((this.body = n !== void 0 ? n : null), (o = i))
          : (o = n),
        o &&
          ((this.reportProgress = !!o.reportProgress),
          (this.withCredentials = !!o.withCredentials),
          o.responseType && (this.responseType = o.responseType),
          o.headers && (this.headers = o.headers),
          o.context && (this.context = o.context),
          o.params && (this.params = o.params),
          (this.transferCache = o.transferCache)),
        (this.headers ??= new Ht()),
        (this.context ??= new lu()),
        !this.params)
      )
        (this.params = new mt()), (this.urlWithParams = r)
      else {
        let s = this.params.toString()
        if (s.length === 0) this.urlWithParams = r
        else {
          let a = r.indexOf('?'),
            u = a === -1 ? '?' : a < r.length - 1 ? '&' : ''
          this.urlWithParams = r + u + s
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : typeof this.body == 'string' ||
            qf(this.body) ||
            Wf(this.body) ||
            Zf(this.body) ||
            YD(this.body)
          ? this.body
          : this.body instanceof mt
            ? this.body.toString()
            : typeof this.body == 'object' ||
                typeof this.body == 'boolean' ||
                Array.isArray(this.body)
              ? JSON.stringify(this.body)
              : this.body.toString()
    }
    detectContentTypeHeader() {
      return this.body === null || Zf(this.body)
        ? null
        : Wf(this.body)
          ? this.body.type || null
          : qf(this.body)
            ? null
            : typeof this.body == 'string'
              ? 'text/plain'
              : this.body instanceof mt
                ? 'application/x-www-form-urlencoded;charset=UTF-8'
                : typeof this.body == 'object' ||
                    typeof this.body == 'number' ||
                    typeof this.body == 'boolean'
                  ? 'application/json'
                  : null
    }
    clone(t = {}) {
      let r = t.method || this.method,
        n = t.url || this.url,
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
        new e(r, n, s, {
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
    constructor(t, r = Io.Ok, n = 'OK') {
      ;(this.headers = t.headers || new Ht()),
        (this.status = t.status !== void 0 ? t.status : r),
        (this.statusText = t.statusText || n),
        (this.url = t.url || null),
        (this.ok = this.status >= 200 && this.status < 300)
    }
  },
  du = class e extends Cr {
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
function uu(e, t) {
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
var fu = (() => {
  let t = class t {
    constructor(n) {
      this.handler = n
    }
    request(n, i, o = {}) {
      let s
      if (n instanceof Dr) s = n
      else {
        let c
        o.headers instanceof Ht ? (c = o.headers) : (c = new Ht(o.headers))
        let l
        o.params &&
          (o.params instanceof mt
            ? (l = o.params)
            : (l = new mt({ fromObject: o.params }))),
          (s = new Dr(n, i, o.body !== void 0 ? o.body : null, {
            headers: c,
            context: o.context,
            params: l,
            reportProgress: o.reportProgress,
            responseType: o.responseType || 'json',
            withCredentials: o.withCredentials,
            transferCache: o.transferCache,
          }))
      }
      let a = I(s).pipe(ot((c) => this.handler.handle(c)))
      if (n instanceof Dr || o.observe === 'events') return a
      let u = a.pipe(ye((c) => c instanceof Co))
      switch (o.observe || 'body') {
        case 'body':
          switch (s.responseType) {
            case 'arraybuffer':
              return u.pipe(
                M((c) => {
                  if (c.body !== null && !(c.body instanceof ArrayBuffer))
                    throw new Error('Response is not an ArrayBuffer.')
                  return c.body
                }),
              )
            case 'blob':
              return u.pipe(
                M((c) => {
                  if (c.body !== null && !(c.body instanceof Blob))
                    throw new Error('Response is not a Blob.')
                  return c.body
                }),
              )
            case 'text':
              return u.pipe(
                M((c) => {
                  if (c.body !== null && typeof c.body != 'string')
                    throw new Error('Response is not a string.')
                  return c.body
                }),
              )
            case 'json':
            default:
              return u.pipe(M((c) => c.body))
          }
        case 'response':
          return u
        default:
          throw new Error(`Unreachable: unhandled observe type ${o.observe}}`)
      }
    }
    delete(n, i = {}) {
      return this.request('DELETE', n, i)
    }
    get(n, i = {}) {
      return this.request('GET', n, i)
    }
    head(n, i = {}) {
      return this.request('HEAD', n, i)
    }
    jsonp(n, i) {
      return this.request('JSONP', n, {
        params: new mt().append(i, 'JSONP_CALLBACK'),
        observe: 'body',
        responseType: 'json',
      })
    }
    options(n, i = {}) {
      return this.request('OPTIONS', n, i)
    }
    patch(n, i, o = {}) {
      return this.request('PATCH', n, uu(o, i))
    }
    post(n, i, o = {}) {
      return this.request('POST', n, uu(o, i))
    }
    put(n, i, o = {}) {
      return this.request('PUT', n, uu(o, i))
    }
  }
  ;(t.ɵfac = function (i) {
    return new (i || t)(S(wr))
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac }))
  let e = t
  return e
})()
function QD(e, t) {
  return t(e)
}
function KD(e, t, r) {
  return (n, i) => Je(r, () => t(n, (o) => e(o, i)))
}
var Kf = new C(''),
  JD = new C(''),
  XD = new C('')
var Yf = (() => {
  let t = class t extends wr {
    constructor(n, i) {
      super(),
        (this.backend = n),
        (this.injector = i),
        (this.chain = null),
        (this.pendingTasks = p(Tn))
      let o = p(XD, { optional: !0 })
      this.backend = o ?? n
    }
    handle(n) {
      if (this.chain === null) {
        let o = Array.from(
          new Set([...this.injector.get(Kf), ...this.injector.get(JD, [])]),
        )
        this.chain = o.reduceRight((s, a) => KD(s, a, this.injector), QD)
      }
      let i = this.pendingTasks.add()
      return this.chain(n, (o) => this.backend.handle(o)).pipe(
        It(() => this.pendingTasks.remove(i)),
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
var ew = /^\)\]\}',?\n/
function tw(e) {
  return 'responseURL' in e && e.responseURL
    ? e.responseURL
    : /^X-Request-URL:/m.test(e.getAllResponseHeaders())
      ? e.getResponseHeader('X-Request-URL')
      : null
}
var Qf = (() => {
    let t = class t {
      constructor(n) {
        this.xhrFactory = n
      }
      handle(n) {
        if (n.method === 'JSONP') throw new w(-2800, !1)
        let i = this.xhrFactory
        return (i.ɵloadImpl ? H(i.ɵloadImpl()) : I(null)).pipe(
          De(
            () =>
              new k((s) => {
                let a = i.build()
                if (
                  (a.open(n.method, n.urlWithParams),
                  n.withCredentials && (a.withCredentials = !0),
                  n.headers.forEach((y, v) =>
                    a.setRequestHeader(y, v.join(',')),
                  ),
                  n.headers.has('Accept') ||
                    a.setRequestHeader(
                      'Accept',
                      'application/json, text/plain, */*',
                    ),
                  !n.headers.has('Content-Type'))
                ) {
                  let y = n.detectContentTypeHeader()
                  y !== null && a.setRequestHeader('Content-Type', y)
                }
                if (n.responseType) {
                  let y = n.responseType.toLowerCase()
                  a.responseType = y !== 'json' ? y : 'text'
                }
                let u = n.serializeBody(),
                  c = null,
                  l = () => {
                    if (c !== null) return c
                    let y = a.statusText || 'OK',
                      v = new Ht(a.getAllResponseHeaders()),
                      ne = tw(a) || n.url
                    return (
                      (c = new du({
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
                    if (n.responseType === 'json' && typeof $ == 'string') {
                      let ge = $
                      $ = $.replace(ew, '')
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
                      n.responseType === 'text' &&
                        a.responseText &&
                        (v.partialText = a.responseText),
                      s.next(v)
                  },
                  b = (y) => {
                    let v = { type: Fn.UploadProgress, loaded: y.loaded }
                    y.lengthComputable && (v.total = y.total), s.next(v)
                  }
                return (
                  a.addEventListener('load', d),
                  a.addEventListener('error', f),
                  a.addEventListener('timeout', f),
                  a.addEventListener('abort', f),
                  n.reportProgress &&
                    (a.addEventListener('progress', m),
                    u !== null &&
                      a.upload &&
                      a.upload.addEventListener('progress', b)),
                  a.send(u),
                  s.next({ type: Fn.Sent }),
                  () => {
                    a.removeEventListener('error', f),
                      a.removeEventListener('abort', f),
                      a.removeEventListener('load', d),
                      a.removeEventListener('timeout', f),
                      n.reportProgress &&
                        (a.removeEventListener('progress', m),
                        u !== null &&
                          a.upload &&
                          a.upload.removeEventListener('progress', b)),
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
  Jf = new C(''),
  nw = 'XSRF-TOKEN',
  rw = new C('', { providedIn: 'root', factory: () => nw }),
  iw = 'X-XSRF-TOKEN',
  ow = new C('', { providedIn: 'root', factory: () => iw }),
  bo = class {},
  sw = (() => {
    let t = class t {
      constructor(n, i, o) {
        ;(this.doc = n),
          (this.platform = i),
          (this.cookieName = o),
          (this.lastCookieString = ''),
          (this.lastToken = null),
          (this.parseCount = 0)
      }
      getToken() {
        if (this.platform === 'server') return null
        let n = this.doc.cookie || ''
        return (
          n !== this.lastCookieString &&
            (this.parseCount++,
            (this.lastToken = vo(n, this.cookieName)),
            (this.lastCookieString = n)),
          this.lastToken
        )
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)(S(pe), S(ht), S(rw))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })()
function aw(e, t) {
  let r = e.url.toLowerCase()
  if (
    !p(Jf) ||
    e.method === 'GET' ||
    e.method === 'HEAD' ||
    r.startsWith('http://') ||
    r.startsWith('https://')
  )
    return t(e)
  let n = p(bo).getToken(),
    i = p(ow)
  return (
    n != null &&
      !e.headers.has(i) &&
      (e = e.clone({ headers: e.headers.set(i, n) })),
    t(e)
  )
}
function Xf(...e) {
  let t = [
    fu,
    Qf,
    Yf,
    { provide: wr, useExisting: Yf },
    { provide: wo, useExisting: Qf },
    { provide: Kf, useValue: aw, multi: !0 },
    { provide: Jf, useValue: !0 },
    { provide: bo, useClass: sw },
  ]
  for (let r of e) t.push(...r.ɵproviders)
  return Cn(t)
}
var gu = class extends go {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0)
    }
  },
  mu = class e extends gu {
    static makeCurrent() {
      Uf(new e())
    }
    onAndCancel(t, r, n) {
      return (
        t.addEventListener(r, n),
        () => {
          t.removeEventListener(r, n)
        }
      )
    }
    dispatchEvent(t, r) {
      t.dispatchEvent(r)
    }
    remove(t) {
      t.parentNode && t.parentNode.removeChild(t)
    }
    createElement(t, r) {
      return (r = r || this.getDefaultDocument()), r.createElement(t)
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
    getGlobalEventTarget(t, r) {
      return r === 'window'
        ? window
        : r === 'document'
          ? t
          : r === 'body'
            ? t.body
            : null
    }
    getBaseHref(t) {
      let r = cw()
      return r == null ? null : lw(r)
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
function cw() {
  return (
    (Er = Er || document.querySelector('base')),
    Er ? Er.getAttribute('href') : null
  )
}
function lw(e) {
  return new URL(e, document.baseURI).pathname
}
var dw = (() => {
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
  vu = new C(''),
  rh = (() => {
    let t = class t {
      constructor(n, i) {
        ;(this._zone = i),
          (this._eventNameToPlugin = new Map()),
          n.forEach((o) => {
            o.manager = this
          }),
          (this._plugins = n.slice().reverse())
      }
      addEventListener(n, i, o) {
        return this._findPluginFor(i).addEventListener(n, i, o)
      }
      getZone() {
        return this._zone
      }
      _findPluginFor(n) {
        let i = this._eventNameToPlugin.get(n)
        if (i) return i
        if (((i = this._plugins.find((s) => s.supports(n))), !i))
          throw new w(5101, !1)
        return this._eventNameToPlugin.set(n, i), i
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)(S(vu), S(q))
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
  hu = 'ng-app-id',
  ih = (() => {
    let t = class t {
      constructor(n, i, o, s = {}) {
        ;(this.doc = n),
          (this.appId = i),
          (this.nonce = o),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = yo(s)),
          this.resetHostNodes()
      }
      addStyles(n) {
        for (let i of n)
          this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i)
      }
      removeStyles(n) {
        for (let i of n)
          this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i)
      }
      ngOnDestroy() {
        let n = this.styleNodesInDOM
        n && (n.forEach((i) => i.remove()), n.clear())
        for (let i of this.getAllStyles()) this.onStyleRemoved(i)
        this.resetHostNodes()
      }
      addHost(n) {
        this.hostNodes.add(n)
        for (let i of this.getAllStyles()) this.addStyleToHost(n, i)
      }
      removeHost(n) {
        this.hostNodes.delete(n)
      }
      getAllStyles() {
        return this.styleRef.keys()
      }
      onStyleAdded(n) {
        for (let i of this.hostNodes) this.addStyleToHost(i, n)
      }
      onStyleRemoved(n) {
        let i = this.styleRef
        i.get(n)?.elements?.forEach((o) => o.remove()), i.delete(n)
      }
      collectServerRenderedStyles() {
        let n = this.doc.head?.querySelectorAll(`style[${hu}="${this.appId}"]`)
        if (n?.length) {
          let i = new Map()
          return (
            n.forEach((o) => {
              o.textContent != null && i.set(o.textContent, o)
            }),
            i
          )
        }
        return null
      }
      changeUsageCount(n, i) {
        let o = this.styleRef
        if (o.has(n)) {
          let s = o.get(n)
          return (s.usage += i), s.usage
        }
        return o.set(n, { usage: i, elements: [] }), i
      }
      getStyleElement(n, i) {
        let o = this.styleNodesInDOM,
          s = o?.get(i)
        if (s?.parentNode === n) return o.delete(i), s.removeAttribute(hu), s
        {
          let a = this.doc.createElement('style')
          return (
            this.nonce && a.setAttribute('nonce', this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(hu, this.appId),
            n.appendChild(a),
            a
          )
        }
      }
      addStyleToHost(n, i) {
        let o = this.getStyleElement(n, i),
          s = this.styleRef,
          a = s.get(i)?.elements
        a ? a.push(o) : s.set(i, { elements: [o], usage: 1 })
      }
      resetHostNodes() {
        let n = this.hostNodes
        n.clear(), n.add(this.doc.head)
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)(S(pe), S($a), S(Ha, 8), S(ht))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })(),
  pu = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    math: 'http://www.w3.org/1998/MathML/',
  },
  Du = /%COMP%/g,
  oh = '%COMP%',
  fw = `_nghost-${oh}`,
  hw = `_ngcontent-${oh}`,
  pw = !0,
  gw = new C('', { providedIn: 'root', factory: () => pw })
function mw(e) {
  return hw.replace(Du, e)
}
function vw(e) {
  return fw.replace(Du, e)
}
function sh(e, t) {
  return t.map((r) => r.replace(Du, e))
}
var eh = (() => {
    let t = class t {
      constructor(n, i, o, s, a, u, c, l = null) {
        ;(this.eventManager = n),
          (this.sharedStylesHost = i),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = u),
          (this.ngZone = c),
          (this.nonce = l),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = yo(u)),
          (this.defaultRenderer = new Ir(n, a, c, this.platformIsServer))
      }
      createRenderer(n, i) {
        if (!n || !i) return this.defaultRenderer
        this.platformIsServer &&
          i.encapsulation === Ue.ShadowDom &&
          (i = R(g({}, i), { encapsulation: Ue.Emulated }))
        let o = this.getOrCreateRenderer(n, i)
        return (
          o instanceof _o
            ? o.applyToHost(n)
            : o instanceof br && o.applyStyles(),
          o
        )
      }
      getOrCreateRenderer(n, i) {
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
              return new yu(c, l, n, i, a, u, this.nonce, f)
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
      return new (i || t)(S(rh), S(ih), S($a), S(gw), S(pe), S(ht), S(q), S(Ha))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })(),
  Ir = class {
    constructor(t, r, n, i) {
      ;(this.eventManager = t),
        (this.doc = r),
        (this.ngZone = n),
        (this.platformIsServer = i),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null)
    }
    destroy() {}
    createElement(t, r) {
      return r
        ? this.doc.createElementNS(pu[r] || r, t)
        : this.doc.createElement(t)
    }
    createComment(t) {
      return this.doc.createComment(t)
    }
    createText(t) {
      return this.doc.createTextNode(t)
    }
    appendChild(t, r) {
      ;(th(t) ? t.content : t).appendChild(r)
    }
    insertBefore(t, r, n) {
      t && (th(t) ? t.content : t).insertBefore(r, n)
    }
    removeChild(t, r) {
      t && t.removeChild(r)
    }
    selectRootElement(t, r) {
      let n = typeof t == 'string' ? this.doc.querySelector(t) : t
      if (!n) throw new w(-5104, !1)
      return r || (n.textContent = ''), n
    }
    parentNode(t) {
      return t.parentNode
    }
    nextSibling(t) {
      return t.nextSibling
    }
    setAttribute(t, r, n, i) {
      if (i) {
        r = i + ':' + r
        let o = pu[i]
        o ? t.setAttributeNS(o, r, n) : t.setAttribute(r, n)
      } else t.setAttribute(r, n)
    }
    removeAttribute(t, r, n) {
      if (n) {
        let i = pu[n]
        i ? t.removeAttributeNS(i, r) : t.removeAttribute(`${n}:${r}`)
      } else t.removeAttribute(r)
    }
    addClass(t, r) {
      t.classList.add(r)
    }
    removeClass(t, r) {
      t.classList.remove(r)
    }
    setStyle(t, r, n, i) {
      i & (Ke.DashCase | Ke.Important)
        ? t.style.setProperty(r, n, i & Ke.Important ? 'important' : '')
        : (t.style[r] = n)
    }
    removeStyle(t, r, n) {
      n & Ke.DashCase ? t.style.removeProperty(r) : (t.style[r] = '')
    }
    setProperty(t, r, n) {
      t != null && (t[r] = n)
    }
    setValue(t, r) {
      t.nodeValue = r
    }
    listen(t, r, n) {
      if (
        typeof t == 'string' &&
        ((t = nt().getGlobalEventTarget(this.doc, t)), !t)
      )
        throw new Error(`Unsupported event target ${t} for event ${r}`)
      return this.eventManager.addEventListener(
        t,
        r,
        this.decoratePreventDefault(n),
      )
    }
    decoratePreventDefault(t) {
      return (r) => {
        if (r === '__ngUnwrap__') return t
        ;(this.platformIsServer ? this.ngZone.runGuarded(() => t(r)) : t(r)) ===
          !1 && r.preventDefault()
      }
    }
  }
function th(e) {
  return e.tagName === 'TEMPLATE' && e.content !== void 0
}
var yu = class extends Ir {
    constructor(t, r, n, i, o, s, a, u) {
      super(t, o, s, u),
        (this.sharedStylesHost = r),
        (this.hostEl = n),
        (this.shadowRoot = n.attachShadow({ mode: 'open' })),
        this.sharedStylesHost.addHost(this.shadowRoot)
      let c = sh(i.id, i.styles)
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
    appendChild(t, r) {
      return super.appendChild(this.nodeOrShadowRoot(t), r)
    }
    insertBefore(t, r, n) {
      return super.insertBefore(this.nodeOrShadowRoot(t), r, n)
    }
    removeChild(t, r) {
      return super.removeChild(this.nodeOrShadowRoot(t), r)
    }
    parentNode(t) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)))
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot)
    }
  },
  br = class extends Ir {
    constructor(t, r, n, i, o, s, a, u) {
      super(t, o, s, a),
        (this.sharedStylesHost = r),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = u ? sh(u, n.styles) : n.styles)
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
    constructor(t, r, n, i, o, s, a, u) {
      let c = i + '-' + n.id
      super(t, r, n, o, s, a, u, c),
        (this.contentAttr = mw(c)),
        (this.hostAttr = vw(c))
    }
    applyToHost(t) {
      this.applyStyles(), this.setAttribute(t, this.hostAttr, '')
    }
    createElement(t, r) {
      let n = super.createElement(t, r)
      return super.setAttribute(n, this.contentAttr, ''), n
    }
  },
  yw = (() => {
    let t = class t extends Mo {
      constructor(n) {
        super(n)
      }
      supports(n) {
        return !0
      }
      addEventListener(n, i, o) {
        return (
          n.addEventListener(i, o, !1), () => this.removeEventListener(n, i, o)
        )
      }
      removeEventListener(n, i, o) {
        return n.removeEventListener(i, o)
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)(S(pe))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })(),
  nh = ['alt', 'control', 'meta', 'shift'],
  Dw = {
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
  ww = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  Cw = (() => {
    let t = class t extends Mo {
      constructor(n) {
        super(n)
      }
      supports(n) {
        return t.parseEventName(n) != null
      }
      addEventListener(n, i, o) {
        let s = t.parseEventName(i),
          a = t.eventCallback(s.fullKey, o, this.manager.getZone())
        return this.manager
          .getZone()
          .runOutsideAngular(() => nt().onAndCancel(n, s.domEventName, a))
      }
      static parseEventName(n) {
        let i = n.toLowerCase().split('.'),
          o = i.shift()
        if (i.length === 0 || !(o === 'keydown' || o === 'keyup')) return null
        let s = t._normalizeKey(i.pop()),
          a = '',
          u = i.indexOf('code')
        if (
          (u > -1 && (i.splice(u, 1), (a = 'code.')),
          nh.forEach((l) => {
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
      static matchEventFullKeyCode(n, i) {
        let o = Dw[n.key] || n.key,
          s = ''
        return (
          i.indexOf('code.') > -1 && ((o = n.code), (s = 'code.')),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === ' ' ? (o = 'space') : o === '.' && (o = 'dot'),
              nh.forEach((a) => {
                if (a !== o) {
                  let u = ww[a]
                  u(n) && (s += a + '.')
                }
              }),
              (s += o),
              s === i)
        )
      }
      static eventCallback(n, i, o) {
        return (s) => {
          t.matchEventFullKeyCode(s, n) && o.runGuarded(() => i(s))
        }
      }
      static _normalizeKey(n) {
        return n === 'esc' ? 'escape' : n
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)(S(pe))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })()
function ah(e, t) {
  return kf(g({ rootComponent: e }, Ew(t)))
}
function Ew(e) {
  return {
    appProviders: [...Sw, ...(e?.providers ?? [])],
    platformProviders: _w,
  }
}
function Iw() {
  mu.makeCurrent()
}
function bw() {
  return new Qe()
}
function Mw() {
  return Hd(document), document
}
var _w = [
  { provide: ht, useValue: zf },
  { provide: Ba, useValue: Iw, multi: !0 },
  { provide: pe, useFactory: Mw, deps: [] },
]
var Sw = [
  { provide: Ki, useValue: 'root' },
  { provide: Qe, useFactory: bw, deps: [] },
  { provide: vu, useClass: yw, multi: !0, deps: [pe, q, ht] },
  { provide: vu, useClass: Cw, multi: !0, deps: [pe] },
  eh,
  ih,
  rh,
  { provide: ur, useExisting: eh },
  { provide: On, useClass: dw, deps: [] },
  [],
]
var uh = (() => {
  let t = class t {
    constructor(n) {
      this._doc = n
    }
    getTitle() {
      return this._doc.title
    }
    setTitle(n) {
      this._doc.title = n || ''
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
  bu = class {
    constructor(t) {
      this.params = t || {}
    }
    has(t) {
      return Object.prototype.hasOwnProperty.call(this.params, t)
    }
    get(t) {
      if (this.has(t)) {
        let r = this.params[t]
        return Array.isArray(r) ? r[0] : r
      }
      return null
    }
    getAll(t) {
      if (this.has(t)) {
        let r = this.params[t]
        return Array.isArray(r) ? r : [r]
      }
      return []
    }
    get keys() {
      return Object.keys(this.params)
    }
  }
function jn(e) {
  return new bu(e)
}
function xw(e, t, r) {
  let n = r.path.split('/')
  if (
    n.length > e.length ||
    (r.pathMatch === 'full' && (t.hasChildren() || n.length < e.length))
  )
    return null
  let i = {}
  for (let o = 0; o < n.length; o++) {
    let s = n[o],
      a = e[o]
    if (s.startsWith(':')) i[s.substring(1)] = a
    else if (s !== a.path) return null
  }
  return { consumed: e.slice(0, n.length), posParams: i }
}
function Nw(e, t) {
  if (e.length !== t.length) return !1
  for (let r = 0; r < e.length; ++r) if (!Ge(e[r], t[r])) return !1
  return !0
}
function Ge(e, t) {
  let r = e ? Mu(e) : void 0,
    n = t ? Mu(t) : void 0
  if (!r || !n || r.length != n.length) return !1
  let i
  for (let o = 0; o < r.length; o++)
    if (((i = r[o]), !ph(e[i], t[i]))) return !1
  return !0
}
function Mu(e) {
  return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)]
}
function ph(e, t) {
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length) return !1
    let r = [...e].sort(),
      n = [...t].sort()
    return r.every((i, o) => n[o] === i)
  } else return e === t
}
function gh(e) {
  return e.length > 0 ? e[e.length - 1] : null
}
function Dt(e) {
  return fs(e) ? e : Ut(e) ? H(Promise.resolve(e)) : I(e)
}
var Rw = { exact: vh, subset: yh },
  mh = { exact: Ow, subset: Fw, ignored: () => !0 }
function ch(e, t, r) {
  return (
    Rw[r.paths](e.root, t.root, r.matrixParams) &&
    mh[r.queryParams](e.queryParams, t.queryParams) &&
    !(r.fragment === 'exact' && e.fragment !== t.fragment)
  )
}
function Ow(e, t) {
  return Ge(e, t)
}
function vh(e, t, r) {
  if (
    !Gt(e.segments, t.segments) ||
    !Ao(e.segments, t.segments, r) ||
    e.numberOfChildren !== t.numberOfChildren
  )
    return !1
  for (let n in t.children)
    if (!e.children[n] || !vh(e.children[n], t.children[n], r)) return !1
  return !0
}
function Fw(e, t) {
  return (
    Object.keys(t).length <= Object.keys(e).length &&
    Object.keys(t).every((r) => ph(e[r], t[r]))
  )
}
function yh(e, t, r) {
  return Dh(e, t, t.segments, r)
}
function Dh(e, t, r, n) {
  if (e.segments.length > r.length) {
    let i = e.segments.slice(0, r.length)
    return !(!Gt(i, r) || t.hasChildren() || !Ao(i, r, n))
  } else if (e.segments.length === r.length) {
    if (!Gt(e.segments, r) || !Ao(e.segments, r, n)) return !1
    for (let i in t.children)
      if (!e.children[i] || !yh(e.children[i], t.children[i], n)) return !1
    return !0
  } else {
    let i = r.slice(0, e.segments.length),
      o = r.slice(e.segments.length)
    return !Gt(e.segments, i) || !Ao(e.segments, i, n) || !e.children[T]
      ? !1
      : Dh(e.children[T], t, o, n)
  }
}
function Ao(e, t, r) {
  return t.every((n, i) => mh[r](e[i].parameters, n.parameters))
}
var vt = class {
    constructor(t = new L([], {}), r = {}, n = null) {
      ;(this.root = t), (this.queryParams = r), (this.fragment = n)
    }
    get queryParamMap() {
      return (this._queryParamMap ??= jn(this.queryParams)), this._queryParamMap
    }
    toString() {
      return Lw.serialize(this)
    }
  },
  L = class {
    constructor(t, r) {
      ;(this.segments = t),
        (this.children = r),
        (this.parent = null),
        Object.values(r).forEach((n) => (n.parent = this))
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
  zt = class {
    constructor(t, r) {
      ;(this.path = t), (this.parameters = r)
    }
    get parameterMap() {
      return (this._parameterMap ??= jn(this.parameters)), this._parameterMap
    }
    toString() {
      return Ch(this)
    }
  }
function Pw(e, t) {
  return Gt(e, t) && e.every((r, n) => Ge(r.parameters, t[n].parameters))
}
function Gt(e, t) {
  return e.length !== t.length ? !1 : e.every((r, n) => r.path === t[n].path)
}
function kw(e, t) {
  let r = []
  return (
    Object.entries(e.children).forEach(([n, i]) => {
      n === T && (r = r.concat(t(i, n)))
    }),
    Object.entries(e.children).forEach(([n, i]) => {
      n !== T && (r = r.concat(t(i, n)))
    }),
    r
  )
}
var Ku = (() => {
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
      let r = new Su(t)
      return new vt(
        r.parseRootSegment(),
        r.parseQueryParams(),
        r.parseFragment(),
      )
    }
    serialize(t) {
      let r = `/${Mr(t.root, !0)}`,
        n = Uw(t.queryParams),
        i = typeof t.fragment == 'string' ? `#${Vw(t.fragment)}` : ''
      return `${r}${n}${i}`
    }
  },
  Lw = new Ro()
function xo(e) {
  return e.segments.map((t) => Ch(t)).join('/')
}
function Mr(e, t) {
  if (!e.hasChildren()) return xo(e)
  if (t) {
    let r = e.children[T] ? Mr(e.children[T], !1) : '',
      n = []
    return (
      Object.entries(e.children).forEach(([i, o]) => {
        i !== T && n.push(`${i}:${Mr(o, !1)}`)
      }),
      n.length > 0 ? `${r}(${n.join('//')})` : r
    )
  } else {
    let r = kw(e, (n, i) =>
      i === T ? [Mr(e.children[T], !1)] : [`${i}:${Mr(n, !1)}`],
    )
    return Object.keys(e.children).length === 1 && e.children[T] != null
      ? `${xo(e)}/${r[0]}`
      : `${xo(e)}/(${r.join('//')})`
  }
}
function wh(e) {
  return encodeURIComponent(e)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
}
function So(e) {
  return wh(e).replace(/%3B/gi, ';')
}
function Vw(e) {
  return encodeURI(e)
}
function _u(e) {
  return wh(e).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&')
}
function No(e) {
  return decodeURIComponent(e)
}
function lh(e) {
  return No(e.replace(/\+/g, '%20'))
}
function Ch(e) {
  return `${_u(e.path)}${jw(e.parameters)}`
}
function jw(e) {
  return Object.entries(e)
    .map(([t, r]) => `;${_u(t)}=${_u(r)}`)
    .join('')
}
function Uw(e) {
  let t = Object.entries(e)
    .map(([r, n]) =>
      Array.isArray(n)
        ? n.map((i) => `${So(r)}=${So(i)}`).join('&')
        : `${So(r)}=${So(n)}`,
    )
    .filter((r) => r)
  return t.length ? `?${t.join('&')}` : ''
}
var $w = /^[^\/()?;#]+/
function wu(e) {
  let t = e.match($w)
  return t ? t[0] : ''
}
var Bw = /^[^\/()?;=#]+/
function Hw(e) {
  let t = e.match(Bw)
  return t ? t[0] : ''
}
var zw = /^[^=?&#]+/
function Gw(e) {
  let t = e.match(zw)
  return t ? t[0] : ''
}
var qw = /^[^&#]+/
function Ww(e) {
  let t = e.match(qw)
  return t ? t[0] : ''
}
var Su = class {
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
    let r = {}
    this.peekStartsWith('/(') && (this.capture('/'), (r = this.parseParens(!0)))
    let n = {}
    return (
      this.peekStartsWith('(') && (n = this.parseParens(!1)),
      (t.length > 0 || Object.keys(r).length > 0) && (n[T] = new L(t, r)),
      n
    )
  }
  parseSegment() {
    let t = wu(this.remaining)
    if (t === '' && this.peekStartsWith(';')) throw new w(4009, !1)
    return this.capture(t), new zt(No(t), this.parseMatrixParams())
  }
  parseMatrixParams() {
    let t = {}
    for (; this.consumeOptional(';'); ) this.parseParam(t)
    return t
  }
  parseParam(t) {
    let r = Hw(this.remaining)
    if (!r) return
    this.capture(r)
    let n = ''
    if (this.consumeOptional('=')) {
      let i = wu(this.remaining)
      i && ((n = i), this.capture(n))
    }
    t[No(r)] = No(n)
  }
  parseQueryParam(t) {
    let r = Gw(this.remaining)
    if (!r) return
    this.capture(r)
    let n = ''
    if (this.consumeOptional('=')) {
      let s = Ww(this.remaining)
      s && ((n = s), this.capture(n))
    }
    let i = lh(r),
      o = lh(n)
    if (t.hasOwnProperty(i)) {
      let s = t[i]
      Array.isArray(s) || ((s = [s]), (t[i] = s)), s.push(o)
    } else t[i] = o
  }
  parseParens(t) {
    let r = {}
    for (
      this.capture('(');
      !this.consumeOptional(')') && this.remaining.length > 0;

    ) {
      let n = wu(this.remaining),
        i = this.remaining[n.length]
      if (i !== '/' && i !== ')' && i !== ';') throw new w(4010, !1)
      let o
      n.indexOf(':') > -1
        ? ((o = n.slice(0, n.indexOf(':'))), this.capture(o), this.capture(':'))
        : t && (o = T)
      let s = this.parseChildren()
      ;(r[o] = Object.keys(s).length === 1 ? s[T] : new L([], s)),
        this.consumeOptional('//')
    }
    return r
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
function Eh(e) {
  return e.segments.length > 0 ? new L([], { [T]: e }) : e
}
function Ih(e) {
  let t = {}
  for (let [n, i] of Object.entries(e.children)) {
    let o = Ih(i)
    if (n === T && o.segments.length === 0 && o.hasChildren())
      for (let [s, a] of Object.entries(o.children)) t[s] = a
    else (o.segments.length > 0 || o.hasChildren()) && (t[n] = o)
  }
  let r = new L(e.segments, t)
  return Zw(r)
}
function Zw(e) {
  if (e.numberOfChildren === 1 && e.children[T]) {
    let t = e.children[T]
    return new L(e.segments.concat(t.segments), t.children)
  }
  return e
}
function Un(e) {
  return e instanceof vt
}
function Yw(e, t, r = null, n = null) {
  let i = bh(e)
  return Mh(i, t, r, n)
}
function bh(e) {
  let t
  function r(o) {
    let s = {}
    for (let u of o.children) {
      let c = r(u)
      s[u.outlet] = c
    }
    let a = new L(o.url, s)
    return o === e && (t = a), a
  }
  let n = r(e.root),
    i = Eh(n)
  return t ?? i
}
function Mh(e, t, r, n) {
  let i = e
  for (; i.parent; ) i = i.parent
  if (t.length === 0) return Cu(i, i, i, r, n)
  let o = Qw(t)
  if (o.toRoot()) return Cu(i, i, new L([], {}), r, n)
  let s = Kw(o, i, e),
    a = s.processChildren
      ? Tr(s.segmentGroup, s.index, o.commands)
      : Sh(s.segmentGroup, s.index, o.commands)
  return Cu(i, s.segmentGroup, a, r, n)
}
function Oo(e) {
  return typeof e == 'object' && e != null && !e.outlets && !e.segmentPath
}
function Nr(e) {
  return typeof e == 'object' && e != null && e.outlets
}
function Cu(e, t, r, n, i) {
  let o = {}
  n &&
    Object.entries(n).forEach(([u, c]) => {
      o[u] = Array.isArray(c) ? c.map((l) => `${l}`) : `${c}`
    })
  let s
  e === t ? (s = r) : (s = _h(e, t, r))
  let a = Eh(Ih(s))
  return new vt(a, o, i)
}
function _h(e, t, r) {
  let n = {}
  return (
    Object.entries(e.children).forEach(([i, o]) => {
      o === t ? (n[i] = r) : (n[i] = _h(o, t, r))
    }),
    new L(e.segments, n)
  )
}
var Fo = class {
  constructor(t, r, n) {
    if (
      ((this.isAbsolute = t),
      (this.numberOfDoubleDots = r),
      (this.commands = n),
      t && n.length > 0 && Oo(n[0]))
    )
      throw new w(4003, !1)
    let i = n.find(Nr)
    if (i && i !== gh(n)) throw new w(4004, !1)
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == '/'
    )
  }
}
function Qw(e) {
  if (typeof e[0] == 'string' && e.length === 1 && e[0] === '/')
    return new Fo(!0, 0, e)
  let t = 0,
    r = !1,
    n = e.reduce((i, o, s) => {
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
                  ? (r = !0)
                  : a === '..'
                    ? t++
                    : a != '' && i.push(a))
            }),
            i)
          : [...i, o]
    }, [])
  return new Fo(r, t, n)
}
var Ln = class {
  constructor(t, r, n) {
    ;(this.segmentGroup = t), (this.processChildren = r), (this.index = n)
  }
}
function Kw(e, t, r) {
  if (e.isAbsolute) return new Ln(t, !0, 0)
  if (!r) return new Ln(t, !1, NaN)
  if (r.parent === null) return new Ln(r, !0, 0)
  let n = Oo(e.commands[0]) ? 0 : 1,
    i = r.segments.length - 1 + n
  return Jw(r, i, e.numberOfDoubleDots)
}
function Jw(e, t, r) {
  let n = e,
    i = t,
    o = r
  for (; o > i; ) {
    if (((o -= i), (n = n.parent), !n)) throw new w(4005, !1)
    i = n.segments.length
  }
  return new Ln(n, !1, i - o)
}
function Xw(e) {
  return Nr(e[0]) ? e[0].outlets : { [T]: e }
}
function Sh(e, t, r) {
  if (((e ??= new L([], {})), e.segments.length === 0 && e.hasChildren()))
    return Tr(e, t, r)
  let n = eC(e, t, r),
    i = r.slice(n.commandIndex)
  if (n.match && n.pathIndex < e.segments.length) {
    let o = new L(e.segments.slice(0, n.pathIndex), {})
    return (
      (o.children[T] = new L(e.segments.slice(n.pathIndex), e.children)),
      Tr(o, 0, i)
    )
  } else
    return n.match && i.length === 0
      ? new L(e.segments, {})
      : n.match && !e.hasChildren()
        ? Tu(e, t, r)
        : n.match
          ? Tr(e, 0, i)
          : Tu(e, t, r)
}
function Tr(e, t, r) {
  if (r.length === 0) return new L(e.segments, {})
  {
    let n = Xw(r),
      i = {}
    if (
      Object.keys(n).some((o) => o !== T) &&
      e.children[T] &&
      e.numberOfChildren === 1 &&
      e.children[T].segments.length === 0
    ) {
      let o = Tr(e.children[T], t, r)
      return new L(e.segments, o.children)
    }
    return (
      Object.entries(n).forEach(([o, s]) => {
        typeof s == 'string' && (s = [s]),
          s !== null && (i[o] = Sh(e.children[o], t, s))
      }),
      Object.entries(e.children).forEach(([o, s]) => {
        n[o] === void 0 && (i[o] = s)
      }),
      new L(e.segments, i)
    )
  }
}
function eC(e, t, r) {
  let n = 0,
    i = t,
    o = { match: !1, pathIndex: 0, commandIndex: 0 }
  for (; i < e.segments.length; ) {
    if (n >= r.length) return o
    let s = e.segments[i],
      a = r[n]
    if (Nr(a)) break
    let u = `${a}`,
      c = n < r.length - 1 ? r[n + 1] : null
    if (i > 0 && u === void 0) break
    if (u && c && typeof c == 'object' && c.outlets === void 0) {
      if (!fh(u, c, s)) return o
      n += 2
    } else {
      if (!fh(u, {}, s)) return o
      n++
    }
    i++
  }
  return { match: !0, pathIndex: i, commandIndex: n }
}
function Tu(e, t, r) {
  let n = e.segments.slice(0, t),
    i = 0
  for (; i < r.length; ) {
    let o = r[i]
    if (Nr(o)) {
      let u = tC(o.outlets)
      return new L(n, u)
    }
    if (i === 0 && Oo(r[0])) {
      let u = e.segments[t]
      n.push(new zt(u.path, dh(r[0]))), i++
      continue
    }
    let s = Nr(o) ? o.outlets[T] : `${o}`,
      a = i < r.length - 1 ? r[i + 1] : null
    s && a && Oo(a)
      ? (n.push(new zt(s, dh(a))), (i += 2))
      : (n.push(new zt(s, {})), i++)
  }
  return new L(n, {})
}
function tC(e) {
  let t = {}
  return (
    Object.entries(e).forEach(([r, n]) => {
      typeof n == 'string' && (n = [n]),
        n !== null && (t[r] = Tu(new L([], {}), 0, n))
    }),
    t
  )
}
function dh(e) {
  let t = {}
  return Object.entries(e).forEach(([r, n]) => (t[r] = `${n}`)), t
}
function fh(e, t, r) {
  return e == r.path && Ge(t, r.parameters)
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
    constructor(t, r) {
      ;(this.id = t), (this.url = r)
    }
  },
  Rr = class extends Se {
    constructor(t, r, n = 'imperative', i = null) {
      super(t, r),
        (this.type = te.NavigationStart),
        (this.navigationTrigger = n),
        (this.restoredState = i)
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`
    }
  },
  qt = class extends Se {
    constructor(t, r, n) {
      super(t, r), (this.urlAfterRedirects = n), (this.type = te.NavigationEnd)
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
  Au = (function (e) {
    return (
      (e[(e.IgnoredSameUrlNavigation = 0)] = 'IgnoredSameUrlNavigation'),
      (e[(e.IgnoredByUrlHandlingStrategy = 1)] =
        'IgnoredByUrlHandlingStrategy'),
      e
    )
  })(Au || {}),
  yt = class extends Se {
    constructor(t, r, n, i) {
      super(t, r),
        (this.reason = n),
        (this.code = i),
        (this.type = te.NavigationCancel)
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`
    }
  },
  Wt = class extends Se {
    constructor(t, r, n, i) {
      super(t, r),
        (this.reason = n),
        (this.code = i),
        (this.type = te.NavigationSkipped)
    }
  },
  Or = class extends Se {
    constructor(t, r, n, i) {
      super(t, r),
        (this.error = n),
        (this.target = i),
        (this.type = te.NavigationError)
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`
    }
  },
  Po = class extends Se {
    constructor(t, r, n, i) {
      super(t, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = te.RoutesRecognized)
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
  },
  xu = class extends Se {
    constructor(t, r, n, i) {
      super(t, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = te.GuardsCheckStart)
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
  },
  Nu = class extends Se {
    constructor(t, r, n, i, o) {
      super(t, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.shouldActivate = o),
        (this.type = te.GuardsCheckEnd)
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`
    }
  },
  Ru = class extends Se {
    constructor(t, r, n, i) {
      super(t, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = te.ResolveStart)
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
  },
  Ou = class extends Se {
    constructor(t, r, n, i) {
      super(t, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = te.ResolveEnd)
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
  },
  Fu = class {
    constructor(t) {
      ;(this.route = t), (this.type = te.RouteConfigLoadStart)
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`
    }
  },
  Pu = class {
    constructor(t) {
      ;(this.route = t), (this.type = te.RouteConfigLoadEnd)
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`
    }
  },
  ku = class {
    constructor(t) {
      ;(this.snapshot = t), (this.type = te.ChildActivationStart)
    }
    toString() {
      return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`
    }
  },
  Lu = class {
    constructor(t) {
      ;(this.snapshot = t), (this.type = te.ChildActivationEnd)
    }
    toString() {
      return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`
    }
  },
  Vu = class {
    constructor(t) {
      ;(this.snapshot = t), (this.type = te.ActivationStart)
    }
    toString() {
      return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`
    }
  },
  ju = class {
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
var Uu = class {
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
      onChildOutletCreated(n, i) {
        let o = this.getOrCreateContext(n)
        ;(o.outlet = i), this.contexts.set(n, o)
      }
      onChildOutletDestroyed(n) {
        let i = this.getContext(n)
        i && ((i.outlet = null), (i.attachRef = null))
      }
      onOutletDeactivated() {
        let n = this.contexts
        return (this.contexts = new Map()), n
      }
      onOutletReAttached(n) {
        this.contexts = n
      }
      getOrCreateContext(n) {
        let i = this.getContext(n)
        return i || ((i = new Uu()), this.contexts.set(n, i)), i
      }
      getContext(n) {
        return this.contexts.get(n) || null
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
      let r = this.pathFromRoot(t)
      return r.length > 1 ? r[r.length - 2] : null
    }
    children(t) {
      let r = $u(t, this._root)
      return r ? r.children.map((n) => n.value) : []
    }
    firstChild(t) {
      let r = $u(t, this._root)
      return r && r.children.length > 0 ? r.children[0].value : null
    }
    siblings(t) {
      let r = Bu(t, this._root)
      return r.length < 2
        ? []
        : r[r.length - 2].children.map((i) => i.value).filter((i) => i !== t)
    }
    pathFromRoot(t) {
      return Bu(t, this._root).map((r) => r.value)
    }
  }
function $u(e, t) {
  if (e === t.value) return t
  for (let r of t.children) {
    let n = $u(e, r)
    if (n) return n
  }
  return null
}
function Bu(e, t) {
  if (e === t.value) return [t]
  for (let r of t.children) {
    let n = Bu(e, r)
    if (n.length) return n.unshift(t), n
  }
  return []
}
var we = class {
  constructor(t, r) {
    ;(this.value = t), (this.children = r)
  }
  toString() {
    return `TreeNode(${this.value})`
  }
}
function kn(e) {
  let t = {}
  return e && e.children.forEach((r) => (t[r.value.outlet] = r)), t
}
var Lo = class extends ko {
  constructor(t, r) {
    super(t), (this.snapshot = r), Xu(this, t)
  }
  toString() {
    return this.snapshot.toString()
  }
}
function Th(e) {
  let t = nC(e),
    r = new ee([new zt('', {})]),
    n = new ee({}),
    i = new ee({}),
    o = new ee({}),
    s = new ee(''),
    a = new $n(r, n, o, s, i, T, e, t.root)
  return (a.snapshot = t.root), new Lo(new we(a, []), t)
}
function nC(e) {
  let t = {},
    r = {},
    n = {},
    i = '',
    o = new kr([], t, n, i, r, T, e, null, {})
  return new Vo('', new we(o, []))
}
var $n = class {
  constructor(t, r, n, i, o, s, a, u) {
    ;(this.urlSubject = t),
      (this.paramsSubject = r),
      (this.queryParamsSubject = n),
      (this.fragmentSubject = i),
      (this.dataSubject = o),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = u),
      (this.title = this.dataSubject?.pipe(M((c) => c[jr])) ?? I(void 0)),
      (this.url = t),
      (this.params = r),
      (this.queryParams = n),
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
      (this._paramMap ??= this.params.pipe(M((t) => jn(t)))), this._paramMap
    )
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(M((t) => jn(t)))),
      this._queryParamMap
    )
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`
  }
}
function Ju(e, t, r = 'emptyOnly') {
  let n,
    { routeConfig: i } = e
  return (
    t !== null &&
    (r === 'always' ||
      i?.path === '' ||
      (!t.component && !t.routeConfig?.loadComponent))
      ? (n = {
          params: g(g({}, t.params), e.params),
          data: g(g({}, t.data), e.data),
          resolve: g(g(g(g({}, e.data), t.data), i?.data), e._resolvedData),
        })
      : (n = {
          params: g({}, e.params),
          data: g({}, e.data),
          resolve: g(g({}, e.data), e._resolvedData ?? {}),
        }),
    i && xh(i) && (n.resolve[jr] = i.title),
    n
  )
}
var kr = class {
    get title() {
      return this.data?.[jr]
    }
    constructor(t, r, n, i, o, s, a, u, c) {
      ;(this.url = t),
        (this.params = r),
        (this.queryParams = n),
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
      let t = this.url.map((n) => n.toString()).join('/'),
        r = this.routeConfig ? this.routeConfig.path : ''
      return `Route(url:'${t}', path:'${r}')`
    }
  },
  Vo = class extends ko {
    constructor(t, r) {
      super(r), (this.url = t), Xu(this, r)
    }
    toString() {
      return Ah(this._root)
    }
  }
function Xu(e, t) {
  ;(t.value._routerState = e), t.children.forEach((r) => Xu(e, r))
}
function Ah(e) {
  let t = e.children.length > 0 ? ` { ${e.children.map(Ah).join(', ')} } ` : ''
  return `${e.value}${t}`
}
function Eu(e) {
  if (e.snapshot) {
    let t = e.snapshot,
      r = e._futureSnapshot
    ;(e.snapshot = r),
      Ge(t.queryParams, r.queryParams) ||
        e.queryParamsSubject.next(r.queryParams),
      t.fragment !== r.fragment && e.fragmentSubject.next(r.fragment),
      Ge(t.params, r.params) || e.paramsSubject.next(r.params),
      Nw(t.url, r.url) || e.urlSubject.next(r.url),
      Ge(t.data, r.data) || e.dataSubject.next(r.data)
  } else
    (e.snapshot = e._futureSnapshot), e.dataSubject.next(e._futureSnapshot.data)
}
function Hu(e, t) {
  let r = Ge(e.params, t.params) && Pw(e.url, t.url),
    n = !e.parent != !t.parent
  return r && !n && (!e.parent || Hu(e.parent, t.parent))
}
function xh(e) {
  return typeof e.title == 'string' || e.title === null
}
var rC = (() => {
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
          (this.changeDetector = p($t)),
          (this.environmentInjector = p(he)),
          (this.inputBinder = p(ec, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0)
      }
      get activatedComponentRef() {
        return this.activated
      }
      ngOnChanges(n) {
        if (n.name) {
          let { firstChange: i, previousValue: o } = n.name
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
      isTrackedInParentContexts(n) {
        return this.parentContexts.getContext(n)?.outlet === this
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
        let n = this.parentContexts.getContext(this.name)
        n?.route &&
          (n.attachRef
            ? this.attach(n.attachRef, n.route)
            : this.activateWith(n.route, n.injector))
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
        let n = this.activated
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(n.instance),
          n
        )
      }
      attach(n, i) {
        ;(this.activated = n),
          (this._activatedRoute = i),
          this.location.insert(n.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(n.instance)
      }
      deactivate() {
        if (this.activated) {
          let n = this.component
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(n)
        }
      }
      activateWith(n, i) {
        if (this.isActivated) throw new w(4013, !1)
        this._activatedRoute = n
        let o = this.location,
          a = n.snapshot.component,
          u = this.parentContexts.getOrCreateContext(this.name).children,
          c = new zu(n, u, o.injector)
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
        features: [In],
      }))
    let e = t
    return e
  })(),
  zu = class {
    constructor(t, r, n) {
      ;(this.route = t),
        (this.childContexts = r),
        (this.parent = n),
        (this.__ngOutletInjector = !0)
    }
    get(t, r) {
      return t === $n
        ? this.route
        : t === $o
          ? this.childContexts
          : this.parent.get(t, r)
    }
  },
  ec = new C('')
function iC(e, t, r) {
  let n = Lr(e, t._root, r ? r._root : void 0)
  return new Lo(n, t)
}
function Lr(e, t, r) {
  if (r && e.shouldReuseRoute(t.value, r.value.snapshot)) {
    let n = r.value
    n._futureSnapshot = t.value
    let i = oC(e, t, r)
    return new we(n, i)
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
    let n = sC(t.value),
      i = t.children.map((o) => Lr(e, o))
    return new we(n, i)
  }
}
function oC(e, t, r) {
  return t.children.map((n) => {
    for (let i of r.children)
      if (e.shouldReuseRoute(n.value, i.value.snapshot)) return Lr(e, n, i)
    return Lr(e, n)
  })
}
function sC(e) {
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
var Nh = 'ngNavigationCancelingError'
function Rh(e, t) {
  let { redirectTo: r, navigationBehaviorOptions: n } = Un(t)
      ? { redirectTo: t, navigationBehaviorOptions: void 0 }
      : t,
    i = Oh(!1, Ce.Redirect)
  return (i.url = r), (i.navigationBehaviorOptions = n), i
}
function Oh(e, t) {
  let r = new Error(`NavigationCancelingError: ${e || ''}`)
  return (r[Nh] = !0), (r.cancellationCode = t), r
}
function aC(e) {
  return Fh(e) && Un(e.url)
}
function Fh(e) {
  return !!e && e[Nh]
}
var uC = (() => {
  let t = class t {}
  ;(t.ɵfac = function (i) {
    return new (i || t)()
  }),
    (t.ɵcmp = dt({
      type: t,
      selectors: [['ng-component']],
      standalone: !0,
      features: [gt],
      decls: 1,
      vars: 0,
      template: function (i, o) {
        i & 1 && xn(0, 'router-outlet')
      },
      dependencies: [rC],
      encapsulation: 2,
    }))
  let e = t
  return e
})()
function cC(e, t) {
  return (
    e.providers &&
      !e._injector &&
      (e._injector = nu(e.providers, t, `Route: ${e.path}`)),
    e._injector ?? t
  )
}
function tc(e) {
  let t = e.children && e.children.map(tc),
    r = t ? R(g({}, e), { children: t }) : g({}, e)
  return (
    !r.component &&
      !r.loadComponent &&
      (t || r.loadChildren) &&
      r.outlet &&
      r.outlet !== T &&
      (r.component = uC),
    r
  )
}
function qe(e) {
  return e.outlet || T
}
function lC(e, t) {
  let r = e.filter((n) => qe(n) === t)
  return r.push(...e.filter((n) => qe(n) !== t)), r
}
function Ur(e) {
  if (!e) return null
  if (e.routeConfig?._injector) return e.routeConfig._injector
  for (let t = e.parent; t; t = t.parent) {
    let r = t.routeConfig
    if (r?._loadedInjector) return r._loadedInjector
    if (r?._injector) return r._injector
  }
  return null
}
var dC = (e, t, r, n) =>
    M(
      (i) => (
        new Gu(t, i.targetRouterState, i.currentRouterState, r, n).activate(e),
        i
      ),
    ),
  Gu = class {
    constructor(t, r, n, i, o) {
      ;(this.routeReuseStrategy = t),
        (this.futureState = r),
        (this.currState = n),
        (this.forwardEvent = i),
        (this.inputBindingEnabled = o)
    }
    activate(t) {
      let r = this.futureState._root,
        n = this.currState ? this.currState._root : null
      this.deactivateChildRoutes(r, n, t),
        Eu(this.futureState.root),
        this.activateChildRoutes(r, n, t)
    }
    deactivateChildRoutes(t, r, n) {
      let i = kn(r)
      t.children.forEach((o) => {
        let s = o.value.outlet
        this.deactivateRoutes(o, i[s], n), delete i[s]
      }),
        Object.values(i).forEach((o) => {
          this.deactivateRouteAndItsChildren(o, n)
        })
    }
    deactivateRoutes(t, r, n) {
      let i = t.value,
        o = r ? r.value : null
      if (i === o)
        if (i.component) {
          let s = n.getContext(i.outlet)
          s && this.deactivateChildRoutes(t, r, s.children)
        } else this.deactivateChildRoutes(t, r, n)
      else o && this.deactivateRouteAndItsChildren(r, n)
    }
    deactivateRouteAndItsChildren(t, r) {
      t.value.component &&
      this.routeReuseStrategy.shouldDetach(t.value.snapshot)
        ? this.detachAndStoreRouteSubtree(t, r)
        : this.deactivateRouteAndOutlet(t, r)
    }
    detachAndStoreRouteSubtree(t, r) {
      let n = r.getContext(t.value.outlet),
        i = n && t.value.component ? n.children : r,
        o = kn(t)
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i)
      if (n && n.outlet) {
        let s = n.outlet.detach(),
          a = n.children.onOutletDeactivated()
        this.routeReuseStrategy.store(t.value.snapshot, {
          componentRef: s,
          route: t,
          contexts: a,
        })
      }
    }
    deactivateRouteAndOutlet(t, r) {
      let n = r.getContext(t.value.outlet),
        i = n && t.value.component ? n.children : r,
        o = kn(t)
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i)
      n &&
        (n.outlet && (n.outlet.deactivate(), n.children.onOutletDeactivated()),
        (n.attachRef = null),
        (n.route = null))
    }
    activateChildRoutes(t, r, n) {
      let i = kn(r)
      t.children.forEach((o) => {
        this.activateRoutes(o, i[o.value.outlet], n),
          this.forwardEvent(new ju(o.value.snapshot))
      }),
        t.children.length && this.forwardEvent(new Lu(t.value.snapshot))
    }
    activateRoutes(t, r, n) {
      let i = t.value,
        o = r ? r.value : null
      if ((Eu(i), i === o))
        if (i.component) {
          let s = n.getOrCreateContext(i.outlet)
          this.activateChildRoutes(t, r, s.children)
        } else this.activateChildRoutes(t, r, n)
      else if (i.component) {
        let s = n.getOrCreateContext(i.outlet)
        if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(i.snapshot)
          this.routeReuseStrategy.store(i.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            Eu(a.route.value),
            this.activateChildRoutes(t, null, s.children)
        } else {
          let a = Ur(i.snapshot)
          ;(s.attachRef = null),
            (s.route = i),
            (s.injector = a),
            s.outlet && s.outlet.activateWith(i, s.injector),
            this.activateChildRoutes(t, null, s.children)
        }
      } else this.activateChildRoutes(t, null, n)
    }
  },
  jo = class {
    constructor(t) {
      ;(this.path = t), (this.route = this.path[this.path.length - 1])
    }
  },
  Vn = class {
    constructor(t, r) {
      ;(this.component = t), (this.route = r)
    }
  }
function fC(e, t, r) {
  let n = e._root,
    i = t ? t._root : null
  return _r(n, i, r, [n.value])
}
function hC(e) {
  let t = e.routeConfig ? e.routeConfig.canActivateChild : null
  return !t || t.length === 0 ? null : { node: e, guards: t }
}
function Hn(e, t) {
  let r = Symbol(),
    n = t.get(e, r)
  return n === r ? (typeof e == 'function' && !kl(e) ? e : t.get(e)) : n
}
function _r(
  e,
  t,
  r,
  n,
  i = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let o = kn(t)
  return (
    e.children.forEach((s) => {
      pC(s, o[s.value.outlet], r, n.concat([s.value]), i),
        delete o[s.value.outlet]
    }),
    Object.entries(o).forEach(([s, a]) => xr(a, r.getContext(s), i)),
    i
  )
}
function pC(
  e,
  t,
  r,
  n,
  i = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let o = e.value,
    s = t ? t.value : null,
    a = r ? r.getContext(e.value.outlet) : null
  if (s && o.routeConfig === s.routeConfig) {
    let u = gC(s, o, o.routeConfig.runGuardsAndResolvers)
    u
      ? i.canActivateChecks.push(new jo(n))
      : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
      o.component ? _r(e, t, a ? a.children : null, n, i) : _r(e, t, r, n, i),
      u &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        i.canDeactivateChecks.push(new Vn(a.outlet.component, s))
  } else
    s && xr(t, a, i),
      i.canActivateChecks.push(new jo(n)),
      o.component
        ? _r(e, null, a ? a.children : null, n, i)
        : _r(e, null, r, n, i)
  return i
}
function gC(e, t, r) {
  if (typeof r == 'function') return r(e, t)
  switch (r) {
    case 'pathParamsChange':
      return !Gt(e.url, t.url)
    case 'pathParamsOrQueryParamsChange':
      return !Gt(e.url, t.url) || !Ge(e.queryParams, t.queryParams)
    case 'always':
      return !0
    case 'paramsOrQueryParamsChange':
      return !Hu(e, t) || !Ge(e.queryParams, t.queryParams)
    case 'paramsChange':
    default:
      return !Hu(e, t)
  }
}
function xr(e, t, r) {
  let n = kn(e),
    i = e.value
  Object.entries(n).forEach(([o, s]) => {
    i.component
      ? t
        ? xr(s, t.children.getContext(o), r)
        : xr(s, null, r)
      : xr(s, t, r)
  }),
    i.component
      ? t && t.outlet && t.outlet.isActivated
        ? r.canDeactivateChecks.push(new Vn(t.outlet.component, i))
        : r.canDeactivateChecks.push(new Vn(null, i))
      : r.canDeactivateChecks.push(new Vn(null, i))
}
function $r(e) {
  return typeof e == 'function'
}
function mC(e) {
  return typeof e == 'boolean'
}
function vC(e) {
  return e && $r(e.canLoad)
}
function yC(e) {
  return e && $r(e.canActivate)
}
function DC(e) {
  return e && $r(e.canActivateChild)
}
function wC(e) {
  return e && $r(e.canDeactivate)
}
function CC(e) {
  return e && $r(e.canMatch)
}
function Ph(e) {
  return e instanceof Ze || e?.name === 'EmptyError'
}
var To = Symbol('INITIAL_VALUE')
function Bn() {
  return De((e) =>
    Di(e.map((t) => t.pipe(Ye(1), ys(To)))).pipe(
      M((t) => {
        for (let r of t)
          if (r !== !0) {
            if (r === To) return To
            if (r === !1 || r instanceof vt) return r
          }
        return !0
      }),
      ye((t) => t !== To),
      Ye(1),
    ),
  )
}
function EC(e, t) {
  return Y((r) => {
    let {
      targetSnapshot: n,
      currentSnapshot: i,
      guards: { canActivateChecks: o, canDeactivateChecks: s },
    } = r
    return s.length === 0 && o.length === 0
      ? I(R(g({}, r), { guardsResult: !0 }))
      : IC(s, n, i, e).pipe(
          Y((a) => (a && mC(a) ? bC(n, o, e, t) : I(a))),
          M((a) => R(g({}, r), { guardsResult: a })),
        )
  })
}
function IC(e, t, r, n) {
  return H(e).pipe(
    Y((i) => AC(i.component, i.route, r, t, n)),
    Le((i) => i !== !0, !0),
  )
}
function bC(e, t, r, n) {
  return H(t).pipe(
    ot((i) =>
      rn(
        _C(i.route.parent, n),
        MC(i.route, n),
        TC(e, i.path, r),
        SC(e, i.route, r),
      ),
    ),
    Le((i) => i !== !0, !0),
  )
}
function MC(e, t) {
  return e !== null && t && t(new Vu(e)), I(!0)
}
function _C(e, t) {
  return e !== null && t && t(new ku(e)), I(!0)
}
function SC(e, t, r) {
  let n = t.routeConfig ? t.routeConfig.canActivate : null
  if (!n || n.length === 0) return I(!0)
  let i = n.map((o) =>
    wi(() => {
      let s = Ur(t) ?? r,
        a = Hn(o, s),
        u = yC(a) ? a.canActivate(t, e) : Je(s, () => a(t, e))
      return Dt(u).pipe(Le())
    }),
  )
  return I(i).pipe(Bn())
}
function TC(e, t, r) {
  let n = t[t.length - 1],
    o = t
      .slice(0, t.length - 1)
      .reverse()
      .map((s) => hC(s))
      .filter((s) => s !== null)
      .map((s) =>
        wi(() => {
          let a = s.guards.map((u) => {
            let c = Ur(s.node) ?? r,
              l = Hn(u, c),
              d = DC(l) ? l.canActivateChild(n, e) : Je(c, () => l(n, e))
            return Dt(d).pipe(Le())
          })
          return I(a).pipe(Bn())
        }),
      )
  return I(o).pipe(Bn())
}
function AC(e, t, r, n, i) {
  let o = t && t.routeConfig ? t.routeConfig.canDeactivate : null
  if (!o || o.length === 0) return I(!0)
  let s = o.map((a) => {
    let u = Ur(t) ?? i,
      c = Hn(a, u),
      l = wC(c) ? c.canDeactivate(e, t, r, n) : Je(u, () => c(e, t, r, n))
    return Dt(l).pipe(Le())
  })
  return I(s).pipe(Bn())
}
function xC(e, t, r, n) {
  let i = t.canLoad
  if (i === void 0 || i.length === 0) return I(!0)
  let o = i.map((s) => {
    let a = Hn(s, e),
      u = vC(a) ? a.canLoad(t, r) : Je(e, () => a(t, r))
    return Dt(u)
  })
  return I(o).pipe(Bn(), kh(n))
}
function kh(e) {
  return us(
    G((t) => {
      if (Un(t)) throw Rh(e, t)
    }),
    M((t) => t === !0),
  )
}
function NC(e, t, r, n) {
  let i = t.canMatch
  if (!i || i.length === 0) return I(!0)
  let o = i.map((s) => {
    let a = Hn(s, e),
      u = CC(a) ? a.canMatch(t, r) : Je(e, () => a(t, r))
    return Dt(u)
  })
  return I(o).pipe(Bn(), kh(n))
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
  return nn(new Vr(e))
}
function RC(e) {
  return nn(new w(4e3, !1))
}
function OC(e) {
  return nn(Oh(!1, Ce.GuardRejected))
}
var qu = class {
    constructor(t, r) {
      ;(this.urlSerializer = t), (this.urlTree = r)
    }
    lineralizeSegments(t, r) {
      let n = [],
        i = r.root
      for (;;) {
        if (((n = n.concat(i.segments)), i.numberOfChildren === 0)) return I(n)
        if (i.numberOfChildren > 1 || !i.children[T]) return RC(t.redirectTo)
        i = i.children[T]
      }
    }
    applyRedirectCommands(t, r, n) {
      let i = this.applyRedirectCreateUrlTree(
        r,
        this.urlSerializer.parse(r),
        t,
        n,
      )
      if (r.startsWith('/')) throw new Uo(i)
      return i
    }
    applyRedirectCreateUrlTree(t, r, n, i) {
      let o = this.createSegmentGroup(t, r.root, n, i)
      return new vt(
        o,
        this.createQueryParams(r.queryParams, this.urlTree.queryParams),
        r.fragment,
      )
    }
    createQueryParams(t, r) {
      let n = {}
      return (
        Object.entries(t).forEach(([i, o]) => {
          if (typeof o == 'string' && o.startsWith(':')) {
            let a = o.substring(1)
            n[i] = r[a]
          } else n[i] = o
        }),
        n
      )
    }
    createSegmentGroup(t, r, n, i) {
      let o = this.createSegments(t, r.segments, n, i),
        s = {}
      return (
        Object.entries(r.children).forEach(([a, u]) => {
          s[a] = this.createSegmentGroup(t, u, n, i)
        }),
        new L(o, s)
      )
    }
    createSegments(t, r, n, i) {
      return r.map((o) =>
        o.path.startsWith(':')
          ? this.findPosParam(t, o, i)
          : this.findOrReturn(o, n),
      )
    }
    findPosParam(t, r, n) {
      let i = n[r.path.substring(1)]
      if (!i) throw new w(4001, !1)
      return i
    }
    findOrReturn(t, r) {
      let n = 0
      for (let i of r) {
        if (i.path === t.path) return r.splice(n), i
        n++
      }
      return t
    }
  },
  Wu = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  }
function FC(e, t, r, n, i) {
  let o = nc(e, t, r)
  return o.matched
    ? ((n = cC(t, n)),
      NC(n, t, r, i).pipe(M((s) => (s === !0 ? o : g({}, Wu)))))
    : I(o)
}
function nc(e, t, r) {
  if (t.path === '**') return PC(r)
  if (t.path === '')
    return t.pathMatch === 'full' && (e.hasChildren() || r.length > 0)
      ? g({}, Wu)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: r,
          parameters: {},
          positionalParamSegments: {},
        }
  let i = (t.matcher || xw)(r, e, t)
  if (!i) return g({}, Wu)
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
    remainingSegments: r.slice(i.consumed.length),
    parameters: s,
    positionalParamSegments: i.posParams ?? {},
  }
}
function PC(e) {
  return {
    matched: !0,
    parameters: e.length > 0 ? gh(e).parameters : {},
    consumedSegments: e,
    remainingSegments: [],
    positionalParamSegments: {},
  }
}
function hh(e, t, r, n) {
  return r.length > 0 && VC(e, r, n)
    ? {
        segmentGroup: new L(t, LC(n, new L(r, e.children))),
        slicedSegments: [],
      }
    : r.length === 0 && jC(e, r, n)
      ? {
          segmentGroup: new L(e.segments, kC(e, r, n, e.children)),
          slicedSegments: r,
        }
      : { segmentGroup: new L(e.segments, e.children), slicedSegments: r }
}
function kC(e, t, r, n) {
  let i = {}
  for (let o of r)
    if (Bo(e, t, o) && !n[qe(o)]) {
      let s = new L([], {})
      i[qe(o)] = s
    }
  return g(g({}, n), i)
}
function LC(e, t) {
  let r = {}
  r[T] = t
  for (let n of e)
    if (n.path === '' && qe(n) !== T) {
      let i = new L([], {})
      r[qe(n)] = i
    }
  return r
}
function VC(e, t, r) {
  return r.some((n) => Bo(e, t, n) && qe(n) !== T)
}
function jC(e, t, r) {
  return r.some((n) => Bo(e, t, n))
}
function Bo(e, t, r) {
  return (e.hasChildren() || t.length > 0) && r.pathMatch === 'full'
    ? !1
    : r.path === ''
}
function UC(e, t, r, n) {
  return qe(e) !== n && (n === T || !Bo(t, r, e)) ? !1 : nc(t, e, r).matched
}
function $C(e, t, r) {
  return t.length === 0 && !e.children[r]
}
var Zu = class {}
function BC(e, t, r, n, i, o, s = 'emptyOnly') {
  return new Yu(e, t, r, n, i, s, o).recognize()
}
var HC = 31,
  Yu = class {
    constructor(t, r, n, i, o, s, a) {
      ;(this.injector = t),
        (this.configLoader = r),
        (this.rootComponentType = n),
        (this.config = i),
        (this.urlTree = o),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new qu(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0)
    }
    noMatchError(t) {
      return new w(4002, `'${t.segmentGroup}'`)
    }
    recognize() {
      let t = hh(this.urlTree.root, [], [], this.config).segmentGroup
      return this.match(t).pipe(
        M((r) => {
          let n = new kr(
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
            i = new we(n, r),
            o = new Vo('', i),
            s = Yw(n, [], this.urlTree.queryParams, this.urlTree.fragment)
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
        Ae((n) => {
          if (n instanceof Uo)
            return (this.urlTree = n.urlTree), this.match(n.urlTree.root)
          throw n instanceof Vr ? this.noMatchError(n) : n
        }),
      )
    }
    inheritParamsAndData(t, r) {
      let n = t.value,
        i = Ju(n, r, this.paramsInheritanceStrategy)
      ;(n.params = Object.freeze(i.params)),
        (n.data = Object.freeze(i.data)),
        t.children.forEach((o) => this.inheritParamsAndData(o, n))
    }
    processSegmentGroup(t, r, n, i) {
      return n.segments.length === 0 && n.hasChildren()
        ? this.processChildren(t, r, n)
        : this.processSegment(t, r, n, n.segments, i, !0).pipe(
            M((o) => (o instanceof we ? [o] : [])),
          )
    }
    processChildren(t, r, n) {
      let i = []
      for (let o of Object.keys(n.children))
        o === 'primary' ? i.unshift(o) : i.push(o)
      return H(i).pipe(
        ot((o) => {
          let s = n.children[o],
            a = lC(r, o)
          return this.processSegmentGroup(t, a, s, o)
        }),
        vs((o, s) => (o.push(...s), o)),
        st(null),
        ms(),
        Y((o) => {
          if (o === null) return Pn(n)
          let s = Lh(o)
          return zC(s), I(s)
        }),
      )
    }
    processSegment(t, r, n, i, o, s) {
      return H(r).pipe(
        ot((a) =>
          this.processSegmentAgainstRoute(
            a._injector ?? t,
            r,
            a,
            n,
            i,
            o,
            s,
          ).pipe(
            Ae((u) => {
              if (u instanceof Vr) return I(null)
              throw u
            }),
          ),
        ),
        Le((a) => !!a),
        Ae((a) => {
          if (Ph(a)) return $C(n, i, o) ? I(new Zu()) : Pn(n)
          throw a
        }),
      )
    }
    processSegmentAgainstRoute(t, r, n, i, o, s, a) {
      return UC(n, i, o, s)
        ? n.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(t, i, n, o, s)
          : this.allowRedirects && a
            ? this.expandSegmentAgainstRouteUsingRedirect(t, i, r, n, o, s)
            : Pn(i)
        : Pn(i)
    }
    expandSegmentAgainstRouteUsingRedirect(t, r, n, i, o, s) {
      let {
        matched: a,
        consumedSegments: u,
        positionalParamSegments: c,
        remainingSegments: l,
      } = nc(r, i, o)
      if (!a) return Pn(r)
      i.redirectTo.startsWith('/') &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > HC && (this.allowRedirects = !1))
      let d = this.applyRedirects.applyRedirectCommands(u, i.redirectTo, c)
      return this.applyRedirects
        .lineralizeSegments(i, d)
        .pipe(Y((f) => this.processSegment(t, n, r, f.concat(l), s, !1)))
    }
    matchSegmentAgainstRoute(t, r, n, i, o) {
      let s = FC(r, n, i, t, this.urlSerializer)
      return (
        n.path === '**' && (r.children = {}),
        s.pipe(
          De((a) =>
            a.matched
              ? ((t = n._injector ?? t),
                this.getChildConfig(t, n, i).pipe(
                  De(({ routes: u }) => {
                    let c = n._loadedInjector ?? t,
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
                        qC(n),
                        qe(n),
                        n.component ?? n._loadedComponent ?? null,
                        n,
                        WC(n),
                      ),
                      { segmentGroup: m, slicedSegments: b } = hh(r, l, d, u)
                    if (b.length === 0 && m.hasChildren())
                      return this.processChildren(c, u, m).pipe(
                        M((v) => (v === null ? null : new we(h, v))),
                      )
                    if (u.length === 0 && b.length === 0)
                      return I(new we(h, []))
                    let y = qe(n) === o
                    return this.processSegment(c, u, m, b, y ? T : o, !0).pipe(
                      M((v) => new we(h, v instanceof we ? [v] : [])),
                    )
                  }),
                ))
              : Pn(r),
          ),
        )
      )
    }
    getChildConfig(t, r, n) {
      return r.children
        ? I({ routes: r.children, injector: t })
        : r.loadChildren
          ? r._loadedRoutes !== void 0
            ? I({ routes: r._loadedRoutes, injector: r._loadedInjector })
            : xC(t, r, n, this.urlSerializer).pipe(
                Y((i) =>
                  i
                    ? this.configLoader.loadChildren(t, r).pipe(
                        G((o) => {
                          ;(r._loadedRoutes = o.routes),
                            (r._loadedInjector = o.injector)
                        }),
                      )
                    : OC(r),
                ),
              )
          : I({ routes: [], injector: t })
    }
  }
function zC(e) {
  e.sort((t, r) =>
    t.value.outlet === T
      ? -1
      : r.value.outlet === T
        ? 1
        : t.value.outlet.localeCompare(r.value.outlet),
  )
}
function GC(e) {
  let t = e.value.routeConfig
  return t && t.path === ''
}
function Lh(e) {
  let t = [],
    r = new Set()
  for (let n of e) {
    if (!GC(n)) {
      t.push(n)
      continue
    }
    let i = t.find((o) => n.value.routeConfig === o.value.routeConfig)
    i !== void 0 ? (i.children.push(...n.children), r.add(i)) : t.push(n)
  }
  for (let n of r) {
    let i = Lh(n.children)
    t.push(new we(n.value, i))
  }
  return t.filter((n) => !r.has(n))
}
function qC(e) {
  return e.data || {}
}
function WC(e) {
  return e.resolve || {}
}
function ZC(e, t, r, n, i, o) {
  return Y((s) =>
    BC(e, t, r, n, s.extractedUrl, i, o).pipe(
      M(({ state: a, tree: u }) =>
        R(g({}, s), { targetSnapshot: a, urlAfterRedirects: u }),
      ),
    ),
  )
}
function YC(e, t) {
  return Y((r) => {
    let {
      targetSnapshot: n,
      guards: { canActivateChecks: i },
    } = r
    if (!i.length) return I(r)
    let o = new Set(i.map((u) => u.route)),
      s = new Set()
    for (let u of o) if (!s.has(u)) for (let c of Vh(u)) s.add(c)
    let a = 0
    return H(s).pipe(
      ot((u) =>
        o.has(u)
          ? QC(u, n, e, t)
          : ((u.data = Ju(u, u.parent, e).resolve), I(void 0)),
      ),
      G(() => a++),
      on(1),
      Y((u) => (a === s.size ? I(r) : ve)),
    )
  })
}
function Vh(e) {
  let t = e.children.map((r) => Vh(r)).flat()
  return [e, ...t]
}
function QC(e, t, r, n) {
  let i = e.routeConfig,
    o = e._resolve
  return (
    i?.title !== void 0 && !xh(i) && (o[jr] = i.title),
    KC(o, e, t, n).pipe(
      M(
        (s) => (
          (e._resolvedData = s), (e.data = Ju(e, e.parent, r).resolve), null
        ),
      ),
    )
  )
}
function KC(e, t, r, n) {
  let i = Mu(e)
  if (i.length === 0) return I({})
  let o = {}
  return H(i).pipe(
    Y((s) =>
      JC(e[s], t, r, n).pipe(
        Le(),
        G((a) => {
          o[s] = a
        }),
      ),
    ),
    on(1),
    gs(o),
    Ae((s) => (Ph(s) ? ve : nn(s))),
  )
}
function JC(e, t, r, n) {
  let i = Ur(t) ?? n,
    o = Hn(e, i),
    s = o.resolve ? o.resolve(t, r) : Je(i, () => o(t, r))
  return Dt(s)
}
function Iu(e) {
  return De((t) => {
    let r = e(t)
    return r ? H(r).pipe(M(() => t)) : I(t)
  })
}
var jh = (() => {
    let t = class t {
      buildTitle(n) {
        let i,
          o = n.root
        for (; o !== void 0; )
          (i = this.getResolvedTitleForRoute(o) ?? i),
            (o = o.children.find((s) => s.outlet === T))
        return i
      }
      getResolvedTitleForRoute(n) {
        return n.data[jr]
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)()
    }),
      (t.ɵprov = D({ token: t, factory: () => p(XC), providedIn: 'root' }))
    let e = t
    return e
  })(),
  XC = (() => {
    let t = class t extends jh {
      constructor(n) {
        super(), (this.title = n)
      }
      updateTitle(n) {
        let i = this.buildTitle(n)
        i !== void 0 && this.title.setTitle(i)
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)(S(uh))
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })(),
  rc = new C('', { providedIn: 'root', factory: () => ({}) }),
  ic = new C(''),
  eE = (() => {
    let t = class t {
      constructor() {
        ;(this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = p(ou))
      }
      loadComponent(n) {
        if (this.componentLoaders.get(n)) return this.componentLoaders.get(n)
        if (n._loadedComponent) return I(n._loadedComponent)
        this.onLoadStartListener && this.onLoadStartListener(n)
        let i = Dt(n.loadComponent()).pipe(
            M(Uh),
            G((s) => {
              this.onLoadEndListener && this.onLoadEndListener(n),
                (n._loadedComponent = s)
            }),
            It(() => {
              this.componentLoaders.delete(n)
            }),
          ),
          o = new tn(i, () => new se()).pipe(en())
        return this.componentLoaders.set(n, o), o
      }
      loadChildren(n, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i)
        if (i._loadedRoutes)
          return I({ routes: i._loadedRoutes, injector: i._loadedInjector })
        this.onLoadStartListener && this.onLoadStartListener(i)
        let s = tE(i, this.compiler, n, this.onLoadEndListener).pipe(
            It(() => {
              this.childrenLoaders.delete(i)
            }),
          ),
          a = new tn(s, () => new se()).pipe(en())
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
function tE(e, t, r, n) {
  return Dt(e.loadChildren()).pipe(
    M(Uh),
    Y((i) =>
      i instanceof lr || Array.isArray(i) ? I(i) : H(t.compileModuleAsync(i)),
    ),
    M((i) => {
      n && n(e)
      let o,
        s,
        a = !1
      return (
        Array.isArray(i)
          ? ((s = i), (a = !0))
          : ((o = i.create(r).injector),
            (s = o.get(ic, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(tc), injector: o }
      )
    }),
  )
}
function nE(e) {
  return e && typeof e == 'object' && 'default' in e
}
function Uh(e) {
  return nE(e) ? e.default : e
}
var oc = (() => {
    let t = class t {}
    ;(t.ɵfac = function (i) {
      return new (i || t)()
    }),
      (t.ɵprov = D({ token: t, factory: () => p(rE), providedIn: 'root' }))
    let e = t
    return e
  })(),
  rE = (() => {
    let t = class t {
      shouldProcessUrl(n) {
        return !0
      }
      extract(n) {
        return n
      }
      merge(n, i) {
        return n
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)()
    }),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })(),
  iE = new C('')
var oE = (() => {
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
        (this.configLoader = p(eE)),
        (this.environmentInjector = p(he)),
        (this.urlSerializer = p(Ku)),
        (this.rootContexts = p($o)),
        (this.location = p(yr)),
        (this.inputBindingEnabled = p(ec, { optional: !0 }) !== null),
        (this.titleStrategy = p(jh)),
        (this.options = p(rc, { optional: !0 }) || {}),
        (this.paramsInheritanceStrategy =
          this.options.paramsInheritanceStrategy || 'emptyOnly'),
        (this.urlHandlingStrategy = p(oc)),
        (this.createViewTransition = p(iE, { optional: !0 })),
        (this.navigationId = 0),
        (this.afterPreactivation = () => I(void 0)),
        (this.rootComponentType = null)
      let n = (o) => this.events.next(new Fu(o)),
        i = (o) => this.events.next(new Pu(o))
      ;(this.configLoader.onLoadEndListener = i),
        (this.configLoader.onLoadStartListener = n)
    }
    complete() {
      this.transitions?.complete()
    }
    handleNavigationRequest(n) {
      let i = ++this.navigationId
      this.transitions?.next(R(g(g({}, this.transitions.value), n), { id: i }))
    }
    setupNavigations(n, i, o) {
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
          M((s) =>
            R(g({}, s), {
              extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl),
            }),
          ),
          De((s) => {
            let a = !1,
              u = !1
            return I(s).pipe(
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
                    !n.navigated ||
                    this.isUpdatingInternalState() ||
                    this.isUpdatedBrowserUrl(),
                  d = c.extras.onSameUrlNavigation ?? n.onSameUrlNavigation
                if (!l && d !== 'reload') {
                  let f = ''
                  return (
                    this.events.next(
                      new Wt(
                        c.id,
                        this.urlSerializer.serialize(c.rawUrl),
                        f,
                        Au.IgnoredSameUrlNavigation,
                      ),
                    ),
                    c.resolve(null),
                    ve
                  )
                }
                if (this.urlHandlingStrategy.shouldProcessUrl(c.rawUrl))
                  return I(c).pipe(
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
                    ZC(
                      this.environmentInjector,
                      this.configLoader,
                      this.rootComponentType,
                      n.config,
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
                      restoredState: b,
                      extras: y,
                    } = c,
                    v = new Rr(f, this.urlSerializer.serialize(h), m, b)
                  this.events.next(v)
                  let ne = Th(this.rootComponentType).snapshot
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
                    I(s)
                  )
                } else {
                  let f = ''
                  return (
                    this.events.next(
                      new Wt(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        f,
                        Au.IgnoredByUrlHandlingStrategy,
                      ),
                    ),
                    c.resolve(null),
                    ve
                  )
                }
              }),
              G((c) => {
                let l = new xu(
                  c.id,
                  this.urlSerializer.serialize(c.extractedUrl),
                  this.urlSerializer.serialize(c.urlAfterRedirects),
                  c.targetSnapshot,
                )
                this.events.next(l)
              }),
              M(
                (c) => (
                  (this.currentTransition = s =
                    R(g({}, c), {
                      guards: fC(
                        c.targetSnapshot,
                        c.currentSnapshot,
                        this.rootContexts,
                      ),
                    })),
                  s
                ),
              ),
              EC(this.environmentInjector, (c) => this.events.next(c)),
              G((c) => {
                if (((s.guardsResult = c.guardsResult), Un(c.guardsResult)))
                  throw Rh(this.urlSerializer, c.guardsResult)
                let l = new Nu(
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
              Iu((c) => {
                if (c.guards.canActivateChecks.length)
                  return I(c).pipe(
                    G((l) => {
                      let d = new Ru(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects),
                        l.targetSnapshot,
                      )
                      this.events.next(d)
                    }),
                    De((l) => {
                      let d = !1
                      return I(l).pipe(
                        YC(
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
                      let d = new Ou(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects),
                        l.targetSnapshot,
                      )
                      this.events.next(d)
                    }),
                  )
              }),
              Iu((c) => {
                let l = (d) => {
                  let f = []
                  d.routeConfig?.loadComponent &&
                    !d.routeConfig._loadedComponent &&
                    f.push(
                      this.configLoader.loadComponent(d.routeConfig).pipe(
                        G((h) => {
                          d.component = h
                        }),
                        M(() => {}),
                      ),
                    )
                  for (let h of d.children) f.push(...l(h))
                  return f
                }
                return Di(l(c.targetSnapshot.root)).pipe(st(null), Ye(1))
              }),
              Iu(() => this.afterPreactivation()),
              De(() => {
                let { currentSnapshot: c, targetSnapshot: l } = s,
                  d = this.createViewTransition?.(
                    this.environmentInjector,
                    c.root,
                    l.root,
                  )
                return d ? H(d).pipe(M(() => s)) : I(s)
              }),
              M((c) => {
                let l = iC(
                  n.routeReuseStrategy,
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
              dC(
                this.rootContexts,
                n.routeReuseStrategy,
                (c) => this.events.next(c),
                this.inputBindingEnabled,
              ),
              Ye(1),
              G({
                next: (c) => {
                  ;(a = !0),
                    (this.lastSuccessfulNavigation = this.currentNavigation),
                    this.events.next(
                      new qt(
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
              Ds(
                this.transitionAbortSubject.pipe(
                  G((c) => {
                    throw c
                  }),
                ),
              ),
              It(() => {
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
                if (((u = !0), Fh(c)))
                  this.events.next(
                    new yt(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      c.message,
                      c.cancellationCode,
                    ),
                  ),
                    aC(c) ? this.events.next(new Pr(c.url)) : s.resolve(!1)
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
                    s.resolve(n.errorHandler(c))
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
    cancelNavigationTransition(n, i, o) {
      let s = new yt(n.id, this.urlSerializer.serialize(n.extractedUrl), i, o)
      this.events.next(s), n.resolve(!1)
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
function sE(e) {
  return e !== Ar
}
var aE = (() => {
    let t = class t {}
    ;(t.ɵfac = function (i) {
      return new (i || t)()
    }),
      (t.ɵprov = D({ token: t, factory: () => p(uE), providedIn: 'root' }))
    let e = t
    return e
  })(),
  Qu = class {
    shouldDetach(t) {
      return !1
    }
    store(t, r) {}
    shouldAttach(t) {
      return !1
    }
    retrieve(t) {
      return null
    }
    shouldReuseRoute(t, r) {
      return t.routeConfig === r.routeConfig
    }
  },
  uE = (() => {
    let t = class t extends Qu {}
    ;(t.ɵfac = (() => {
      let n
      return function (o) {
        return (n || (n = bn(t)))(o || t)
      }
    })()),
      (t.ɵprov = D({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })(),
  $h = (() => {
    let t = class t {}
    ;(t.ɵfac = function (i) {
      return new (i || t)()
    }),
      (t.ɵprov = D({ token: t, factory: () => p(cE), providedIn: 'root' }))
    let e = t
    return e
  })(),
  cE = (() => {
    let t = class t extends $h {
      constructor() {
        super(...arguments),
          (this.location = p(yr)),
          (this.urlSerializer = p(Ku)),
          (this.options = p(rc, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || 'replace'),
          (this.urlHandlingStrategy = p(oc)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || 'deferred'),
          (this.currentUrlTree = new vt()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = Th(null)),
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
      registerNonRouterCurrentEntryChangeListener(n) {
        return this.location.subscribe((i) => {
          i.type === 'popstate' && n(i.url, i.state)
        })
      }
      handleRouterEvent(n, i) {
        if (n instanceof Rr) this.stateMemento = this.createStateMemento()
        else if (n instanceof Wt) this.rawUrlTree = i.initialUrl
        else if (n instanceof Po) {
          if (
            this.urlUpdateStrategy === 'eager' &&
            !i.extras.skipLocationChange
          ) {
            let o = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl)
            this.setBrowserUrl(o, i)
          }
        } else
          n instanceof Fr
            ? ((this.currentUrlTree = i.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                i.finalUrl,
                i.initialUrl,
              )),
              (this.routerState = i.targetRouterState),
              this.urlUpdateStrategy === 'deferred' &&
                (i.extras.skipLocationChange ||
                  this.setBrowserUrl(this.rawUrlTree, i)))
            : n instanceof yt &&
                (n.code === Ce.GuardRejected ||
                  n.code === Ce.NoDataFromResolver)
              ? this.restoreHistory(i)
              : n instanceof Or
                ? this.restoreHistory(i, !0)
                : n instanceof qt &&
                  ((this.lastSuccessfulId = n.id),
                  (this.currentPageId = this.browserPageId))
      }
      setBrowserUrl(n, i) {
        let o = this.urlSerializer.serialize(n)
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
      restoreHistory(n, i = !1) {
        if (this.canceledNavigationResolution === 'computed') {
          let o = this.browserPageId,
            s = this.currentPageId - o
          s !== 0
            ? this.location.historyGo(s)
            : this.currentUrlTree === n.finalUrl &&
              s === 0 &&
              (this.resetState(n), this.resetUrlToCurrentUrlTree())
        } else
          this.canceledNavigationResolution === 'replace' &&
            (i && this.resetState(n), this.resetUrlToCurrentUrlTree())
      }
      resetState(n) {
        ;(this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            n.finalUrl ?? this.rawUrlTree,
          ))
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          '',
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId),
        )
      }
      generateNgRouterState(n, i) {
        return this.canceledNavigationResolution === 'computed'
          ? { navigationId: n, ɵrouterPageId: i }
          : { navigationId: n }
      }
    }
    ;(t.ɵfac = (() => {
      let n
      return function (o) {
        return (n || (n = bn(t)))(o || t)
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
function lE(e, t) {
  e.events
    .pipe(
      ye(
        (r) =>
          r instanceof qt ||
          r instanceof yt ||
          r instanceof Or ||
          r instanceof Wt,
      ),
      M((r) =>
        r instanceof qt || r instanceof Wt
          ? Sr.COMPLETE
          : (
                r instanceof yt
                  ? r.code === Ce.Redirect ||
                    r.code === Ce.SupersededByNewNavigation
                  : !1
              )
            ? Sr.REDIRECTING
            : Sr.FAILED,
      ),
      ye((r) => r !== Sr.REDIRECTING),
      Ye(1),
    )
    .subscribe(() => {
      t()
    })
}
function dE(e) {
  throw e
}
var fE = {
    paths: 'exact',
    fragment: 'ignored',
    matrixParams: 'ignored',
    queryParams: 'exact',
  },
  hE = {
    paths: 'subset',
    fragment: 'ignored',
    matrixParams: 'ignored',
    queryParams: 'subset',
  },
  Bh = (() => {
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
          (this.stateManager = p($h)),
          (this.options = p(rc, { optional: !0 }) || {}),
          (this.pendingTasks = p(Tn)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || 'deferred'),
          (this.navigationTransitions = p(oE)),
          (this.urlSerializer = p(Ku)),
          (this.location = p(yr)),
          (this.urlHandlingStrategy = p(oc)),
          (this._events = new se()),
          (this.errorHandler = this.options.errorHandler || dE),
          (this.navigated = !1),
          (this.routeReuseStrategy = p(aE)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || 'ignore'),
          (this.config = p(ic, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!p(ec, { optional: !0 })),
          (this.eventsSubscription = new Z()),
          (this.isNgZoneEnabled = p(q) instanceof q && q.isInAngularZone()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (n) => {
                this.console.warn(n)
              },
            }),
          this.subscribeToNavigationEvents()
      }
      subscribeToNavigationEvents() {
        let n = this.navigationTransitions.events.subscribe((i) => {
          try {
            let o = this.navigationTransitions.currentTransition,
              s = this.navigationTransitions.currentNavigation
            if (o !== null && s !== null) {
              if (
                (this.stateManager.handleRouterEvent(i, s),
                i instanceof yt &&
                  i.code !== Ce.Redirect &&
                  i.code !== Ce.SupersededByNewNavigation)
              )
                this.navigated = !0
              else if (i instanceof qt) this.navigated = !0
              else if (i instanceof Pr) {
                let a = this.urlHandlingStrategy.merge(i.url, o.currentRawUrl),
                  u = {
                    info: o.extras.info,
                    skipLocationChange: o.extras.skipLocationChange,
                    replaceUrl:
                      this.urlUpdateStrategy === 'eager' || sE(o.source),
                  }
                this.scheduleNavigation(a, Ar, null, u, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                })
              }
            }
            gE(i) && this._events.next(i)
          } catch (o) {
            this.navigationTransitions.transitionAbortSubject.next(o)
          }
        })
        this.eventsSubscription.add(n)
      }
      resetRootComponentType(n) {
        ;(this.routerState.root.component = n),
          (this.navigationTransitions.rootComponentType = n)
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
            (n, i) => {
              setTimeout(() => {
                this.navigateToSyncWithBrowser(n, 'popstate', i)
              }, 0)
            },
          )
      }
      navigateToSyncWithBrowser(n, i, o) {
        let s = { replaceUrl: !0 },
          a = o?.navigationId ? o : null
        if (o) {
          let c = g({}, o)
          delete c.navigationId,
            delete c.ɵrouterPageId,
            Object.keys(c).length !== 0 && (s.state = c)
        }
        let u = this.parseUrl(n)
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
      resetConfig(n) {
        ;(this.config = n.map(tc)), (this.navigated = !1)
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
      createUrlTree(n, i = {}) {
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
          f = bh(h)
        } catch {
          ;(typeof n[0] != 'string' || !n[0].startsWith('/')) && (n = []),
            (f = this.currentUrlTree.root)
        }
        return Mh(f, n, d, l ?? null)
      }
      navigateByUrl(n, i = { skipLocationChange: !1 }) {
        let o = Un(n) ? n : this.parseUrl(n),
          s = this.urlHandlingStrategy.merge(o, this.rawUrlTree)
        return this.scheduleNavigation(s, Ar, null, i)
      }
      navigate(n, i = { skipLocationChange: !1 }) {
        return pE(n), this.navigateByUrl(this.createUrlTree(n, i), i)
      }
      serializeUrl(n) {
        return this.urlSerializer.serialize(n)
      }
      parseUrl(n) {
        try {
          return this.urlSerializer.parse(n)
        } catch {
          return this.urlSerializer.parse('/')
        }
      }
      isActive(n, i) {
        let o
        if (
          (i === !0 ? (o = g({}, fE)) : i === !1 ? (o = g({}, hE)) : (o = i),
          Un(n))
        )
          return ch(this.currentUrlTree, n, o)
        let s = this.parseUrl(n)
        return ch(this.currentUrlTree, s, o)
      }
      removeEmptyProps(n) {
        return Object.entries(n).reduce(
          (i, [o, s]) => (s != null && (i[o] = s), i),
          {},
        )
      }
      scheduleNavigation(n, i, o, s, a) {
        if (this.disposed) return Promise.resolve(!1)
        let u, c, l
        a
          ? ((u = a.resolve), (c = a.reject), (l = a.promise))
          : (l = new Promise((f, h) => {
              ;(u = f), (c = h)
            }))
        let d = this.pendingTasks.add()
        return (
          lE(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(d))
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: i,
            restoredState: o,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: n,
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
function pE(e) {
  for (let t = 0; t < e.length; t++) if (e[t] == null) throw new w(4008, !1)
}
function gE(e) {
  return !(e instanceof Fr) && !(e instanceof Pr)
}
var mE = new C('')
function Hh(e, ...t) {
  return Cn([
    { provide: ic, multi: !0, useValue: e },
    [],
    { provide: $n, useFactory: vE, deps: [Bh] },
    { provide: ho, multi: !0, useFactory: yE },
    t.map((r) => r.ɵproviders),
  ])
}
function vE(e) {
  return e.routerState.root
}
function yE() {
  let e = p(Mn)
  return (t) => {
    let r = e.get(Nn)
    if (t !== r.components[0]) return
    let n = e.get(Bh),
      i = e.get(DE)
    e.get(wE) === 1 && n.initialNavigation(),
      e.get(CE, null, x.Optional)?.setUpPreloading(),
      e.get(mE, null, x.Optional)?.init(),
      n.resetRootComponentType(r.componentTypes[0]),
      i.closed || (i.next(), i.complete(), i.unsubscribe())
  }
}
var DE = new C('', { factory: () => new se() }),
  wE = new C('', { providedIn: 'root', factory: () => 1 })
var CE = new C('')
var zh = []
var Gh = { providers: [Hh(zh), Xf()] }
var Xh = (() => {
    let t = class t {
      constructor(n, i) {
        ;(this._renderer = n),
          (this._elementRef = i),
          (this.onChange = (o) => {}),
          (this.onTouched = () => {})
      }
      setProperty(n, i) {
        this._renderer.setProperty(this._elementRef.nativeElement, n, i)
      }
      registerOnTouched(n) {
        this.onTouched = n
      }
      registerOnChange(n) {
        this.onChange = n
      }
      setDisabledState(n) {
        this.setProperty('disabled', n)
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)(J(Sn), J(kt))
    }),
      (t.ɵdir = He({ type: t }))
    let e = t
    return e
  })(),
  ep = (() => {
    let t = class t extends Xh {}
    ;(t.ɵfac = (() => {
      let n
      return function (o) {
        return (n || (n = bn(t)))(o || t)
      }
    })()),
      (t.ɵdir = He({ type: t, features: [Vt] }))
    let e = t
    return e
  })(),
  lc = new C('')
var EE = { provide: lc, useExisting: wn(() => Gn), multi: !0 }
function IE() {
  let e = nt() ? nt().getUserAgent() : ''
  return /android (\d+)/.test(e.toLowerCase())
}
var bE = new C(''),
  Gn = (() => {
    let t = class t extends Xh {
      constructor(n, i, o) {
        super(n, i),
          (this._compositionMode = o),
          (this._composing = !1),
          this._compositionMode == null && (this._compositionMode = !IE())
      }
      writeValue(n) {
        let i = n ?? ''
        this.setProperty('value', i)
      }
      _handleInput(n) {
        ;(!this._compositionMode ||
          (this._compositionMode && !this._composing)) &&
          this.onChange(n)
      }
      _compositionStart() {
        this._composing = !0
      }
      _compositionEnd(n) {
        ;(this._composing = !1), this._compositionMode && this.onChange(n)
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)(J(Sn), J(kt), J(bE, 8))
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
        features: [pt([EE]), Vt],
      }))
    let e = t
    return e
  })()
var ME = new C(''),
  _E = new C('')
function tp(e) {
  return e != null
}
function np(e) {
  return Ut(e) ? H(e) : e
}
function rp(e) {
  let t = {}
  return (
    e.forEach((r) => {
      t = r != null ? g(g({}, t), r) : t
    }),
    Object.keys(t).length === 0 ? null : t
  )
}
function ip(e, t) {
  return t.map((r) => r(e))
}
function SE(e) {
  return !e.validate
}
function op(e) {
  return e.map((t) => (SE(t) ? t : (r) => t.validate(r)))
}
function TE(e) {
  if (!e) return null
  let t = e.filter(tp)
  return t.length == 0
    ? null
    : function (r) {
        return rp(ip(r, t))
      }
}
function sp(e) {
  return e != null ? TE(op(e)) : null
}
function AE(e) {
  if (!e) return null
  let t = e.filter(tp)
  return t.length == 0
    ? null
    : function (r) {
        let n = ip(r, t).map(np)
        return ps(n).pipe(M(rp))
      }
}
function ap(e) {
  return e != null ? AE(op(e)) : null
}
function qh(e, t) {
  return e === null ? [t] : Array.isArray(e) ? [...e, t] : [e, t]
}
function xE(e) {
  return e._rawValidators
}
function NE(e) {
  return e._rawAsyncValidators
}
function sc(e) {
  return e ? (Array.isArray(e) ? e : [e]) : []
}
function zo(e, t) {
  return Array.isArray(e) ? e.includes(t) : e === t
}
function Wh(e, t) {
  let r = sc(t)
  return (
    sc(e).forEach((i) => {
      zo(r, i) || r.push(i)
    }),
    r
  )
}
function Zh(e, t) {
  return sc(t).filter((r) => !zo(e, r))
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
        (this._composedValidatorFn = sp(this._rawValidators))
    }
    _setAsyncValidators(t) {
      ;(this._rawAsyncValidators = t || []),
        (this._composedAsyncValidatorFn = ap(this._rawAsyncValidators))
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
    hasError(t, r) {
      return this.control ? this.control.hasError(t, r) : !1
    }
    getError(t, r) {
      return this.control ? this.control.getError(t, r) : null
    }
  },
  ac = class extends Go {
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
  uc = class {
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
  RE = {
    '[class.ng-untouched]': 'isUntouched',
    '[class.ng-touched]': 'isTouched',
    '[class.ng-pristine]': 'isPristine',
    '[class.ng-dirty]': 'isDirty',
    '[class.ng-valid]': 'isValid',
    '[class.ng-invalid]': 'isInvalid',
    '[class.ng-pending]': 'isPending',
  },
  ox = R(g({}, RE), { '[class.ng-submitted]': 'isSubmitted' }),
  qo = (() => {
    let t = class t extends uc {
      constructor(n) {
        super(n)
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
            ru('ng-untouched', o.isUntouched)('ng-touched', o.isTouched)(
              'ng-pristine',
              o.isPristine,
            )('ng-dirty', o.isDirty)('ng-valid', o.isValid)(
              'ng-invalid',
              o.isInvalid,
            )('ng-pending', o.isPending)
        },
        features: [Vt],
      }))
    let e = t
    return e
  })()
var Br = 'VALID',
  Ho = 'INVALID',
  zn = 'PENDING',
  Hr = 'DISABLED'
function OE(e) {
  return (Wo(e) ? e.validators : e) || null
}
function FE(e) {
  return Array.isArray(e) ? sp(e) : e || null
}
function PE(e, t) {
  return (Wo(t) ? t.asyncValidators : e) || null
}
function kE(e) {
  return Array.isArray(e) ? ap(e) : e || null
}
function Wo(e) {
  return e != null && !Array.isArray(e) && typeof e == 'object'
}
var cc = class {
  constructor(t, r) {
    ;(this._pendingDirty = !1),
      (this._hasOwnPendingAsyncValidator = !1),
      (this._pendingTouched = !1),
      (this._onCollectionChange = () => {}),
      (this._parent = null),
      (this.pristine = !0),
      (this.touched = !1),
      (this._onDisabledChange = []),
      this._assignValidators(t),
      this._assignAsyncValidators(r)
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
    this.setValidators(Wh(t, this._rawValidators))
  }
  addAsyncValidators(t) {
    this.setAsyncValidators(Wh(t, this._rawAsyncValidators))
  }
  removeValidators(t) {
    this.setValidators(Zh(t, this._rawValidators))
  }
  removeAsyncValidators(t) {
    this.setAsyncValidators(Zh(t, this._rawAsyncValidators))
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
      this._forEachChild((r) => {
        r.markAsUntouched({ onlySelf: !0 })
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
      this._forEachChild((r) => {
        r.markAsPristine({ onlySelf: !0 })
      }),
      this._parent && !t.onlySelf && this._parent._updatePristine(t)
  }
  markAsPending(t = {}) {
    ;(this.status = zn),
      t.emitEvent !== !1 && this.statusChanges.emit(this.status),
      this._parent && !t.onlySelf && this._parent.markAsPending(t)
  }
  disable(t = {}) {
    let r = this._parentMarkedDirty(t.onlySelf)
    ;(this.status = Hr),
      (this.errors = null),
      this._forEachChild((n) => {
        n.disable(R(g({}, t), { onlySelf: !0 }))
      }),
      this._updateValue(),
      t.emitEvent !== !1 &&
        (this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
      this._updateAncestors(R(g({}, t), { skipPristineCheck: r })),
      this._onDisabledChange.forEach((n) => n(!0))
  }
  enable(t = {}) {
    let r = this._parentMarkedDirty(t.onlySelf)
    ;(this.status = Br),
      this._forEachChild((n) => {
        n.enable(R(g({}, t), { onlySelf: !0 }))
      }),
      this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent }),
      this._updateAncestors(R(g({}, t), { skipPristineCheck: r })),
      this._onDisabledChange.forEach((n) => n(!1))
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
    this._forEachChild((r) => r._updateTreeValidity(t)),
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
      let r = np(this.asyncValidator(this))
      this._asyncValidationSubscription = r.subscribe((n) => {
        ;(this._hasOwnPendingAsyncValidator = !1),
          this.setErrors(n, { emitEvent: t })
      })
    }
  }
  _cancelExistingSubscription() {
    this._asyncValidationSubscription &&
      (this._asyncValidationSubscription.unsubscribe(),
      (this._hasOwnPendingAsyncValidator = !1))
  }
  setErrors(t, r = {}) {
    ;(this.errors = t), this._updateControlsErrors(r.emitEvent !== !1)
  }
  get(t) {
    let r = t
    return r == null || (Array.isArray(r) || (r = r.split('.')), r.length === 0)
      ? null
      : r.reduce((n, i) => n && n._find(i), this)
  }
  getError(t, r) {
    let n = r ? this.get(r) : this
    return n && n.errors ? n.errors[t] : null
  }
  hasError(t, r) {
    return !!this.getError(t, r)
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
    return this._anyControls((r) => r.status === t)
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
    let r = this._parent && this._parent.dirty
    return !t && !!r && !this._parent._anyControlsDirty()
  }
  _find(t) {
    return null
  }
  _assignValidators(t) {
    ;(this._rawValidators = Array.isArray(t) ? t.slice() : t),
      (this._composedValidatorFn = FE(this._rawValidators))
  }
  _assignAsyncValidators(t) {
    ;(this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t),
      (this._composedAsyncValidatorFn = kE(this._rawAsyncValidators))
  }
}
var up = new C('CallSetDisabledState', {
    providedIn: 'root',
    factory: () => dc,
  }),
  dc = 'always'
function LE(e, t) {
  return [...t.path, e]
}
function VE(e, t, r = dc) {
  UE(e, t),
    t.valueAccessor.writeValue(e.value),
    (e.disabled || r === 'always') &&
      t.valueAccessor.setDisabledState?.(e.disabled),
    $E(e, t),
    HE(e, t),
    BE(e, t),
    jE(e, t)
}
function Yh(e, t) {
  e.forEach((r) => {
    r.registerOnValidatorChange && r.registerOnValidatorChange(t)
  })
}
function jE(e, t) {
  if (t.valueAccessor.setDisabledState) {
    let r = (n) => {
      t.valueAccessor.setDisabledState(n)
    }
    e.registerOnDisabledChange(r),
      t._registerOnDestroy(() => {
        e._unregisterOnDisabledChange(r)
      })
  }
}
function UE(e, t) {
  let r = xE(e)
  t.validator !== null
    ? e.setValidators(qh(r, t.validator))
    : typeof r == 'function' && e.setValidators([r])
  let n = NE(e)
  t.asyncValidator !== null
    ? e.setAsyncValidators(qh(n, t.asyncValidator))
    : typeof n == 'function' && e.setAsyncValidators([n])
  let i = () => e.updateValueAndValidity()
  Yh(t._rawValidators, i), Yh(t._rawAsyncValidators, i)
}
function $E(e, t) {
  t.valueAccessor.registerOnChange((r) => {
    ;(e._pendingValue = r),
      (e._pendingChange = !0),
      (e._pendingDirty = !0),
      e.updateOn === 'change' && cp(e, t)
  })
}
function BE(e, t) {
  t.valueAccessor.registerOnTouched(() => {
    ;(e._pendingTouched = !0),
      e.updateOn === 'blur' && e._pendingChange && cp(e, t),
      e.updateOn !== 'submit' && e.markAsTouched()
  })
}
function cp(e, t) {
  e._pendingDirty && e.markAsDirty(),
    e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
    t.viewToModelUpdate(e._pendingValue),
    (e._pendingChange = !1)
}
function HE(e, t) {
  let r = (n, i) => {
    t.valueAccessor.writeValue(n), i && t.viewToModelUpdate(n)
  }
  e.registerOnChange(r),
    t._registerOnDestroy(() => {
      e._unregisterOnChange(r)
    })
}
function zE(e, t) {
  if (!e.hasOwnProperty('model')) return !1
  let r = e.model
  return r.isFirstChange() ? !0 : !Object.is(t, r.currentValue)
}
function GE(e) {
  return Object.getPrototypeOf(e.constructor) === ep
}
function qE(e, t) {
  if (!t) return null
  Array.isArray(t)
  let r, n, i
  return (
    t.forEach((o) => {
      o.constructor === Gn ? (r = o) : GE(o) ? (n = o) : (i = o)
    }),
    i || n || r || null
  )
}
function Qh(e, t) {
  let r = e.indexOf(t)
  r > -1 && e.splice(r, 1)
}
function Kh(e) {
  return (
    typeof e == 'object' &&
    e !== null &&
    Object.keys(e).length === 2 &&
    'value' in e &&
    'disabled' in e
  )
}
var WE = class extends cc {
  constructor(t = null, r, n) {
    super(OE(r), PE(n, r)),
      (this.defaultValue = null),
      (this._onChange = []),
      (this._pendingChange = !1),
      this._applyFormState(t),
      this._setUpdateStrategy(r),
      this._initObservables(),
      this.updateValueAndValidity({
        onlySelf: !0,
        emitEvent: !!this.asyncValidator,
      }),
      Wo(r) &&
        (r.nonNullable || r.initialValueIsDefault) &&
        (Kh(t) ? (this.defaultValue = t.value) : (this.defaultValue = t))
  }
  setValue(t, r = {}) {
    ;(this.value = this._pendingValue = t),
      this._onChange.length &&
        r.emitModelToViewChange !== !1 &&
        this._onChange.forEach((n) =>
          n(this.value, r.emitViewToModelChange !== !1),
        ),
      this.updateValueAndValidity(r)
  }
  patchValue(t, r = {}) {
    this.setValue(t, r)
  }
  reset(t = this.defaultValue, r = {}) {
    this._applyFormState(t),
      this.markAsPristine(r),
      this.markAsUntouched(r),
      this.setValue(this.value, r),
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
    Qh(this._onChange, t)
  }
  registerOnDisabledChange(t) {
    this._onDisabledChange.push(t)
  }
  _unregisterOnDisabledChange(t) {
    Qh(this._onDisabledChange, t)
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
    Kh(t)
      ? ((this.value = this._pendingValue = t.value),
        t.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = t)
  }
}
var ZE = { provide: zr, useExisting: wn(() => Gr) },
  Jh = Promise.resolve(),
  Gr = (() => {
    let t = class t extends zr {
      constructor(n, i, o, s, a, u) {
        super(),
          (this._changeDetectorRef = a),
          (this.callSetDisabledState = u),
          (this.control = new WE()),
          (this._registered = !1),
          (this.name = ''),
          (this.update = new ue()),
          (this._parent = n),
          this._setValidators(i),
          this._setAsyncValidators(o),
          (this.valueAccessor = qE(this, s))
      }
      ngOnChanges(n) {
        if ((this._checkForErrors(), !this._registered || 'name' in n)) {
          if (this._registered && (this._checkName(), this.formDirective)) {
            let i = n.name.previousValue
            this.formDirective.removeControl({
              name: i,
              path: this._getPath(i),
            })
          }
          this._setUpControl()
        }
        'isDisabled' in n && this._updateDisabled(n),
          zE(n, this.viewModel) &&
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
      viewToModelUpdate(n) {
        ;(this.viewModel = n), this.update.emit(n)
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
        VE(this.control, this, this.callSetDisabledState),
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
      _updateValue(n) {
        Jh.then(() => {
          this.control.setValue(n, { emitViewToModelChange: !1 }),
            this._changeDetectorRef?.markForCheck()
        })
      }
      _updateDisabled(n) {
        let i = n.isDisabled.currentValue,
          o = i !== 0 && po(i)
        Jh.then(() => {
          o && !this.control.disabled
            ? this.control.disable()
            : !o && this.control.disabled && this.control.enable(),
            this._changeDetectorRef?.markForCheck()
        })
      }
      _getPath(n) {
        return this._parent ? LE(n, this._parent) : [n]
      }
    }
    ;(t.ɵfac = function (i) {
      return new (i || t)(
        J(ac, 9),
        J(ME, 10),
        J(_E, 10),
        J(lc, 10),
        J($t, 8),
        J(up, 8),
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
        features: [pt([ZE]), Vt, In],
      }))
    let e = t
    return e
  })()
var YE = { provide: lc, useExisting: wn(() => qr), multi: !0 },
  qr = (() => {
    let t = class t extends ep {
      writeValue(n) {
        let i = n ?? ''
        this.setProperty('value', i)
      }
      registerOnChange(n) {
        this.onChange = (i) => {
          n(i == '' ? null : parseFloat(i))
        }
      }
    }
    ;(t.ɵfac = (() => {
      let n
      return function (o) {
        return (n || (n = bn(t)))(o || t)
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
        features: [pt([YE]), Vt],
      }))
    let e = t
    return e
  })()
var QE = (() => {
  let t = class t {}
  ;(t.ɵfac = function (i) {
    return new (i || t)()
  }),
    (t.ɵmod = Ft({ type: t })),
    (t.ɵinj = Ot({}))
  let e = t
  return e
})()
var Zo = (() => {
  let t = class t {
    static withConfig(n) {
      return {
        ngModule: t,
        providers: [{ provide: up, useValue: n.callSetDisabledState ?? dc }],
      }
    }
  }
  ;(t.ɵfac = function (i) {
    return new (i || t)()
  }),
    (t.ɵmod = Ft({ type: t })),
    (t.ɵinj = Ot({ imports: [QE] }))
  let e = t
  return e
})()
var fc = (() => {
  let t = class t {
    constructor() {
      ;(this._state = co({ count: 0 })),
        (this.count = Rn(() => this._state().count))
    }
    increment(n = 1) {
      this._state.update((i) => R(g({}, i), { count: i.count + n }))
    }
    decrement(n = 1) {
      this._state.update((i) => R(g({}, i), { count: i.count - n }))
    }
  }
  ;(t.ɵfac = function (i) {
    return new (i || t)()
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac }))
  let e = t
  return e
})()
var dp = (() => {
  let t = class t {
    constructor() {
      ;(this.counterService = p(fc)),
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
      features: [pt([fc]), gt],
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
          z(1, 'Decrement -1'),
          j(),
          U(2, 'button', 0),
          oe('click', function () {
            return o.increment()
          }),
          z(3, 'Increment +1'),
          j(),
          U(4, 'input', 1),
          vr('ngModelChange', function (a) {
            return lo(o.input, a) || (o.input = a), a
          }),
          j(),
          U(5, 'button', 0),
          oe('click', function () {
            return o.decrementBy()
          }),
          z(6),
          j(),
          U(7, 'button', 0),
          oe('click', function () {
            return o.incrementBy()
          }),
          z(8),
          j(),
          U(9, 'blockquote'),
          z(10),
          j()),
          i & 2 &&
            (ie(4),
            mr('ngModel', o.input),
            ie(2),
            tt(
              ' Decrement by ',
              o.input,
              `
`,
            ),
            ie(2),
            tt(
              ' Increment by ',
              o.input,
              `
`,
            ),
            ie(2),
            tt('Counter: ', o.count(), ''))
      },
      dependencies: [Zo, Gn, qr, qo, Gr],
      encapsulation: 2,
    }))
  let e = t
  return e
})()
var hc = (() => {
  let t = class t {
    constructor() {
      ;(this.http = p(fu)),
        (this.baseUrl = 'https://jsonplaceholder.typicode.com/posts'),
        (this._state = co({ data: [], loading: !1, error: null })),
        (this.posts = Rn(() => this._state().data)),
        (this.loading = Rn(() => this._state().loading)),
        (this.error = Rn(() => this._state().error))
    }
    getAll() {
      return this.requestWrapper(this.http.get(this.baseUrl))
    }
    getPost(n) {
      return this.requestWrapper(this.http.get(`${this.baseUrl}/${n}`))
    }
    createPost(n) {
      return this.requestWrapper(this.http.post(this.baseUrl, { title: n }))
    }
    updatePost(n, i) {
      return this.requestWrapper(
        this.http.put(`${this.baseUrl}/${n}`, { title: i }),
      )
    }
    deletePost(n) {
      return this.requestWrapper(
        this.http
          .delete(`${this.baseUrl}/${n}`)
          .pipe(M(() => ({ id: n, title: 'Post deleted' }))),
      )
    }
    requestWrapper(n) {
      return (
        this.setLoading(),
        n.pipe(
          G((i) => {
            if (Array.isArray(i)) {
              this.setData(i)
              return
            }
            this.setData([i])
          }),
          Ae((i) => {
            throw (this.setError(i), i)
          }),
        )
      )
    }
    setData(n) {
      this._state.update((i) =>
        R(g({}, i), { data: n, loading: !1, error: null }),
      )
    }
    setLoading(n = !0) {
      this._state.update((i) => R(g({}, i), { loading: n }))
    }
    setError(n) {
      this._state.update((i) =>
        R(g({}, i), { data: [], loading: !1, error: n.message }),
      )
    }
  }
  ;(t.ɵfac = function (i) {
    return new (i || t)()
  }),
    (t.ɵprov = D({ token: t, factory: t.ɵfac }))
  let e = t
  return e
})()
var KE = (e, t) => t.id
function JE(e, t) {
  e & 1 && (U(0, 'blockquote'), z(1, 'Loading...'), j())
}
function XE(e, t) {
  if (
    (e & 1 && (U(0, 'blockquote')(1, 'strong'), z(2, 'Error:'), j(), z(3), j()),
    e & 2)
  ) {
    let r = iu()
    ie(3), tt(' ', r.error(), '')
  }
}
function eI(e, t) {
  if (
    (e & 1 && (U(0, 'blockquote')(1, 'strong'), z(2), j(), z(3), j()), e & 2)
  ) {
    let r = t.$implicit
    ie(2), tt('', r.id, ':'), ie(), tt(' ', r.title, ' ')
  }
}
function tI(e, t) {
  e & 1 && (U(0, 'blockquote'), z(1, 'No posts found!'), j())
}
function nI(e, t) {
  if (
    (e & 1 &&
      (U(0, 'div', 2),
      Sf(1, eI, 4, 2, 'blockquote', null, KE, !1, tI, 2, 0, 'blockquote'),
      j()),
    e & 2)
  ) {
    let r = iu()
    ie(), Tf(r.posts())
  }
}
var fp = (() => {
  let t = class t {
    constructor() {
      ;(this.postsService = p(hc)),
        (this.input = 0),
        (this.posts = this.postsService.posts),
        (this.loading = this.postsService.loading),
        (this.error = this.postsService.error)
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
      features: [pt([hc]), gt],
      decls: 14,
      vars: 7,
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
          z(1, 'get all posts'),
          j(),
          U(2, 'button', 0),
          oe('click', function () {
            return o.createPost()
          }),
          z(3, 'create new post'),
          j(),
          U(4, 'input', 1),
          vr('ngModelChange', function (a) {
            return lo(o.input, a) || (o.input = a), a
          }),
          j(),
          U(5, 'button', 0),
          oe('click', function () {
            return o.getPost()
          }),
          z(6, 'get post by id'),
          j(),
          U(7, 'button', 0),
          oe('click', function () {
            return o.updatePost()
          }),
          z(8, 'update post by id'),
          j(),
          U(9, 'button', 0),
          oe('click', function () {
            return o.deletePost()
          }),
          z(10, 'delete post by id'),
          j(),
          dr(11, JE, 2, 0, 'blockquote')(12, XE, 4, 1)(13, nI, 4, 1)),
          i & 2 &&
            (jt('disabled', o.loading()),
            ie(2),
            jt('disabled', o.loading()),
            ie(2),
            mr('ngModel', o.input),
            ie(),
            jt('disabled', o.loading()),
            ie(2),
            jt('disabled', o.loading()),
            ie(2),
            jt('disabled', o.loading()),
            ie(2),
            _f(11, o.loading() ? 11 : o.error() ? 12 : 13))
      },
      dependencies: [Zo, Gn, qr, qo, Gr],
      encapsulation: 2,
    }))
  let e = t
  return e
})()
var hp = (() => {
  let t = class t {}
  ;(t.ɵfac = function (i) {
    return new (i || t)()
  }),
    (t.ɵcmp = dt({
      type: t,
      selectors: [['app-root']],
      standalone: !0,
      features: [gt],
      decls: 10,
      vars: 0,
      template: function (i, o) {
        i & 1 &&
          (U(0, 'h1'),
          z(1, 'Signals Store Services'),
          j(),
          U(2, 'h2'),
          z(3, 'Simple Store'),
          j(),
          xn(4, 'hr')(5, 'app-counter'),
          U(6, 'h2'),
          z(7, 'Fetching Store'),
          j(),
          xn(8, 'hr')(9, 'app-posts'))
      },
      dependencies: [dp, fp],
      encapsulation: 2,
    }))
  let e = t
  return e
})()
ah(hp, Gh).catch((e) => console.error(e))
