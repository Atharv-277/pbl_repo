import axios from 'axios';

export const API_BASE_ROOT = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
export const API_BASE_URL = import.meta.env.VITE_API_URL || `${API_BASE_ROOT}/api`;

// Axios instance - deployment ready
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            // Only redirect to login if we're not already on a public page
            const publicPages = ['/', '/login', '/register', '/contact'];
            const currentPath = window.location.pathname;
            if (!publicPages.includes(currentPath)) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// API calls
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

export const doctorAPI = {
    getMyPatients: () => api.get('/doctors/patients'),
    getMyReviews: () => api.get('/doctors/reviews'),
    getAllDoctors: () => api.get('/doctors'),
    deleteMyPatientRecord: (patientId) => api.delete(`/doctors/patients/${patientId}`),
    getMyBlockedSlots: () => api.get('/doctors/blocked-slots'),
    addBlockedSlot: (slotData) => api.post('/doctors/blocked-slots', slotData),
    deleteBlockedSlot: (slotId) => api.delete(`/doctors/blocked-slots/${slotId}`),
};

export const patientAPI = {
    getDashboard: () => api.get('/patients/dashboard'),
    assignDoctor: (doctorId) => api.patch('/patients/assignDoctor', { doctorId }),
    getProfile: () => api.get('/patients/profile'),
};

export const appointmentAPI = {
    createAppointment: (appointmentData) => api.post('/appointments', appointmentData),
    getDoctorAppointments: (doctorId) => api.get(`/appointments/doctor/${doctorId}`),
    getPatientAppointments: (patientId) => api.get(`/appointments/patient/${patientId}`),
    getDoctorDashboard: () => api.get('/appointments/doctor-dashboard'),
    getMyAppointments: () => api.get('/appointments/my-appointments'),
    getMyPatientAppointments: () => api.get('/appointments/my-patient-appointments'),
    testPatientData: () => api.get('/appointments/test-patient-data'),
    updateAppointmentStatus: (id, updateData) => api.patch(`/appointments/${id}/status`, updateData),
};

export const reviewAPI = {
    createReview: (reviewData) => api.post('/reviews', reviewData),
    getDoctorReviews: (doctorId) => api.get(`/reviews/doctor/${doctorId}`),
};

export default api;

