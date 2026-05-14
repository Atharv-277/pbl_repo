import axios from 'axios';

export const API_BASE_ROOT =
    import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

export const API_BASE_URL =
    import.meta.env.VITE_API_URL || (API_BASE_ROOT ? `${API_BASE_ROOT}/api` : '/api');

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_BASE_URL) {
    console.warn('[api] VITE_API_URL or VITE_API_BASE_URL is not set. Falling back to /api.');
}

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
            const publicPages = ['/', '/login', '/register', '/contact', '/service'];
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
    registerWithFile: (formData) => api.post('/auth/register', formData),
};

export const doctorAPI = {
    getMyPatients: () => api.get('/doctors/patients'),
    getMyReviews: () => api.get('/doctors/reviews'),
    getAllDoctors: () => api.get('/doctors'),
    deleteMyPatientRecord: (patientId) => api.delete(`/doctors/patients/${patientId}`),
    getMyBlockedSlots: () => api.get('/doctors/blocked-slots'),
    addBlockedSlot: (slotData) => api.post('/doctors/blocked-slots', slotData),
    deleteBlockedSlot: (slotId) => api.delete(`/doctors/blocked-slots/${slotId}`),
    uploadProfilePhoto: (formData) => api.put('/doctors/profile-photo', formData),
};

export const patientAPI = {
    getDashboard: () => api.get('/patients/dashboard'),
    assignDoctor: (doctorId) => api.patch('/patients/assignDoctor', { doctorId }),
    getProfile: () => api.get('/patients/profile'),
    uploadProfilePhoto: (formData) => api.put('/patients/profile-photo', formData),
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

export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getPendingDoctors: () => api.get('/admin/pending-doctors'),
    getAllDoctors: () => api.get('/admin/doctors'),
    approveDoctor: (doctorId) => api.patch(`/admin/doctors/${doctorId}/approve`),
    rejectDoctor: (doctorId) => api.patch(`/admin/doctors/${doctorId}/reject`),
};

export default api;

