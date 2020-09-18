import React, { useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Button, Col, FormGroup, Label, Row } from 'reactstrap';
import * as Yup from 'yup';
import { derivative, evaluate } from 'mathjs';

export const Formulario = ({ setEquacao, setIsNewton, setParametros, setSolucao, iteracoes, setIteracoes }) => {
  const [metodo, setMetodo] = useState('bissec');
  const [maximoIteracoes, setMaximoIteracoes] = useState(100);

  const handleSubmit = (value) => {
    setEquacao(value.equacao);
    setSolucao(null);
    setMaximoIteracoes(value.numMax);

    if (metodo === 'bissec') {
      setIsNewton(false);
      setParametros({ x1: value.x1, x2: value.x2, chuteInicial: '' })
      bisseccao(value.equacao, value.x1, value.x2, value.erro, 0);
    } else {
      setIsNewton(true)
      setParametros({ x1: '', x2: '', chuteInicial: value.chuteInicial })
      newton(value.equacao, value.chuteInicial, value.erro, 0);
    }
  }

  const handleOptionChange = (changeEvent, props) => {
    setMetodo(changeEvent.target.value)
    props.values.metodo = changeEvent.target.value;
  }

  const bisseccao = (equacao, x1, x2, erro, iteracao) => {
    if(iteracao > maximoIteracoes){
      return;
    }
    iteracao += 1;

    const xMedio = evaluate(`(${x1} + ${x2}) / 2`)
    const fxMedio = evaluate(equacao, { x: xMedio });

    if (fxMedio <= erro && fxMedio >= (0 - erro)) {
      setIteracoes(iteracao);
      setSolucao(xMedio)
    } else {
      const fx1 = evaluate(equacao, {x: x1});
      const fx2 = evaluate(equacao, {x: x2});
      console.log('fx1', fx1, ' fx2', fx2)
      if (fxMedio > 0) {
        if(fx1 < fx2){
          bisseccao(equacao, x1, xMedio, erro, iteracao);
        } else {
          bisseccao(equacao, xMedio, x2, erro, iteracao);
        }
      } else {
        if(fx1 < fx2){
          bisseccao(equacao, xMedio, x2, erro, iteracao);
        } else {
          bisseccao(equacao, x1, xMedio, erro, iteracao);
        }
      }
    }
  }

  const newton = (equacao, chuteInicial, erro, iteracao) => {
    if(iteracao > maximoIteracoes){
      return;
    }
    iteracao += 1;
    const derivada = derivative(equacao, 'x');
    const fx = evaluate(equacao, { x: chuteInicial.toString() })
    const flinhax = evaluate(derivada.toString(), { x: chuteInicial.toString() })
    const c = evaluate(`${chuteInicial} - (${fx}/${flinhax})`)
    const comparacao = evaluate(equacao, { x: c })
    if (comparacao <= erro && comparacao >= (0 - erro)) {
      setIteracoes(iteracao);
      setSolucao(c)
    } else {
      // setIteracoes(newIteracoes + 1)
      newton(equacao, c, erro, iteracao)
    }
  }

  return (
    <>
      <Formik
        initialValues={{
          equacao: '',
          erro: '',
          numMax: 100,
          metodo: metodo,
          x1: '', x2: '', chuteInicial: ''
        }}
        onSubmit={(values) => handleSubmit(values)}
        validationSchema={Yup.object().shape({
          equacao: Yup.string().required('Campo obrigatório'),
          erro: Yup.number('Inserir um número decimal').required('Campo obrigatório'),
          numMax: Yup.number('Inserir um número inteiro').min(1, 'Pelo menos uma iteração deve ser executada').required('Campo obrigatório'),
          metodo: Yup.string().required('Campo obrigatório'),
          x1: Yup.string().when('metodo', {
            is: 'bissec',
            then: Yup.string().required('Campo obrigatório')
          }),
          x2: Yup.string().when('metodo', {
            is: 'bissec',
            then: Yup.string().required('Campo obrigatório')
          }),
          chuteInicial: Yup.string()
            .when('metodo', {
              is: 'newton',
              then: Yup.string().required('Campo obrigatório')
            })
        })}
      >
        {
          form => (
            <Form>
              <FormGroup>
                <legend>Equação: </legend>
                <Field
                  className="form-control"
                  type="text"
                  name="equacao"
                />
                <ErrorMessage name="equacao" className="text-danger" />
              </FormGroup>
              <FormGroup>
                <Row><Col md="6">
                <legend>Erro: </legend>
                <Field
                  className="form-control"
                  type="text"
                  name="erro"
                />
                <ErrorMessage name="erro" />
                </Col>
                <Col md="6">
                <legend>Máximo de Iterações: </legend>
                <Field
                  className="form-control"
                  type="number"
                  name="numMax"
                />
                <ErrorMessage name="numMax" />
                </Col>
                </Row>
              </FormGroup>
              <Row>
                <Col md="12">
                  <FormGroup tag="fieldset">
                    <Row className="text-center">
                      <legend>Método: </legend>
                    </Row>
                    <Row className="text-center">
                      <Col md="4" />
                      <Col md="2">
                        <FormGroup check>
                          <Label check>
                            <Field type="radio" name="metodo" value="bissec" onChange={e => handleOptionChange(e, form)} checked={metodo === 'bissec'} />{' '}
                              Bissecção
                            </Label>
                        </FormGroup>
                      </Col>
                      <Col md="2">
                        <Label check>
                          <Field type="radio" name="metodo" value="newton" onChange={e => handleOptionChange(e, form)} checked={metodo === 'newton'} />{' '}
                              Newton
                            </Label>
                      </Col>
                      <Col md="4" />
                    </Row>
                    <Row className="text-center">
                      <Col md="12">
                        {metodo === 'bissec' ?
                          <>
                            <Row>
                              <Col md="2" />
                              <Col md="4">
                                <FormGroup>
                                  <Label for="x1">X1: </Label>
                                  <Field type="text" className="form-control" name="x1" />
                                  <ErrorMessage name="x1" />
                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup>
                                  <Label for="x2">X2: </Label>
                                  <Field type="text" className="form-control" name="x2" />
                                  <ErrorMessage name="x2" />
                                </FormGroup>
                              </Col>
                              <Col md="2" />
                            </Row>
                          </> :
                          <FormGroup>
                            <Label for="chuteInicial">Chute Inicial: </Label>
                            <Field type="text" className="form-control" name="chuteInicial" />
                            <ErrorMessage name="chuteInicial" />
                          </FormGroup>}
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
              </Row>
              <div className="text-center">
                <Button type="submit" className="btn btn-primary">Resolver</Button>
              </div>
            </Form>
          )
        }
      </Formik>

    </>)
}