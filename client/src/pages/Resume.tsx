import { useEffect } from 'react'
import { Container, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { BsEnvelope, BsTelephone, BsGeoAlt, BsLinkedin } from 'react-icons/bs'
import { getProfile } from '../features/profile/profileSlice'
import { getExperience } from '../features/experience/experienceSlice'
import { getEducation } from '../features/education/educationSlice'
import Spinner from '../components/Spinner'

const Resume = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { user } = useAppSelector((state) => state.auth)
    const { profile, isLoadingProfile } = useAppSelector((state) => state.profile)
    const { experience, isLoadingExperience } = useAppSelector((state) => state.experience)
    const { education, isLoadingEducation } = useAppSelector((state) => state.education)

    useEffect(() => {
        dispatch(getProfile())
        dispatch(getExperience())
        dispatch(getEducation())
    }, [dispatch])

    if (isLoadingProfile || isLoadingExperience || isLoadingEducation) return <Spinner />

    const profileData = Array.isArray(profile) ? profile[0] : profile

    return (
        <Container className="py-4" style={{ maxWidth: 620 }}>
            <div className="d-flex justify-content-end mb-4">
                <Button variant="outline-secondary" size="sm" onClick={() => navigate('/')}>← Back</Button>
            </div>

            <div className="bg-white border rounded p-4">

                {/* Header */}
                <div className="mb-4 pb-3 border-bottom text-center">
                    <h2 className="mb-2">{profileData?.name || user?.name}</h2>
                    <div className="d-flex flex-wrap justify-content-center gap-3 text-muted small">
                        {(profileData?.email || user?.email) && (
                            <span><BsEnvelope className="me-1" />{profileData?.email || user?.email}</span>
                        )}
                        {profileData?.phone && (
                            <span><BsTelephone className="me-1" />{profileData.phone}</span>
                        )}
                        {profileData?.location && (
                            <span><BsGeoAlt className="me-1" />{profileData.location}</span>
                        )}
                        {profileData?.linkedIn && (
                            <span><BsLinkedin className="me-1" />{profileData.linkedIn}</span>
                        )}
                    </div>
                </div>

                {/* Experience */}
                {experience.length > 0 && (
                    <div className="mb-4">
                        <h5 className="text-uppercase fw-bold mb-3" style={{ letterSpacing: 1, fontSize: '0.8rem' }}>Experience</h5>
                        <div className="d-flex flex-column gap-3">
                            {experience.map((item) => (
                                <div key={item._id}>
                                    <div>
                                        <strong>{item.company}</strong>
                                        <span className="text-muted small ms-2">{item.startYear} – {item.endYear || 'Present'}</span>
                                    </div>
                                    <div className="text-muted">{item.position}</div>
                                    {item.responsibilities && (
                                        <div className="small mt-1" style={{ whiteSpace: 'pre-wrap' }}>{item.responsibilities}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {experience.length > 0 && education.length > 0 && <hr className="my-3" style={{ borderColor: '#dee2e6', opacity: 1 }} />}
                {education.length > 0 && (
                    <div>
                        <h5 className="text-uppercase fw-bold mb-3" style={{ letterSpacing: 1, fontSize: '0.8rem' }}>Education</h5>
                        <div className="d-flex flex-column gap-3">
                            {education.map((item) => (
                                <div key={item._id}>
                                    <div>
                                        <strong>{item.institution}</strong>
                                        <span className="text-muted small ms-2">{item.startYear}{item.endYear ? ` – ${item.endYear}` : ''}</span>
                                    </div>
                                    <div className="text-muted">{item.qualification}</div>
                                    {item.gpa && <div className="small">GPA: {item.gpa}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </Container>
    )
}

export default Resume
