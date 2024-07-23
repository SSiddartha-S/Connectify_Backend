import mongoose from "mongoose";



let url='mongodb+srv://connectify1:sricharan123@cluster0.kz6hjzd.mongodb.net/connectify1?retryWrites=true&w=majority&appName=Cluster0'


let dbconnection=()=>{return mongoose.connect(url).then(res=>{console.log('db is connected')}).catch(err=>{console.log(err)});
}

export default dbconnection;