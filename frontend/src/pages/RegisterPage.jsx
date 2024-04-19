import {useEffect, useState} from "react";
import {BaseSpinner} from "../components/BaseSpinner";
import {Alert, AlertIcon, AlertDescription, AlertTitle, Button, Flex, Spacer, Stack} from "@chakra-ui/react";
import {PasswordInput} from "../components/PasswordInput";
import {LoginInput} from "../components/LoginInput";
import {Link, useNavigate} from "react-router-dom";
import {EmailInput} from "../components/EmailInput";
import {decodeLocal} from "../api/Common.js";
import { useMutation, gql } from '@apollo/client';

const HomePage = () => {

    const REGISTER = gql`
    mutation Register($username: String!, $password: String!){
        Register(username: $username, password: $password)}`;

    const [isLoading, setIsLoading] = useState(false)
    const [valueLogin, setValueLogin] = useState('')
    const [valueEmail, setValueEmail] = useState('')
    const [valuePassword1, setValuePassword1] = useState('')
    const [valuePassword2, setValuePassword2] = useState('')

    const [valueModal, setValueModal] = useState(0) // 0 - остутсвует, 1 - успех регистрации, 2 - ошибка
    const [textError, setTextError] = useState('')
    const navigate = useNavigate();


    const [sendData, { dataMutation, loadingMutation, errorMutation }] = useMutation(REGISTER);
    useEffect(() => {
        document.title = "Регистрация";
    }, []);

    const register = async () => {
        if (![valueLogin, valuePassword1, valuePassword2, valueEmail].every(e => Boolean(e))) {
            setValueModal(2);
            setTextError('Не все данные введены');
            return;
        }    

        if (valuePassword1 !== valuePassword2) {
            setIsLoading(false)
            setValueModal(2)
            setTextError('Пароли не совпадают')
            return
        }

        setIsLoading(true)
        sendData({variables: {username: valueLogin, password: valuePassword1}})
        
        
        // } catch (e) {
        //     setIsLoading(false)
        //     setValueModal(2)
        //     setTextError(`${e} - ошибка при логине`)
        //     if (e === 406) {
        //         setTextError('Логин уже используется!')
        //     } else if (e === 409) {
        //         setTextError('Почта уже используется!')
        //     }
        // }
    }

    if (isLoading && !loadingMutation) {
        if (errorMutation) {
            setIsLoading(false)
            setValueModal(2)
            setTextError(`${errorMutation.message} - ошибка при логине`)
            if (errorMutation.message === 'Network error: Response not ok') {
                setTextError('Сервер не отвечает')
            }
        } else {
            localStorage.setItem("access_token", decodeLocal(dataMutation.access_token))
            setValueModal(1)
            setIsLoading(false)
            navigate('/')
        }
    }


    if (valueModal === 1) {
        setTimeout(() => {
            navigate('/')
        }, 2000)
        return (<Alert
            status='success'
            variant='subtle'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            textAlign='center'
            height='200px'>
            <AlertIcon boxSize='40px' mr={0}/>
            <AlertTitle mt={4} mb={1} fontSize='lg'>
                Регистрация выполнена
            </AlertTitle>
            <AlertDescription fontSize={'ms'}>
                Через секунду вы будете перенаправлены на главную страницу
            </AlertDescription>
        </Alert>)
    } else if (valueModal === 2) {
        setTimeout(() => {
            setValueModal(0);
            setTextError('')
        }, 2000)
        return (<Alert
            status='error'
            variant='subtle'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            textAlign='center'
            height='200px'>
            <AlertIcon boxSize='40px' mr={0}/>
            <AlertTitle mt={4} mb={1} fontSize='lg'>
                Ошибка регистрации!
            </AlertTitle>
            <AlertDescription maxWidth='sm'>
                {textError}
            </AlertDescription>
        </Alert>)
    }

    return (
        <div>
            {isLoading || loadingMutation
                ?
                <>
                    <BaseSpinner/>
                </>
                :
                <Flex alignItems='center' flexDirection={'column'}>
                    <Stack spacing={2}>
                        <LoginInput value={valueLogin} setValue={setValueLogin}/>
                        <EmailInput value={valueEmail} setValue={setValueEmail}/>

                        <PasswordInput value={valuePassword1} setValue={setValuePassword1}/>
                        <PasswordInput value={valuePassword2} setValue={setValuePassword2}
                                       placeholder={'Повторите пароль'}/>
                        <Flex>

                            <Button onClick={register}>
                                Зарегистрироваться
                            </Button>
                            <Spacer/>
                            <Button>
                                <Link to={'/login'}>
                                    Войти
                                </Link>
                            </Button>

                        </Flex>
                    </Stack>
                </Flex>
            }
        </div>);
};

export default HomePage;