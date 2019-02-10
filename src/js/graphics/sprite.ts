import  { GLBuffer , AttributeInfo } from '../gl/glBuffer';
import { Vector3 } from '../math/vector3';
import { Texture } from './texture';
import { TextureManager } from '../graphics/textureManager';
import { Shader } from '../gl/shader';
import { gl } from '../gl/gl';
import { Matrix4x4 } from '../math/matrix4x4';
import { Material } from './material';
import { MaterialManager } from './materialManager';


export class Sprite {

    private _width: number;
    private _height: number;
    private _name: string;

    private _buffer: GLBuffer;
    private _materialName: string;

    private _material: Material;

    public position: Vector3 = new Vector3();


    public constructor(name: string,  materialName: string, width: number = 100, height: number = 100) { 
        this._name = name;
        this._height = height;
        this._width = width;
        this._materialName = materialName;
        this._material = MaterialManager.getMaterial(this._materialName);
    }

    public get name(): string {
        return this._name;
    }

    public destory(): void {
        this._buffer.destroy();
        MaterialManager.releaseMaterial(this._materialName);
        this._material = undefined;
        this._materialName = undefined;
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

        let modelLocation = shader.getUniformLocation('u_model');
        gl.uniformMatrix4fv( modelLocation, false, new Float32Array(Matrix4x4.translation(this.position).data) );

        let colorLocation = shader.getUniformLocation('u_tint');
        gl.uniform4fv(colorLocation, this._material.tint.toFloat32Array());

        if ( this._material.diffuseTexture !== undefined) {
            this._material.diffuseTexture.activateAndBind(0);
            let diffuseLocation = shader.getUniformLocation('u_diffuse');
            gl.uniform1i(diffuseLocation, 0);
        }
        this._buffer.bind();
        this._buffer.draw();
    }
}