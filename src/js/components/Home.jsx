import React from "react";

import { useState, useEffect } from 'react';

function MiTodoList() {
	const [tareas, setTareas] = useState([]);
	const [inputValue, setInputValue] = useState('');
	const [errores, setErrores] = useState('');

	function agregarTarea() {
		if (inputValue.trim() === '') {
			setErrores('No puedes agregar una tarea vacía');
			return;
		}

		setTareas([...tareas, { texto: inputValue, completada: false, isEditing: false }]);
		setInputValue('');
		setErrores('');
	}

	const eliminarTarea = (indiceObjetivo) => {
		const nuevaLista = tareas.filter((_, indexActual) => indexActual !== indiceObjetivo);
		setTareas(nuevaLista);
	}

	const completarTarea = (indiceObjetivo) => {
		const nuevaClase = tareas.map((tarea, index) => {
			if (index === indiceObjetivo) {
				return { ...tarea, completada: !tarea.completada };
			}
			return tarea
		})
		setTareas(nuevaClase);
	};

	const toggleEditarTarea = (indiceObjetivo) => {
		const nuevaLista = tareas.map((tarea, index) => {
			if (index === indiceObjetivo) {
				return { ...tarea, isEditing: !tarea.isEditing };
			}
			return tarea;
		});
		setTareas(nuevaLista);
	};

	const guardarEdicion = (indiceObjetivo, nuevoTexto) => {
		if (nuevoTexto.trim() === '') {
			setErrores('El texto de la tarea no puede estar vacío');
			return;
		}

		const nuevaLista = tareas.map((tarea, index) => {
			if (index === indiceObjetivo) {
				return { ...tarea, texto: nuevoTexto, isEditing: false };
			}
			return tarea;
		});
		setTareas(nuevaLista);
		setErrores('');
	}



	
	return (
		<div className="container">
			<h1>Mi TodoList</h1>

			{/* Formulario */}
			<div className="formulario">
				<input
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="Nueva tarea..."
				/>
				<button onClick={() => { agregarTarea() }}>
					Agregar
				</button>
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
				{tareas.map((tarea, index) => (
					<li key={index} className={tarea.completada ? 'completada' : ''}>
						{tarea.isEditing ? (
							<input
								type="text"
								value={tarea.texto}
								onChange={(e) => {
									// Actualizamos el texto mientras se edita
									const nuevaLista = tareas.map((t, i) =>
										i === index ? { ...t, texto: e.target.value } : t
									);
									setTareas(nuevaLista);
								}}
								onKeyPress={(e) => {
									// Al presionar Enter, guardamos la edición
									if (e.key === 'Enter') {
										guardarEdicion(index, tarea.texto);
									}
								}}
								onBlur={() => guardarEdicion(index, tarea.texto)}
							/>
						) : (
							<span>{tarea.texto}</span>
						)}
						<button onClick={() => completarTarea(index)}>✓</button>
						<button onClick={() => toggleEditarTarea(index)}>
							{tarea.isEditing ? '💾' : '✏️'}
						</button>
						<button onClick={() => eliminarTarea(index)}>✕</button>
					</li>
				))}
			</ul>

			{tareas.length === 0 && (
				<p className="vacio">No hay tareas. ¡Crea una!</p>
			)}
		</div>
	);
}

export default MiTodoList;