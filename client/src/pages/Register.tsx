import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { register, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { BsPerson, BsEnvelope, BsLockFill } from 'react-icons/bs'
import './auth.css'

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', password2: ''
    })
    const { name, email, password, password2 } = formData

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const { user, isLoading, isError, isSuccess, message } = useAppSelector(
        (state) => state.auth
    )

    useEffect(() => {
        if (isError) toast.error(message)
        if (isSuccess || user) navigate('/')
        return () => { dispatch(reset()) }
    }, [user, isError, isSuccess, message, navigate, dispatch])

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (password !== password2) {
            toast.error('Passwords do not match')
            return
        }
        dispatch(register({ name, email, password }))
    }

    if (isLoading) return <Spinner />

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="auth-input-group">
                        <BsPerson className="auth-icon" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={name}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="auth-input-group">
                        <BsEnvelope className="auth-icon" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="auth-input-group">
                        <BsLockFill className="auth-icon" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="auth-input-group">
                        <BsLockFill className="auth-icon" />
                        <input
                            type="password"
                            name="password2"
                            placeholder="Confirm your password"
                            value={password2}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-submit-btn">Register</button>
                </form>
                <p className="auth-link">
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </div>
        </div>
    )
}

export default Register
