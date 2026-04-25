import React, { useState, useEffect } from 'react'
import { Button, Container, Row, Col, Form } from 'react-bootstrap'
import Title from '../components/Title'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { createProfile, getProfile } from '../features/profile/profileSlice'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
    const { user } = useAppSelector((state) => state.auth)
    const { profile } = useAppSelector((state) => state.profile)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        linkedIn: ''
    })

    useEffect(() => {
        dispatch(getProfile())
    }, [dispatch])

    useEffect(() => {
        const p = Array.isArray(profile) ? profile[0] : profile
        setFormData({
            name: p?.name || user?.name || '',
            email: p?.email || user?.email || '',
            phone: p?.phone || '',
            location: p?.location || '',
            linkedIn: p?.linkedIn || ''
        })
    }, [profile, user])

    const { name, email, phone, location, linkedIn } = formData

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await dispatch(createProfile({ name, email, phone, location, linkedIn }))
        navigate('/')
    }

    return (
        <Container>
            <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
            <Title title={profile ? 'Edit Profile' : 'Add Profile'} />
            <Form onSubmit={handleSubmit}>
                {[
                    { id: 'formName', label: 'Name *', type: 'text', name: 'name', value: name, required: true },
                    { id: 'formPhone', label: 'Phone *', type: 'text', name: 'phone', value: phone, required: true },
                    { id: 'formEmail', label: 'Email', type: 'email', name: 'email', value: email, required: false },
                    { id: 'formLocation', label: 'Location', type: 'text', name: 'location', value: location, required: false },
                    { id: 'formLinkedIn', label: 'LinkedIn', type: 'text', name: 'linkedIn', value: linkedIn, required: false },
                ].map(({ id, label, type, name: n, value, required }) => (
                    <Form.Group key={id} controlId={id} className="mb-3 d-flex align-items-center">
                        <Form.Label className="mb-0 me-3" style={{ width: 90, minWidth: 90 }}>{label}</Form.Label>
                        <Form.Control type={type} name={n} value={value} onChange={onChange} required={required} />
                    </Form.Group>
                ))}
                <div className="d-flex justify-content-end mt-3">
                    <Button variant="primary" type="submit" style={{ width: 'calc(100% - 92px)' }}
                        disabled={!name || !phone}>
                        {profile ? 'Update' : 'Save'}
                    </Button>
                </div>
            </Form>
            </Col>
            </Row>
        </Container>
    )
}

export default Profile
