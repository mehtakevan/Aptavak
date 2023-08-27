// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import { ChakraProvider } from '@chakra-ui/react';
// import {BrowserRouter} from "react-router-dom";
// import ChatProvider from './Context/ChatProvider';

// document.getElementById("root")
// React.render(

//   <ChatProvider>
//     <BrowserRouter>
    
//     <ChakraProvider>

   
//     <App />
//     </ChakraProvider>
//     </BrowserRouter>
//   </ChatProvider>,
 
// );

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import ChatProvider from './Context/ChatProvider';

ReactDOM.render(
  <React.StrictMode>
   
      <BrowserRouter>
      <ChakraProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
        </ChakraProvider>
      </BrowserRouter>
    
  </React.StrictMode>,
  document.getElementById('root')
);
