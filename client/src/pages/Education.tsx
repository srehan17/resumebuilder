import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Form, Button, Container, Row, Col, Table } from 'react-bootstrap'
import Title from '../components/Title'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { createEducation, getEducation, updateEducation, deleteEducation } from '../features/education/educationSlice'
import { useNavigate, useLocation } from 'react-router-dom'

type EducationForm = {
    _id?: string
    institution: string
    qualification: string
    gpa: string
    startYear: string
    endYear: string
}

const emptyForm: EducationForm = { institution: '', qualification: '', gpa: '', startYear: '', endYear: '' }

const Education = () => {
    const [formData, setFormData] = useState(emptyForm)
    const [isChecked, setIsChecked] = useState(false)
    const [editItem, setEditItem] = useState<EducationForm | null>(null)
    const { institution, qualification, gpa, startYear, endYear } = formData

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { education } = useAppSelector((state) => state.education)

    useEffect(() => {
        dispatch(getEducation())
    }, [dispatch])

    useEffect(() => {
        if (location.state?.editItem) {
            openEdit(location.state.editItem)
        }
    }, [location.state])

    const openEdit = (item: EducationForm) => {
        setEditItem(item)
        setFormData({ institution: item.institution, qualification: item.qualification, gpa: item.gpa ?? '', startYear: item.startYear, endYear: item.endYear ?? '' })
        setIsChecked(!item.endYear)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const cancelEdit = () => {
        setEditItem(null)
        setFormData(emptyForm)
        setIsChecked(false)
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!isChecked && endYear && parseInt(startYear) > parseInt(endYear)) {
            toast.error('Start year cannot be greater than end year')
            return
        }
        const data = { ...formData, endYear: isChecked ? '' : endYear }
        if (editItem?._id) {
            await dispatch(updateEducation({ id: editItem._id, data }))
        } else {
            await dispatch(createEducation(data))
        }
        setFormData(emptyForm)
        setEditItem(null)
        setIsChecked(false)
        navigate('/')
    }

    return (
        <Container>
            <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
            <Title title={editItem ? 'Edit Education' : 'Add Education'} />
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formInstitution" className="mb-3 d-flex align-items-center">
                    <Form.Label className="mb-0 me-3" style={{ width: 100, minWidth: 100 }}>Institution <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="institution" value={institution} onChange={onChange} required />
                </Form.Group>
                <Form.Group controlId="formQualification" className="mb-3 d-flex align-items-center">
                    <Form.Label className="mb-0 me-3" style={{ width: 100, minWidth: 100 }}>Qualification <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="qualification" value={qualification} onChange={onChange} required />
                </Form.Group>
                <Form.Group controlId="formGpa" className="mb-3 d-flex align-items-center">
                    <Form.Label className="mb-0 me-3" style={{ width: 100, minWidth: 100 }}>GPA</Form.Label>
                    <Form.Control type="text" name="gpa" value={gpa} onChange={onChange} />
                </Form.Group>
                <Form.Group className="mb-3 d-flex align-items-center">
                    <Form.Label className="mb-0 me-3" style={{ width: 100, minWidth: 100 }}>Years <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="startYear" placeholder="Start" value={startYear} onChange={onChange} className="me-2" required />
                    <Form.Control type="text" name="endYear" placeholder="End" value={endYear} onChange={onChange} disabled={isChecked} required={!isChecked} />
                </Form.Group>
                <div className="mb-3 d-flex align-items-center">
                    <div style={{ width: 100, minWidth: 100 }} />
                    <Form.Check type="checkbox" label="Graduated" checked={isChecked} onChange={() => setIsChecked(!isChecked)} className="ms-3" />
                </div>
                <div className="d-flex align-items-center gap-2">
                    <div style={{ width: 100, minWidth: 100 }} />

                    <Button variant="primary" type="submit" className="flex-grow-1 ms-3"
                        disabled={!institution || !qualification || !startYear || (!isChecked && !endYear)}>
                        {editItem ? 'Update' : 'Add'}
                    </Button>
                    {editItem && <Button variant="secondary" type="button" onClick={cancelEdit}>Cancel</Button>}
                </div>
            </Form>

            {education.length > 0 && (
                <>
                    <h5 className="mt-5">Added Education</h5>
                    <Table striped size="sm" className="mt-2">
                        <thead>
                            <tr>
                                <th>Institution</th>
                                <th>Qualification</th>
                                <th>Years</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {education.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.institution}</td>
                                    <td>{item.qualification}</td>
                                    <td>{item.startYear}{item.endYear ? ` – ${item.endYear}` : ''}</td>
                                    <td><Button variant="outline-primary" size="sm" onClick={() => openEdit(item as EducationForm)}>Edit</Button></td>
                                    <td><Button variant="danger" size="sm" onClick={() => dispatch(deleteEducation(item._id!))}>Delete</Button></td>
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

export default Education
