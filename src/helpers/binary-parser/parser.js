export class A {
  constructor(e) {
    this.mSubscribe = "subscribe";
    this.mUnSubscribe = "unsubscribe";
    this.mSetMode = "mode";
    this.mGetQuote = "quote";
    this.mAlert = 10;
    this.mOrderStr = "order";
    this.mMessage = 11;
    this.mMessageStr = "message";
    this.mLogout = 12;
    this.mLogoutStr = "logout";
    this.mReload = 13;
    this.mReloadStr = "reload";
    this.mClearCache = 14;
    this.mClearCacheStr = "clear_cache";
    this.modeLTP = "ltp";
    this.modeLTPC = "ltpc";
    this.modeFull = "full";
    this.modeQuote = "quote";
    this.modeWeights = {
      [this.modeFull]: 1,
      [this.modeQuote]: 2,
      [this.modeLTPC]: 3,
      [this.modeLTP]: 4,
    };
    this.weightModeMap = {
      1: this.modeFull,
      2: this.modeQuote,
      3: this.modeLTPC,
      4: this.modeLTP,
    };
    this.segmentNseCM = 1;
    this.segmentNseFO = 2;
    this.segmentNseCD = 3;
    this.segmentBseCM = 4;
    this.segmentBseFO = 5;
    this.segmentBseCD = 6;
    this.segmentMcxFO = 7;
    this.segmentMcxSX = 8;
    this.segmentNseIndices = 9;
    this.segmentUS = 11;
    this.noReplyTimeout = 5;
    this.lazyDisconnectTimeout = 10;
    this.reconnectInterval = 5;
    this.reconnectTries = 300;
    this.isAutoReconnect = !0;
    this.reconnectionsCount = 0;
    this.currentWsUrl = null;
    this.tokenTags = {};
    this.subscribedTokens = [];
    this.defaultTokenTag = "_";
    this.version = "1.0.0";
    this.userAgent = "kite3-web";
    this.quoteMap = {};
    this.getQuoteTimeout = 5;
    this.isLazy = !1;
    this.isLazyInitialConnect = !1;
    this.lazyPayload = [];
  }
  setParams(e) {
    this.address = e.address;
    this.apiKey = e.apiKey;
    this.encToken = e.encToken;
    this.userId = e.userId;
    this.debug = e.debug;
    if (e.version) this.version = e.version;
    if (e.lazyDisconnectTimeout)
      this.lazyDisconnectTimeout = e.lazyDisconnectTimeout;
  }
  calculateChange(e) {
    let t = 0,
      s = 0,
      i = 0,
      n = 0;
    return (
      e.closePrice &&
        ((s = e.lastPrice - e.closePrice), (t = (100 * s) / e.closePrice)),
      e.openPrice &&
        ((i = e.lastPrice - e.openPrice), (n = (100 * i) / e.openPrice)),
      {
        change: t,
        absoluteChange: s,
        openChange: i,
        openChangePercent: n,
      }
    );
  }
  parseBinary(e) {
    let t = this.splitPackets(e),
      s = [];
    for (let i of t) {
      let e,
        t = this.buf2long(i.slice(0, 4)),
        n = 255 & t,
        r = 100;
      switch (
        (n === this.segmentNseCD && (r = 1e7),
        n === this.segmentBseCD && (r = 1e4),
        n)
      ) {
        case this.segmentMcxFO:
        case this.segmentNseCM:
        case this.segmentBseCM:
        case this.segmentNseFO:
        case this.segmentNseCD:
        case this.segmentBseCD:
        case this.segmentNseIndices:
        case this.segmentUS:
          if (8 === i.byteLength)
            s.push({
              mode: this.modeLTP,
              isTradeable: !0,
              token: t,
              lastPrice: this.buf2long(i.slice(4, 8)) / r,
            });
          else if (12 === i.byteLength) {
            e = {
              mode: this.modeLTPC,
              isTradeable: !0,
              token: t,
              lastPrice: this.buf2long(i.slice(4, 8)) / r,
              closePrice: this.buf2long(i.slice(8, 12)) / r,
            };
            e = Object.assign(e, this.calculateChange(e));
            s.push(e);
          } else if (28 === i.byteLength || 32 === i.byteLength) {
            e = {
              mode: this.modeFull,
              isTradeable: !1,
              token: t,
              lastPrice: this.buf2long(i.slice(4, 8)) / r,
              highPrice: this.buf2long(i.slice(8, 12)) / r,
              lowPrice: this.buf2long(i.slice(12, 16)) / r,
              openPrice: this.buf2long(i.slice(16, 20)) / r,
              closePrice: this.buf2long(i.slice(20, 24)) / r,
            };
            e = Object.assign(e, this.calculateChange(e));
            s.push(e);
          } else if (492 === i.byteLength) {
            let e = {
                mode: this.modeFull,
                token: t,
                extendedDepth: { buy: [], sell: [] },
              },
              n = 0,
              o = i.slice(12, 492);
            for (let t = 0; t < 40; t++) {
              n = 12 * t;
              e.extendedDepth[t < 20 ? "buy" : "sell"].push({
                quantity: this.buf2long(o.slice(n, n + 4)),
                price: this.buf2long(o.slice(n + 4, n + 8)) / r,
                orders: this.buf2long(o.slice(n + 8, n + 12)),
              });
              s.push(e);
            }
          } else {
            if (
              ((e = {
                mode: this.modeQuote,
                token: t,
                isTradeable: !0,
                volume: this.buf2long(i.slice(16, 20)),
                lastQuantity: this.buf2long(i.slice(8, 12)),
                totalBuyQuantity: this.buf2long(i.slice(20, 24)),
                totalSellQuantity: this.buf2long(i.slice(24, 28)),
                lastPrice: this.buf2long(i.slice(4, 8)) / r,
                averagePrice: this.buf2long(i.slice(12, 16)) / r,
                openPrice: this.buf2long(i.slice(28, 32)) / r,
                highPrice: this.buf2long(i.slice(32, 36)) / r,
                lowPrice: this.buf2long(i.slice(36, 40)) / r,
                closePrice: this.buf2long(i.slice(40, 44)) / r,
              }),
              (e = Object.assign(e, this.calculateChange(e))),
              164 === i.byteLength || 184 === i.byteLength)
            ) {
              let t = 44;
              184 === i.byteLength && (t = 64);
              let s = t + 120;
              if (
                ((e.mode = this.modeFull),
                (e.depth = { buy: [], sell: [] }),
                184 === i.byteLength)
              ) {
                let t = this.buf2long(i.slice(44, 48));
                e.lastTradedTime =
                  t && t > 0 ? this.dateToString(new Date(1e3 * t)) : null;
                e.oi = this.buf2long(i.slice(48, 52));
                e.oiDayHigh = this.buf2long(i.slice(52, 56));
                e.oiDayLow = this.buf2long(i.slice(56, 60));
              }
              let n = 0,
                o = i.slice(t, s);
              for (let i = 0; i < 10; i++) {
                n = 12 * i;
                e.depth[i < 5 ? "buy" : "sell"].push({
                  price: this.buf2long(o.slice(n + 4, n + 8)) / r,
                  orders: this.buf2long(o.slice(n + 8, n + 10)),
                  quantity: this.buf2long(o.slice(n, n + 4)),
                });
              }
            }
            s.push(e);
          }
      }
    }
    return s;
  }
  splitPackets(e) {
    let t = this.buf2long(e.slice(0, 2)),
      s = 2,
      i = [];
    for (let o = 0; o < t; o++) {
      var n = this.buf2long(e.slice(s, s + 2)),
        r = e.slice(s + 2, s + 2 + n);
      i.push(r);
      s += 2 + n;
    }
    return i;
  }
  processMessage(e) {
    try {
      var t = JSON.parse(e);
    } catch (n) {
      return;
    }
    if (!t.hasOwnProperty("t") && !t.hasOwnProperty("type")) return;
    let s = t.t || t.type,
      i = t.p || t.data;
    switch (s) {
      case this.mAlert:
      case this.mOrderStr:
        this.eventAlert.trigger(t);
        break;
      case this.mMessage:
      case this.mMessageStr:
        this.eventMessage.trigger(i);
        break;
      case this.mLogout:
      case this.mLogoutStr:
        this.eventLogout.trigger();
        break;
      case this.mReload:
      case this.mReloadStr:
        this.eventReload.trigger();
        break;
      case this.mClearCache:
      case this.mClearCacheStr:
        if (i)
          try {
            let e = JSON.parse(i);
            this.eventClearCache.trigger(e);
          } catch (n) {}
        else this.eventClearCache.trigger();
        break;
      case this.mGetQuote:
        this.processQuoteMessage(t.id, i);
        break;
    }
  }
  processQuoteMessage(e, t) {
    let s = this.quoteMap[e];
    if (s) {
      s.resolve(t);
      delete this.quoteMap[e];
    }
  }
  buf2long(e) {
    let t = new Uint8Array(e),
      s = 0,
      i = t.length;
    for (let n = 0, r = i - 1; n < i; n++, r--) s += t[r] << (8 * n);
    return s;
  }
}
