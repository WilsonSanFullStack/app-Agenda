import React, { useState } from "react";
import Calendar from "react-calendar";

export const RegisterQ = () => {
  const [name, setName] = useState('')
  const handleQuincena =(event)=>{
    setName(event.target.value)
  }
  console.log(name)
  return (
    <div>
      <form className="">
        <section className="text-center text-white">
            <h1>quincena</h1>
          <section className="text-white">
            <label className="mx-2">name:</label>
            <input type="text"
            onChange={handleQuincena}
            value={name}
            className="bg-slate-500 rounded-md " />
          </section>
          <Calendar
            tileClassName={({ date, view }) => {
              if (view === "month") {
                if (date.getDay() === 0) return "sunday"; // Solo para domingos
                if (
                  (date.getDay() === 6) |
                  (date.getDay() === 5) |
                  (date.getDay() === 4) |
                  (date.getDay() === 3) |
                  (date.getDay() === 2) |
                  (date.getDay() === 1)
                )
                  return "week"; // Si quieres estilizar los sábados aparte
              }
              return null;
            }}
          />
        </section>
      </form>
    </div>
  );
};
