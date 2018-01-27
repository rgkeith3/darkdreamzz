import throttle from 'lodash.throttle';
import Synth from './Synth';
import ThreeDee from './ThreeDee';

class App {
  constructor() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    document.addEventListener('resize', this.handleResize.bind(this));
    document.addEventListener('mousedown', this.handleMouseDown.bind(this));
    
    //synth
    this.synth = new Synth(this);
    this.plink = throttle(this.synth.plink, 1237)

    //threeApp
    this.three = new ThreeDee(this);

    this.three.render();
  }

  handleResize() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;

    this.three.resize();
  }

  handleMouseDown() {
    this.three.handleMouseDown();
  }
}

export default App;
