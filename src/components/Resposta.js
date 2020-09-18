import React from 'react';
import { Col, Alert, } from 'reactstrap';


export const Resposta = ({ solucao, iteracoes }) => {

  return (
    <>
      {solucao ?
        <>
          <Col md="12" className="mt-4" >
            <Alert color="primary" className="text-center">
              A solução encontrada foi: {solucao} em {iteracoes} {iteracoes > 1 ? 'iterações' : 'iteração'}
            </Alert>
          </Col >
        </> :
        null
      }
    </>
  )
}
