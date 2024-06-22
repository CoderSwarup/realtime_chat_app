// import React, { useCallback } from "react";
// import { useDropzone } from "react-dropzone";
// import { Button } from "@chakra-ui/react";

// const FileUpload = ({ onFileUpload }) => {
//   const onDrop = useCallback(
//     (acceptedFiles) => {
//       // Do something with the files, e.g., upload them
//       onFileUpload(acceptedFiles);
//     },
//     [onFileUpload]
//   );

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

//   return (
//     <div {...getRootProps()}>
//       <input {...getInputProps()} />

//       <Button colorScheme="black" border="1px" borderColor="gray.200" w="100%">
//         Select Files
//       </Button>
//     </div>
//   );
// };

// export default FileUpload;

import React, { useCallback } from "react";
import { Button } from "@chakra-ui/react";
import { CloudinaryContext } from "cloudinary-react";

const FileUpload = ({ onFileUpload /* setLoading */ }) => {
  const openUploadWidget = () => {
    // setLoading(true);
    cloudinary.openUploadWidget(
      {
        cloudName: import.meta.env.VITE_REACT_APP_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_REACT_APP_CLOUDINARY_UPLOAD_PRESET,
        folder: "chatapp", // Specify the folder name
        sources: [
          "local",
          "url",
          "camera",
          "image_search",
          "facebook",
          "instagram",
        ],
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          // Handle the uploaded file
          // console.log(result);
          // console.log(result?.info?.url);
          if (result?.info?.url) {
            onFileUpload(result?.info?.url);
          }
        }
      }
    );
    // setLoading(false);
  };

  return (
    <div>
      <Button
        colorScheme="black"
        border="1px"
        borderColor="gray.200"
        w="100%"
        onClick={openUploadWidget}
      >
        Select Files
      </Button>
    </div>
  );
};

export default FileUpload;
