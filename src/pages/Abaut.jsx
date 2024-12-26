import React, { useState } from "react";
import { motion } from "framer-motion";

const About = () => {
    // Inputlar uchun state
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [successMessageVisible, setSuccessMessageVisible] = useState(false); // State for success message visibility

    const handleOrderClick = () => {
        // Telegram bot ma'lumotlari
        const botToken = "7577456421:AAFQW-D5Rdkkz04cSUvgt6qaeeJ03q6FP_I";
        const chatId = "6501102728";

        // Yuboriladigan xabar
        const telegramMessage = `
📌 Yangi O'zbekiston Universiteti haqida zakaz.

👤 Ism: ${name}
📞 Telefon: ${phone}
📩 Xabar: ${message}
        `;

        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: telegramMessage,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    setSuccessMessageVisible(true); // Show success message
                    setName(""); // Inputlarni tozalash
                    setPhone("");
                    setMessage("");
                    setTimeout(() => setSuccessMessageVisible(false), 3000); // Hide message after 3 seconds
                } else {
                    throw new Error("Xatolik yuz berdi.");
                }
            })
            .catch((error) => {
                console.error("Telegramga xabar yuborishda muammo:", error);
                alert("Xabar yuborilmadi. Qayta urinib ko'ring.");
            });
    };

    return (
        <div className="p-6 bg-indigo-50 min-h-screen font-rubik">
            {/* Heading Animation */}
            <motion.h1
                className="text-4xl sm:text-3xl font-extrabold text-indigo-800 mb-6 text-center"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
            >
                Yangi Oʻzbekiston Universiteti
            </motion.h1>

            {/* Success Message Animation */}
            {successMessageVisible && (
                <motion.div
                    className="bg-green-500 text-white p-4 rounded-md mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Xabar muvaffaqiyatli yuborildi!
                </motion.div>
            )}

            {/* Description Text Animation */}
            <motion.p
                className="text-lg sm:text-base text-gray-800 leading-relaxed mb-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
            >
                <span className="font-semibold">Yangi Oʻzbekiston Universiteti</span> — Toshkent shahrida joylashgan zamonaviy oliy taʼlim muassasasi. Ushbu universitet Oʻzbekiston Respublikasi Prezidenti{" "}
                <span className="text-indigo-700">Shavkat Mirziyoyev</span>ning tashabbusi bilan 2021-yil 23-iyunda tashkil etilgan. Maqsad — yangi avlod yetakchilarini tayyorlash va yoshlar uchun global taʼlim imkoniyatlarini taʼminlashdir.
            </motion.p>



            <motion.p
                className="text-lg sm:text-base text-gray-800 leading-relaxed mb-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
            >
                Universitetning tashkil etilishi — bu Oʻzbekistonning oliy taʼlim tizimini rivojlantirishga katta qadamdir. Universitetda yuqori malakali o'qituvchilar va ilmiy xodimlar tomonidan yangi texnologiyalar, ilmiy tadqiqotlar va innovatsiyalarni rivojlantirishga katta e'tibor qaratilmoqda.
            </motion.p>

            {/* Programs and Academic Schools */}
            <motion.h2
                className="text-3xl sm:text-2xl font-bold text-indigo-700 mt-8 mb-4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
            >
                Akademik Dasturlar
            </motion.h2>

            <motion.p
                className="text-lg sm:text-base text-gray-800 leading-relaxed mb-6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1 }}
            >
                Yangi Oʻzbekiston Universiteti <span className="font-semibold">Myunxen Texnika Universiteti</span> bilan hamkorlikda yuqori sifatli ingliz tilidagi taʼlimni taklif etadi. Talabalar zamonaviy fanlar boʻyicha bilim olishlari uchun{" "}
                <span className="text-indigo-700 font-semibold">4 ta akademik maktab</span> tashkil etilgan:
            </motion.p>

            <motion.ul
                className="list-disc ml-8 mb-6 text-gray-800"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1.4 }}
            >
                <motion.li
                    className="mb-2 text-lg sm:text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.6 }}
                >
                    <span className="font-semibold text-indigo-700">Raqamli texnologiyalar maktabi:</span>{" "}
                    Sun'iy intellekt, kiberxavfsizlik va dasturiy ta'minot muhandisligi yoʻnalishlari.
                </motion.li>
                <motion.li
                    className="mb-2 text-lg sm:text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.8 }}
                >
                    <span className="font-semibold text-indigo-700">Muhandislik maktabi:</span>{" "}
                    Mexanika muhandisligi va kimyo muhandisligi yoʻnalishlari.
                </motion.li>
                <motion.li
                    className="mb-2 text-lg sm:text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 2 }}
                >
                    <span className="font-semibold text-indigo-700">Gumanitar, tabiiy va ijtimoiy fanlar maktabi:</span>{" "}
                    Amaliy matematika va iqtisodiyot yoʻnalishlari.
                </motion.li>
                <motion.li
                    className="mb-2 text-lg sm:text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 2.2 }}
                >
                    <span className="font-semibold text-indigo-700">Boshqaruv maktabi:</span>{" "}
                    Sanoat boshqaruvi va innovatsiyalar.
                </motion.li>
            </motion.ul>


            {/* University Life */}
            <motion.h2
                className="text-3xl sm:text-2xl font-bold text-indigo-700 mt-8 mb-4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 2.4 }}
            >
                Universitet Hayoti
            </motion.h2>

            <motion.p
                className="text-lg sm:text-base text-gray-800 leading-relaxed mb-6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 2.6 }}
            >
                Talabalar hayoti universitetda nafaqat taʼlim olish, balki ko‘plab madaniy va sport tadbirlarida qatnashishni o‘z ichiga oladi. Universitet talabalari uchun:
            </motion.p>

            <motion.ul
                className="list-disc ml-8 mb-6 text-gray-800"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 2.8 }}
            >
                <motion.li
                    className="mb-2 text-lg sm:text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 3 }}
                >
                    Sport musobaqalari va fakultetlararo musobaqalar.
                </motion.li>
                <motion.li
                    className="mb-2 text-lg sm:text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 3.2 }}
                >
                    Madaniy tadbirlar, konsertlar va festivallar.
                </motion.li>
                <motion.li
                    className="mb-2 text-lg sm:text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 3.4 }}
                >
                    Karyera markazi va bitiruvchilar uchun maslahatlar.
                </motion.li>
            </motion.ul>
            <motion.section
    className="mt-12 bg-indigo-50 p-8 rounded-md shadow-md"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 3.6 }}
