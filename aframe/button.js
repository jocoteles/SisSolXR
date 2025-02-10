/* global AFRAME */
AFRAME.registerComponent('button', {
  schema: {
    label: {default: 'label'},
    width: {default: 0.11},
    height: {default: 0.05},
    depth: {default: 0.02},
    toggleable: {default: false},
    color: {default: '#3a50c5'}
  },
  init: function () {
    var el = this.el;
    var labelEl = this.labelEl = document.createElement('a-entity');
    
    el.setAttribute('geometry', {
      primitive: 'box',
      width: this.data.width,
      height: this.data.height,
      depth: this.data.depth
    });

    el.setAttribute('material', {color: this.data.color});
    el.setAttribute('pressable', '');

    labelEl.setAttribute('position', `0 0 ${this.data.depth/2}`);
    labelEl.setAttribute('text', {
      value: this.data.label,
      color: 'white',
      align: 'center'
    });

    labelEl.setAttribute('scale', '0.75 0.75 0.75');
    this.el.appendChild(labelEl);

    this.bindMethods();
    this.el.addEventListener('stateadded', this.stateChanged);
    this.el.addEventListener('stateremoved', this.stateChanged);
    this.el.addEventListener('pressedstarted', this.onPressedStarted);
    this.el.addEventListener('pressedended', this.onPressedEnded);
  },

  bindMethods: function () {
    this.stateChanged = this.stateChanged.bind(this);
    this.onPressedStarted = this.onPressedStarted.bind(this);
    this.onPressedEnded = this.onPressedEnded.bind(this);
  },

  update: function (oldData) {
    if (oldData.label !== this.data.label) {
      this.labelEl.setAttribute('text', 'value', this.data.label);
    }
  },

  stateChanged: function () {
    var color = this.el.is('pressed') ? '#000000' : this.data.color;
    this.el.setAttribute('material', {color: color});
  },

  onPressedStarted: function () {
    var el = this.el;
    el.setAttribute('material', {color: '#000000'});
    el.emit('click');
    if (this.data.toggleable) {
      if (el.is('pressed')) {
        el.removeState('pressed');
      } else {
        el.addState('pressed');
      }
    }
  },

  onPressedEnded: function () {
    if (this.el.is('pressed')) { return; }
    this.el.setAttribute('material', {color: this.data.color});
  }
});
