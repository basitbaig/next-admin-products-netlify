'use client'
import { cache } from 'react'

import { useFormState, useFormStatus } from "react-dom"
import { updateProduct, findProduct } from "@/lib/actions"
import { useEffect, useRef, useState,useId } from "react"
import { useTransition } from "react"
import toast from 'react-hot-toast'
import FileUpload from "./FileUpload"

export default function UpdateForm({
    _id,
}: {
    _id: string
}) {


    const id = useId();
    console.log(id);
    

    const [state, formAction] = useFormState(updateProduct, {
        message: '',
    })

    const [isPending, startTransition] = useTransition();

    const { pending } = useFormStatus()

    const ref = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (state.message.indexOf('Updated product') === 0) {
            (document.getElementById(id) as any).close();
            ref.current?.reset()
            toast(state.message)
        }
        else if (state.message) {
            toast(state.message)
        }
    }, [state.message])


    const initialValues = {                   // type all the fields you need
        name: '',
        image: '',
        price: '',
        rating: ''
    };

    const [values, setValues] = useState(initialValues);       // set initial state

    const changeHandler = (e: any) => {
        e.preventDefault();

        setValues(values => {
            return { ...values, [e.target.name]: e.target.value }
        })
    }
 
    const handleUpdateCall = cache(async () => {

        const res = await findProduct(_id)

        //console.log({ ...res });

        setValues(values => {
            return { ...values, ...res }
        })

    })
 
    return (
        <>
            <div>

                <form action={handleUpdateCall}>                   
                    <button type="submit" disabled={pending} className="btn btn-ghost"
                        onClick={() => startTransition(() => (document.getElementById(id)! as any).showModal())}
                    >
                        {isPending ? "Call Update..." : "Update"}

                    </button>
                </form>

                <div>
                    <dialog id={id} className="modal">
                        <div className="modal-box">
                            <h2 className="text-2xl font-bold pm-4">Update Product</h2>

                            <FileUpload />

                            <form ref={ref} action={formAction}>
                                
                                <input type="hidden" name="_id" value={_id} />
                                <div className="form-control w-full max-w-xs py-4">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="input input-bordered w-full max-w-xs"
                                        value={values.name}
                                        onChange={changeHandler}
                                        placeholder="Enter Image Name"
                                        required
                                    />
                                </div>
                                <div className="form-control w-full max-w-xs py-4">
                                    <label htmlFor="image">Image</label>
                                    <input
                                        type="text"
                                        id="image"
                                        name="image"
                                        value={values.image}
                                        onChange={changeHandler}
                                        className="input input-bordered w-full max-w-xs"
                                        required
                                    />
                                </div>
                                <div className="form-control w-full max-w-xs py-4">
                                    <label htmlFor="price">Price</label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={values.price}
                                        onChange={changeHandler}
                                        className="input input-bordered w-full max-w-xs"
                                        required
                                    />
                                </div>
                                <button
                                    className="btn btn-primary mr-3"
                                    type="submit"
                                    disabled={pending}
                                >
                                    Save
                                </button>
                                <button
                                    className="btn btn-ghost"
                                    type="button"
                                    onClick={() => (document.getElementById(id) as any).close()}
                                >
                                    Back
                                </button>
                            </form>
                        </div>
                    </dialog>
                </div>

            </div>
        </>
    )

}