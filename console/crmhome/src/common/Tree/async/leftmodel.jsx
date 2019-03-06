import { forIn, uniq, cloneDeep, uniqueId } from 'lodash';

const TRUE = 1;

class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
    this.status = 'pending';
  }

  resolve(value) {
    this._resolve.call(this.promise, value);
    this.status = 'resolve';
  }

  reject(reason) {
    this._reject.call(this.promise, reason);
    this.status = 'reject';
  }
}

class LeftModel {
  constructor(option) {
    const { source } = option;
    this.option = option;
    this.database = {
      '#': {
        id: '#',
        $$ancestors: [],
        $$children: [],
      },
    };
    if (source) {
      this.addChildren(source, '#');
    }
    this.cache = {};
    this.handler = {};
  }

  needFetch(id, fetchAll) {
    if (id === '#') return true;
    const loop = (nid, bl) => {
      const { count, $$children } = this.get(nid);
      let rtn = false;
      if (bl) {
        const _rtn = $$children.every((cid) => {
          return loop(cid, bl);
        });
        rtn = count !== $$children.length || (_rtn && $$children.length > 0);
      } else {
        rtn = count !== $$children.length;
      }
      return rtn;
    };
    return loop(id, fetchAll);
  }

  totalLeafCount() {
    let leafCount = 0;
    this.cids('#').forEach((cid) => {
      const cnode = this.get(cid);
      const add = cnode.leafCount || cnode.count || 1;
      leafCount += add;
    });
    return leafCount;
  }

  allFetched(id) {
    let rtn = true;
    const node = this.get(id);
    if (node && node.count) {
      rtn = this.cids(id).every((cid) => {
        return this.needFetch(cid, true);
      });
    }
    return rtn;
  }

  fetch(id, fetchAll, guid) {
    let rtn;
    const { cache, handler } = this;
    let pool = {};
    const GUID = uniqueId('FETCH_GUID_');
    const { fetch } = this.option;
    if (guid) {
      pool = cache[guid];
    } else {
      rtn = new Deferred();
      cache[GUID] = pool;
    }
    const loop = (nid) => {
      const { $$children } = this.get(nid);
      if ($$children.length > 0) {
        $$children.forEach((cid) => {
          this.fetch(cid, fetchAll, guid || GUID);
        });
      }
    };
    if (this.needFetch(id)) {
      const promise = fetch(id, this.level(id));
      if (promise instanceof Promise) {
        const dfd = new Deferred();
        pool[id] = dfd;
        promise.then((data) => {
          this.addChildren(data, id);
          if (fetchAll) {
            loop(id);
          }
          dfd.resolve(data);
        }, () => {
          dfd.reject();
        });
      }
    } else {
      if (fetchAll) {
        loop(id);
      }
    }
    if (!guid) {
      handler[GUID] = setInterval(() => {
        const states = [];
        forIn(pool, (value) => {
          states.push(value.status);
        });
        const isAllFinished = states.every((item) => {
          return item !== 'pending';
        });
        if (isAllFinished) {
          clearInterval(handler[GUID]);
          rtn.resolve(pool);
        }
      }, 50);
    }
    return rtn ? rtn.promise : rtn;
  }

  addChildren(nodes, pid) {
    const parent = this.get(pid);
    const { $$ancestors: paids, $$children: pcids } = parent;
    const nids = nodes.map((item) => {
      return item.id;
    });
    parent.$$children = uniq(pcids.concat(nids));
    const $$ancestors = [pid, ...paids];
    nodes.forEach((node) => {
      const { id } = node;
      const data = { ...this.get(id), ...node };
      const { children, $$children, count, ...rest } = data;
      this.database[id] = {
        ...rest,
        count: count || 0,
        $$ancestors,
        $$children: $$children || [],
      };
      if (children) {
        this.addChildren(children, id);
      }
    });
  }

  toJSON() {
    const getNode = (id) => {
      const data = cloneDeep(this.get(id));
      const { $$children } = data;
      delete data.$$ancestors;
      if ($$children && $$children.length > 0) {
        data.children = [];
        $$children.forEach((cid) => {
          data.children.push(getNode(cid));
        });
      }
      delete data.$$children;
      return data;
    };
    return getNode('#').children || [];
  }

  get(id) {
    return this.database[id];
  }

  isLeaf(id) {
    let rtn = false;
    if (id !== '#') {
      rtn = this.get(id).count === 0;
    }
    return rtn;
  }

  level(id) {
    return this.get(id).$$ancestors.length;
  }

  cids(id) {
    return this.get(id).$$children;
  }

  lids(id) {
    const lids = [];
    const loop = (node) => {
      const { $$children, count, id: nid } = node;
      if (count === 0 && nid !== '#') {
        lids.push(nid);
      }
      $$children.forEach((cid) => {
        loop(this.get(cid));
      });
    };
    loop(this.get(id));
    return lids;
  }

  dlids(id) {
    const lids = this.lids(id);
    return lids.filter(lid => this.get(lid).disabled === TRUE);
  }
}

export default LeftModel;
