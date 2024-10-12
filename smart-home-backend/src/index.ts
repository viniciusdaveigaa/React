import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
//criar servidor http
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", //URL do Front-End React
        methods: ["GET","POST"],
    }
});

//estado inicial dos dispositivos
let dispositivos = {
    luzOn: false,
}
//escuta os eventos de conexao do socket
io.on('connection',(socket)=>{
    console.log('Cliente conectado',socket.id)

    //enviando o estado inicial dos dispositivos para o cliente
    socket.emit('estadoInicial',dispositivos);

    //manipulando os eventos e mudançcas do estado dos dispositivos
    socket.on('acenderLuz',() => {
        dispositivos.luzOn = !dispositivos.luzOn;
        io.emit('estadoAltera',dispositivos);
    })
});


//Iniciar Servidor npm start
const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});