import Stack from '@mui/material/Stack';

import { useState } from "react";
import React, {useCallback} from 'react'
import { useDropzone } from 'react-dropzone'
import { getUploadEndpoint } from "../api/endpoint";
import CircularWithValueLabel from "./spinner";
import { useSearchParams } from "react-router-dom";

async function uploadFiles(propertyTitle: string, files: FileList) {

  if (!propertyTitle) {
    propertyTitle = "123"
  }

  const filesUpload = []

  for (const file of Array.from(files)) {
    const formData = new FormData();
    formData.append('doc_file', file, file.name); // 'file' is the key, 'filename.bin' is the filename
    formData.append('property', propertyTitle)
    const uploadPromise = fetch(getUploadEndpoint(propertyTitle), {
      headers: {
        Accept: "application/json",
      },
      method: "POST",
      body: formData,
    });
    
    filesUpload.push(uploadPromise);
    try {
      const uploaded = await Promise.all(filesUpload);
      console.log("uploaded files", uploaded);
    } catch (e) {
      console.error(e);
    }
  }
}

interface DropzoneProps {
  // propertyTitle: string;
  goNext: Function;
  propertyTitle: string;
}

function Dropzone(props: DropzoneProps) {
  const [uploading, setUploading] = useState(false);
  const onDrop = async (acceptedFiles: any) => {
    // Do something with the files
    try {
      setUploading(true);
      await Promise.all([uploadFiles(props.propertyTitle, acceptedFiles), new Promise((r) => setTimeout(r, 1000 * 7))]);

      props.goNext();
    } catch (e) {
      console.error(e);
    }

  }

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
<Stack spacing={2}>
    <button {...getRootProps()} disabled={uploading} style={{
      background: '#f9f7f6', textAlign: "center", padding: "248px", marginTop: "100px",
      border: "2px dotted #2b2b2b", 

    }}>
      <h1>Upload{uploading && "ing"} documents for property: {props.propertyTitle}</h1>
      <input {...getInputProps()} />
      {
        isDragActive && !uploading ?
          <p>Drop files here ...</p> :
          <p>Drag files here, or click to select</p>
        }
    </button>

      {uploading && <CircularWithValueLabel  />}

      </Stack>
        )
}

interface UploadProps {
  propertyTitle: string
  goNext: Function
}


export const Upload = (props: UploadProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const propTitle = searchParams.get('propertyTitle');
  console.log('upload prop title', propTitle);

  console.log(props.propertyTitle)

  return (
    <div >
      <Dropzone goNext={props.goNext} propertyTitle={propTitle||props.propertyTitle} />
    </div>
  );
};
  
