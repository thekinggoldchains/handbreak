import Editor from 'ckeditor5-custom-build'
import { CKEditor } from '@ckeditor/ckeditor5-react'

export default function CustomEditor({ data, onReady, onChange, onBlur, onFocus }) {

    const editorConfiguration = {
		toolbar: {
			items: [
				'|',
				'fontFamily',
				'fontSize',
                'fontColor',
				'bold',
				'italic',
				'|',
				'outdent',
				'indent',
				'|',
				'blockQuote',
				'undo',
				'redo'
			]
		},
        fontFamily: {
            options: [
              'default',
              'Arial, sans-serif',
              'Georgia, serif',
              'Inconsolata, monospace',
              'Lobster, cursive',
              'Roboto, sans-serif',
              'Silkscreen, sans-serif',
              'Rubik Dirt, sans-serif', // Adicione a fonte desejada do Google Fonts aqui
            ],
          },
          fontSize: {
            options: [
                '12',
                '25',
                '30',
                '48',
                '72',
                '85',
                '90',
                '100',
                '150',
                '200',
                '300'
            ],
            supportAllValues: true
          },
		language: 'pt'
	}

    return (
        <CKEditor
            editor={Editor}
            config={editorConfiguration}
            data={data}
            onChange={(event, editor) => {
                const data = editor.getData();
                onChange(data);
            }} />
    )
}