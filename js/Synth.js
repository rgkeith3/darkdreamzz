import Tone from 'tone';
import teoria from 'teoria';

class Synth {
  constructor(app) {
    this.app = app;
    this.scale = teoria.scale('A6', 'melodicminor').notes();
    this.bedScale = teoria.scale('A4', 'melodicminor').notes();
    this.reverb = new Tone.JCReverb(0.5).toMaster();
    this.delay = new Tone.FeedbackDelay('4n', 0.5);
    this.plinker = new Tone.Synth().chain(this.delay, this.reverb);
    this.plinker.volume.value = -25;
    this.bed = new Tone.PolySynth(4, Tone.AMSynth).toMaster();
    this.bed.volume.value = -20;
    this.plink = this.plink.bind(this);

    this.chords = ['M', 'm', 'aug', 'dim','7b5', '5', '7'];

    this.chord = teoria.chord('Am7').notes()
    this.playBed = this.playBed.bind(this)
    setInterval(this.playBed, 10000)
  }

  plink() {
    let note = this.scale[Math.floor(Math.random() * this.scale.length)].toString();
    this.plinker.triggerAttackRelease(note, '8n');
  }

  playBed() {
    this.bed.triggerRelease()

    const type = this.chords[Math.floor(Math.random() * 6)]


    const root = this.chord[Math.floor(Math.random() * this.chord.length)];
    this.chord = root.chord(type).notes();

    const notes = this.chord.map(note => note.toString(true) + '3');

    this.bed.triggerAttack(notes)


  }
}

export default Synth;
