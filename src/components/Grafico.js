import React from 'react';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import { compile, range } from 'mathjs';
import { Container } from 'reactstrap';


const Plot = createPlotlyComponent(Plotly);

export const Grafico = ({ equacao, metodo, parametros, solucao }) => {
  const expr = compile(equacao);
  const valoresX = range(-10, 10, 0.5).toArray();
  const valoresY = valoresX.map((x) => expr.evaluate({ x: x }))
  let params;

  if (metodo) {
    params = [parametros.chuteInicial]
  } else {
    params = [parametros.x1, parametros.x2]
  }
  return (
    <>
      {solucao &&
        <Container className="text-center">
          <Plot
            data={[
              {
                x: valoresX,
                y: valoresY,
                type: 'scatter',
                name: 'Equação'
              },
              {
                type: 'scatter',
                x: [solucao],
                y: [0],
                name: 'Solução'
              },
              {
                x: params,
                y: [0],
                name: 'Parâmetros'
              }
            ]}
            layout={{ width: 600, height: 500, title: 'Gráfico da função', yaxis: {range:[-10, 10]} }}
          />
        </Container>}
    </>
  )
}