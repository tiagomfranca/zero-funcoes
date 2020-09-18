import React, { useState } from 'react';
import { Container, Jumbotron } from 'reactstrap';

import { Formulario, Resposta, Grafico } from './components';

import './App.css';

function App() {
  const [equacao, setEquacao] = useState('');
  const [isNewton, setIsNewton] = useState(false);
  const [parametros, setParametros] = useState({
    x1: '', x2: '', chuteInicial: ''
  })
  const [solucao, setSolucao] = useState(null);
  const [iteracoes, setIteracoes] = useState(1);
  return (
    <>
      <Jumbotron>
        <h1 className="header text-center">Zero de Funções</h1>
      </Jumbotron>
      <Container>
        <Formulario
          setEquacao={setEquacao}
          setIsNewton={setIsNewton}
          setParametros={setParametros}
          setSolucao={setSolucao}
          iteracoes={iteracoes} setIteracoes={setIteracoes} />
        <Resposta solucao={solucao} iteracoes={iteracoes} />
        <Grafico equacao={equacao} metodo={isNewton} parametros={parametros} solucao={solucao} />
      </Container>
    </>
  );
}

export default App;
