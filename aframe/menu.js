/* global AFRAME */
AFRAME.registerComponent('menu', {
  schema: {
    width: {default: 0.6},
    height: {default: 0.40},
    depth: {default: 0.01}
  },
  init: function () {
    var el = this.el;
    var menuBackGroundEl = document.createElement('a-entity');
    menuBackGroundEl.setAttribute('geometry', {
      primitive: 'box',
      width: this.data.width,
      height: this.data.height,
      depth: this.data.depth
    });
    menuBackGroundEl.setAttribute('material', {
      color: 'gray'
    });
    menuBackGroundEl.setAttribute('position', '0 0 -0.025');
    el.appendChild(menuBackGroundEl);
  }
});
