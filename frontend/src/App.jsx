import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import MainPage from './pages/MainPage.jsx';
import ResoursesPage from './pages/ResoursesPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { ChakraProvider, extendTheme, withDefaultColorScheme } from '@chakra-ui/react'

const client = new ApolloClient({
  uri: 'http://backend_orchestrator:8080/query',
  cache: new InMemoryCache(),
  fetchOptions: {
    mode: 'no-cors',
  }
});

const theme = extendTheme(withDefaultColorScheme({ colorScheme: 'green' }))

const App = () => (
  <ApolloProvider client={client}>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <Layout>
            <Routes>
              <Route path='/' element={ <MainPage /> } />
              <Route path='/settings' element={ <SettingsPage />} />
              <Route path='/resourses' element={ <ResoursesPage /> } />
            </Routes>
          </Layout>
        </ChakraProvider>
      </BrowserRouter>
  </ApolloProvider>
);

export default App;
