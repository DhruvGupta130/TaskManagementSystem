import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {ThemeProvider, CssBaseline} from '@mui/material';
import theme from './theme/theme';
import {SnackbarProvider} from "notistack";
import { Provider } from 'react-redux';
import { store } from './store/store';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                autoHideDuration={3000}
            >
                <Provider store={store}>
                    <App/>
                </Provider>
            </SnackbarProvider>
        </ThemeProvider>
    </React.StrictMode>
);