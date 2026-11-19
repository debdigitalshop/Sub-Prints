    /* ---------------- পার্মানেন্ট গ্লোবাল ও লোকাল ভিজিটর কাউন্টার ফাংশন ---------------- */
    function toBanglaDigits(num) {
        const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return num.toString().replace(/\d/g, d => banglaDigits[d]);
    }

    function initPermanentVisitorCounter() {
        const countEl = document.getElementById('permanentVisitorCount');
        if (!countEl) return;

        const storageKey = 'subprints_permanent_total_visits';
        let localSaved = parseInt(localStorage.getItem(storageKey) || '1250', 10);
        localSaved += 1; // প্রতিবার পেজ ওপেন বা রিলোড করলেই ১ করে বাড়বে
        localStorage.setItem(storageKey, localSaved);
        countEl.innerText = toBanglaDigits(localSaved);

        // গ্লোবাল ক্লাউড কাউন্টার (CounterAPI) - সব ডিভাইসের মোট ভিজিট পার্মানেন্টভাবে যোগ করবে
        fetch('https://api.counterapi.dev/v1/debdigitalshop_subprints/total_visits/up')
            .then(res => res.json())
            .then(data => {
                if (data && typeof data.count === 'number') {
                    const globalTotal = 1250 + data.count;
                    const finalCount = Math.max(localSaved, globalTotal);
                    localStorage.setItem(storageKey, finalCount);
                    countEl.innerText = toBanglaDigits(finalCount);
                }
            })
            .catch(() => {
                // অফলাইন বা নেট স্লো হলেও লোকাল পার্মানেন্ট কাউন্ট দেখাবে ও বাড়বে
                countEl.innerText = toBanglaDigits(localSaved);
            });
    }

    window.addEventListener('DOMContentLoaded', initPermanentVisitorCounter);

    /* ---------------- ইউনিভার্সাল স্কেলিটন লোডার জেনারেটর ফাংশন ---------------- */
    function showSkeletonInGrid(containerId, count, callback) {
        const container = document.getElementById(containerId);
        if (!container) return;
        let skelHTML = '';
        for (let i = 0; i < count; i++) {
            skelHTML += `
                <div class="skeleton-card-box">
                    <div class="skeleton-loader skeleton-img-slot"></div>
                    <div class="skeleton-loader skeleton-text-line"></div>
                    <div class="skeleton-loader skeleton-text-short"></div>
                    <div class="skeleton-loader skeleton-btn-slot"></div>
                </div>
            `;
        }
        container.innerHTML = skelHTML;
        setTimeout(() => {
            if (typeof callback === 'function') callback();
        }, 350);
    }

    /* ---------------- ৪টি কার্ডের পর ১টি AdSense বক্স তৈরির ফাংশন ---------------- */
    function createCatalogAdBox() {
const adDiv = document.createElement('div');
adDiv.className = 'catalog-ad-card';
adDiv.innerHTML = `
    <div class="catalog-ad-label"><i class="fa-solid fa-rectangle-ad"></i> Sponsored Advertisement</div>
    <ins class="adsbygoogle"
         style="display:block; width:100%; min-height:90px;"
         data-ad-client="ca-pub-1658969397946689"
         data-ad-slot="এখানে_আপনার_AD_SLOT_ID_বসান"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
`;
setTimeout(() => {
    try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
}, 200);
return adDiv;
}

    /* ---------------- ১ম স্লাইডার: স্টুডেন্ট স্পেশাল অর্ডার ফাংশন ---------------- */
    let currentStudentItemType = '';

    function openStudentItemModal(type) {
        currentStudentItemType = type;
        document.getElementById('stkFormFields').style.display = 'none';
        document.getElementById('projFormFields').style.display = 'none';
        document.getElementById('otherStudentFields').style.display = 'none';
        document.getElementById('studentExtraNote').value = '';

        const titleEl = document.getElementById('studentModalTitle');

        if (type === 'sticker') {
            titleEl.innerHTML = '<i class="fa-solid fa-note-sticky"></i> বই-খাতার নেম স্টিকার অর্ডার';
            document.getElementById('stkFormFields').style.display = 'block';
        } else if (type === 'project') {
            titleEl.innerHTML = '<i class="fa-solid fa-file-signature"></i> প্রজেক্ট ফ্রন্ট পেজ অর্ডার';
            document.getElementById('projFormFields').style.display = 'block';
        } else if (type === 'routine') {
            titleEl.innerHTML = '<i class="fa-solid fa-calendar-days"></i> পড়ার রুটিন ও চার্ট অর্ডার';
            document.getElementById('otherStudentFields').style.display = 'block';
        } else if (type === 'cv') {
            titleEl.innerHTML = '<i class="fa-solid fa-user-graduate"></i> সিভি / বায়োডাটা প্রিন্ট অর্ডার';
            document.getElementById('otherStudentFields').style.display = 'block';
        } else if (type === 'idcard') {
            titleEl.innerHTML = '<i class="fa-solid fa-id-badge"></i> স্টুডেন্ট PVC আইডি কার্ড অর্ডার';
            document.getElementById('otherStudentFields').style.display = 'block';
        }

        document.getElementById('studentOrderModal').style.display = 'flex';
    }

    function submitStudentOrderToWA() {
        const delivery = document.querySelector('input[name="studentDelivery"]:checked').value;
        const extraNote = document.getElementById('studentExtraNote').value.trim() || 'কোনো বাড়তি নোট নেই';
        let detailsMsg = '';

        if (currentStudentItemType === 'sticker') {
            const name = document.getElementById('stkStudentName').value.trim();
            const school = document.getElementById('stkSchoolName').value.trim();
            const cls = document.getElementById('stkClass').value.trim();
            const roll = document.getElementById('stkRollSec').value.trim();

            if (!name || !school || !cls) {
                alert('অনুগ্রহ করে নাম, স্কুলের নাম এবং ক্লাস পূরণ করুন।');
                return;
            }
            detailsMsg = `• সার্ভিস: বই-খাতার নেম স্টিকার (₹৯৯)%0A` +
                         `• ছাত্র/ছাত্রীর নাম: ${name}%0A` +
                         `• স্কুলের নাম: ${school}%0A` +
                         `• ক্লাস: ${cls}%0A` +
                         `• রোল ও সেকশন: ${roll || 'দেওয়া হয়নি'}%0A`;

        } else if (currentStudentItemType === 'project') {
            const name = document.getElementById('projStudentName').value.trim();
            const school = document.getElementById('projSchoolName').value.trim();
            const subject = document.getElementById('projSubject').value.trim();
            const cls = document.getElementById('projClass').value.trim();
            const roll = document.getElementById('projRoll').value.trim();

            if (!name || !school || !subject) {
                alert('অনুগ্রহ করে নাম, স্কুল/কলেজের নাম এবং প্রজেক্টের বিষয় পূরণ করুন।');
                return;
            }
            detailsMsg = `• সার্ভিস: স্কুল/কলেজ প্রজেক্ট ফ্রন্ট পেজ (₹৫০)%0A` +
                         `• ছাত্র/ছাত্রীর নাম: ${name}%0A` +
                         `• প্রতিষ্ঠান ও ঠিকানা: ${school}%0A` +
                         `• বিষয়/টপিক: ${subject}%0A` +
                         `• ক্লাস/সেমিস্টার: ${cls || 'দেওয়া হয়নি'}%0A` +
                         `• রোল/রেজিঃ নম্বর: ${roll || 'দেওয়া হয়নি'}%0A`;

        } else {
            const name = document.getElementById('otherStdName').value.trim();
            const inst = document.getElementById('otherStdInst').value.trim();
            const info = document.getElementById('otherStdInfo').value.trim();

            if (!name || !inst) {
                alert('অনুগ্রহ করে নাম এবং স্কুল/কলেজ বা যোগ্যতার ঘরটি পূরণ করুন।');
                return;
            }

            let serviceTitle = 'স্টুডেন্ট সার্ভিস';
            if (currentStudentItemType === 'routine') serviceTitle = 'পড়ার রুটিন ও চার্ট (₹৭০)';
            if (currentStudentItemType === 'cv') serviceTitle = 'সিভি / বায়োডাটা তৈরি (₹৬০)';
            if (currentStudentItemType === 'idcard') serviceTitle = 'স্টুডেন্ট PVC আইডি কার্ড (₹৬০)';

            detailsMsg = `• সার্ভিস: ${serviceTitle}%0A` +
                         `• নাম: ${name}%0A` +
                         `• প্রতিষ্ঠান/যোগ্যতা: ${inst}%0A` +
                         `• অন্যান্য তথ্য: ${info || 'হোয়াটসঅ্যাপে জানাচ্ছি'}%0A`;
        }

        const finalMessage = `*নতুন স্টুডেন্ট অর্ডার (Sub Prints)*%0A` +
                             `--------------------------------%0A` +
                             detailsMsg +
                             `• নোট/পরিমাণ: ${extraNote}%0A` +
                             `• ডেলিভারি মাধ্যম: ${delivery}%0A` +
                             `--------------------------------%0A` +
                             `আমি অর্ডারটি কনফার্ম করতে চাই।`;

        window.open(`https://wa.me/919732322525?text=${finalMessage}`, '_blank');
        closeModal('studentOrderModal');
    }

    /* ---------------- ২য় স্লাইডার: পড়ার বই (১০টি বই ও অ্যাড্রেস) ফাংশন ---------------- */
    let currentBookData = { title: '', pub: '', author: '', price: '' };

    function openPredefinedBookModal(title, pub, author, price) {
        currentBookData = { title, pub, author, price };
        document.getElementById('selBookTitle').innerText = title;
        document.getElementById('selBookPub').innerText = `প্রকাশনী: ${pub}`;
        document.getElementById('selBookAuthor').innerText = author;
        document.getElementById('selBookPrice').innerText = `মূল্য: ${price}`;

        const radios = document.getElementsByName('preBookDelivery');
        if (radios.length > 0) radios[0].checked = true;
        toggleBookDeliveryView('home');

        document.getElementById('predefinedBookModal').style.display = 'flex';
    }

    function toggleBookDeliveryView(mode) {
        if (mode === 'home') {
            document.getElementById('bookHomeAddressBox').style.display = 'block';
            document.getElementById('bookShopAddressBox').style.display = 'none';
        } else {
            document.getElementById('bookHomeAddressBox').style.display = 'none';
            document.getElementById('bookShopAddressBox').style.display = 'block';
        }
    }

    function sendPredefinedBookToWA() {
        const deliveryType = document.querySelector('input[name="preBookDelivery"]:checked').value;
        let addressSection = '';

        if (deliveryType === 'হোম ডেলিভারি') {
            const buyerName = document.getElementById('bookBuyerName').value.trim();
            const buyerAddr = document.getElementById('bookBuyerAddress').value.trim();
            if (!buyerName || !buyerAddr) {
                alert('হোম ডেলিভারির জন্য অনুগ্রহ করে আপনার নাম এবং সম্পূর্ণ ঠিকানা লিখুন।');
                return;
            }
            addressSection = `• গ্রাহকের নাম: ${buyerName}%0A` +
                             `• ডেলিভারি ঠিকানা: ${buyerAddr}%0A`;
        } else {
            addressSection = `• পিক-আপ লোকেশন: Deb Digital Shop (রামপুরহাট, বীরভূম)%0A`;
        }

        const waMessage = `*নতুন পড়ার বই অর্ডার (Sub Prints)*%0A` +
                          `--------------------------------%0A` +
                          `• বইয়ের নাম: ${currentBookData.title}%0A` +
                          `• প্রকাশনী: ${currentBookData.pub}%0A` +
                          `• ${currentBookData.author}%0A` +
                          `• নির্ধারিত মূল্য: ${currentBookData.price}%0A` +
                          `• ডেলিভারি মাধ্যম: ${deliveryType}%0A` +
                          addressSection +
                          `--------------------------------%0A` +
                          `আমি এই বইটি অর্ডার করতে চাই।`;

        window.open(`https://wa.me/919732322525?text=${waMessage}`, '_blank');
        closeModal('predefinedBookModal');
    }

    /* ---------------- অ্যাবাউট ও প্রাইভেসি অপশন খোলার ফাংশন ---------------- */
    function openAboutSection() {
        const aboutDet = document.getElementById('aboutDropdown');
        if (aboutDet) {
            aboutDet.open = true;
            aboutDet.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function openPrivacySection() {
        const privDet = document.getElementById('privacyDropdown');
        if (privDet) {
            privDet.open = true;
            privDet.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    /* ---------------- ইমেজ ডাউনলোড ও স্ক্রিনশট সিকিউরিটি ---------------- */
    document.addEventListener('contextmenu', function(e) {
        if (e.target.nodeName === 'IMG' || e.target.closest('.catalog-item') || e.target.closest('.ecom-card') || e.target.closest('.lightbox-content')) {
            e.preventDefault();
        }
    });

    document.addEventListener('dragstart', function(e) {
        if (e.target.nodeName === 'IMG') {
            e.preventDefault();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'PrintScreen' || e.keyCode === 44) {
            e.preventDefault();
            showScreenProtection();
        }
        if (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'u' || e.keyCode === 83 || e.keyCode === 80 || e.keyCode === 85)) {
            e.preventDefault();
            return false;
        }
        if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67))) {
            e.preventDefault();
            return false;
        }
    });

    function showScreenProtection() {
        const overlay = document.getElementById('screenWarning');
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 2000);
    }

    function closeModal(id) {
        document.getElementById(id).style.display = 'none';
    }

