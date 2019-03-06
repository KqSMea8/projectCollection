import { getAreaCategory, getAreaCategoryWithAll } from './getAreaCategory';
import { getAreaCategory as getAreaCategoryMall, getAreaCategoryWithAll as getAreaCategoryWithAllMall} from './getAreaCategoryMall';
import { getAreaCategory as getAreaCategoryNoMall, getAreaCategoryWithAll as getAreaCategoryWithAllNoMall} from './getAreaCategoryNoMall';
import { addAll, addDisabled } from '../treeUtils.js';

function findPathInTree(children, v, path = []) {
  for (let i = 0; children && i < children.length; i++) {
    const child = children[i];
    if (child.i === v) {
      path.push(child);
      return path;
    }
    if (findPathInTree(child.c, v, path)) {
      path.push(child);
      return path;
    }
  }
  return false;
}

export default {
  getInitialState() {
    return {
      areas: null,
      categories: null,
    };
  },
  componentWillMount() {
    let area = this.props.form.getFieldValue('area');
    let areadData;
    const { disabled, areaDisabled } = this.props;
    const _this = this;
    if (!area) {
      area = [];
      this.props.form.setFieldsInitialValue({
        area,
      });
    }
    if (this.props.shopType === 'MALL') {
      if (this.props.allArea) {
        areadData = getAreaCategoryWithAllMall('pc', 'mall');
      } else {
        areadData = getAreaCategoryMall('pc', 'mall');
      }
    } else if (this.props.shopType === 'COMMON') {
      if (this.props.allArea) {
        areadData = getAreaCategoryWithAllNoMall();
      } else {
        areadData = getAreaCategoryNoMall();
      }
    } else {
      if (this.props.allArea) {
        areadData = getAreaCategoryWithAll();
      } else {
        areadData = getAreaCategory();
      }
    }
    areadData.then((d) => {
      if (disabled || areaDisabled) {
        d.areas = addDisabled(d.areas, area[0], area[1]);
      }
      _this.data = d;
      _this.setState({
        areas: d.areas,
      });
      if (area && area.length) {
        const categories = _this.getCategoryByArea(area[area.length - 1]);
        _this.setState({
          categories,
        });
      }
    });
  },
  getCategoryByArea(v) {
    const {areaOrder, categoryOrder, areas} = this.data;
    const path = findPathInTree(areas, v, []) || [];
    for (let i = 0; i < path.length; i++) {
      const index = areaOrder[path[i].i];
      if (index !== undefined) {
        return categoryOrder[index] !== undefined ? categoryOrder[index] : null;
      }
    }
    return null;
  },
  onAreaChange(v) {
    let categories;
    if (v) {
      categories = this.getCategoryByArea(v[v.length - 1]);
    } else {
      categories = null;
    }
    if (categories !== this.state.categories || !this.props.form.getFieldValue('categoryId')) {
      this.props.form.setFieldsValue({
        categoryId: [],
      });
    }
    if (this.props.allCategory) {
      categories = addAll(categories);
    }
    this.setState({
      categories,
    });
  },
};
