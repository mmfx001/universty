import React from "react";

const About = () => {
    return (
        <div className="p-6 bg-gradient-to-b from-indigo-50 to-white min-h-screen font-rubik">
            <h1 className="text-4xl sm:text-3xl font-extrabold text-indigo-800 mb-6 text-center">
                Yangi Oʻzbekiston Universiteti
            </h1>
            <p className="text-lg sm:text-base text-gray-800 leading-relaxed mb-6">
                <span className="font-semibold">Yangi Oʻzbekiston Universiteti</span> —
                Toshkent shahrida joylashgan zamonaviy oliy taʼlim muassasasi. Ushbu
                universitet Oʻzbekiston Respublikasi Prezidenti{" "}
                <span className="text-indigo-700">Shavkat Mirziyoyev</span>ning
                tashabbusi bilan 2021-yil 23-iyunda tashkil etilgan. Maqsad — yangi
                avlod yetakchilarini tayyorlash va yoshlar uchun global taʼlim
                imkoniyatlarini taʼminlashdir.
            </p>

            <h2 className="text-3xl sm:text-2xl font-bold text-indigo-700 mt-8 mb-4">
                Birinchi Imtihon
            </h2>
            <p className="text-lg sm:text-base text-gray-800 leading-relaxed mb-6">
                Universitetga kirish uchun birinchi imtihon{" "}
                <span className="font-semibold text-indigo-700">2021-yilning 6-sentabr</span>{" "}
                kuni Toshkentda oʻtkazildi. Imtihonda{" "}
                <span className="font-semibold text-indigo-700">6000+</span> talabgor
                ishtirok etdi va ulardan faqat{" "}
                <span className="font-semibold text-indigo-700">1213</span> nafari
                muvaffaqqiyatli oʻtib, test jarayonlarida qatnashish imkoniyatini
                qoʻlga kiritdi. Test sinovlari uch soat davom etdi va barcha savollar{" "}
                <span className="font-semibold">ingliz tilida</span> boʻldi.
            </p>

            <h2 className="text-3xl sm:text-2xl font-bold text-indigo-700 mt-8 mb-4">
                Akademik Dasturlar
            </h2>
            <p className="text-lg sm:text-base text-gray-800 leading-relaxed mb-6">
                Yangi Oʻzbekiston Universiteti{" "}
                <span className="font-semibold">Myunxen Texnika Universiteti</span>{" "}
                bilan hamkorlikda yuqori sifatli ingliz tilidagi taʼlimni taklif etadi.
                Talabalar zamonaviy fanlar boʻyicha bilim olishlari uchun{" "}
                <span className="text-indigo-700 font-semibold">4 ta akademik maktab</span> tashkil etilgan:
            </p>
            <ul className="list-disc ml-8 mb-6 text-gray-800">
                <li className="mb-2 text-lg sm:text-base">
                    <span className="font-semibold text-indigo-700">Raqamli texnologiyalar maktabi:</span>{" "}
                    Sun'iy intellekt, kiberxavfsizlik va dasturiy ta'minot muhandisligi yoʻnalishlari.
                </li>
                <li className="mb-2 text-lg sm:text-base">
                    <span className="font-semibold text-indigo-700">Muhandislik maktabi:</span>{" "}
                    Mexanika muhandisligi va kimyo muhandisligi yoʻnalishlari.
                </li>
                <li className="mb-2 text-lg sm:text-base">
                    <span className="font-semibold text-indigo-700">
                        Gumanitar, tabiiy va ijtimoiy fanlar maktabi:
                    </span>{" "}
                    Amaliy matematika va iqtisodiyot yoʻnalishlari.
                </li>
                <li className="mb-2 text-lg sm:text-base">
                    <span className="font-semibold text-indigo-700">Boshqaruv maktabi:</span>{" "}
                    Sanoat boshqaruvi va innovatsiyalar.
                </li>
            </ul>



            <h2 className="text-3xl sm:text-2xl font-bold text-indigo-700 mt-8 mb-4">
                Universitet Hayoti
            </h2>
            <p className="text-lg sm:text-base text-gray-800 leading-relaxed mb-6">
                Talabalar hayoti universitetda nafaqat taʼlim olish, balki ko‘plab madaniy
                va sport tadbirlarida qatnashishni o‘z ichiga oladi. Universitet talabalari uchun:
            </p>
            <ul className="list-disc ml-8 mb-6 text-gray-800">
                <li className="mb-2">Ko‘ngilochar tadbirlar, konsertlar va festivallar.</li>
                <li className="mb-2">Sport musobaqalari va jismoniy tarbiya mashg‘ulotlari.</li>
                <li className="mb-2">Talabalar klublari va ilmiy guruhlar.</li>
                <li className="mb-2">Xalqaro almashinuv dasturlari va treninglar.</li>
            </ul>

            <h2 className="text-3xl sm:text-2xl font-bold text-indigo-700 mt-8 mb-4">
                Kelajak Rejalari
            </h2>
            <p className="text-lg sm:text-base text-gray-800 leading-relaxed mb-6">
                Yangi Oʻzbekiston Universiteti kelajakda:
            </p>
            <ul className="list-disc ml-8 mb-6 text-gray-800">
                <li className="mb-2">Global universitetlar reytingida yuqori o‘rinlarni egallashni;</li>
                <li className="mb-2">Innovatsion tadqiqot markazlarini rivojlantirishni;</li>
                <li className="mb-2">Yangi dasturlar va mutaxassisliklarni joriy etishni;</li>
                <li className="mb-2">Oʻzbekiston yoshlariga chet elda taʼlim olish imkoniyatini kengaytirishni rejalashtirmoqda.</li>
            </ul>

            <blockquote className="italic text-indigo-700 font-semibold text-center bg-indigo-100 p-4 rounded-lg shadow-md">
                “Yangi avlod yetakchilari — bizning kelajagimizning kaliti.”
            </blockquote>
        </div>
    );
};

export default About;