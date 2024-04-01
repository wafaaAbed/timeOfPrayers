/* eslint-disable no-unused-vars */
/* eslint-disable no-const-assign */
import { useEffect, useState } from "react";
import "./App.css";
import "./Header.css";
// sound od Athan
import athanSound from "../public/athanSound.mp3"; 
// Hook of sound effects
import useSound from "use-sound";
// This is Data from DAta.js file
import { country, prayerArray, ParyerTimes } from "./assets/data";
import Paryer from "./Component/Paryer/Paryer";
import axios from "axios";
//  moment.js library for timing
import moment from "moment";
import "moment/dist/locale/ar";
moment.locale("en");

function App() {
  // timeing of prayer
  const [timings, setTimings] = useState({
    Fajr: "03:10",
    Dhuhr: "13:20",
    Asr: "15:10",
    Maghrib: "18:10",
    Isha: "20:80",
  });
  // to select the city
  const [city, setCity] = useState("Amman");
  const [arabicName, setarabicName] = useState("Amman");
  // to select detials of time 
  const [today, setToday] = useState({
    year: "0",
    today: "0",
  });
  // to determaine the next prayer
  const [nextPrayer, setnextPrayer] = useState(0);

// to count the remaning Time to start the next prayer
  const [remaningTime, setremaningTime] = useState("");

  // function to get the prayer time(Api) 
  const getTiming = async () => {
    const data = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=JO&city=${city}`
    );
    // set prayer time in timing useState
    setTimings(data.data.data.timings);
  };

  useEffect(() => {
    // this Interval time to count the time every secound
    let interval = setInterval(() => {
      setCountdoenTimer();
    }, 1000);
// use moment.js to get now time 
    const t = moment();
    t.locale("ar");
    setToday({
      year: t.format("dddd | hh:mm a"),
      today: t.format("LL"),
    });

    return () => {
      clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timings]);


  useEffect(() => {
    // to request function getTiming()
    getTiming();
    // to query the nume of city in Arabic Word
    const result = country.find(({ apiName }) => apiName === city);
    setarabicName(result.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  // This function to determine the name amd time of nexr prayer 
  const setCountdoenTimer = (async) => {
    //this moment.js to dertermine of time now
    const momentNow = moment();
 
    // this if condition to determine the thime now where will be in prayer time 
    let PrayerIndex = 0;
    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      PrayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      PrayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ) {

      PrayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      PrayerIndex = 4;
    } else {
      // console.log("Isha")
      PrayerIndex = 0;
    }

    // after detarmine the now time , will knowing the next prayer time and put it in  (nextPrayer)
    setnextPrayer((prev) => prayerArray[PrayerIndex].disapleName);


    const herMoment = moment();
// get the next prayer from api and convert it to moment .js
    const nextsalah = timings[prayerArray[PrayerIndex].key];
    const nextsalahMoment = moment(nextsalah, "LTS");

    // get the now time and convert it to moment
    const zoneTime = moment(herMoment, "LTS").format("hh:mm:ss a");
    const zMoment = moment(zoneTime, "LTS");
 

    // determine the hour and minute and milsecond in each virable
    const hourNow = zMoment.format("hh").toString();
    const minuteNow = zMoment.format("mm").toString();
    const milsecondeNow = zMoment.format("ss").toString();
  
    // get next salah Moment then subtract from it the hour and minute and milsecond of now time.
    nextsalahMoment.toString();
    // console.log(nextsalahMoment.format("hh"))
    nextsalahMoment.subtract({
      h:Number(hourNow),
      m: Number(minuteNow),
      s: Number(milsecondeNow),
    });

    // after subtracting will apper the remaning Time will put it in (remaningTime)
    const remaningHour =(nextsalahMoment.format("hh") === '12' ? nextsalahMoment.format("hh") -12 :  nextsalahMoment.format("hh") );
    const remaningminute = nextsalahMoment.format("mm");
    const remaningmilsecond = nextsalahMoment.format("ss");
    
  
    setremaningTime(`${remaningHour}:${remaningminute}:${remaningmilsecond}`);
    
{/* when remaning will be "00"00"00  the sound of athan will start*/}
if(remaningmilsecond === '00' && remaningHour === '00' && remaningminute === '00' ){
  play();
}  
// console.log(nextsalahMoment.format("hh"))
};
// using useSound hook to put Athan Sound when remaningTime will be "00:00:00"
  const [isChecked, setIsChecked] = useState(null);
  const [play, { pause }] = useSound(athanSound);

  return (
    <main className="main container">
      {/* Header  */}
      <header className="container header">
        <div className="timing">
          {/* Div appear the Date and time of today  */}
          <div className="timingNow timingFormat">
            <h3>{today.year}</h3>
            <p>{today.today}</p>
          </div>
          {/* appear the name of next prayer */}
          <div className="athanTime timingFormat">
            <p>
              الوقت المتبقي حتى صلاة {nextPrayer}
              <span></span>
            </p>
          {/* remaning Time for next prayer */}
            <h3>
              {remaningTime}
              
            
              {/* This button to play and stop  the sound of athan*/}
              <button
                className="soundBtn me-5"
                onClick={() => {
                  isChecked
                    ? (play(), setIsChecked(false))
                    : (pause(), setIsChecked(true));
                }}
              >
                {isChecked ? (
                  <span className="icons">▶</span>
                ) : (
                  <span className="icons">⏸</span>
                )}
              </button>
            </h3>
          </div>
        </div>
        <div className=" headerCountry">
          {/* This section to select the city */}
          <h3 className="selectSection">
            <label className="selectCountry" htmlFor="selectCountry">
              اختار المدينة
            </label>
            <select
              className="form-select"
              id="selectCountry"
              aria-label="Default select example"
              onChange={(e) => setCity(e.target.value)}
            >
              {/* get the name of citrs from  country Array saved in data.js*/}
              {country.map((el, index) => (
                <option key={index} value={el.apiName}>
                  {el.name}
                </option>
              ))}
            </select>
          </h3>
          <div className="country">
            {/* after secleted the city will appear the name of city in Arabic  */}
            <h2>المدينة: {arabicName}</h2>
          </div>
        </div>
      </header>
      {/* This component appear all prayers in cards with all details */}
      <section className="paryer">
        {ParyerTimes.map((el, index) => (
          <Paryer
            key={index}
            name={el.name}
            src={el.src}
            time={timings[el.time]}
            nextParyerclass={
              nextPrayer === el.name ? "nextParyerclass" : "null"
            }
          />
        ))}
      </section>
      
    </main>
  );
}

export default App;
