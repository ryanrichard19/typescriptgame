import  { GLBuffer , AttributeInfo } from '../gl/glBuffer';
import { Vector3 } from '../math/vector3';
import { Texture } from '../graphics/textures';
import { TextureManager } from '../graphics/textureManager';
import { Shader } from '../gl/shader';
import { gl } from '../gl/gl';

export class Sprite {

    private _width: number;
    private _height: number;
    private _name: string;

    private _buffer: GLBuffer;
    private _textureName: string;

    private _texture: Texture;

    public position: Vector3 = new Vector3();


    public constructor(name: string,  textureName: string, width: number = 100, height: number = 100) { 
        this._name = name;
        this._height = height;
        this._width = width;
        this._textureName = textureName;
        this._texture = TextureManager.getTexture(this._textureName);
    }

    public get name(): string {
        return this._name;
    }

    public destory(): void {
        this._buffer.destroy();
        TextureManager.releaseTexture(this._textureName);
    }

    public load(): void {
        this._buffer = new GLBuffer(5);

        let positionAttribute = new AttributeInfo();
        positionAttribute.location = 0;
        positionAttribute.offset = 0;
        positionAttribute.size = 3;
        this._buffer.addAttributeLocation(positionAttribute);

        let texCoordAttribute = new AttributeInfo();
        texCoordAttribute.location = 1;
        texCoordAttribute.offset = 3;
        texCoordAttribute.size = 2;
        this._buffer.addAttributeLocation(texCoordAttribute);


    let vertices = [
      // x,y,z  , u, v
      0, 0, 0, 0 ,0,
      0, this._height, 0, 0, 1.0, 
      this._width , this._height, 0, 1.0, 1.0,

      this._width, this._height, 0, 1.0, 1.0,
      this._width, 0.0, 0, 1.0, 0, 
      0, 0, 0, 0, 0

    ];

    this._buffer.pushBackData(vertices);
    this._buffer.upload();
    this._buffer.unbind();

    }

    public update(time: number){

    }

    public draw(shader: Shader): void {

        this._texture.activateAndBind(0);
        let diffuseLocation = shader.getUniformLocation('u_diffuse');
        gl.uniform1i(diffuseLocation, 0);


        this._buffer.bind();
        this._buffer.draw();
    }
}