>
    {/* Students List Title */}
    <motion.h3
        className="text-2xl font-semibold text-indigo-700 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 4 }}
    >
        Bizning O'quvchilarimiz
    </motion.h3>

    {/* Students Names */}
    <motion.ul
        className="list-disc ml-8 mb-6 text-gray-800"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 4.2 }}
    >
        <motion.li
            className="mb-2 text-lg sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 4.4 }}
        >
            O'quvchi 1: Ferka
        </motion.li>
        <motion.li
            className="mb-2 text-lg sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 4.6 }}
        >
            O'quvchi 2: Ferka
        </motion.li>
        <motion.li
            className="mb-2 text-lg sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 4.8 }}
        >
            O'quvchi 3: Ferka
        </motion.li>
        <motion.li
            className="mb-2 text-lg sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 5 }}
        >
            O'quvchi 4: Ferka
        </motion.li>
    </motion.ul>
</motion.section>



            {/* Form Section */}
            <motion.section
                className="mt-12 bg-indigo-50 p-8 rounded-md shadow-md"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 3.6 }}
            >
                {/* Form Title */}
                <motion.h3
                    className="text-2xl font-semibold text-indigo-700 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 4 }}
                >
                    Zakaz Yuborish
                </motion.h3>

                {/* Name Input */}
                <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 4.2 }}
                >
                    <label className="block text-lg text-gray-800 mb-2" htmlFor="name">
                        Ism
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    />
                </motion.div>
                

                {/* Phone Input */}
                <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 4.4 }}
                >
                    <label className="block text-lg text-gray-800 mb-2" htmlFor="phone">
                        Telefon raqami
                    </label>
                    <input
                        type="text"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    />
                </motion.div>

                {/* Message Input */}
                <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 4.6 }}
                >
                    <label className="block text-lg text-gray-800 mb-2" htmlFor="message">
                        Xabar
                    </label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-white p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                        rows="4"
                    />
                </motion.div>

                {/* Submit Button */}
                <motion.button
                    onClick={handleOrderClick}
                    className="w-full bg-indigo-700 text-white py-3 rounded-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 4.8 }}
                >
                    Zakazni yuborish
                </motion.button>
            </motion.section>
        </div>
    );
};

export default About;