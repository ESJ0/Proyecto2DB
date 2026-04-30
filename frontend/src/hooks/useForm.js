import { useState } from 'react'

export default function useForm(initialValues) {
    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setValues(prev => ({...prev, [name]: value }))
            // Limpiar error del campo cuando el usuario escribe
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: null }))
        }
    }

    const reset = (newValues = initialValues) => {
        setValues(newValues)
        setErrors({})
    }

    const validate = (rules) => {
        const newErrors = {}
        for (const [field, rule] of Object.entries(rules)) {
            const error = rule(values[field], values)
            if (error) newErrors[field] = error
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    return { values, errors, handleChange, reset, validate, setValues }
}