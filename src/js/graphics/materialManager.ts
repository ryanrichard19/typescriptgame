import { Material } from "./material";

class MaterialReferenceMode {
    public material: Material;

    public referenceCount: number = 1;


    public constructor(materal: Material) {
        this.material = materal;
        
    }
}


export class MaterialManager {

    private static _materials: { [name: string]: MaterialReferenceMode } = {};

    private constructor() {

    }

    public static registerMaterial(material: Material): void {
        if (MaterialManager._materials[material.name] === undefined) {
            MaterialManager._materials[material.name] = new MaterialReferenceMode(material);
        }
    }

    public static getMaterial(materialName: string): Material {
        if (MaterialManager._materials[materialName] === undefined) {
            return undefined;
        } else {
            MaterialManager._materials[materialName].referenceCount++;
            return MaterialManager._materials[materialName].material;
        }
    }

    public static releaseMaterial(materialName: string): void {
        if (MaterialManager._materials[materialName] === undefined) {
            console.warn('Cannot release a material which has not been registered.');
        } else {
            MaterialManager._materials[materialName].referenceCount--;
            if (MaterialManager._materials[materialName].referenceCount < 1) {
                MaterialManager._materials[materialName].material.destroy;
                MaterialManager._materials[materialName].material = undefined;
                delete MaterialManager._materials[materialName];
            }   
        }
    }
}