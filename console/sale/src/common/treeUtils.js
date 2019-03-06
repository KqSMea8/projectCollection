export function loop(tree, fn, level) {
  if (tree) {
    return tree.map((t)=> {
      let t2 = {...t};
      t2 = fn(t2, level);
      if (t2.c && t2.c.length > 0) {
        t2.children = loop(t2.c, fn, level + 1);
      }
      return t2;
    });
  }
  return tree;
}

export function transformLCV(tree) {
  return loop(tree, (t) => {
    t.label = t.n;
    t.value = t.i;
    return t;
  });
}

export function addAll(tree) {
  return loop(tree, (t, l) => {
    t.label = t.n;
    t.value = t.i;
    if (l === 1 || l === 2) {
      if (t.c) {
        t.c.unshift({
          value: '',
          n: '全部',
          i: '',
          label: '全部',
        });
      }
    }
    return t;
  }, 1);
}

// 给三级节点（地区）加上'全部'节点
export function addAllDistrict(tree) {
  if (tree) {
    return tree.map((t) => {
      const t2 = {...t};
      t2.children = t2.children.map((t3) => {
        const t4 = {...t3};
        if (t4 && t4.children && t4.children.length > 0) {
          t4.children = t4.children.concat();
          t4.children.unshift({
            label: '全部',
            value: 'ALL',
          });
        }
        return t4;
      });
      return t2;
    });
  }
}

export function addDisabled(tree, current1, current2) {
  if (tree) {
    tree.forEach((t1) => {
      if (t1.value !== current1) {
        t1.disabled = true;
      }
      t1.children.forEach((t2) => {
        if (t2.value !== current2) {
          t2.disabled = true;
        }
      });
    });
  }
  return tree;
}
