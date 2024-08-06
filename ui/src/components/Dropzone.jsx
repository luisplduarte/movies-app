/* eslint-disable react/prop-types */
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

function Dropzone({ initialImage = null, onFileAccepted }) {
  const [imageSrc, setImageSrc] = useState(initialImage);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0]; // Since maxFiles is set to 1, we'll get the first file
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        const binaryStr = reader.result;
        setImageSrc(binaryStr);

        if (onFileAccepted) {
          onFileAccepted(file);
        }
      };
      reader.readAsDataURL(file);
    },
    [onFileAccepted],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png', '.jpeg', '.jpg', '.gif'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: '2px dashed #FFFFFFDE',
        borderRadius: '4px',
        padding: '20px',
        textAlign: 'center',
        width: '95%',
        cursor: 'pointer',
        marginTop: '10px',
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? <p>Drop the file here ...</p> : <p>Drag and drop file here, or click to select file</p>}

      {imageSrc && (
        <div style={{ marginTop: '20px' }}>
          <img src={imageSrc} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '200px' }} />
        </div>
      )}
    </div>
  );
}

export default Dropzone;
