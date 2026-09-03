// Mengimpor library Axios untuk menangani HTTP request berbasis Promise
import axios from 'axios';

// Mendaftarkan instance Axios ke objek global 'window' agar dapat diakses dari mana saja tanpa perlu import ulang
window.axios = axios;

// Menetapkan header default 'X-Requested-With' agar backend Laravel mengenali setiap request sebagai panggilan AJAX / XMLHttpRequest
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';