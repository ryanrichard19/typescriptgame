import { IAssetLoader } from "./IAssetLoader";
import { IAsset } from "./IAsset";
import { Message } from "../message/message";
import { ImageAsset, ImageAssetLoader } from "./imageAssetLoader";

export const MESSAGE_ASSET_LOADER_ASSET_LOADED = 'MESSAGE_ASSET_LOADER_ASSET_LOADED::';

export class AssetManager {
    
    private static _loaders: IAssetLoader[] = [];

    private static _loadedAssets: {[name:string]:IAsset} = {};

    private constructor() {

    }

    public static initialize(): void {
        AssetManager._loaders.push(new ImageAssetLoader());
    }

    public static registerLoader(loader: IAssetLoader): void {
        AssetManager._loaders.push(loader);
    }

    public static onAssetLoaded(asset: IAsset): void {
        AssetManager._loadedAssets[asset.name] = asset;
        Message.send(MESSAGE_ASSET_LOADER_ASSET_LOADED + asset.name, this, asset);

    }

    public static loadAsset(assetName: string): void {

        let extention = assetName.split('.').pop().toLowerCase();
        for (let l of AssetManager._loaders) {
            let atest: string [] = [];
            atest.indexOf
            if (l.supportedExtensions.indexOf(extention) !== -1) {
                l.loadAsset(assetName);
                return;
            }
        }

        console.warn('Unable to load asset with extention ' + extention + ' beavause there is not loader associated with it.')

    }

    public static isAssetLoaded(assetname: string): boolean {
        return AssetManager._loadedAssets[assetname] !== undefined;
    }

    public static getAsset(assetName: string): IAsset { 
        if (AssetManager._loadedAssets[assetName] !== undefined) {
            return AssetManager._loadedAssets[assetName];
        } else {
            AssetManager.loadAsset(assetName);
        }
        return undefined;

    }
}