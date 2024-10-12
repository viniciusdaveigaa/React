import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:4000');

interface EstadoDispositivo {
  luzOn: boolean
}

const App: React.FC = () => {
  const [dispositivo, setDispositivo] = useState<EstadoDispositivo>({
    luzOn: false
  });

  //conectar ao backend e receber o estado inicial
  useEffect(() => {
    socket.on('estadoInicial', (estadoDispositivos: EstadoDispositivo) => {
      setDispositivo(estadoDispositivos);
    });
    //atualiza estado quando houver mudança
    socket.on('estadoAltera', (novoEstado: EstadoDispositivo) => {
      setDispositivo(novoEstado);
    });
    return () => {
      socket.off('estadoInicial');
      socket.off('estadoAltera');
    }
  }, []);

  //funcao para alterar o estado do dispositivo
  const acenderLuz = () => {
    socket.emit('acenderLuz');
  }
  return (
    <div className='casa'>
      <h1>Casa Inteligente</h1>
      <div className='luz'>
        <p>Luz</p>
        <button onClick={acenderLuz}>
          {dispositivo.luzOn ? 'Desligar Luz' : 'Ligar Luz'}
        </button>
        <img src='/imgs/luz.png' className={`status ${dispositivo.luzOn ? 'on' : 'off'}`} />
      </div>
    </div>
  );
}

export default App;