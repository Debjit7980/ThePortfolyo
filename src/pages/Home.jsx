import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Timeline from '../components/Timeline';
import Testimonial from '../components/Testimonial';
import Contact from '../components/Contact';
import Loading from '../components/Loading';
import CustomCursor from '../components/CustomCursor';
function Home() {
    const params = useParams();
    const navigate = useNavigate();
    
    const userId = '65b3a22c01d900e96c4219ae'; //John doe

    const BASE_URL = 'https://portfolio-backend-30mp.onrender.com/api/v1';

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        document.cookie = `portfolio-name=portfolio1`;
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/get/user/${params?.user ?? userId}`);

                const userData = await response.json();
                console.log(JSON.stringify(userData, null, 2))
                document.title = `${userData?.user?.about?.name + ' - ' + userData?.user?.about?.title}`;
                setUser(userData?.user);
                setTimeout(() => {
                    setIsLoading(false);
                    document.body.classList.remove('loaded');
                }, 3000);
                // setIsLoading(false);
                // document.body.classList.remove('loaded');
            } catch (error) {
                navigate('/');
                setIsLoading(true);
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [params?.user, userId, navigate]);
    console.log(user);


// filtering all the data from the API
    const sortedFilteredSkills = user?.skills?.filter((item) => item.enabled)?.sort((a, b) => a.sequence - b.sequence);
    const sortedFilteredProject = user?.projects?.filter((item) => item.enabled)?.sort((a, b) => a.sequence - b.sequence);
    const filteredServices = user?.services?.filter((item) => item.enabled);
    const filteredTestimonials = user?.testimonials?.filter((item) => item.enabled);
    const filteredSocialHandles = user?.social_handles?.filter((item) => item.enabled);
    const filteredEducation = user?.timeline?.filter((item) => item.forEducation && item.enabled);
    const filteredExperience = user?.timeline?.filter((item) => !item.forEducation && item.enabled);

    if (isLoading) {
        return (
            <>
                <Loading/>
            </>
        )
    }
    //<div className="w-full h-screen bg-gradient-to-b from-[#111132] to-[#0c0c1d] ">LOADING...</div>;
    return (
        <>
            <CustomCursor/>
            <section id="Home"><Header socialHandles={filteredSocialHandles}/></section>
            <section><Hero about={user?.about}/></section>
            <section id="About"><About about={user?.about}/></section>
            <section id="Skills"><Skills skills={sortedFilteredSkills}/></section>
            <section id="Projects"><Projects  projects={sortedFilteredProject} /></section>
            <section id="Services"><Services services={filteredServices}/></section>
            <section id="Timeline"><Timeline edu={filteredEducation} exp={filteredExperience}/></section>
            <section id="Testimonials" ><Testimonial reviews={filteredTestimonials}/></section>
            <section id="Contact"><Contact about={user?.about}/></section> 
        </>
    );
}

export default Home;
