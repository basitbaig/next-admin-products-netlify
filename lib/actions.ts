'use server'
import { setTimeout } from "timers/promises"
import { revalidatePath } from "next/cache"
import ProductModel from "./product-model"
import dbConnect from "./dbConnect"
import { z } from 'zod'

export async function createProduct(prevState: any, formData: FormData) {
    const schema = z.object({
        name: z.string().min(3),
        image: z.string().min(1),
        price: z.number().min(1),
        rating: z.number().min(1).max(3),
    })

    const parse = schema.safeParse({
        name: formData.get('name'),
        image: formData.get('image'),
        price: Number(formData.get('price')),
        rating: Math.ceil(Math.random() * 5),        
    })

    if(!parse.success) {
        console.log(parse.error)
        return { message: 'Form data is not valid' }
    }

    const data = parse.data
    try {
        await dbConnect()
        const product = new ProductModel(data)
        await product.save()
        revalidatePath('/')
        return { message: `Created product ${data.name}` }

    } catch (error) {
        return { message: 'Failed to create product' }
    }
}

export async function deleteProduct(formData: FormData){
    const schema = z.object({
        _id: z.string().min(1),
        name: z.string().min(1),
    })
    const data = schema.parse({
        _id: formData.get('_id'),
        name: formData.get('name'),
    })

    try {
        await dbConnect()
        await ProductModel.findOneAndDelete({_id: data._id})
        revalidatePath('/')
        console.log({ message: `Deleted product ${data.name}`})
        return { message: `Deleted product ${data.name}`}
    } catch (error) {
        return { message: 'Faild to delete product' }
    }
}

export async function findProduct(_pid: any){
    const schema = z.object({
        _id: z.string().min(1),
    })

     const data = schema.parse({
        _id: _pid,
    })

    try {
        await dbConnect()
        const prodData = await ProductModel.findOne({_id: data._id})
        //await setTimeout(3000);
        const proddata = JSON.parse(JSON.stringify(prodData))

        return { ...proddata }
    } catch (error) {
        return { message: 'Failed to find product' }
    }
}
 //revalidatePath('/')


export async function updateProduct(prevState: any, formData: FormData){
    const schema = z.object({
        _id: z.string().min(1),
        name: z.string().min(3),
        image: z.string().min(1),
        price: z.number().min(1),
        rating: z.number().min(1).max(3),
    })

    const parse = schema.safeParse({
        _id: formData.get('_id'),
        name: formData.get('name'),
        image: formData.get('image'),
        price: Number(formData.get('price')), 
        rating: Math.ceil(Math.random() * 5),        
    })
 
    if(!parse.success) {
        console.log(parse.error)
        return { message: 'Form data is not valid' }
    }
    else
    {
        const data = parse.data
        try {         
            await dbConnect()
            await ProductModel.findOneAndUpdate({_id: data._id},data)
            revalidatePath('/')
            console.log({ message: `Updated product ${data.name}`})
            return { message: `Updated product ${data.name}`}
        } catch (error) {
            return { message: 'Fail to update product' }
        }

        
    }


}

