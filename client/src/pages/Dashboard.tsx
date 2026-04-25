import { useEffect } from 'react'
import { Container, Card, Button } from 'react-bootstrap'
import { BsEnvelope, BsTelephone, BsGeoAlt, BsLinkedin } from 'react-icons/bs'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { getProfile, deleteProfile, reset as resetProfile } from '../features/profile/profileSlice'
import { getExperience, deleteExperience, reset as resetExperience } from '../features/experience/experienceSlice'
import { getEducation, deleteEducation, reset as resetEducation } from '../features/education/educationSlice'

const Dashboard = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { user } = useAppSelector((state) => state.auth)
  const { profile, isLoadingProfile } = useAppSelector((state) => state.profile)
  const { experience, isLoadingExperience } = useAppSelector((state) => state.experience)
  const { education, isLoadingEducation } = useAppSelector((state) => state.education)

  useEffect(() => {
    if (user) {
      dispatch(getProfile())
      dispatch(getExperience())
      dispatch(getEducation())
    }
    return () => {
      dispatch(resetProfile())
      dispatch(resetExperience())
      dispatch(resetEducation())
    }
  }, [user, dispatch])

  if (isLoadingProfile || isLoadingExperience || isLoadingEducation) {
    return <Spinner />
  }

  const profileData = Array.isArray(profile) ? profile[0] : profile

  return (
    <Container className="py-4" style={{ maxWidth: 800 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        {user && <h4 className="mb-0 text-muted">Welcome, {user.name}</h4>}
        <Button variant="primary" size="sm" onClick={() => navigate('/resume')}>Preview Resume</Button>
      </div>

      <section className="mb-4">
        <h6 className="text-uppercase text-muted mb-2 fw-bold" style={{ letterSpacing: 1 }}>Profile</h6>
        <Card className="p-3">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h5 className="mb-1">{profileData?.name || user?.name}</h5>
              <div className="text-muted small mt-1 d-flex flex-column gap-1">
                {(profileData?.email || user?.email) && (
                  <span><BsEnvelope className="me-2" />{profileData?.email || user?.email}</span>
                )}
                {profileData?.phone && (
                  <span><BsTelephone className="me-2" />{profileData.phone}</span>
                )}
                {profileData?.location && (
                  <span><BsGeoAlt className="me-2" />{profileData.location}</span>
                )}
                {profileData?.linkedIn && (
                  <span><BsLinkedin className="me-2" />{profileData.linkedIn}</span>
                )}
              </div>
            </div>
            <Button size="sm" variant="outline-secondary" onClick={() => navigate('/profile')}>Edit</Button>
          </div>
        </Card>
      </section>

      {experience.length > 0 && (
        <section className="mb-4">
          <h6 className="text-uppercase text-muted mb-2 fw-bold" style={{ letterSpacing: 1 }}>Experience</h6>
          <div className="d-flex flex-column gap-2">
            {experience.map((item) => (
              <Card key={item._id} className="p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="d-flex align-items-baseline gap-2">
                      <h6 className="mb-0 fw-bold">{item.company}</h6>
                      <span className="text-muted small">
                        {item.startYear} – {item.endYear || 'Present'}
                      </span>
                    </div>
                    <div className="text-muted">{item.position}</div>
                    {item.responsibilities && (
                      <div className="small mt-1" style={{ whiteSpace: 'pre-wrap' }}>{item.responsibilities}</div>
                    )}
                  </div>
                  <div className="d-flex gap-2 ms-3 flex-shrink-0">
                    <Button size="sm" variant="outline-secondary" onClick={() => navigate('/experience', { state: { editItem: item } })}>Edit</Button>
                    <Button size="sm" variant="outline-danger" onClick={() => dispatch(deleteExperience(item._id!))}>Delete</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-4">
          <h6 className="text-uppercase text-muted mb-2 fw-bold" style={{ letterSpacing: 1 }}>Education</h6>
          <div className="d-flex flex-column gap-2">
            {education.map((item) => (
              <Card key={item._id} className="p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="d-flex align-items-baseline gap-2">
                      <h6 className="mb-0 fw-bold">{item.institution}</h6>
                      <span className="text-muted small">
                        {item.startYear}{item.endYear ? ` – ${item.endYear}` : ''}
                      </span>
                    </div>
                    <div className="text-muted">{item.qualification}</div>
                    {item.gpa && <div className="small mt-1">GPA: {item.gpa}</div>}
                  </div>
                  <div className="d-flex gap-2 ms-3 flex-shrink-0">
                    <Button size="sm" variant="outline-secondary" onClick={() => navigate('/education', { state: { editItem: item } })}>Edit</Button>
                    <Button size="sm" variant="outline-danger" onClick={() => dispatch(deleteEducation(item._id!))}>Delete</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {!profileData && experience.length === 0 && education.length === 0 && (
        <p className="text-muted text-center mt-5">Nothing here yet — use the tabs above to add your details.</p>
      )}
    </Container>
  )
}

export default Dashboard
