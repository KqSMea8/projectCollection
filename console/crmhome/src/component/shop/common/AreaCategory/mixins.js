import { getArea, getAreaWithAll } from './getArea';
import { getCategory, getCategoryWithAll } from './getCategory';
import { addDisabled } from '../treeUtils';

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
    if (area) {
      this.onAreaChange(area, true);
    } else {
      area = [];
      this.props.form.setFieldsInitialValue({
        area,
      });
    }
    if (this.props.allArea) {
      areadData = getAreaWithAll();
    } else {
      areadData = getArea();
    }
    areadData.then((d) => {
      if (this.props.disabled) {
        d.areas = addDisabled(d.areas, area[0], area[1]);
      }
      this.data = d;
      this.setState({
        areas: d.areas,
      });
    });
  },

  onAreaChange(area, initFlag) {
    if (area && area.length > 0) {
      const cityId = area[area.length - 1];
      const promise = this.props.allCategory ? getCategoryWithAll(cityId) : getCategory(cityId);
      promise.then((response) => {
        const categories = response.categories;
        if (!initFlag &&
          ( categories !== this.state.categories || !this.props.form.getFieldValue('categoryId') ) ) {
          this.props.form.setFieldsValue({
            categoryId: [],
          });
        }
        this.setState({
          categories,
        });
      });
    } else {
      this.setState({categories: null});
    }
  },
};
