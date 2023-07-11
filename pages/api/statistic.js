import { getDailyDataFromDatabase, getDataFromDatabase } from "../../util/lib/utils";
import db from '../../database'


export default async function handler(req, res){
    if(req.method === 'GET'){
        // get the parameter from the request
        const {year, month} = req.query;
        console.log("year : ", year);
        console.log("month : ", month);
        const data = await getDataFromDatabase(db, Number(year), Number(month));
        const daily_data = await getDailyDataFromDatabase(db, Number(year), Number(month));
        res.status(200).json({data : data, daily_data : daily_data});
    }else{
        return res.status(405).json({error : 'only GET method allowed'});
    }
}