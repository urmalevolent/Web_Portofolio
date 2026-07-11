document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // 1. SCROLL ANIMATION (REVEAL)
    // ==========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } 
            else {
                // Remove class 'active' when out of screen to create looping effect
                entry.target.classList.remove('active'); 
            }
        });
    }, {
        threshold: 0.15, 
        rootMargin: "0px 0px 0px 0px"
    });

    const hiddenElements = document.querySelectorAll('.reveal');
    hiddenElements.forEach((el) => observer.observe(el));

    // ==========================================
    // 2. HAMBURGER MENU TOGGLE (MOBILE)
    // ==========================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu when hamburger icon is clicked
    hamburgerBtn.addEventListener('click', () => {
        navMenu.classList.toggle('hidden');
        navMenu.classList.toggle('flex');
    });

    // Automatically close the menu when a link is clicked (Mobile view only)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) { // 768px is the 'md' breakpoint in Tailwind
                navMenu.classList.add('hidden');
                navMenu.classList.remove('flex');
            }
        });
    });

    // ==========================================
    // 3. PROJECT MODAL & IMAGE SLIDER
    // ==========================================
    
    // Data foto dan deskripsi masing-masing project
    const projectData = {
        // Harus sama dengan data-project="balinara" di HTML
        balinara: { 
            title: "BALINARA",
            desc: "A web-based digital platform designed to be your ultimate guide in exploring the captivating beauty of Bali. Features include destination catalog, interactive maps, and cultural insights.",
            images: [
                "image/Balinara/Balinara.png",    // Gambar utama
                "image/Balinara/Detail1.png",     // Ganti dengan nama file foto ke-2 di folder Balinara
                "image/Balinara/Detail2.png",     // Ganti dengan nama file foto ke-3 di folder Balinara
                "image/Balinara/Detail3.png"      // (Opsional) Tambahkan lagi jika ada
            ]
        },
        
        // Harus sama dengan data-project="neptunethrift" di HTML
        neptunethrift: { 
            title: "NEPTUNETHRIFT",
            desc: "A Web-Based Shoe Thrifting E-commerce Catalog System engineered to simplify preloved goods transactions seamlessly. Integrated with secure login and dynamic shopping cart.",
            images: [
                "image/NeptuneThrift/NeptuneThrift.png", // Gambar utama
                "image/NeptuneThrift/Detail1.jpg",       // Ganti dengan nama file foto ke-2 di folder NeptuneThrift
                "image/NeptuneThrift/Detail2.jpg",        // Ganti dengan nama file foto ke-3 di folder NeptuneThrift
                "image/NeptuneThrift/Detail3.jpg"        // Ganti dengan nama file foto ke-3 di folder NeptuneThrift
            ]
        },
        
        // Harus sama dengan data-project="gasngo" di HTML
        gasngo: { 
            title: "GASNGO",
            desc: "A Modern Web-Based Car Rental Information System that streamlines the vehicle fleet management and booking process. Built specifically with scalable database infrastructure.",
            images: [
                "image/GASNGO/GASNGO.png",      // Gambar utama
                "image/GASNGO/Detail1.png",     // Ganti dengan nama file foto ke-2 di folder GASNGO
                "image/GASNGO/Detail2.png",     // Ganti dengan nama file foto ke-3 di folder GASNGO
                "image/GASNGO/Detail3.png",      // Ganti dengan nama file foto ke-4 di folder GASNGO
                "image/GASNGO/Detail4.png"      // Ganti dengan nama file foto ke-5 di folder GASNGO
            ]
        }
    };

    // Variabel state modal
    let currentProjectImages = [];
    let currentImageIndex = 0;

    // Menangkap Element dari DOM (HTML)
    const modal = document.getElementById('project-modal');
    const modalContentBox = document.getElementById('modal-content-box');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalMainImage = document.getElementById('modal-main-image');
    const modalThumbnails = document.getElementById('modal-thumbnails');
    const prevBtn = document.getElementById('modal-prev-btn');
    const nextBtn = document.getElementById('modal-next-btn');
    const closeBtns = document.querySelectorAll('.modal-close-btn');

    // Cek jika HTML modal sudah ditambahkan sebelum menjalankan fungsi (mencegah error di console)
    if (modal) {
        // A. Event Buka Modal saat card project di-klik
        document.querySelectorAll('.project-trigger').forEach(card => {
            card.addEventListener('click', function() {
                const projectId = this.getAttribute('data-project');
                const data = projectData[projectId];
                
                if(data) {
                    // Masukkan Data ke Modal
                    currentProjectImages = data.images;
                    currentImageIndex = 0;
                    
                    modalTitle.textContent = data.title;
                    modalDesc.textContent = data.desc;
                    
                    updateModalImage();
                    renderThumbnails();
                    
                    // Mainkan Animasi Tampil (Fade In & Scale Up)
                    modal.classList.remove('hidden');
                    modal.classList.add('flex');
                    
                    setTimeout(() => {
                        modal.classList.remove('opacity-0');
                        modal.classList.add('opacity-100');
                        modalContentBox.classList.remove('scale-95');
                        modalContentBox.classList.add('scale-100');
                    }, 10);
                    
                    // Tampilkan atau Sembunyikan Tombol Slider (jika gambar hanya 1, sembunyikan)
                    if(currentProjectImages.length > 1) {
                        prevBtn.classList.remove('hidden');
                        nextBtn.classList.remove('hidden');
                    } else {
                        prevBtn.classList.add('hidden');
                        nextBtn.classList.add('hidden');
                    }
                }
            });
        });

        // B. Event Tutup Modal (Tombol X & Klik di luar box)
        closeBtns.forEach(btn => {
            btn.addEventListener('click', closeModal);
        });

        function closeModal() {
            modal.classList.remove('opacity-100');
            modal.classList.add('opacity-0');
            modalContentBox.classList.remove('scale-100');
            modalContentBox.classList.add('scale-95');
            
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }, 300); // Waktu animasi keluar
        }

        // C. Logika Geser Gambar Kiri / Kanan
        prevBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + currentProjectImages.length) % currentProjectImages.length;
            updateModalImage();
            updateThumbnailHighlight();
        });

        nextBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % currentProjectImages.length;
            updateModalImage();
            updateThumbnailHighlight();
        });

        // Fungsi mengganti gambar utama dengan efek fade out-in halus
        function updateModalImage() {
            modalMainImage.style.opacity = '0';
            modalMainImage.style.transition = 'opacity 0.2s ease-in-out';
            
            setTimeout(() => {
                modalMainImage.src = currentProjectImages[currentImageIndex];
                modalMainImage.style.opacity = '1';
            }, 200);
        }

        // D. Render barisan gambar kecil (Thumbnails)
        function renderThumbnails() {
            modalThumbnails.innerHTML = ''; 
            currentProjectImages.forEach((imgSrc, index) => {
                const img = document.createElement('img');
                img.src = imgSrc;
                // Styling ala retro (menyesuaikan Tailwind CSS)
                img.className = `h-14 w-20 md:h-16 md:w-24 object-cover rounded border-2 cursor-pointer transition-all snap-center shrink-0 hover:-translate-y-1 ${index === currentImageIndex ? 'border-indigo-500 opacity-100 shadow-[4px_4px_0_0_#4f46e5]' : 'border-slate-700 opacity-50 hover:opacity-100 hover:border-slate-400'}`;
                
                // Jika thumbnail diklik, langsung pindah ke gambar itu
                img.addEventListener('click', () => {
                    currentImageIndex = index;
                    updateModalImage();
                    updateThumbnailHighlight();
                });
                modalThumbnails.appendChild(img);
            });
        }

        // Fungsi memindahkan gaya highlight (bayangan) pada thumbnail yang sedang aktif
        function updateThumbnailHighlight() {
            const thumbs = modalThumbnails.querySelectorAll('img');
            thumbs.forEach((thumb, index) => {
                if(index === currentImageIndex) {
                    thumb.className = 'h-14 w-20 md:h-16 md:w-24 object-cover rounded border-2 cursor-pointer transition-all snap-center shrink-0 border-indigo-500 opacity-100 shadow-[4px_4px_0_0_#4f46e5]';
                } else {
                    thumb.className = 'h-14 w-20 md:h-16 md:w-24 object-cover rounded border-2 cursor-pointer transition-all snap-center shrink-0 border-slate-700 opacity-50 hover:opacity-100 hover:border-slate-400 hover:-translate-y-1';
                }
            });
        }
    }

});