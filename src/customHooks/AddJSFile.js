import { useEffect } from "react"; 

function AddJSFile(filesrc){
    useEffect(()=>{
        const script = document.createElement('script');
        script.src = filesrc;
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, [filesrc]);
}

export default AddJSFile;