import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { BsEnvelope, BsLockFill } from 'react-icons/bs'
import './auth.css'

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const { email, password } = formData

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
        dispatch(login({ email, password }))
    }

    if (isLoading) return <Spinner />

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
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
                            placeholder="Enter your password"
                            value={password}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-submit-btn">Login</button>
                </form>
                <p className="auth-link">
                    Don't have an account? <a href="/register">Sign up now</a>
                </p>
            </div>
        </div>
    )
}

export default Login
