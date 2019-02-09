declare var require: any;
require('../css/main.css');

import { Engine } from './engine';
// The main entry point to the application
class App {
	public _engine: Engine;

	constructor(engine: Engine) {
		this._engine = engine;
	}


	public start(): void {
		this._engine.start();
	}

	private gameLoop(): void {
		requestAnimationFrame(this.gameLoop.bind(this));
		this._engine.start();
	}
}

var app: App;

window.onload = () => {
   
    app = new App(new Engine())
    app.start();
}

window.onresize = () => {
    app._engine.resize();
}  

