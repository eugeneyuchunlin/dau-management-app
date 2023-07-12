import { TABLE_NAME } from '../../common/constants/constant';
import { daysInTheMonth } from '../../util/lib/utils';
import db from '../../database'


const sqlQuery = async (year, month)=>{
    const days = daysInTheMonth(year, month); 
    // if(month < 10){
    //     month = '0' + month;
    // }

    const sql = `SELECT * from ${TABLE_NAME} WHERE start_time >= '${year}-${month}-01 00:00:00' AND start_time <= '${year}-${month}-${days} 23:59:59'`; 
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if(err){
                console.error(err.message);
                reject(err);
            }
            resolve(rows);
        })
    })

}

export default async function Handler(req, res){
    if(req.method === 'GET'){
        const {year, month} = req.query;
        const rows = await sqlQuery(year, month);
        res.status(200).json(rows);
    }else{
        res.status(405).json({error : "Invalid method"});
    }
}