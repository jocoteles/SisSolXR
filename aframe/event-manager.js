/* global AFRAME */
AFRAME.registerComponent('event-manager', {

  init: function () {
    this.bindMethods();
        
    this.button1El = document.querySelector('#button1');
    this.button2El = document.querySelector('#button2');
    this.button3El = document.querySelector('#button3');
    this.button4El = document.querySelector('#button4');
    this.solButtonEl = document.querySelector('#solButton');
    this.merButtonEl = document.querySelector('#merButton');
    this.venButtonEl = document.querySelector('#venButton');
    this.terButtonEl = document.querySelector('#terButton');
    this.marButtonEl = document.querySelector('#marButton');
    this.jupButtonEl = document.querySelector('#jupButton');
    this.satButtonEl = document.querySelector('#satButton');
    this.uraButtonEl = document.querySelector('#uraButton');    
    this.netButtonEl = document.querySelector('#netButton');
    this.todosButtonEl = document.querySelector('#todosButton');    
    this.startButtonEl = document.querySelector('#startButton');    
    this.menuEl = document.querySelector('#menu');    

    this.button1El.addEventListener('click', this.onClick);
    this.button2El.addEventListener('click', this.onClick);
    this.button3El.addEventListener('click', this.onClick);
    this.button4El.addEventListener('click', this.onClick);
    this.solButtonEl.addEventListener('click', this.onClick);
    this.merButtonEl.addEventListener('click', this.onClick);
    this.venButtonEl.addEventListener('click', this.onClick);
    this.terButtonEl.addEventListener('click', this.onClick);
    this.marButtonEl.addEventListener('click', this.onClick);
    this.jupButtonEl.addEventListener('click', this.onClick);
    this.satButtonEl.addEventListener('click', this.onClick);
    this.uraButtonEl.addEventListener('click', this.onClick);
    this.netButtonEl.addEventListener('click', this.onClick);
    this.todosButtonEl.addEventListener('click', this.onClick);    
    this.startButtonEl.addEventListener('click', this.onClick);    
      
    //this.solButtonEl.addState('pressed');

    this.planet = '';
    
    socket.on('stagePressed', (msg) => {                
      let p = msg.planet;
      let a = msg.stage;

      if (a == 'a4') {
        const Dpla = escalas.a3.diametroPlanetario.max/diametroPlanetario.net**escalas.a3.diametroPlanetario.potencia;          
        d = Dpla*diametroPlanetario['sol']**escalas.a3.diametroPlanetario.potencia;
        document.querySelector(`#solGeometry4`).setAttribute("animation__1", {property: "scale", to: `${d} ${d} ${d}`, dur: 10000, easing: 'easeInOutQuad'});
        document.querySelector(`#solGeometry2`).setAttribute("animation__1", {property: "position", to: `0 ${escalas[a].altura} 0`, dur: 3000, easing: 'easeInOutQuad'});      
      }
      else {
        const Dpla = escalas[a].diametroPlanetario.max/diametroPlanetario.net**escalas[a].diametroPlanetario.potencia;          
        const Rorb = escalas[a].raioOrbital.max/raioOrbital.net**escalas[a].raioOrbital.potencia;
        const Ttra = 1000*escalas[a].periodoOrbital.max/periodoOrbital.net**escalas[a].periodoOrbital.potencia;          
        const Trot = 1000*escalas[a].periodoRotacao.max/periodoRotacao.net**escalas[a].periodoRotacao.potencia;

        if (p == 'sol') d = escalas[a].diametroSolar*Dpla*diametroPlanetario['jup']**escalas[a].diametroPlanetario.potencia;
        else d = Dpla*diametroPlanetario[p]**escalas[a].diametroPlanetario.potencia;
        
        document.querySelector(`#${p}Geometry4`).setAttribute("animation__1", {property: "scale", to: `${d} ${d} ${d}`, dur: 2000, easing: 'easeInOutQuad'});
        document.querySelector(`#${p}Geometry2`).setAttribute("animation__1", {property: "position", to: `0 ${escalas[a].altura} ${-Rorb*raioOrbital[p]**escalas[a].raioOrbital.potencia}`, dur: 2000, easing: 'easeInOutQuad'});      

        document.getElementById(`${p}Geometry1`).setAttribute("animation", `property: rotation; to: 0 360 0; loop: true; dur: ${Ttra*periodoOrbital[p]**escalas[a].periodoOrbital.potencia}; easing: linear; startEvents: resetAnimation${p}`);
        document.getElementById(`${p}Geometry2`).setAttribute("animation", `property: rotation; to: 0 -360 0; loop: true; dur: ${Ttra*periodoOrbital[p]**escalas[a].periodoOrbital.potencia}; easing: linear; startEvents: resetAnimation${p}`);
        document.getElementById(`${p}Geometry4`).setAttribute("animation", `property: rotation; to: 0 360 0; loop: true; dur: ${Trot*periodoRotacao[p]**escalas[a].periodoRotacao.potencia}; easing: linear; startEvents: resetAnimation${p}`);

        document.getElementById(`${p}Geometry1`).setAttribute("rotation", "0 0 0");
        document.getElementById(`${p}Geometry2`).setAttribute("rotation", "0 0 0");
        document.getElementById(`${p}Geometry4`).setAttribute("rotation", "0 0 0");
        document.getElementById(`${p}Geometry1`).emit(`resetAnimation${p}`);
        document.getElementById(`${p}Geometry2`).emit(`resetAnimation${p}`);
        document.getElementById(`${p}Geometry4`).emit(`resetAnimation${p}`);
      }
    });
    
    socket.on('resetPressed', (msg) => {      
      const planets = document.querySelectorAll(".planet");
        for (let pEl of planets) {          
          pEl.setAttribute("rotation", "0 0 0");
          pEl.emit(`resetAnimation${pEl.id.slice(0,3)}`, null, true);          
        }
    });
  },

  bindMethods: function () {
    this.onClick = this.onClick.bind(this);
  },

  onClick: function (evt) {

    var targetEl = evt.target;

    if (targetEl === this.startButtonEl) {
      /* let menuButtons = document.querySelector(".menu");
      for (let b of menuButtons) b.setAttribute("visible", "true"); */
      this.menuEl.setAttribute('position', "0 1.2 -0.525");
      this.startButtonEl.addState('pressed');
    }

    if (targetEl === this.button1El ||
        targetEl === this.button2El ||
        targetEl === this.button3El ||
        targetEl === this.button4El) {
      this.button1El.removeState('pressed');
      this.button2El.removeState('pressed');
      this.button3El.removeState('pressed');
      this.button4El.removeState('pressed');
      targetEl.addState('pressed');

      let s = `a${targetEl.id.slice(-1)}`;      
      socket.emit('stagePressed', {stage: s, planet: this.planet});   
    }

    if (targetEl === this.solButtonEl ||
        targetEl === this.merButtonEl ||
        targetEl === this.venButtonEl ||
        targetEl === this.terButtonEl ||
        targetEl === this.marButtonEl ||
        targetEl === this.jupButtonEl ||
        targetEl === this.satButtonEl ||
        targetEl === this.uraButtonEl ||
        targetEl === this.netButtonEl ||
        targetEl === this.todosButtonEl) {
      this.solButtonEl.removeState('pressed');
      this.merButtonEl.removeState('pressed');
      this.venButtonEl.removeState('pressed');
      this.terButtonEl.removeState('pressed');
      this.marButtonEl.removeState('pressed');
      this.jupButtonEl.removeState('pressed');
      this.satButtonEl.removeState('pressed');
      this.uraButtonEl.removeState('pressed');
      this.netButtonEl.removeState('pressed');
      this.todosButtonEl.removeState('pressed');
      targetEl.addState('pressed');
      this.planet = targetEl.id.slice(0, 3);
    }

    if (targetEl === this.todosButtonEl) {
      socket.emit('resetPressed', 'reset');
    }
  }
});
