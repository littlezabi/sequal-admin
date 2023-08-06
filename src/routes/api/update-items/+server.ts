import {Settings} from '$lib/models'
export const POST = async ({request}:any)=>{
    const req = await request.json()
    if(req.updateSettings){
      await Settings.updateOne({_id: req.id}, {$set: req.settings}) 
    }
    return new Response(JSON.stringify({request: req}), {status:200})
}
