import React, { useEffect } from 'react'
import { Button, Container } from 'react-bootstrap'
import Title from '../components/Title'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import Spinner from '../components/Spinner'
import { getProfile } from '../features/profile/profileSlice'
import { getExperience } from '../features/experience/experienceSlice'
import { getEducation } from '../features/education/educationSlice'
import ProfileItem from '../components/ProfileItem'
import ExperienceItem from '../components/ExperienceItem'
import EducationItem from '../components/EducationItem'
import { Table } from 'react-bootstrap'

const Dashboard = () => {

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const { user } = useAppSelector((state) => state.auth)
  const {profile, isLoadingProfile, isErrorProfile, messageProfile} = useAppSelector(
    (state) => state.profile)
  const {experience, isLoadingExperience, isErrorExperience, messageExperience} = useAppSelector(
    (state) => state.experience)
  const {education, isLoadingEducation, isErrorEducation, messageEducation} = useAppSelector(
    (state) => state.education)

  // useEffect(() => {
  //   if (isError) {
  //     console.log(message)
  //   }

  //   dispatch(getExperience())

  //   return () => {
  //     dispatch(reset())
  //   }
  // }, [ user, navigate, isError, message, dispatch])
  
  if (isLoadingEducation || isLoadingExperience) {
    return <Spinner />
  }

  return (
    <Container>
      <Title title="Let's Build Your Resume"/>
      <h2 className="h2">Hello {user ? user.name : "User"}!</h2>
      <div className="mt-5">
        <Button className="btn mx-2" onClick={() => navigate('/profile')}>Add Profile</Button>
        <Button className="btn mx-2" onClick={() => navigate('/experience')}>Add Experience</Button>
        <Button className="btn mx-2" onClick={() => navigate('/education')}>Add Education</Button>
      </div>

      <section className='content-profile'>
        {profile ? (
          <>
          <h4 className='mt-5 text-uppercase'>Profile</h4>
            <Table striped className='profile'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>LinkedIn</th>
                </tr>
              </thead>
              <tbody>
                {profile.map((item) => (
                  <tr key={item._id}><ProfileItem item={item} /></tr>
                ))} 
              </tbody>
            </Table>
            </>
        ) : (
          null
        )}
      </section>
     
      <section className='content-experience'>
        {experience.length > 0 ? (
          <>
          <h4 className='mt-5 text-uppercase'>Experience</h4>
            <Table striped className='experience'>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Responsibilities</th>
                  <th>Start Year</th>
                  <th>End Year</th>
                </tr>
              </thead>
              <tbody>
                {experience.map((item) => (
                  <tr key={item._id}><ExperienceItem item={item} /></tr>
                ))} 
              </tbody>
            </Table>
            </>
        ) : (
          null
        )}
      </section>

      <section className='content-education'>
        {education.length > 0 ? (
          <>
          <h4 className='mt-5 text-uppercase'>Education</h4>
            <Table striped className='education'>
              <thead>
                <tr>
                  <th>Institution</th>
                  <th>Qualification</th>
                  <th>GPA</th>
                  <th>Start Year</th>
                  <th>End Year</th>
                </tr>
              </thead>
              <tbody>
                {education.map((item) => (
                  <tr key={item._id}><EducationItem item={item} /></tr>
                ))} 
              </tbody>
            </Table>
            </>
        ) : (
          null
        )}
      </section>
    </Container>
  )
}

export default Dashboard