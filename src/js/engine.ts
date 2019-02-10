import { gl, GLUtilities } from './gl/gl';
import { Sprite } from './graphics/sprite';
import { Matrix4x4 } from './math/matrix4x4';
import { AssetManager } from './assets/assetManager';
import { MessageBus } from './message/messageBus';
import { BasicShader} from './gl/shaders/basicShader';
import { MaterialManager } from './graphics/materialManager';
import { Material } from './graphics/material';
import { Color } from './graphics/color';


/**
 * The main game engine class.
 **/
export class Engine {
  private _canvas: HTMLCanvasElement;
  private _basicShader: BasicShader;

  private _projection: Matrix4x4;

  private _sprite: Sprite;

  public constructor() {}

  /**
   * Starts up engine.
   **/
  public start(): void {
    this._canvas = GLUtilities.initialize();
    AssetManager.initialize();
    gl.clearColor(0, 0, 0, 1);

    this._basicShader = new BasicShader();
    this._basicShader.use();

    // Loaad Materials
    MaterialManager.registerMaterial(new Material('crate', 'images/crate.jpg', new Color(255, 128, 0, 255)));


    //Load

    this._projection = Matrix4x4.orthographic( 0, this._canvas.width, this._canvas.height, 0, -100.0, 100.0);

    this._sprite = new Sprite('test', 'crate');
    this._sprite.load();
    this._sprite.position.x = 200;
    this.resize();
    this.loop();
  }

  public resize(): void {
    if (this._canvas !== undefined) {
      this._canvas.width = window.innerWidth;
      this._canvas.height = window.innerHeight;
      gl.viewport( 0, 0, gl.canvas.width, gl.canvas.height);
      this._projection = Matrix4x4.orthographic( 0, this._canvas.width, this._canvas.height, 0, -100.0, 100.0);
    }
  }
  private loop(): void {
    MessageBus.update(0);

    

    gl.clear(gl.COLOR_BUFFER_BIT);

    //set uniforms
    let projectionPosition = this._basicShader.getUniformLocation('u_projection');
    gl.uniformMatrix4fv( projectionPosition, false, new Float32Array(this._projection.data) );


    this._sprite.draw(this._basicShader);

    requestAnimationFrame(this.loop.bind(this));
  }

}
