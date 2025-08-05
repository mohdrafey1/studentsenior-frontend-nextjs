import { FAQ } from "@/utils/interface";

export const GROUPS_PAGE_SIZE = 9;
export const OPPORTUNITIES_PAGE_SIZE = 9;
export const SEARCH_DEBOUNCE = 1000;
export const LOST_FOUND_PAGE_SIZE = 9;
export const STORE_PAGE_SIZE = 9;
export const SENIOR_PAGE_SIZE = 12;
export const PYQ_PAGE_SIZE = 12;

export const faqs: FAQ[] = [
    {
        question: "What is Student Senior?",
        answer: "Student Senior is a comprehensive platform that connects college students for mentorship...",
        category: "General",
    },
    {
        question: "How do I register?",
        answer: "Registration is simple and free! Click on the 'Sign Up' button on our homepage and fill out the registration form with your college email, basic details, and academic information. You'll receive a verification email to confirm your account. Once verified, you can immediately start accessing resources, connecting with seniors, and participating in our community.",
        category: "Account",
    },
    {
        question: "Can anyone add a college?",
        answer: "Only verified registered users can add colleges to ensure authenticity and maintain data quality. We have a verification process where we check the legitimacy of the college and the user's association with it. This helps us maintain a trusted network of authentic educational institutions.",
        category: "General",
    },
    {
        question: "Is there a fee to use Student Senior?",
        answer: "No, Student Senior is completely free for students! We believe education and mentorship should be accessible to everyone. All core features including PYQ access, senior mentorship, community discussions, and resource sharing are available at no cost. Our student store operates on a peer-to-peer basis with no platform fees.",
        category: "Pricing",
    },
    {
        question: "How do I contact support?",
        answer: "We offer multiple ways to get help! You can reach us through our 'Contact Us' page, email us directly at studentsenior.help@gmail.com, or use our in-app chat support. Our team typically responds within 24 hours during business days. For urgent issues, please mention 'URGENT' in your subject line.",
        category: "Support",
    },
    {
        question: "How can I become a mentor?",
        answer: "To become a mentor, you need to be in your final year or have graduated. Simply apply through your profile settings, provide your academic credentials, and tell us about your areas of expertise. Our team will review your application and approve qualified mentors within 3-5 business days.",
        category: "Mentorship",
    },
    {
        question: "Are the PYQ papers verified?",
        answer: "Yes! All PYQ papers are verified by our team of academic experts and senior students. We ensure they are authentic, properly formatted, and from legitimate sources. Each paper includes metadata about the exam year, subject, and difficulty level to help you prepare effectively.",
        category: "Resources",
    },
];

export const rawColleges = [
    {
        _id: "66cb9952a9c088fc11800714",
        name: "Integral University",
        description:
            '"Integral University Lucknow: Fostering holistic education, research, and growth. Explore diverse programs in engineering, sciences, arts, humanities, and management. State-of-the-art infrastructure, esteemed faculty, and vibrant campus life nurture potential, bridging theory and practice."',
        location: "Lucknow, Uttar Pradesh, India",
        status: true,
        slug: "integral-university",
    },
    {
        _id: "66cba84ce0e3a7e528642837",
        name: "MPEC Kanpur",
        description:
            '"Maharana Pratap Engineering College Kanpur: Fostering innovative minds through comprehensive education. Offering undergraduate and postgraduate programs in:\r\n\r\n- Computer Science\r\n- Mechanical\r\n- Electrical\r\n- Civil\r\n- Electronics\r\n\r\nState-of-the-art infrastructure, industry partnerships, and esteemed faculty ensure holistic development, shaping future engineers."',
        location: "Kanpur, Uttar Pradesh, India",
        status: true,
        slug: "mpec-kanpur",
    },
];
