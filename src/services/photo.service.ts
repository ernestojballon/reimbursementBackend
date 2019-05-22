import { insertPhoto } from "../dao/photo.dao";




//::::::::::::::::::::::::::::::::::::::::::
// Save photo service
//::::::::::::::::::::::::::::::::::::::::::
export async function insertPhotoService(newPath:string,reimId:number){

    
    return await insertPhoto(newPath,reimId);
};