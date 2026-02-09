import ReactDOM from 'react-dom/client'

//Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap"

// index.css'
import '../styles/index.css'

// components
import MiTodoList from './components/Home';

ReactDOM.createRoot(document.getElementById('root')).render(
    <MiTodoList/>
)
