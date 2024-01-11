'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function FileUpload() {
    const [file, setFile] = useState();
 
    const onSubmit = async (e: any) => {
        e.preventDefault()
       
        if (!file) return

        //console.log(file)

        try {
            const data = new FormData()
            data.set('file',file)

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data
            });
            // handle the error
            if (!res.ok) throw new Error(await res.text())
            if (res.ok) toast('File Upload Successfully')
             

        } catch (e: any) {
            // show the error here
            console.error(e)
        }
    } 
     
    return (
         
           <form onSubmit={onSubmit}>
            <input 
              type='file' 
              name='file' 
              accept="images/*"
              onChange={(e) => setFile(e.target.files?.[0] as any) } 
            />
            <button type="submit">Upload</button>
           </form>
         
    )
}
