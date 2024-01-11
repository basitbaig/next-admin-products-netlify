import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse} from 'next/server'
import { join } from  'path'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file)
    {
        return NextResponse.json({ success: false})        
    }

    console.log(file);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes)

    //With the file data in the buffer, you can do whatever you want with it.
    //for this, we'll just write it to the filesystem in a new location

    const path = join('./', 'public/images', file.name)

    //const path =`./public/images/${file.name}`

    await writeFile(path, buffer)
    console.log(`open ${path} to see the uploaded file`)

    return NextResponse.json({ success: true})

}