/* ---------------- ফুলস্ক্রিন ইমেজ ভিউয়ার ফাংশন (Lightbox + Swipe) ---------------- */
let lbGalleryImages = [];
    let lbCurrentIndex = 0;
    let lbTitleText = '';
    let lbTouchStartX = 0;

    function openImageLightbox(e, src, title) {
        if (e) e.stopPropagation();
        openGalleryLightbox([src], 0, title);
    }

    function openGalleryLightbox(imagesArray, startIndex, title) {
        lbGalleryImages = imagesArray || [];
        lbCurrentIndex = startIndex || 0;
        lbTitleText = title || '';

        updateLightboxView();
        document.getElementById('imageLightboxModal').style.display = 'flex';
    }

    function updateLightboxView() {
        const img = document.getElementById('lightboxImage');
        const caption = document.getElementById('lightboxCaption');
        const prevBtn = document.getElementById('lbPrevBtn');
        const nextBtn = document.getElementById('lbNextBtn');
        const counter = document.getElementById('lightboxCounter');

        img.classList.remove('img-loaded');
        img.src = lbGalleryImages[lbCurrentIndex];
        caption.innerText = lbTitleText;

        if (lbGalleryImages.length > 1) {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
            counter.style.display = 'block';
            counter.innerText = `ছবি ${toBanglaDigits(lbCurrentIndex + 1)} / ${toBanglaDigits(lbGalleryImages.length)} (পাশে সরান)`;
        } else {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            counter.style.display = 'none';
        }
    }

    function changeLightboxSlide(step) {
        if (lbGalleryImages.length <= 1) return;
        lbCurrentIndex = (lbCurrentIndex + step + lbGalleryImages.length) % lbGalleryImages.length;
        updateLightboxView();
    }

    function lightboxTouchStart(e) {
        lbTouchStartX = e.touches[0].clientX;
    }

    function lightboxTouchEnd(e) {
        const diffX = e.changedTouches[0].clientX - lbTouchStartX;
        if (Math.abs(diffX) > 40) {
            if (diffX < 0) changeLightboxSlide(1);
            else changeLightboxSlide(-1);
        }
    }

    function closeLightbox() {
        document.getElementById('imageLightboxModal').style.display = 'none';
    }

    function parseQuantityNumber(input) {
        if(!input) return NaN;
        const banglaMap = {'০':'0', '১':'1', '২':'2', '৩':'3', '৪':'4', '৫':'5', '৬':'6', '৭':'7', '৮':'8', '৯':'9'};
        let cleanStr = input.toString().trim().replace(/[০-৯]/g, d => banglaMap[d]);
        let matches = cleanStr.match(/\d+/);
        return matches ? parseInt(matches[0], 10) : NaN;
    }

    function setQuickQty(num) {
        document.getElementById('cardQuantity').value = num;
    }

    function setQuickBillQty(num) {
        document.getElementById('billBookQty').value = num;
    }

    function setQuickMenuQty(num) {
        document.getElementById('menuQuantity').value = num;
    }

    function setQuickAnnaQty(num) {
        document.getElementById('annaQuantity').value = num;
    }

    /* ---------------- থাম্বনেইল ক্লিক করে ছবি বদলানোর ফাংশন ---------------- */
    function changeDisplayImage(mainImgId, newSrc, thumbElement) {
        const mainImg = document.getElementById(mainImgId);
        if (mainImg) {
            mainImg.classList.remove('img-loaded');
            mainImg.src = newSrc;
        }
        if (thumbElement && thumbElement.parentElement) {
            const thumbs = thumbElement.parentElement.querySelectorAll('.thumb-box');
            thumbs.forEach(t => t.classList.remove('active'));
            thumbElement.classList.add('active');
        }
    }

    /* ---------------- অ্যাডভার্টাইজমেন্ট টাইমার কন্ট্রোলার ---------------- */
    let adTargetCatalog = '';
    let adCountdownTimer = null;

    function triggerAdFlow(target) {
        adTargetCatalog = target;
        const adModal = document.getElementById('adModal');
        const skipBtn = document.getElementById('adSkipBtn');
        const timerSpan = document.getElementById('adSecondsLeft');
        const timerText = document.getElementById('adTimerText');

        let timeLeft = 5;
        skipBtn.disabled = true;
        skipBtn.style.opacity = '0.6';
        skipBtn.style.cursor = 'not-allowed';
        skipBtn.innerHTML = `অপেক্ষা করুন (<span id="adSecondsLeft">${timeLeft}</span>s)`;
        timerText.innerText = `অল্প কিছুক্ষণ অপেক্ষা করুন (${timeLeft} সেকেন্ড পর দেখতে পারবেন)`;

        adModal.style.display = 'flex';

        if(adCountdownTimer) clearInterval(adCountdownTimer);

        adCountdownTimer = setInterval(() => {
            timeLeft--;
            if(timeLeft > 0) {
                skipBtn.innerHTML = `অপেক্ষা করুন (<span id="adSecondsLeft">${timeLeft}</span>s)`;
                timerText.innerText = `অল্প কিছুক্ষণ অপেক্ষা করুন (${timeLeft} সেকেন্ড পর দেখতে পারবেন)`;
            } else {
                clearInterval(adCountdownTimer);
                skipBtn.disabled = false;
                skipBtn.style.opacity = '1';
                skipBtn.style.cursor = 'pointer';
                skipBtn.style.background = 'var(--primary-orange)';
                skipBtn.innerHTML = '<i class="fa-solid fa-arrow-right"></i> স্কিপ করুন / ডিজাইন দেখুন';
                timerText.innerText = 'লোডিং শেষ হয়েছে, নিচে ক্লিক করে ক্যাটালগ দেখুন';
            }
        }, 1000);
    }

    function skipAdAndOpenCatalog() {
        if(adCountdownTimer) clearInterval(adCountdownTimer);
        closeModal('adModal');

        if(adTargetCatalog === 'wedding') {
            document.getElementById('catalogModal').style.display = 'flex';
            showSkeletonInGrid('catalogContainer', 6, renderWeddingCatalogGrid);
        } else if(adTargetCatalog === 'menu') {
            document.getElementById('menuCatalogModal').style.display = 'flex';
            showSkeletonInGrid('menuCatalogContainer', 6, renderMenuCatalogGrid);
        } else if(adTargetCatalog === 'anna') {
            document.getElementById('annaCatalogModal').style.display = 'flex';
            showSkeletonInGrid('annaCatalogContainer', 6, renderAnnaCatalogGrid);
        }
    }

