import './resources/css/app.css';
import './resources/css/cards.css';
import BoardEights from './components/BoardEights';
import { Container as ModalContainer } from 'react-modal-promise';



function App() {

  

  return (
      <>
          <BoardEights />
          <ModalContainer />
    </>
  );
}

export default App;
