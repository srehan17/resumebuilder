import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Form, Button, Container, Row, Col, Table } from 'react-bootstrap'
import Title from '../components/Title'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { createExperience, getExperience, updateExperience, deleteExperience } from '../features/experience/experienceSlice'
import { useNavigate, useLocation } from 'react-router-dom'

type ExperienceForm = {
    _id?: string
    company: string
    position: string
    responsibilities: string
    startYear: string
    endYear: string
}

const emptyForm: ExperienceForm = { company: '', position: '', responsibilities: '', startYear: '', endYear: '' }

const Experience = () => {
    const [formData, setFormData] = useState(emptyForm)
    const [isCurrentJob, setIsCurrentJob] = useState(false)
    const [editItem, setEditItem] = useState<ExperienceForm | null>(null)
    const { company, position, responsibilities, startYear, endYear } = formData

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { experience } = useAppSelector((state) => state.experience)

    useEffect(() => {
        dispatch(getExperience())
    }, [dispatch])

    useEffect(() => {
        if (location.state?.editItem) {
            openEdit(location.state.editItem)
        }
    }, [location.state])

    const openEdit = (item: ExperienceForm) => {
        setEditItem(item)
        setFormData({ company: item.company, position: item.position, responsibilities: item.responsibilities ?? '', startYear: item.startYear, endYear: item.endYear ?? '' })
        setIsCurrentJob(!item.endYear)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const cancelEdit = () => {
        setEditItem(null)
        setFormData(emptyForm)
        setIsCurrentJob(false)
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!isCurrentJob && endYear && parseInt(startYear) > parseInt(endYear)) {
            toast.error('Start year cannot be greater than end year')
            return
        }
        const data = { ...formData, endYear: isCurrentJob ? '' : endYear }
        if (editItem?._id) {
            await dispatch(updateExperience({ id: editItem._id, data }))
        } else {
            await dispatch(createExperience(data))
        }
        setFormData(emptyForm)
        setEditItem(null)
        setIsCurrentJob(false)
        navigate('/')
    }

    return (
        <Container>
            <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
            <Title title={editItem ? 'Edit Experience' : 'Add Experience'} />
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formCompany" className="mb-3 d-flex align-items-center">
                    <Form.Label className="mb-0 me-3" style={{ width: 130, minWidth: 130 }}>Company <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="company" value={company} onChange={onChange} required />
                </Form.Group>
                <Form.Group controlId="formPosition" className="mb-3 d-flex align-items-center">
                    <Form.Label className="mb-0 me-3" style={{ width: 130, minWidth: 130 }}>Position <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="position" value={position} onChange={onChange} required />
                </Form.Group>
                <Form.Group controlId="formResponsibilities" className="mb-3 d-flex align-items-start">
                    <Form.Label className="mb-0 me-3 pt-2" style={{ width: 130, minWidth: 130 }}>Responsibilities</Form.Label>
                    <Form.Control as="textarea" rows={3} name="responsibilities" value={responsibilities} onChange={onChange} />
                </Form.Group>
                <Form.Group className="mb-3 d-flex align-items-center">
                    <Form.Label className="mb-0 me-3" style={{ width: 130, minWidth: 130 }}>Years <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="startYear" placeholder="Start" value={startYear} onChange={onChange} className="me-2" required />
                    <Form.Control type="text" name="endYear" placeholder="End" value={endYear} onChange={onChange} disabled={isCurrentJob} required={!isCurrentJob} />
                </Form.Group>
                <div className="mb-3 d-flex align-items-center">
                    <div style={{ width: 130, minWidth: 130 }} />
                    <Form.Check type="checkbox" label="Current Job" checked={isCurrentJob} onChange={() => setIsCurrentJob(!isCurrentJob)} className="ms-3" />
                </div>
                <div className="d-flex align-items-center gap-2">
                    <div style={{ width: 146, minWidth: 146 }} />
                    <Button variant="primary" type="submit" className="flex-grow-1"
                        disabled={!company || !position || !startYear || (!isCurrentJob && !endYear)}>
                        {editItem ? 'Update' : 'Add'}
                    </Button>
                    {editItem && <Button variant="secondary" type="button" onClick={cancelEdit}>Cancel</Button>}
                </div>
            </Form>

            {experience.length > 0 && (
                <>
                    <h5 className="mt-5">Added Experience</h5>
                    <Table striped size="sm" className="mt-2">
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Position</th>
                                <th>Years</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {experience.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.company}</td>
                                    <td>{item.position}</td>
                                    <td>{item.startYear}{item.endYear ? ` – ${item.endYear}` : ' – Present'}</td>
                                    <td><Button variant="outline-primary" size="sm" onClick={() => openEdit(item as ExperienceForm)}>Edit</Button></td>
                                    <td><Button variant="danger" size="sm" onClick={() => dispatch(deleteExperience(item._id!))}>Delete</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}
            </Col>
            </Row>
        </Container>
    )
}

export default Experience
