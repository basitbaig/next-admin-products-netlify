'use client'

import { useFormState, useFormStatus } from "react-dom"
import { deleteProduct } from "@/lib/actions"
import { useEffect, useRef } from "react"
import toast from 'react-hot-toast'

export default function DeleteForm({
    _id,
    name,
}: {
    _id: string
    name: string
}) {
    const { pending } = useFormStatus()
    return (
        <form
          action={async (formdata) => {
            const res = await deleteProduct(formdata)
            toast(res.message)
          }}
        > 
          <input type="hidden" name="_id" value={_id} />
          <input type="hidden" name="name" value={name} />
          <button type="submit" disabled={pending} className="btn btn-ghost">
            Delete
          </button>
        </form>
    )
}