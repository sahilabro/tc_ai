import { useState } from "react";

export const Upload = () => {
  // const [files, setFiles] = useState(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('upload')
    if (e?.target?.files) {
        console.log(e.target.files);
        
    }
  };

 
return (
    <form method="post">
      <div>
      <label >Choose file to upload</label>
      <input type="file" onChange={handleFileChange} multiple  accept=".pdf"/>
 
        
      </div>
      <div> 
        <button>Submit</button>
      </div>
  </form>
    
  );
}

