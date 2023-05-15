import { URL, CANCEL_END_POINT } from '../../../common/constants/url';
import FUJITSU_API_KEY from '../../../config';

export default async function handler(req, res) {
    if(req.method == 'POST'){
        const { job_id}  = req.body;

        const url = URL + CANCEL_END_POINT; 
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accpet' : 'application/json',
                'X-Api-Key' : FUJITSU_API_KEY
            },
            body: JSON.stringify({
                job_id: job_id,
            })
        })
        const data = await response.json();
        if(response.status === 200){
            res.status(200).json(data);
        }else{
            res.status(response.status).json(data);
        }
    }
}