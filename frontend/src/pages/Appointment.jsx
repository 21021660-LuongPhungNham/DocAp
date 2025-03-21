import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import RecommendedDoctors from "../components/RecommendedDoctors";

const Appointment = () => {
    const { docId } = useParams();
    const { doctors, currencySymbol } = useContext(AppContext);
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');

    const fetchDocInfo = () => {
        const docInfo = doctors.find(doc => doc._id === docId);
        setDocInfo(docInfo);
    };

    const getAvailableSlots = async () => {
        setDocSlots([]);

        let today = new Date();
        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            let endTime = new Date();
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0);

            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
            } else {
                currentDate.setHours(10);
                currentDate.setMinutes(0);
            }

            let timeSlots = [];

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                //
                timeSlots.push({
                    datetime: new Date(currentDate),
                    time: formattedTime
                });
                //
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            setDocSlots(prev => ([...prev, timeSlots]))
        }


    };

    const handleSlotChange = (index) => {
        setSlotIndex(index);
        setSlotTime(docSlots[index]?.[0]?.time || "");
    };

    useEffect(() => {
        fetchDocInfo();
    }, [doctors, docId]);

    useEffect(() => {
        getAvailableSlots();
    }, [docInfo]);

    useEffect(() => {
        if (docSlots.length > 0) {
            setSlotTime(docSlots[slotIndex]?.[0]?.time || "");
        }
    }, [docSlots, slotIndex]);

    return docInfo && (
        <div>
            {/* .....doc detail......... */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-[#59aecd] w-full sm:max-w-72 rounded-lg">
                    {docInfo ? (
                        <img src={docInfo.image} alt="Doctor" />
                    ) : (
                        <p>null</p>
                    )}
                </div>
                <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0">
                    {/* ........doc Info............ */}
                    <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
                        {docInfo.name}
                        <img className='w-5' src={assets.verified_icon} alt="" />
                    </p>
                    <div className="flex items-center gap-2 text-sm mt-1">
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
                    </div>

                    {/* ......doc about...... */}
                    <div>
                        <p className="text-sm text-gray-500 max-w-[700px] mt-4">
                            {docInfo.about}
                        </p>
                    </div>
                    <p className="text-gray-500 font-medium mt-4">
                        Giá khám: <span className="text-gray-600">{Number(docInfo.fees).toLocaleString('vi-VN')} {currencySymbol}</span>
                    </p>

                </div>
            </div>

            {/* .........BOOKING SLOTS.......... */}
            <div className="sm:ml-72 sm:pl-4 mt-4 font-semibold text-gray-700">
                <p>Lịch khám</p>
                <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
                    {
                        docSlots.length > 0 && docSlots.map((item, index) => (
                            item.length > 0 && (
                                <div
                                    onClick={() => handleSlotChange(index)}
                                    className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-[#59aecd] text-white' : 'border border-gray-200'}`}
                                    key={index}
                                >
                                    <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                                    <p>{item[0] && item[0].datetime.getDate()}</p>
                                </div>
                            )
                        ))
                    }
                </div>
                <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
                    {docSlots.length > 0 && docSlots[slotIndex]?.map((item, index) => (
                        <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-[#59aecd] text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>
                <button className="bg-[#59aecd] text-white text-sm font-light px-8 py-3 rounded-full my-6">Đặt lịch khám</button>
            </div>

            {/* ........realate doctors......... */}
            <RecommendedDoctors docId={docId} speciality={docInfo.speciality}></RecommendedDoctors>

        </div>
    );
}

export default Appointment;
