import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@chakra-ui/react";

const FileUpload = ({ onFileUpload }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      // Do something with the files, e.g., upload them
      onFileUpload(acceptedFiles);
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />

      <Button colorScheme="black" border="1px" borderColor="gray.200" w="100%">
        Select Files
      </Button>
    </div>
  );
};

export default FileUpload;
