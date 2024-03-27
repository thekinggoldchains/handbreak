import React, { useState, useCallback, forwardRef, useEffect } from "react"
import { useForm } from 'react-hook-form'
import display, { displays } from "../../../stores/display";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { addDevice, getDevice, updateDevice } from "../../../actions/device";

const DeviceCreate = (props) => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        // Simule uma chamada à API para obter os dados do formulário com base no ID
        const fetchData = async () => {
            try {
                // Substitua esta linha pela chamada real à API para obter os dados do formulário
                const formData = await getDevice(props.id);
                console.log(formData)
                // Use o método reset para preencher os valores iniciais do formulário
                reset(formData);
            } catch (error) {
                console.error('Erro ao obter os dados do formulário:', error);
            }
        };

        // Chame a função fetchData apenas se houver um ID válido
        if (props.id) {
            fetchData();
        }
    }, [props.id, reset]);

    const save = (data) => {
        if(props.ehTroca){
            props.onConfirm(data);
        }
        else if (data._id) {
            updateDevice(data).then(res => {
                display.notification('Atualizado com sucesso!');
                props.refresh();
            });
        } else {
            addDevice(data).then(res => {
                display.notification('Criado com sucesso!');
                props.refresh();
            })
        }
    }

    return (
        <div className="d-flex flex-column w-100 col-md-12 p-4 justify-content-center">
            <div className="d-flex flex-column w-100 p-3">
                <div className="form-group" hidden={props.ehTroca}>
                    <label htmlFor="nome">Nome do Dispositivo</label>
                    <input
                        className={`form-control ${errors?.nome ? 'is-invalid' : ''}`}
                        name="nome"
                        id="nome"
                        type="text"
                        {...register("nome", { required: props.ehTroca ? false : true })}
                    />
                </div>
                <label htmlFor="display">Apresentação</label>
                <select name="display" id="display" className={`form-select ${errors?.display ? 'is-invalid' : ''}`} {...register("display", { required: true })}>
                    {
                        display.displays.length > 0 && display.displays.map(d => (
                            <option value={d._id}>{d.name}</option>
                        ))
                    }
                </select>
                <div className="form-button d-flex w-100 justify-content-center mt-3">
                    <button className="btn btn-primary" onClick={() => handleSubmit(save)()}>Salvar</button>
                </div>
            </div>
        </div>
    )
}

export default DeviceCreate