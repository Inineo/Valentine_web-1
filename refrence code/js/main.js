// =======================
// DOM Elements
// =======================
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const questionScreen = document.getElementById('questionScreen');
const successScreen = document.getElementById('successScreen');
const videoBackground = document.getElementById('videoBackground');
const scrollHint = document.getElementById('scrollHint');

// =======================
// State Variables
// =======================
let yesScale = 1;
let noClicks = 0;
let videoLoaded = false;
let currentVideoTime = 0;
let targetVideoTime = 0;

// =======================
// Configuration
// =======================
const SCROLL_HEIGHT = '400vh'; // Lebih pendek, tapi smooth
const SMOOTH_FACTOR = 0.12; // Balanced: responsive tapi smooth

const noTexts = [
    "No",
    "Are you sure? 🥺",
    "Really? Think again! 😭",
    "Please? 💔",
    "Give it a chance! 💕",
    "You cannot say no! 😉"
];

// =======================
// Reset scroll position on page load
// =======================
window.addEventListener('load', function() {
    // Reset scroll position
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // Reset UI state
    questionScreen.style.display = 'flex';
    questionScreen.style.opacity = '1';
    questionScreen.style.transform = 'scale(1)';
    
    successScreen.classList.remove('active');
    successScreen.style.opacity = '0';
    successScreen.style.transform = 'scale(0.9)';
    
    videoBackground.classList.remove('show');
    scrollHint.style.opacity = '0';
    
    // Reset scroll overflow
    document.body.style.overflowY = 'hidden';
    document.documentElement.style.overflowY = 'hidden';
    document.body.style.height = '100vh';
    document.documentElement.style.height = '100vh';
    
    // Reset buttons
    btnYes.style.transform = 'scale(1)';
    btnNo.style.transform = 'translateX(0)';
    btnNo.style.opacity = '1';
    btnNo.style.pointerEvents = 'auto';
    btnNo.innerText = 'No';
    
    // Reset state variables (but preserve video if playing)
    yesScale = 1;
    noClicks = 0;
    
    // Only reset video time if not currently playing
    if (!successScreen.classList.contains('active')) {
        currentVideoTime = 0;
        targetVideoTime = 0;
        if (videoLoaded) {
            videoBackground.currentTime = 0;
        }
    }
});

// =======================
// Video Setup
// =======================
videoBackground.addEventListener('loadedmetadata', function() {
    videoLoaded = true;
    console.log(`Video loaded: ${videoBackground.duration.toFixed(2)} seconds`);
    
    // Set body height untuk scroll
    document.body.style.height = SCROLL_HEIGHT;
    document.documentElement.style.height = SCROLL_HEIGHT;
    
    // Force initialize video times to 0 (prevent NaN)
    currentVideoTime = 0;
    targetVideoTime = 0;
    videoBackground.currentTime = 0;
});

// Preload video
videoBackground.load();

// =======================
// Scroll-Controlled Video
// =======================
function updateScrollTarget() {
    if (!videoLoaded) return;
    if (!isFinite(videoBackground.duration) || videoBackground.duration <= 0) return;
    
    // Calculate scroll progress (0 to 1)
    const scrollTop = window.pageYOffset;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Prevent division by zero
    if (scrollHeight <= 0) {
        targetVideoTime = 0;
        return;
    }
    
    const scrollProgress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);
    
    // Map scroll progress to video time (target)
    const newTarget = scrollProgress * videoBackground.duration;
    
    // Only update if valid number
    if (isFinite(newTarget)) {
        targetVideoTime = newTarget;
    }
}

