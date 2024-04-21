import { useEffect } from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Tabs, TabList, Tab, Button, Heading, Spacer } from '@chakra-ui/react'


const Layout = ({children}) => {

    let isAuth = false;
    useEffect(() => {
        if (localStorage.getItem("access_token") != null) {
            isAuth = true;
        }
    });

    //  = localStorage.getItem("access_token") != null

    const logout = () => {
        localStorage.removeItem("access_token");
        // window.location.reload();
    }

    return(
    <div className='App'>
      <header w='100%'>
        <Heading bg='#028a7e' color='white' padding='1%'>
          Медленный калькулятор
        </Heading>
        <Tabs>
            <TabList >
                <Tab colorScheme='#028a7e' as={ReactRouterLink} to='/'>
                    Калькулятор
                </Tab>
                <Tab colorScheme='brand' as={ReactRouterLink} to='/settings'>
                    Настройки
                </Tab>
                <Tab colorScheme='brand' as={ReactRouterLink} to='/resourses'>
                    Вычислительные ресурсы
                </Tab>
                <Spacer />
                {isAuth ?
                            <>
                                <Tab>
                                    <Button onClick={logout} as={ReactRouterLink} to={'/'}>
                                        Выйти
                                    </Button>
                                </Tab>
                            </>
                            :
                            <>
                                <Tab as={ReactRouterLink} to={'/register'}>
                                    Регистрация
                                </Tab>
                                <Tab as={ReactRouterLink} to={'/login'}>
                                    Войти
                                </Tab>
                            </>
                        }
            </TabList>
        </Tabs>
      </header>
      <main style={{padding: "3%"}}>
        {children}
      </main>
    </div>
    )
}

export default Layout;