/* ---------------- ১. বিয়ের কার্ড (ফ্রন্ট স্টাইল + ৩টি ছবি + দাম + সঠিক ছবির লিঙ্ক) ---------------- */
let selectedType = '';
    let currentQuantity = 0;
    let selectedCardDesign = '';
    let selectedCardPrice = '';
    let selectedCardImg = '';
    let currentCardList = [];

    const weddingCatalogs = {
        'small': {
            'হিন্দু': [
                { id: 'HS01', name: 'ডিজিটাল হিন্দু কার্ড ০১', code: 'SR-H01', price: '₹২৫ / পিস', img1: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80' },
                { id: 'HS02', name: 'ডিজিটাল হিন্দু কার্ড ০২', code: 'SR-H02', price: '₹২৫ / পিস', img1: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80' },
                { id: 'HS03', name: 'ডিজিটাল হিন্দু কার্ড ০৩', code: 'SR-H03', price: '₹৩০ / পিস', img1: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80' },
                { id: 'HS04', name: 'ডিজিটাল হিন্দু কার্ড ০৪', code: 'SR-H04', price: '₹৩০ / পিস', img1: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80' },
                { id: 'HS05', name: 'ডিজিটাল হিন্দু কার্ড ০৫', code: 'SR-H05', price: '₹৩৫ / পিস', img1: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80' },
                { id: 'HS06', name: 'ডিজিটাল হিন্দু কার্ড ০৬', code: 'SR-H06', price: '₹৩৫ / পিস', img1: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80' }
            ],
            'মুসলিম': [
                { id: 'MS01', name: 'ডিজিটাল মুসলিম কার্ড ০১', code: 'SR-M01', price: '₹২৫ / পিস', img1: 'https://lh3.googleusercontent.com/d/1p5ywjHh48f8cygru-A5SnamFZ7xF94lK', img2: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80' },
                { id: 'MS02', name: 'ডিজিটাল মুসলিম কার্ড ০২', code: 'SR-M02', price: '₹২৫ / পিস', img1: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80' },
                { id: 'MS03', name: 'ডিজিটাল মুসলিম কার্ড ০৩', code: 'SR-M03', price: '₹৩০ / পিস', img1: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80' },
                { id: 'MS04', name: 'ডিজিটাল মুসলিম কার্ড ০৪', code: 'SR-M04', price: '₹৩০ / পিস', img1: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80' },
                { id: 'MS05', name: 'ডিজিটাল মুসলিম কার্ড ০৫', code: 'SR-M05', price: '₹৩৫ / পিস', img1: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80' },
                { id: 'MS06', name: 'ডিজিটাল মুসলিম কার্ড ০৬', code: 'SR-M06', price: '₹৩৫ / পিস', img1: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80' }
            ]
        },
        'bulk': {
            'হিন্দু': [
                { 
                    id: 'HB01', 
                    name: 'ঐতিহ্যবাহী হিন্দু কার্ড ০১', 
                    code: 'BK-H01', 
                    price: '₹১২ / পিস',
                    img1: 'https://lh3.googleusercontent.com/d/1-uegMfk9TiYPcHDUKgO3Sqonk78BtIFE', 
                    img2: 'https://lh3.googleusercontent.com/d/1HPStEMcyzGTTuUCDe0kOsHB9aJNl7Iur', 
                    img3: 'https://lh3.googleusercontent.com/d/1wv38V8K8Ksh1h1O4V96sFu65NHXgFAEC' 
                },
                { 
                    id: 'HB02', 
                    name: 'হলুদ কালার হিন্দু বিয়ের কার্ড ০২', 
                    code: 'BK-H02', 
                    price: '₹১৪ / পিস',
                    img1: 'https://lh3.googleusercontent.com/d/1nkNYLAedK-zKRBdb42An8orQPOCczBW9', 
                    img2: 'https://lh3.googleusercontent.com/d/19s9ZS_53Erw7I0kZsGBu0t8noXWCjfdA', 
                    img3: 'https://lh3.googleusercontent.com/d/1IvMqN0CZ56e78PGFToB0h0Yh8mZnjYj4' 
                },
                { 
                    id: 'HB03', 
                    name: 'লাল কালার হিন্দু বিয়ের কার্ড ০৩', 
                    code: 'BK-H03', 
                    price: '₹১৫ / পিস',
                    img1: 'https://lh3.googleusercontent.com/d/1M4exvpCCpNGx1U8tdhgThid38ogvi0xg', 
                    img2: 'https://lh3.googleusercontent.com/d/1Ok_Pe2_--GNOPURD8PKJ_KpEFWNRk3Q-', 
                    img3: 'https://lh3.googleusercontent.com/d/15LnFaWuXRrgI2I0q9y1Q9Z3ZOY48exvE' 
                },
                { 
                    id: 'HB04', 
                    name: 'হিন্দু বিয়ের কার্ড ডিজাইন ০৪', 
                    code: 'BK-H04', 
                    price: '₹১৬ / পিস',
                    img1: 'https://lh3.googleusercontent.com/d/1PBDXOz2hLtCB2oE99iC7RAXfpUfmU5uU', 
                    img2: 'https://lh3.googleusercontent.com/d/1QEm80rnG0AhHFw4Zt8oky38wmh9GnaoY', 
                    img3: 'https://lh3.googleusercontent.com/d/1oFw30TwaK71XhlmOy2MIV0qVU32vDINm' 
                },
                { 
                    id: 'HB05', 
                    name: 'হিন্দু কার্ড ০৫', 
                    code: 'BK-H05', 
                    price: '₹১৫ / পিস', 
                    img1: 'https://lh3.googleusercontent.com/d/16O606TVCCHqm5gNvjOsOpTtUw4u86PY-', 
                    img2: 'https://lh3.googleusercontent.com/d/16LGQLDC3JmejAs9naToDutv2jvmhXUNu', 
                    img3: 'https://lh3.googleusercontent.com/d/1Gby3a7AiM2TPBDr9MDI9zubwtzNmqGQQ' 
                },
                { 
                    id: 'HB06', 
                    name: 'সিঙ্গেল হারমোনিয়াম কার্ড হলুদ ০৬', 
                    code: 'BK-H06', 
                    price: '₹১২ / পিস', 
                    img1: 'https://lh3.googleusercontent.com/d/1yhwIfwU0xD5dAGiqzQViSLaMlQsarN9v', 
                    img2: 'https://lh3.googleusercontent.com/d/1IO2CrFEfSdbrzmrDzlhoxj3ao0GmHBTG', 
                    img3: 'https://lh3.googleusercontent.com/d/1oTKcmYfO-9vu9zVChSty3rAL7iEiZ6EC' 
                },
                { 
                    id: 'HB07', 
                    name: 'হারমোনিয়াম লাল কালার হিন্দু কার্ড ০৭', 
                    code: 'BK-H07', 
                    price: '₹১৫ / পিস', 
                    img1: 'https://lh3.googleusercontent.com/d/14p_fycDkXkm9vbarIhGmD1sxqesi64WL', 
                    img2: 'https://lh3.googleusercontent.com/d/1cq_a3o2rdyrh4ZyLOHnFbvHe6TFqGs73', 
                    img3: 'https://lh3.googleusercontent.com/d/1sH2fPbbeSSrVysZxVkXPxY4oZ2v6nSpi' 
                },
                { id: 'HB08', name: 'ঐতিহ্যবাহী হিন্দু কার্ড ০৮', code: 'BK-H08', price: '₹১৮ / পিস', img1: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80' },
                { id: 'HB09', name: 'ঐতিহ্যবাহী হিন্দু কার্ড ০৯', code: 'BK-H09', price: '₹২০ / পিস', img1: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80' },
                { id: 'HB10', name: 'ঐতিহ্যবাহী হিন্দু কার্ড ১০', code: 'BK-H10', price: '₹২০ / পিস', img1: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80' },
                { id: 'HB11', name: 'ঐতিহ্যবাহী হিন্দু কার্ড ১১', code: 'BK-H11', price: '₹২২ / পিস', img1: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80' },
                { id: 'HB12', name: 'ঐতিহ্যবাহী হিন্দু কার্ড ১২', code: 'BK-H12', price: '₹২২ / পিস', img1: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80' },
                { id: 'HB13', name: 'ঐতিহ্যবাহী হিন্দু কার্ড ১৩', code: 'BK-H13', price: '₹২৫ / পিস', img1: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80' },
                { id: 'HB14', name: 'ঐতিহ্যবাহী হিন্দু কার্ড ১৪', code: 'BK-H14', price: '₹২৫ / পিস', img1: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80' },
                { id: 'HB15', name: 'ঐতিহ্যবাহী হিন্দু কার্ড ১৫', code: 'BK-H15', price: '₹২৮ / পিস', img1: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80' },
                { id: 'HB16', name: 'ঐতিহ্যবাহী হিন্দু কার্ড ১৬', code: 'BK-H16', price: '₹২৮ / পিস', img1: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80' },
                { id: 'HB17', name: 'ঐতিহ্যবাহী হিন্দু কার্ড ১৭', code: 'BK-H17', price: '₹৩০ / পিস', img1: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80' },
                { id: 'HB18', name: 'ঐতিহ্যবাহী হিন্দু কার্ড ১৮', code: 'BK-H18', price: '₹৩০ / পিস', img1: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80' },
                { id: 'HB19', name: 'ঐতিহ্যবাহী হিন্দু কার্ড ১৯', code: 'BK-H19', price: '₹৩৫ / পিস', img1: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80' },
                { id: 'HB20', name: 'ঐতিহ্যবাহী হিন্দু কার্ড ২০', code: 'BK-H20', price: '₹৩৫ / পিস', img1: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80' }
            ],
            'মুসলিম': [
                { id: 'MB01', name: 'রয়্যাল নিকা কার্ড ০১', code: 'BK-M01', price: '₹১২ / পিস', img1: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80' },
                { id: 'MB02', name: 'রয়্যাল নিকা কার্ড ০২', code: 'BK-M02', price: '₹১৪ / পিস', img1: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80' },
                { id: 'MB03', name: 'রয়্যাল নিকা কার্ড ০৩', code: 'BK-M03', price: '₹১৫ / পিস', img1: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80' },
                { id: 'MB04', name: 'রয়্যাল নিকা কার্ড ০৪', code: 'BK-M04', price: '₹১৬ / পিস', img1: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80' },
                { id: 'MB05', name: 'রয়্যাল নিকা কার্ড ০৫', code: 'BK-M05', price: '₹১৮ / পিস', img1: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80' },
                { id: 'MB06', name: 'রয়্যাল নিকা কার্ড ০৬', code: 'BK-M06', price: '₹১৮ / পিস', img1: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80' },
                { id: 'MB07', name: 'রয়্যাল নিকা কার্ড ০৭', code: 'BK-M07', price: '₹২০ / পিস', img1: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80' },
                { id: 'MB08', name: 'রয়্যাল নিকা কার্ড ০৮', code: 'BK-M08', price: '₹২০ / পিস', img1: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80' },
                { id: 'MB09', name: 'রয়্যাল নিকা কার্ড ০৯', code: 'BK-M09', price: '₹২২ / পিস', img1: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80' },
                { id: 'MB10', name: 'রয়্যাল নিকা কার্ড ১০', code: 'BK-M10', price: '₹২২ / পিস', img1: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80' },
                { id: 'MB11', name: 'রয়্যাল নিকা কার্ড ১১', code: 'BK-M11', price: '₹২৫ / পিস', img1: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80' },
                { id: 'MB12', name: 'রয়্যাল নিকা কার্ড ১২', code: 'BK-M12', price: '₹২৫ / পিস', img1: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80' },
                { id: 'MB13', name: 'রয়্যাল নিকা কার্ড ১৩', code: 'BK-M13', price: '₹২৮ / পিস', img1: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80' },
                { id: 'MB14', name: 'রয়্যাল নিকা কার্ড ১৪', code: 'BK-M14', price: '₹২৮ / পিস', img1: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80' },
                { id: 'MB15', name: 'রয়্যাল নিকা কার্ড ১৫', code: 'BK-M15', price: '₹৩০ / পিস', img1: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80' },
                { id: 'MB16', name: 'রয়্যাল নিকা কার্ড ১৬', code: 'BK-M16', price: '₹৩০ / পিস', img1: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80' },
                { id: 'MB17', name: 'রয়্যাল নিকা কার্ড ১৭', code: 'BK-M17', price: '₹৩২ / পিস', img1: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80' },
                { id: 'MB18', name: 'রয়্যাল নিকা কার্ড ১৮', code: 'BK-M18', price: '₹৩২ / পিস', img1: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80' },
                { id: 'MB19', name: 'রয়্যাল নিকা কার্ড ১৯', code: 'BK-M19', price: '₹৩৫ / পিস', img1: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80' },
                { id: 'MB20', name: 'রয়্যাল নিকা কার্ড ২০', code: 'BK-M20', price: '₹৩৫ / পিস', img1: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80' }
            ]
        }
    };

    function openWeddingFlow() {
        document.getElementById('cardQuantity').value = '';
        document.getElementById('weddingModalStep1').style.display = 'flex';
    }

    function selectWeddingType(type) {
        selectedType = type;
        document.getElementById('typeHindu').classList.remove('active');
        document.getElementById('typeMuslim').classList.remove('active');

        if(type === 'হিন্দু') {
            document.getElementById('typeHindu').classList.add('active');
        } else {
            document.getElementById('typeMuslim').classList.add('active');
        }
    }

    function proceedToCatalog() {
        const rawVal = document.getElementById('cardQuantity').value;
        const qty = parseQuantityNumber(rawVal);

        if(!rawVal || isNaN(qty) || qty <= 0) {
            alert('অনুগ্রহ করে সঠিক সংখ্যায় কার্ডের পরিমাণ লিখুন (যেমন: ১, ২, ৫, ৫০ ইত্যাদি)।');
            document.getElementById('cardQuantity').focus();
            return;
        }

        if(!selectedType) {
            alert('অনুগ্রহ করে হিন্দু অথবা মুসলিম কার্ডের ধরন নির্বাচন করুন।');
            return;
        }

        currentQuantity = qty;
        closeModal('weddingModalStep1');

        let categoryMode = (qty <= 25) ? 'small' : 'bulk';
        let subtitleText = (qty <= 25) 
            ? `(১-২৫ পিস বিশেষ শর্ট-রান ক্যাটালগ | আপনার টাইপ করা পরিমাণ: ${qty} পিস)` 
            : `(২৫-১০০০ পিস বাল্ক ক্যাটালগ | আপনার টাইপ করা পরিমাণ: ${qty} পিস)`;

        currentCardList = weddingCatalogs[categoryMode][selectedType];
        currentCardList.forEach(item => { item.currentImg = item.img1; });

        selectedCardDesign = `${currentCardList[0].name} (${currentCardList[0].code})`;
        selectedCardPrice = currentCardList[0].price;
        selectedCardImg = currentCardList[0].img1;

        document.getElementById('catalogTitle').innerText = `${selectedType} বিয়ের কার্ড ক্যাটালগ (স্যাম্পল)`;
        document.getElementById('catalogSubtitle').innerText = subtitleText;

        triggerAdFlow('wedding');
    }

    function switchWeddingThumb(e, index, imgNum, thumbEl) {
        e.stopPropagation();
        const item = currentCardList[index];
        const newSrc = item['img' + imgNum];
        item.currentImg = newSrc;
        changeDisplayImage(`wedding-main-img-${index}`, newSrc, thumbEl);

        if (selectedCardDesign === `${item.name} (${item.code})`) {
            selectedCardImg = newSrc;
        }
    }

    function selectWeddingCardByIndex(index) {
        const item = currentCardList[index];
        selectedCardDesign = `${item.name} (${item.code})`;
        selectedCardPrice = item.price;
        selectedCardImg = item.currentImg || item.img1;
        renderWeddingCatalogGrid();
    }

    let weddingTouchStartX = 0;
    let weddingTouchStartY = 0;
    let weddingCardJustSwiped = false;

    function handleWeddingTouchStart(e) {
        weddingTouchStartX = e.touches[0].clientX;
        weddingTouchStartY = e.touches[0].clientY;
        weddingCardJustSwiped = false;
    }

    function handleWeddingTouchEnd(e, index) {
        const diffX = e.changedTouches[0].clientX - weddingTouchStartX;
        const diffY = e.changedTouches[0].clientY - weddingTouchStartY;

        // ছবির ওপর হাত দিয়ে ডানে-বামে সরালে পরপর ৩টি ছবি বদলাবে
        if (Math.abs(diffX) > 30 && Math.abs(diffX) > Math.abs(diffY)) {
            e.stopPropagation();
            weddingCardJustSwiped = true;

            const item = currentCardList[index];
            const imgs = [item.img1, item.img2, item.img3];
            const currentSrc = item.currentImg || item.img1;
            let currIdx = imgs.indexOf(currentSrc);
            if (currIdx === -1) currIdx = 0;

            if (diffX < 0) {
                currIdx = (currIdx + 1) % 3; // বামে সরালে পরের ছবি
            } else {
                currIdx = (currIdx + 2) % 3; // ডানে সরালে আগের ছবি
            }

            const newSrc = imgs[currIdx];
            item.currentImg = newSrc;

            const mainImg = document.getElementById(`wedding-main-img-${index}`);
            if (mainImg) {
                mainImg.classList.remove('img-loaded');
                mainImg.src = newSrc;
            }

            const cardEl = mainImg ? mainImg.closest('.ecom-card') : null;
            if (cardEl) {
                cardEl.querySelectorAll('.thumb-box').forEach((t, i) => {
                    t.classList.toggle('active', i === currIdx);
                });
                cardEl.querySelectorAll('.card-swipe-dot').forEach((d, i) => {
                    d.style.background = (i === currIdx) ? '#FF6A00' : 'rgba(255,255,255,0.75)';
                });
            }

            if (selectedCardDesign === `${item.name} (${item.code})`) {
                selectedCardImg = newSrc;
            }

            setTimeout(() => { weddingCardJustSwiped = false; }, 250);
        }
    }

    function openWeddingCardImageClick(e, index, title) {
        if (e) e.stopPropagation();
        if (weddingCardJustSwiped) return;
        const item = currentCardList[index];
        const imgs = [item.img1, item.img2, item.img3];
        const currentSrc = item.currentImg || item.img1;
        const startIdx = Math.max(0, imgs.indexOf(currentSrc));
        if (typeof openGalleryLightbox === 'function') {
            openGalleryLightbox(imgs, startIdx, title);
        } else {
            openImageLightbox(e, currentSrc, title);
        }
    }

    function renderWeddingCatalogGrid() {
        const container = document.getElementById('catalogContainer');
        container.innerHTML = '';

        currentCardList.forEach((item, index) => {
            const fullDesignTitle = `${item.name} (${item.code})`;
            const isSelected = (selectedCardDesign === fullDesignTitle);
            const activeSrc = item.currentImg || item.img1;
            const activeIdx = Math.max(0, [item.img1, item.img2, item.img3].indexOf(activeSrc));

            const cardDiv = document.createElement('div');
            cardDiv.className = `ecom-card ${isSelected ? 'selected' : ''}`;
            cardDiv.onclick = () => selectWeddingCardByIndex(index);
            
            const mainImgId = `wedding-main-img-${index}`;
            const badgeClass = (index % 2 === 0) ? 'badge-bestseller' : 'badge-trending';
            const badgeText = (index % 2 === 0) ? 'জনপ্রিয়' : 'নতুন কালেকশন';

            cardDiv.innerHTML = `
                <div class="ecom-img-box" style="touch-action: pan-y;" ontouchstart="handleWeddingTouchStart(event)" ontouchend="handleWeddingTouchEnd(event, ${index})">
                    <span class="ecom-badge ${badgeClass}">${badgeText}</span>
                    <img src="${activeSrc}" id="${mainImgId}" alt="${item.name}" title="বড় করে দেখতে ক্লিক করুন বা পাশে সরান" onload="this.classList.add('img-loaded')" onclick="openWeddingCardImageClick(event, ${index}, '${fullDesignTitle} | মূল্য: ${item.price}')">
                    <div style="position:absolute; bottom:6px; left:50%; transform:translateX(-50%); display:flex; gap:5px; background:rgba(0,0,0,0.4); padding:3px 8px; border-radius:10px; pointer-events:none;">
                        <span class="card-swipe-dot" style="width:6px; height:6px; border-radius:50%; background:${activeIdx === 0 ? '#FF6A00' : 'rgba(255,255,255,0.75)'};"></span>
                        <span class="card-swipe-dot" style="width:6px; height:6px; border-radius:50%; background:${activeIdx === 1 ? '#FF6A00' : 'rgba(255,255,255,0.75)'};"></span>
                        <span class="card-swipe-dot" style="width:6px; height:6px; border-radius:50%; background:${activeIdx === 2 ? '#FF6A00' : 'rgba(255,255,255,0.75)'};"></span>
                    </div>
                </div>
                <div class="ecom-body">
                    <div>
                        <div class="thumb-row">
                            <img src="${item.img1}" class="thumb-box ${activeSrc === item.img1 ? 'active' : ''}" onload="this.classList.add('img-loaded')" onclick="switchWeddingThumb(event, ${index}, 1, this)" title="ছবি ১">
                            <img src="${item.img2}" class="thumb-box ${activeSrc === item.img2 ? 'active' : ''}" onload="this.classList.add('img-loaded')" onclick="switchWeddingThumb(event, ${index}, 2, this)" title="ছবি ২">
                            <img src="${item.img3}" class="thumb-box ${activeSrc === item.img3 ? 'active' : ''}" onload="this.classList.add('img-loaded')" onclick="switchWeddingThumb(event, ${index}, 3, this)" title="ছবি ৩">
                        </div>
                        <div class="ecom-title">${item.name}</div>
                        <div class="ecom-meta">ডিজাইন কোড: ${item.code}</div>
                        <span class="ecom-price-main">মূল্য: ${item.price}</span>
                    </div>
                    <button type="button" class="ecom-green-btn" style="margin-top: 6px;">
                        <i class="fa-brands fa-whatsapp"></i> অর্ডার করুন
                    </button>
                </div>
            `;
            container.appendChild(cardDiv);

            if ((index + 1) % 4 === 0) {
                container.appendChild(createCatalogAdBox());
            }
        });

        document.getElementById('selectedWeddingDesignDisplay').value = `${selectedCardDesign} | মূল্য: ${selectedCardPrice}`;
    }

    function submitWeddingToWhatsApp() {
        const printOptionEl = document.querySelector('input[name="weddingPrintOption"]:checked');
        const printOption = printOptionEl ? printOptionEl.value : 'প্রিন্ট করতে চাই';
        const deliveryMethod = document.querySelector('input[name="weddingDeliveryMethod"]:checked').value;

        const message = `*নতুন অর্ডার রিকোয়েস্ট (Sub Prints)*%0A` +
                        `--------------------------------%0A` +
                        `• সার্ভিস: বিয়ের কার্ড%0A` +
                        `• ক্যাটাগরি: ${selectedType} কার্ড%0A` +
                        `• কাজের ধরন: ${printOption}%0A` +
                        `• অর্ডার পরিমাণ: ${currentQuantity} পিস%0A` +
                        `• পছন্দ করা ডিজাইন: ${selectedCardDesign}%0A` +
                        `• নির্ধারিত মূল্য: ${selectedCardPrice}%0A` +
                        `• ডিজাইনের ছবির লিঙ্ক: ${encodeURIComponent(selectedCardImg)}%0A` +
                        `• ডেলিভারি মাধ্যম: ${deliveryMethod}%0A` +
                        `--------------------------------%0A` +
                        `আমি অর্ডার ফাইনাল করতে চাই।`;
        window.open(`https://wa.me/919732322525?text=${message}`, '_blank');
    }

/* ---------------- ২. অন্নপ্রাশন কার্ড (ফ্রন্ট স্টাইল + ৩টি ছবি + দাম + ৪ কার্ড পর ১ অ্যাড + ছবির লিঙ্ক) ---------------- */
let selectedAnnaType = 'অফসেট কার্ড';
    let currentAnnaQuantity = 100;
    let selectedAnnaDesign = '';
    let selectedAnnaPrice = '';
    let selectedAnnaImg = '';
    let currentAnnaList = [];

    const annaprashanCatalogs = {
        'অফসেট কার্ড': [
            { id: 'AO01', name: 'অফসেট অন্নপ্রাশন ০১', code: 'AP-OF01', price: '₹১০ / পিস', img1: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80' },
            { id: 'AO02', name: 'অফসেট অন্নপ্রাশন ০২', code: 'AP-OF02', price: '₹১২ / পিস', img1: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80' },
            { id: 'AO03', name: 'অফসেট অন্নপ্রাশন ০৩', code: 'AP-OF03', price: '₹১২ / পিস', img1: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80' },
            { id: 'AO04', name: 'অফসেট অন্নপ্রাশন ০৪', code: 'AP-OF04', price: '₹১৪ / পিস', img1: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80' },
            { id: 'AO05', name: 'অফসেট অন্নপ্রাশন ০৫', code: 'AP-OF05', price: '₹১৪ / পিস', img1: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80' },
            { id: 'AO06', name: 'অফসেট অন্নপ্রাশন ০৬', code: 'AP-OF06', price: '₹১৫ / পিস', img1: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80' },
            { id: 'AO07', name: 'অফসেট অন্নপ্রাশন ০৭', code: 'AP-OF07', price: '₹১৫ / পিস', img1: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80' },
            { id: 'AO08', name: 'অফসেট অন্নপ্রাশন ০৮', code: 'AP-OF08', price: '₹১৬ / পিস', img1: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80' },
            { id: 'AO09', name: 'অফসেট অন্নপ্রাশন ০৯', code: 'AP-OF09', price: '₹১৬ / পিস', img1: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80' },
            { id: 'AO10', name: 'অফসেট অন্নপ্রাশন ১০', code: 'AP-OF10', price: '₹১৮ / পিস', img1: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80' },
            { id: 'AO11', name: 'অফসেট অন্নপ্রাশন ১১', code: 'AP-OF11', price: '₹১৮ / পিস', img1: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80' },
            { id: 'AO12', name: 'অফসেট অন্নপ্রাশন ১২', code: 'AP-OF12', price: '₹২০ / পিস', img1: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80' },
            { id: 'AO13', name: 'অফসেট অন্নপ্রাশন ১৩', code: 'AP-OF13', price: '₹২০ / পিস', img1: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80' },
            { id: 'AO14', name: 'অফসেট অন্নপ্রাশন ১৪', code: 'AP-OF14', price: '₹২২ / পিস', img1: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80' },
            { id: 'AO15', name: 'অফসেট অন্নপ্রাশন ১৫', code: 'AP-OF15', price: '₹২৫ / পিস', img1: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80' }
        ],
        'ডিজিট্যাল কার্ড': [
            { 
                id: 'AD01', 
                name: 'ডিজিট্যাল অন্নপ্রাশন সাইজ 9x6 ০১', 
                code: 'AP-DG01', 
                price: '₹১৫ / পিস',
                img1: 'https://lh3.googleusercontent.com/d/1FzQp4B64ehmlKM8_kIINHNQJ_M8nrmXo', 
                img2: 'https://lh3.googleusercontent.com/d/13CikAaZ8Tgz-y_JnUPlbGAZcPsDxoHQO', 
                img3: 'https://lh3.googleusercontent.com/d/1oTKcmYfO-9vu9zVChSty3rAL7iEiZ6EC' 
            },
            { 
                id: 'AD02', 
                name: 'ডিজিট্যাল অন্নপ্রাশন সাইজ 9x6 ০২', 
                code: 'AP-DG02', 
                price: '₹১৫ / পিস',
                img1: 'https://lh3.googleusercontent.com/d/1nmvZ79D1OKyzxO4LyJHy0SH2b8ovPc7A', 
                img2: 'https://lh3.googleusercontent.com/d/1NIU25r0jRkED6N7H2kBEn_QwHXf-ICpf', 
                img3: 'https://lh3.googleusercontent.com/d/1oTKcmYfO-9vu9zVChSty3rAL7iEiZ6EC' 
            },
            { 
                id: 'AD03', 
                name: 'ডিজিট্যাল অন্নপ্রাশন পোস্ট কার্ড সাইজ 4x6 ০৩', 
                code: 'AP-DG03', 
                price: '₹১২ / পিস',
                img1: 'https://lh3.googleusercontent.com/d/1byuFzUoDAJ4-1VPyHig6_lCf8A7508vJ', 
                img2: 'https://lh3.googleusercontent.com/d/13CikAaZ8Tgz-y_JnUPlbGAZcPsDxoHQO', 
                img3: 'https://lh3.googleusercontent.com/d/1oTKcmYfO-9vu9zVChSty3rAL7iEiZ6EC' 
            },
            { id: 'AD04', name: 'ডিজিট্যাল অন্নপ্রাশন ০৪', code: 'AP-DG04', price: '₹১৫ / পিস', img1: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&auto=format&fit=crop&q=80' },
            { id: 'AD05', name: 'ডিজিট্যাল অন্নপ্রাশন ০৫', code: 'AP-DG05', price: '₹১৫ / পিস', img1: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80' },
            { id: 'AD06', name: 'ডিজিট্যাল অন্নপ্রাশন ০৬', code: 'AP-DG06', price: '₹১৮ / পিস', img1: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80' },
            { id: 'AD07', name: 'ডিজিট্যাল অন্নপ্রাশন ০৭', code: 'AP-DG07', price: '₹১৮ / পিস', img1: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=80' },
            { id: 'AD08', name: 'ডিজিট্যাল অন্নপ্রাশন ০৮', code: 'AP-DG08', price: '₹১৮ / পিস', img1: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&auto=format&fit=crop&q=80' },
            { id: 'AD09', name: 'ডিজিট্যাল অন্নপ্রাশন ০৯', code: 'AP-DG09', price: '₹২০ / পিস', img1: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80' },
            { id: 'AD10', name: 'ডিজিট্যাল অন্নপ্রাশন ১০', code: 'AP-DG10', price: '₹২০ / পিস', img1: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80' },
            { id: 'AD11', name: 'ডিজিট্যাল অন্নপ্রাশন ১১', code: 'AP-DG11', price: '₹২০ / পিস', img1: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80' },
            { id: 'AD12', name: 'ডিজিট্যাল অন্নপ্রাশন ১২', code: 'AP-DG12', price: '₹২২ / পিস', img1: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&auto=format&fit=crop&q=80' },
            { id: 'AD13', name: 'ডিজিট্যাল অন্নপ্রাশন ১৩', code: 'AP-DG13', price: '₹২২ / পিস', img1: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=80' },
            { id: 'AD14', name: 'ডিজিট্যাল অন্নপ্রাশন ১৪', code: 'AP-DG14', price: '₹২৫ / পিস', img1: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80' },
            { id: 'AD15', name: 'ডিজিট্যাল অন্নপ্রাশন ১৫', code: 'AP-DG15', price: '₹২৫ / পিস', img1: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&auto=format&fit=crop&q=80', img2: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80', img3: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80' }
        ]
    };

    function openAnnaprashanFlow() {
        document.getElementById('annaQuantity').value = '100';
        selectAnnaType('অফসেট কার্ড');
        document.getElementById('annaprashanStep1').style.display = 'flex';
    }

    function selectAnnaType(type) {
        selectedAnnaType = type;
        if(type === 'অফসেট কার্ড') {
            document.getElementById('typeOffset').classList.add('active');
            document.getElementById('typeDigital').classList.remove('active');
        } else {
            document.getElementById('typeOffset').classList.remove('active');
            document.getElementById('typeDigital').classList.add('active');
        }
    }

    function proceedToAnnaCatalog() {
        const rawVal = document.getElementById('annaQuantity').value;
        const qty = parseQuantityNumber(rawVal);

        if (!rawVal || isNaN(qty) || qty <= 0) {
            alert('অনুগ্রহ করে সঠিক সংখ্যায় অন্নপ্রাশন কার্ডের পরিমাণ লিখুন।');
            document.getElementById('annaQuantity').focus();
            return;
        }

        currentAnnaQuantity = qty;
        closeModal('annaprashanStep1');

        // ডিজিট্যাল কার্ড হলে 'শুধু কার্ড দরকার' অপশন লুকিয়ে শুধু প্রিন্ট অপশন রাখা হচ্ছে
        const printGroup = document.getElementById('annaPrintOptionGroup');
        const printRadios = document.getElementsByName('annaPrintOption');
        if (printGroup) {
            if (selectedAnnaType === 'ডিজিট্যাল কার্ড') {
                printGroup.style.display = 'none';
                if (printRadios.length > 0) printRadios[0].checked = true;
            } else {
                printGroup.style.display = 'block';
            }
        }

        currentAnnaList = annaprashanCatalogs[selectedAnnaType];
        currentAnnaList.forEach(item => { item.currentImg = item.img1; });

        selectedAnnaDesign = `${currentAnnaList[0].name} (${currentAnnaList[0].code})`;
        selectedAnnaPrice = currentAnnaList[0].price;
        selectedAnnaImg = currentAnnaList[0].img1;

        document.getElementById('annaCatalogTitle').innerText = `অন্নপ্রাশন ${selectedAnnaType} ক্যাটালগ`;
        document.getElementById('annaCatalogSubtitle').innerText = `পছন্দের ডিজাইন নির্বাচন করুন | অর্ডার পরিমাণ: ${qty} পিস`;

        triggerAdFlow('anna');
    }

    let annaTouchStartX = 0;
    let annaTouchStartY = 0;
    let annaCardJustSwiped = false;

    function handleAnnaTouchStart(e) {
        annaTouchStartX = e.touches[0].clientX;
        annaTouchStartY = e.touches[0].clientY;
        annaCardJustSwiped = false;
    }

    function handleAnnaTouchEnd(e, index) {
        const diffX = e.changedTouches[0].clientX - annaTouchStartX;
        const diffY = e.changedTouches[0].clientY - annaTouchStartY;

        // ছবির ওপর হাত দিয়ে ডানে-বামে সরালে পরপর ৩টি ছবি বদলাবে
        if (Math.abs(diffX) > 30 && Math.abs(diffX) > Math.abs(diffY)) {
            e.stopPropagation();
            annaCardJustSwiped = true;

            const item = currentAnnaList[index];
            const imgs = [item.img1, item.img2, item.img3];
            const currentSrc = item.currentImg || item.img1;
            let currIdx = imgs.indexOf(currentSrc);
            if (currIdx === -1) currIdx = 0;

            if (diffX < 0) {
                currIdx = (currIdx + 1) % 3; // বামে সরালে পরের ছবি
            } else {
                currIdx = (currIdx + 2) % 3; // ডানে সরালে আগের ছবি
            }

            const newSrc = imgs[currIdx];
            item.currentImg = newSrc;

            const mainImg = document.getElementById(`anna-main-img-${index}`);
            if (mainImg) {
                mainImg.classList.remove('img-loaded');
                mainImg.src = newSrc;
            }

            const cardEl = mainImg ? mainImg.closest('.ecom-card') : null;
            if (cardEl) {
                cardEl.querySelectorAll('.thumb-box').forEach((t, i) => {
                    t.classList.toggle('active', i === currIdx);
                });
                cardEl.querySelectorAll('.card-swipe-dot').forEach((d, i) => {
                    d.style.background = (i === currIdx) ? '#FF6A00' : 'rgba(255,255,255,0.75)';
                });
            }

            if (selectedAnnaDesign === `${item.name} (${item.code})`) {
                selectedAnnaImg = newSrc;
            }

            setTimeout(() => { annaCardJustSwiped = false; }, 250);
        }
    }

    function openAnnaCardImageClick(e, index, title) {
        if (e) e.stopPropagation();
        if (annaCardJustSwiped) return;
        const item = currentAnnaList[index];
        const imgs = [item.img1, item.img2, item.img3];
        const currentSrc = item.currentImg || item.img1;
        const startIdx = Math.max(0, imgs.indexOf(currentSrc));
        if (typeof openGalleryLightbox === 'function') {
            openGalleryLightbox(imgs, startIdx, title);
        } else {
            openImageLightbox(e, currentSrc, title);
        }
    }

    function renderAnnaCatalogGrid() {
        const container = document.getElementById('annaCatalogContainer');
        container.innerHTML = '';

        currentAnnaList.forEach((item, index) => {
            const fullDesignTitle = `${item.name} (${item.code})`;
            const isSelected = (selectedAnnaDesign === fullDesignTitle);
            const activeSrc = item.currentImg || item.img1;
            const activeIdx = Math.max(0, [item.img1, item.img2, item.img3].indexOf(activeSrc));

            const cardDiv = document.createElement('div');
            cardDiv.className = `ecom-card ${isSelected ? 'selected' : ''}`;
            cardDiv.onclick = () => selectAnnaCardByIndex(index);

            const mainImgId = `anna-main-img-${index}`;
            const badgeClass = (index % 2 === 0) ? 'badge-bestseller' : 'badge-trending';
            const badgeText = (index % 2 === 0) ? 'জনপ্রিয়' : 'নতুন কালেকশন';

            cardDiv.innerHTML = `
                <div class="ecom-img-box" style="touch-action: pan-y;" ontouchstart="handleAnnaTouchStart(event)" ontouchend="handleAnnaTouchEnd(event, ${index})">
                    <span class="ecom-badge ${badgeClass}">${badgeText}</span>
                    <img src="${activeSrc}" id="${mainImgId}" alt="${item.name}" title="বড় করে দেখতে ক্লিক করুন বা পাশে সরান" onload="this.classList.add('img-loaded')" onclick="openAnnaCardImageClick(event, ${index}, '${fullDesignTitle} | মূল্য: ${item.price}')">
                    <div style="position:absolute; bottom:6px; left:50%; transform:translateX(-50%); display:flex; gap:5px; background:rgba(0,0,0,0.4); padding:3px 8px; border-radius:10px; pointer-events:none;">
                        <span class="card-swipe-dot" style="width:6px; height:6px; border-radius:50%; background:${activeIdx === 0 ? '#FF6A00' : 'rgba(255,255,255,0.75)'};"></span>
                        <span class="card-swipe-dot" style="width:6px; height:6px; border-radius:50%; background:${activeIdx === 1 ? '#FF6A00' : 'rgba(255,255,255,0.75)'};"></span>
                        <span class="card-swipe-dot" style="width:6px; height:6px; border-radius:50%; background:${activeIdx === 2 ? '#FF6A00' : 'rgba(255,255,255,0.75)'};"></span>
                    </div>
                </div>
                <div class="ecom-body">
                    <div>
                        <div class="thumb-row">
                            <img src="${item.img1}" class="thumb-box ${activeSrc === item.img1 ? 'active' : ''}" onload="this.classList.add('img-loaded')" onclick="switchAnnaThumb(event, ${index}, 1, this)" title="ছবি ১">
                            <img src="${item.img2}" class="thumb-box ${activeSrc === item.img2 ? 'active' : ''}" onload="this.classList.add('img-loaded')" onclick="switchAnnaThumb(event, ${index}, 2, this)" title="ছবি ২">
                            <img src="${item.img3}" class="thumb-box ${activeSrc === item.img3 ? 'active' : ''}" onload="this.classList.add('img-loaded')" onclick="switchAnnaThumb(event, ${index}, 3, this)" title="ছবি ৩">
                        </div>
                        <div class="ecom-title">${item.name}</div>
                        <div class="ecom-meta">ডিজাইন কোড: ${item.code}</div>
                        <span class="ecom-price-main">মূল্য: ${item.price}</span>
                    </div>
                    <button type="button" class="ecom-green-btn" style="margin-top: 6px;">
                        <i class="fa-brands fa-whatsapp"></i> অর্ডার করুন
                    </button>
                </div>
            `;
            container.appendChild(cardDiv);

            if ((index + 1) % 4 === 0) {
                container.appendChild(createCatalogAdBox());
            }
        });

        document.getElementById('selectedAnnaDesignDisplay').value = `${selectedAnnaDesign} | মূল্য: ${selectedAnnaPrice}`;
    }

    function switchAnnaThumb(e, index, imgNum, thumbEl) {
        e.stopPropagation();
        const item = currentAnnaList[index];
        const newSrc = item['img' + imgNum];
        item.currentImg = newSrc;

        const mainImgId = `anna-main-img-${index}`;
        changeDisplayImage(mainImgId, newSrc, thumbEl);

        const cardEl = thumbEl ? thumbEl.closest('.ecom-card') : null;
        if (cardEl) {
            cardEl.querySelectorAll('.card-swipe-dot').forEach((d, i) => {
                d.style.background = (i === (imgNum - 1)) ? '#FF6A00' : 'rgba(255,255,255,0.75)';
            });
        }

        if (selectedAnnaDesign === `${item.name} (${item.code})`) {
            selectedAnnaImg = newSrc;
        }
    }

    function selectAnnaCardByIndex(index) {
        const item = currentAnnaList[index];
        selectedAnnaDesign = `${item.name} (${item.code})`;
        selectedAnnaPrice = item.price;
        selectedAnnaImg = item.currentImg || item.img1;
        renderAnnaCatalogGrid();
    }

    function submitAnnaToWhatsApp() {
        const printOptionEl = document.querySelector('input[name="annaPrintOption"]:checked');
        const printOption = (selectedAnnaType === 'ডিজিট্যাল কার্ড')
            ? 'প্রিন্ট করতে চাই'
            : (printOptionEl ? printOptionEl.value : 'প্রিন্ট করতে চাই');
        const delivery = document.querySelector('input[name="annaDeliveryMethod"]:checked').value;

        const message = `*নতুন অর্ডার রিকোয়েস্ট (Sub Prints)*%0A` +
                        `--------------------------------%0A` +
                        `• সার্ভিস: অন্নপ্রাশন কার্ড%0A` +
                        `• কার্ডের ধরন: ${selectedAnnaType}%0A` +
                        `• কাজের ধরন: ${printOption}%0A` +
                        `• অর্ডার পরিমাণ: ${currentAnnaQuantity} পিস%0A` +
                        `• পছন্দ করা ডিজাইন: ${selectedAnnaDesign}%0A` +
                        `• নির্ধারিত মূল্য: ${selectedAnnaPrice}%0A` +
                        `• ডিজাইনের ছবির লিঙ্ক: ${encodeURIComponent(selectedAnnaImg)}%0A` +
                        `• ডেলিভারি মাধ্যম: ${delivery}%0A` +
                        `--------------------------------%0A` +
                        `আমি অন্নপ্রাশন কার্ডের অর্ডার কনফার্ম করতে চাই।`;
        window.open(`https://wa.me/919732322525?text=${message}`, '_blank');
    }

    /* ---------------- ৩. মেনু কার্ড (ই-কমার্স স্টাইল + ৪টি কার্ডের পর ১টি অ্যাড বক্স) ---------------- */
    let currentMenuOccasion = 'বিয়ের মেনুকার্ড';
    let currentMenuQuantity = 0;
    let selectedMenuDesign = '';
    let selectedMenuImg = '';
    let currentMenuList = [];

    const menuCatalogsByOccasion = {
        'বিয়ের মেনুকার্ড': [
            { id: 'WMN01', name: 'বিয়ের স্পেশাল মেনু ০১', code: 'W-MN01', img: 'https://lh3.googleusercontent.com/d/1VbDUORKAaXfnO0OSI_0sNZ0AFFSBtIi2' },
            { id: 'WMN02', name: 'বিয়ের আধার স্টাইল মেনু ০২', code: 'W-MN02', img: 'https://lh3.googleusercontent.com/d/1xUnWC_QxpyLZsiiV7c8BHfPmLSRWUs9J' },
            { id: 'WMN03', name: 'বিয়ের টেবিল মেনুকার্ড ডিজাইন ০৩', code: 'W-MN03', img: 'https://lh3.googleusercontent.com/d/1GQD1dgESQKqLHZKFlQZkYGOEEU2OjS20' },
            { id: 'WMN04', name: 'বিয়ের টেবিল মেনুকার্ড ডিজাইন ০৪', code: 'W-MN04', img: 'https://lh3.googleusercontent.com/d/1_245G2pAbG2Djfh2ebKx8mzjbtfG8q9h' },
            { id: 'WMN05', name: 'হ্যাণ্ড মেনুকার্ড ডিজাইন ০৫', code: 'W-MN05', img: 'https://lh3.googleusercontent.com/d/1RtgEKbyMhhiiYdRXvNBK_-wGYOGkBPr3' },
            { id: 'WMN06', name: 'হ্যাণ্ড মেনুকার্ড ডিজাইন ০৬', code: 'W-MN06', img: 'https://lh3.googleusercontent.com/d/1EPylHqAI_08HSy0KB50IbyJgDLvRiIMR' },
            { id: 'WMN07', name: 'রিং সেরিমনি মেনু ০৭', code: 'W-MN07', img: 'https://lh3.googleusercontent.com/d/1VYoccJs18570Z7buBO2JvQOYDIozjoID' },
            { id: 'WMN08', name: 'সুমি : স্পেশাল বিয়ের মেনু কার্ড ০৮', img: 'https://lh3.googleusercontent.com/d/10NHm8HDjs_kYjjLVyZBvu1vFrXgfZFPe' },
            { id: 'WMN09', name: 'সুমি : স্পেশাল বিয়ের মেনু কার্ড ০৯', img: 'https://lh3.googleusercontent.com/d/17f-VMFOX5UQfE3eq2ti77D5BhjVbLcfj' },
            { id: 'WMN10', name: 'বিয়ের লাক্সারি ফয়েল মেনু ১০', code: 'W-MN10', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80' }
        ],
        'অন্নপ্রাশন মেনুকার্ড': [
            { id: 'AMN01', name: 'অন্নপ্রাশন ডিজিট্যাল মেনু ডিজাইন ০১', code: 'A-MN01', img: 'https://lh3.googleusercontent.com/d/19WGzQhbp2NxnAfggxv3PvTDV0_NDhoUt' },
            { id: 'AMN02', name: 'অন্নপ্রাশন ডিজিট্যাল মেনু ডিজাইন ০২', code: 'A-MN02', img: 'https://lh3.googleusercontent.com/d/1JFDnhSAoxT040RY1ZcKkrSX-TQLocWWg' },
            { id: 'AMN03', name: 'অন্নপ্রাশন থিম ডেকোরেশন ০৩', code: 'A-MN03', img: 'https://lh3.googleusercontent.com/d/1IeKnC7vUA-JmmQCB7jD9sCaxkhAclryb' },
            { id: 'AMN04', name: 'অন্নপ্রাশন কার্টুন প্রিন্ট ০৪', code: 'A-MN04', img: 'https://lh3.googleusercontent.com/d/1GRfO9CVxlHUIm5Gk3ufIrkdSIW-BQEmM' },
            { id: 'AMN06', name: 'অন্নপ্রাশন রঙিন ভোজ ০৬', code: 'A-MN06', img: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80' },
            { id: 'AMN07', name: 'অন্নপ্রাশন ফটো ফ্রেম মেনু ০৭', code: 'A-MN07', img: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&auto=format&fit=crop&q=80' },
            { id: 'AMN08', name: 'অন্নপ্রাশন সিঙ্গেল পেজ ০৮', code: 'A-MN08', img: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=80' },
            { id: 'AMN09', name: 'অন্নপ্রাশন প্রিমিয়াম ডাইকাট ০৯', code: 'A-MN09', img: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80' },
            { id: 'AMN10', name: 'অন্নপ্রাশন উৎসব স্পেশাল ১০', code: 'A-MN10', img: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80' }
        ],
        'জন্মদিন মেনুকার্ড': [
            { id: 'BMN01', name: 'শুভ জন্মদিন টেবিল মেনুকার্ড ০১', code: 'B-MN01', img: 'https://lh3.googleusercontent.com/d/1gcby_KM48rxC2p6hSQ77Lyxnm40P2hHv' },
            { id: 'BMN02', name: 'জন্মদিনের হ্যাণ্ড মেনুকার্ড ডিজাইন ০২', code: 'B-MN02', img: 'https://lh3.googleusercontent.com/d/1x-sKEo8D6DM0cu95uBYhlpj56dlce-HH' },
            { id: 'BMN03', name: ' সুমি : স্পেশাল জন্মদিন মেনু কার্ড ০৩', img: 'https://lh3.googleusercontent.com/d/1p2cGPI8qxm_kT09g9uh33Hs1T48ZIoSw' },
            { id: 'BMN04', name: 'কিডস বার্থডে মেনু ০৪', code: 'B-MN04', img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80' },
            { id: 'BMN05', name: 'বার্থডে ডিনার কার্ড ০৫', code: 'B-MN05', img: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80' },
            { id: 'BMN06', name: 'চকলেট থিম বার্থডে ০৬', code: 'B-MN06', img: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80' },
            { id: 'BMN07', name: 'ম্যাজিক শো বার্থডে ০৭', code: 'B-MN07', img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80' },
            { id: 'BMN08', name: 'কালারফুল পার্টি কার্ড ০৮', code: 'B-MN08', img: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80' },
            { id: 'BMN09', name: 'মিউজিক্যাল বার্থডে ০৯', code: 'B-MN09', img: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80' },
            { id: 'BMN10', name: 'গ্র্যান্ড বার্থডে ফিস্ট ১০', code: 'B-MN10', img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80' }
        ],
        'উপনয়ন মেনুকার্ড': [
            { id: 'UMN01', name: 'উপনয়ন পবিত্র শান্ত ০১', code: 'U-MN01', img: 'https://images.unsplash.com/photo-1545232979-fbf6c63b787d?w=600&auto=format&fit=crop&q=80' },
            { id: 'UMN02', name: 'পৈতে স্পেশাল মেনু ০২', code: 'U-MN02', img: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80' },
            { id: 'UMN03', name: 'বৈদিক উপনয়ন ভোজ ০৩', code: 'U-MN03', img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80' },
            { id: 'UMN04', name: 'উপনয়ন হলুদ-গেরুয়া ০৪', code: 'U-MN04', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80' },
            { id: 'UMN05', name: 'উপনয়ন প্রথাগত ০৫', code: 'U-MN05', img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80' },
            { id: 'UMN06', name: 'উপনয়ন ক্লাসিক কার্ড ০৬', code: 'U-MN06', img: 'https://images.unsplash.com/photo-1545232979-fbf6c63b787d?w=600&auto=format&fit=crop&q=80' },
            { id: 'UMN07', name: 'উপনয়ন স্মরণিকা ০৭', code: 'U-MN07', img: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80' },
            { id: 'UMN08', name: 'উপনয়ন প্রিমিয়াম ফোল্ড ০৮', code: 'U-MN08', img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80' },
            { id: 'UMN09', name: 'উপনয়ন ভোজ কার্ড ০৯', code: 'U-MN09', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80' },
            { id: 'UMN10', name: 'উপনয়ন শুভ দিন ১০', code: 'U-MN10', img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80' }
        ],
        'শ্রাদ্ধের মেনুকার্ড': [
            { id: 'SMN01', name: 'শ্রাদ্ধ ও স্মরণানুষ্ঠান ০১', code: 'S-MN01', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80' },
            { id: 'SMN02', name: 'শান্তিপূর্ণ স্মৃতি ভোজ ০২', code: 'S-MN02', img: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=600&auto=format&fit=crop&q=80' },
            { id: 'SMN03', name: 'শ্রদ্ধাঞ্জলি মেনু কার্ড ০৩', code: 'S-MN03', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80' },
            { id: 'SMN04', name: 'স্মৃতিচারণ ভোজ কার্ড ০৪', code: 'S-MN04', img: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=600&auto=format&fit=crop&q=80' },
            { id: 'SMN05', name: 'শান্তিশোভন শ্রাদ্ধ মেনু ০৫', code: 'S-MN05', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80' },
            { id: 'SMN06', name: 'শ্রাদ্ধ বাৎসরিক ভোজ ০৬', code: 'S-MN06', img: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=600&auto=format&fit=crop&q=80' },
            { id: 'SMN07', name: 'স্মারক ভোজ মেনু ০৭', code: 'S-MN07', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80' },
            { id: 'SMN08', name: 'নির্মল শান্তি মেনু ০৮', code: 'S-MN08', img: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=600&auto=format&fit=crop&q=80' },
            { id: 'SMN09', name: 'পুণ্য স্মরণ মেনু ০৯', code: 'S-MN09', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80' },
            { id: 'SMN10', name: 'শ্রদ্ধাবাসর ভোজ ১০', code: 'S-MN10', img: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=600&auto=format&fit=crop&q=80' }
        ],
        'রেস্টুরেণ্ট মেনুকার্ড': [
            { id: 'RMN01', name: 'রেস্টুরেন্ট ডাইনিং বুকলেট ০১', code: 'R-MN01', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80' },
            { id: 'RMN02', name: 'ক্যাফে ও ফাস্টফুড সিঙ্গেল ০২', code: 'R-MN02', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80' },
            { id: 'RMN03', name: 'প্রিমিয়াম বার ও লাউঞ্জ ০৩', code: 'R-MN03', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80' },
            { id: 'RMN04', name: 'ফোল্ডিং ফুড মেনু ০৪', code: 'R-MN04', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop&q=80' },
            { id: 'RMN05', name: 'টেবিল টপ কিউআর মেনু ০৫', code: 'R-MN05', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80' },
            { id: 'RMN06', name: 'লেদার কভার রেস্টুরেন্ট ০৬', code: 'R-MN06', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80' },
            { id: 'RMN07', name: 'স্পেশাল বুফে মেনু ০৭', code: 'R-MN07', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80' },
            { id: 'RMN08', name: 'স্ট্রিট ফুড ও স্ন্যাক্স ০৮', code: 'R-MN08', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop&q=80' },
            { id: 'RMN09', name: 'ফ্যামিলি রেস্তোরাঁ মেনু ০৯', code: 'R-MN09', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80' },
            { id: 'RMN10', name: 'বেকারি ও ডেজার্ট কার্ড ১০', code: 'R-MN10', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80' }
        ],
    };

    function openMenuCardFlow() {
        document.getElementById('menuQuantity').value = '';
        document.getElementById('menuModalStep1').style.display = 'flex';
    }

    let menuSkeletonShown = false;
    let menuTouchStartX = 0;
    let menuTouchStartY = 0;
    let menuCardJustSwiped = false;

    function getMenuItemImages(item) {
        return [item.img1 || item.img, item.img2, item.img3].filter(Boolean);
    }

    function proceedToMenuCatalog() {
        const rawVal = document.getElementById('menuQuantity').value;
        const qty = parseQuantityNumber(rawVal);

        if (!rawVal || isNaN(qty) || qty <= 0) {
            alert('অনুগ্রহ করে সঠিক সংখ্যায় মেনুকার্ডের পরিমাণ লিখুন (যেমন: ৫০, ১০০, ২০০ ইত্যাদি)।');
            document.getElementById('menuQuantity').focus();
            return;
        }

        currentMenuOccasion = document.getElementById('menuOccasion').value;
        currentMenuQuantity = qty;
        closeModal('menuModalStep1');

        currentMenuList = menuCatalogsByOccasion[currentMenuOccasion] || menuCatalogsByOccasion['বিয়ের মেনুকার্ড'];
        currentMenuList.forEach(item => {
            const imgs = getMenuItemImages(item);
            item.currentImg = imgs[0];
        });

        selectedMenuDesign = `${currentMenuList[0].name} (${currentMenuList[0].code})`;
        selectedMenuImg = currentMenuList[0].currentImg;
        menuSkeletonShown = false;

        document.getElementById('menuCatalogTitle').innerText = `${currentMenuOccasion} ক্যাটালগ`;
        document.getElementById('menuCatalogSubtitle').innerText = `পছন্দের ডিজাইন নির্বাচন করুন | অর্ডার পরিমাণ: ${qty} পিস`;

        triggerAdFlow('menu');
    }

    function handleMenuTouchStart(e) {
        menuTouchStartX = e.touches[0].clientX;
        menuTouchStartY = e.touches[0].clientY;
        menuCardJustSwiped = false;
    }

    function handleMenuTouchEnd(e, index) {
        const item = currentMenuList[index];
        const imgs = getMenuItemImages(item);
        if (imgs.length <= 1) return;

        const diffX = e.changedTouches[0].clientX - menuTouchStartX;
        const diffY = e.changedTouches[0].clientY - menuTouchStartY;

        if (Math.abs(diffX) > 30 && Math.abs(diffX) > Math.abs(diffY)) {
            e.stopPropagation();
            menuCardJustSwiped = true;

            const currentSrc = item.currentImg || imgs[0];
            let currIdx = imgs.indexOf(currentSrc);
            if (currIdx === -1) currIdx = 0;

            if (diffX < 0) {
                currIdx = (currIdx + 1) % imgs.length;
            } else {
                currIdx = (currIdx - 1 + imgs.length) % imgs.length;
            }

            const newSrc = imgs[currIdx];
            item.currentImg = newSrc;

            const mainImg = document.getElementById(`menu-main-img-${index}`);
            if (mainImg) {
                mainImg.classList.remove('img-loaded');
                mainImg.src = newSrc;
            }

            const cardEl = mainImg ? mainImg.closest('.ecom-card') : null;
            if (cardEl) {
                cardEl.querySelectorAll('.thumb-box').forEach((t, i) => {
                    t.classList.toggle('active', i === currIdx);
                });
                cardEl.querySelectorAll('.card-swipe-dot').forEach((d, i) => {
                    d.style.background = (i === currIdx) ? '#FF6A00' : 'rgba(255,255,255,0.75)';
                });
            }

            if (selectedMenuDesign === `${item.name} (${item.code})`) {
                selectedMenuImg = newSrc;
            }

            setTimeout(() => { menuCardJustSwiped = false; }, 250);
        }
    }

    function switchMenuThumb(e, index, imgIdx, thumbEl) {
        e.stopPropagation();
        const item = currentMenuList[index];
        const imgs = getMenuItemImages(item);
        const newSrc = imgs[imgIdx];
        if (!newSrc) return;

        item.currentImg = newSrc;
        changeDisplayImage(`menu-main-img-${index}`, newSrc, thumbEl);

        const cardEl = thumbEl ? thumbEl.closest('.ecom-card') : null;
        if (cardEl) {
            cardEl.querySelectorAll('.card-swipe-dot').forEach((d, i) => {
                d.style.background = (i === imgIdx) ? '#FF6A00' : 'rgba(255,255,255,0.75)';
            });
        }

        if (selectedMenuDesign === `${item.name} (${item.code})`) {
            selectedMenuImg = newSrc;
        }
    }

    function openMenuCardImageClick(e, index, title) {
        if (e) e.stopPropagation();
        if (menuCardJustSwiped) return;
        const item = currentMenuList[index];
        const imgs = getMenuItemImages(item);
        const currentSrc = item.currentImg || imgs[0];
        const startIdx = Math.max(0, imgs.indexOf(currentSrc));
        if (typeof openGalleryLightbox === 'function') {
            openGalleryLightbox(imgs, startIdx, title);
        } else {
            openImageLightbox(e, currentSrc, title);
        }
    }

    function renderMenuCatalogGrid() {
        const container = document.getElementById('menuCatalogContainer');
        if (!container) return;

        if (!menuSkeletonShown && typeof showSkeletonInGrid === 'function') {
            menuSkeletonShown = true;
            showSkeletonInGrid('menuCatalogContainer', 6, renderMenuCatalogGrid);
            return;
        }

        container.innerHTML = '';

        currentMenuList.forEach((item, index) => {
            const fullDesignTitle = `${item.name} (${item.code})`;
            const isSelected = (selectedMenuDesign === fullDesignTitle);
            const imgs = getMenuItemImages(item);
            const activeSrc = item.currentImg || imgs[0];
            const activeIdx = Math.max(0, imgs.indexOf(activeSrc));

            const cardDiv = document.createElement('div');
            cardDiv.className = `ecom-card ${isSelected ? 'selected' : ''}`;
            cardDiv.onclick = () => selectMenuCardByIndex(index);

            const mainImgId = `menu-main-img-${index}`;
            const badgeClass = (index % 2 === 0) ? 'badge-bestseller' : 'badge-trending';
            const badgeText = (index % 2 === 0) ? 'জনপ্রিয়' : 'নতুন কালেকশন';

            const dotsHtml = imgs.length > 1 ? `
                <div style="position:absolute; bottom:6px; left:50%; transform:translateX(-50%); display:flex; gap:5px; background:rgba(0,0,0,0.4); padding:3px 8px; border-radius:10px; pointer-events:none;">
                    ${imgs.map((_, i) => `<span class="card-swipe-dot" style="width:6px; height:6px; border-radius:50%; background:${i === activeIdx ? '#FF6A00' : 'rgba(255,255,255,0.75)'};"></span>`).join('')}
                </div>` : '';

            const thumbsHtml = imgs.length > 1 ? `
                <div class="thumb-row">
                    ${imgs.map((src, i) => `<img src="${src}" class="thumb-box ${activeSrc === src ? 'active' : ''}" onload="this.classList.add('img-loaded')" onclick="switchMenuThumb(event, ${index}, ${i}, this)" title="ছবি ${toBanglaDigits(i + 1)}">`).join('')}
                </div>` : '';

            const priceHtml = item.price ? `<span class="ecom-price-main">মূল্য: ${item.price}</span>` : '';

            cardDiv.innerHTML = `
                <div class="ecom-img-box" style="touch-action: pan-y;" ontouchstart="handleMenuTouchStart(event)" ontouchend="handleMenuTouchEnd(event, ${index})">
                    <span class="ecom-badge ${badgeClass}">${badgeText}</span>
                    <img src="${activeSrc}" id="${mainImgId}" alt="${item.name}" title="বড় করে দেখতে ক্লিক করুন" onload="this.classList.add('img-loaded')" onclick="openMenuCardImageClick(event, ${index}, '${fullDesignTitle}')">
                    ${dotsHtml}
                </div>
                <div class="ecom-body">
                    <div>
                        ${thumbsHtml}
                        <div class="ecom-title">${item.name}</div>
                        <div class="ecom-meta">ডিজাইন কোড: ${item.code}</div>
                        ${priceHtml}
                    </div>
                    <button type="button" class="ecom-green-btn" style="margin-top: 6px;">
                        <i class="fa-brands fa-whatsapp"></i> অর্ডার করুন
                    </button>
                </div>
            `;
            container.appendChild(cardDiv);

            if ((index + 1) % 4 === 0) {
                container.appendChild(createCatalogAdBox());
            }
        });

        document.getElementById('selectedMenuDesignDisplay').value = selectedMenuDesign;
    }

    function selectMenuCardByIndex(index) {
        const item = currentMenuList[index];
        const imgs = getMenuItemImages(item);
        selectedMenuDesign = `${item.name} (${item.code})`;
        selectedMenuImg = item.currentImg || imgs[0];
        renderMenuCatalogGrid();
    }

    function submitMenuToWhatsApp() {
        const deliveryMethod = document.querySelector('input[name="menuDeliveryMethod"]:checked').value;
        const notes = document.getElementById('menuNotes').value.trim() || 'খাবারের তালিকা হোয়াটসঅ্যাপে পাঠাচ্ছি';

        const message = `*নতুন অর্ডার রিকোয়েস্ট (Sub Prints)*%0A` +
                        `--------------------------------%0A` +
                        `• সার্ভিস: মেনু কার্ড%0A` +
                        `• অনুষ্ঠানের ধরন: ${currentMenuOccasion}%0A` +
                        `• অর্ডার পরিমাণ: ${currentMenuQuantity} পিস%0A` +
                        `• পছন্দ করা ডিজাইন: ${selectedMenuDesign}%0A` +
                        `• ডিজাইনের ছবির লিঙ্ক: ${encodeURIComponent(selectedMenuImg)}%0A` +
                        `• মেনু বিবরণ/নোট: ${notes}%0A` +
                        `• ডেলিভারি মাধ্যম: ${deliveryMethod}%0A` +
                        `--------------------------------%0A` +
                        `আমি মেনু কার্ডের অর্ডার কনফার্ম করতে চাই।`;
        window.open(`https://wa.me/919732322525?text=${message}`, '_blank');
    }

    /* ---------------- ৪. ভিজিটিং কার্ড ---------------- */
    let currentVCType = 'PVC card';
    function openVisitingCardFlow() {
        document.getElementById('visitingModal').style.display = 'flex';
    }
    function selectVCType(type) {
        currentVCType = type;
        const ids = {'PVC card':'vcPVC', 'Plastic Card':'vcPlastic', 'GSM 300':'vc300', 'GSM 250':'vc250'};
        Object.values(ids).forEach(id => document.getElementById(id).classList.remove('active'));
        document.getElementById(ids[type]).classList.add('active');
    }
    function submitVCToWhatsApp() {
        const qty = document.getElementById('vcQuantity').value || 100;
        const delivery = document.querySelector('input[name="vcDelivery"]:checked').value;
        const message = `*নতুন অর্ডার রিকোয়েস্ট (Sub Prints)*%0A` +
                        `--------------------------------%0A` +
                        `• সার্ভিস: ভিজিটিং কার্ড%0A` +
                        `• টাইপ: ${currentVCType}%0A` +
                        `• পরিমাণ: ${qty} পিস%0A` +
                        `• ডেলিভারি মাধ্যম: ${delivery}%0A` +
                        `--------------------------------%0A` +
                        `আমি রেট ও ডিজাইন বিষয়ে কথা বলতে চাই।`;
        window.open(`https://wa.me/919732322525?text=${message}`, '_blank');
    }

    /* ---------------- ৫. ফ্লেক্স ব্যানার ---------------- */
    function openFlexFlow() {
        document.getElementById('flexModal').style.display = 'flex';
    }
    function submitFlexToWhatsApp() {
        const opt = document.getElementById('flexOption').value;
        const size = document.getElementById('flexSize').value || 'সাইজ আলোচনা সাপেক্ষে';
        const qty = document.getElementById('flexQty').value || 1;
        const delivery = document.querySelector('input[name="flexDelivery"]:checked').value;
        const message = `*নতুন অর্ডার রিকোয়েস্ট (Sub Prints)*%0A` +
                        `--------------------------------%0A` +
                        `• সার্ভিস: ফ্লেক্স ব্যানার%0A` +
                        `• আইটেম: ${opt}%0A` +
                        `• সাইজ: ${size}%0A` +
                        `• পরিমাণ: ${qty} পিস%0A` +
                        `• ডেলিভারি মাধ্যম: ${delivery}%0A` +
                        `--------------------------------%0A` +
                        `আমি রেট ও বিস্তারিত জানতে চাই।`;
        window.open(`https://wa.me/919732322525?text=${message}`, '_blank');
    }

    /* ---------------- ৬. স্ট্যাম্প ---------------- */
    let currentStamp = '১ পলিমার স্ট্যাম্প কালি ছাড়া';
    function openStampFlow() {
        document.getElementById('stampModal').style.display = 'flex';
    }
    function selectStamp(val) {
        currentStamp = val;
        if(val.includes('পলিমার')) {
            document.getElementById('stampPoly').classList.add('active');
            document.getElementById('stampNeo').classList.remove('active');
        } else {
            document.getElementById('stampPoly').classList.remove('active');
            document.getElementById('stampNeo').classList.add('active');
        }
    }
    function submitStampToWhatsApp() {
        const qty = document.getElementById('stampQty').value || 1;
        const text = document.getElementById('stampText').value || 'হোয়াটসঅ্যাপে জানাচ্ছি';
        const delivery = document.querySelector('input[name="stampDelivery"]:checked').value;
        const message = `*নতুন অর্ডার রিকোয়েস্ট (Sub Prints)*%0A` +
                        `--------------------------------%0A` +
                        `• সার্ভিস: স্ট্যাম্প%0A` +
                        `• ধরন: ${currentStamp}%0A` +
                        `• পরিমাণ: ${qty} পিস%0A` +
                        `• লেখার বিবরণ: ${text}%0A` +
                        `• ডেলিভারি মাধ্যম: ${delivery}%0A` +
                        `--------------------------------%0A` +
                        `আমি অর্ডার কনফার্ম করতে চাই।`;
        window.open(`https://wa.me/919732322525?text=${message}`, '_blank');
    }

    /* ---------------- ৮. বিল বুক প্রিন্ট (১৫টি স্যাম্পল স্লট) ---------------- */
/* ---------------- ৮. বিল বুক প্রিন্ট (১৫টি স্যাম্পল স্লট + ছবির লিঙ্ক সহ) ---------------- */
const billBookProducts = [
        { id: 'bb1', name: 'ক্যাশমেমো প্রিণ্ট ০১', code: 'CM-01', img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80' },
        { id: 'bb2', name: 'প্যাড প্রিণ্ট ০২', code: 'PD-02', img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80' },
        { id: 'bb3', name: 'জি.এস.টি বিল প্রিণ্ট ০৩', code: 'GST-03', img: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80' },
        { id: 'bb4', name: 'পুজোর রসিদ প্রিণ্ট ০৪', code: 'PR-04', img: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80' },
        { id: 'bb5', name: 'চালান বই ০৫', code: 'CH-05', img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80' },
        { id: 'bb6', name: 'মানি রিসিট ০৬', code: 'MR-06', img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80' },
        { id: 'bb7', name: 'অর্ডার স্লিপ বই ০৭', code: 'OS-07', img: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80' },
        { id: 'bb8', name: 'এস্টিমেট বই ০৮', code: 'ES-08', img: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80' },
        { id: 'bb9', name: 'কোটেশন প্যাড ০৯', code: 'QP-09', img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80' },
        { id: 'bb10', name: 'ডেলিভারি চালান ১০', code: 'DC-10', img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80' },
        { id: 'bb11', name: 'হোটেল বিল বুক ১১', code: 'HB-11', img: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80' },
        { id: 'bb12', name: 'ল্যাব রসিদ বই ১২', code: 'LR-12', img: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80' },
        { id: 'bb13', name: 'প্রেসক্রিপশন প্যাড ১৩', code: 'PP-13', img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80' },
        { id: 'bb14', name: 'ক্লাব চাঁদার রসিদ ১৪', code: 'CR-14', img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80' },
        { id: 'bb15', name: 'কাস্টম বিল বুক ১৫', code: 'CB-15', img: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80' }
    ];
    let selectedBillBookDesign = '';
    let selectedBillBookSize = '';
    let selectedBillBookImg = '';
    let billBookTouchStartX = 0;
    let billBookTouchStartY = 0;
    let billBookCardJustSwiped = false;

    function getBillBookImages(item) {
        return [item.img1 || item.img, item.img2].filter(Boolean);
    }

    function toggleBillBookPrintFields() {
        const selectedOption = document.querySelector('input[name="billBookPrintOption"]:checked');
        const nameGroup = document.getElementById('billBookPrintNameGroup');
        if (!nameGroup) return;

        if (selectedOption && selectedOption.value === 'রেডিমেট চাই') {
            nameGroup.style.display = 'none';
        } else {
            nameGroup.style.display = 'block';
        }
    }

    function openBillBookFlow() {
        const list = (typeof billBookProducts !== 'undefined') ? billBookProducts : [];
        if (list.length > 0) {
            list.forEach(item => {
                const imgs = getBillBookImages(item);
                item.currentImg = imgs[0];
            });
            selectedBillBookDesign = `${list[0].name} (${list[0].code})`;
            selectedBillBookSize = list[0].size || '১/৮ (৫.৫ × ৮.৫ ইঞ্চি)';
            selectedBillBookImg = list[0].currentImg;
        }

        const printRadios = document.getElementsByName('billBookPrintOption');
        if (printRadios.length > 0) printRadios[0].checked = true;
        toggleBillBookPrintFields();

        document.getElementById('billBookModal').style.display = 'flex';

        if (typeof showSkeletonInGrid === 'function') {
            showSkeletonInGrid('billBookProductGrid', 6, renderBillBookGrid);
        } else {
            renderBillBookGrid();
        }
    }

    function handleBillBookTouchStart(e) {
        billBookTouchStartX = e.touches[0].clientX;
        billBookTouchStartY = e.touches[0].clientY;
        billBookCardJustSwiped = false;
    }

    function handleBillBookTouchEnd(e, index) {
        const list = (typeof billBookProducts !== 'undefined') ? billBookProducts : [];
        const item = list[index];
        if (!item) return;

        const imgs = getBillBookImages(item);
        if (imgs.length <= 1) return;

        const diffX = e.changedTouches[0].clientX - billBookTouchStartX;
        const diffY = e.changedTouches[0].clientY - billBookTouchStartY;

        // ছবির ওপর হাত দিয়ে ডানে-বামে সরালে ২টি ছবি বদলাবে
        if (Math.abs(diffX) > 30 && Math.abs(diffX) > Math.abs(diffY)) {
            e.stopPropagation();
            billBookCardJustSwiped = true;

            const currentSrc = item.currentImg || imgs[0];
            let currIdx = imgs.indexOf(currentSrc);
            if (currIdx === -1) currIdx = 0;

            currIdx = (currIdx + 1) % imgs.length;
            const newSrc = imgs[currIdx];
            item.currentImg = newSrc;

            const mainImg = document.getElementById(`billbook-main-img-${index}`);
            if (mainImg) {
                mainImg.classList.remove('img-loaded');
                mainImg.src = newSrc;
            }

            const cardEl = mainImg ? mainImg.closest('.ecom-card') : null;
            if (cardEl) {
                cardEl.querySelectorAll('.thumb-box').forEach((t, i) => {
                    t.classList.toggle('active', i === currIdx);
                });
                cardEl.querySelectorAll('.card-swipe-dot').forEach((d, i) => {
                    d.style.background = (i === currIdx) ? '#FF6A00' : 'rgba(255,255,255,0.75)';
                });
            }

            if (selectedBillBookDesign === `${item.name} (${item.code})`) {
                selectedBillBookImg = newSrc;
            }

            setTimeout(() => { billBookCardJustSwiped = false; }, 250);
        }
    }

    function switchBillBookThumb(e, index, imgIdx, thumbEl) {
        e.stopPropagation();
        const list = (typeof billBookProducts !== 'undefined') ? billBookProducts : [];
        const item = list[index];
        if (!item) return;

        const imgs = getBillBookImages(item);
        const newSrc = imgs[imgIdx];
        if (!newSrc) return;

        item.currentImg = newSrc;
        changeDisplayImage(`billbook-main-img-${index}`, newSrc, thumbEl);

        const cardEl = thumbEl ? thumbEl.closest('.ecom-card') : null;
        if (cardEl) {
            cardEl.querySelectorAll('.card-swipe-dot').forEach((d, i) => {
                d.style.background = (i === imgIdx) ? '#FF6A00' : 'rgba(255,255,255,0.75)';
            });
        }

        if (selectedBillBookDesign === `${item.name} (${item.code})`) {
            selectedBillBookImg = newSrc;
        }
    }

    function openBillBookImageClick(e, index) {
        if (e) e.stopPropagation();
        if (billBookCardJustSwiped) return;

        const list = (typeof billBookProducts !== 'undefined') ? billBookProducts : [];
        const item = list[index];
        if (!item) return;

        const imgs = getBillBookImages(item);
        const currentSrc = item.currentImg || imgs[0];
        const startIdx = Math.max(0, imgs.indexOf(currentSrc));
        const sizeText = item.size || '১/৮ (৫.৫ × ৮.৫ ইঞ্চি)';
        const title = `${item.name} (${item.code}) | সাইজ: ${sizeText}`;

        if (typeof openGalleryLightbox === 'function') {
            openGalleryLightbox(imgs, startIdx, title);
        } else {
            openImageLightbox(e, currentSrc, title);
        }
    }

    function renderBillBookGrid() {
        const container = document.getElementById('billBookProductGrid');
        if (!container) return;
        container.innerHTML = '';

        const list = (typeof billBookProducts !== 'undefined') ? billBookProducts : [];

        list.forEach((item, index) => {
            const fullDesignTitle = `${item.name} (${item.code})`;
            const isSelected = (selectedBillBookDesign === fullDesignTitle);
            const imgs = getBillBookImages(item);
            const activeSrc = item.currentImg || imgs[0];
            const activeIdx = Math.max(0, imgs.indexOf(activeSrc));
            const sizeText = item.size || '১/৮ (৫.৫ × ৮.৫ ইঞ্চি)';

            const cardDiv = document.createElement('div');
            cardDiv.className = `ecom-card ${isSelected ? 'selected' : ''}`;
            cardDiv.onclick = () => selectBillBookCardByIndex(index);

            const mainImgId = `billbook-main-img-${index}`;
            const badgeClass = (index % 2 === 0) ? 'badge-bestseller' : 'badge-trending';
            const badgeText = (index % 2 === 0) ? 'জনপ্রিয়' : 'নতুন কালেকশন';

            const dotsHtml = imgs.length > 1 ? `
                <div style="position:absolute; bottom:6px; left:50%; transform:translateX(-50%); display:flex; gap:5px; background:rgba(0,0,0,0.4); padding:3px 8px; border-radius:10px; pointer-events:none;">
                    ${imgs.map((_, i) => `<span class="card-swipe-dot" style="width:6px; height:6px; border-radius:50%; background:${i === activeIdx ? '#FF6A00' : 'rgba(255,255,255,0.75)'};"></span>`).join('')}
                </div>` : '';

            const thumbsHtml = imgs.length > 1 ? `
                <div class="thumb-row">
                    ${imgs.map((src, i) => `<img src="${src}" class="thumb-box ${activeSrc === src ? 'active' : ''}" onload="this.classList.add('img-loaded')" onclick="switchBillBookThumb(event, ${index}, ${i}, this)" title="ছবি ${i + 1}">`).join('')}
                </div>` : '';

            cardDiv.innerHTML = `
                <div class="ecom-img-box" style="touch-action: pan-y;" ontouchstart="handleBillBookTouchStart(event)" ontouchend="handleBillBookTouchEnd(event, ${index})">
                    <span class="ecom-badge ${badgeClass}">${badgeText}</span>
                    <img src="${activeSrc}" id="${mainImgId}" alt="${item.name}" title="বড় করে দেখতে ক্লিক করুন বা পাশে সরান" onload="this.classList.add('img-loaded')" onclick="openBillBookImageClick(event, ${index})">
                    ${dotsHtml}
                </div>
                <div class="ecom-body">
                    <div>
                        ${thumbsHtml}
                        <div class="ecom-title">${item.name}</div>
                        <div class="ecom-meta">ডিজাইন কোড: ${item.code}</div>
                        <span class="ecom-price-main">সাইজ: ${sizeText}</span>
                    </div>
                    <button type="button" class="ecom-green-btn" style="margin-top: 6px;">
                        <i class="fa-brands fa-whatsapp"></i> অর্ডার করুন
                    </button>
                </div>
            `;
            container.appendChild(cardDiv);

            if ((index + 1) % 4 === 0) {
                container.appendChild(createCatalogAdBox());
            }
        });

        document.getElementById('selectedBillBookDisplay').value = `${selectedBillBookDesign} | সাইজ: ${selectedBillBookSize}`;
    }

    function selectBillBookCardByIndex(index) {
        const list = (typeof billBookProducts !== 'undefined') ? billBookProducts : [];
        const item = list[index];
        if (!item) return;

        const imgs = getBillBookImages(item);
        selectedBillBookDesign = `${item.name} (${item.code})`;
        selectedBillBookSize = item.size || '১/৮ (৫.৫ × ৮.৫ ইঞ্চি)';
        selectedBillBookImg = item.currentImg || imgs[0];
        renderBillBookGrid();
    }

    function submitBillBookToWhatsApp() {
        const qtyVal = parseInt(document.getElementById('billBookQty').value, 10);
        if (!qtyVal || qtyVal <= 0) {
            alert('অনুগ্রহ করে সঠিক সংখ্যায় বিল বুকের পরিমাণ লিখুন।');
            document.getElementById('billBookQty').focus();
            return;
        }

        const printOptionEl = document.querySelector('input[name="billBookPrintOption"]:checked');
        const printOption = printOptionEl ? printOptionEl.value : 'প্রিন্ট করতে চাই';
        const delivery = document.querySelector('input[name="billBookDeliveryMethod"]:checked').value;

        let printDetailsLine = '';
        if (printOption === 'প্রিন্ট করতে চাই') {
            const rawName = document.getElementById('billBookPrintText').value.trim() || 'দোকানের নাম ও বিবরণ হোয়াটসঅ্যাপে পাঠাচ্ছি';
            printDetailsLine = `• ছাপানোর নাম/বিবরণ: ${rawName}%0A`;
        }

        const message = `*নতুন অর্ডার রিকোয়েস্ট (Sub Prints)*%0A` +
                        `--------------------------------%0A` +
                        `• সার্ভিস: বিল বুক ও ক্যাশমেমো প্রিন্ট%0A` +
                        `• কাজের ধরন: ${printOption}%0A` +
                        printDetailsLine +
                        `• পছন্দ করা ডিজাইন: ${selectedBillBookDesign}%0A` +
                        `• সাইজ: ${selectedBillBookSize}%0A` +
                        `• অর্ডার পরিমাণ: ${qtyVal} পিস/বই%0A` +
                        `• ডিজাইনের ছবির লিঙ্ক: ${encodeURIComponent(selectedBillBookImg)}%0A` +
                        `• ডেলিভারি মাধ্যম: ${delivery}%0A` +
                        `--------------------------------%0A` +
                        `আমি বিল বুক অর্ডার কনফার্ম করতে চাই।`;
        window.open(`https://wa.me/919732322525?text=${message}`, '_blank');
    }

    /* ---------------- ৯. হ্যান্ডবিল ও পোস্টার ---------------- */
    let currentHB = 'হ্যাণ্ড বিল';
    function openHandbillFlow() {
        document.getElementById('handbillModal').style.display = 'flex';
    }
    function selectHB(val) {
        currentHB = val;
        if(val === 'হ্যাণ্ড বিল') {
            document.getElementById('hbOpt').classList.add('active');
            document.getElementById('postOpt').classList.remove('active');
        } else {
            document.getElementById('hbOpt').classList.remove('active');
            document.getElementById('postOpt').classList.add('active');
        }
    }
    function submitHBToWhatsApp() {
        const qty = document.getElementById('hbQuantity').value || 1000;
        const details = document.getElementById('hbDetails').value || 'সাধারণ পেপার';
        const delivery = document.querySelector('input[name="hbDelivery"]:checked').value;
        const message = `*নতুন অর্ডার রিকোয়েস্ট (Sub Prints)*%0A` +
                        `--------------------------------%0A` +
                        `• সার্ভিস: ${currentHB}%0A` +
                        `• পরিমাণ: ${qty} পিস%0A` +
                        `• সাইজ/বিবরণ: ${details}%0A` +
                        `• ডেলিভারি মাধ্যম: ${delivery}%0A` +
                        `--------------------------------%0A` +
                        `আমি রেট ও প্রিন্টিং বিষয়ে আলোচনা করতে চাই।`;
        window.open(`https://wa.me/919732322525?text=${message}`, '_blank');
    }

    /* ---------------- সোশ্যাল শেয়ার ফাংশন ---------------- */
    function shareSpecificProduct(e, name, detail) {
        e.stopPropagation();
        
        const pageUrl = window.location.href.split('#')[0];
        const shareData = {
            title: `${name} | Sub Prints`,
            text: `${name} (${detail}) - Sub Prints-এ ডিজাইন ও বুকিং করতে ভিজিট করুন:\n`,
            url: pageUrl
        };

        if (navigator.share) {
            navigator.share(shareData).catch(() => {});
        } else {
            navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`).then(() => {
                alert("লিঙ্ক কপি করা হয়েছে! যেকোনো সোশ্যাল মিডিয়ায় পেস্ট করে শেয়ার করতে পারেন।");
            }).catch(() => {
                prompt("লিঙ্কটি কপি করুন:", shareData.url);
            });
        }
    }
/* ---------------- আপডেটেড প্রশ্নবিচিত্রা (৪টি প্রকাশনী + লেখক + দাম + ডুয়াল ইমেজ + স্কেলিটন) ---------------- */
const defaultBookImg = 'https://lh3.googleusercontent.com/d/1xS-M6sX6LDOItOPJ8TcU2uMfVZnaag-M';

    const prashnaPublishersData = {
        'chhaya': {
            title: 'ছায়া প্রকাশনী : প্রশ্ন সাথী (ক্লাস ৫ থেকে ১০)',
            pubName: 'ছায়া প্রকাশনী (প্রশ্ন সাথী)',
            books: [
                { id: 'ch5', name: 'প্রশ্ন সাথী - ক্লাস ৫ (Class 5)', author: 'লেখক: ছায়া সম্পাদনা মণ্ডলী', price: '₹২৪০', badge: 'জনপ্রিয়', img1: defaultBookImg, img2: defaultBookImg },
                { id: 'ch6', name: 'প্রশ্ন সাথী - ক্লাস ৬ (Class 6)', author: 'লেখক: ছায়া সম্পাদনা মণ্ডলী', price: '₹২৭০', badge: 'নতুন কালেকশন', img1: defaultBookImg, img2: defaultBookImg },
                { id: 'ch7', name: 'প্রশ্ন সাথী - ক্লাস ৭ (Class 7)', author: 'লেখক: ছায়া সম্পাদনা মণ্ডলী', price: '₹২৯০', badge: 'জনপ্রিয়', img1: defaultBookImg, img2: defaultBookImg },
                { id: 'ch8', name: 'প্রশ্ন সাথী - ক্লাস ৮ (Class 8)', author: 'লেখক: ছায়া সম্পাদনা মণ্ডলী', price: '₹৩২০', badge: 'নতুন কালেকশন', img1: defaultBookImg, img2: defaultBookImg },
                { id: 'ch9', name: 'প্রশ্ন সাথী - ক্লাস ৯ (Class 9)', author: 'লেখক: দুয়ারী, গাঙ্গুলী, মাইতি', price: '₹৩৫০', badge: 'জনপ্রিয়', img1: defaultBookImg, img2: defaultBookImg },
                { id: 'ch10', name: 'প্রশ্ন সাথী - ক্লাস ১০ (Class 10)', author: 'লেখক: দুয়ারী, গাঙ্গুলী, মাইতি', price: '₹৩৮০', badge: 'নতুন কালেকশন', img1: defaultBookImg, img2: defaultBookImg }
            ]
        },
        'parul': {
            title: 'পারুল প্রকাশনী (ক্লাস ৫ থেকে ১০)',
            pubName: 'পারুল প্রকাশনী',
            books: [
                { id: 'pr5', name: 'পারুল প্রশ্ন সংকলন - ক্লাস ৫', author: 'লেখক: পারুল সম্পাদনা পরিষদ', price: '₹২৩০', badge: 'নতুন কালেকশন', img1: defaultBookImg, img2: defaultBookImg },
                { id: 'pr6', name: 'পারুল প্রশ্ন সংকলন - ক্লাস ৬', author: 'লেখক: পারুল সম্পাদনা পরিষদ', price: '₹২৬০', badge: 'জনপ্রিয়', img1: defaultBookImg, img2: defaultBookImg },
                { id: 'pr7', name: 'পারুল প্রশ্ন সংকলন - ক্লাস ৭', author: 'লেখক: পারুল সম্পাদনা পরিষদ', price: '₹২৮৫', badge: 'নতুন কালেকশন', img1: defaultBookImg, img2: defaultBookImg },
                { id: 'pr8', name: 'পারুল প্রশ্ন সংকলন - ক্লাস ৮', author: 'লেখক: পারুল সম্পাদনা পরিষদ', price: '₹৩১০', badge: 'জনপ্রিয়', img1: defaultBookImg, img2: defaultBookImg },
                { id: 'pr9', name: 'পারুল প্রশ্ন সংকলন - ক্লাস ৯', author: 'লেখক: ড. সৌমিত্র শেখর ও অন্যান্য', price: '₹৩৪০', badge: 'নতুন কালেকশন', img1: defaultBookImg, img2: defaultBookImg },
                { id: 'pr10', name: 'পারুল প্রশ্ন সংকলন - ক্লাস ১০', author: 'লেখক: ড. সৌমিত্র শেখর ও অন্যান্য', price: '₹৩৭০', badge: 'জনপ্রিয়', img1: defaultBookImg, img2: defaultBookImg }
            ]
        },
        'raymartin': {
            title: 'রায় ও মার্টিন প্রকাশনী (ক্লাস ৫ থেকে ১০)',
            pubName: 'রায় ও মার্টিন প্রকাশনী',
            books: [
                { id: 'rm5', name: 'রায় ও মার্টিন প্রশ্নবিচিত্রা - ক্লাস ৫', author: 'লেখক: রায় ও মার্টিন সম্পাদনা মণ্ডলী', price: '₹২৫০', badge: 'জনপ্রিয়', img1: defaultBookImg, img2: defaultBookImg },
                { id: 'rm6', name: 'রায় ও মার্টিন প্রশ্নবিচিত্রা - ক্লাস ৬', author: 'লেখক: রায় ও মার্টিন সম্পাদনা মণ্ডলী', price: '₹২৮০', badge: 'নতুন কালেকশন', img1: defaultBookImg, img2: defaultBookImg },
                { id: 'rm7', name: 'রায় ও মার্টিন প্রশ্নবিচিত্রা - ক্লাস ৭', author: 'লেখক: রায় ও মার্টিন সম্পাদনা মণ্ডলী', price: '₹৩০০', badge: 'জনপ্রিয়', img1: defaultBookImg, img2: defaultBookImg },
                { id: 'rm8', name: 'রায় ও মার্টিন প্রশ্নবিচিত্রা - ক্লাস ৮', author: 'লেখক: রায় ও মার্টিন সম্পাদনা মণ্ডলী', price: '₹৩৩০', badge: 'নতুন কালেকশন', img1: defaultBookImg, img2: defaultBookImg },
                { id: 'rm9', name: 'রায় ও মার্টিন প্রশ্নবিচিত্রা - ক্লাস ৯', author: 'লেখক: রায় ও মার্টিন সম্পাদনা মণ্ডলী', price: '₹৩৬০', badge: 'জনপ্রিয়', img1: defaultBookImg, img2: defaultBookImg },
                { id: 'rm10', name: 'রায় ও মার্টিন প্রশ্নবিচিত্রা - ক্লাস ১০', author: 'লেখক: রায় ও মার্টিন সম্পাদনা মণ্ডলী', price: '₹৩৯০', badge: 'নতুন কালেকশন', img1: defaultBookImg, img2: defaultBookImg }
            ]
        },
        'tulsi': {
            title: 'তুলসী প্রকাশনী (ক্লাস ৫ থেকে ১০)',
            pubName: 'তুলসী প্রকাশনী',
            books: [
                { id: 'tl5', name: 'তুলসী প্রশ্ন সংকলন - ক্লাস ৫', author: 'লেখক: তুলসী সম্পাদনা মণ্ডলী', price: '₹২২০', badge: 'নতুন কালেকশন', img1: defaultBookImg, img2: defaultBookImg },
                { id: 'tl6', name: 'তুলসী প্রশ্ন সংকলন - ক্লাস ৬', author: 'লেখক: তুলসী সম্পাদনা মণ্ডলী', price: '₹২৫০', badge: 'জনপ্রিয়', img1: defaultBookImg, img2: defaultBookImg },
                { id: 'tl7', name: 'তুলসী প্রশ্ন সংকলন - ক্লাস ৭', author: 'লেখক: তুলসী সম্পাদনা মণ্ডলী', price: '₹২৭৫', badge: 'নতুন কালেকশন', img1: defaultBookImg, img2: defaultBookImg },
                { id: 'tl8', name: 'তুলসী প্রশ্ন সংকলন - ক্লাস ৮', author: 'লেখক: তুলসী সম্পাদনা মণ্ডলী', price: '₹৩০০', badge: 'জনপ্রিয়', img1: defaultBookImg, img2: defaultBookImg },
                { id: 'tl9', name: 'তুলসী প্রশ্ন সংকলন - ক্লাস ৯', author: 'লেখক: তুলসী সম্পাদনা মণ্ডলী', price: '₹৩৩০', badge: 'নতুন কালেকশন', img1: defaultBookImg, img2: defaultBookImg },
                { id: 'tl10', name: 'তুলসী প্রশ্ন সংকলন - ক্লাস ১০', author: 'লেখক: তুলসী সম্পাদনা মণ্ডলী', price: '₹৩৬০', badge: 'জনপ্রিয়', img1: defaultBookImg, img2: defaultBookImg }
            ]
        }
    };

    let currentPrashnaPubKey = 'chhaya';
    let selectedPrashnaBookObj = null;

    function openPrashnaBichitraFlow() {
        document.getElementById('prashnaBichitraModal').style.display = 'flex';
        selectPrashnaPublisher('chhaya');
    }

    function selectPrashnaPublisher(pubKey) {
        currentPrashnaPubKey = pubKey;
        
        ['chhaya', 'parul', 'raymartin', 'tulsi'].forEach(key => {
            const btn = document.getElementById('pubBtn-' + key);
            if (btn) btn.classList.remove('active');
        });
        const activeBtn = document.getElementById('pubBtn-' + pubKey);
        if (activeBtn) activeBtn.classList.add('active');

        const pubData = prashnaPublishersData[pubKey];
        document.getElementById('activePubHeading').innerText = pubData.title;

        pubData.books.forEach(b => { if (!b.currentImg) b.currentImg = b.img1; });
        const firstBook = pubData.books[0];

        selectedPrashnaBookObj = {
            pubName: pubData.pubName,
            name: firstBook.name,
            author: firstBook.author,
            price: firstBook.price,
            img: firstBook.currentImg || firstBook.img1
        };
        document.getElementById('selectedPrashnaDisplay').value = `${firstBook.name} | ${firstBook.author} | মূল্য: ${firstBook.price}`;

        showSkeletonInGrid('prashnaBichitraGrid', 6, renderPrashnaGrid);
    }

    function switchPrashnaThumb(e, index, imgNum, thumbEl) {
        e.stopPropagation();
        const pubData = prashnaPublishersData[currentPrashnaPubKey];
        const item = pubData.books[index];
        const newSrc = item['img' + imgNum];
        item.currentImg = newSrc;

        const mainImgId = `prashna-main-img-${currentPrashnaPubKey}-${index}`;
        changeDisplayImage(mainImgId, newSrc, thumbEl);

        if (selectedPrashnaBookObj && selectedPrashnaBookObj.name === item.name && selectedPrashnaBookObj.pubName === pubData.pubName) {
            selectedPrashnaBookObj.img = newSrc;
        }
    }

    function renderPrashnaGrid() {
        const grid = document.getElementById('prashnaBichitraGrid');
        if (!grid) return;
        grid.innerHTML = '';

        const pubData = prashnaPublishersData[currentPrashnaPubKey];

        pubData.books.forEach((item, index) => {
            const isSelected = (selectedPrashnaBookObj && selectedPrashnaBookObj.name === item.name && selectedPrashnaBookObj.pubName === pubData.pubName);
            const activeSrc = item.currentImg || item.img1;
            const cardDiv = document.createElement('div');
            cardDiv.className = `ecom-card ${isSelected ? 'selected' : ''}`;
            cardDiv.onclick = () => selectPrashnaClass(index);

            const mainImgId = `prashna-main-img-${currentPrashnaPubKey}-${index}`;
            const badgeClass = (item.badge === 'জনপ্রিয়') ? 'badge-bestseller' : 'badge-trending';

            cardDiv.innerHTML = `
                <div class="ecom-img-box">
                    <span class="ecom-badge ${badgeClass}">${item.badge}</span>
                    <img src="${activeSrc}" id="${mainImgId}" alt="${item.name}" title="বড় করে দেখতে ছবির ওপর ক্লিক করুন" onload="this.classList.add('img-loaded')" onclick="openImageLightbox(event, this.src, '${item.name} (${pubData.pubName}) | ${item.author} | মূল্য: ${item.price}')">
                </div>
                <div class="ecom-body">
                    <div>
                        <div class="thumb-row">
                            <img src="${item.img1}" class="thumb-box ${activeSrc === item.img1 ? 'active' : ''}" onload="this.classList.add('img-loaded')" onclick="switchPrashnaThumb(event, ${index}, 1, this)" title="ছবি ১">
                            <img src="${item.img2}" class="thumb-box ${activeSrc === item.img2 ? 'active' : ''}" onload="this.classList.add('img-loaded')" onclick="switchPrashnaThumb(event, ${index}, 2, this)" title="ছবি ২">
                        </div>
                        <div class="ecom-title" style="font-size:0.9rem;">${item.name}</div>
                        <div class="ecom-meta">প্রকাশনী: ${pubData.pubName}</div>
                        <div class="ecom-meta" style="color: #0F172A; font-weight: 500;">${item.author}</div>
                        <span class="ecom-price-main" style="font-size:1.05rem;">মূল্য: ${item.price}</span>
                    </div>
                    <button type="button" class="ecom-green-btn" style="padding: 7px; font-size: 0.82rem;">
                        <i class="fa-brands fa-whatsapp"></i> অর্ডার পাঠান
                    </button>
                </div>
            `;
            grid.appendChild(cardDiv);
        });

        const displayInput = document.getElementById('selectedPrashnaDisplay');
        if (displayInput && selectedPrashnaBookObj) {
            displayInput.value = `${selectedPrashnaBookObj.name} | ${selectedPrashnaBookObj.author} | মূল্য: ${selectedPrashnaBookObj.price}`;
        }
    }

    function selectPrashnaClass(index) {
        const pubData = prashnaPublishersData[currentPrashnaPubKey];
        const item = pubData.books[index];
        selectedPrashnaBookObj = {
            pubName: pubData.pubName,
            name: item.name,
            author: item.author,
            price: item.price,
            img: item.currentImg || item.img1
        };
        renderPrashnaGrid();
    }

    function submitPrashnaToWhatsApp() {
        if (!selectedPrashnaBookObj) return;
        const delivery = document.querySelector('input[name="prashnaDelivery"]:checked').value;
        const extraNote = document.getElementById('prashnaExtraNote').value.trim() || 'কোনো বাড়তি নোট নেই';

        const message = `*প্রশ্নবিচিত্রা / সহায়িকা অর্ডার (Sub Prints)*%0A` +
                        `--------------------------------%0A` +
                        `• বইয়ের নাম: ${selectedPrashnaBookObj.name}%0A` +
                        `• প্রকাশনী: ${selectedPrashnaBookObj.pubName}%0A` +
                        `• ${selectedPrashnaBookObj.author}%0A` +
                        `• নির্ধারিত মূল্য: ${selectedPrashnaBookObj.price}%0A` +
                        `• বইয়ের ছবির লিঙ্ক: ${encodeURIComponent(selectedPrashnaBookObj.img)}%0A` +
                        `• নোট/বিবরণ: ${extraNote}%0A` +
                        `• ডেলিভারি মাধ্যম: ${delivery}%0A` +
                        `--------------------------------%0A` +
                        `আমি এই বইটি অর্ডার করতে চাই।`;

        window.open(`https://wa.me/919732322525?text=${message}`, '_blank');
        closeModal('prashnaBichitraModal');
    }
/* ---------------- সব ক্যাটালগে আলাদা অর্ডার পপ-আপ (স্কেলিটন লোডার সহ) ও সঠিক ব্যাক বাটন কন্ট্রোল ---------------- */
(function () {
const allModals = [
    'quickDirectOrderModal', 'prashnaBichitraModal', 'predefinedBookModal',
    'studentOrderModal', 'imageLightboxModal', 'adModal', 'weddingModalStep1',
    'catalogModal', 'annaprashanStep1', 'annaCatalogModal', 'menuModalStep1',
    'menuCatalogModal', 'visitingModal', 'flexModal', 'stampModal',
    'billBookModal', 'handbillModal'
];

const catalogConfigs = [
    { modalId: 'catalogModal', gridId: 'catalogContainer', title: 'বিয়ের কার্ড অর্ডার কনফার্মেশন' },
    { modalId: 'annaCatalogModal', gridId: 'annaCatalogContainer', title: 'অন্নপ্রাশন কার্ড অর্ডার কনফার্মেশন' },
    { modalId: 'menuCatalogModal', gridId: 'menuCatalogContainer', title: 'মেনু কার্ড অর্ডার কনফার্মেশন' },
    { modalId: 'billBookModal', gridId: 'billBookProductGrid', title: 'বিল বুক অর্ডার কনফার্মেশন' },
    { modalId: 'prashnaBichitraModal', gridId: 'prashnaBichitraGrid', title: 'বই অর্ডার কনফার্মেশন' }
];

let modalStack = [];
let ignorePopState = false;

function pushModalHistory(id) {
    if (!modalStack.includes(id)) {
        modalStack.push(id);
        try {
            history.pushState({ modalId: id }, '');
        } catch (e) {}
    }
}

function removeModalFromStack(id, triggerHistoryBack) {
    const idx = modalStack.indexOf(id);
    if (idx !== -1) {
        modalStack.splice(idx, 1);
        if (triggerHistoryBack) {
            ignorePopState = true;
            try { history.back(); } catch (e) {}
            setTimeout(() => { ignorePopState = false; }, 300);
        }
    }
}

function setupUnifiedSystem() {
    let popupOverlay = document.getElementById('quickDirectOrderModal');
    if (!popupOverlay) {
        popupOverlay = document.createElement('div');
        popupOverlay.id = 'quickDirectOrderModal';
        popupOverlay.className = 'modal-overlay';
        popupOverlay.style.zIndex = '1500';
        popupOverlay.innerHTML = `
            <div class="modal-box" style="max-width: 480px; text-align: left;">
                <button type="button" class="close-btn" id="closeQuickOrderBtn">&times;</button>
                <h3 id="quickOrderPopupTitle" style="color: var(--primary-orange); margin-bottom: 1rem;">
                    <i class="fa-solid fa-bag-shopping"></i> অর্ডার কনফার্মেশন
                </h3>
                <div id="quickOrderPopupBody"></div>
            </div>
        `;
        document.body.appendChild(popupOverlay);
    }

    const popupBody = document.getElementById('quickOrderPopupBody');
    const popupTitle = document.getElementById('quickOrderPopupTitle');
    const hiddenStorage = document.createElement('div');
    hiddenStorage.style.display = 'none';
    document.body.appendChild(hiddenStorage);

    let activeFormBlock = null;
    let popupLoadTimer = null;

    function closeQuickOrderPopup(fromBackButton) {
        if (popupLoadTimer) clearTimeout(popupLoadTimer);
        if (activeFormBlock) {
            hiddenStorage.appendChild(activeFormBlock);
            activeFormBlock = null;
        }
        popupBody.innerHTML = '';
        popupOverlay.style.display = 'none';
        removeModalFromStack('quickDirectOrderModal', !fromBackButton);
    }

    document.getElementById('closeQuickOrderBtn').onclick = () => closeQuickOrderPopup(false);
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) closeQuickOrderPopup(false);
    });

    catalogConfigs.forEach(({ modalId, gridId, title }) => {
        const modalEl = document.getElementById(modalId);
        const gridEl = document.getElementById(gridId);
        if (!modalEl || !gridEl) return;

        const hrEl = gridEl.nextElementSibling;
        if (!hrEl || hrEl.tagName !== 'HR') return;

        const formBlock = document.createElement('div');
        let nextNode = hrEl.nextElementSibling;
        while (nextNode) {
            const current = nextNode;
            nextNode = nextNode.nextElementSibling;
            formBlock.appendChild(current);
        }
        hrEl.remove();
        hiddenStorage.appendChild(formBlock);

        const waBtn = formBlock.querySelector('.btn-primary');
        if (waBtn) {
            waBtn.addEventListener('click', () => {
                setTimeout(() => closeQuickOrderPopup(false), 300);
            });
        }

        gridEl.addEventListener('click', (e) => {
            if (
                e.target.tagName === 'IMG' ||
                e.target.closest('.sample-share-btn') ||
                e.target.closest('.catalog-ad-card')
            ) {
                return;
            }

            const clickedCard = e.target.closest('.ecom-card, .catalog-item');
            if (!clickedCard) return;

            setTimeout(() => {
                if (popupLoadTimer) clearTimeout(popupLoadTimer);
                if (activeFormBlock) {
                    hiddenStorage.appendChild(activeFormBlock);
                }

                popupTitle.innerHTML = `<i class="fa-solid fa-bag-shopping"></i> ${title}`;
                // অর্ডার বক্সে স্কেলিটন লোডার দেখানো হচ্ছে
                popupBody.innerHTML = `
                    <div style="display:flex; flex-direction:column; gap:12px; padding:6px 0;">
                        <div class="skeleton-loader" style="height:42px; width:100%; border-radius:10px;"></div>
                        <div class="skeleton-loader" style="height:48px; width:100%; border-radius:10px;"></div>
                        <div class="skeleton-loader" style="height:48px; width:100%; border-radius:10px;"></div>
                        <div class="skeleton-loader" style="height:44px; width:100%; border-radius:10px; margin-top:4px;"></div>
                    </div>
                `;
                popupOverlay.style.display = 'flex';
                pushModalHistory('quickDirectOrderModal');

                popupLoadTimer = setTimeout(() => {
                    popupBody.innerHTML = '';
                    activeFormBlock = formBlock;
                    popupBody.appendChild(formBlock);
                }, 300);
            }, 30);
        }, true);
    });

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'style') {
                const el = mutation.target;
                if (el.id === 'quickDirectOrderModal') return;
                if (el.style.display === 'flex') {
                    pushModalHistory(el.id);
                } else if (el.style.display === 'none') {
                    removeModalFromStack(el.id, false);
                }
            }
        });
    });

    allModals.forEach(id => {
        const el = document.getElementById(id);
        if (el && id !== 'quickDirectOrderModal') {
            observer.observe(el, { attributes: true });
        }
    });

    window.addEventListener('popstate', () => {
        if (ignorePopState) {
            ignorePopState = false;
            return;
        }
        if (modalStack.length > 0) {
            const topModalId = modalStack[modalStack.length - 1];
            if (topModalId === 'quickDirectOrderModal') {
                closeQuickOrderPopup(true);
            } else {
                modalStack.pop();
                const topEl = document.getElementById(topModalId);
                if (topEl) topEl.style.display = 'none';
            }
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupUnifiedSystem);
} else {
    setupUnifiedSystem();
}
})();