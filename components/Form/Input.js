import { faFileVideo } from '@fortawesome/free-regular-svg-icons';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import ContentLoader from 'react-content-loader';
import { display } from '../../stores';
import { alerta, espacoAlert } from '../Toasts';
import ColorPicker from './ColorPicker'
import { CloudArrowUp, Database } from 'react-bootstrap-icons';
import { Form } from 'react-bootstrap';



const DropzoneWithNoSSR = dynamic(() => import('react-dropzone'), {
  ssr: false,
  loading: () => (
    <ContentLoader height={120} width={640}>
      <rect x='0' y='0' rx='5' ry='5' width='100%' height='100' />
    </ContentLoader>
  )
})

const Input = (props) => {
  const { value, onChange, ...rest } = props;
  const [cursor, setCursor] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const input = ref.current;
    if (input && input.type != 'number') input.setSelectionRange(cursor, cursor);
  }, [ref, cursor, value]);

  const handleChange = (value) => {
    const { name } = props
    onChange(name, value);
  };
  const handleInputChange = (e) => {
    e.preventDefault();
    setCursor(e.target.selectionStart);
    handleChange(e.target.value);
  }

  const fonts = [
    { id: `'Open-Sans', sans-serif`, label: 'Open-Sans' },
    { id: `'Inconsolata', monospace`, label: 'Inconsolata' },
    { id: `'Lobster', cursive`, label: 'Lobster' },
    { id: `'Nunito', sans-serif`, label: 'Nunito' },
    { id: `'Roboto', sans-serif`, label: 'Roboto' },
    { id: `'Silkscreen', cursive`, label: 'Silkscreen' },
    { id: `'Rubik Dirt', cursive`, label: 'Efeito Giz' },
  ]


  const handleOnDropAccepted = acceptedFiles => {

    const file = Object.assign(acceptedFiles[acceptedFiles.length - 1], {
      preview:
        URL && URL.createObjectURL
          ? URL.createObjectURL(acceptedFiles[acceptedFiles.length - 1])
          : typeof window !== 'undefined' && window.webkitURL
            ? window.webkitURL.createObjectURL(acceptedFiles[acceptedFiles.length - 1])
            : null
    })
    if (file.size > 104857600) {
      return alerta("Para o melhor funcionamento, arquivos maiores que 100MB não são permitidos", 'erro')
    }
    if ((display.espacoUsado.bytes + file.size) >= display.espacoDisponivel.bytes) {
      return alerta("Esse arquivo excede o tamanho disponivel de espaço", 'erro')
    }
    if (display.atingiuLimite) {
      return espacoAlert()
    }
    onChange('upload', file)
  }

  const handleOnDropRejected = rejectedFiles => {
    alert('Este arquivo nao é permitido:' + rejectedFiles[rejectedFiles.length - 1].name)
  }

  const {
    label,
    inline = true,
    expand = true,
    type = 'text',
    placeholder = '',
    choices = [],
    disabled,
    onKeyDown = () => { },
    className
  } = props
  return (
    <div className='inputGroup'>
      {label && <label>{label}</label>}
      {type == 'text' || type == 'password' || type == 'number' ? (
        <Form.Control
          className={className}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            handleInputChange(e)
          }}
          disabled={disabled ? disabled : false}
          onKeyDown={onKeyDown}
          ref={ref}
          {...rest}
        />
      ) : type == 'select' ? (
        <Form.Select onChange={handleInputChange} value={value || ''} disabled={disabled ? disabled : false} className={className}>
          <option value={''}>Escolha uma opção...</option>
          {choices.map(choice => (
            <option key={choice.id} value={choice.id}>
              {choice.label}
            </option>
          ))}
        </Form.Select>
      ) : type == 'color' ? (
        <ColorPicker color={value} onChange={handleChange} />
      ) : type == 'photo' ? (
        <DropzoneWithNoSSR
          accept='image/*'
          onDropAccepted={handleOnDropAccepted}
          onDropRejected={handleOnDropRejected}
          multiple={false}
        >
          {({ getRootProps, getInputProps, isDragActive }) => {
            return (
              <div {...getRootProps()} className='upload'>
                <input {...getInputProps()} />
                {isDragActive || (!value || value == '') ? (
                  <div className={'photo-upload'}><CloudArrowUp width={32} /> Fazer novo upload de imagem</div>
                ) : (
                  <div className={'photo'}>
                    <div
                      className={'thumbnail'}
                      style={{
                        backgroundImage: `url(${value})`
                      }}
                    />
                    <span className={'link'}>{value}</span>
                  </div>
                )}
              </div>
            )
          }}
        </DropzoneWithNoSSR>
      ) : type == 'video' ? (
        <DropzoneWithNoSSR
          accept='video/*'
          onDropAccepted={handleOnDropAccepted}
          onDropRejected={handleOnDropRejected}
          multiple={false}
        >
          {({ getRootProps, getInputProps, isDragActive }) => {
            return (
              <div {...getRootProps()} className='upload'>
                <input {...getInputProps()} />
                {isDragActive || (!value || value == '') ? (
                  <div className={'photo-upload'}>Arraste o video aqui...</div>
                ) : (
                  <div className={'photo'}>
                    <div
                      className={'thumbnail'}
                      style={{
                        backgroundImage: faFileVideo
                      }}
                    />
                    <span className={'link'}>{value}</span>
                  </div>
                )}
              </div>
            )
          }}
        </DropzoneWithNoSSR>
      ) : type == 'font' ? (
        <Form.Select onChange={handleInputChange} value={value || ''} className={className}>
          <option value={''}>Escolha uma opção...</option>
          {fonts.map(choice => (
            <option key={choice.id} value={choice.id}>
              {choice.label}
            </option>
          ))}
        </Form.Select>
      )
        :
        (
          <Form.Control
            as='textarea'
            onChange={(e) => {
              handleInputChange(e)
            }}
            value={value}
            placeholder={placeholder}
            className={className}
            ref={ref}
          />
        )}
      <style jsx>{`
          .inputGroup {
            margin-bottom: 16px;
            display: ${!inline ? 'flex' : 'inline-block'};
            flex-direction: ${inline ? 'row' : 'column'};
            justify-content: flex-start;
          }

          label {
            margin-right: 16px;
            color: #878787;
            font-family: 'Open Sans', sans-serif;
            min-width: 100px;
            max-width: ${inline ? '100px' : 'none'};
            display: inline-block;
            padding-top: 16px;
            padding-bottom: ${inline ? '0px' : '16px'};
          }

          input,
          textarea,
          select,
          .photo,
          .photo-upload {
            font-family: 'Open Sans', sans-serif;
            color: #333;
            background-color: #f7f7f7;
            min-height: 40px;
            min-width: ${expand ? '450px' : '0px'};
            border-radius: 2px;
            border: none;
            outline: none;
            padding: 8px;
            padding-left: 16px;
            padding-right: 16px;
            font-size: 16px;
            box-sizing: unset !important;
          }

          input:disabled,
          textarea:disabled,
          select:disabled {
            background-color: #d7d7d7;
            cursor: not-allowed;
          }

          textarea {
            resize: vertical;
            min-height: 100px;
          }

          select {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            padding: 16px;
          }

          input[type='number'] {
            min-width: 50px !important;
            max-width: 50px !important;
            text-align: center;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            color: #5c6873;
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid #e4e7ea;
            border-radius: 0.25rem;
            transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
            margin: 5px 5px;
          }

          .upload {
            display: ${inline ? 'inline-block' : 'flex'};
            cursor: pointer;
            outline: none;
            max-width: 100%;
          }

          .photo {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 8px;
          }

          .photo-upload {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 8px;
            font-family: 'Open Sans', sans-serif;
            text-align: center;
            border-radius: 4px;
            border: 2px dashed #adadad;
            background: white;
            height: 40px;
          }

          .photo .link {
            margin-left: 16px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            max-width: 400px;
          }

          .photo .thumbnail {
            height: 40px;
            width: 40px;
            border-radius: 2px;
            background-size: cover;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}</style>
    </div>


  )
};

export default Input;