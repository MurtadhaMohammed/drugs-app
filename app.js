import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header';
import PrescriptionList from './components/PrescriptionList';
import PrescriptionProvider from './providers/PrescriptionProvider';

class App extends React.Component{
    render() {
      return (
        <PrescriptionProvider>
         <Header/>
         <PrescriptionList/>
        </PrescriptionProvider>
      )
    };
}


ReactDOM.render(<App/>,document.getElementById('root'))