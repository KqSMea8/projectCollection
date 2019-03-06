import { uniq } from 'lodash';

/**
 * id
 * $$ancestors
 * $$children
 */

/**
 * source
 */


class RightModel {
  constructor(option) {
    this.option = option;
    this.database = {
      '#': {
        id: '#',
        $$ancestors: [],
        $$children: [],
      },
    };
    if (option.source) {
      this.addChildren(option.source, '#');
    }
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
}

export default RightModel;
