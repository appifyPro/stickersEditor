import "./App.css";
import DragAndDrop from "./components/DragAndDrop";
import FabricExample from "./components/FabricExample";

function App() {
  
  return (
    <div className="App">
    <div className="bg-black p-3 font-bold"><h1 className="text-2xl text-white">Online Design Tool</h1></div>
    <div className="bg-gray-300 p-1 font-semibold"><p className="">Design Your Print Products Online!</p></div>
 {/* <DragAndDrop /> */}
 <FabricExample />

 </div>
  )
}

export default App;
