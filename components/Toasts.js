import React from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function espacoAlert() {
    return (
        toast.error("Voce atingiu o limite do espaço contratado, por favor, elimine arquivos ou contate o administrador para adquirir mais espaço", {theme: 'colored', })
    );
}
export function alerta(text, theme) {
    return (
        theme == 'erro' ? 
        toast.error(text, {theme: 'colored', })
        :
        toast.success(text, {theme: 'colored', })
    );
}