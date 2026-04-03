import React from 'react'
import Navbar from "../../src/Navbar"
import HeroSection from './components/Hero'
import ResultsInNumbers from './components/Results'
import DoctorSearchForm from './components/DoctorSearch'
import DoctorProfileCard from './components/Doctor'
import Services from './components/Services'
import Footer from '../Footer'

const Dashboard = () => {
  return (
    <div>
      <Navbar></Navbar>
      <HeroSection></HeroSection>
      <ResultsInNumbers></ResultsInNumbers>
      {/*<DoctorSearchForm></DoctorSearchForm>*/}
      <DoctorProfileCard></DoctorProfileCard>
      <Services></Services>
      <Footer></Footer>
    </div>
  )
}

export default Dashboard
