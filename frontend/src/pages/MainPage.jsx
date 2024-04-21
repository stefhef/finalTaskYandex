import { useEffect } from "react";
import { Input, TableContainer, Th, Tbody, Td, Tr, Table, TableCaption, Thead, Button, Text } from '@chakra-ui/react';
import { useMutation, useQuery, gql } from '@apollo/client';

import { BaseSpinner } from '../components/BaseSpinner';


const MainPage = () => {

    useEffect(() => {
        document.title = "Главная страница";
    }, []);

    const GET_EXPRESSIONS = gql`
    query GetAllExpressions($access_token: String!){
        Expressions(access_token: $access_token){
            id
            text
            status
            data_created
            data_calculated
            result
    }}`;

    const ADD_EXPRESSION = gql`
    mutation Add_expression($text: String!, $access_token: String!){
        AddExpression(text: $text, access_token: $access_token){
            text
            status
            data_created
            data_calculated
    }}`;
    let access_token = localStorage.getItem("access_token")
    const { loading, error, data } = useQuery(GET_EXPRESSIONS, {
        pollInterval: 15000,
        variables: { access_token },
    });
    const [addExpression, { data_mutation, loading_mutation, error_mutation }] = useMutation(ADD_EXPRESSION, {refetchQueries: [
        GET_EXPRESSIONS,
        'GetExpressions'
      ],});

    if (loading_mutation) return <BaseSpinner />;
    
    if (localStorage.getItem("access_token") == null) {
        return <Text>Требуется авторизация</Text>
    }
    

    if (data == undefined) return (
        <p>Error. No data or server is off</p>)
    
    if (error || error_mutation) return <p>Error : {error.message}</p>;
    

    
    function getColor(status) {
        switch (status) {
            case 200:
                return 'green';
            case 300:
                return 'yellow';
            case 400:
                return 'red';
            default: // Если неизвестный статус
                return 'gray';
        }
    }
    
    return (
        <section>
            <article>
            <Input w='20%' placeholder='Введите выражение для вычисления' />
            <Button bg='#028a7e' onClick={e => {
                addExpression({ variables: { text: e.target.previousSibling.value, access_token: localStorage.getItem("access_token") } });
            }}>Отправить выражение</Button>
            </article>
            
            {loading ? <BaseSpinner /> : <TableContainer>
            {data.Expressions ? 
            <Table variant='simple'>
                <TableCaption>Все выражения</TableCaption>
                <Thead>
                <Tr >
                    <Th>Статус</Th>
                    <Th>Выражение</Th>
                    <Th>Дата создания</Th>
                    <Th>Дата вычисления</Th>
                    <Th>Результат</Th>
                </Tr>
                </Thead>
                <Tbody>
                {data.Expressions.map((expression) => (
                <Tr key={expression.id} bg={getColor(expression.status)}>
                    <Td>{expression.status}</Td>
                    <Td>{expression.text}</Td>
                    <Td>{expression.data_created}</Td>
                    <Td>{expression.data_calculated}</Td>
                    <Td>{expression.result}</Td>
                </Tr>
                ))}
                </Tbody>
            </Table> : <p>Ещё нет данных</p>  // Если нет выражений, то выводим сообщение об этом.
}
            </TableContainer>}
            
        </section>
    )
}


export default MainPage;