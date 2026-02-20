import React from "react";

import { useState, useEffect } from 'react';

function MiTodoList() {
  const [tareas, setTareas] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [errores, setErrores] = useState('');
  const [editandoId, setEditandoID] = useState(null)
  const [textoEditado, setTextoEditado] = useState('')
  const USERNAME = "Jose_Smile"
  const USER_OPERATIONS = "https://playground.4geeks.com/todo/users/"
  const TODO_OPERATIONS = "https://playground.4geeks.com/todo/todos/"
  

const createUser= async () => {
    try {
        const response = await fetch(`${USER_OPERATIONS}${USERNAME}`, {method: "POST"})
        const data = await response.json()
        return data
    }
    catch (error) {
        console.log("hubo un error al crear usuario:",error)
    }
}

const getAllData = async () => {
  try{
    const res = await fetch (`${USER_OPERATIONS}${USERNAME}`)
    if(res.status === 404){
      await createUser()
      return await getAllData()
    }
    const data = await res.json()
      if (data.todos && Array.isArray(data.todos)) {
        const tareasDelServidor = data.todos.map(todo => ({
          texto: todo.label,
          completada: todo.is_done,
          isEditing: false
        }))
        setTareas(tareasDelServidor)}
  }
  catch (error) {
    console.log("Hubo un error al obtener usuarios", error)
  }
}


useEffect(()=> {
  getAllData()
},[])

  const agregarTarea = async () => {
    //Validación integrada en la función agregarTarea()
    if (inputValue.trim() === "") {
      setErrores("no se puede añadir una tarea vacia")
      return false
    }
    setErrores("")

    try{
     const response = await fetch(`${TODO_OPERATIONS}${USERNAME}`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        label: inputValue,
        is_done: false,
        
      })
    })
    const tareaCreada = await response.json()
    console.log(tareaCreada);
    const { id, is_done, label } = tareaCreada    
    setTareas([...tareas, { tareaID: id, texto: label, completada: is_done, isEditing: false }])
    console.log(tareas);
    
    }catch(err){
      throw new Error(err)
    }   
    setInputValue("")

  }

  const eliminarTarea = (indiceObjetivo) => {
    const nuevaLista = tareas.filter((_, indexActual) => indexActual !== indiceObjetivo);
    fetch (`${TODO_OPERATIONS}${tareas.tareaID}`, {
      method:"DELETE",
      headers: {'Content-Type': 'application/json'}
    })
    .then (res => {
      if (!res.ok) {
        throw new Error(`Error al eliminar la tarea`)
      }
    })
    .catch(err => {
      throw new Error(err)
    })
    setTareas(nuevaLista);
  }
  const completarTarea = (indiceObjetivo) => {
    const nuevaClase = tareas.map((tarea, index) => {
      if (index === indiceObjetivo) {
        return { ...tarea, completada: !tarea.completada }
      }
      return tarea
    })
    setTareas(nuevaClase);
  };

  const iniciarEdicion = (index, tarea) => {
    setEditandoID(index)
    setTextoEditado(tarea)


  }

  const guardarEdicion = (index) => {
    if (textoEditado.trim() === '') {
      setErrores('La nueva tarea no puede estar vacia')
      return false
    }
    const nuevasTareas = tareas.map((tarea, i) =>
      i === index ? { ...tarea, texto: textoEditado } : tarea
    );

    setTareas(nuevasTareas)
    setEditandoID('null')
    setTextoEditado('')
    setErrores('')

  };

  const cancelarEdicion = () => {
    setEditandoID(null)
    setTextoEditado('')
  }

  
  return (
    <div className="container">
      <h1>Mi TodoList</h1>

      {/* Formulario */}
      <div className="formulario">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === 'Enter')agregarTarea()
          }}
          placeholder="Nueva tarea..."
        />
      </div>

      {/* Errores */}
      {errores && <p className="error">{errores}</p>}

      {/* Contador */}
      <div className="stats">
        <p>Total: {tareas.length}</p>
        <p>Completadas: {tareas.filter(t => t.completada).length}</p>
      </div>

      {/* Lista */}
      <ul className="lista">
        {tareas.map((tarea, index) =>
          <li key={index} className={tarea.completada ? 'completada' : ''}>
            {editandoId === index ? (
              <>
                <input
                  value={textoEditado}
                  onChange={(e) => setTextoEditado(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') guardarEdicion(index);
                    if (e.key === 'Escape') cancelarEdicion();
                  }}
                  onBlur={() => guardarEdicion(index)}
                  autoFocus
                />
                <button onClick={() => guardarEdicion(index)}>💾</button>
                <button onClick={cancelarEdicion}>❌</button>
              </>

            ) : (
				
              <>
                <span>{tarea.texto}</span>
                <button onClick={() => completarTarea(index)}>✓</button>
                <button onClick={() => iniciarEdicion(index, tarea.texto)}>✏️</button>
                <button onClick={() => eliminarTarea(index)}>✕</button>
              </>
            )}

          </li>
        )}
      </ul>

      {tareas.length === 0 && (
        <p className="vacio">No hay tareas. ¡Crea una!</p>
      )}


    </div>
  );
}

export default MiTodoList;