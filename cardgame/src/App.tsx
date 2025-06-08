import './resources/css/app.css';
import './resources/css/cards.css';
import BoardEights from './components/BoardEights';
import { Container as ModalContainer } from 'react-modal-promise';



function App() {

  

  return (
      <>

          <div style={{position: "fixed", width:"100%", backgroundColor: "#333333"}}>
              <div className="bounding">
                  <div className="topnav" id="myTopnav">
                      <a href="index.html">Home</a>
                  </div>
              </div>
          </div>

          <br/>

          <BoardEights />
          <ModalContainer />
    </>
  );
}

export default App;