// Smooth animation loop untuk interpolasi video time
function smoothVideoUpdate() {
    // Log state setiap 60 frames (1 detik)
    if (window.debugFrameCount === undefined) window.debugFrameCount = 0;
    window.debugFrameCount++;
    
    if (window.debugFrameCount % 60 === 0) {
        console.log('Debug state:', {
            videoLoaded,
            successActive: successScreen.classList.contains('active'),
            duration: videoBackground.duration,
            currentVideoTime,
            targetVideoTime
        });
    }
    
    if (videoLoaded && successScreen.classList.contains('active')) {
        // Validate video duration is ready
        if (!isFinite(videoBackground.duration) || videoBackground.duration <= 0) {
            requestAnimationFrame(smoothVideoUpdate);
            return;
        }
        
        // Ensure values are valid before calculation
        if (!isFinite(currentVideoTime)) currentVideoTime = 0;
        if (!isFinite(targetVideoTime)) targetVideoTime = 0;
        
        // Calculate gap between current and target
        const gap = Math.abs(targetVideoTime - currentVideoTime);
        
        // Validate gap
        if (!isFinite(gap)) {
            requestAnimationFrame(smoothVideoUpdate);
            return;
        }
        
        // Jika gap terlalu besar (>0.15 detik), langsung jump untuk menghindari lag
        if (gap > 0.15) {
            currentVideoTime = targetVideoTime;
        } else {
            // Lerp (Linear interpolation) untuk smooth transition
            const newValue = currentVideoTime + (targetVideoTime - currentVideoTime) * SMOOTH_FACTOR;
            
            // Only update if result is valid
            if (isFinite(newValue)) {
                currentVideoTime = newValue;
            }
        }
        
        // Validate before setting (prevent NaN/Infinity)
        if (isFinite(currentVideoTime) && currentVideoTime >= 0 && currentVideoTime <= videoBackground.duration) {
            videoBackground.currentTime = currentVideoTime;
        }
    }
    
    // Loop terus menggunakan RAF
    requestAnimationFrame(smoothVideoUpdate);
}

// Start smooth animation loop
smoothVideoUpdate();

// Scroll event listener with throttling
let ticking = false;
window.addEventListener('scroll', function() {
    console.log('Scroll event fired - scrollTop:', window.pageYOffset);
    
    if (!ticking) {
        window.requestAnimationFrame(function() {
            updateScrollTarget();
            console.log('updateScrollTarget called - targetVideoTime:', targetVideoTime);
            ticking = false;
        });
        ticking = true;
    }
});

// =======================
// Button Yes Logic
// =======================
// Simpan ukuran asli tombol Yes
const rect = btnYes.getBoundingClientRect();
const btnOriginalWidth = rect.width;
const btnOriginalHeight = rect.height;

btnYes.addEventListener('click', () => {
    // Sembunyikan layar pertanyaan
    questionScreen.style.opacity = '0';
    questionScreen.style.transform = 'scale(0.9)';

    setTimeout(() => {
        questionScreen.style.display = 'none';

        // Tunjukkan layar sukses
        successScreen.classList.add('active');

        // Tampilkan video background
        videoBackground.classList.add('show');

        // Aktifkan scroll
        document.body.style.overflowY = 'auto';
        document.documentElement.style.overflowY = 'auto';

        // Tampilkan petunjuk scroll
        scrollHint.style.opacity = '1';
        
        // Initialize video time berdasarkan scroll position
        updateScrollTarget();
    }, 800);
});

// =======================
// Button No Logic
// =======================
btnNo.addEventListener('click', () => {
    noClicks++;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Hitung skala target agar tombol Yes menutupi layar
    const targetScale = Math.max(vw / btnOriginalWidth, vh / btnOriginalHeight) * 2.0;
    const scaleStep = (targetScale - 1) / 12;
    
    yesScale += scaleStep;
    btnYes.style.transform = `scale(${yesScale})`;

    // Geser tombol No ke samping kanan
    const yesOutwardGrowth = (yesScale - 1) * (btnOriginalWidth / 2);
    const offset = yesOutwardGrowth + 30 + (noClicks * 15);
    btnNo.style.transform = `translateX(${offset}px)`;

    // Ubah teks tombol No (looping)
    btnNo.innerText = noTexts[noClicks % noTexts.length];

    // Hilangkan tombol No ketika Yes sudah memenuhi layar
    if (yesScale >= targetScale) {
        btnNo.style.opacity = '0';
        btnNo.style.pointerEvents = 'none';
    }
});

// =======================
// Window Resize Handler
// =======================
window.addEventListener('resize', () => {
    // Update scroll target saat resize
    if (videoLoaded && successScreen.classList.contains('active')) {
        updateScrollTarget();
    }
});
